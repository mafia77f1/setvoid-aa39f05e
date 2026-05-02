import { motion } from 'framer-motion';
import { Award, Gem, Skull, Sparkles, ArrowLeft } from 'lucide-react';

interface Props {
  rank: string;
  gold: number;
  xp: number;
  monstersDefeated: number;
  treasuresFound: number;
  roomsExplored: number;
  themeColor: string;
  onExit: () => void;
}

export const DungeonClearedScreen = ({ rank, gold, xp, monstersDefeated, treasuresFound, roomsExplored, themeColor, onExit }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center p-8"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(34,197,94,0.08), rgba(0,0,0,0.97) 70%)' }}
    >
      {/* Particle burst */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ background: i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#f59e0b' : themeColor, left: '50%', top: '50%' }}
            animate={{
              x: [0, (Math.random() - 0.5) * 500],
              y: [0, (Math.random() - 0.5) * 500],
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{ duration: 2.5, delay: Math.random() * 0.8, ease: 'easeOut' }}
          />
        ))}
      </div>

      <motion.div
        className="text-center space-y-8 relative z-10"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', damping: 15 }}
      >
        {/* Title */}
        <div>
          <motion.div
            className="text-7xl mb-4"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏆
          </motion.div>
          <motion.h1
            className="text-4xl font-black tracking-[0.3em] uppercase"
            style={{ color: '#22c55e', textShadow: '0 0 40px rgba(34,197,94,0.5)' }}
            initial={{ letterSpacing: '1em', opacity: 0 }}
            animate={{ letterSpacing: '0.3em', opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            CLEARED
          </motion.h1>
          <motion.p
            className="text-sm font-mono tracking-[0.5em] uppercase mt-2"
            style={{ color: 'rgba(34,197,94,0.6)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            RANK {rank} DUNGEON
          </motion.p>
        </div>

        {/* Rewards */}
        <motion.div
          className="space-y-3 w-72"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="text-[9px] font-mono tracking-[0.4em] uppercase text-center" style={{ color: 'rgba(34,197,94,0.5)' }}>
            — REWARDS —
          </div>
          
          {[
            { icon: <Gem className="w-4 h-4 text-amber-400" />, label: 'ذهب', value: `+${gold}`, color: '#fbbf24' },
            { icon: <Sparkles className="w-4 h-4 text-cyan-400" />, label: 'XP', value: `+${xp}`, color: '#22d3ee' },
            { icon: <Skull className="w-4 h-4 text-red-400" />, label: 'وحوش', value: `${monstersDefeated}`, color: '#ef4444' },
            { icon: <Award className="w-4 h-4 text-amber-300" />, label: 'كنوز', value: `${treasuresFound}`, color: '#fcd34d' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.4 + i * 0.15 }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl border"
              style={{ background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              {item.icon}
              <span className="text-xs text-muted-foreground flex-1">{item.label}</span>
              <span className="text-sm font-black font-mono" style={{ color: item.color }}>{item.value}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Exit button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExit}
          className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 font-bold text-sm mx-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))',
            borderColor: 'rgba(34,197,94,0.4)',
            color: '#22c55e',
            boxShadow: '0 0 30px rgba(34,197,94,0.2)',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          خروج من المغارة
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
