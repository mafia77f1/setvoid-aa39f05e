import { Heart, Zap, Sparkles, Footprints, Skull, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

interface HUDProps {
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  mana: number;
  maxMana: number;
  gold: number;
  monstersDefeated: number;
  totalMonsters: number;
  roomsExplored: number;
  totalRooms: number;
  themeColor: string;
  rank: string;
}

const Bar = ({ value, max, color, glowColor }: { value: number; max: number; color: string; glowColor: string }) => (
  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${glowColor}30` }}>
    <motion.div
      className="h-full rounded-full"
      animate={{ width: `${Math.max(0, (value / max) * 100)}%` }}
      transition={{ duration: 0.4 }}
      style={{ background: `linear-gradient(90deg, ${color}, ${glowColor})`, boxShadow: `0 0 8px ${glowColor}50` }}
    />
  </div>
);

export const DungeonHUD = ({
  hp, maxHp, stamina, maxStamina, mana, maxMana,
  gold, monstersDefeated, totalMonsters, roomsExplored, totalRooms,
  themeColor, rank,
}: HUDProps) => {
  return (
    <div
      className="rounded-xl border p-3 backdrop-blur-xl space-y-2.5"
      style={{
        background: 'rgba(0,0,0,0.85)',
        borderColor: `${themeColor}25`,
        boxShadow: `0 0 15px ${themeColor}10`,
      }}
    >
      {/* Rank badge */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[8px] font-mono tracking-[0.4em] uppercase" style={{ color: `${themeColor}70` }}>
          HUNTER STATUS
        </span>
        <span
          className="text-[9px] font-black px-2 py-0.5 rounded-md"
          style={{ background: `${themeColor}20`, color: themeColor, border: `1px solid ${themeColor}40` }}
        >
          {rank}-RANK
        </span>
      </div>

      {/* HP */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <Heart className="w-3 h-3 text-red-500" />
          <span className="text-[9px] font-bold text-red-400">HP</span>
          <span className="text-[8px] text-red-400/60 mr-auto font-mono">{hp}/{maxHp}</span>
        </div>
        <Bar value={hp} max={maxHp} color="#dc2626" glowColor="#ef4444" />
      </div>

      {/* Stamina */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <Footprints className="w-3 h-3 text-green-500" />
          <span className="text-[9px] font-bold text-green-400">STAMINA</span>
          <span className="text-[8px] text-green-400/60 mr-auto font-mono">{stamina}/{maxStamina}</span>
        </div>
        <Bar value={stamina} max={maxStamina} color="#16a34a" glowColor="#22c55e" />
      </div>

      {/* Mana */}
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span className="text-[9px] font-bold text-blue-400">MANA</span>
          <span className="text-[8px] text-blue-400/60 mr-auto font-mono">{mana}/{maxMana}</span>
        </div>
        <Bar value={mana} max={maxMana} color="#2563eb" glowColor="#3b82f6" />
      </div>

      {/* Quick stats */}
      <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-1">
          <Gem className="w-3 h-3 text-amber-400" />
          <span className="text-[9px] text-amber-300 font-bold">{gold}</span>
        </div>
        <div className="flex items-center gap-1">
          <Skull className="w-3 h-3 text-red-400" />
          <span className="text-[9px] text-red-300 font-bold">{monstersDefeated}/{totalMonsters}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" style={{ color: themeColor }} />
          <span className="text-[9px] font-bold" style={{ color: themeColor }}>{roomsExplored}/{totalRooms}</span>
        </div>
      </div>
    </div>
  );
};
