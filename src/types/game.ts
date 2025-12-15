export type StatType = 'strength' | 'mind' | 'spirit' | 'vitality' | 'quran';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
export type PlayerRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface PlayerStats {
  strength: number;
  mind: number;
  spirit: number;
  vitality: number;
  quran: number;
}

export interface PlayerLevels {
  strength: number;
  mind: number;
  spirit: number;
  vitality: number;
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
  sets?: number; // For exercise quests - number of sets
  repsPerSet?: number; // Reps per set
  startedAt?: string; // When quest was started
  timerDuration?: number; // Timer duration in seconds
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
  level?: number;
  attackPower?: number;
  dungeonLevel?: number; // 0-2, higher = more shadow points
  loot?: BossLoot[];
}

export interface BossLoot {
  id: string;
  name: string;
  type: 'gold' | 'shadowPoints' | 'equipment' | 'xp';
  amount: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ShadowSoldier {
  id: string;
  name: string;
  arabicName: string;
  type: StatType;
  level: number;
  power: number;
  unlocked: boolean;
  cost: number; // Shadow points cost
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
  vitality: number;
  quran: number;
  questsCompleted: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'health' | 'xp' | 'energy' | 'revive';
  effect: number;
  price: number;
  quantity: number;
  icon: string;
}

export interface Equipment {
  id: string;
  name: string;
  slot: 'head' | 'chest' | 'weapon' | 'legs';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats: Partial<PlayerStats>;
  bossId?: string; // Dropped from which boss
}

export interface PrayerQuest {
  id: string;
  name: string;
  arabicName: string;
  time: string;
  completed: boolean;
  xpReward: number;
}

export interface PunishmentState {
  active: boolean;
  endTime: string | null;
  monstersDefeated: number;
  currentWave: number;
  playerHpInPenalty: number;
  maxHpInPenalty: number;
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
  shadowPoints: number;
  
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
  shadowSoldiers: ShadowSoldier[];
  equipment: Equipment[];
  
  // Progress
  dailyStats: DailyStats[];
  totalQuestsCompleted: number;
  streakDays: number;
  lastActiveDate: string;
  
  // Punishment System
  punishmentEndTime: string | null;
  missedQuestsCount: number;
  punishment: PunishmentState;
  
  // Settings
  selectedReciter: string;
  soundEnabled: boolean;
  
  // Boss damage tracking
  lastBossAttackTime: string | null;
}
