import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '@/store/useQuizStore';
import { estimatePaesScore } from '@/lib/scoreEstimator';
import { SUBJECTS } from '@/data/subjects';
import { MathRenderer } from '@/components/math/MathRenderer';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Award, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const QuizResult: React.FC = () => {
  const navigate = useNavigate();
  const { answers, subjectId, resetQuiz, startQuiz } = useQuizStore();
  const [filter, setFilter] = useState<'all' | 'mistakes' | 'correct'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const subjectConfig = subjectId !== 'mixed' ? SUBJECTS[subjectId] : null;

  const totalQuestions = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const scoreResult = useMemo(
    () => estimatePaesScore(correctCount, totalQuestions),
    [correctCount, totalQuestions]
  );

  // Skill breakdown
  const skillStats = useMemo(() => {
    const stats: Record<string, { total: number; correct: number }> = {};
    answers.forEach((ans) => {
      const hab = ans.question.habilidad;
      if (!stats[hab]) stats[hab] = { total: 0, correct: 0 };
      stats[hab].total += 1;
      if (ans.isCorrect) stats[hab].correct += 1;
    });
    return stats;
  }, [answers]);

  // Eje breakdown
  const ejeStats = useMemo(() => {
    const stats: Record<string, { total: number; correct: number; nombre: string }> = {};
    answers.forEach((ans) => {
      const ejeId = ans.question.ejeId;
      if (!stats[ejeId]) {
        const foundEje = subjectConfig?.ejes.find((e) => e.id === ejeId);
        stats[ejeId] = {
          total: 0,
          correct: 0,
          nombre: foundEje ? foundEje.nombre : ejeId,
        };
      }
      stats[ejeId].total += 1;
      if (ans.isCorrect) stats[ejeId].correct += 1;
    });
    return stats;
  }, [answers, subjectConfig]);

  if (totalQuestions === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold">No hay resultados disponibles</h2>
        <button
          onClick={() => navigate('/materias')}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
        >
          Ir a Materias
        </button>
      </div>
    );
  }

  const filteredAnswers = answers.filter((a) => {
    if (filter === 'mistakes') return !a.isCorrect;
    if (filter === 'correct') return a.isCorrect;
    return true;
  });

  const handleRetryQuiz = () => {
    const currentQuestions = answers.map((a) => a.question);
    startQuiz(currentQuestions, subjectId, 'quiz');
    navigate('/quiz');
  };

  const handlePracticeMistakes = () => {
    const wrongQuestions = answers.filter((a) => !a.isCorrect).map((a) => a.question);
    if (wrongQuestions.length === 0) return;
    startQuiz(wrongQuestions, subjectId, 'quiz');
    navigate('/quiz');
  };

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-4 sm:py-8">
      {/* Top Banner with Score */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-xs text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
          <Award className="w-4 h-4" />
          <span>Resumen de Desempeño</span>
        </div>

        <h1 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display">
          {subjectConfig ? subjectConfig.nombre : 'Quiz General'}
        </h1>

        {/* Big Score Callout */}
        <div className="my-5 sm:my-6 flex flex-col items-center">
          <div className="text-4xl sm:text-6xl font-black text-indigo-600 dark:text-indigo-400 font-display">
            {scoreResult.puntajeEstimado}
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
            Puntos PAES estimados
          </span>
          <span className="mt-1 text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 italic max-w-sm">
            {scoreResult.leyendaOficial} · Escala referencial 100 - 1.000 pts
          </span>
        </div>

        {/* Metric Triplet */}
        <div className="grid grid-cols-3 divide-x divide-slate-200/80 dark:divide-slate-800 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 py-3 sm:py-4 px-1 sm:px-3">
          <div className="px-1 sm:px-2">
            <span className="block text-base sm:text-2xl font-black text-slate-900 dark:text-white">
              {correctCount} / {totalQuestions}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block mt-0.5 leading-tight">Correctas</span>
          </div>
          <div className="px-1 sm:px-2">
            <span className="block text-base sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {scoreResult.porcentajeAciertos}%
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block mt-0.5 leading-tight">Precisión</span>
          </div>
          <div className="px-1 sm:px-2">
            <span className="block text-base sm:text-2xl font-black text-amber-500">
              +{correctCount * 15 + (totalQuestions - correctCount) * 3}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 block mt-0.5 leading-tight">XP Ganado</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row flex-wrap justify-center gap-2.5 sm:gap-3">
          <button
            onClick={handleRetryQuiz}
            className="w-full sm:w-auto justify-center flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reintentar Quiz Completo</span>
          </button>

          {totalQuestions - correctCount > 0 && (
            <button
              onClick={handlePracticeMistakes}
              className="w-full sm:w-auto justify-center flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-indigo-700 transition active:scale-95 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Practicar {totalQuestions - correctCount} Errores</span>
            </button>
          )}

          <button
            onClick={() => {
              resetQuiz();
              navigate('/materias');
            }}
            className="w-full sm:w-auto justify-center flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition active:scale-95"
          >
            <span>Volver a Materias</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cognitive Skills Breakdown */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-4">
            Habilidades Cognitivas DEMRE
          </h3>
          <div className="space-y-4">
            {Object.entries(skillStats).map(([hab, st]) => {
              const pct = Math.round((st.correct / st.total) * 100);
              return (
                <div key={hab}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{hab}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {st.correct} de {st.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ejes Temáticos Breakdown */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-4">
            Dominio por Eje Temático
          </h3>
          <div className="space-y-4">
            {Object.entries(ejeStats).map(([ejeId, st]) => {
              const pct = Math.round((st.correct / st.total) * 100);
              return (
                <div key={ejeId}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                      {st.nombre}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {st.correct}/{st.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 70 ? 'bg-blue-600' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Revisión de Preguntas
          </h3>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Todas ({answers.length})
            </button>
            <button
              onClick={() => setFilter('mistakes')}
              className={`px-3 py-1 rounded-md transition ${
                filter === 'mistakes'
                  ? 'bg-white text-rose-600 shadow-xs dark:bg-slate-900 dark:text-rose-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Falladas ({answers.filter((a) => !a.isCorrect).length})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1 rounded-md transition ${
                filter === 'correct'
                  ? 'bg-white text-emerald-600 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Correctas ({answers.filter((a) => a.isCorrect).length})
            </button>
          </div>
        </div>

        {/* Questions Accordion */}
        <div className="space-y-3">
          {filteredAnswers.map((ans, idx) => {
            const isExpanded = expandedId === ans.question.id;
            return (
              <div
                key={ans.question.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : ans.question.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-3 pr-2">
                    {ans.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">#{idx + 1}</span>
                        <span>·</span>
                        <span>{ans.question.tema}</span>
                        <span>·</span>
                        <span>Habilidad: {ans.question.habilidad}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                        <MathRenderer content={ans.question.enunciado} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Marcaste: {ans.selectedOption} | Correcta: {ans.question.correcta}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-3 text-sm">
                    {/* Full question */}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enunciado:</span>
                      <div className="mt-1 text-slate-800 dark:text-slate-200">
                        <MathRenderer content={ans.question.enunciado} />
                      </div>
                    </div>

                    {/* Step-by-step resolution */}
                    <div className="rounded-lg bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1.5">
                        Resolución Paso a Paso:
                      </span>
                      <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        {ans.question.explicacionPasoAPaso.map((paso, pIdx) => (
                          <li key={pIdx}>
                            <MathRenderer content={paso} className="inline" />
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Common error distractor explanation if missed */}
                    {!ans.isCorrect && (
                      <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 p-3 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200">
                        <strong>¿Por qué fallaste en la opción {ans.selectedOption}?</strong>
                        <p className="mt-1">
                          {ans.question.alternativas.find((a) => a.id === ans.selectedOption)?.explicacionDistractor ||
                            'Distractor formulado a partir de un error frecuente en el desarrollo.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
