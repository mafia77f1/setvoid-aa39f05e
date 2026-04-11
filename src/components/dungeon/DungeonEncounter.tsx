import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Gift, AlertTriangle, Skull, Check, X, Footprints, Eye, EyeOff, Info, Shield, Loader2 } from 'lucide-react';
import { DungeonRoom } from './DungeonTypes';
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

  // تحديد اللون بناءً على نوع الحدث ليطابق تأثيرات الـ Onboarding
  const accentColor = isMonster ? '#ef4444' : isTreasure ? '#f59e0b' : isTrap ? '#a855f7' : '#3b82f6';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 overflow-hidden select-none font-sans bg-black/80 backdrop-blur-md">
        {/* Background Glow */}
        <div className="fixed inset-0 pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] blur-[100px] rounded-full opacity-20"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        <div key={room.id} className="relative w-full max-w-[550px] animate-super-smooth-entry px-2">
          {/* Top & Bottom Glowing Lines */}
          <div 
            className="absolute -top-6 left-0 right-0 h-[2px] z-20 animate-line-expand" 
            style={{ backgroundColor: accentColor, boxShadow: `0 0 25px ${accentColor}, 0 0 10px #fff` }} 
          />
          <div 
            className="absolute -bottom-6 left-0 right-0 h-[2px] z-20 animate-line-expand" 
            style={{ backgroundColor: accentColor, boxShadow: `0 0 25px ${accentColor}, 0 0 10px #fff` }} 
          />

          <div className="relative border-x border-white/10 bg-transparent backdrop-blur-2xl">
            <div 
              className="bg-black/60 border border-white/10 overflow-hidden" 
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 96% 100%, 0 100%)' }}
            >
              {/* Header */}
              <div className="bg-black/90 border-b border-white/5 py-3 flex items-center justify-center gap-3">
                <div className="w-6 h-6 border border-white/60 rounded-full flex items-center justify-center shadow-[0_0_8px_white]">
                  <span className="text-white font-black text-xs">!</span>
                </div>
                <h2 className="text-white font-black tracking-[0.4em] italic text-sm sm:text-base drop-shadow-[0_0_10px_white]">
                  {isMonster ? 'HOSTILE DETECTED' : isTreasure ? 'TREASURE FOUND' : 'SYSTEM ALERT'}
                </h2>
              </div>

              {/* Content Panel */}
              <div className="p-6 sm:p-10 flex flex-col items-center animate-content-fade">
                
                {/* ═══ MONSTER/BOSS SECTION ═══ */}
                {isMonster && room.monster && (
                  <div className="w-full text-center">
                    <div className="space-y-4 mb-8">
                      <p className="text-white/90 text-sm sm:text-lg font-bold tracking-wide drop-shadow-[0_0_6px_white]">
                        {isBoss ? 'A powerful Presence has appeared' : 'You have encountered an entity'}
                      </p>
                      <p className="text-white text-xl sm:text-3xl font-black">
                        Target: <span className="text-red-500 italic drop-shadow-[0_0_20px_#ef4444] underline decoration-red-500 decoration-2 underline-offset-8 uppercase">{room.monster.name}</span>
                      </p>
                      <div className="flex justify-center gap-4 pt-2 font-mono text-[10px] text-white/50">
                        <span className="border border-white/10 px-2 py-1">HP: {room.monster.hp}</span>
                        <span className="border border-white/10 px-2 py-1">XP: +{room.monster.xpReward}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
                      <button onClick={onDefeatMonster} className="py-3 bg-white text-black font-black text-sm sm:text-lg italic hover:bg-red-600 hover:text-white transition-all">
                        ENGAGE COMBAT
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => setShowMonsterInfo(!showMonsterInfo)} className="flex-1 py-2 bg-transparent border border-white/20 text-white/60 font-black text-xs italic hover:text-white transition-all">
                          DETAILS
                        </button>
                        <button onClick={onDismiss} className="flex-1 py-2 bg-transparent border border-white/10 text-white/30 font-black text-xs italic hover:text-white transition-all">
                          EVADE
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ TREASURE SECTION ═══ */}
                {isTreasure && room.treasure && (
                  <div className="w-full text-center">
                    <div className="space-y-4 mb-8">
                      <p className="text-white/90 text-sm sm:text-lg font-bold tracking-wide drop-shadow-[0_0_6px_white]">Reward acquisition possible</p>
                      <p className="text-white text-xl sm:text-3xl font-black italic uppercase text-amber-500 drop-shadow-[0_0_20px_#f59e0b]">
                        {room.treasure.name}
                      </p>
                      <p className="text-white/60 text-xs font-mono">
                        {room.treasure.type === 'gold' ? `Value: ${room.treasure.amount} Gold` : `Boost: +${room.treasure.amount} ${room.treasure.statType}`}
                      </p>
                    </div>
                    <button onClick={onCollectTreasure} className="w-full max-w-sm py-3 bg-white text-black font-black text-sm sm:text-lg italic hover:bg-amber-500 hover:text-white transition-all">
                      CLAIM ITEM
                    </button>
                  </div>
                )}

                {/* ═══ TRAP/EMPTY SECTION ═══ */}
                {(isTrap || room.type === 'empty') && (
                  <div className="w-full text-center">
                    <div className="mb-8">
                      {isTrap && <AlertTriangle className="w-12 h-12 text-purple-500 mx-auto mb-4 drop-shadow-[0_0_15px_#a855f7]" />}
                      <p className="text-white text-sm sm:text-lg font-bold italic opacity-80 leading-relaxed">
                        {isTrap ? room.trap?.description : room.description}
                      </p>
                    </div>
                    <button onClick={onDismiss} className="w-full max-w-xs py-3 bg-white/10 border border-white/20 text-white font-black text-sm italic hover:bg-white hover:text-black transition-all">
                      CONTINUE
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

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
        .animate-super-smooth-entry { animation: super-smooth-entry 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-line-expand { animation: line-expand 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-content-fade { animation: content-fade-in 0.8s ease-out 1.1s both; }
      `}</style>
    </AnimatePresence>
  );
};
