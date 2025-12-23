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
    <div className="fixed inset-0 z-[100] bg-black/40 overflow-hidden font-sans select-none flex flex-col items-center">
      
      {/* خلفية ضبابية لتعطي شعور الأنمي */}
      <div className="absolute inset-0 z-0 backdrop-blur-[2px] bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* الكارد الرئيسي - Solo Leveling Style */}
      <div className="relative z-50 mt-20 animate-system-popup">
        
        {/* جسم الكارد المائل والشفاف */}
        <div className="relative bg-gradient-to-br from-[#0a1525]/90 to-[#050a10]/95 border-[1.5px] border-blue-400/30 backdrop-blur-md px-12 py-6 shadow-[0_0_30px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(59,130,246,0.1)] skew-x-[-2deg]">
          
          {/* شريط العنوان العلوي الصغير */}
          <div className="absolute -top-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_#60a5fa]" />

          {/* كلمة Penalty Zone بأسلوب النظام */}
          <div className="flex justify-center mb-4">
            <span className="text-white text-xs font-bold tracking-[0.4em] uppercase bg-red-600/80 px-4 py-0.5 rounded-sm shadow-[0_0_10px_rgba(220,38,38,0.4)]">
              Penalty Zone
            </span>
          </div>

          {/* العداد المعكوس - أرقام بيضاء حادة بنص مائل */}
          <div className="flex items-center justify-center gap-4 text-white font-black italic">
            <div className="flex flex-col items-center">
              <span className="text-6xl md:text-7xl tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {t.sec}
              </span>
            </div>
            <span className="text-4xl text-blue-400 opacity-80">:</span>
            <div className="flex flex-col items-center">
              <span className="text-6xl md:text-7xl tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {t.m}
              </span>
            </div>
            <span className="text-4xl text-blue-400 opacity-80">:</span>
            <div className="flex flex-col items-center">
              <span className="text-6xl md:text-7xl tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {t.h}
              </span>
            </div>
          </div>

          {/* خطوط تقنية أسفل العداد */}
          <div className="mt-4 flex justify-center gap-1 opacity-50">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-[2px] h-[4px] bg-blue-400/40" />
            ))}
          </div>
        </div>

        {/* الكاردات الحمراء الجانبية (مثل أجنحة النظام) */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-24 bg-red-600 shadow-[0_0_15px_#dc2626] skew-x-[-10deg]" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-24 bg-red-600 shadow-[0_0_15px_#dc2626] skew-x-[-10deg]" />
      </div>

      {/* المنصة الأرضية (الخط الأحمر) */}
      <div className="absolute bottom-0 w-full h-[8vh]">
        <div className="w-full h-[1px] bg-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
        <div className="w-full h-full bg-gradient-to-b from-red-950/10 to-transparent" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@1,800;1,900&display=swap');
        
        .font-sans { font-family: 'Exo 2', sans-serif; }

        @keyframes system-popup {
          0% { opacity: 0; transform: scale(0.8) translateY(-20px); }
          70% { transform: scale(1.05) translateY(5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .animate-system-popup {
          animation: system-popup 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .italic {
          font-style: italic;
          transform: skewX(-5deg);
        }
      `}</style>

    </div>
  );
};
