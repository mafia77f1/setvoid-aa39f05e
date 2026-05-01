import type { StatType } from './player';

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
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ShadowSoldier {
  id: string;
  name: string;
  arabicName: string;
  type: StatType;
  level: number;
  power: number;
  unlocked: boolean;
  cost: number;
}

export interface DailyStats {
  date: string;
  strength: number;
  mind: number;
  spirit: number;
  agility: number;
  questsCompleted: number;
}
