import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Flame,
  Star,
  Moon,
  Sun,
  BookOpenCheck,
  Layers,
  BarChart2,
  Gamepad2,
  Timer,
  Sparkles,
  Menu,
  X,
  Compass,
  ArrowRight,
  Sprout,
  Target,
  Crown,
} from 'lucide-react';
import { useUserStore, getXPForNextLevel } from '@/store/useUserStore';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { xp, level, streakDays, dailyGoal, todayAnsweredCount, theme, toggleTheme } = useUserStore();
  const nextLevelXP = getXPForNextLevel(level);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Short, concise labels for desktop to prevent ANY overflow
  const navLinks = [
    { to: '/', label: 'Inicio', icon: BookOpenCheck },
    { to: '/materias', label: 'Materias', icon: Layers },
    { to: '/repaso', label: 'Repaso', icon: Sparkles },
    { to: '/simulacro', label: 'Simulacros', icon: Timer },
    { to: '/juegos', label: 'Juegos', icon: Gamepad2 },
    { to: '/progreso', label: 'Progreso', icon: BarChart2 },
  ];

  const goalPercentage = Math.min(100, Math.round((todayAnsweredCount / dailyGoal) * 100));

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800/90 dark:bg-slate-950/95 transition-colors shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Left: Brand (Responsive, never wraps awkwardly) */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BookOpenCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white truncate">
                  Estudio <span className="text-indigo-600 dark:text-indigo-400">PAES</span>
                </span>
                <span className="rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-1.5 py-0.2 text-[9px] sm:text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Chile
                </span>
              </div>
              <span className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5 truncate">
                Práctica libre por niveles
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links (Compact & perfectly fitting) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Quick Stats, Theme Toggle & Mobile Menu Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Streak Badge */}
            <div
              className="flex items-center gap-1 text-xs font-black text-amber-700 dark:text-amber-300 px-2 sm:px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-900/50 shadow-2xs"
              title={`${streakDays} días seguidos de práctica`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span className="hidden sm:inline">{streakDays} días</span>
              <span className="sm:hidden">{streakDays}d</span>
            </div>

            {/* Level and XP Badge (Desktop & Tablet) */}
            <div
              className="hidden md:flex items-center gap-1.5 text-xs font-black text-indigo-700 dark:text-indigo-300 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 shadow-2xs"
              title={`Nivel ${level} · ${xp} / ${nextLevelXP} XP`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
              <span>Nvl {level}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">{xp} XP</span>
            </div>

            {/* PWA Install Button (Desktop) */}
            <div className="hidden lg:block">
              <PWAInstallButton />
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Cambiar tema claro u oscuro"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition shadow-2xs active:scale-95"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Hamburger Mobile Menu Button (Visible on < xl) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú de navegación"
              className="xl:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 transition active:scale-95"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer / Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
                    <BookOpenCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-slate-900 dark:text-white text-base">
                      Estudio PAES
                    </h2>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Chile · Menú Principal</span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Stats Card in Drawer */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>Nivel {level}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{xp} XP</span>
                </div>

                {/* Progress bar to next level */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Meta Diaria</span>
                    <span>{todayAnsweredCount} / {dailyGoal} preg.</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${goalPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Links List */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
                  Navegación
                </span>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                    </Link>
                  );
                })}
              </div>

              {/* Quick Jump to 4 Difficulty Levels */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block">
                  Práctica Rápida por Nivel
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/materias/m1"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold"
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    <span>Nivel Fácil</span>
                  </Link>

                  <Link
                    to="/materias/m1"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Nivel Normal</span>
                  </Link>

                  <Link
                    to="/materias/m1"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Nivel Difícil</span>
                  </Link>

                  <Link
                    to="/materias/m1"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-purple-800 dark:text-purple-300 text-xs font-bold"
                  >
                    <Crown className="w-3.5 h-3.5 text-purple-500" />
                    <span>Nivel Extremo</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Modo de visualización:</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Oscuro</span>
                    </>
                  )}
                </button>
              </div>

              <div className="w-full">
                <PWAInstallButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
