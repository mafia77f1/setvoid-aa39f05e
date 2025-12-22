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
    <div className="fixed inset-0 z-[100] bg-[#000000] overflow-hidden font-sans">
      
      {/* 1. بيئة الكهف (الخلفية العلوية) */}
      <div className="absolute inset-0 z-0 h-[75vh]">
        {/* تدرج أحمر خافت جداً للكهف */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(60,0,0,0.1)_0%,#000000_100%)] z-10" />
        
        {/* نسيج صخري مظلم جداً */}
        <div 
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-matter.png')" }}
        />
      </div>

      {/* 2. العداد المصغر في الأعلى */}
      <div className="relative z-50 flex flex-col items-center pt-8 w-full">
        <div className="bg-black/90 backdrop-blur-xl border border-red-900/50 px-5 py-1.5 rounded-md flex flex-col items-center shadow-[0_0_15px_rgba(255,0,0,0.05)]">
          <div className="text-red-700 font-black tracking-[0.5em] text-[7px] uppercase mb-0.5 opacity-80">
            PENALTY COUNTDOWN
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-2xl font-mono font-bold text-white tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {t.h}:{t.m}:{t.sec}
            </span>
          </div>
        </div>
      </div>

      {/* 3. الأرضية السوداء الفاحمة والمشعة */}
      <div className="absolute bottom-0 left-0 right-0 z-40 h-[30vh] bg-[#000000]">
        
        {/* خط الأفق المشع (التوهج الأحمر) */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_25px_5px_rgba(220,38,38,0.6),0_0_10px_2px_rgba(220,38,38,0.8)] z-50" />
        
        {/* تأثير إضاءة منعكسة على حافة الأرضية */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none" />

        {/* محتوى الأرضية (سواد فاحم) */}
        <div className="w-full h-full flex flex-col items-center justify-center border-t border-red-900/10">
            {/* نبض خفيف للسواد لإعطائه حياة */}
            <div className="w-full h-full bg-[#000000] animate-pulse-slow opacity-90" />
        </div>
      </div>

      {/* تأثير غبار الكهف المظلم */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-cave-dust" />

      <style>{`
        @keyframes cave-dust {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 1; }
        }
        .animate-cave-dust { animation: cave-dust 180s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 5s ease-in-out infinite; }
      `}</style>

    </div>
  );
};
