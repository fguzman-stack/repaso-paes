import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIMELINE_CHALLENGES, TimelineEvent } from '@/data/games';
import { useUserStore } from '@/store/useUserStore';
import { ArrowLeft, ArrowUp, ArrowDown, CheckCircle2, RotateCcw, Calendar, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TimelineGame: React.FC = () => {
  const navigate = useNavigate();
  const { addXP, recordAnswer } = useUserStore();

  const challenge = TIMELINE_CHALLENGES[0];

  // Shuffle initial events
  const [events, setEvents] = useState<TimelineEvent[]>(() => {
    return [...challenge.eventos].sort(() => 0.5 - Math.random());
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPerfect, setIsPerfect] = useState(false);

  const moveUp = (idx: number) => {
    if (idx === 0 || isSubmitted) return;
    const copy = [...events];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;
    setEvents(copy);
  };

  const moveDown = (idx: number) => {
    if (idx === events.length - 1 || isSubmitted) return;
    const copy = [...events];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;
    setEvents(copy);
  };

  const handleVerify = () => {
    // Check if sorted chronologically
    let sorted = true;
    for (let i = 0; i < events.length - 1; i++) {
      if (events[i].año > events[i + 1].año) {
        sorted = false;
        break;
      }
    }

    setIsSubmitted(true);
    setIsPerfect(sorted);
    recordAnswer(sorted);

    if (sorted) {
      addXP(50);
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch {
        // safe fallback
      }
    } else {
      addXP(10);
    }
  };

  const handleRestart = () => {
    setEvents([...challenge.eventos].sort(() => 0.5 - Math.random()));
    setIsSubmitted(false);
    setIsPerfect(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/juegos')}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Juegos</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
          <Calendar className="w-4 h-4" />
          <span>Línea de Tiempo (Historia)</span>
        </div>
      </div>

      {/* Challenge Description */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs mb-6">
        <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
          {challenge.titulo}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Periodo: {challenge.periodo} · Ordena los siguientes hitos de más antiguo a más reciente utilizando las flechas.
        </p>

        {/* Ordered Event Cards List */}
        <div className="mt-6 space-y-3">
          {events.map((ev, idx) => {
            const correctOrderIndex = challenge.eventos.findIndex((e) => e.id === ev.id);
            const isInCorrectPosition = idx === correctOrderIndex;

            return (
              <div
                key={ev.id}
                className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                  isSubmitted
                    ? isInCorrectPosition
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30'
                      : 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3 pr-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {ev.hito}
                      </span>
                      {isSubmitted && (
                        <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                          ({ev.año})
                        </span>
                      )}
                    </div>
                    {isSubmitted && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {ev.descripcion}
                      </p>
                    )}
                  </div>
                </div>

                {/* Move buttons */}
                {!isSubmitted && (
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === events.length - 1}
                      className="p-1 rounded-md text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          {!isSubmitted ? (
            <button
              onClick={handleVerify}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verificar Orden Cronológico</span>
            </button>
          ) : (
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reintentar Reto</span>
            </button>
          )}
        </div>

        {/* Outcome banner */}
        {isSubmitted && (
          <div
            className={`mt-4 rounded-xl p-4 text-xs font-semibold flex items-center gap-2 ${
              isPerfect
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}
          >
            <Award className="w-5 h-5 shrink-0" />
            <div>
              {isPerfect
                ? '¡Extraordinario! Ordenaste todos los hitos históricos con precisión exacta (+50 XP).'
                : 'Revisa las fechas reveladas para consolidar la secuencia cronológica de este periodo histórico.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
