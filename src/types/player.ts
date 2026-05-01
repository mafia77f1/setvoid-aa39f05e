// Player-related types

export type StatType = 'strength' | 'mind' | 'spirit' | 'agility';
export type PlayerRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface PlayerStats {
  strength: number;
  mind: number;
  spirit: number;
  agility: number;
}

export type PlayerLevels = PlayerStats;
