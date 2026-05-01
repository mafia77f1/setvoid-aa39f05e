import type { PlayerStats, PlayerLevels } from './player';
import type { Quest, PrayerQuest, GrandQuest } from './quest';
import type { Boss } from './boss';
import type { Gate } from './gate';
import type { InventoryItem, Equipment } from './inventory';
import type { Ability, Achievement, ShadowSoldier, DailyStats } from './progression';
import type { PunishmentState } from './punishment';

export interface GameState {
  // Player Info
  playerName: string;
  playerTitle: string;
  equippedTitle?: string;
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
  gates: Gate[];

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
