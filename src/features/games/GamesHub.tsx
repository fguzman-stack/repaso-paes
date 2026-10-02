import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Calendar, Search, BookOpen, Brain, Play, ShieldCheck } from 'lucide-react';

export const GamesHub: React.FC = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'calculo-relampago',
      titulo: 'Cálculo Relámpago',
      materia: 'Matemática M1',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
      icon: Zap,
      propositoPedagogico:
        'Automatizar cálculos mentales y propiedades algebraicas para reducir la sobrecarga de memoria de trabajo durante la prueba.',
      duracion: '60 segundos',
      ruta: '/juegos/calculo-relampago',
    },
    {
      id: 'linea-de-tiempo',
      titulo: 'Línea de Tiempo Histórica',
      materia: 'Historia y Cs. Sociales',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
      icon: Calendar,
      propositoPedagogico:
        'Desarrollar el pensamiento temporal y la secuenciación de procesos de la historia de Chile y contemporánea.',
      duracion: '3 a 5 min',
      ruta: '/juegos/linea-tiempo',
    },
    {
      id: 'detective-errores',
      titulo: 'Detective de Errores',
      materia: 'Matemática M1 / M2',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300',
      icon: Search,
      propositoPedagogico:
        'Entrenar la metacognición detectando en qué paso exacto se cometió un error algebraico típico.',
      duracion: '2 a 4 min',
      ruta: '/juegos/detective-errores',
    },
    {
      id: 'flashcards',
      titulo: 'Flashcards de Conceptos Clave',
      materia: 'Todas las Materias',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
      icon: BookOpen,
      propositoPedagogico:
        'Práctica de recuperación activa con autoevaluación sincera (lo sabía / dudé / no lo sabía).',
      duracion: 'A tu ritmo',
      ruta: '/juegos/flashcards',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
          <Brain className="w-4 h-4" />
          <span>Gamificación con Sentido</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Juegos de Aprendizaje Activo
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Cada juego está diseñado alrededor de una habilidad cognitiva específica demostrada por la ciencia del aprendizaje: automaticidad, metacognición y reconstrucción conceptual.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between hover:border-blue-500/50 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-display group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {game.titulo}
                      </h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${game.badgeColor}`}>
                        {game.materia}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{game.duracion}</span>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3.5 border border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                        Propósito Pedagógico:
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {game.propositoPedagogico}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => navigate(game.ruta)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Jugar Ahora</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
