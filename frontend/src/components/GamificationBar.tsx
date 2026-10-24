import React from 'react';
import { GamificationStats } from '../lib/types';
import { Award, CheckCircle2, Flame, Trophy } from 'lucide-react';

interface GamificationBarProps {
  stats: GamificationStats | null;
}

export const GamificationBar: React.FC<GamificationBarProps> = ({ stats }) => {
  const level = stats?.level ?? 1;
  const totalXp = stats?.total_xp ?? 0;
  const xpToNext = stats?.xp_to_next_level ?? 100;
  const levelProgress = stats?.level_progress_percentage ?? 0;
  const completedCount = stats?.completed_tasks_count ?? 0;
  const totalCount = stats?.total_tasks_count ?? 0;
  const overallProgress = stats?.overall_progress_percentage ?? 0;
  const badges = stats?.badges ?? [];

  return (
    <section
      data-testid="gamification-bar"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5"
    >
      {/* Nagłówek statystyk */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                data-testid="level-badge"
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50"
              >
                Poziom {level}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                {totalXp} XP łącznie
              </span>
            </div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
              Twój Postęp i Osiągnięcia
            </h2>
          </div>
        </div>

        {/* Podsumowanie zadań */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span data-testid="task-completion-count" className="font-semibold text-slate-800 dark:text-slate-200">
            {completedCount}/{totalCount}
          </span>
          <span>zadań ukończonych</span>
        </div>
      </div>

      {/* Paski postępu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Pasek poziomu / XP */}
        <div className="bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
            <span>Postęp do Poziomu {level + 1}</span>
            <span data-testid="xp-remaining" className="text-indigo-600 dark:text-indigo-400">
              {xpToNext} XP do awansu ({levelProgress}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              data-testid="xp-progress-bar"
              className="bg-gradient-to-r from-indigo-500 to-violet-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, levelProgress))}%` }}
            />
          </div>
        </div>

        {/* Pasek ogólnej realizacji zadań */}
        <div className="bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
            <span>Ogólny postęp realizacji</span>
            <span data-testid="overall-percentage" className="text-emerald-600 dark:text-emerald-400">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              data-testid="overall-progress-bar"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Galeria Odznak (Badges) */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          Odznaki i Osiągnięcia
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              data-testid={`badge-${badge.id}`}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs transition-all ${
                badge.unlocked
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 shadow-sm'
                  : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200/50 dark:border-slate-800 text-slate-400 opacity-60 grayscale'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{badge.name}</p>
                <p className="text-[11px] text-slate-500 line-clamp-1">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
