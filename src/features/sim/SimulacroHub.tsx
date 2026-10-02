import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SUBJECT_LIST } from '@/data/subjects';
import { Timer, ArrowRight, ShieldAlert, Award } from 'lucide-react';

export const SimulacroHub: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
          <Timer className="w-4 h-4" />
          <span>Modo Examen</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Ensayos y Simulacros PAES
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Entrena bajo condiciones reales de evaluación: temporizador activo, sin retroalimentación hasta entregar y estimación de puntaje PAES en escala 100 - 1.000.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SUBJECT_LIST.map((sub) => {
          return (
            <div
              key={sub.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-blue-500/50 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${sub.badgeBg}`}>
                    {sub.shortName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {sub.duracionMinutos} min oficiales
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {sub.nombre}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {sub.descripcion}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Simulacro ágil · 15 preguntas</span>
                <button
                  onClick={() => navigate(`/simulacro/${sub.id}`)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                >
                  <span>Iniciar Ensayo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Disclaimer Note */}
      <div className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 text-xs text-slate-500 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300 block">
            Aviso de Transparencia Metodológica:
          </span>
          <p>
            Los puntajes simulados se calculan mediante un modelo de calibración proporcional aproximado sobre la escala 100 a 1.000 puntos. Los resultados son estrictamente de carácter formativo y predictivo referencial.
          </p>
        </div>
      </div>
    </div>
  );
};
