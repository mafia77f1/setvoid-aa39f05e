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
    <div className="fixed inset-0 z-[100] bg-black/90 overflow-hidden font-mono select-none flex flex-col items-center">
      
      {/* تأثير الشبكة الخلفية (Grid) - مثل أنظمة الألعاب */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* الحاوية العلوية - العداد */}
      <div className="relative z-50 mt-16 flex flex-col items-center">
        
        {/* عنوان النظام */}
        <div className="mb-2 flex items-center gap-4">
          <div className="h-[1px] w-12 bg-red-600/50" />
          <span className="text-red-600 text-xs font-bold tracking-[0.5em] uppercase animate-pulse">
            Penalty Quest: Survival
          </span>
          <div className="h-[1px] w-12 bg-red-600/50" />
        </div>

        {/* جسم العداد - بسيط وحاد */}
        <div className="relative group">
          {/* وهج خلفي خفيف */}
          <div className="absolute -inset-1 bg-red-600/20 blur-xl rounded-full opacity-50" />
          
          <div className="relative flex items-baseline gap-2 text-white font-black italic">
            <span className="text-6xl md:text-7xl tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {t.h}
            </span>
            <span className="text-4xl text-red-600 animate-[blink_1s_infinite]">:</span>
            <span className="text-6xl md:text-7xl tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {t.m}
            </span>
            <span className="text-4xl text-red-600 animate-[blink_1s_infinite]">:</span>
            <span className="text-6xl md:text-7xl tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {t.sec}
            </span>
          </div>
        </div>

        {/* شريط التقدم الصغير تحت العداد */}
        <div className="mt-4 w-48 h-[2px] bg-white/10 overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-1000 ease-linear shadow-[0_0_8px_#dc2626]" 
            style={{ width: `${(timeRemaining % 60) * 1.66}%` }}
          />
        </div>
      </div>

      {/* المنصة السفلية - "الأرض" */}
      <div className="absolute bottom-0 w-full h-[12vh]">
        {/* السطح العلوي للمنصة (خط ليزر) */}
        <div className="w-full h-[1px] bg-red-600 shadow-[0_0_15px_#dc2626]" />
        
        {/* جسم المنصة */}
        <div className="w-full h-full bg-gradient-to-b from-red-950/20 to-black/80 backdrop-blur-sm border-t border-red-900/10 flex flex-col items-center pt-4">
          <span className="text-red-900/40 text-[10px] tracking-[1em] uppercase font-bold">
            Emergency System Active
          </span>
          
          {/* لمسة نهائية: الخطوط المائلة الأرضية */}
          <div className="absolute inset-0 opacity-5 flex justify-around items-end pb-2 pointer-events-none">
             {[...Array(10)].map((_, i) => (
               <div key={i} className="w-[1px] h-full bg-white -rotate-[30deg]" />
             ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap');
        
        .font-mono { font-family: 'Orbitron', sans-serif; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.1; }
        }

        /* تحسين شكل الأرقام لتكون مائلة قليلاً مثل الأنمي */
        .italic {
          transform: skewX(-5deg);
        }
      `}</style>

    </div>
  );
};
