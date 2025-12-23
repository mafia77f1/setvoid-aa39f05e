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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-mono select-none flex flex-col items-center">
      
      {/* خلفية معتمة مع وهج أحمر خفيف جداً في الأعلى */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,#450a0a_0%,#000000_70%)] opacity-40" />

      {/* منطقة العداد العلوية */}
      <div className="relative z-50 mt-12 flex flex-col items-center animate-fade-in">
        
        {/* كلمة العقاب */}
        <h1 className="text-red-600 text-2xl font-black tracking-[0.3em] mb-4 uppercase drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          Penalty Zone
        </h1>

        {/* الحاوية الرئيسية (الكاردات والعداد) */}
        <div className="flex items-center gap-6">
          
          {/* كارد أحمر جانبي (يسار) مائل */}
          <div className="w-1.5 h-20 bg-red-600 skew-x-[-15deg] shadow-[0_0_20px_#dc2626] border-r border-white/20" />

          {/* العداد المعكوس (Sec : Min : Hour) */}
          <div className="flex items-baseline gap-3 text-white font-black italic">
            <div className="flex flex-col items-center">
              <span className="text-6xl md:text-7xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{t.sec}</span>
            </div>
            <span className="text-4xl text-red-600 animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <span className="text-6xl md:text-7xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{t.m}</span>
            </div>
            <span className="text-4xl text-red-600 animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <span className="text-6xl md:text-7xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{t.h}</span>
            </div>
          </div>

          {/* كارد أحمر جانبي (يمين) مائل */}
          <div className="w-1.5 h-20 bg-red-600 skew-x-[15deg] shadow-[0_0_20px_#dc2626] border-l border-white/20" />
        </div>
      </div>

      {/* المنصة السفلية (الأرضية العريضة) */}
      <div className="absolute bottom-0 w-full h-[10vh]">
        {/* خط الأفق المتوهج */}
        <div className="w-full h-[2px] bg-red-600 shadow-[0_0_25px_#dc2626] relative z-10" />
        
        {/* القاعدة */}
        <div className="w-full h-full bg-gradient-to-b from-red-950/30 to-black border-t border-red-600/20" />
        
        {/* تأثير ضوئي للأرضية */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(220,38,38,0.05)_41px)]" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap');
        
        .font-mono { font-family: 'Orbitron', sans-serif; }

        .italic {
          transform: skewX(-10deg);
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>

    </div>
  );
};
