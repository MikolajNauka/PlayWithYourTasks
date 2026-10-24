import { GamificationStats, Task, TaskCreateInput } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/tasks`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Nie udało się pobrać zadań');
    return await res.json();
  } catch (err) {
    console.error('Błąd fetchTasks:', err);
    return [];
  }
}

export async function fetchGamificationStats(): Promise<GamificationStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/gamification/stats`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Nie udało się pobrać statystyk');
    return await res.json();
  } catch (err) {
    console.error('Błąd fetchGamificationStats:', err);
    return null;
  }
}

export async function createTask(input: TaskCreateInput): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Błąd podczas tworzenia zadania');
  }
  return await res.json();
}

export async function toggleTask(taskId: number): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/toggle`, {
    method: 'PATCH',
  });
  if (!res.ok) {
    throw new Error('Nie udało się przełączyć statusu zadania');
  }
  return await res.json();
}

export async function deleteTask(taskId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Nie udało się usunąć zadania');
  }
}
