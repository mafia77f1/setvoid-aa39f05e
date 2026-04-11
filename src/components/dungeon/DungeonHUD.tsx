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
  <div className="relative w-full h-1.5 bg-black/60 border border-white/5 overflow-hidden shadow-inner">
    <motion.div
      className="h-full relative"
      initial={{ width: 0 }}
      animate={{ width: `${Math.max(0, (value / max) * 100)}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/20" />
      <div className="absolute inset-0 animate-pulse bg-white/20 opacity-30" />
    </motion.div>
  </div>
);

export const DungeonHUD = ({
  hp, maxHp, stamina, maxStamina, mana, maxMana,
  gold, monstersDefeated, totalMonsters, roomsExplored, totalRooms,
  themeColor, rank,
}: HUDProps) => {
  return (
    <div className="relative w-64 border overflow-hidden shadow-2xl font-sans" 
      style={{ 
        background: 'linear-gradient(180deg, rgba(15, 15, 25, 0.98) 0%, rgba(5, 5, 10, 0.99) 100%)',
        borderColor: `${themeColor}80`,
        boxShadow: `0 0 15px ${themeColor}15, inset 0 0 10px rgba(0,0,0,0.5)`
      }}>
      
      {/* Solo Leveling Decorative Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: themeColor }} />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: themeColor }} />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: themeColor }} />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: themeColor }} />
      
      {/* Scanning Line Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none" 
        style={{ background: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)', backgroundSize: '100% 3px' }} 
      />

      {/* Header - Compact */}
      <div className="relative py-1.5 px-3 border-b flex justify-between items-center bg-white/5 backdrop-blur-sm" style={{ borderColor: `${themeColor}40` }}>
        <h2 className="text-[9px] font-black tracking-[0.3em] italic uppercase italic" style={{ color: themeColor, textShadow: `0 0 8px ${themeColor}60` }}>
          STATUS
        </h2>
        <div className="flex items-center gap-1.5">
           <span className="text-[7px] text-white/30 font-bold tracking-widest">RANK</span>
           <span className="text-xs font-black italic" style={{ color: themeColor }}>
            {rank}
           </span>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* HP Section */}
        <div className="relative">
          <div className="flex justify-between items-center mb-0.5 px-0.5">
            <div className="flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-red-500 fill-red-500/10" />
              <span className="text-[9px] font-black tracking-tighter text-white/60">HP</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-red-400">
              {hp}<span className="text-white/20 mx-0.5">/</span>{maxHp}
            </span>
          </div>
          <Bar value={hp} max={maxHp} color="#ff2e2e" />
        </div>

        {/* MP Section (Mana) */}
        <div className="relative">
          <div className="flex justify-between items-center mb-0.5 px-0.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-400 fill-blue-400/10" />
              <span className="text-[9px] font-black tracking-tighter text-white/60">MP</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-400">
              {mana}<span className="text-white/20 mx-0.5">/</span>{maxMana}
            </span>
          </div>
          <Bar value={mana} max={maxMana} color="#00a3ff" />
        </div>

        {/* Stamina Section */}
        <div className="relative">
          <div className="flex justify-between items-center mb-0.5 px-0.5">
            <div className="flex items-center gap-1.5">
              <Footprints className="w-3 h-3 text-emerald-500 fill-emerald-500/10" />
              <span className="text-[9px] font-black tracking-tighter text-white/60">STAMINA</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400">
              {stamina}<span className="text-white/20 mx-0.5">/</span>{maxStamina}
            </span>
          </div>
          <Bar value={stamina} max={maxStamina} color="#00ff9d" />
        </div>

        {/* Bottom Grid Stats - Minimalist */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5">
          <div className="flex flex-col items-center py-1 bg-white/[0.02] border border-white/5">
            <Gem className="w-3 h-3 text-amber-400 opacity-80" />
            <span className="text-[10px] font-black text-amber-200 mt-0.5">{gold}</span>
            <span className="text-[6px] text-white/20 uppercase font-black">GOLD</span>
          </div>
          <div className="flex flex-col items-center py-1 bg-white/[0.02] border border-white/5">
            <Skull className="w-3 h-3 text-red-500 opacity-80" />
            <span className="text-[10px] font-black text-red-200 mt-0.5">{monstersDefeated}</span>
            <span className="text-[6px] text-white/20 uppercase font-black">KILLS</span>
          </div>
          <div className="flex flex-col items-center py-1 bg-white/[0.02] border border-white/5">
            <Zap className="w-3 h-3 opacity-80" style={{ color: themeColor }} />
            <span className="text-[10px] font-black mt-0.5" style={{ color: themeColor }}>{roomsExplored}</span>
            <span className="text-[6px] text-white/20 uppercase font-black">ROOMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
