import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skull } from 'lucide-react';

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

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col items-center">
      
      {/* 1. الخلفية: الكهف والوحوش الضخمة (كما في الصورة) */}
      <div className="absolute inset-0 z-0">
        {/* التدرج الأحمر المظلم */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(80,0,0,0.15)_0%,black_100%)]" />
        
        {/* الوحوش كظلال ضخمة محيطة */}
        <div className="absolute inset-0 flex justify-between items-end px-10 pb-20 opacity-40 pointer-events-none">
          <MonsterSilhouette className="h-[60vh] -rotate-12" />
          <MonsterSilhouette className="h-[80vh] translate-y-20 scale-125" isCentral />
          <MonsterSilhouette className="h-[60vh] rotate-12" />
        </div>
      </div>

      {/* 2. عداد الوقت العلوي (تصميم بسيط مثل الصورة) */}
      <div className="relative z-20 mt-12 text-center">
        <p className="text-[10px] text-gray-500 font-bold mb-1 tracking-[0.3em]">H/M/S</p>
        <h1 className="text-4xl font-mono font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          {formatTime(timeRemaining)}
        </h1>
        {/* شريط التقدم الصغير تحت الوقت */}
        <div className="mt-4 w-40 h-1 bg-white/10 rounded-full overflow-hidden mx-auto border border-white/5">
            <div className="h-full bg-red-600 animate-pulse" style={{ width: '70%' }} />
        </div>
      </div>

      {/* 3. منطقة اللاعب (المنتصف) */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full">
        <div className="relative flex flex-col items-center">
          
          {/* شريط الصحة فوق رأس اللاعب مباشرة (تصميم الصورة) */}
          <div className="absolute -top-12 flex flex-col items-center">
             <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-white/50 font-bold">LV.</span>
                <div className="w-24 h-1.5 bg-black border border-white/20 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-red-600 transition-all duration-500"
                        style={{ width: `${(playerHp / maxPlayerHp) * 100}%` }}
                    />
                </div>
             </div>
          </div>

          {/* مجسم اللاعب المتوهج (بسيط وقوي) */}
          <div className="relative">
            {/* توهج تحت الأرجل */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-white/20 blur-md rounded-full" />
            
            {/* الـ Stickman الأبيض المتوهج */}
            <div className="w-10 h-24 flex flex-col items-center shadow-[0_0_20px_white]">
               <div className="w-6 h-6 bg-white rounded-full mb-1" />
               <div className="w-1.5 h-12 bg-white" />
               <div className="absolute top-8 w-14 h-1.5 bg-white rounded-full" />
               <div className="flex gap-4 -mt-1">
                  <div className="w-1.5 h-12 bg-white rotate-12" />
                  <div className="w-1.5 h-12 bg-white -rotate-12" />
               </div>
            </div>

            {/* فقاعة الكلام (كما في الصورة) */}
            <div className="absolute -right-28 top-4 bg-black/80 border border-white/10 p-2 rounded px-3">
               <p className="text-[10px] text-white font-arabic" dir="rtl">الظلم حتم على الكل...</p>
               <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-r-[8px] border-r-black/80" />
            </div>
          </div>
        </div>
      </div>

      {/* شاشة الموت (Death Screen) */}
      {playerHp <= 0 && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-500">
          <Skull className="w-12 h-12 text-red-600 mb-4" />
          <h2 className="text-3xl font-black text-red-600 mb-8 tracking-tighter italic">YOU DIED</h2>
          <button onClick={onRevive} className="px-10 py-3 border border-white/20 text-white text-xs font-bold hover:bg-white/5 transition-colors">
            REVIVE WITH 50 SP
          </button>
        </div>
      )}

    </div>
  );
};

// مكون الوحش الظلي (مثل الذي في الصورة خلف اللاعب)
const MonsterSilhouette = ({ className, isCentral }: { className?: string, isCentral?: boolean }) => (
  <div className={cn("relative flex flex-col items-center opacity-60", className)}>
    {/* رأس الوحش مع العيون الحمراء */}
    <div className="relative w-20 h-20 mb-2">
       <div className="absolute top-1/2 left-1/4 w-2 h-1 bg-red-600 blur-[1px] animate-pulse" />
       <div className="absolute top-1/2 right-1/4 w-2 h-1 bg-red-600 blur-[1px] animate-pulse" />
       {/* قرون/نتوءات */}
       <div className="w-full h-full border-t-4 border-black rounded-t-full" />
    </div>
    {/* جسم الوحش العريض */}
    <div className="w-40 h-full bg-gradient-to-t from-transparent via-black to-black rounded-t-[100px]" />
  </div>
);
