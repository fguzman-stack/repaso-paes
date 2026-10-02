import { Question, SubjectId, NivelDificultad, getQuestionNivel } from '@/types';
import { M1_QUESTIONS } from './m1.data';
import { LECTORA_QUESTIONS } from './lectora.data';
import { M2_QUESTIONS } from './m2.data';
import { HISTORIA_QUESTIONS } from './historia.data';
import { CIENCIAS_QUESTIONS } from './ciencias.data';
import { TP_QUESTIONS } from './tp.data';

// Aggregated questions repository
export const ALL_QUESTIONS: Question[] = [
  ...M1_QUESTIONS,
  ...LECTORA_QUESTIONS,
  ...M2_QUESTIONS,
  ...HISTORIA_QUESTIONS,
  ...CIENCIAS_QUESTIONS,
  ...TP_QUESTIONS,
];

// Helper functions for question querying and sampling
export function getQuestionsBySubject(subjectId: SubjectId): Question[] {
  return ALL_QUESTIONS.filter((q) => q.materia === subjectId);
}

export function getQuestionsByEje(ejeId: string): Question[] {
  return ALL_QUESTIONS.filter((q) => q.ejeId === ejeId);
}

export function getQuestionsByNivel(nivel: NivelDificultad, subjectId?: SubjectId): Question[] {
  return ALL_QUESTIONS.filter((q) => {
    const matchNivel = getQuestionNivel(q) === nivel;
    return subjectId ? matchNivel && q.materia === subjectId : matchNivel;
  });
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const set = new Set(ids);
  return ALL_QUESTIONS.filter((q) => set.has(q.id));
}

export function getRandomQuestions(options: {
  subjectId?: SubjectId;
  ejeId?: string;
  count?: number;
  dificultad?: 1 | 2 | 3 | 4;
  nivel?: NivelDificultad;
}): Question[] {
  let pool = ALL_QUESTIONS;

  if (options.subjectId) {
    pool = pool.filter((q) => q.materia === options.subjectId);
  }
  if (options.ejeId) {
    pool = pool.filter((q) => q.ejeId === options.ejeId);
  }
  if (options.dificultad) {
    pool = pool.filter((q) => q.dificultad === options.dificultad);
  }
  if (options.nivel) {
    pool = pool.filter((q) => getQuestionNivel(q) === options.nivel);
  }

  // Shuffle array (Fisher-Yates)
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const count = options.count !== undefined ? options.count : 15;
  return shuffled.slice(0, count);
}
