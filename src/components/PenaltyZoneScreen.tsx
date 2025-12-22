import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PenaltyZoneScreenProps {
  endTime: string; // تأكد من تمرير تاريخ ينتهي بعد 4 ساعات
  onTimeComplete: () => void;
}

export const PenaltyZoneScreen = ({ endTime, onTimeComplete }: PenaltyZoneScreenProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  // تحديث عداد الوقت (4 ساعات)
  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining <= 0) onTimeComplete();
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [endTime, onTimeComplete]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return {
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(sec).padStart(2, '0')
    };
  };

  const time = formatTime(timeRemaining);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col items-center justify-center">
      
      {/* 1. الخلفية: كهف مظلم وسينمائي (فارغ تماماً) */}
      <div className="absolute inset-0 z-0">
        {/* تأثير الضباب الأحمر المظلم */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(60,0,0,0.2)_0%,black_90%)]" />
        
        {/* نسيج الكهف الصخري (بدون شخصيات) */}
        <div 
          className="absolute inset-0 opacity-30 mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505506819647-681a49710524?q=80')" }}
        />

        {/* ظلال خفيفة جداً في الزوايا لإعطاء عمق المكان */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent opacity-80" />
      </div>

      {/* 2. عداد الوقت (Solo Leveling Style) */}
      <div className="relative z-10 flex flex-col items-center">
        {/* نص علوي صغير */}
        <div className="mb-2 tracking-[0.5em] text-[10px] text-red-500/80 font-bold uppercase animate-pulse">
          Penalty Mission Timer
        </div>

        {/* الأرقام الكبيرة */}
        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-red-900/20 shadow-[0_0_50px_rgba(150,0,0,0.1)]">
          <div className="flex flex-col items-center">
            <span className="text-6xl md:text-8xl font-mono font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {time.hours}
            </span>
            <span className="text-[10px] text-gray-500 font-bold mt-2">HOUR</span>
          </div>
          
          <span className="text-4xl md:text-6xl font-mono font-bold text-red-600 pb-6">:</span>

          <div className="flex flex-col items-center">
            <span className="text-6xl md:text-8xl font-mono font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {time.minutes}
            </span>
            <span className="text-[10px] text-gray-500 font-bold mt-2">MIN</span>
          </div>

          <span className="text-4xl md:text-6xl font-mono font-bold text-red-600 pb-6">:</span>

          <div className="flex flex-col items-center">
            <span className="text-6xl md:text-8xl font-mono font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {time.seconds}
            </span>
            <span className="text-[10px] text-gray-500 font-bold mt-2">SEC</span>
          </div>
        </div>

        {/* شريط التحميل السفلي */}
        <div className="mt-8 w-64 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-900 animate-shimmer" 
            style={{ width: '100%', backgroundSize: '200% 100%' }} 
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>

    </div>
  );
};
