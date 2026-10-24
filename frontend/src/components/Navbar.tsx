import React from 'react';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  level?: number;
  totalXp?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ level = 1, totalXp = 0 }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              PlayWithYourTasks
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Task Manager z elementami grywalizacji
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-inner">
            <span className="text-amber-400 text-sm font-semibold">⚡ {totalXp} XP</span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-indigo-300 text-sm font-bold">Poziom {level}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
