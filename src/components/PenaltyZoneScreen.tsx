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
      
      {/* 1. بيئة الكهف (الخلفية العلوية المحدثة) */}
      <div className="absolute inset-0 z-0 h-[70vh]">
        {/* تأثير الصخور والجدران - تدرج شعاعي يعطي إيحاء بعمق الكهف */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(100,0,0,0.18)_0%,#000000_80%)] z-10" />
        
        {/* نسيج صخري حاد (Cave Texture) */}
        <div 
          className="absolute inset-0 opacity-[0.08] mix-blend-screen bg-cover bg-center"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rocky-wall.png')" }}
        />

        {/* ضباب أحمر خفيف يتحرك في زوايا الكهف */}
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[40%] bg-red-900/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[30%] bg-red-900/5 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>

      {/* 2. العداد المصغر في الأعلى (ثابت) */}
      <div className="relative z-50 flex flex-col items-center pt-8 w-full">
        <div className="bg-black/90 backdrop-blur-xl border border-red-900/40 px-5 py-1.5 rounded-md flex flex-col items-center">
          <div className="text-red-700 font-black tracking-[0.5em] text-[7px] uppercase mb-0.5">
            PENALTY COUNTDOWN
          </div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-mono font-bold text-white tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">
              {t.h}:{t.m}:{t.sec}
            </span>
          </div>
        </div>
      </div>

      {/* 3. الأرضية السوداء المشعة (لم يتم تغييرها بناءً على طلبك) */}
      <div className="absolute bottom-0 left-0 right-0 z-40 h-[30vh] bg-[#000000]">
        
        {/* الخط المشع الثابت */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_25px_5px_rgba(220,38,38,0.6),0_0_10px_2px_rgba(220,38,38,0.8)] z-50" />
        
        {/* تأثير الإضاءة المنعكسة */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none" />

        {/* السواد الفاحم */}
        <div className="w-full h-full bg-[#000000]" />
      </div>

      {/* غبار الكهف المتطاير */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-cave-dust" />

      <style>{`
        @keyframes cave-dust {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }
        .animate-cave-dust { animation: cave-dust 180s linear infinite; }
      `}</style>

    </div>
  );
};
