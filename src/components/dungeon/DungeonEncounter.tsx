import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Gift, AlertTriangle, Skull, Check, X, Footprints, Eye, EyeOff, Info, Shield } from 'lucide-react';
import { DungeonRoom, StaminaTask } from './DungeonTypes';
import { useNavigate } from 'react-router-dom';

interface EncounterProps {
  room: DungeonRoom | null;
  onDefeatMonster: () => void;
  onCollectTreasure: () => void;
  onDismiss: () => void;
  themeColor: string;
}

export const DungeonEncounter = ({ room, onDefeatMonster, onCollectTreasure, onDismiss, themeColor }: EncounterProps) => {
  const [showMonsterInfo, setShowMonsterInfo] = useState(false);
  const navigate = useNavigate();
  
  if (!room) return null;

  const isBoss = room.type === 'boss';
  const isMonster = room.type === 'monster' || isBoss;
  const isTreasure = room.type === 'treasure';
  const isTrap = room.type === 'trap';

  const getEventImage = () => {
    if (isBoss) return '/GrottoBoss.png';
    if (isMonster) return '/GrottoMonsters.png';
    if (isTreasure) return '/CaveTreasure.png';
    return null;
  };

  const eventImage = getEventImage();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-end justify-center"
        style={{ background: 'rgba(0,0,0,0.85)' }}
      >
        {/* Event Image */}
        {eventImage && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0"
          >
            <img src={eventImage} alt="Event" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a15] via-[#0a0a15]/60 to-transparent" />
            
            {isBoss && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0, 0.15, 0, 0.1, 0] }}
                transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2.5 }}
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.15) 2px, rgba(239,68,68,0.15) 4px)',
                }}
              />
            )}
          </motion.div>
        )}

        {/* Content Panel */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative z-10 w-full max-w-md rounded-t-3xl border-t-2 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(10,10,20,0.97), rgba(5,5,15,0.99))',
            borderColor: isMonster ? 'rgba(239,68,68,0.4)' : isTreasure ? 'rgba(245,158,11,0.4)' : isTrap ? 'rgba(168,85,247,0.4)' : `${themeColor}30`,
          }}
        >
          {/* Header badge */}
          <div className="px-5 py-3 flex items-center justify-center gap-2">
            {isMonster ? <Skull className="w-4 h-4 text-red-400" /> : isTreasure ? <Gift className="w-4 h-4 text-amber-400" /> : <AlertTriangle className="w-4 h-4 text-purple-400" />}
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold" style={{
              color: isMonster ? '#ef4444' : isTreasure ? '#f59e0b' : '#a855f7'
            }}>
              {isBoss ? '⚠ BOSS ENCOUNTER' : isMonster ? 'MONSTER ENCOUNTER' : isTreasure ? 'TREASURE FOUND' : isTrap ? 'TRAP!' : 'EMPTY ROOM'}
            </span>
          </div>

          <div className="px-6 pb-6 space-y-4">
            {/* ═══ MONSTER/BOSS ═══ */}
            {isMonster && room.monster && (
              <>
                <div className="text-center">
                  <h3 className="text-xl font-black text-red-400 mb-1">{room.monster.name}</h3>
                  <div className="flex items-center justify-center gap-4 text-[10px] font-mono">
                    <span className="text-red-300">HP: {room.monster.hp}</span>
                    <span className="text-amber-300">XP: +{room.monster.xpReward}</span>
                    <span className="text-yellow-300">💰 +{room.monster.goldReward}</span>
                  </div>
                </div>

                {/* Monster Info Panel */}
                <AnimatePresence>
                  {showMonsterInfo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">القوة</span>
                          <span className="text-red-300 font-bold">{room.monster.damage}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">الصحة</span>
                          <span className="text-red-300 font-bold">{room.monster.hp}/{room.monster.maxHp}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">المستوى</span>
                          <span className="text-red-300 font-bold">{Math.ceil(room.monster.hp / 30)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action buttons - NO mandatory tasks, direct combat */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Hide */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onDismiss}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-slate-600/40 bg-slate-800/30"
                  >
                    <EyeOff className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-bold">الاختباء</span>
                  </motion.button>

                  {/* Fight - goes directly to battle */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onDefeatMonster}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-red-500/40 bg-red-500/10 col-span-1"
                    style={{ boxShadow: '0 0 15px rgba(239,68,68,0.15)' }}
                  >
                    <Swords className="w-5 h-5 text-red-400" />
                    <span className="text-[10px] text-red-300 font-bold">المواجهة</span>
                  </motion.button>

                  {/* Info */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMonsterInfo(!showMonsterInfo)}
                    className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5"
                  >
                    <Info className="w-5 h-5 text-cyan-400" />
                    <span className="text-[10px] text-cyan-300 font-bold">المعلومات</span>
                  </motion.button>
                </div>
              </>
            )}

            {/* ═══ TREASURE - direct collection, no task ═══ */}
            {isTreasure && room.treasure && (
              <>
                <div className="text-center">
                  <h3 className="text-xl font-black text-amber-400 mb-1">{room.treasure.name}</h3>
                  <p className="text-sm text-amber-300/80">
                    {room.treasure.type === 'gold' ? `💰 +${room.treasure.amount} ذهب` : `📊 +${room.treasure.amount} ${room.treasure.statType}`}
                  </p>
                </div>
                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={onCollectTreasure}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm border border-amber-500/40 bg-amber-500/10 text-amber-300"
                    style={{ boxShadow: '0 0 20px rgba(245,158,11,0.15)' }}
                  >
                    <Check className="w-4 h-4" /> جمع الكنز
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={onDismiss}
                    className="px-4 py-3.5 rounded-xl border border-white/10 text-sm text-slate-500"
                  >
                    تجاهل
                  </motion.button>
                </div>
              </>
            )}

            {/* ═══ TRAP ═══ */}
            {isTrap && room.trap && (
              <>
                <div className="text-center">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: 3 }}>
                    <span className="text-5xl block mb-3">⚡</span>
                  </motion.div>
                  <h3 className="text-xl font-black text-purple-400">{room.trap.name}</h3>
                  <p className="text-sm text-purple-300/80 mt-1">{room.trap.description}</p>
                  <p className="text-red-400 text-sm font-bold mt-2">-{room.trap.damage} HP</p>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={onDismiss}
                  className="w-full py-3 rounded-xl border text-sm font-bold" style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  متابعة
                </motion.button>
              </>
            )}

            {/* ═══ EMPTY ═══ */}
            {room.type === 'empty' && (
              <>
                <div className="text-center">
                  <span className="text-4xl block mb-3">🌑</span>
                  <p className="text-sm text-slate-400 italic">{room.description}</p>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={onDismiss}
                  className="w-full py-3 rounded-xl border text-sm font-bold" style={{ borderColor: `${themeColor}40`, color: themeColor }}
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.88)' }}
    >
      <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl border-2 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(10,10,20,0.98), rgba(5,5,15,0.99))', borderColor: 'rgba(34,197,94,0.3)', boxShadow: '0 0 40px rgba(34,197,94,0.15)' }}
      >
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'linear-gradient(90deg, rgba(34,197,94,0.1), transparent)' }}>
          <Footprints className="w-5 h-5 text-green-400" />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold text-green-400">STAMINA RECOVERY</span>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-400 text-center mb-4">أكمل مهمة سريعة لاستعادة الطاقة!</p>
          {availableTasks.length > 0 ? availableTasks.map(task => (
            <motion.button key={task.id} whileTap={{ scale: 0.97 }} onClick={() => onComplete(task.id)}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl border text-right transition-colors"
              style={{ background: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.2)' }}
            >
              <span className="text-2xl">{task.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-200">{task.text}</p>
                <p className="text-[10px] text-green-400">+{task.staminaReward} طاقة</p>
              </div>
              <Check className="w-4 h-4 text-green-400" />
            </motion.button>
          )) : (
            <p className="text-center text-slate-400 text-sm py-4">لا توجد مهام متاحة حالياً</p>
          )}
          <motion.button whileTap={{ scale: 0.95 }} onClick={onClose}
            className="w-full mt-2 px-4 py-3 rounded-xl border text-sm text-slate-400" style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            إغلاق
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
