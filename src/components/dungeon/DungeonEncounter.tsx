import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Gift, AlertTriangle, Skull, Check, X, Footprints } from 'lucide-react';
import { DungeonRoom, StaminaTask } from './DungeonTypes';

interface EncounterProps {
  room: DungeonRoom | null;
  onDefeatMonster: () => void;
  onCollectTreasure: () => void;
  onDismiss: () => void;
  themeColor: string;
}

export const DungeonEncounter = ({ room, onDefeatMonster, onCollectTreasure, onDismiss, themeColor }: EncounterProps) => {
  if (!room) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-6"
        style={{ background: 'rgba(0,0,0,0.88)' }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 30 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative w-full max-w-sm rounded-2xl border-2 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(10,10,20,0.98), rgba(5,5,15,0.99))',
            borderColor: room.type === 'monster' || room.type === 'boss'
              ? 'rgba(239,68,68,0.4)'
              : room.type === 'treasure'
              ? 'rgba(245,158,11,0.4)'
              : room.type === 'trap'
              ? 'rgba(168,85,247,0.4)'
              : `${themeColor}30`,
            boxShadow: room.type === 'boss'
              ? '0 0 80px rgba(239,68,68,0.3), inset 0 0 40px rgba(239,68,68,0.05)'
              : '0 0 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Glitch scanlines for boss */}
          {room.type === 'boss' && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              animate={{ opacity: [0, 0.1, 0, 0.15, 0] }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.1) 2px, rgba(239,68,68,0.1) 4px)',
              }}
            />
          )}

          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3 border-b"
            style={{
              background: room.type === 'monster' || room.type === 'boss'
                ? 'linear-gradient(90deg, rgba(239,68,68,0.1), transparent)'
                : room.type === 'treasure'
                ? 'linear-gradient(90deg, rgba(245,158,11,0.1), transparent)'
                : 'linear-gradient(90deg, rgba(168,85,247,0.1), transparent)',
              borderColor: 'rgba(255,255,255,0.05)',
            }}
          >
            {room.type === 'monster' || room.type === 'boss' ? (
              <Skull className="w-5 h-5 text-red-400" />
            ) : room.type === 'treasure' ? (
              <Gift className="w-5 h-5 text-amber-400" />
            ) : room.type === 'trap' ? (
              <AlertTriangle className="w-5 h-5 text-purple-400" />
            ) : (
              <Footprints className="w-5 h-5" style={{ color: themeColor }} />
            )}
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold" style={{
              color: room.type === 'monster' || room.type === 'boss' ? '#ef4444'
                : room.type === 'treasure' ? '#f59e0b'
                : room.type === 'trap' ? '#a855f7'
                : themeColor
            }}>
              {room.type === 'boss' ? '⚠ BOSS ENCOUNTER' :
               room.type === 'monster' ? 'MONSTER ENCOUNTER' :
               room.type === 'treasure' ? 'TREASURE FOUND' :
               room.type === 'trap' ? 'TRAP!' :
               'EMPTY ROOM'}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 text-center space-y-5">
            {(room.type === 'monster' || room.type === 'boss') && room.monster && (
              <>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-6xl block mb-3">{room.monster.icon}</span>
                </motion.div>
                <h3 className="text-xl font-black text-red-400">{room.monster.name}</h3>
                <div className="flex items-center justify-center gap-4 text-[10px] font-mono">
                  <span className="text-red-300">HP: {room.monster.hp}/{room.monster.maxHp}</span>
                  <span className="text-amber-300">XP: +{room.monster.xpReward}</span>
                  <span className="text-yellow-300">💰 +{room.monster.goldReward}</span>
                </div>
                {/* Task to defeat */}
                <div className="mt-4 p-4 rounded-xl border" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
                  <p className="text-[9px] font-mono text-red-400/70 tracking-wider mb-2 uppercase">DEFEAT CONDITION</p>
                  <p className="text-sm font-bold text-foreground">{room.monster.task}</p>
                  {room.monster.taskDuration && (
                    <p className="text-[10px] text-muted-foreground mt-1">⏱ {room.monster.taskDuration} دقيقة</p>
                  )}
                </div>
                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onDefeatMonster}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(220,38,38,0.3), rgba(185,28,28,0.4))',
                      borderColor: 'rgba(239,68,68,0.4)',
                      color: '#fca5a5',
                      boxShadow: '0 0 20px rgba(239,68,68,0.2)',
                    }}
                  >
                    <Swords className="w-4 h-4" />
                    أنجزت المهمة!
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onDismiss}
                    className="px-4 py-3.5 rounded-xl border text-sm"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    تراجع
                  </motion.button>
                </div>
              </>
            )}

            {room.type === 'treasure' && room.treasure && (
              <>
                <motion.div
                  animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-6xl block mb-3">{room.treasure.icon}</span>
                </motion.div>
                <h3 className="text-xl font-black text-amber-400">{room.treasure.name}</h3>
                <p className="text-sm text-amber-300/80">
                  {room.treasure.type === 'gold' ? `💰 +${room.treasure.amount} ذهب` :
                   `📊 +${room.treasure.amount} ${room.treasure.statType}`}
                </p>
                <div className="mt-4 p-4 rounded-xl border" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}>
                  <p className="text-[9px] font-mono text-amber-400/70 tracking-wider mb-2 uppercase">COLLECT CONDITION</p>
                  <p className="text-sm font-bold text-foreground">{room.treasure.task}</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onCollectTreasure}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(217,119,6,0.4))',
                      borderColor: 'rgba(245,158,11,0.4)',
                      color: '#fde68a',
                      boxShadow: '0 0 20px rgba(245,158,11,0.2)',
                    }}
                  >
                    <Check className="w-4 h-4" />
                    أنجزت!
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onDismiss}
                    className="px-4 py-3.5 rounded-xl border text-sm"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    لاحقاً
                  </motion.button>
                </div>
              </>
            )}

            {room.type === 'trap' && room.trap && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <span className="text-6xl block mb-3">⚡</span>
                </motion.div>
                <h3 className="text-xl font-black text-purple-400">{room.trap.name}</h3>
                <p className="text-sm text-purple-300/80">{room.trap.description}</p>
                <p className="text-red-400 text-sm font-bold">-{room.trap.damage} HP</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onDismiss}
                  className="mt-4 px-6 py-3 rounded-xl border text-sm font-bold"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  متابعة
                </motion.button>
              </>
            )}

            {room.type === 'empty' && (
              <>
                <span className="text-4xl block mb-3">🌑</span>
                <p className="text-sm text-muted-foreground italic">{room.description}</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onDismiss}
                  className="mt-4 px-6 py-3 rounded-xl border text-sm font-bold"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  متابعة
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Stamina Recovery Modal
interface StaminaModalProps {
  open: boolean;
  tasks: StaminaTask[];
  onComplete: (taskId: string) => void;
  onClose: () => void;
  themeColor: string;
}

export const StaminaModal = ({ open, tasks, onComplete, onClose, themeColor }: StaminaModalProps) => {
  if (!open) return null;

  const availableTasks = tasks.filter(t => !t.completed);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.88)' }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl border-2 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(10,10,20,0.98), rgba(5,5,15,0.99))',
          borderColor: 'rgba(34,197,94,0.3)',
          boxShadow: '0 0 40px rgba(34,197,94,0.15)',
        }}
      >
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'linear-gradient(90deg, rgba(34,197,94,0.1), transparent)' }}>
          <Footprints className="w-5 h-5 text-green-400" />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold text-green-400">STAMINA RECOVERY</span>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs text-muted-foreground text-center mb-4">أكمل مهمة سريعة لاستعادة الطاقة!</p>

          {availableTasks.length > 0 ? (
            availableTasks.map(task => (
              <motion.button
                key={task.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onComplete(task.id)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl border text-right transition-colors"
                style={{
                  background: 'rgba(34,197,94,0.05)',
                  borderColor: 'rgba(34,197,94,0.2)',
                }}
              >
                <span className="text-2xl">{task.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{task.text}</p>
                  <p className="text-[10px] text-green-400">+{task.staminaReward} طاقة</p>
                </div>
                <Check className="w-4 h-4 text-green-400" />
              </motion.button>
            ))
          ) : (
            <p className="text-center text-muted-foreground text-sm py-4">لا توجد مهام متاحة حالياً</p>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full mt-2 px-4 py-3 rounded-xl border text-sm text-muted-foreground"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            إغلاق
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
