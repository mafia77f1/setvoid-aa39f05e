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
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
      >
        {/* Background Event Image - Full Screen Low Opacity */}
        {eventImage && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            <img src={eventImage} alt="Event" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          </motion.div>
        )}

        {/* System Notification Panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-[340px] border-2 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          style={{
            background: 'linear-gradient(135deg, rgba(15,15,25,0.98), rgba(5,5,15,1))',
            borderColor: isMonster ? 'rgba(239,68,68,0.6)' : isTreasure ? 'rgba(245,158,11,0.6)' : isTrap ? 'rgba(168,85,247,0.6)' : `${themeColor}60`,
            boxShadow: `0 0 30px ${isMonster ? 'rgba(239,68,68,0.2)' : isTreasure ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.5)'}`
          }}
        >
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: isMonster ? '#ef4444' : themeColor }} />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: isMonster ? '#ef4444' : themeColor }} />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: isMonster ? '#ef4444' : themeColor }} />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: isMonster ? '#ef4444' : themeColor }} />

          {/* Glitch Scan Line */}
          <div className="absolute inset-0 pointer-events-none opacity-5 animate-pulse" 
            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)', backgroundSize: '100% 4px' }} 
          />

          {/* Header - System Style */}
          <div className="px-4 py-2 border-b flex items-center justify-between bg-white/5" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2">
              {isMonster ? <Skull className="w-3.5 h-3.5 text-red-500" /> : isTreasure ? <Gift className="w-3.5 h-3.5 text-amber-500" /> : <AlertTriangle className="w-3.5 h-3.5 text-purple-500" />}
              <span className="text-[9px] font-black tracking-[0.2em] text-white/80 uppercase">System Alert</span>
            </div>
            <X onClick={onDismiss} className="w-3.5 h-3.5 text-white/20 cursor-pointer hover:text-white" />
          </div>

          <div className="p-5 space-y-4">
            {/* ═══ MONSTER/BOSS ═══ */}
            {isMonster && room.monster && (
              <>
                <div className="text-center space-y-1">
                  <span className="text-[8px] font-bold text-red-500/80 tracking-widest block uppercase">Warning: Enemy Detected</span>
                  <h3 className="text-2xl font-black text-white tracking-tight italic uppercase" style={{ textShadow: '0 0 10px rgba(239,68,68,0.5)' }}>{room.monster.name}</h3>
                  <div className="flex items-center justify-center gap-3 text-[9px] font-mono font-bold pt-1">
                    <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20">HP {room.monster.hp}</span>
                    <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20">XP +{room.monster.xpReward}</span>
                  </div>
                </div>

                {/* Monster Info Panel */}
                <AnimatePresence>
                  {showMonsterInfo && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="p-3 bg-black/40 border border-white/5 space-y-2 text-[10px] font-mono">
                        <div className="flex justify-between"><span className="text-white/40">DAMAGE</span><span className="text-red-400">{room.monster.damage}</span></div>
                        <div className="flex justify-between"><span className="text-white/40">VITALITY</span><span className="text-red-400">{room.monster.hp}/{room.monster.maxHp}</span></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onDefeatMonster}
                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest italic skew-x-[-10deg]"
                  >
                    Enter Combat
                  </motion.button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setShowMonsterInfo(!showMonsterInfo)} className="py-2 bg-white/5 border border-white/10 text-[9px] font-bold text-white/60 uppercase">Details</button>
                    <button onClick={onDismiss} className="py-2 bg-white/5 border border-white/10 text-[9px] font-bold text-white/60 uppercase">Evade</button>
                  </div>
                </div>
              </>
            )}

            {/* ═══ TREASURE ═══ */}
            {isTreasure && room.treasure && (
              <div className="text-center space-y-4">
                <div>
                  <span className="text-[8px] font-bold text-amber-500 tracking-widest block uppercase">Reward Located</span>
                  <h3 className="text-xl font-black text-white italic uppercase">{room.treasure.name}</h3>
                  <p className="text-xs text-amber-400 font-mono mt-1">
                    {room.treasure.type === 'gold' ? `VALUE: ${room.treasure.amount} GOLD` : `BOOST: +${room.treasure.amount} ${room.treasure.statType}`}
                  </p>
                </div>
                <motion.button whileTap={{ scale: 0.98 }} onClick={onCollectTreasure}
                  className="w-full py-3 bg-amber-500 text-black font-black text-xs uppercase tracking-widest skew-x-[-10deg]"
                >
                  Claim Reward
                </motion.button>
              </div>
            )}

            {/* ═══ TRAP ═══ */}
            {isTrap && room.trap && (
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                   <AlertTriangle className="w-12 h-12 text-purple-500 mx-auto animate-bounce" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-purple-400 uppercase tracking-tighter">{room.trap.name}</h3>
                  <p className="text-[10px] text-white/60 mt-1 uppercase leading-relaxed px-4">{room.trap.description}</p>
                  <p className="text-red-500 text-xs font-black mt-2 font-mono">DAMAGE RECEIVED: -{room.trap.damage} HP</p>
                </div>
                <button onClick={onDismiss} className="w-full py-2 bg-purple-900/40 border border-purple-500/50 text-purple-200 text-[10px] font-black uppercase">Acknowledge</button>
              </div>
            )}

            {/* ═══ EMPTY ═══ */}
            {room.type === 'empty' && (
              <div className="text-center py-4 space-y-4">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] italic px-4">{room.description}</p>
                <button onClick={onDismiss} className="w-full py-2 bg-white/5 border border-white/10 text-[10px] font-black text-white/60 uppercase">Continue Exploration</button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Stamina Recovery Modal (Kept clean and system-like)
export const StaminaModal = ({ open, tasks, onComplete, onClose, themeColor }: StaminaModalProps) => {
  if (!open) return null;
  const availableTasks = tasks.filter(t => !t.completed);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-[320px] border-2 bg-[#05050a]"
        style={{ borderColor: 'rgba(34,197,94,0.5)', boxShadow: '0 0 30px rgba(34,197,94,0.1)' }}
      >
        <div className="px-4 py-2 border-b border-white/10 bg-green-500/5 flex items-center gap-2">
          <Footprints className="w-3 h-3 text-green-400" />
          <span className="text-[9px] font-black tracking-widest text-green-400 uppercase">Recovery Quest</span>
        </div>
        <div className="p-4 space-y-3">
          {availableTasks.length > 0 ? availableTasks.map(task => (
            <motion.button key={task.id} whileTap={{ scale: 0.98 }} onClick={() => onComplete(task.id)}
              className="w-full flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:border-green-500/30 transition-all text-right"
            >
              <span className="text-xl">{task.icon}</span>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-white uppercase">{task.text}</p>
                <p className="text-[9px] text-green-400 font-mono">+{task.staminaReward} STAMINA</p>
              </div>
            </motion.button>
          )) : (
            <p className="text-center text-white/40 text-[10px] py-4 uppercase tracking-widest">No Quests Available</p>
          )}
          <button onClick={onClose} className="w-full py-2 text-[9px] font-bold text-white/20 hover:text-white uppercase tracking-tighter">Close Window</button>
        </div>
      </motion.div>
    </motion.div>
  );
};
