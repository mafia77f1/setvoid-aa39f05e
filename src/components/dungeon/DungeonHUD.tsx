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

const Bar = ({ value, max, color }: { value: number; max: number; color: string }) => (
  <div className="relative w-full h-1 bg-black/80 border border-white/5 overflow-hidden">
    <motion.div
      className="h-full relative"
      initial={{ width: 0 }}
      animate={{ width: `${Math.max(0, (value / max) * 100)}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent" />
    </motion.div>
  </div>
);

export const DungeonHUD = ({
  hp, maxHp, stamina, maxStamina, mana, maxMana,
  gold, monstersDefeated, totalMonsters, roomsExplored, totalRooms,
  themeColor, rank,
}: HUDProps) => {
  return (
    <div className="relative w-56 border overflow-hidden shadow-2xl" 
      style={{ 
        background: 'rgba(5, 5, 10, 0.98)',
        borderColor: `${themeColor}90`,
        boxShadow: `0 0 10px ${themeColor}20`
      }}>
      
      {/* Solo Leveling Corner Accents */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l" style={{ borderColor: themeColor }} />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r" style={{ borderColor: themeColor }} />
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l" style={{ borderColor: themeColor }} />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r" style={{ borderColor: themeColor }} />

      {/* Mini Header */}
      <div className="relative py-1 px-2 border-b flex justify-between items-center bg-white/5" style={{ borderColor: `${themeColor}40` }}>
        <h2 className="text-[8px] font-black tracking-widest italic uppercase" style={{ color: themeColor }}>
          STATUS
        </h2>
        <div className="flex items-center gap-1">
           <span className="text-[7px] text-white/40 font-bold">RANK</span>
           <span className="text-[11px] font-black italic" style={{ color: themeColor }}>
            {rank}
           </span>
        </div>
      </div>

      <div className="p-2.5 space-y-2.5">
        {/* HP */}
        <div className="relative">
          <div className="flex justify-between items-center mb-0.5">
            <div className="flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500/20" />
              <span className="text-[8px] font-black text-white/50">HP</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-red-400">
              {hp}<span className="opacity-20 mx-0.5">/</span>{maxHp}
            </span>
          </div>
          <Bar value={hp} max={maxHp} color="#ef4444" />
        </div>

        {/* Mana */}
        <div className="relative">
          <div className="flex justify-between items-center mb-0.5">
            <div className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-blue-400 fill-blue-400/20" />
              <span className="text-[8px] font-black text-white/50">MP</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-blue-400">
              {mana}<span className="opacity-20 mx-0.5">/</span>{maxMana}
            </span>
          </div>
          <Bar value={mana} max={maxMana} color="#3b82f6" />
        </div>

        {/* Stamina */}
        <div className="relative">
          <div className="flex justify-between items-center mb-0.5">
            <div className="flex items-center gap-1">
              <Footprints className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500/20" />
              <span className="text-[8px] font-black text-white/50">STAMINA</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-emerald-400">
              {stamina}<span className="opacity-20 mx-0.5">/</span>{maxStamina}
            </span>
          </div>
          <Bar value={stamina} max={maxStamina} color="#10b981" />
        </div>

        {/* Bottom Stats Grid */}
        <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-white/10">
          <div className="flex flex-col items-center py-0.5 bg-white/5 border border-white/[0.03]">
            <Gem className="w-2.5 h-2.5 text-amber-400 mb-0.5" />
            <span className="text-[9px] font-black text-amber-200 leading-none">{gold}</span>
          </div>
          <div className="flex flex-col items-center py-0.5 bg-white/5 border border-white/[0.03]">
            <Skull className="w-2.5 h-2.5 text-red-500 mb-0.5" />
            <span className="text-[9px] font-black text-red-200 leading-none">{monstersDefeated}</span>
          </div>
          <div className="flex flex-col items-center py-0.5 bg-white/5 border border-white/[0.03]">
            <Zap className="w-2.5 h-2.5 mb-0.5" style={{ color: themeColor }} />
            <span className="text-[9px] font-black leading-none" style={{ color: themeColor }}>{roomsExplored}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
