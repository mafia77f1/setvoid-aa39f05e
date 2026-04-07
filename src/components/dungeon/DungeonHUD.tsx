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
  <div className="relative w-full h-2.5 bg-black/60 overflow-hidden skew-x-[-15deg] border border-white/5">
    <motion.div
      className="h-full relative"
      initial={{ width: 0 }}
      animate={{ width: `${Math.max(0, (value / max) * 100)}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ 
        background: `linear-gradient(90deg, ${color}CC, ${glowColor})`,
        boxShadow: `0 0 12px ${glowColor}60`
      }}
    >
      {/* تأثير اللمعان المتحرك فوق البار */}
      <div className="absolute inset-0 bg-white/10 w-full h-[1px] top-0" />
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
      className="relative overflow-hidden rounded-sm border-l-4 p-4 backdrop-blur-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(10,10,15,0.95) 0%, rgba(20,20,30,0.85) 100%)',
        borderLeftColor: themeColor,
        borderColor: `${themeColor}40`,
        boxShadow: `inset 0 0 20px ${themeColor}10, 0 10px 30px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Decor Line - خط ديكوري علوي */}
      <div className="absolute top-0 right-0 w-32 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${themeColor})` }} />

      {/* Rank badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase italic opacity-80" style={{ color: themeColor }}>
            System Interface
          </span>
          <span className="text-[7px] text-white/40 font-mono tracking-tighter">PLAYER STATUS MONITOR v4.2</span>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 blur-sm opacity-50 group-hover:opacity-100 transition duration-1000" style={{ background: themeColor }} />
          <span
            className="relative text-[11px] font-black px-3 py-1 bg-black skew-x-[-10deg] border italic"
            style={{ borderColor: themeColor, color: themeColor }}
          >
            {rank}-RANK
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* HP */}
        <div className="relative">
          <div className="flex items-end justify-between mb-1 px-1">
            <div className="flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
              <span className="text-[10px] font-black italic tracking-widest text-white/90">HP</span>
            </div>
            <span className="text-[10px] font-mono text-red-400 font-bold tracking-widest">
              {hp} <span className="text-white/20">/</span> {maxHp}
            </span>
          </div>
          <Bar value={hp} max={maxHp} color="#b91c1c" glowColor="#ff0000" />
        </div>

        {/* Stamina */}
        <div className="relative">
          <div className="flex items-end justify-between mb-1 px-1">
            <div className="flex items-center gap-2">
              <Footprints className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              <span className="text-[10px] font-black italic tracking-widest text-white/90">STAMINA</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest">
              {stamina} <span className="text-white/20">/</span> {maxStamina}
            </span>
          </div>
          <Bar value={stamina} max={maxStamina} color="#059669" glowColor="#10b981" />
        </div>

        {/* Mana */}
        <div className="relative">
          <div className="flex items-end justify-between mb-1 px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
              <span className="text-[10px] font-black italic tracking-widest text-white/90">MANA</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest">
              {mana} <span className="text-white/20">/</span> {maxMana}
            </span>
          </div>
          <Bar value={mana} max={maxMana} color="#0284c7" glowColor="#06b6d4" />
        </div>
      </div>

      {/* Quick stats / Bottom Panel */}
      <div className="grid grid-cols-3 gap-2 mt-5 pt-3 border-t border-white/5">
        <div className="flex flex-col items-center p-1.5 bg-white/[0.03] rounded-sm border border-white/[0.05]">
          <Gem className="w-3 h-3 text-amber-400 mb-1" />
          <span className="text-[10px] text-amber-200 font-black tracking-tighter">{gold.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-center p-1.5 bg-white/[0.03] rounded-sm border border-white/[0.05]">
          <Skull className="w-3 h-3 text-red-500 mb-1" />
          <span className="text-[10px] text-red-200 font-black tracking-tighter">{monstersDefeated}/{totalMonsters}</span>
        </div>
        <div className="flex flex-col items-center p-1.5 bg-white/[0.03] rounded-sm border border-white/[0.05]">
          <Zap className="w-3 h-3 mb-1" style={{ color: themeColor }} />
          <span className="text-[10px] font-black tracking-tighter" style={{ color: themeColor }}>{roomsExplored}/{totalRooms}</span>
        </div>
      </div>
    </div>
  );
};
