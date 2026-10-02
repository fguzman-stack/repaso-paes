import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SUBJECTS } from '@/data/subjects';
import { getRandomQuestions, getQuestionsByNivel } from '@/data/questions';
import { useQuizStore } from '@/store/useQuizStore';
import { SubjectId, NivelDificultad } from '@/types';
import { ArrowLeft, Play, Timer, Sparkles, CheckCircle2, Sprout, Target, Flame, Crown } from 'lucide-react';

export const SubjectDetail: React.FC = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();
  const { startQuiz } = useQuizStore();

  const [selectedLength, setSelectedLength] = useState<number>(15);

  const validId = (subjectId && subjectId in SUBJECTS ? subjectId : 'm1') as SubjectId;
  const config = SUBJECTS[validId];

  const handleStartSubjectQuiz = (ejeId?: string, nivel?: NivelDificultad) => {
    let questions;
    if (nivel) {
      questions = getQuestionsByNivel(nivel, validId);
      if (questions.length === 0) {
        questions = getQuestionsByNivel(nivel);
      }
    } else {
      questions = getRandomQuestions({
        subjectId: validId,
        ejeId,
        count: selectedLength,
      });
    }

    const count = Math.min(selectedLength, questions.length);
    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, count);
    startQuiz(shuffled, validId, 'quiz');
    navigate('/quiz');
  };

  const handleStartSimulacro = () => {
    navigate(`/simulacro/${validId}`);
  };

  const levels: { id: NivelDificultad; label: string; icon: typeof Sprout; color: string; desc: string }[] = [
    { id: 'facil', label: 'Fácil', icon: Sprout, color: 'border-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200', desc: '15 preguntas base para afianzar conceptos y fórmulas.' },
    { id: 'normal', label: 'Normal', icon: Target, color: 'border-blue-300 bg-blue-50/70 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200', desc: '15 preguntas tipo DEMRE con distractores plausibles.' },
    { id: 'dificil', label: 'Difícil', icon: Flame, color: 'border-amber-300 bg-amber-50/70 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200', desc: '15 preguntas complejas de modelamiento y deducción.' },
    { id: 'extremo', label: 'Extremo', icon: Crown, color: 'border-violet-300 bg-violet-50/70 dark:bg-violet-950/20 text-violet-800 dark:text-violet-200', desc: '15 preguntas de máxima exigencia para 1.000 puntos.' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/materias')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className={`text-xs font-black px-3 py-1 rounded-full ${config.badgeBg}`}>
            {config.shortName}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {config.duracionMinutos} min · {config.preguntasEnsayoOficial} preguntas oficiales
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
          {config.nombre}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-normal">
          {config.descripcion}
        </p>

        {/* Quiz length selector */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Longitud de la sesión de práctica:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {[15, 20, 30].map((len) => (
              <button
                key={len}
                onClick={() => setSelectedLength(len)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedLength === len
                    ? 'bg-indigo-600 text-white shadow-xs font-black scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {len === 15 ? `${len} preguntas (Recomendado)` : `${len} preguntas`}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => handleStartSubjectQuiz()}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition shadow-xs active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Iniciar Práctica General ({selectedLength} preguntas)</span>
          </button>

          <button
            onClick={handleStartSimulacro}
            className="flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Timer className="w-4 h-4" />
            <span>Simulacro con Temporizador</span>
          </button>
        </div>
      </div>

      {/* Direct Level Challenge Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
            Entrena por Nivel de Dificultad
          </h2>
          <p className="text-xs text-slate-500">
            Escoge el desafío adecuado para tu nivel actual (mínimo 15 preguntas verificadas en cada nivel)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {levels.map((lvl) => {
            const LevelIcon = lvl.icon;
            return (
              <div
                key={lvl.id}
                className={`rounded-3xl border p-5 shadow-2xs flex flex-col justify-between ${lvl.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-xs">
                      <LevelIcon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/60 dark:bg-slate-900/60 px-2 py-0.5 rounded-full">
                      Nivel {lvl.label}
                    </span>
                  </div>
                  <h3 className="text-base font-black font-display mb-1">{lvl.label}</h3>
                  <p className="text-xs opacity-90 leading-relaxed font-normal">{lvl.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-current/20">
                  <button
                    onClick={() => handleStartSubjectQuiz(undefined, lvl.id)}
                    className="w-full rounded-xl bg-white/95 dark:bg-slate-900 py-2.5 text-xs font-black shadow-xs hover:bg-white hover:shadow-md transition active:scale-95"
                  >
                    Entrenar {lvl.label} ({selectedLength} preg.)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ejes Temáticos DEMRE */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
            Ejes Temáticos Oficiales
          </h2>
          <p className="text-xs text-slate-500">Practica de forma específica las unidades del temario DEMRE</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {config.ejes.map((eje, idx) => {
            return (
              <div
                key={eje.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs gap-4 hover:border-blue-400 transition"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-slate-800 text-xs font-black text-amber-900 dark:text-amber-300">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {eje.nombre}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                      {eje.descripcion}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                      <span className="font-semibold">Habilidades DEMRE:</span>
                      {eje.habilidadesPrincipales.map((hab, hIdx) => (
                        <span key={hIdx} className="text-slate-600 dark:text-slate-300">
                          {hab}{hIdx < eje.habilidadesPrincipales.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartSubjectQuiz(eje.id)}
                  className="self-end sm:self-center shrink-0 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 px-4 py-2 text-xs font-bold hover:bg-blue-600 hover:text-white transition"
                >
                  Practicar este Eje
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
