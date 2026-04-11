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
  <div className="relative w-full h-[3px] bg-black/90 border border-white/5 overflow-hidden">
    <motion.div
      className="h-full relative"
      initial={{ width: 0 }}
      animate={{ width: `${Math.max(0, (value / max) * 100)}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-40" />
    </motion.div>
  </div>
);

export const DungeonHUD = ({
  hp, maxHp, stamina, maxStamina, mana, maxMana,
  gold, monstersDefeated, totalMonsters, roomsExplored, totalRooms,
  themeColor, rank,
}: HUDProps) => {
  return (
    <div className="relative w-48 border overflow-hidden shadow-xl" 
      style={{ 
        background: 'rgba(5, 5, 8, 0.99)',
        borderColor: `${themeColor}B0`,
        boxShadow: `0 0 8px ${themeColor}15`
      }}>
      
      {/* Solo Leveling Corner Accents */}
      <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: themeColor }} />
      <div className="absolute top-0 right-0 w-1 h-1 border-t border-r" style={{ borderColor: themeColor }} />
      <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l" style={{ borderColor: themeColor }} />
      <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r" style={{ borderColor: themeColor }} />

      {/* Header */}
      <div className="relative py-0.5 px-2 border-b flex justify-between items-center bg-white/5" style={{ borderColor: `${themeColor}50` }}>
        <h2 className="text-[7px] font-black tracking-tighter italic uppercase" style={{ color: themeColor }}>
          SYSTEM
        </h2>
        <div className="flex items-center gap-1">
           <span className="text-[6px] text-white/30 font-bold">LVL</span>
           <span className="text-[10px] font-black italic leading-none" style={{ color: themeColor }}>
            {rank}
           </span>
        </div>
      </div>

      <div className="p-2 space-y-2">
        {/* HP */}
        <div>
          <div className="flex justify-between items-center mb-0.5">
            <div className="flex items-center gap-1">
              <Heart className="w-2 h-2 text-red-500 fill-red-500/20" />
              <span className="text-[7px] font-bold text-white/40 italic">HP</span>
            </div>
            <span className="text-[8px] font-mono font-bold text-red-400 leading-none">
              {hp}<span className="opacity-20">/</span>{maxHp}
            </span>
          </div>
          <Bar value={hp} max={maxHp} color="#ef4444" />
        </div>

        {/* MP */}
        <div>
          <div className="flex justify-between items-center mb-0.5">
            <div className="flex items-center gap-1">
              <Sparkles className="w-2 h-2 text-blue-400 fill-blue-400/20" />
              <span className="text-[7px] font-bold text-white/40 italic">MP</span>
            </div>
            <span className="text-[8px] font-mono font-bold text-blue-400 leading-none">
              {mana}<span className="opacity-20">/</span>{maxMana}
            </span>
          </div>
          <Bar value={mana} max={maxMana} color="#3b82f6" />
        </div>

        {/* Stamina */}
        <div>
          <div className="flex justify-between items-center mb-0.5">
            <div className="flex items-center gap-1">
              <Footprints className="w-2 h-2 text-emerald-500 fill-emerald-500/20" />
              <span className="text-[7px] font-bold text-white/40 italic">STAM</span>
            </div>
            <span className="text-[8px] font-mono font-bold text-emerald-400 leading-none">
              {stamina}<span className="opacity-20">/</span>{maxStamina}
            </span>
          </div>
          <Bar value={stamina} max={maxStamina} color="#10b981" />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-3 gap-0.5 pt-1 border-t border-white/5">
          <div className="flex items-center justify-center gap-1 py-0.5 bg-white/5">
            <Gem className="w-2 h-2 text-amber-400" />
            <span className="text-[8px] font-black text-amber-200 leading-none">{gold}</span>
          </div>
          <div className="flex items-center justify-center gap-1 py-0.5 bg-white/5">
            <Skull className="w-2 h-2 text-red-500" />
            <span className="text-[8px] font-black text-red-100 leading-none">{monstersDefeated}</span>
          </div>
          <div className="flex items-center justify-center gap-1 py-0.5 bg-white/5">
            <Zap className="w-2 h-2" style={{ color: themeColor }} />
            <span className="text-[8px] font-black leading-none" style={{ color: themeColor }}>{roomsExplored}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
