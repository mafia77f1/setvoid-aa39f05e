import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Gift, AlertTriangle, Skull, X, Info } from 'lucide-react';
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

  // تحديد اللون الأساسي للإشعار بناءً على نوع الحدث
  const statusColor = isMonster ? '#ef4444' : isTreasure ? '#f59e0b' : isTrap ? '#a855f7' : themeColor;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
      >
        <div className="relative w-full max-w-[500px] animate-super-smooth-entry">
          {/* الخطوط العلوية والسفلية المتوهجة - مستوحاة من Onboarding */}
          <div className="absolute -top-4 left-0 right-0 h-[2px] z-20 animate-line-expand" 
               style={{ backgroundColor: statusColor, boxShadow: `0 0 20px ${statusColor}, 0 0 10px #fff` }} />
          <div className="absolute -bottom-4 left-0 right-0 h-[2px] z-20 animate-line-expand" 
               style={{ backgroundColor: statusColor, boxShadow: `0 0 20px ${statusColor}, 0 0 10px #fff` }} />

          <div className="relative border-x border-white/10 bg-transparent">
            {/* الهيكل الرئيسي مع clip-path سولو ليفلينج */}
            <div className="bg-black/60 border border-white/20 overflow-hidden" 
                 style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 96% 100%, 0 100%)', backdropFilter: 'blur(20px)' }}>
              
              {/* رأس الإشعار - Notification Header */}
              <div className="bg-black/90 border-b border-white/5 py-3 flex items-center justify-center gap-3">
                <div className="w-5 h-5 border border-white/60 rounded-full flex items-center justify-center shadow-[0_0_8px_white]">
                  <span className="text-white font-black text-[10px]">!</span>
                </div>
                <h2 className="text-white font-black tracking-[0.4em] italic text-xs drop-shadow-[0_0_10px_white]">
                  {isBoss ? 'URGENT NOTIFICATION' : 'SYSTEM NOTIFICATION'}
                </h2>
              </div>

              <div className="p-8 flex flex-col items-center animate-content-fade">
                
                {/* ═══ حالة الوحش ═══ */}
                {isMonster && room.monster && (
                  <div className="w-full text-center space-y-6">
                    <div className="space-y-2">
                      <p className="text-white/70 text-sm font-bold tracking-wide drop-shadow-[0_0_5px_white]">
                        You have encountered a hostile entity.
                      </p>
                      <h3 className="text-white text-3xl font-black italic uppercase drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                        {room.monster.name}
                      </h3>
                      <div className="flex justify-center gap-4 text-[10px] font-mono font-black text-red-400">
                        <span className="px-2 py-0.5 border border-red-500/30 bg-red-500/10">HP: {room.monster.hp}</span>
                        <span className="px-2 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-400">XP: +{room.monster.xpReward}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-[300px] mx-auto">
                      <button onClick={onDefeatMonster} 
                        className="py-3 bg-white text-black font-black text-base italic hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] transform hover:scale-[1.02]">
                        ENGAGE IN COMBAT
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => setShowMonsterInfo(!showMonsterInfo)} 
                                className="flex-1 py-2 border border-white/30 text-white/60 font-black text-[10px] italic hover:border-white hover:text-white transition-all">
                          ANALYSIS
                        </button>
                        <button onClick={onDismiss} 
                                className="flex-1 py-2 border border-white/10 text-white/20 font-black text-[10px] italic hover:border-white/40 hover:text-white transition-all">
                          WITHDRAW
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ حالة الكنز ═══ */}
                {isTreasure && room.treasure && (
                  <div className="w-full text-center space-y-6">
                    <div className="space-y-2">
                      <p className="text-white/70 text-sm font-bold tracking-wide">Acquisition requirements met.</p>
                      <h3 className="text-white text-3xl font-black italic uppercase drop-shadow-[0_0_20px_#f59e0b]">
                        {room.treasure.name}
                      </h3>
                      <p className="text-amber-400 font-mono text-xs font-bold">
                        {room.treasure.type === 'gold' ? `VALUE: ${room.treasure.amount} GOLD` : `STAT: +${room.treasure.amount} ${room.treasure.statType}`}
                      </p>
                    </div>
                    <button onClick={onCollectTreasure} 
                      className="w-full max-w-[280px] py-3 bg-white text-black font-black text-base italic hover:bg-amber-500 hover:text-white transition-all shadow-[0_0_20px_white]">
                      CLAIM REWARD
                    </button>
                  </div>
                )}

                {/* ═══ فخ أو غرفة فارغة ═══ */}
                {(isTrap || room.type === 'empty') && (
                  <div className="w-full text-center space-y-6">
                    <div className="space-y-4">
                      <AlertTriangle className="w-12 h-12 text-white/20 mx-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                      <p className="text-white text-lg font-bold italic leading-relaxed">
                        {isTrap ? room.trap?.description : room.description}
                      </p>
                    </div>
                    <button onClick={onDismiss} 
                      className="w-full max-w-[250px] py-2 bg-transparent border border-white/40 text-white font-black text-lg italic hover:bg-white hover:text-black transition-all">
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
        @keyframes super-smooth-entry {
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

        .animate-super-smooth-entry { 
          animation: super-smooth-entry 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }

        .animate-line-expand {
          animation: line-expand 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-content-fade { 
          animation: content-fade-in 0.7s ease-out 0.9s both; 
        }
      `}</style>
    </AnimatePresence>
  );
};
