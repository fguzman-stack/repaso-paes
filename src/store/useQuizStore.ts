import { create } from 'zustand';
import { Question, SubjectId } from '@/types';

export interface QuizAttemptAnswer {
  question: Question;
  selectedOption: 'A' | 'B' | 'C' | 'D' | 'E';
  isCorrect: boolean;
  timeSpentSeconds: number;
}

interface QuizState {
  subjectId: SubjectId | 'mixed';
  mode: 'quiz' | 'simulacro' | 'repaso';
  questions: Question[];
  currentIndex: number;
  selectedOption: ('A' | 'B' | 'C' | 'D' | 'E') | null;
  hasSubmittedCurrent: boolean;
  answers: QuizAttemptAnswer[];
  isCompleted: boolean;
  startTime: number;
  currentQuestionStartTime: number;

  // Actions
  startQuiz: (questions: Question[], subjectId: SubjectId | 'mixed', mode?: 'quiz' | 'simulacro' | 'repaso') => void;
  selectOption: (option: 'A' | 'B' | 'C' | 'D' | 'E') => void;
  confirmAnswer: () => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  subjectId: 'm1',
  mode: 'quiz',
  questions: [],
  currentIndex: 0,
  selectedOption: null,
  hasSubmittedCurrent: false,
  answers: [],
  isCompleted: false,
  startTime: Date.now(),
  currentQuestionStartTime: Date.now(),

  startQuiz: (questions, subjectId, mode = 'quiz') => {
    const now = Date.now();
    set({
      subjectId,
      mode,
      questions,
      currentIndex: 0,
      selectedOption: null,
      hasSubmittedCurrent: false,
      answers: [],
      isCompleted: false,
      startTime: now,
      currentQuestionStartTime: now,
    });
  },

  selectOption: (option) => {
    // Prevent changing answer if already confirmed in 'quiz' mode
    if (get().hasSubmittedCurrent && get().mode === 'quiz') return;
    set({ selectedOption: option });
  },

  confirmAnswer: () => {
    const { questions, currentIndex, selectedOption, answers, currentQuestionStartTime, mode } = get();
    if (!selectedOption) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correcta;
    const timeSpent = Math.max(1, Math.round((Date.now() - currentQuestionStartTime) / 1000));

    const updatedAnswers = [
      ...answers,
      {
        question: currentQuestion,
        selectedOption,
        isCorrect,
        timeSpentSeconds: timeSpent,
      },
    ];

    if (mode === 'simulacro') {
      // In simulacro, immediately move to next without showing step-by-step
      const nextIdx = currentIndex + 1;
      const isDone = nextIdx >= questions.length;
      set({
        answers: updatedAnswers,
        currentIndex: isDone ? currentIndex : nextIdx,
        selectedOption: null,
        hasSubmittedCurrent: false,
        isCompleted: isDone,
        currentQuestionStartTime: Date.now(),
      });
    } else {
      // In quiz / repaso mode, mark current question as checked so feedback is displayed
      set({
        hasSubmittedCurrent: true,
        answers: updatedAnswers,
      });
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    const nextIdx = currentIndex + 1;
    if (nextIdx >= questions.length) {
      set({ isCompleted: true });
    } else {
      set({
        currentIndex: nextIdx,
        selectedOption: null,
        hasSubmittedCurrent: false,
        currentQuestionStartTime: Date.now(),
      });
    }
  },

  resetQuiz: () => {
    set({
      questions: [],
      currentIndex: 0,
      selectedOption: null,
      hasSubmittedCurrent: false,
      answers: [],
      isCompleted: false,
    });
  },
}));
