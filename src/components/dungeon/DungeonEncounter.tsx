import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Gift, AlertTriangle, Skull, Check, X, EyeOff, Info } from 'lucide-react';
import { DungeonRoom } from './DungeonTypes';

interface EncounterProps {
  room: DungeonRoom | null;
  onDefeatMonster: () => void;
  onCollectTreasure: () => void;
  onDismiss: () => void;
  themeColor: string;
}

export const DungeonEncounter = ({ room, onDefeatMonster, onCollectTreasure, onDismiss, themeColor }: EncounterProps) => {
  const [showMonsterInfo, setShowMonsterInfo] = useState(false);
  
  if (!room) return null;

  const isBoss = room.type === 'boss';
  const isMonster = room.type === 'monster' || isBoss;
  const isTreasure = room.type === 'treasure';
  const isTrap = room.type === 'trap';

  // تحديد اللون بناءً على نوع الحدث ليطابق النظام
  const statusColor = isMonster ? '#ef4444' : isTreasure ? '#f59e0b' : isTrap ? '#a855f7' : '#3b82f6';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <div className="relative w-full max-w-[450px] animate-system-entry">
          {/* الخطوط العلوية والسفلية المتوهجة */}
          <div className="absolute -top-4 left-0 right-0 h-[1.5px] z-20 animate-line-expand" 
               style={{ background: statusColor, boxShadow: `0 0 15px ${statusColor}` }} />
          <div className="absolute -bottom-4 left-0 right-0 h-[1.5px] z-20 animate-line-expand" 
               style={{ background: statusColor, boxShadow: `0 0 15px ${statusColor}` }} />

          <div className="relative border-x border-white/10 bg-transparent">
            {/* الهيكل الرئيسي مع clip-path المائل */}
            <div className="bg-black/90 border border-white/20 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)]" 
                 style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 94% 100%, 0 100%)' }}>
              
              {/* الرأس (Header) */}
              <div className="bg-black/95 border-b border-white/10 py-3 flex items-center justify-center gap-3">
                <div className="w-5 h-5 border border-white/40 rounded-full flex items-center justify-center shadow-[0_0_8px_white]">
                  <span className="text-white font-black text-[10px]">!</span>
                </div>
                <h2 className="text-white font-black tracking-[0.3em] italic text-xs drop-shadow-[0_0_8px_white]">
                  {isBoss ? 'URGENT NOTIFICATION' : 'SYSTEM NOTIFICATION'}
                </h2>
              </div>

              {/* المحتوى (Content) */}
              <div className="p-8 flex flex-col items-center animate-content-fade text-center">
                
                {/* ═══ MONSTER SECTION ═══ */}
                {isMonster && room.monster && (
                  <div className="w-full space-y-6">
                    <div className="space-y-2">
                      <p className="text-red-500 text-[10px] font-black tracking-widest uppercase">Warning: Hostile Entity</p>
                      <h3 className="text-white text-2xl font-black italic uppercase drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                        {room.monster.name}
                      </h3>
                      <div className="flex justify-center gap-4 text-[10px] font-mono font-bold">
                        <span className="text-red-400">HP: {room.monster.hp}</span>
                        <span className="text-amber-400">XP: +{room.monster.xpReward}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                      <button onClick={onDefeatMonster} 
                              className="w-full py-3 bg-white text-black font-black text-sm italic hover:bg-red-500 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95">
                        COMBAT START
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => setShowMonsterInfo(!showMonsterInfo)} 
                                className="flex-1 py-2 border border-white/20 text-white/60 font-bold text-[10px] hover:text-white transition-all">
                          INFO
                        </button>
                        <button onClick={onDismiss} 
                                className="flex-1 py-2 border border-white/20 text-white/60 font-bold text-[10px] hover:text-white transition-all">
                          EVADE
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ TREASURE SECTION ═══ */}
                {isTreasure && room.treasure && (
                  <div className="w-full space-y-6">
                    <div className="space-y-2">
                      <p className="text-amber-500 text-[10px] font-black tracking-widest uppercase">Acquisition Chance</p>
                      <h3 className="text-white text-2xl font-black italic uppercase drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                        {room.treasure.name}
                      </h3>
                    </div>
                    <button onClick={onCollectTreasure} 
                            className="w-full py-3 bg-white text-black font-black text-sm italic hover:bg-amber-500 hover:text-white transition-all transform hover:scale-[1.02]">
                      CLAIM REWARD
                    </button>
                  </div>
                )}

                {/* ═══ TRAP/EMPTY SECTION ═══ */}
                {(isTrap || room.type === 'empty') && (
                  <div className="w-full space-y-6">
                    <div className="space-y-2">
                      <p className="text-blue-400 text-[10px] font-black tracking-widest uppercase italic">Environment Report</p>
                      <p className="text-white/80 text-sm font-bold leading-relaxed italic">
                        {isTrap ? room.trap?.description : room.description}
                      </p>
                    </div>
                    <button onClick={onDismiss} 
                            className="w-full py-3 bg-white text-black font-black text-sm italic hover:bg-blue-500 hover:text-white transition-all">
                      CONFIRM
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes system-entry {
          0% { transform: scaleY(0.005) scaleX(0.1); opacity: 0; filter: brightness(5); }
          40% { transform: scaleY(0.005) scaleX(1); opacity: 1; filter: brightness(2); }
          100% { transform: scaleY(1) scaleX(1); opacity: 1; filter: brightness(1); }
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

        .animate-system-entry { 
          animation: system-entry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }

        .animate-line-expand {
          animation: line-expand 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-content-fade { 
          animation: content-fade-in 0.5s ease-out 0.6s both; 
        }
      `}</style>
    </AnimatePresence>
  );
};
