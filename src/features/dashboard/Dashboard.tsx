import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore, getXPForNextLevel } from '@/store/useUserStore';
import { useQuizStore } from '@/store/useQuizStore';
import { SUBJECT_LIST } from '@/data/subjects';
import { getRandomQuestions, getQuestionsByNivel } from '@/data/questions';
import { NivelDificultad, SubjectId } from '@/types';
import {
  Flame,
  Star,
  Play,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sprout,
  Target,
  Crown,
  BookOpenCheck,
  Compass,
  Calculator,
  BookOpen,
  GraduationCap,
  SlidersHorizontal,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { xp, level, streakDays, dailyGoal, todayAnsweredCount } = useUserStore();
  const { startQuiz } = useQuizStore();
  const nextLevelXP = getXPForNextLevel(level);

  // User controls for their session
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'm1' | 'lectora'>('all');
  const [selectedLength, setSelectedLength] = useState<number>(15);

  // Instant launch by specific difficulty level
  const handleLaunchLevel = (nivel: NivelDificultad) => {
    let pool;
    if (selectedSubject === 'all') {
      pool = getQuestionsByNivel(nivel);
    } else {
      pool = getQuestionsByNivel(nivel, selectedSubject as SubjectId);
    }

    const count = Math.min(selectedLength, pool.length);
    // Shuffle
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
    startQuiz(shuffled, selectedSubject === 'all' ? 'mixed' : (selectedSubject as SubjectId), 'quiz');
    navigate('/quiz');
  };

  // Quick practice mixed
  const handleQuickStudy = () => {
    const questions = getRandomQuestions({
      subjectId: selectedSubject === 'all' ? undefined : (selectedSubject as SubjectId),
      count: selectedLength,
    });
    startQuiz(questions, selectedSubject === 'all' ? 'mixed' : (selectedSubject as SubjectId), 'quiz');
    navigate('/quiz');
  };

  const goalPercentage = Math.min(100, Math.round((todayAnsweredCount / dailyGoal) * 100));

  // The 4 Difficulty Tiers with colorful, cheerful styling and Lucide icons
  const levelsConfig: {
    id: NivelDificultad;
    nombre: string;
    subtitulo: string;
    icon: typeof Sprout;
    iconColor: string;
    iconBg: string;
    badgeBg: string;
    cardBorder: string;
    cardBg: string;
    btnClass: string;
    totalGlobal: number;
    m1Count: number;
    lecCount: number;
    descripcion: string;
  }[] = [
    {
      id: 'facil',
      nombre: 'Nivel Fácil',
      subtitulo: 'Bases & Fundamentos',
      icon: Sprout,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/80',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/80',
      cardBorder: 'border-emerald-200/90 dark:border-emerald-900/60 hover:border-emerald-400',
      cardBg: 'bg-gradient-to-b from-emerald-50/60 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
      totalGlobal: 33,
      m1Count: 15,
      lecCount: 15,
      descripcion: 'Conceptos esenciales, operatoria directa y localización explícita para tomar confianza.',
    },
    {
      id: 'normal',
      nombre: 'Nivel Normal',
      subtitulo: 'Estándar Oficial DEMRE',
      icon: Target,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-950/80',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300/80',
      cardBorder: 'border-blue-200/90 dark:border-blue-900/60 hover:border-blue-400',
      cardBg: 'bg-gradient-to-b from-blue-50/60 via-white to-white dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900',
      btnClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
      totalGlobal: 40,
      m1Count: 15,
      lecCount: 15,
      descripcion: 'El nivel típico de la prueba oficial: problemas aplicados, inferencias y distractores plausibles.',
    },
    {
      id: 'dificil',
      nombre: 'Nivel Difícil',
      subtitulo: 'Razonamiento y Deducción',
      icon: Flame,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-950/80',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/80',
      cardBorder: 'border-amber-200/90 dark:border-amber-900/60 hover:border-amber-400',
      cardBg: 'bg-gradient-to-b from-amber-50/60 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900',
      btnClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
      totalGlobal: 31,
      m1Count: 15,
      lecCount: 15,
      descripcion: 'Trampas algebraicas, modelos multivariables y evaluación crítica de argumentos complejos.',
    },
    {
      id: 'extremo',
      nombre: 'Nivel Extremo',
      subtitulo: 'Desafío 1.000 Puntos',
      icon: Crown,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/80',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300/80',
      cardBorder: 'border-purple-200/90 dark:border-purple-900/60 hover:border-purple-400',
      cardBg: 'bg-gradient-to-b from-purple-50/60 via-white to-white dark:from-purple-950/20 dark:via-slate-900 dark:to-slate-900',
      btnClass: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20',
      totalGlobal: 30,
      m1Count: 15,
      lecCount: 15,
      descripcion: 'Máxima exigencia de postulación: deducciones abstractas, análisis de falacias y optimización.',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-10">
      {/* Cheerful Friendly Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-indigo-200/60 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 sm:p-10 text-white shadow-lg shadow-indigo-500/10">
        <div className="relative z-10 max-w-2xl space-y-3.5 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] sm:text-xs font-bold backdrop-blur-md border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>PAES Chile · Admisión Universitaria</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display leading-tight">
            Practica a tu ritmo, <br className="hidden sm:inline" />
            <span className="text-amber-300">desafío por nivel</span>.
          </h1>

          <p className="text-xs sm:text-base text-blue-100 leading-relaxed font-normal">
            Una plataforma libre, amigable y motivadora para preparar la PAES. Elige tu nivel con mínimo 15 preguntas verificadas y retroalimentación paso a paso.
          </p>

          {/* Controls: Subject & Length Bar */}
          <div className="pt-1 sm:pt-2 space-y-2.5 sm:space-y-3">
            {/* Subject Filter */}
            <div>
              <span className="text-[11px] sm:text-xs font-bold text-blue-100 block mb-1.5 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-300" />
                <span>¿Qué materia quieres entrenar hoy?</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setSelectedSubject('all')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedSubject === 'all'
                      ? 'bg-amber-400 text-slate-900 shadow-sm font-black scale-102'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Todas combinadas</span>
                </button>
                <button
                  onClick={() => setSelectedSubject('m1')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedSubject === 'm1'
                      ? 'bg-amber-400 text-slate-900 shadow-sm font-black scale-102'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Matemática M1 (60)</span>
                </button>
                <button
                  onClick={() => setSelectedSubject('lectora')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedSubject === 'lectora'
                      ? 'bg-amber-400 text-slate-900 shadow-sm font-black scale-102'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Comp. Lectora (60)</span>
                </button>
              </div>
            </div>

            {/* Quiz Length Selector */}
            <div>
              <span className="text-[11px] sm:text-xs font-bold text-blue-100 block mb-1.5">
                ¿Cuántas preguntas quieres en el quiz?
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {[15, 20, 30].map((len) => (
                  <button
                    key={len}
                    onClick={() => setSelectedLength(len)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                      selectedLength === len
                        ? 'bg-white text-indigo-900 shadow-sm font-black scale-102'
                        : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                    }`}
                  >
                    {len === 15 ? `${len} preg. (Recomendado)` : `${len} preg.`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
            <button
              onClick={handleQuickStudy}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-blue-50 px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-indigo-900 shadow-md active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-indigo-900" />
              <span>Empezar Práctica ({selectedLength} preguntas)</span>
            </button>

            <button
              onClick={() => navigate('/repaso')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white transition backdrop-blur-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Repaso Diario SM-2</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>

      {/* THE 4 DIFFICULTY TIERS (With Gorgeous Lucide SVG Icons & Minimum 15 questions) */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-2 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              <Compass className="w-4 h-4" />
              <span>Entrenamiento por Niveles</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              Elige tu Nivel de Desafío
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Cada nivel cuenta con al menos 15 preguntas verificadas paso a paso con análisis de distractores.
            </p>
          </div>

          <div className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span>Materia activa: <strong>{selectedSubject === 'all' ? 'Todas' : selectedSubject === 'm1' ? 'M1' : 'Lectora'}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {levelsConfig.map((lvl) => {
            const Icon = lvl.icon;
            const availableCount =
              selectedSubject === 'all'
                ? lvl.totalGlobal
                : selectedSubject === 'm1'
                ? lvl.m1Count
                : lvl.lecCount;

            return (
              <div
                key={lvl.id}
                className={`rounded-3xl border ${lvl.cardBorder} ${lvl.cardBg} p-6 shadow-xs flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-md`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${lvl.iconBg} ${lvl.iconColor} shadow-xs`}>
                      <Icon className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${lvl.badgeBg}`}>
                      {availableCount} disp.
                    </span>
                  </div>

                  <h3 className="text-lg font-black font-display text-slate-900 dark:text-white">
                    {lvl.nombre}
                  </h3>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                    {lvl.subtitulo}
                  </span>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {lvl.descripcion}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                    <span>Sesión configurada:</span>
                    <strong className="text-slate-700 dark:text-slate-300">{Math.min(selectedLength, availableCount)} preguntas</strong>
                  </div>
                  <button
                    onClick={() => handleLaunchLevel(lvl.id)}
                    className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black shadow-xs transition active:scale-95 ${lvl.btnClass}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Entrenar {lvl.nombre}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamification progress tracker */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Meta Diaria */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold">Tu Meta de Hoy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
              {todayAnsweredCount} / {dailyGoal}
            </span>
            <span className="text-xs text-slate-500">preguntas</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block font-medium">
            {todayAnsweredCount >= dailyGoal
              ? 'Meta diaria cumplida'
              : `Faltan ${dailyGoal - todayAnsweredCount} preguntas para tu meta`}
          </span>
        </div>

        {/* Racha */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold">Racha de Práctica</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
              {streakDays} días
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">Activa</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
            La constancia diaria rinde mucho más que sesiones maratónicas aisladas.
          </p>
        </div>

        {/* Nivel y XP */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold">Nivel Académico</span>
            <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
              Nivel {level}
            </span>
            <span className="text-xs text-slate-500">· {xp} XP</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 leading-relaxed font-medium">
            Suma experiencia con cada ejercicio respondido y analizado.
          </p>
        </div>
      </div>

      {/* Featured Subjects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              Materias Oficiales PAES
            </h2>
            <p className="text-xs text-slate-500">Explora temarios oficiales DEMRE y practica sus ejes temáticos</p>
          </div>
          <button
            onClick={() => navigate('/materias')}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            <span>Ver las 8 materias</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBJECT_LIST.slice(0, 4).map((sub) => {
            return (
              <div
                key={sub.id}
                onClick={() => navigate(`/materias/${sub.id}`)}
                className="cursor-pointer rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${sub.badgeBg}`}>
                    {sub.shortName}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mt-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {sub.nombre}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                    {sub.descripcion}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{sub.ejes.length} ejes temáticos</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Estudiar →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
