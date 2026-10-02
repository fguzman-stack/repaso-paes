import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SUBJECTS } from '@/data/subjects';
import { getRandomQuestions, ALL_QUESTIONS } from '@/data/questions';
import { Question, SubjectId } from '@/types';
import { MathRenderer } from '@/components/math/MathRenderer';
import { estimatePaesScore } from '@/lib/scoreEstimator';
import { db } from '@/db';
import { useUserStore } from '@/store/useUserStore';
import { Timer, ArrowLeft, ArrowRight, Flag, CheckCircle, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SimulacroSession: React.FC = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();
  const { addXP, recordAnswer } = useUserStore();

  const validSubjectId = (subjectId && subjectId in SUBJECTS ? subjectId : 'm1') as SubjectId;
  const config = SUBJECTS[validSubjectId];

  // We sample 15-20 questions for an agile mock simulation
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(30 * 60); // 30 minutes default for mock
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState<ReturnType<typeof estimatePaesScore> | null>(null);

  useEffect(() => {
    // Pick questions for this subject
    const sampled = getRandomQuestions({ subjectId: validSubjectId, count: 15 });
    setQuestions(sampled.length > 0 ? sampled : ALL_QUESTIONS.slice(0, 15));
  }, [validSubjectId]);

  // Countdown timer
  useEffect(() => {
    if (isFinished || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitSimulacro();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, secondsRemaining]);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (isFinished || !currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: opt }));
  };

  const toggleFlag = (id: string) => {
    setFlagged((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitSimulacro = async () => {
    if (isFinished) return;
    setIsFinished(true);

    let correctCount = 0;
    questions.forEach((q) => {
      const selected = answers[q.id];
      if (selected === q.correcta) {
        correctCount += 1;
        recordAnswer(true);
      } else {
        recordAnswer(false);
      }
    });

    const score = estimatePaesScore(correctCount, questions.length);
    setFinalScore(score);

    // Give reward XP
    addXP(correctCount * 15 + 50);

    try {
      // Save simulacro to Dexie database
      await db.simulacros.add({
        materia: validSubjectId,
        puntajeEstimado: score.puntajeEstimado,
        porcentajeAciertos: score.porcentajeAciertos,
        correctas: correctCount,
        total: questions.length,
        duracionSegundos: 30 * 60 - secondsRemaining,
        timestamp: Date.now(),
      });

      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {
      // safe fallback
    }
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (!currentQuestion) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center text-slate-500">
        Preparando simulacro...
      </div>
    );
  }

  // If exam finished, render results
  if (isFinished && finalScore) {
    const answeredCount = Object.keys(answers).length;
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Simulacro Finalizado: {config.nombre}
          </h2>

          <div className="my-6">
            <div className="text-6xl font-black text-blue-600 dark:text-blue-400 font-display">
              {finalScore.puntajeEstimado}
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
              Puntaje Estimado PAES
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-0.5">
              {finalScore.leyendaOficial} · Escala referencial 100 - 1.000 pts
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 my-6 text-center">
            <div>
              <span className="block text-xl font-bold text-slate-900 dark:text-white">
                {finalScore.correctas} / {finalScore.total}
              </span>
              <span className="text-xs text-slate-500">Correctas</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {finalScore.porcentajeAciertos}%
              </span>
              <span className="text-xs text-slate-500">Efectividad</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-slate-900 dark:text-white">
                {answeredCount} / {questions.length}
              </span>
              <span className="text-xs text-slate-500">Respondidas</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('/progreso')}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Ver en Mi Historial
            </button>
            <button
              onClick={() => navigate('/simulacro')}
              className="rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Otro Simulacro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Top Header with Countdown Timer */}
      <div className="sticky top-16 z-30 mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/90 p-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/simulacro')}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {config.shortName}
          </span>
        </div>

        {/* Countdown */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${
            secondsRemaining < 300
              ? 'bg-rose-50 text-rose-600 animate-pulse dark:bg-rose-950/40'
              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>{timeFormatted}</span>
        </div>

        {/* Finish button */}
        <button
          onClick={handleSubmitSimulacro}
          className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
        >
          Finalizar Ensayo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Pregunta {currentIndex + 1} de {questions.length}
              </span>
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                  flagged[currentQuestion.id]
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentQuestion.id] ? 'Marcada para revisar' : 'Marcar para revisar'}</span>
              </button>
            </div>

            {/* Reading Passage if any */}
            {currentQuestion.textoBase && (
              <div className="mb-6 rounded-xl border-l-4 border-emerald-500 bg-emerald-50/40 p-4 text-sm leading-relaxed max-h-56 overflow-y-auto">
                <MathRenderer content={currentQuestion.textoBase} />
              </div>
            )}

            {/* Enunciado */}
            <div className="mb-6 text-base font-medium text-slate-900 dark:text-white leading-relaxed">
              <MathRenderer content={currentQuestion.enunciado} />
            </div>

            {/* Alternatives (No immediate feedback in simulacro!) */}
            <div className="space-y-3">
              {currentQuestion.alternativas.map((alt) => {
                const isSelected = answers[currentQuestion.id] === alt.id;
                return (
                  <button
                    key={alt.id}
                    onClick={() => handleSelectOption(alt.id)}
                    className={`w-full flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {alt.id}
                    </span>
                    <div className="flex-1 text-sm pt-0.5">
                      <MathRenderer content={alt.texto} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation between questions */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 disabled:opacity-40"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIndex === questions.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Question Palette / Grid */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Mapa de Preguntas
            </h4>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const hasAnswer = !!answers[q.id];
                const isFlagged = !!flagged[q.id];

                let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                if (isCurrent) {
                  bgClass = 'ring-2 ring-blue-500 font-bold';
                }
                if (hasAnswer) {
                  bgClass += ' bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
                }
                if (isFlagged) {
                  bgClass += ' border border-amber-500';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-8 rounded-lg text-xs transition flex items-center justify-center relative ${bgClass}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-blue-100 border border-blue-400 dark:bg-blue-900" />
                <span>Respondida</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-amber-100 border border-amber-400" />
                <span>Marcada para revisar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-slate-100 border border-slate-300 dark:bg-slate-800" />
                <span>Sin responder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
