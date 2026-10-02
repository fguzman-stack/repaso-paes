import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDueSRSCards, recordAttemptAndSyncSRS } from '@/db';
import { ALL_QUESTIONS } from '@/data/questions';
import { Question } from '@/types';
import { MathRenderer } from '@/components/math/MathRenderer';
import { useUserStore } from '@/store/useUserStore';
import { Sparkles, ArrowRight, CheckCircle2, XCircle, RotateCcw, Brain, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReviewSession: React.FC = () => {
  const navigate = useNavigate();
  const { addXP, recordAnswer } = useUserStore();
  const [queue, setQueue] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<('A' | 'B' | 'C' | 'D' | 'E') | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });

  // Load SRS due cards or prioritize questions
  useEffect(() => {
    async function loadSRSQueue() {
      try {
        const dueCards = await getDueSRSCards();
        const dueIds = new Set(dueCards.map((c) => c.questionId));

        let selected = ALL_QUESTIONS.filter((q) => dueIds.has(q.id));

        // If fewer than 5 cards are due in SRS, supplement with questions to ensure a solid 5-question daily drill
        if (selected.length < 5) {
          const remaining = ALL_QUESTIONS.filter((q) => !dueIds.has(q.id));
          const shuffledRemaining = [...remaining].sort(() => 0.5 - Math.random());
          selected = [...selected, ...shuffledRemaining.slice(0, 5 - selected.length)];
        }

        setQueue(selected.slice(0, 8)); // 8 questions max per daily drill
      } catch {
        // Fallback to random 5 questions
        setQueue(ALL_QUESTIONS.slice(0, 5));
      } finally {
        setLoading(false);
        setStartTime(Date.now());
      }
    }

    loadSRSQueue();
  }, []);

  const currentQuestion = queue[currentIndex];

  const handleConfirm = async () => {
    if (!selectedOption || !currentQuestion) return;
    const isCorrect = selectedOption === currentQuestion.correcta;
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    setHasChecked(true);
    recordAnswer(isCorrect);

    if (isCorrect) {
      addXP(20); // Bonus XP for smart review
      setSessionStats((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      try {
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
      } catch {
        // safe fallback
      }
    } else {
      addXP(5);
      setSessionStats((prev) => ({ ...prev, total: prev.total + 1 }));
    }

    // Persist attempt & update SM-2 schedule in IndexedDB
    try {
      await recordAttemptAndSyncSRS({
        questionId: currentQuestion.id,
        materia: currentQuestion.materia,
        ejeId: currentQuestion.ejeId,
        habilidad: currentQuestion.habilidad,
        dificultad: currentQuestion.dificultad,
        selectedOption,
        isCorrect,
        timestamp: Date.now(),
        timeSpentSeconds: timeSpent,
        mode: 'repaso',
      });
    } catch {
      // safe fallback
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= queue.length) {
      setSessionCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasChecked(false);
      setStartTime(Date.now());
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center text-slate-500">
        <Brain className="w-8 h-8 animate-pulse text-blue-600 mx-auto mb-3" />
        <p className="text-sm font-medium">Cargando cola de repaso inteligente SM-2...</p>
      </div>
    );
  }

  if (sessionCompleted) {
    const accuracy = Math.round((sessionStats.correct / sessionStats.total) * 100);
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            ¡Repaso Diario Completado!
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            El algoritmo SM-2 ha reprogramado automáticamente tus preguntas según tu desempeño. Las que fallaste volverán antes.
          </p>

          <div className="my-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
            <div>
              <span className="block text-2xl font-bold text-slate-900 dark:text-white">
                {sessionStats.correct} / {sessionStats.total}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Aciertos</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {accuracy}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Retención Estimada</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Ir al Inicio
            </button>
            <button
              onClick={() => navigate('/materias')}
              className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Estudiar por Materia
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* SRS Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Repaso Inteligente (SM-2)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Práctica de recuperación espaciada · Pregunta {currentIndex + 1} de {queue.length}
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
          +20 XP por acierto
        </span>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {currentQuestion.materia.toUpperCase()}
          </span>
          <span>·</span>
          <span>{currentQuestion.tema}</span>
          <span>·</span>
          <span>{currentQuestion.habilidad}</span>
        </div>

        {/* Enunciado */}
        <div className="mb-6 text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
          <MathRenderer content={currentQuestion.enunciado} />
        </div>

        {/* Alternatives */}
        <div className="space-y-3">
          {currentQuestion.alternativas.map((alt) => {
            const isSelected = selectedOption === alt.id;
            const isCorrectOption = alt.id === currentQuestion.correcta;

            let style = 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40';
            if (hasChecked) {
              if (isCorrectOption) {
                style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
              } else if (isSelected) {
                style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
              } else {
                style = 'opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50';
              }
            } else if (isSelected) {
              style = 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500';
            }

            return (
              <button
                key={alt.id}
                onClick={() => !hasChecked && setSelectedOption(alt.id)}
                disabled={hasChecked}
                className={`w-full flex items-start gap-3 rounded-xl border p-4 text-left transition ${style}`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700 text-xs font-bold">
                  {alt.id}
                </span>
                <div className="flex-1 text-sm sm:text-base pt-0.5">
                  <MathRenderer content={alt.texto} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Check Button */}
        {!hasChecked && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                selectedOption
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-200 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
              }`}
            >
              <span>Verificar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Feedback step-by-step */}
        {hasChecked && (
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
            <div className="flex items-center gap-2">
              {selectedOption === currentQuestion.correcta ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                    ¡Correcto! Intervalo extendido.
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <span className="font-bold text-rose-700 dark:text-rose-400 text-sm">
                    Respuesta errónea. Reprogramada para mañana.
                  </span>
                </>
              )}
            </div>

            {/* Step-by-step resolution */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3.5 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Resolución:
              </span>
              {currentQuestion.explicacionPasoAPaso.map((p, i) => (
                <div key={i} className="text-slate-700 dark:text-slate-300">
                  <MathRenderer content={p} />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                <span>{currentIndex + 1 >= queue.length ? 'Finalizar Repaso' : 'Siguiente'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
