import { useState, useEffect } from 'react';

interface PenaltyZoneScreenProps {
  endTime: string; 
  onTimeComplete?: () => void;
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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans select-none flex flex-col items-center">
      
      {/* الخلفية بتدرج بنفسجي عميق */}
      <div className="absolute inset-0 z-0 h-full bg-[radial-gradient(circle_at_50%_20%,#1a0b2e_0%,#000000_100%)] opacity-80" />

      {/* حاوية العداد العلوية - تم تصغيرها ونقلها للأعلى */}
      <div className="relative z-50 mt-10 flex items-center gap-3 animate-scale-in scale-75 md:scale-90">
        
        {/* الكارد الأحمر الجانبي (يسار) - أصغر */}
        <div className="h-16 w-1 bg-gradient-to-b from-red-600 via-red-900 to-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />

        {/* جسم العداد الرئيسي */}
        <div className="relative bg-[#050505] border-x-2 border-purple-600/50 px-6 py-3 shadow-[0_0_40px_rgba(0,0,0,1)]">
          {/* نص علوي صغير */}
          <div className="absolute -top-2 left-0 right-0 flex justify-center">
            <span className="bg-purple-600 text-black text-[8px] font-black px-3 py-0.5 clip-path-polygon">
              SYSTEM PENALTY
            </span>
          </div>

          {/* العداد الأسود المدمج */}
          <div className="flex items-center gap-1.5">
            <span className="text-black text-5xl md:text-6xl font-black tracking-tighter leading-none [text-shadow:_-1.5px_-1.5px_0_#fff,_1.5px_-1.5px_0_#fff,_-1.5px_1.5px_0_#fff,_1.5px_1.5px_0_#fff]">
              {t.h}
            </span>
            <span className="text-purple-500 text-3xl font-black animate-pulse">:</span>
            <span className="text-black text-5xl md:text-6xl font-black tracking-tighter leading-none [text-shadow:_-1.5px_-1.5px_0_#fff,_1.5px_-1.5px_0_#fff,_-1.5px_1.5px_0_#fff,_1.5px_1.5px_0_#fff]">
              {t.m}
            </span>
            <span className="text-purple-500 text-3xl font-black animate-pulse">:</span>
            <span className="text-black text-5xl md:text-6xl font-black tracking-tighter leading-none [text-shadow:_-1.5px_-1.5px_0_#fff,_1.5px_-1.5px_0_#fff,_-1.5px_1.5px_0_#fff,_1.5px_1.5px_0_#fff]">
              {t.sec}
            </span>
          </div>

          <div className="mt-2 flex justify-center items-center opacity-30">
            <span className="text-purple-400 text-[7px] font-bold tracking-[0.4em]">REMAINING</span>
          </div>
        </div>

        {/* الكارد الأحمر الجانبي (يمين) - أصغر */}
        <div className="h-16 w-1 bg-gradient-to-b from-red-600 via-red-900 to-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
      </div>

      {/* المنصة السفلية (الأرضية) */}
      <div className="absolute bottom-0 left-0 right-0 h-[15vh] flex flex-col items-center">
        {/* حافة المنصة المتوهجة */}
        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_20px_rgba(220,38,38,1)] z-10" />
        
        {/* جسم المنصة - تدرج معدني عميق */}
        <div className="w-full h-full bg-gradient-to-b from-[#1a0505] via-black to-black border-t border-red-900/20 flex justify-center overflow-hidden">
          {/* تفاصيل ميكانيكية على الأرضية */}
          <div className="flex gap-16 mt-6 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-24 h-[1px] bg-red-500 rotate-[45deg] blur-[0.5px]" />
            ))}
          </div>
        </div>
      </div>

      {/* ظل خفيف في منتصف الشاشة للعمق */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-purple-900/5 blur-[120px] pointer-events-none" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');
        
        .font-sans { font-family: 'Inter', sans-serif; }
        
        .clip-path-polygon {
          clip-path: polygon(15% 0, 85% 0, 100% 100%, 0% 100%);
        }

        @keyframes scale-in {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(0.9); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.2, 0, 0.2, 1) forwards;
        }

        .text-black { color: #000; }
      `}</style>

    </div>
  );
};
