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
  <div className="relative w-full h-3 bg-black/40 border border-white/10 overflow-hidden group">
    <motion.div
      className="h-full relative"
      initial={{ width: 0 }}
      animate={{ width: `${Math.max(0, (value / max) * 100)}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ backgroundColor: color }}
    >
      {/* تأثير اللمعان المتحرك (Glow Effect) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-pulse" />
    </motion.div>
  </div>
);

export const DungeonHUD = ({
  hp, maxHp, stamina, maxStamina, mana, maxMana,
  gold, monstersDefeated, totalMonsters, roomsExplored, totalRooms,
  themeColor, rank,
}: HUDProps) => {
  return (
    <div className="relative border-2 overflow-hidden shadow-2xl" 
      style={{ 
        background: 'rgba(10, 10, 15, 0.95)',
        borderColor: `${themeColor}60`,
        boxShadow: `0 0 20px ${themeColor}20`
      }}>
      
      {/* عناصر التزيين (Solo Leveling Decorations) */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: themeColor }} />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: themeColor }} />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: themeColor }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: themeColor }} />
      
      {/* خط المسح (Scan Line) */}
      <div className="absolute inset-0 pointer-events-none opacity-10" 
        style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.1) 50%)', backgroundSize: '100% 4px' }} 
      />

      {/* Header - الحالة */}
      <div className="relative py-2 px-4 border-b flex justify-between items-center bg-white/5" style={{ borderColor: `${themeColor}30` }}>
        <h2 className="text-[10px] font-black tracking-[0.4em] italic uppercase" style={{ color: themeColor }}>
          STATUS WINDOW
        </h2>
        <div className="flex items-center gap-2">
           <span className="text-[8px] text-white/40 font-mono tracking-tighter">RANK</span>
           <span className="text-sm font-black italic underline decoration-2" style={{ color: themeColor }}>
            {rank}
           </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* HP Section */}
        <div className="relative">
          <div className="flex justify-between items-end mb-1">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
              <span className="text-[11px] font-bold tracking-widest text-white/80">HP</span>
            </div>
            <span className="text-xs font-mono font-bold text-red-400">
              {hp} <span className="text-white/20">/</span> {maxHp}
            </span>
          </div>
          <Bar value={hp} max={maxHp} color="#ef4444" />
        </div>

        {/* Stamina Section */}
        <div className="relative">
          <div className="flex justify-between items-end mb-1">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
              <span className="text-[11px] font-bold tracking-widest text-white/80">STAMINA</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {stamina} <span className="text-white/20">/</span> {maxStamina}
            </span>
          </div>
          <Bar value={stamina} max={maxStamina} color="#10b981" />
        </div>

        {/* Mana Section */}
        <div className="relative">
          <div className="flex justify-between items-end mb-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 fill-blue-400/20" />
              <span className="text-[11px] font-bold tracking-widest text-white/80">MANA</span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-400">
              {mana} <span className="text-white/20">/</span> {maxMana}
            </span>
          </div>
          <Bar value={mana} max={maxMana} color="#3b82f6" />
        </div>

        {/* Stats Grid - الاحصائيات السفلى */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
          <div className="flex flex-col items-center p-2 rounded bg-white/[0.03] border border-white/[0.05]">
            <Gem className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[12px] font-black text-amber-200 tracking-tighter">{gold}</span>
            <span className="text-[7px] text-white/30 uppercase font-bold">GOLD</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded bg-white/[0.03] border border-white/[0.05]">
            <Skull className="w-4 h-4 text-red-500 mb-1" />
            <span className="text-[12px] font-black text-red-200 tracking-tighter">{monstersDefeated}/{totalMonsters}</span>
            <span className="text-[7px] text-white/30 uppercase font-bold">KILLS</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded bg-white/[0.03] border border-white/[0.05]">
            <Zap className="w-4 h-4 mb-1" style={{ color: themeColor }} />
            <span className="text-[12px] font-black tracking-tighter" style={{ color: themeColor }}>{roomsExplored}/{totalRooms}</span>
            <span className="text-[7px] text-white/30 uppercase font-bold">ROOMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
