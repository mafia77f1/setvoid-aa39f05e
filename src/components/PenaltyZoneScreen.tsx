import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Clock, Skull, X, Heart, Zap, Shield } from 'lucide-react';

interface Monster {
  id: string;
  name: string;
  angle: number; // لموضع الوحش حول اللاعب
  distance: number;
  scale: number;
  isAttacking: boolean;
}

interface PenaltyZoneScreenProps {
  endTime: string;
  playerHp: number;
  maxPlayerHp: number;
  shadowPoints: number;
  onTimeComplete: () => void;
  onPlayerDamage: (damage: number) => void;
  onRevive: () => void;
  onExit?: () => void;
}

export const PenaltyZoneScreen = ({ 
  endTime, playerHp, maxPlayerHp, shadowPoints, 
  onTimeComplete, onPlayerDamage, onRevive, onExit 
}: PenaltyZoneScreenProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [isPlayerDead, setIsPlayerDead] = useState(false);
  const [shake, setShake] = useState(false);

  // توليد الوحوش الضخمة حول اللاعب
  const generateMonsters = useCallback(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: `monster-${i}`,
      name: 'Shadow Beast',
      angle: (i * 60) + (Math.random() * 20), // توزيع دائري
      distance: 150 + Math.random() * 50,
      scale: 1.5 + Math.random() * 2, // وحوش ضخمة
      isAttacking: false,
    }));
  }, []);

  useEffect(() => {
    setMonsters(generateMonsters());
  }, [generateMonsters]);

  // العداد الزمني
  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeRemaining(remaining);
      if (remaining <= 0) onTimeComplete();
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime, onTimeComplete]);

  // نظام الهجوم التلقائي واهتزاز الشاشة
  useEffect(() => {
    if (playerHp <= 0) {
      setIsPlayerDead(true);
      return;
    }

    const attackInterval = setInterval(() => {
      const targetIdx = Math.floor(Math.random() * monsters.length);
      
      setMonsters(prev => prev.map((m, i) => i === targetIdx ? { ...m, isAttacking: true } : m));
      
      setTimeout(() => {
        setShake(true);
        onPlayerDamage(10 + Math.floor(Math.random() * 10));
        setTimeout(() => setShake(false), 500);
        setMonsters(prev => prev.map((m, i) => i === targetIdx ? { ...m, isAttacking: false } : m));
      }, 800);

    }, 4000);

    return () => clearInterval(attackInterval);
  }, [monsters.length, playerHp, onPlayerDamage]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[100] bg-[#050000] overflow-hidden flex flex-col items-center justify-center font-sans",
      shake && "animate-shake"
    )}>
      {/* 1. Cinematic Background & Desert Floor */}
      <div className="absolute inset-0 perspective-[1000px]">
        {/* Sky / Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-black to-black" />
        
        {/* The 3D Floor (Desert) */}
        <div 
          className="absolute top-1/2 left-1/2 w-[200vw] h-[200vw] bg-[#1a0a0a] -translate-x-1/2"
          style={{
            transform: 'translateX(-50%) rotateX(75deg)',
            backgroundImage: `radial-gradient(circle, #2a0f0f 1px, transparent 1px), linear-gradient(to right, #120505 2px, transparent 2px), linear-gradient(to bottom, #120505 2px, transparent 2px)`,
            backgroundSize: '100px 100px, 50px 50px, 50px 50px',
            boxShadow: '0 0 500px 200px black inset'
          }}
        />
      </div>

      {/* 2. Central Player & Monsters Scene */}
      <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
        
        {/* The Player (YOU) */}
        <div className="relative z-20 flex flex-col items-center">
          {/* Shadow Aura */}
          <div className="absolute -inset-10 bg-blue-600/20 blur-[50px] animate-pulse" />
          {/* Player Silhouette */}
          <div className="w-12 h-32 bg-black border-t-2 border-blue-400 rounded-full shadow-[0_0_20px_blue] relative animate-float">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-black rounded-full border border-blue-500/50" />
          </div>
          {/* Energy Platform */}
          <div className="w-24 h-4 bg-blue-900/40 blur-md rounded-[100%] mt-2 shadow-[0_0_30px_blue]" />
        </div>

        {/* Monsters (Shadow Giants) */}
        {monsters.map((monster) => (
          <div
            key={monster.id}
            className={cn(
              "absolute transition-all duration-1000 flex flex-col items-center",
              monster.isAttacking ? "opacity-100 scale-125 translate-y-[-20px]" : "opacity-40"
            )}
            style={{
              transform: `rotateY(${monster.angle}deg) translateZ(${monster.isAttacking ? 100 : monster.distance}px)`,
            }}
          >
            {/* Monster Body (Featureless Giant) */}
            <div 
              className="bg-black relative rounded-t-full shadow-[0_0_50px_rgba(255,0,0,0.2)]"
              style={{ 
                width: `${40 * monster.scale}px`, 
                height: `${80 * monster.scale}px`,
                clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' 
              }}
            >
              {/* Glowing Eyes */}
              <div className="absolute top-1/4 left-1/4 w-2 h-1 bg-red-600 blur-[2px] animate-pulse" />
              <div className="absolute top-1/4 right-1/4 w-2 h-1 bg-red-600 blur-[2px] animate-pulse" />
            </div>
            {/* Attack Symbol */}
            {monster.isAttacking && (
                <div className="absolute -top-10 text-red-500 animate-bounce">
                    <Skull size={40} />
                </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-50">
        {/* Header UI */}
        <div className="flex justify-between items-start">
          <div className="bg-black/80 border-l-4 border-red-600 p-4 backdrop-blur-md">
            <h1 className="text-red-600 font-black tracking-tighter text-2xl italic">PENALTY QUEST: SURVIVE</h1>
            <p className="text-gray-400 text-xs">هدف المهمة: البقاء على قيد الحياة حتى انتهاء الوقت</p>
          </div>
          <div className="bg-black/80 p-4 border border-red-900/50 backdrop-blur-md text-center">
            <Clock className="mx-auto text-red-500 mb-1" size={20} />
            <span className="text-2xl font-mono font-bold text-red-500">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Player Stats UI */}
        <div className="max-w-md w-full mx-auto pointer-events-auto">
          <div className="bg-black/90 border border-white/10 p-4 rounded-t-xl">
            <div className="flex justify-between items-end mb-2">
              <span className="text-white font-bold flex items-center gap-2"><Heart className="text-red-500" fill="currentColor" /> HP</span>
              <span className="text-red-500 font-mono text-xl">{Math.max(0, playerHp)} / {maxPlayerHp}</span>
            </div>
            <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                style={{ width: `${(playerHp / maxPlayerHp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Death Screen */}
      {isPlayerDead && (
        <div className="absolute inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <Skull size={80} className="text-red-700 mb-4 animate-bounce" />
          <h2 className="text-6xl font-black text-red-600 italic mb-2 tracking-tighter">YOU FAILED</h2>
          <p className="text-gray-400 max-w-xs mb-8">لقد استنفدت طاقتك في منطقة العقاب. سيتم تطبيق بنود الفشل.</p>
          
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {shadowPoints >= 50 ? (
                <button onClick={onRevive} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 rounded-sm border-b-4 border-blue-900 transition-all">
                    إحياء (50 نقطة ظل)
                </button>
            ) : (
                <button onClick={onExit} className="bg-red-900/40 hover:bg-red-800 text-red-500 font-bold py-4 rounded-sm border border-red-600 transition-all">
                    الخروج وقبول العقوبة
                </button>
            )}
          </div>
        </div>
      )}

      {/* Global Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0,0); }
          25% { transform: translate(-5px, 5px); }
          50% { transform: translate(5px, -5px); }
          75% { transform: translate(-5px, -5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }

        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};
