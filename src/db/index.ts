import Dexie, { type EntityTable } from 'dexie';
import { SubjectId, QuestionAttempt, SRSCard } from '@/types';
import { calculateSM2, booleanToSM2Quality } from './srsAlgorithm';

export interface DBAttempt extends QuestionAttempt {
  id?: number;
}

export interface DBSimulacroResult {
  id?: number;
  materia: SubjectId | 'general';
  puntajeEstimado: number;
  porcentajeAciertos: number;
  correctas: number;
  total: number;
  duracionSegundos: number;
  timestamp: number;
}

// Extensión tipada de Dexie
export const db = new Dexie('PaesTrainerDB') as Dexie & {
  attempts: EntityTable<DBAttempt, 'id'>;
  srsCards: EntityTable<SRSCard, 'questionId'>;
  simulacros: EntityTable<DBSimulacroResult, 'id'>;
};

// Definición de esquema e índices
db.version(1).stores({
  attempts: '++id, questionId, materia, ejeId, isCorrect, timestamp',
  srsCards: 'questionId, materia, ejeId, nextReviewDate, repetitionNumber',
  simulacros: '++id, materia, timestamp, puntajeEstimado',
});

/**
 * Registra un intento de respuesta y actualiza la tarjeta SM-2 correspondiente
 */
export async function recordAttemptAndSyncSRS(
  attempt: Omit<QuestionAttempt, 'id'>
): Promise<void> {
  // 1. Guardar intento en la tabla de historial
  await db.attempts.add(attempt);

  // 2. Obtener tarjeta SRS previa si existe
  const existingCard = await db.srsCards.get(attempt.questionId);
  const currentState = existingCard
    ? {
        repetitionNumber: existingCard.repetitionNumber,
        intervalDays: existingCard.intervalDays,
        easeFactor: existingCard.easeFactor,
      }
    : { repetitionNumber: 0, intervalDays: 1, easeFactor: 2.5 };

  // 3. Calcular nueva programación SM-2
  const quality = booleanToSM2Quality(attempt.isCorrect, attempt.timeSpentSeconds);
  const nextReview = calculateSM2(quality, currentState);

  const updatedCard: SRSCard = {
    questionId: attempt.questionId,
    materia: attempt.materia,
    ejeId: attempt.ejeId,
    repetitionNumber: nextReview.repetitionNumber,
    intervalDays: nextReview.intervalDays,
    easeFactor: nextReview.easeFactor,
    nextReviewDate: nextReview.nextReviewDate,
    lastReviewedDate: new Date().toISOString().split('T')[0],
    consecutiveSuccesses: attempt.isCorrect
      ? (existingCard?.consecutiveSuccesses || 0) + 1
      : 0,
    totalAttempts: (existingCard?.totalAttempts || 0) + 1,
    totalErrors: (existingCard?.totalErrors || 0) + (attempt.isCorrect ? 0 : 1),
  };

  await db.srsCards.put(updatedCard);
}

/**
 * Retorna las preguntas pendientes de repetición espaciada para el día de hoy o anteriores
 */
export async function getDueSRSCards(subjectId?: SubjectId): Promise<SRSCard[]> {
  const todayStr = new Date().toISOString().split('T')[0];
  let collection = db.srsCards.where('nextReviewDate').belowOrEqual(todayStr);

  const cards = await collection.toArray();
  if (subjectId) {
    return cards.filter((c) => c.materia === subjectId);
  }
  return cards;
}

/**
 * Calcula el porcentaje de dominio empírico por materia y eje basado en el historial real
 */
export async function getSubjectMasteryStats(subjectId: SubjectId): Promise<{
  totalAttempts: number;
  correctAttempts: number;
  masteryPercentage: number;
  ejeMastery: Record<string, { total: number; correct: number; percentage: number }>;
}> {
  const attempts = await db.attempts.where('materia').equals(subjectId).toArray();
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      correctAttempts: 0,
      masteryPercentage: 0,
      ejeMastery: {},
    };
  }

  const total = attempts.length;
  const correct = attempts.filter((a) => a.isCorrect).length;
  const masteryPercentage = Math.round((correct / total) * 100);

  const ejeMastery: Record<string, { total: number; correct: number; percentage: number }> = {};
  attempts.forEach((a) => {
    if (!ejeMastery[a.ejeId]) {
      ejeMastery[a.ejeId] = { total: 0, correct: 0, percentage: 0 };
    }
    ejeMastery[a.ejeId].total += 1;
    if (a.isCorrect) ejeMastery[a.ejeId].correct += 1;
  });

  Object.keys(ejeMastery).forEach((ejeId) => {
    const item = ejeMastery[ejeId];
    item.percentage = Math.round((item.correct / item.total) * 100);
  });

  return {
    totalAttempts: total,
    correctAttempts: correct,
    masteryPercentage,
    ejeMastery,
  };
}

/**
 * Exporta toda la base de datos a un archivo JSON para backup
 */
export async function exportDatabaseJSON(): Promise<string> {
  const [attempts, srsCards, simulacros] = await Promise.all([
    db.attempts.toArray(),
    db.srsCards.toArray(),
    db.simulacros.toArray(),
  ]);

  const payload = {
    version: 1,
    exportDate: new Date().toISOString(),
    attempts,
    srsCards,
    simulacros,
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Importa los datos desde un archivo JSON
 */
export async function importDatabaseJSON(jsonContent: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonContent);
    if (!Array.isArray(parsed.attempts) || !Array.isArray(parsed.srsCards)) {
      return false;
    }

    await db.transaction('rw', [db.attempts, db.srsCards, db.simulacros], async () => {
      await db.attempts.clear();
      await db.srsCards.clear();
      await db.simulacros.clear();

      await db.attempts.bulkAdd(parsed.attempts);
      await db.srsCards.bulkAdd(parsed.srsCards);
      if (Array.isArray(parsed.simulacros)) {
        await db.simulacros.bulkAdd(parsed.simulacros);
      }
    });

    return true;
  } catch {
    return false;
  }
}
