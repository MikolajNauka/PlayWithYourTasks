'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { GamificationStats, Task, TaskCreateInput } from '../lib/types';
import { fetchGamificationStats, fetchTasks, createTask, toggleTask, deleteTask } from '../lib/api';
import { Navbar } from '../components/Navbar';
import { GamificationBar } from '../components/GamificationBar';
import { TaskCard } from '../components/TaskCard';
import { AddTaskModal } from '../components/AddTaskModal';
import { CheckSquare, Plus, RefreshCw } from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedTasks, fetchedStats] = await Promise.all([
        fetchTasks(),
        fetchGamificationStats(),
      ]);
      setTasks(fetchedTasks);
      setStats(fetchedStats);
    } catch (err) {
      console.error('Błąd ładowania danych:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTask = async (newTaskData: TaskCreateInput) => {
    const created = await createTask(newTaskData);
    startTransition(() => {
      setTasks((prev) => [created, ...prev]);
    });
    // Odśwież statystyki grywalizacji
    const updatedStats = await fetchGamificationStats();
    setStats(updatedStats);
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      const updated = await toggleTask(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      const updatedStats = await fetchGamificationStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Błąd toggle:', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      const updatedStats = await fetchGamificationStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Błąd usuwania:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.is_completed;
    if (filter === 'completed') return t.is_completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar level={stats?.level} totalXp={stats?.total_xp} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Grywalizacja i Postęp */}
        <GamificationBar stats={stats} />

        {/* Sekcja listy zadań */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold tracking-tight">Twoje Zadania</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {filteredTasks.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Filtry */}
              <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm text-xs font-medium">
                <button
                  type="button"
                  data-testid="filter-all"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === 'all'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Wszystkie
                </button>
                <button
                  type="button"
                  data-testid="filter-active"
                  onClick={() => setFilter('active')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === 'active'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Aktywne
                </button>
                <button
                  type="button"
                  data-testid="filter-completed"
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filter === 'completed'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Ukończone
                </button>
              </div>

              {/* Przycisk dodawania */}
              <button
                type="button"
                data-testid="button-add-task"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Dodaj zadanie
              </button>
            </div>
          </div>

          {/* Lista zadań lub stan pusty */}
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Ładowanie zadań...</span>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div
              data-testid="empty-tasks-placeholder"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                Brak zadań w tej kategorii
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {filter === 'all'
                  ? 'Nie masz jeszcze żadnych zadań. Kliknij przycisk powyżej, aby dodać pierwsze zadanie i zacząć zbierać punkty XP!'
                  : 'Brak zadań pasujących do wybranego filtru.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal dodawania zadania */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}
