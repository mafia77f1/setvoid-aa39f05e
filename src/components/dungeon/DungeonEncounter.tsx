import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Gift, AlertTriangle, Skull, Check, X, Footprints, Eye, EyeOff, Info, Shield, Loader2, Zap, Heart, Activity, Swords as AttackIcon } from 'lucide-react';
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
  const accentColor = isMonster ? '#ef4444' : isTreasure ? '#f59e0b' : isTrap ? '#a855f7' : themeColor;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 overflow-hidden select-none font-sans bg-black/85 backdrop-blur-sm">
        {/* Background Event Image */}
        {eventImage && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img src={eventImage} alt="Event" className="w-full h-full object-cover opacity-20 scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          </div>
        )}

        {/* تم رفع الـ translateY ليصبح الإشعار أعلى قليلاً */}
        <div key={`${room.x}-${room.y}`} className="relative w-full max-w-[550px] animate-super-smooth-entry px-2 -translate-y-12">
          {/* Glowing Lines */}
          <div className="absolute -top-6 left-0 right-0 h-[2px] z-20 animate-line-expand" 
               style={{ backgroundColor: accentColor, boxShadow: `0 0 25px ${accentColor}, 0 0 10px #fff` }} />
          <div className="absolute -bottom-6 left-0 right-0 h-[2px] z-20 animate-line-expand" 
               style={{ backgroundColor: accentColor, boxShadow: `0 0 25px ${accentColor}, 0 0 10px #fff` }} />

          <div className="relative border-x border-white/10 bg-transparent backdrop-blur-2xl">
            <div className="bg-black/60 border border-white/10 overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 96% 100%, 0 100%)' }}>
              
              {/* Header */}
              <div className="bg-black/90 border-b border-white/5 py-3 flex items-center justify-center gap-3">
                <div className="w-6 h-6 border border-white/60 rounded-full flex items-center justify-center shadow-[0_0_8px_white]">
                  <span className="text-white font-black text-xs">!</span>
                </div>
                <h2 className="text-white font-black tracking-[0.4em] italic text-sm sm:text-base drop-shadow-[0_0_10px_white]">SYSTEM ALERT</h2>
                <X onClick={onDismiss} className="absolute right-4 w-4 h-4 text-white/40 cursor-pointer hover:text-white transition-all" />
              </div>

              <div className="p-6 sm:p-10 flex flex-col items-center animate-content-fade">
                {/* ═══ MONSTER/BOSS SECTION ═══ */}
                {isMonster && room.monster && (
                  <div className="w-full text-center">
                    {!showMonsterInfo ? (
                      <>
                        <div className="space-y-4 mb-8">
                          <p className="text-white/90 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase drop-shadow-[0_0_6px_white]">Warning: Enemy Detected</p>
                          <p className="text-white text-2xl sm:text-4xl font-black italic uppercase drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">{room.monster.name}</p>
                          <div className="flex items-center justify-center gap-3 text-[10px] font-mono font-bold">
                            <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20">HP {room.monster.hp}</span>
                            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20">XP +{room.monster.xpReward}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
                          <button onClick={onDefeatMonster} className="py-3 bg-white text-black font-black text-sm sm:text-lg italic hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">ENTER COMBAT</button>
                          <div className="flex gap-2">
                            <button onClick={() => setShowMonsterInfo(true)} className="flex-1 py-2 bg-transparent border border-white/20 text-white/60 font-black text-xs italic hover:bg-white/10 transition-all">DETAILS</button>
                            <button onClick={onDismiss} className="flex-1 py-2 bg-transparent border border-white/10 text-white/30 font-black text-xs italic hover:bg-white/10">EVADE</button>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* ═══ DETAILED MONSTER INFO (The "جببار" Part) ═══ */
                      <div className="w-full animate-content-fade">
                        <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
                           <div className="w-32 h-32 border-2 border-red-500/50 relative p-1 bg-red-500/5">
                              <img src={eventImage || ''} alt="Monster" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 border border-white/20 m-1" />
                           </div>
                           <div className="flex-1 text-left space-y-1 w-full">
                              <h3 className="text-white text-2xl font-black italic uppercase tracking-tighter">{room.monster.name}</h3>
                              <p className="text-red-500 text-[10px] font-bold tracking-[0.2em] mb-2 uppercase italic">Rank: {isBoss ? 'S-RANK' : 'A-RANK'}</p>
                              <div className="grid grid-cols-2 gap-2 w-full font-mono text-[9px]">
                                 <div className="flex items-center gap-2 bg-white/5 p-1 border border-white/5"><Heart className="w-3 h-3 text-red-500"/> <span className="text-white/60">HP:</span> <span className="text-white">{room.monster.hp}/{room.monster.maxHp}</span></div>
                                 <div className="flex items-center gap-2 bg-white/5 p-1 border border-white/5"><Zap className="w-3 h-3 text-yellow-500"/> <span className="text-white/60">MP:</span> <span className="text-white">---</span></div>
                                 <div className="flex items-center gap-2 bg-white/5 p-1 border border-white/5"><AttackIcon className="w-3 h-3 text-orange-500"/> <span className="text-white/60">ATK:</span> <span className="text-white">{room.monster.damage}</span></div>
                                 <div className="flex items-center gap-2 bg-white/5 p-1 border border-white/5"><Activity className="w-3 h-3 text-blue-500"/> <span className="text-white/60">XP:</span> <span className="text-white">+{room.monster.xpReward}</span></div>
                              </div>
                           </div>
                        </div>

                        <div className="w-full border-t border-white/10 pt-4 mb-6">
                           <h4 className="text-white/40 text-[9px] font-black uppercase tracking-widest text-left mb-2 italic">Entity Abilities</h4>
                           <div className="space-y-1">
                              <div className="text-left bg-red-900/10 border-l-2 border-red-500 p-2">
                                 <p className="text-white text-[11px] font-bold italic uppercase">Physical Destruction</p>
                                 <p className="text-white/40 text-[9px]">Causes massive physical damage to any target within range.</p>
                              </div>
                           </div>
                        </div>

                        <button onClick={() => setShowMonsterInfo(false)} className="w-full py-2 bg-white text-black font-black text-xs italic hover:bg-red-500 hover:text-white transition-all">BACK TO ANALYSIS</button>
                      </div>
                    )}
                  </div>
                )}

                {/* ═══ TREASURE SECTION ═══ */}
                {isTreasure && room.treasure && (
                  <div className="w-full text-center">
                    <div className="space-y-4 mb-8">
                      <p className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase">Reward Located</p>
                      <p className="text-white text-2xl sm:text-3xl font-black italic uppercase">{room.treasure.name}</p>
                      <p className="text-amber-400/80 font-mono text-xs">{room.treasure.type === 'gold' ? `VALUE: ${room.treasure.amount} GOLD` : `BOOST: +${room.treasure.amount} ${room.treasure.statType}`}</p>
                    </div>
                    <button onClick={onCollectTreasure} className="w-full max-w-sm py-3 bg-white text-black font-black text-sm italic hover:bg-amber-500 hover:text-white transition-all">CLAIM REWARD</button>
                  </div>
                )}

                {/* ═══ TRAP SECTION ═══ */}
                {isTrap && room.trap && (
                  <div className="w-full text-center">
                    <div className="mb-8 space-y-4">
                      <AlertTriangle className="w-12 h-12 text-purple-500 mx-auto animate-pulse" />
                      <h3 className="text-white text-xl font-black uppercase tracking-tighter">{room.trap.name}</h3>
                      <p className="text-white/60 text-xs italic px-4 uppercase">{room.trap.description}</p>
                      <p className="text-red-500 text-xs font-black font-mono">DAMAGE: -{room.trap.damage} HP</p>
                    </div>
                    <button onClick={onDismiss} className="w-full max-w-sm py-2 bg-white/10 border border-purple-500/50 text-white font-black text-sm italic hover:bg-white hover:text-black">ACKNOWLEDGE</button>
                  </div>
                )}

                {/* ═══ EMPTY SECTION ═══ */}
                {room.type === 'empty' && (
                  <div className="w-full text-center py-4 space-y-6">
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em] italic px-4">{room.description}</p>
                    <button onClick={onDismiss} className="w-full max-w-sm py-2 bg-transparent border border-white/10 text-white/60 font-black text-xs italic hover:text-white">CONTINUE EXPLORATION</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes super-smooth-entry {
            0% { transform: scaleY(0.005) scaleX(0.1) translateY(-20px); opacity: 0; filter: brightness(5); }
            40% { transform: scaleY(0.005) scaleX(1) translateY(-20px); opacity: 1; filter: brightness(2); }
            100% { transform: scaleY(1) scaleX(1) translateY(-48px); opacity: 1; filter: brightness(1); }
          }
          @keyframes line-expand {
            0% { width: 0%; left: 50%; opacity: 0; }
            40% { width: 0%; left: 50%; opacity: 1; }
            100% { width: 100%; left: 0%; opacity: 1; }
          }
          @keyframes content-fade-in { 
            0% { opacity: 0; transform: translateY(10px); filter: blur(5px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          .animate-super-smooth-entry { animation: super-smooth-entry 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-line-expand { animation: line-expand 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-content-fade { animation: content-fade-in 0.8s ease-out 1.1s both; }
        `}</style>
      </div>
    </AnimatePresence>
  );
};

// Stamina Recovery Modal
interface StaminaModalProps {
  open: boolean;
  tasks: StaminaTask[];
  onComplete: (taskId: string) => void;
  onClose: () => void;
  themeColor?: string;
}

export const StaminaModal = ({ open, tasks, onComplete, onClose }: StaminaModalProps) => {
  if (!open) return null;
  const availableTasks = tasks.filter(t => !t.completed);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-[350px] animate-super-smooth-entry">
        <div className="absolute -top-4 left-0 right-0 h-[2px] bg-green-500 shadow-[0_0_15px_#22c55e] animate-line-expand" />
        <div className="bg-black/80 border border-green-500/30 p-4">
          <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
            <Footprints className="w-4 h-4 text-green-400" />
            <span className="text-[10px] font-black tracking-widest text-white uppercase italic">Recovery Quest</span>
          </div>
          <div className="space-y-3">
            {availableTasks.length > 0 ? availableTasks.map(task => (
              <button key={task.id} onClick={() => onComplete(task.id)} className="w-full flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:border-green-500/50 transition-all text-right group">
                <span className="text-2xl group-hover:scale-110 transition-transform">{task.icon}</span>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-white uppercase">{task.text}</p>
                  <p className="text-[9px] text-green-400 font-mono">+{task.staminaReward} STAMINA</p>
                </div>
              </button>
            )) : (
              <p className="text-center text-white/40 text-[10px] py-4 italic">NO QUESTS AVAILABLE</p>
            )}
            <button onClick={onClose} className="w-full py-2 text-[9px] font-bold text-white/20 hover:text-white uppercase mt-2">CLOSE WINDOW</button>
          </div>
        </div>
      </div>
    </div>
  );
};
