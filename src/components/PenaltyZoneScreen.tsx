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
      
      {/* 1. الأنياب العلوية (تتدلى من سقف الشاشة) */}
      <div className="absolute top-0 left-0 right-0 z-[60] flex items-start justify-around pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div 
            key={`top-${i}`}
            className="bg-black border-x border-red-900/20"
            style={{
              width: `${10 + Math.random() * 15}%`,
              height: `${15 + Math.random() * 20}vh`,
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.8))'
            }}
          />
        ))}
      </div>

      {/* 2. بيئة الكهف والعداد */}
      <div className="absolute inset-0 z-0 h-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(80,0,0,0.15)_0%,#000000_100%)] z-10" />
        
        <div className="relative z-50 flex flex-col items-center pt-24 w-full">
            <div className="bg-black/80 backdrop-blur-md border border-red-900/40 px-6 py-2 rounded-sm flex flex-col items-center">
              <div className="text-red-600 font-black tracking-[0.4em] text-[8px] uppercase mb-1">
                RESTRICTED AREA
              </div>
              <div className="text-3xl font-mono font-bold text-white tabular-nums tracking-wider">
                {t.h}:{t.m}:{t.sec}
              </div>
            </div>
        </div>
      </div>

      {/* 3. الأرضية والخط الأحمر */}
      <div className="absolute bottom-0 left-0 right-0 z-40 h-[25vh] bg-[#000000]">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)] z-50" />
        
        {/* 4. الأنياب السفلية (تخرج من أسفل الشاشة) */}
        <div className="absolute bottom-0 left-0 right-0 z-[60] flex items-end justify-around pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div 
              key={`bot-${i}`}
              className="bg-black border-x border-red-900/30 shadow-[0_-10px_20px_rgba(255,0,0,0.05)]"
              style={{
                width: `${12 + Math.random() * 18}%`,
                height: `${20 + Math.random() * 25}vh`,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              }}
            />
          ))}
        </div>
      </div>

      {/* تأثيرات الغبار */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-cave-dust" />

      <style>{`
        @keyframes cave-dust {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }
        .animate-cave-dust { animation: cave-dust 150s linear infinite; }
      `}</style>

    </div>
  );
};
