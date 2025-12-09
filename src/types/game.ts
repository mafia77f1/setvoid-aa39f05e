export type StatType = 'strength' | 'mind' | 'spirit' | 'quran';

export interface PlayerStats {
  strength: number;
  mind: number;
  spirit: number;
  quran: number;
}

export interface PlayerLevels {
  strength: number;
  mind: number;
  spirit: number;
  quran: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: StatType;
  xpReward: number;
  completed: boolean;
  dailyReset: boolean;
}

export interface Boss {
  id: string;
  name: string;
  description: string;
  maxHp: number;
  currentHp: number;
  requiredQuests: string[];
  defeated: boolean;
  weekStartDate: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  category: StatType;
  unlocked: boolean;
  level: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  icon: string;
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

export interface DailyStats {
  date: string;
  strength: number;
  mind: number;
  spirit: number;
  quran: number;
  questsCompleted: number;
}

export interface GameState {
  playerName: string;
  stats: PlayerStats;
  levels: PlayerLevels;
  quests: Quest[];
  currentBoss: Boss | null;
  abilities: Ability[];
  achievements: Achievement[];
  grandQuest: GrandQuest | null;
  dailyStats: DailyStats[];
  totalQuestsCompleted: number;
  streakDays: number;
  lastActiveDate: string;
}
