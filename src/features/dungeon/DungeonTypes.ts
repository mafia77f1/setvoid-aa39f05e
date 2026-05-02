export interface Position {
  x: number;
  y: number;
}

export type RoomType = 'empty' | 'monster' | 'treasure' | 'boss' | 'start' | 'trap';

export interface DungeonRoom {
  x: number;
  y: number;
  type: RoomType;
  revealed: boolean;
  visited: boolean;
  description: string;
  monster?: MonsterData;
  treasure?: TreasureData;
  trap?: TrapData;
  cleared: boolean;
}

export interface MonsterData {
  name: string;
  icon: string;
  hp: number;
  maxHp: number;
  damage: number;
  xpReward: number;
  goldReward: number;
  defeated: boolean;
  task: string; // Real-world task to defeat
  taskDuration?: number; // minutes
}

export interface TreasureData {
  name: string;
  icon: string;
  type: 'gold' | 'stat' | 'item';
  amount: number;
  statType?: 'STR' | 'INT' | 'AGI' | 'SPI';
  collected: boolean;
  task: string; // Small habit to collect
}

export interface TrapData {
  name: string;
  damage: number;
  description: string;
}

export interface StaminaTask {
  id: string;
  text: string;
  icon: string;
  staminaReward: number;
  completed: boolean;
}

export interface SystemMessage {
  id: string;
  text: string;
  type: 'warning' | 'info' | 'danger' | 'success' | 'levelup';
  timestamp: number;
}

export interface DungeonState {
  grid: DungeonRoom[][];
  playerPos: Position;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  mana: number;
  maxMana: number;
  gold: number;
  xp: number;
  monstersDefeated: number;
  totalMonsters: number;
  treasuresFound: number;
  totalTreasures: number;
  roomsExplored: number;
  totalRooms: number;
  cleared: boolean;
  staminaTasks: StaminaTask[];
  systemMessages: SystemMessage[];
}
