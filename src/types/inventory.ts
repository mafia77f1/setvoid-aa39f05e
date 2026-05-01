import type { PlayerStats } from './player';
import type { LootRarity } from './boss';

export type InventoryItemType =
  | 'health'
  | 'xp'
  | 'energy'
  | 'revive'
  | 'title'
  | 'tool'
  | 'key'
  | 'reset';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: InventoryItemType;
  category?: string;
  effect: number;
  price: number;
  quantity: number;
  icon: string;
  equipped?: boolean;
}

export type EquipmentSlot = 'head' | 'chest' | 'weapon' | 'legs';

export interface Equipment {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: LootRarity;
  stats: Partial<PlayerStats>;
  bossId?: string;
}
