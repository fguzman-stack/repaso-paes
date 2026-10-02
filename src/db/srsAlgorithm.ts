/**
 * Algoritmo de Repetición Espaciada SM-2 (SuperMemo-2).
 *
 * Módulo puro, sin efectos secundarios, testeable unitariamente.
 *
 * Parámetros:
 * - quality: Calificación de 0 a 5 del rendimiento en el ítem:
 *     5: Respuesta perfecta y sin vacilación.
 *     4: Respuesta correcta tras ligera vacilación.
 *     3: Respuesta correcta con seria dificultad.
 *     2: Respuesta incorrecta, pero recordó la correcta al ver la solución.
 *     1: Respuesta incorrecta, el ítem resultaba vagamente familiar.
 *     0: Desconocimiento total / olvido completo.
 *
 * Si quality >= 3: se considera acierto y el intervalo crece según el Factor de Facilidad (EF).
 * Si quality < 3: se considera fallo y el intervalo se reinicia a 1 día (repetitionNumber = 0).
 */

export interface SRSState {
  repetitionNumber: number; // n: número de repeticiones exitosas consecutivas
  intervalDays: number; // I(n): intervalo en días hasta el próximo repaso
  easeFactor: number; // EF: factor de facilidad (mínimo 1.3, inicio estándar 2.5)
}

export interface SRSNextReview extends SRSState {
  nextReviewDate: string; // Fecha en formato YYYY-MM-DD
}

export function calculateSM2(
  quality: number,
  currentState: SRSState = { repetitionNumber: 0, intervalDays: 1, easeFactor: 2.5 },
  baseDate: Date = new Date()
): SRSNextReview {
  // Aseguramos que la calidad esté acotada entre 0 y 5
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  let { repetitionNumber, intervalDays, easeFactor } = currentState;

  // 1. Actualización del Factor de Facilidad (EF)
  // Fórmula clásica SM-2: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEF = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  // El factor de facilidad no debe caer por debajo de 1.3
  easeFactor = Math.max(1.3, Math.round(newEF * 100) / 100);

  // 2. Determinación del nuevo intervalo y repeticiones
  if (q >= 3) {
    // Éxito
    if (repetitionNumber === 0) {
      intervalDays = 1;
    } else if (repetitionNumber === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitionNumber += 1;
  } else {
    // Fallo: reinicio de la racha de repeticiones
    repetitionNumber = 0;
    intervalDays = 1;
  }

  // 3. Cálculo de la siguiente fecha
  const nextDate = new Date(baseDate.getTime());
  nextDate.setDate(nextDate.getDate() + intervalDays);
  const nextReviewDate = nextDate.toISOString().split('T')[0];

  return {
    repetitionNumber,
    intervalDays,
    easeFactor,
    nextReviewDate,
  };
}

/**
 * Convierte un resultado booleano simple a una calificación de calidad SM-2
 */
export function booleanToSM2Quality(isCorrect: boolean, timeSpentSeconds: number): number {
  if (!isCorrect) {
    return 1; // Fallo
  }
  // Si acertó rápido (< 45s para M1/M2) se premia con 5, si no con 4
  if (timeSpentSeconds <= 45) {
    return 5;
  }
  return 4;
}
