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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      
      {/* 1. بيئة الكهف (الخلفية) */}
      <div className="absolute inset-0 z-0">
        {/* تدرج الكهف العلوي */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(80,0,0,0.12)_0%,black_100%)] z-10" />
        
        {/* نسيج الكهف (Texture) */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')" }}
        />
      </div>

      {/* 2. العداد المصغر في الأعلى */}
      <div className="relative z-50 flex flex-col items-center pt-10 w-full">
        <div className="bg-black/80 backdrop-blur-md border border-red-900/40 px-6 py-2 rounded-lg flex flex-col items-center shadow-2xl">
          <div className="text-red-600 font-black tracking-[0.4em] text-[8px] uppercase mb-1">
            PENALTY TIME
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-3xl font-mono font-bold text-white tracking-tighter tabular-nums">
              {t.h}:{t.m}:{t.sec}
            </span>
          </div>
        </div>
      </div>

      {/* 3. الأرضية السوداء (التي طلبتها) */}
      <div className="absolute bottom-0 left-0 right-0 z-40">
        {/* خط الأفق/الأرضية المدبب قليلاً */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-900/20 to-transparent shadow-[0_-10px_20px_rgba(127,29,29,0.1)]" />
        
        {/* الجزء السفلي الأسود بالكامل */}
        <div className="h-[25vh] w-full bg-black border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,1)] flex items-center justify-center">
            {/* نص اختياري خافت جداً يعطي طابع تقني */}
            <div className="text-white/5 text-[10px] tracking-[1em] uppercase font-bold">
                Shadow Abyss Floor
            </div>
        </div>
      </div>

      {/* تأثير الغبار المتطاير فوق الكهف وتحت العداد */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-cave-dust" />

      <style>{`
        @keyframes cave-dust {
          from { background-position: 0 0; }
          to { background-position: 800px 800px; }
        }
        .animate-cave-dust {
          animation: cave-dust 150s linear infinite;
        }
      `}</style>

    </div>
  );
};
