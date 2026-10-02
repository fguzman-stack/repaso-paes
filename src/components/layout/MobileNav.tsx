import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpenCheck, Layers, Sparkles, Gamepad2, BarChart2 } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();

  // 5 essential mobile destinations with generous touch targets (min 48px)
  const links = [
    { to: '/', label: 'Inicio', icon: BookOpenCheck },
    { to: '/materias', label: 'Materias', icon: Layers },
    { to: '/repaso', label: 'Repaso', icon: Sparkles },
    { to: '/juegos', label: 'Juegos', icon: Gamepad2 },
    { to: '/progreso', label: 'Progreso', icon: BarChart2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-40 w-full border-t border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800/90 dark:bg-slate-950/95 xl:hidden shadow-lg pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all min-h-[48px] min-w-[56px] ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/60' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
