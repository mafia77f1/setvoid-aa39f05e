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
      
      {/* 1. بيئة الكهف (خلفية سينمائية) */}
      <div className="absolute inset-0">
        {/* تدرج الكهف المظلم */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,0,0,0.15)_0%,black_100%)] z-10" />
        
        {/* نسيج الصخور (Texture) */}
        <div 
          className="absolute inset-0 opacity-15 mix-blend-overlay bg-cover bg-center z-0"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')" }}
        />

        {/* توهج أحمر في الأسفل لعمق الكهف */}
        <div className="absolute bottom-[-20%] left-0 w-full h-[60vh] bg-red-950/20 blur-[150px] rounded-full z-20" />
      </div>

      {/* 2. العداد المصغر في الأعلى (Compact Header) */}
      <div className="relative z-50 flex flex-col items-center pt-8 w-full">
        {/* إطار العداد الصغير */}
        <div className="bg-black/60 backdrop-blur-md border border-red-900/30 px-6 py-2 rounded-lg flex flex-col items-center shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <div className="text-red-500 font-black tracking-[0.4em] text-[8px] uppercase mb-1">
            PENALTY TIME
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-3xl font-mono font-bold text-white tracking-tighter tabular-nums">
              {t.h}:{t.m}:{t.sec}
            </span>
          </div>

          {/* خط تقدم نحيف جداً تحت الأرقام */}
          <div className="w-full h-[1px] bg-red-900/30 mt-1 overflow-hidden">
            <div className="h-full bg-red-600 animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
        
        {/* رسالة "ابق على قيد الحياة" تحت العداد مباشرة بخط صغير جداً */}
        <div className="mt-2 text-white/30 text-[9px] font-bold tracking-widest uppercase">
          Survive until the end
        </div>
      </div>

      {/* تأثير الغبار المتطاير في الكهف */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-cave-dust" />

      <style>{`
        @keyframes cave-dust {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }
        .animate-cave-dust {
          animation: cave-dust 120s linear infinite;
        }
      `}</style>

    </div>
  );
};
