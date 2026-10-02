import React, { useEffect, useState } from 'react';
import { useUserStore, getXPForNextLevel } from '@/store/useUserStore';
import { db, DBSimulacroResult, exportDatabaseJSON, importDatabaseJSON } from '@/db';
import { SUBJECT_LIST } from '@/data/subjects';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  Flame,
  Star,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';

export const ProgressDashboard: React.FC = () => {
  const { xp, level, streakDays, dailyGoal, todayAnsweredCount, setDailyGoal, exportState, importState } =
    useUserStore();
  const nextLevelXP = getXPForNextLevel(level);

  const [simulacros, setSimulacros] = useState<DBSimulacroResult[]>([]);
  const [subjectMasteryData, setSubjectMasteryData] = useState<
    { name: string; porcentaje: number; aciertos: number; total: number }[]
  >([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const sims = await db.simulacros.orderBy('timestamp').toArray();
        setSimulacros(sims);

        const attempts = await db.attempts.toArray();
        const stats = SUBJECT_LIST.map((sub) => {
          const subAttempts = attempts.filter((a) => a.materia === sub.id);
          const correct = subAttempts.filter((a) => a.isCorrect).length;
          const total = subAttempts.length;
          const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
          return {
            name: sub.shortName,
            porcentaje: pct,
            aciertos: correct,
            total,
          };
        });
        setSubjectMasteryData(stats);
      } catch {
        // fallback
      }
    }
    loadStats();
  }, []);

  const handleExportBackup = async () => {
    try {
      const dbBackup = await exportDatabaseJSON();
      const userState = exportState();

      const fullBackup = {
        app: 'PAESTrainer',
        date: new Date().toISOString(),
        userState: JSON.parse(userState),
        dbData: JSON.parse(dbBackup),
      };

      const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paes_trainer_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage('Respaldo exportado con éxito.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch {
      setStatusMessage('Error al exportar respaldo.');
    }
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.userState) {
          importState(JSON.stringify(parsed.userState));
        }
        if (parsed.dbData) {
          await importDatabaseJSON(JSON.stringify(parsed.dbData));
        }

        setStatusMessage('Datos restaurados correctamente. Recargando...');
        setTimeout(() => window.location.reload(), 1500);
      } catch {
        setStatusMessage('Archivo de respaldo no válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Panel de Progreso y Estadísticas
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Seguimiento basado en tu desempeño real. Sin patrones oscuros ni presiones excesivas.
        </p>
      </div>

      {statusMessage && (
        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 p-3 text-xs font-semibold">
          {statusMessage}
        </div>
      )}

      {/* Gamification Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Racha */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Racha de Estudio</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-display">
            {streakDays} <span className="text-base font-normal text-slate-500">días</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            ¡Constancia antes que saturación!
          </span>
        </div>

        {/* Nivel y XP */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Nivel Académico</span>
            <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-display">
            Nivel {level}
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${Math.min(100, Math.round((xp / nextLevelXP) * 100))}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            {xp} / {nextLevelXP} XP para Nivel {level + 1}
          </span>
        </div>

        {/* Meta Diaria */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Meta de Hoy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-display">
            {todayAnsweredCount} / {dailyGoal}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            {todayAnsweredCount >= dailyGoal
              ? '¡Meta cumplida por hoy!'
              : `Faltan ${dailyGoal - todayAnsweredCount} preguntas`}
          </span>
        </div>

        {/* Ensayos Realizados */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Simulacros Rendidos</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-display">
            {simulacros.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            {simulacros.length > 0
              ? `Último: ${simulacros[simulacros.length - 1].puntajeEstimado} pts`
              : 'Rinde tu primer ensayo'}
          </span>
        </div>
      </div>

      {/* Chart: Subject Mastery */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Porcentaje de Dominio por Materia
            </h3>
            <p className="text-xs text-slate-500">Basado en tus respuestas en quizzes y simulacros</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectMasteryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: unknown) => [`${val}% de precisión`, 'Dominio']}
              />
              <Bar dataKey="porcentaje" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mastery Map by Eje */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-1">
          Mapa de Dominio por Eje Temático
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Semáforo pedagógico: <span className="text-emerald-600 font-semibold">Verde (≥70%)</span>,{' '}
          <span className="text-amber-500 font-semibold">Amarillo (40-69%)</span>,{' '}
          <span className="text-rose-500 font-semibold">Rojo (&lt;40% o por iniciar)</span>.
        </p>

        <div className="space-y-6">
          {SUBJECT_LIST.map((sub) => {
            return (
              <div key={sub.id} className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-3">
                  {sub.nombre}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {sub.ejes.map((eje) => {
                    return (
                      <div
                        key={eje.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                      >
                        <div className="pr-2">
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block truncate max-w-[170px]">
                            {eje.nombre}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {eje.habilidadesPrincipales[0]}
                          </span>
                        </div>
                        <span className="h-3 w-3 rounded-full bg-amber-400 shrink-0" title="En desarrollo" />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-1">
          Portabilidad de Datos y Privacidad
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Tus datos se almacenan exclusivamente en tu navegador (IndexedDB). Puedes exportar tu progreso a un archivo JSON para respaldo o transferirlo a otro dispositivo.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Progreso (JSON)</span>
          </button>

          <label className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Importar Progreso (JSON)</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
