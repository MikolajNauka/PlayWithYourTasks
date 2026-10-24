import React from 'react';
import { Task, Priority } from '../lib/types';
import { Check, Trash2, Zap } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  isLoading?: boolean;
}

const priorityStyles: Record<Priority, { label: string; badgeClass: string }> = {
  low: {
    label: 'Niski',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  },
  medium: {
    label: 'Średni',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
  },
  high: {
    label: 'Wysoki',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  },
  urgent: {
    label: 'Pilny',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, isLoading = false }) => {
  const priorityInfo = priorityStyles[task.priority] || priorityStyles.medium;

  return (
    <div
      data-testid={`task-item-${task.id}`}
      className={`group flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
        task.is_completed
          ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-75'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow hover:border-indigo-200 dark:hover:border-indigo-900'
      }`}
    >
      {/* Przycisk Checkbox do odznaczania */}
      <button
        type="button"
        data-testid={`task-toggle-${task.id}`}
        disabled={isLoading}
        onClick={() => onToggle(task.id)}
        aria-label={task.is_completed ? 'Oznacz jako nieukończone' : 'Oznacz jako ukończone'}
        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
          task.is_completed
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-slate-800'
        }`}
      >
        {task.is_completed && <Check className="w-4 h-4 stroke-[3]" />}
      </button>

      {/* Szczegóły zadania */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span
            data-testid="task-priority-badge"
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${priorityInfo.badgeClass}`}
          >
            {priorityInfo.label}
          </span>

          {task.category && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {task.category}
            </span>
          )}

          <span className="ml-auto text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/50">
            <Zap className="w-3 h-3 fill-amber-500" />+{task.xp_reward} XP
          </span>
        </div>

        <h3
          data-testid="task-title"
          className={`text-sm font-semibold text-slate-900 dark:text-slate-100 ${
            task.is_completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
          }`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p
            data-testid="task-description"
            className={`text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 ${
              task.is_completed ? 'line-through opacity-70' : ''
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Przycisk usuwania */}
      <button
        type="button"
        data-testid={`task-delete-${task.id}`}
        disabled={isLoading}
        onClick={() => onDelete(task.id)}
        aria-label="Usuń zadanie"
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
