import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ERROR_CASES } from '@/data/games';
import { MathRenderer } from '@/components/math/MathRenderer';
import { useUserStore } from '@/store/useUserStore';
import { ArrowLeft, Search, CheckCircle2, XCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ErrorDetectiveGame: React.FC = () => {
  const navigate = useNavigate();
  const { addXP, recordAnswer } = useUserStore();

  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentCase = ERROR_CASES[currentCaseIndex % ERROR_CASES.length];
  const actualErrorStep = currentCase.pasos.find((p) => p.tieneError)?.numero || 0; // 0 if none

  const handleVerify = () => {
    if (selectedStep === null) return;
    setHasSubmitted(true);

    const isCorrect = selectedStep === actualErrorStep;
    recordAnswer(isCorrect);

    if (isCorrect) {
      addXP(30);
      try {
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
      } catch {
        // safe fallback
      }
    } else {
      addXP(5);
    }
  };

  const handleNext = () => {
    setSelectedStep(null);
    setHasSubmitted(false);
    setCurrentCaseIndex((prev) => prev + 1);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/juegos')}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Juegos</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <Search className="w-4 h-4" />
          <span>Detective de Errores (M1 / M2)</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Caso #{currentCaseIndex + 1}
        </div>
        <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
          Encuentra el paso donde se cometió el error:
        </h2>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-sm font-medium mb-6">
          <MathRenderer content={currentCase.problema} />
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {currentCase.pasos.map((paso) => {
            const isSelected = selectedStep === paso.numero;
            let borderClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20';

            if (hasSubmitted) {
              if (paso.tieneError) {
                borderClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30';
              } else if (isSelected && !paso.tieneError) {
                borderClass = 'border-rose-400 bg-rose-50 dark:bg-rose-950/30';
              }
            } else if (isSelected) {
              borderClass = 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 ring-2 ring-indigo-500';
            }

            return (
              <button
                key={paso.numero}
                onClick={() => !hasSubmitted && setSelectedStep(paso.numero)}
                className={`w-full flex items-start gap-3 rounded-xl border p-4 text-left transition ${borderClass}`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  P{paso.numero}
                </span>
                <div className="flex-1 text-sm">
                  <MathRenderer content={paso.contenido} />
                  {hasSubmitted && (
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 italic border-t border-slate-200/50 dark:border-slate-700/50 pt-1.5">
                      {paso.explicacion}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          {!hasSubmitted ? (
            <button
              onClick={handleVerify}
              disabled={selectedStep === null}
              className={`rounded-xl px-5 py-2.5 text-xs font-semibold transition ${
                selectedStep !== null
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-200 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
              }`}
            >
              Comprobar Detective
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Siguiente Caso
            </button>
          )}
        </div>

        {hasSubmitted && (
          <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Conclusión Pedagógica:
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {currentCase.conclusionFinal}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
