export type LootRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BossLoot {
  id: string;
  name: string;
  type: 'gold' | 'shadowPoints' | 'equipment' | 'xp';
  amount: number;
  rarity: LootRarity;
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
  dungeonLevel?: number;
  loot?: BossLoot[];
}
