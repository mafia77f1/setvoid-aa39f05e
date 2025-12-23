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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans select-none">
      
      {/* 1. العداد العلوي (أسلوب نظام Solo Leveling) */}
      <div className="relative z-50 flex flex-col items-center pt-6 w-full">
        <div className="flex flex-col items-center">
          {/* نص التنبيه الصغير */}
          <div className="flex items-center gap-2 mb-1">
            <div className="h-[1px] w-8 bg-red-600"></div>
            <span className="text-red-600 font-bold tracking-[0.3em] text-[10px] uppercase">
              Penalty Quest: Survive
            </span>
            <div className="h-[1px] w-8 bg-red-600"></div>
          </div>
          
          {/* الوقت الرقمي - أصغر وأكثر حدة */}
          <div className="text-3xl font-mono font-light text-white/90 tracking-widest tabular-nums">
            {t.h}<span className="animate-pulse text-red-600">:</span>{t.m}<span className="animate-pulse text-red-600">:</span>{t.sec}
          </div>
        </div>
      </div>

      {/* 2. بيئة الكهف (الخلفية العلوية) */}
      <div className="absolute inset-0 z-0 h-[60vh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.05)_0%,transparent 70%)]" />
      </div>

      {/* 3. الأرضية السوداء الكبيرة (الأسفل) */}
      <div className="absolute bottom-0 left-0 right-0 z-40 h-[45vh] bg-black flex flex-col items-center">
        
        {/* الخط الأحمر المتوهج (أفق البوابة) */}
        <div className="w-full h-[3px] bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8),0_0_60px_rgba(220,38,38,0.4)] relative">
            {/* شرارات متوهجة فوق الخط */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-600 to-transparent blur-sm opacity-50"></div>
        </div>

        {/* النص التحذيري الضخم في الأسفل (اختياري لجمالية Solo Leveling) */}
        <div className="mt-20 opacity-20 flex flex-col items-center">
            <h1 className="text-white text-6xl font-black tracking-tighter italic">PENALTY</h1>
            <div className="h-1 w-full bg-red-900 mt-2"></div>
        </div>

        {/* تعتيم إضافي للأسفل لجعله "أسود فاحم" */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black pointer-events-none"></div>
      </div>

      {/* تأثير الغبار الرقمي */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-float-dust" />

      <style>{`
        @keyframes float-dust {
          from { transform: translateY(0); }
          to { transform: translateY(-100px); }
        }
        .animate-float-dust { animation: float-dust 20s linear infinite; }
      `}</style>

    </div>
  );
};
