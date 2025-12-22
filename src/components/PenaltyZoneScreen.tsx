import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Clock, Skull, Heart } from 'lucide-react';

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
  const [isDead, setIsDead] = useState(false);

  // تحديث عداد الوقت
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

  // نظام تلقي الضرر (تلقائي كل 4 ثوانٍ)
  useEffect(() => {
    if (playerHp <= 0) { setIsDead(true); return; }
    const interval = setInterval(() => {
      onPlayerDamage(Math.floor(Math.random() * 8) + 5);
    }, 4000);
    return () => clearInterval(interval);
  }, [playerHp, onPlayerDamage]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050000] overflow-hidden flex flex-col">
      
      {/* 1. الخلفية: وحوش ظلال محيطة */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,0,0,0.3)_0%,black_90%)]" />
        
        {/* توزيع الوحوش كظلال ثابتة في الخلفية */}
        <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-30">
          <div className="w-40 h-[70vh] bg-black blur-2xl rounded-full translate-y-20 -translate-x-10" />
          <div className="w-60 h-[90vh] bg-black blur-3xl rounded-full translate-y-10" />
          <div className="w-40 h-[70vh] bg-black blur-2xl rounded-full translate-y-20 translate-x-10" />
        </div>
      </div>

      {/* 2. الوقت في الأعلى */}
      <div className="relative z-20 flex flex-col items-center mt-12">
        <div className="bg-black/60 backdrop-blur-md border border-red-900/30 px-8 py-3 rounded-md">
          <div className="flex items-center gap-2 mb-1 justify-center">
            <Clock className="w-4 h-4 text-red-500" />
            <span className="text-[10px] text-red-500 font-bold tracking-widest">TIME REMAINING</span>
          </div>
          <span className="text-4xl font-mono font-bold text-white tracking-tighter">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* 3. منطقة اللاعب المركزية */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          
          {/* شريط الصحة (HP) فوق رأس اللاعب مباشرة كما طلبت */}
          <div className="mb-6 w-32 flex flex-col items-center animate-pulse">
            <div className="flex justify-between w-full text-[10px] font-bold text-white mb-1 px-1">
              <span>HP</span>
              <span className={cn(playerHp < 30 ? "text-red-500" : "text-green-500")}>
                {playerHp}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-black border border-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 transition-all duration-1000"
                style={{ width: `${(playerHp / maxPlayerHp) * 100}%` }}
              />
            </div>
          </div>

          {/* مجسم اللاعب: ثابت، بسيط وقوي (Shadow Warrior) */}
          <div className="relative">
            {/* توهج هالة القوة خلف اللاعب */}
            <div className="absolute inset-0 bg-red-600/10 blur-3xl rounded-full scale-150" />
            
            {/* تصميم Stickman محسن ليكون أكثر قوة */}
            <div className="relative scale-125">
               <StrongStickman />
            </div>
          </div>

          {/* نص تحذيري صغير تحت اللاعب */}
          <div className="mt-12 bg-red-950/20 border border-red-500/20 px-4 py-1 rounded text-[10px] text-red-400 font-bold tracking-tight">
            SURVIVAL MODE ACTIVE
          </div>
        </div>
      </div>

      {/* 4. شاشة الموت */}
      {isDead && (
        <div className="absolute inset-0 z-50 bg-black/98 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <Skull className="w-16 h-16 text-red-600 mb-4" />
          <h2 className="text-4xl font-black text-red-600 italic mb-2">MISSION FAILED</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-[250px]">لقد استنفدت كامل صحتك. منطقة العقاب لا ترحم الضعفاء.</p>
          
          <div className="flex flex-col gap-3 w-full max-w-xs px-10">
            {shadowPoints >= 50 ? (
              <button onClick={onRevive} className="py-4 bg-white text-black font-black rounded-sm hover:bg-gray-200 transition-colors uppercase text-xs tracking-widest">
                Revive (50 SP)
              </button>
            ) : (
              <button onClick={onExit} className="py-4 border border-red-600 text-red-600 font-black rounded-sm hover:bg-red-600/10 transition-colors uppercase text-xs tracking-widest">
                Accept Death
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

// مجسم لاعب محسن (قوي وبسيط)
const StrongStickman = () => (
  <div className="flex flex-col items-center">
    {/* الرأس - متوهج قليلاً */}
    <div className="w-5 h-5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] mb-0.5" />
    {/* الجذع - عريض ليعطي مظهر القوة */}
    <div className="w-1.5 h-10 bg-white shadow-[0_0_10px_white]" />
    {/* الذراعين - بوضعية قوية */}
    <div className="absolute top-6 flex justify-between w-14">
        <div className="w-1.5 h-8 bg-white shadow-[0_0_10px_white] rotate-[35deg] origin-top rounded-full" />
        <div className="w-1.5 h-8 bg-white shadow-[0_0_10px_white] -rotate-[35deg] origin-top rounded-full" />
    </div>
    {/* الساقين - وضعية ثبات */}
    <div className="flex gap-4 -mt-0.5">
      <div className="w-1.5 h-12 bg-white shadow-[0_0_10px_white] rotate-[15deg] origin-top rounded-full" />
      <div className="w-1.5 h-12 bg-white shadow-[0_0_10px_white] -rotate-[15deg] origin-top rounded-full" />
    </div>
  </div>
);
