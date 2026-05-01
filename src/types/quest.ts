import type { StatType } from './player';

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: StatType;
  xpReward: number;
  completed: boolean;
  dailyReset: boolean;
  difficulty: QuestDifficulty;
  timeLimit?: number;
  condition?: string;
  sets?: number;
  repsPerSet?: number;
  startedAt?: string;
  timerDuration?: number;
  dayOfWeek?: number;
  isMainQuest?: boolean;
  requiredTime?: number;
  timeProgress?: number;
  goldReward?: number;
  active?: boolean;
  claimed?: boolean;
}

export interface PrayerQuest {
  id: string;
  name: string;
  arabicName: string;
  time: string;
  completed: boolean;
  xpReward: number;
}

export interface GrandQuest {
  id: string;
  title: string;
  description: string;
  category: StatType;
  startDate: string;
  endDate: string;
  dailyTasks: string[];
  completedDays: number;
  active: boolean;
}
