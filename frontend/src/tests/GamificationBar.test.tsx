import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { GamificationBar } from '../components/GamificationBar';
import { GamificationStats } from '../lib/types';

describe('GamificationBar Component (Testy jednostkowe frontend)', () => {
  it('powinien poprawnie renderować stan domyślny przy braku danych (null)', () => {
    render(<GamificationBar stats={null} />);

    expect(screen.getByTestId('level-badge')).toHaveTextContent('Poziom 1');
    expect(screen.getByTestId('task-completion-count')).toHaveTextContent('0/0');
    expect(screen.getByTestId('xp-remaining')).toHaveTextContent('100 XP do awansu (0%)');
    expect(screen.getByTestId('overall-percentage')).toHaveTextContent('0%');
  });

  it('powinien poprawnie wyświetlać poziom, punkty XP i szerokość pasków postępu', () => {
    const mockStats: GamificationStats = {
      total_xp: 250,
      level: 3,
      xp_to_next_level: 50,
      level_progress_percentage: 50,
      completed_tasks_count: 3,
      total_tasks_count: 4,
      overall_progress_percentage: 75,
      badges: [
        {
          id: 'first_step',
          name: 'Pierwszy Krok',
          description: 'Ukończ swoje pierwsze zadanie',
          unlocked: true,
          icon: '🎯',
        },
        {
          id: 'task_master_5',
          name: 'Wielozadaniowiec',
          description: 'Ukończ przynajmniej 5 zadań',
          unlocked: false,
          icon: '🚀',
        },
      ],
    };

    render(<GamificationBar stats={mockStats} />);

    expect(screen.getByTestId('level-badge')).toHaveTextContent('Poziom 3');
    expect(screen.getByTestId('task-completion-count')).toHaveTextContent('3/4');
    expect(screen.getByTestId('overall-percentage')).toHaveTextContent('75%');

    const xpBar = screen.getByTestId('xp-progress-bar');
    expect(xpBar).toHaveStyle({ width: '50%' });

    const overallBar = screen.getByTestId('overall-progress-bar');
    expect(overallBar).toHaveStyle({ width: '75%' });

    // Weryfikacja odznak
    const badgeUnlocked = screen.getByTestId('badge-first_step');
    expect(badgeUnlocked).toHaveTextContent('Pierwszy Krok');
    expect(badgeUnlocked.className).toContain('bg-amber-50');

    const badgeLocked = screen.getByTestId('badge-task_master_5');
    expect(badgeLocked).toHaveTextContent('Wielozadaniowiec');
    expect(badgeLocked.className).toContain('grayscale');
  });
});
