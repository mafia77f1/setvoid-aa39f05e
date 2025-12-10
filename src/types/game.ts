export type StatType = 'strength' | 'mind' | 'spirit' | 'quran';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
export type PlayerRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

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
  difficulty: QuestDifficulty;
  timeLimit?: number; // in minutes
  condition?: string;
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
  customName?: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  category: StatType;
  unlocked: boolean;
  level: number;
  cooldownDays: number;
  lastUsed?: string;
  effect?: string;
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

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'health' | 'xp' | 'energy';
  effect: number;
  price: number;
  quantity: number;
  icon: string;
}

export interface PrayerQuest {
  id: string;
  name: string;
  arabicName: string;
  time: string;
  completed: boolean;
  xpReward: number;
}

export interface GameState {
  // Player Info
  playerName: string;
  playerTitle: string;
  playerJob: string;
  isOnboarded: boolean;
  
  // Player Resources
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  
  // Stats & Levels
  stats: PlayerStats;
  levels: PlayerLevels;
  totalLevel: number;
  
  // Game Content
  quests: Quest[];
  currentBoss: Boss | null;
  abilities: Ability[];
  achievements: Achievement[];
  grandQuest: GrandQuest | null;
  inventory: InventoryItem[];
  prayerQuests: PrayerQuest[];
  
  // Progress
  dailyStats: DailyStats[];
  totalQuestsCompleted: number;
  streakDays: number;
  lastActiveDate: string;
  
  // Punishment System
  punishmentEndTime: string | null;
  missedQuestsCount: number;
  
  // Settings
  selectedReciter: string;
  soundEnabled: boolean;
}
