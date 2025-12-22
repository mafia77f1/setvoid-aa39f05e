import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PenaltyZoneScreenProps {
  endTime: string; // مثال: "2025-12-22T23:59:59"
  onTimeComplete: () => void;
}

export const PenaltyZoneScreen = ({ endTime, onTimeComplete }: PenaltyZoneScreenProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  // تحديث عداد الوقت
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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      
      {/* 1. وصف البيئة: الكهف السينمائي الفارغ */}
      <div className="absolute inset-0">
        {/* تأثير الصخور والظلام */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,0,0,0.2)_0%,black_100%)] z-10" />
        
        {/* نسيج صخري خلفي خفيف جداً */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay bg-cover bg-center z-0"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-matter.png')" }}
        />

        {/* ضباب أحمر متحرك في قاع الكهف */}
        <div className="absolute bottom-[-10%] left-0 w-full h-[50vh] bg-red-900/10 blur-[120px] rounded-[100%] animate-pulse z-20" />
      </div>

      {/* 2. العداد الرقمي العلوي (Solo Leveling Style) */}
      <div className="relative z-50 flex flex-col items-center pt-20">
        {/* تسمية المهمة */}
        <div className="mb-4 text-red-600 font-black tracking-[0.6em] text-[10px] uppercase drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
          Penalty Quest: Survive
        </div>

        {/* أرقام الوقت */}
        <div className="flex items-center gap-6 bg-black/60 backdrop-blur-xl px-10 py-6 border border-red-900/20 rounded-xl shadow-2xl">
          <div className="flex flex-col items-center">
            <span className="text-7xl md:text-8xl font-mono font-black text-white leading-none tracking-tighter">
              {t.h}
            </span>
            <span className="text-[9px] text-gray-500 font-bold mt-2 tracking-widest">HOUR</span>
          </div>

          <span className="text-5xl font-mono text-red-700 animate-pulse pb-6">:</span>

          <div className="flex flex-col items-center">
            <span className="text-7xl md:text-8xl font-mono font-black text-white leading-none tracking-tighter">
              {t.m}
            </span>
            <span className="text-[9px] text-gray-500 font-bold mt-2 tracking-widest">MIN</span>
          </div>

          <span className="text-5xl font-mono text-red-700 animate-pulse pb-6">:</span>

          <div className="flex flex-col items-center">
            <span className="text-7xl md:text-8xl font-mono font-black text-white leading-none tracking-tighter">
              {t.sec}
            </span>
            <span className="text-[9px] text-gray-500 font-bold mt-2 tracking-widest">SEC</span>
          </div>
        </div>

        {/* شريط التقدم النحيف */}
        <div className="mt-6 w-72 h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>

      {/* 3. إضافات جوية: غبار يتطاير (اختياري) */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-slow-scroll" />
      </div>

      <style>{`
        @keyframes slow-scroll {
          from { background-position: 0 0; }
          to { background-position: 500px 500px; }
        }
        .animate-slow-scroll {
          animation: slow-scroll 60s linear infinite;
        }
      `}</style>

    </div>
  );
};
