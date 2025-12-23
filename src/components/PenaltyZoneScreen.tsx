import { useState, useEffect } from 'react';

interface PenaltyZoneScreenProps {
  endTime: string; 
  onTimeComplete: () => void;
}

export const PenaltyZoneScreen = ({ endTime, onTimeComplete }: PenaltyZoneScreenProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining <= 0 && onTimeComplete) {
        onTimeComplete();
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [endTime, onTimeComplete]);

  const formatTime = (s: number) => {
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    return {
      h: String(hours).padStart(2, '0'),
      m: String(minutes).padStart(2, '0'),
      sec: String(seconds).padStart(2, '0')
    };
  };

  const t = formatTime(timeRemaining);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans select-none">
      
      {/* 1. الجزء العلوي: تدرج بنفسجي (Solo Leveling Style) */}
      <div className="absolute inset-0 z-0 h-[80vh] bg-gradient-to-b from-[#1a0b2e] via-[#0f051a] to-[#000000]">
        {/* تأثير ذرات "مانا" خفيفة */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-mana-flow" />
        
        {/* توهج مركزي ناعم */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.1)_0%,transparent_70%)]" />
      </div>

      {/* 2. العداد المصغر: يشبه تنبيهات "النظام" */}
      <div className="relative z-50 flex flex-col items-center pt-12 w-full">
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/30 px-8 py-3 rounded-sm flex flex-col items-center shadow-[0_0_20px_rgba(139,92,246,0.1)]">
          <div className="text-purple-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            Penalty Quest: Survival
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-4xl font-mono font-light text-white tracking-wider tabular-nums">
              {t.h}<span className="text-purple-500">:</span>{t.m}<span className="text-purple-500">:</span>{t.sec}
            </span>
          </div>
        </div>
        
        {/* نص تحذيري تحت العداد */}
        <div className="mt-4 text-purple-300/40 text-[9px] tracking-widest uppercase font-medium">
          Failure to complete will result in penalty extension
        </div>
      </div>

      {/* 3. الخط الفاصل والأرضية */}
      <div className="absolute bottom-0 left-0 right-0 z-40 h-[20vh] bg-black">
        
        {/* الخط الأحمر (بسيط وغير مشع كما طلبت) */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-red-900/40" />
        
        {/* محتوى الأرضية السفلية (أسود فاحم) */}
        <div className="w-full h-full flex items-center justify-center">
            {/* فارغ تماماً ليعطي إحساس العمق المظلم */}
        </div>
      </div>

      <style>{`
        @keyframes mana-flow {
          from { background-position: 0 0; }
          to { background-position: 500px 1000px; }
        }
        .animate-mana-flow { 
          animation: mana-flow 120s linear infinite; 
        }
        
        /* تحسين مظهر الخطوط لتشبه ألعاب RPG */
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap');
        .font-sans { font-family: 'Rajdhani', sans-serif; }
      `}</style>

    </div>
  );
};
