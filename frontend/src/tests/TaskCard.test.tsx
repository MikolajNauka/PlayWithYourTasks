import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../lib/types';

describe('TaskCard Component (Testy jednostkowe frontend)', () => {
  const mockTask: Task = {
    id: 42,
    title: 'Napisać testy jednostkowe',
    description: 'Użyć Vitest i React Testing Library',
    priority: 'high',
    category: 'Projekt',
    is_completed: false,
    xp_reward: 100,
    created_at: new Date().toISOString(),
    completed_at: null,
  };

  it('powinien poprawnie wyświetlać dane zadania (tytuł, opis, priorytet, XP)', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    );

    expect(screen.getByTestId('task-title')).toHaveTextContent('Napisać testy jednostkowe');
    expect(screen.getByTestId('task-description')).toHaveTextContent('Użyć Vitest i React Testing Library');
    expect(screen.getByTestId('task-priority-badge')).toHaveTextContent('Wysoki');
    expect(screen.getByText('+100 XP')).toBeInTheDocument();
  });

  it('powinien wywołać onToggle po kliknięciu przycisku ukończenia', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    );

    const toggleBtn = screen.getByTestId('task-toggle-42');
    fireEvent.click(toggleBtn);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(42);
  });

  it('powinien wywołać onDelete po kliknięciu przycisku usuwania', () => {
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    );

    const deleteBtn = screen.getByTestId('task-delete-42');
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(42);
  });
});
