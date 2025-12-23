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
      
      {/* خلفية معتمة مع وهج أحمر خفيف */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_15%,#450a0a_0%,#000000_60%)] opacity-30" />

      {/* الحاوية العلوية المركزية */}
      <div className="relative z-50 mt-16 animate-fade-in scale-90 md:scale-100">
        
        {/* الكارد الرئيسي الموحد */}
        <div className="relative bg-[#080808] border border-white/10 rounded-sm px-8 py-4 shadow-[0_0_40px_rgba(0,0,0,1)]">
          
          {/* لمسات الكارد - الزوايا الحمراء */}
          <div className="absolute top-0 left-0 w-8 h-[2px] bg-red-600 shadow-[0_0_10px_#dc2626]" />
          <div className="absolute top-0 left-0 h-8 w-[2px] bg-red-600 shadow-[0_0_10px_#dc2626]" />
          <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-red-600 shadow-[0_0_10px_#dc2626]" />
          <div className="absolute bottom-0 right-0 h-8 w-[2px] bg-red-600 shadow-[0_0_10px_#dc2626]" />

          {/* العنوان داخل الكارد (بشكل صغير بالأعلى) */}
          <div className="flex flex-col items-center mb-1">
            <span className="text-red-600 text-[10px] font-bold tracking-[0.6em] uppercase opacity-80">
              Penalty Zone
            </span>
            <div className="w-12 h-[1px] bg-red-900/50 mt-1" />
          </div>

          {/* العداد المعكوس (Sec : Min : Hour) داخل الكارد */}
          <div className="flex items-baseline justify-center gap-3 text-white font-black italic">
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {t.sec}
              </span>
            </div>
            <span className="text-3xl text-red-600 animate-[blink_1s_infinite]">:</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {t.m}
              </span>
            </div>
            <span className="text-3xl text-red-600 animate-[blink_1s_infinite]">:</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {t.h}
              </span>
            </div>
          </div>
        </div>

        {/* الكاردات الجانبية الحمراء - خارج الكارد الرئيسي */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-red-600 shadow-[0_0_15px_#dc2626] rounded-full" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-red-600 shadow-[0_0_15px_#dc2626] rounded-full" />
      </div>

      {/* المنصة السفلية (الأرضية) */}
      <div className="absolute bottom-0 w-full h-[12vh]">
        <div className="w-full h-[1.5px] bg-red-600 shadow-[0_0_20px_#dc2626] z-10" />
        <div className="w-full h-full bg-gradient-to-b from-[#120404] to-black" />
        {/* خطوط الديكور الأرضية */}
        <div className="absolute inset-0 opacity-[0.03] flex justify-around">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-white rotate-[15deg]" />
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        
        .font-mono { font-family: 'Orbitron', sans-serif; }

        .italic { transform: skewX(-8deg); }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>

    </div>
  );
};
