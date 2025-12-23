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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans select-none flex items-center justify-center">
      
      {/* الخلفية بتدرج بنفسجي عميق جداً */}
      <div className="absolute inset-0 z-0 h-full bg-[radial-gradient(circle_at_50%_50%,#1a0b2e_0%,#000000_100%)] opacity-80" />

      {/* حاوية العداد المركزية - المنصة */}
      <div className="relative z-50 flex items-center gap-4 animate-scale-in">
        
        {/* الكارد الأحمر الجانبي (يسار) */}
        <div className="h-32 w-2 bg-gradient-to-b from-red-600 via-red-900 to-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] border-r border-white/10" />

        {/* جسم العداد الرئيسي */}
        <div className="relative bg-[#050505] border-x-4 border-purple-600/50 px-10 py-6 shadow-[0_0_50px_rgba(0,0,0,1)]">
          {/* نص علوي صغير */}
          <div className="absolute -top-3 left-0 right-0 flex justify-center">
            <span className="bg-purple-600 text-black text-[10px] font-black px-4 py-0.5 clip-path-polygon">
              SYSTEM PENALTY
            </span>
          </div>

          {/* العداد الأسود العريض (الجبار) */}
          <div className="flex items-center gap-2">
            <span className="text-black text-8xl md:text-9xl font-black tracking-tighter leading-none filter drop-shadow-[0_0_2px_rgba(168,85,247,0.8)] [text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff]">
              {t.h}
            </span>
            <span className="text-purple-500 text-7xl font-black animate-pulse">:</span>
            <span className="text-black text-8xl md:text-9xl font-black tracking-tighter leading-none filter drop-shadow-[0_0_2px_rgba(168,85,247,0.8)] [text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff]">
              {t.m}
            </span>
            <span className="text-purple-500 text-7xl font-black animate-pulse">:</span>
            <span className="text-black text-8xl md:text-9xl font-black tracking-tighter leading-none filter drop-shadow-[0_0_2px_rgba(168,85,247,0.8)] [text-shadow:_-2px_-2px_0_#fff,_2px_-2px_0_#fff,_-2px_2px_0_#fff,_2px_2px_0_#fff]">
              {t.sec}
            </span>
          </div>

          {/* تفاصيل تقنية تحت العداد */}
          <div className="mt-4 flex justify-between items-center opacity-40">
            <div className="h-[1px] w-12 bg-purple-500" />
            <span className="text-purple-400 text-[9px] font-bold tracking-[0.3em]">REMAINING TIME</span>
            <div className="h-[1px] w-12 bg-purple-500" />
          </div>
        </div>

        {/* الكارد الأحمر الجانبي (يمين) */}
        <div className="h-32 w-2 bg-gradient-to-b from-red-600 via-red-900 to-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] border-l border-white/10" />
      </div>

      {/* الخط الأحمر السفلي - بسيط وغير مشع */}
      <div className="absolute bottom-[10vh] left-0 right-0 h-[1.5px] bg-red-950/50" />

      {/* الشاشة السفلية - أسود فاحم */}
      <div className="absolute bottom-0 left-0 right-0 h-[10vh] bg-black" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Syncopate:wght@700&display=swap');
        
        .font-sans { font-family: 'Inter', sans-serif; }
        
        .clip-path-polygon {
          clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);
        }

        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.2, 0, 0.2, 1) forwards;
        }

        /* جعل النص الأسود بارز جداً بخلفية بيضاء رفيعة */
        .text-black {
          color: #000;
        }
      `}</style>

    </div>
  );
};
