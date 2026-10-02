import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SUBJECT_LIST } from '@/data/subjects';
import { Layers, ArrowRight, BookOpen, Calculator, Sparkles, Filter } from 'lucide-react';

export const SubjectsCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'obligatorias' | 'electivas'>('all');

  const filteredSubjects = SUBJECT_LIST.filter((sub) => {
    if (filter === 'obligatorias') {
      return sub.id === 'm1' || sub.id === 'lectora';
    }
    if (filter === 'electivas') {
      return sub.id !== 'm1' && sub.id !== 'lectora';
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>Temario Oficial DEMRE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Materias PAES
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Selecciona una prueba para estudiar sus ejes temáticos, practicar quizzes o simular ensayos.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Todas ({SUBJECT_LIST.length})
          </button>
          <button
            onClick={() => setFilter('obligatorias')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'obligatorias'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Obligatorias (2)
          </button>
          <button
            onClick={() => setFilter('electivas')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'electivas'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Electivas (6)
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map((sub) => {
          return (
            <div
              key={sub.id}
              onClick={() => navigate(`/materias/${sub.id}`)}
              className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:border-blue-500/50 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${sub.badgeBg}`}>
                    {sub.shortName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {sub.ejes.length} Ejes DEMRE
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {sub.nombre}
                </h2>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {sub.descripcion}
                </p>

                {/* Ejes list preview */}
                <div className="mt-4 space-y-1.5">
                  {sub.ejes.slice(0, 3).map((eje) => (
                    <div
                      key={eje.id}
                      className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="truncate">{eje.nombre}</span>
                    </div>
                  ))}
                  {sub.ejes.length > 3 && (
                    <span className="text-[10px] text-slate-400 pl-3">
                      +{sub.ejes.length - 3} más
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">{sub.preguntasEnsayoOficial} preguntas oficiales</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Ver Temario</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
