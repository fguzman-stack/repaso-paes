import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/store/useQuizStore';
import { useUserStore } from '@/store/useUserStore';
import { MathRenderer } from '@/components/math/MathRenderer';
import { SUBJECTS } from '@/data/subjects';
import { Bookmark, ArrowRight, CheckCircle2, XCircle, AlertCircle, ArrowLeft, Sprout, Target, Flame, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizSession: React.FC = () => {
  const navigate = useNavigate();
  const {
    questions,
    currentIndex,
    selectedOption,
    hasSubmittedCurrent,
    answers,
    isCompleted,
    mode,
    subjectId,
    selectOption,
    confirmAnswer,
    nextQuestion,
  } = useQuizStore();

  const { isBookmarked, toggleBookmark, addXP, recordAnswer } = useUserStore();

  const currentQuestion = questions[currentIndex];
  const subjectConfig = subjectId !== 'mixed' ? SUBJECTS[subjectId] : null;

  // Keyboard shortcut listener for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted || !currentQuestion) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D', 'E'].includes(key) && !hasSubmittedCurrent) {
        selectOption(key as 'A' | 'B' | 'C' | 'D' | 'E');
      } else if (e.key === 'Enter') {
        if (!hasSubmittedCurrent && selectedOption) {
          handleConfirm();
        } else if (hasSubmittedCurrent) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, hasSubmittedCurrent, selectedOption, isCompleted]);

  if (!currentQuestion) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">No hay sesión activa</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Selecciona una materia o eje para comenzar un quiz.</p>
        <button
          onClick={() => navigate('/materias')}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Explorar Materias
        </button>
      </div>
    );
  }

  const currentAttempt = answers[currentIndex];
  const isAnswerCorrect = selectedOption === currentQuestion.correcta;
  const bookmarked = isBookmarked(currentQuestion.id);

  const handleConfirm = () => {
    if (!selectedOption) return;
    confirmAnswer();

    const isCorrect = selectedOption === currentQuestion.correcta;
    recordAnswer(isCorrect);

    if (isCorrect) {
      addXP(15);
      // Subtle micro-confetti on correct answer
      try {
        confetti({
          particleCount: 20,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#2563eb', '#10b981', '#3b82f6'],
        });
      } catch {
        // Safe fallback
      }
    } else {
      addXP(3); // Small encouragement XP for effort
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      nextQuestion();
      navigate('/quiz/resultado');
    } else {
      nextQuestion();
    }
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-4 sm:py-8">
      {/* Quiz Header Bar */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition py-1 px-1.5 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px] sm:max-w-none">
            {subjectConfig ? subjectConfig.shortName : 'Práctica General'}
          </span>
          <span>·</span>
          <span>Pregunta {currentIndex + 1} de {questions.length}</span>
        </div>

        <button
          onClick={() => toggleBookmark(currentQuestion.id)}
          className={`p-2 rounded-lg transition-colors ${
            bookmarked
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
          }`}
          title={bookmarked ? 'Pregunta guardada' : 'Guardar pregunta para repasar'}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-5 sm:mb-6">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Progreso del Quiz</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white p-4 sm:p-8 shadow-xs dark:bg-slate-900/90">
        {/* Metadata info */}
        <div className="mb-3.5 sm:mb-4 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
          <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full font-black text-[10px] sm:text-[11px] shadow-2xs ${
            currentQuestion.dificultad === 1
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/80'
              : currentQuestion.dificultad === 2
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300/80'
              : currentQuestion.dificultad === 3
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/80'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300/80'
          }`}>
            {currentQuestion.dificultad === 1 && <Sprout className="w-3.5 h-3.5" />}
            {currentQuestion.dificultad === 2 && <Target className="w-3.5 h-3.5" />}
            {currentQuestion.dificultad === 3 && <Flame className="w-3.5 h-3.5 text-amber-600" />}
            {currentQuestion.dificultad === 4 && <Crown className="w-3.5 h-3.5 text-purple-600" />}
            <span>
              {currentQuestion.dificultad === 1
                ? 'Nivel Fácil'
                : currentQuestion.dificultad === 2
                ? 'Nivel Normal'
                : currentQuestion.dificultad === 3
                ? 'Nivel Difícil'
                : 'Nivel Extremo'}
            </span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">{currentQuestion.tema}</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
          <span className="hidden sm:inline text-slate-500 text-[11px] sm:text-xs">Habilidad: {currentQuestion.habilidad}</span>
        </div>

        {/* Reading passage textBase if present */}
        {currentQuestion.textoBase && (
          <div className="mb-5 sm:mb-6 rounded-xl border-l-4 border-emerald-500 bg-emerald-50/50 p-3.5 sm:p-4 text-xs sm:text-sm text-slate-800 dark:bg-emerald-950/20 dark:text-slate-200 leading-relaxed max-h-56 sm:max-h-72 overflow-y-auto">
            <span className="block font-bold text-emerald-800 dark:text-emerald-400 mb-1.5">Texto de Lectura:</span>
            <MathRenderer content={currentQuestion.textoBase} />
          </div>
        )}

        {/* Enunciado */}
        <div className="mb-5 sm:mb-6 text-sm sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
          <MathRenderer content={currentQuestion.enunciado} />
        </div>

        {/* Alternatives List */}
        <div className="space-y-2.5 sm:space-y-3">
          {currentQuestion.alternativas.map((alt) => {
            const isSelected = selectedOption === alt.id;
            const isCorrectOption = alt.id === currentQuestion.correcta;

            let buttonStyles = 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-400 dark:hover:border-slate-600';

            if (hasSubmittedCurrent && mode === 'quiz') {
              if (isCorrectOption) {
                buttonStyles = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrectOption) {
                buttonStyles = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
              } else {
                buttonStyles = 'opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900';
              }
            } else if (isSelected) {
              buttonStyles = 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500';
            }

            return (
              <button
                key={alt.id}
                onClick={() => selectOption(alt.id)}
                disabled={hasSubmittedCurrent && mode === 'quiz'}
                className={`w-full flex items-start gap-2.5 sm:gap-3.5 rounded-xl border p-3 sm:p-4 text-left transition-all text-xs sm:text-base min-h-[48px] ${buttonStyles}`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                    hasSubmittedCurrent && mode === 'quiz' && isCorrectOption
                      ? 'bg-emerald-600 text-white'
                      : hasSubmittedCurrent && mode === 'quiz' && isSelected && !isCorrectOption
                      ? 'bg-rose-600 text-white'
                      : isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {alt.id}
                </span>
                <div className="flex-1 pt-0.5">
                  <MathRenderer content={alt.texto} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button: Confirm Answer */}
        {!hasSubmittedCurrent && (
          <div className="mt-5 sm:mt-6 flex justify-end">
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className={`w-full sm:w-auto justify-center flex items-center gap-2 rounded-xl px-6 py-3.5 sm:py-3 text-sm font-black shadow-xs transition active:scale-95 ${
                selectedOption
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>Comprobar respuesta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Immediate Step-by-Step Feedback Panel */}
        {hasSubmittedCurrent && mode === 'quiz' && (
          <div className="mt-6 sm:mt-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 p-4 sm:p-5 space-y-3.5 sm:space-y-4 animate-in fade-in duration-200">
            {/* Header badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isAnswerCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm">¡Correcto! (+15 XP)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span className="font-bold text-rose-800 dark:text-rose-300 text-xs sm:text-sm">Incorrecta (+3 XP por intento)</span>
                  </>
                )}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Correcta: <strong>{currentQuestion.correcta}</strong>
              </span>
            </div>

            {/* If incorrect, analyze the specific selected distractor */}
            {!isAnswerCorrect && selectedOption && (
              <div className="rounded-lg bg-rose-50/80 p-3 sm:p-3.5 text-xs text-rose-900 dark:bg-rose-950/30 dark:text-rose-200 border border-rose-200 dark:border-rose-900/50">
                <div className="flex items-center gap-1.5 font-semibold mb-1">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>¿Por qué marcaste la opción {selectedOption}?</span>
                </div>
                <p className="leading-relaxed">
                  {currentQuestion.alternativas.find((a) => a.id === selectedOption)?.explicacionDistractor ||
                    'Este distractor proviene de un error común de cálculo o de concepto en el desarrollo.'}
                </p>
              </div>
            )}

            {/* Step-by-step resolution */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Resolución paso a paso verificada:
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {currentQuestion.explicacionPasoAPaso.map((paso, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <MathRenderer content={paso} className="inline" />
                  </li>
                ))}
              </ol>
            </div>

            {/* Next question button */}
            <div className="pt-2 sm:pt-3 flex justify-end">
              <button
                onClick={handleNext}
                className="w-full sm:w-auto justify-center flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3.5 sm:py-2.5 text-sm font-black text-white transition shadow-xs active:scale-95"
              >
                <span>{currentIndex + 1 >= questions.length ? 'Ver Resultados' : 'Siguiente Pregunta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
