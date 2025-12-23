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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans select-none" style={{ perspective: '1000px' }}>
      
      {/* 1. العداد العلوي الصغير (System UI) */}
      <div className="relative z-50 flex flex-col items-center pt-10 w-full">
        <div className="flex flex-col items-center opacity-80">
          <span className="text-red-600 font-bold tracking-[0.4em] text-[9px] uppercase mb-1 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">
            SYSTEM: PENALTY INFO
          </span>
          <div className="text-2xl font-mono font-light text-white tracking-[0.2em] tabular-nums">
            {t.h}<span className="text-red-600">:</span>{t.m}<span className="text-red-600">:</span>{t.sec}
          </div>
        </div>
      </div>

      {/* 2. الأرضية السوداء الضخمة مع الخط القريب */}
      <div className="absolute bottom-0 left-0 right-0 z-40 h-[50vh]">
        
        {/* الخط الأحمر - بتقنية الـ Perspective ليبدو قريباً جداً */}
        <div 
          className="absolute top-0 left-[-10%] right-[-10%] h-[4px] bg-red-600 shadow-[0_0_40px_10px_rgba(220,38,38,0.7),0_0_10px_2px_white]"
          style={{ 
            transform: 'rotateX(45deg)',
            boxShadow: '0 0 50px #ff0000, 0 0 100px #7f0000'
          }}
        />

        {/* السواد الفاحم (الأرضية) */}
        <div className="w-full h-full bg-black flex flex-col items-center justify-start pt-12">
            {/* نص باهت جداً في العمق الأسود */}
            <div className="opacity-[0.03] select-none pointer-events-none">
                <h2 className="text-[12vw] font-black italic text-white leading-none">WARNING</h2>
            </div>
        </div>

        {/* توهج أحمر على أطراف الشاشة لزيادة حدة القرب */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* تأثير نبض خفيف للشاشة بأكملها (أحمر خافت) */}
      <div className="absolute inset-0 pointer-events-none z-[60] animate-screen-pulse" />

      <style>{`
        @keyframes screen-pulse {
          0%, 100% { box-shadow: inset 0 0 50px rgba(0,0,0,1); }
          50% { box-shadow: inset 0 0 100px rgba(220,38,38,0.15); }
        }
        .animate-screen-pulse { 
          animation: screen-pulse 4s ease-in-out infinite; 
          width: 100%; 
          height: 100%;
        }
      `}</style>

    </div>
  );
};
