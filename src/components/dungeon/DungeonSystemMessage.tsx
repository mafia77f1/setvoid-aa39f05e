import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, Skull, Award, ArrowUp } from 'lucide-react';
import { SystemMessage } from './DungeonTypes';

interface Props {
  messages: SystemMessage[];
}

const icons = {
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  info: <Info className="w-4 h-4 text-cyan-400" />,
  danger: <Skull className="w-4 h-4 text-red-400" />,
  success: <Award className="w-4 h-4 text-green-400" />,
  levelup: <ArrowUp className="w-4 h-4 text-purple-400" />,
};

const colors = {
  warning: { border: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.1)', text: '#fbbf24', glow: 'rgba(245,158,11,0.3)' },
  info: { border: 'rgba(34,211,238,0.4)', bg: 'rgba(34,211,238,0.1)', text: '#22d3ee', glow: 'rgba(34,211,238,0.3)' },
  danger: { border: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.1)', text: '#ef4444', glow: 'rgba(239,68,68,0.3)' },
  success: { border: 'rgba(34,197,94,0.4)', bg: 'rgba(34,197,94,0.1)', text: '#22c55e', glow: 'rgba(34,197,94,0.3)' },
  levelup: { border: 'rgba(168,85,247,0.4)', bg: 'rgba(168,85,247,0.1)', text: '#a855f7', glow: 'rgba(168,85,247,0.3)' },
};

export const DungeonSystemMessage = ({ messages }: Props) => {
  const visible = messages.slice(-3);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {visible.map((msg) => {
          const style = colors[msg.type];
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-xl font-mono"
              style={{
                background: style.bg,
                borderColor: style.border,
                boxShadow: `0 0 25px ${style.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              {icons[msg.type]}
              <span className="text-[11px] font-bold tracking-wide flex-1" style={{ color: style.text }}>
                {msg.text}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
