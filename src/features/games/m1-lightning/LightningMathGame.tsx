import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LIGHTNING_QUESTIONS, LightningQuestion } from '@/data/games';
import { MathRenderer } from '@/components/math/MathRenderer';
import { useUserStore } from '@/store/useUserStore';
import { Zap, Timer, ArrowLeft, RotateCcw, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LightningMathGame: React.FC = () => {
  const navigate = useNavigate();
  const { addXP, recordAnswer } = useUserStore();

  const [questions, setQuestions] = useState<LightningQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const startGame = () => {
    const shuffled = [...LIGHTNING_QUESTIONS].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    setIndex(0);
    setScore(0);
    setCombo(0);
    setSecondsRemaining(60);
    setIsPlaying(true);
    setIsGameOver(false);
    setFeedback(null);
  };

  useEffect(() => {
    if (!isPlaying || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, secondsRemaining]);

  const currentQ = questions[index % questions.length];

  const handleAnswer = (option: string) => {
    if (!isPlaying || !currentQ || feedback) return;

    const isCorrect = option === currentQ.correcta;
    recordAnswer(isCorrect);

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = 10 + Math.min(newCombo * 2, 10);
      setScore((s) => s + points);
      addXP(5);
      setFeedback({ isCorrect: true, text: `¡Bien! +${points} pts` });
    } else {
      setCombo(0);
      setFeedback({ isCorrect: false, text: currentQ.explicacion });
    }

    setTimeout(() => {
      setFeedback(null);
      setIndex((i) => i + 1);
    }, 900);
  };

  useEffect(() => {
    if (isGameOver && score > 0) {
      try {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      } catch {
        // safe fallback
      }
    }
  }, [isGameOver, score]);

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/juegos')}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Juegos</span>
        </button>

        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Cálculo Relámpago (M1)
          </span>
        </div>
      </div>

      {!isPlaying && !isGameOver ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 mb-4">
            <Zap className="w-8 h-8 fill-amber-500 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Cálculo Relámpago
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Responde tantas operaciones matemáticas y preguntas de álgebra como puedas en 60 segundos. Entrena tu rapidez de cálculo y mantén el combo.
          </p>

          <button
            onClick={startGame}
            className="mt-6 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-md active:scale-95"
          >
            Comenzar Reto (60s)
          </button>
        </div>
      ) : isGameOver ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            ¡Tiempo agotado!
          </h2>
          <div className="my-6">
            <span className="text-6xl font-black text-blue-600 dark:text-blue-400 font-display">
              {score}
            </span>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Puntos obtenidos
            </span>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={startGame}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar de Nuevo</span>
            </button>
            <button
              onClick={() => navigate('/juegos')}
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Salir
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Game Stats bar */}
          <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-xs font-bold">
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{secondsRemaining}s</span>
            </div>

            <div className="text-blue-600 dark:text-blue-400 font-display text-sm">
              Puntaje: {score}
            </div>

            {combo > 1 && (
              <div className="text-amber-500 font-bold flex items-center gap-1 animate-bounce">
                <Zap className="w-3.5 h-3.5 fill-amber-500" />
                <span>x{combo} Combo!</span>
              </div>
            )}
          </div>

          {/* Question Card */}
          {currentQ && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs text-center">
              <div className="min-h-[70px] flex items-center justify-center text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                <MathRenderer content={currentQ.enunciado} />
              </div>

              {/* Options grid */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {currentQ.opciones.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!feedback}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-3.5 text-base font-semibold hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Immediate feedback overlay banner */}
              {feedback && (
                <div
                  className={`mt-4 rounded-xl p-2.5 text-xs font-bold flex items-center justify-center gap-1.5 ${
                    feedback.isCorrect
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {feedback.isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>{feedback.text}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
