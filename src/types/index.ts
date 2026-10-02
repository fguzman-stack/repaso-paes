export type SubjectId =
  | 'lectora'
  | 'm1'
  | 'm2'
  | 'historia'
  | 'biologia'
  | 'fisica'
  | 'quimica'
  | 'tp';

export type NivelDificultad = 'facil' | 'normal' | 'dificil' | 'extremo';

export type HabilidadCognitiva =
  | 'Resolver problemas'
  | 'Modelar'
  | 'Representar'
  | 'Argumentar'
  | 'Argumentar y comunicar'
  | 'Localizar'
  | 'Interpretar'
  | 'Interpretar y relacionar'
  | 'Evaluar y reflexionar'
  | 'Evaluar';

export interface Alternative {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  texto: string;
  explicacionDistractor?: string; // Análisis del error específico que genera este distractor
}

export interface Question {
  id: string;
  materia: SubjectId;
  ejeId: string;
  tema: string;
  dificultad: 1 | 2 | 3 | 4; // 1: Fácil, 2: Normal, 3: Difícil, 4: Extremo
  nivel?: NivelDificultad;
  enunciado: string;
  textoBase?: string; // Para comprensión lectora o fuentes históricas
  alternativas: Alternative[];
  correcta: 'A' | 'B' | 'C' | 'D' | 'E';
  explicacionPasoAPaso: string[];
  habilidad: HabilidadCognitiva;
  origen: 'Pregunta original, basada en el temario' | 'Pregunta original, basada en el temario oficial DEMRE PAES';
  tags: string[];
  revisar?: boolean;
}

export function getQuestionNivel(q: Question): NivelDificultad {
  if (q.nivel) return q.nivel;
  if (q.dificultad === 1) return 'facil';
  if (q.dificultad === 2) return 'normal';
  if (q.dificultad === 3) return 'dificil';
  return 'extremo';
}

export interface EjeTematico {
  id: string;
  nombre: string;
  descripcion: string;
  habilidadesPrincipales: HabilidadCognitiva[];
}

export interface SubjectConfig {
  id: SubjectId;
  nombre: string;
  shortName: string;
  descripcion: string;
  colorName: string;
  accentHex: string;
  badgeBg: string;
  badgeText: string;
  cardBorder: string;
  iconName: string;
  duracionMinutos: number;
  preguntasEnsayoOficial: number;
  ejes: EjeTematico[];
}

// SM-2 Spaced Repetition Card State
export interface SRSCard {
  questionId: string;
  materia: SubjectId;
  ejeId: string;
  repetitionNumber: number; // n
  intervalDays: number; // I(n)
  easeFactor: number; // EF (default 2.5)
  nextReviewDate: string; // ISO date string YYYY-MM-DD
  lastReviewedDate?: string;
  consecutiveSuccesses: number;
  totalAttempts: number;
  totalErrors: number;
}

// User attempt record for analytics
export interface QuestionAttempt {
  id?: number;
  questionId: string;
  materia: SubjectId;
  ejeId: string;
  habilidad: HabilidadCognitiva;
  dificultad: 1 | 2 | 3 | 4;
  selectedOption: 'A' | 'B' | 'C' | 'D' | 'E';
  isCorrect: boolean;
  timestamp: number;
  timeSpentSeconds: number;
  mode: 'quiz' | 'simulacro' | 'repaso' | 'juego';
}

// Flashcard
export interface Flashcard {
  id: string;
  materia: SubjectId;
  ejeId: string;
  concepto: string;
  definicionOFormula: string;
  ejemplo?: string;
  dificultad: 1 | 2 | 3 | 4;
}
