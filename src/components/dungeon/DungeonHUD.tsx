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
  <div className="w-full h-2.5 bg-black/60 overflow-hidden border border-white/5 skew-x-[-15deg]">
    <motion.div
      className="h-full relative"
      animate={{ width: `${Math.max(0, (value / max) * 100)}%` }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ 
        background: `linear-gradient(90deg, ${color}, ${glowColor})`, 
        boxShadow: `0 0 12px ${glowColor}80` 
      }}
    >
      <div className="absolute inset-0 bg-white/20 h-[1px]" />
    </motion.div>
  </div>
);

export const DungeonHUD = ({
  hp, maxHp, stamina, maxStamina, mana, maxMana,
  gold, monstersDefeated, totalMonsters, roomsExplored, totalRooms,
  themeColor, rank,
}: HUDProps) => {
  return (
    <div
      className="relative overflow-hidden border-l-4 p-4 backdrop-blur-2xl space-y-4"
      style={{
        background: 'linear-gradient(135deg, rgba(5,5,10,0.95) 0%, rgba(15,15,25,0.9) 100%)',
        borderColor: `${themeColor}CC`,
        boxShadow: `inset 0 0 20px ${themeColor}15, 0 10px 40px rgba(0,0,0,0.7)`,
      }}
    >
      {/* Rank badge area */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-black tracking-[0.3em] uppercase italic" style={{ color: themeColor }}>
            SYSTEM STATUS
          </span>
          <div className="h-[1px] w-full mt-0.5" style={{ background: `linear-gradient(90deg, ${themeColor}, transparent)` }} />
        </div>
        <div className="relative">
          <div className="absolute -inset-1 blur-[4px] opacity-30" style={{ background: themeColor }} />
          <span
            className="relative text-[10px] font-black px-3 py-0.5 skew-x-[-15deg] border"
            style={{ background: 'black', color: themeColor, borderColor: themeColor }}
          >
            {rank}-RANK
          </span>
        </div>
      </div>

      {/* HP Section */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/10" />
            <span className="text-[10px] font-black italic text-red-500 tracking-wider">HP</span>
          </div>
          <span className="text-[10px] font-mono text-red-400/90 font-bold tracking-tighter">
            {hp} <span className="opacity-30">/</span> {maxHp}
          </span>
        </div>
        <Bar value={hp} max={maxHp} color="#991b1b" glowColor="#ff1a1a" />
      </div>

      {/* Stamina Section */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
            <span className="text-[10px] font-black italic text-emerald-500 tracking-wider">STAMINA</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400/90 font-bold tracking-tighter">
            {stamina} <span className="opacity-30">/</span> {maxStamina}
          </span>
        </div>
        <Bar value={stamina} max={maxStamina} color="#065f46" glowColor="#10b981" />
      </div>

      {/* Mana Section */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/10" />
            <span className="text-[10px] font-black italic text-cyan-400 tracking-wider">MANA</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400/90 font-bold tracking-tighter">
            {mana} <span className="opacity-30">/</span> {maxMana}
          </span>
        </div>
        <Bar value={mana} max={maxMana} color="#075985" glowColor="#0ea5e9" />
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
        <div className="flex flex-col items-center gap-0.5">
          <Gem className="w-3 h-3 text-amber-400 drop-shadow-[0_0_5px_#fbbf2460]" />
          <span className="text-[10px] text-amber-200 font-black tracking-tight">{gold}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 px-4 border-x border-white/[0.05]">
          <Skull className="w-3 h-3 text-red-500 drop-shadow-[0_0_5px_#ef444460]" />
          <span className="text-[10px] text-red-200 font-black tracking-tight">{monstersDefeated}/{totalMonsters}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <Zap className="w-3 h-3 drop-shadow-[0_0_5px_currentColor]" style={{ color: themeColor }} />
          <span className="text-[10px] font-black tracking-tight" style={{ color: themeColor }}>{roomsExplored}/{totalRooms}</span>
        </div>
      </div>
    </div>
  );
};
