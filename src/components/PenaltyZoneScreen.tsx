import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Clock, Skull, X, Heart, Zap } from 'lucide-react';

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

  // تحديث الوقت
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

  // نظام الضرر التلقائي
  useEffect(() => {
    if (playerHp <= 0) { setIsDead(true); return; }
    const interval = setInterval(() => {
      onPlayerDamage(Math.floor(Math.random() * 5) + 2);
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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col">
      
      {/* الخلفية السينمائية (الكهف والوحوش) كما في الصورة */}
      <div className="absolute inset-0 z-0">
        {/* طبقة الكهف الضبابية الحمراء */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,0,0,0.2)_0%,black_80%)]" />
        
        {/* صورة الوحوش والكهف (تم محاكاة الشكل بالـ CSS للسرعة) */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1505506819647-681a49710524?q=80&w=2000')] bg-cover bg-center mix-blend-overlay" />

        {/* الوحوش الظلية الجانبية */}
        <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
          <MonsterShadow side="left" />
          <MonsterShadow side="center" isBig />
          <MonsterShadow side="right" />
        </div>
      </div>

      {/* العداد العلوي (على شكل الواجهة في الصورة) */}
      <div className="relative z-20 flex flex-col items-center mt-10">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 px-6 py-2 rounded-full">
          <span className="text-3xl font-mono font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {formatTime(timeRemaining)}
          </span>
        </div>
        {/* شريط التقدم الصغير تحت الوقت */}
        <div className="w-48 h-1 bg-white/20 mt-2 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 animate-pulse" style={{ width: '65%' }} />
        </div>
      </div>

      {/* اللاعب (Stickman المتوهج) في المنتصف تماماً */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="relative">
          {/* توهج تحت اللاعب */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/20 blur-xl rounded-full" />
          
          {/* الشخصية (Stickman) كما في الصورة */}
          <div className="relative animate-bounce-slow">
             <StickmanFigure />
          </div>

          {/* فقاعة الكلام (اختياري كما في الصورة) */}
          <div className="absolute -top-16 -right-20 bg-black/80 border border-white/20 p-2 rounded-lg text-[10px] text-white whitespace-nowrap">
            الظلم حتم على الكل...
          </div>
        </div>
      </div>

      {/* شريط الصحة السفلي (HP) */}
      <div className="relative z-20 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600 fill-red-600" />
              <span className="text-white font-bold tracking-tighter text-xl">HP</span>
            </div>
            <span className="text-white font-mono text-xl">{playerHp} / {maxPlayerHp}</span>
          </div>
          <div className="h-3 w-full bg-white/10 rounded-sm border border-white/5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-800 to-red-500 transition-all duration-500"
              style={{ width: `${(playerHp / maxPlayerHp) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* شاشة الموت */}
      {isDead && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
          <Skull className="w-20 h-20 text-red-600 mb-6 animate-pulse" />
          <h2 className="text-5xl font-black text-red-600 italic tracking-tighter mb-4">لقد هُزمت</h2>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {shadowPoints >= 50 ? (
              <button onClick={onRevive} className="py-4 bg-white text-black font-bold rounded-lg active:scale-95 transition-transform">
                إحياء بـ 50 نقطة ظل
              </button>
            ) : (
              <button onClick={onExit} className="py-4 bg-red-950 text-red-500 border border-red-500 font-bold rounded-lg">
                قبول العقوبة والخروج
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

// مكون الوحوش الظلية
const MonsterShadow = ({ side, isBig = false }: { side: string, isBig?: boolean }) => (
  <div className={cn(
    "relative flex flex-col items-center transition-opacity duration-1000",
    isBig ? "w-64 scale-150 opacity-80" : "w-32 opacity-40",
    side === "center" ? "mt-20" : "mt-40"
  )}>
    {/* جسم الوحش (مجرد ظل أسود بعيون متوهجة) */}
    <div className="w-full h-80 bg-black rounded-t-full relative" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}>
      <div className="absolute top-10 left-1/4 w-3 h-2 bg-red-600 blur-[2px] rounded-full animate-pulse" />
      <div className="absolute top-10 right-1/4 w-3 h-2 bg-red-600 blur-[2px] rounded-full animate-pulse" />
    </div>
  </div>
);

// مكون الـ Stickman الأبيض المتوهج
const StickmanFigure = () => (
  <div className="flex flex-col items-center">
    {/* الرأس */}
    <div className="w-6 h-6 bg-white rounded-full shadow-[0_0_15px_#fff]" />
    {/* الجسم */}
    <div className="w-1 h-12 bg-white shadow-[0_0_10px_#fff]" />
    {/* اليدين */}
    <div className="absolute top-7 w-12 h-1 bg-white shadow-[0_0_10px_#fff] -rotate-12" />
    {/* القدمين */}
    <div className="flex gap-4 -mt-1">
      <div className="w-1 h-10 bg-white shadow-[0_0_10px_#fff] rotate-12" />
      <div className="w-1 h-10 bg-white shadow-[0_0_10px_#fff] -rotate-12" />
    </div>
  </div>
);

