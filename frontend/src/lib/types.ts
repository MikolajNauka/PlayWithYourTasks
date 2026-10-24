export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  is_completed: boolean;
  xp_reward: number;
  created_at: string;
  completed_at: string | null;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  priority: Priority;
  category?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface GamificationStats {
  total_xp: number;
  level: number;
  xp_to_next_level: number;
  level_progress_percentage: number;
  completed_tasks_count: number;
  total_tasks_count: number;
  overall_progress_percentage: number;
  badges: Badge[];
}
