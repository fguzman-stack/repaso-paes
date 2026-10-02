import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1 pb-24 xl:pb-12">
        <Outlet />
      </main>
      <MobileNav />
      <OfflineIndicator />
    </div>
  );
};
