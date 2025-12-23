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
      
      {/* 1. خلفية الكهف والضوء */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(100,0,0,0.2)_0%,#000000_100%)] z-0" />

      {/* 2. إطار الأنياب (Cave Mouth Frame) */}
      {/* سقف الكهف */}
      <div className="absolute top-0 left-0 right-0 z-[60] h-20 bg-black flex" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 95% 100%, 90% 50%, 85% 90%, 80% 40%, 75% 100%, 70% 60%, 65% 95%, 60% 45%, 55% 100%, 50% 55%, 45% 90%, 40% 40%, 35% 95%, 30% 50%, 25% 100%, 20% 60%, 15% 85%, 10% 40%, 5% 95%, 0% 60%)' }} />
      
      {/* أرضية الكهف */}
      <div className="absolute bottom-0 left-0 right-0 z-[60] h-24 bg-black flex" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 40%, 95% 0%, 90% 50%, 85% 10%, 80% 60%, 75% 0%, 70% 40%, 65% 5%, 60% 55%, 55% 0%, 50% 45%, 45% 10%, 40% 60%, 35% 5%, 30% 50%, 25% 0%, 20% 40%, 15% 15%, 10% 60%, 5% 5%, 0% 40%)' }} />

      {/* الجوانب (اختياري لزيادة العمق) */}
      <div className="absolute top-0 bottom-0 left-0 w-8 bg-black z-[60]" style={{ clipPath: 'polygon(0 0, 100% 5%, 40% 10%, 100% 15%, 50% 20%, 100% 25%, 30% 30%, 100% 35%, 60% 40%, 100% 45%, 20% 50%, 100% 55%, 70% 60%, 100% 65%, 40% 70%, 100% 75%, 60% 80%, 100% 85%, 20% 90%, 100% 95%, 0 100%)' }} />
      <div className="absolute top-0 bottom-0 right-0 w-8 bg-black z-[60]" style={{ clipPath: 'polygon(100% 0, 0 5%, 60% 10%, 0 15%, 50% 20%, 0 25%, 70% 30%, 0 35%, 40% 40%, 0 45%, 80% 50%, 0 55%, 30% 60%, 0 65%, 60% 70%, 0 75%, 40% 80%, 0 85%, 80% 90%, 0 95%, 100% 100%)' }} />

      {/* 3. العداد في المنتصف */}
      <div className="relative z-50 flex flex-col items-center justify-center h-full">
        <div className="bg-black/40 backdrop-blur-md border border-red-900/30 p-8 rounded-full shadow-[0_0_50px_rgba(255,0,0,0.1)]">
          <div className="text-red-600 font-black tracking-[0.6em] text-[10px] uppercase mb-2 text-center">
            SYSTEM LOCKED
          </div>
          <div className="text-5xl font-mono font-bold text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {t.h}:{t.m}:{t.sec}
          </div>
        </div>
      </div>

      {/* 4. الخط الأحمر السفلي (خلف الأنياب) */}
      <div className="absolute bottom-[80px] left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)] z-40" />

      {/* تأثيرات الغبار العائمة */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-cave-dust" />

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
