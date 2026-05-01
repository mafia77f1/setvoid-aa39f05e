export interface PunishmentState {
  active: boolean;
  endTime: string | null;
  monstersDefeated: number;
  currentWave: number;
  playerHpInPenalty: number;
  maxHpInPenalty: number;
}
