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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans select-none flex flex-col">
      
      {/* 1. الجزء العلوي: سماء بنفسجية محمرة (Solo Leveling Sky) */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        {/* التدرج اللوني للسماء */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2e0b3d] via-[#4a0a1c] to-black" />
        
        {/* توهج مركزي يعطي عمق للسماء */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.2)_0%,transparent_70%)]" />

        {/* العداد العلوي: نيون أبيض ونظيف */}
        <div className="relative z-50 mt-14 flex flex-col items-center">
          <div className="px-3 py-0.5 border-b border-red-500/50">
            <span className="text-red-500 font-bold tracking-[0.6em] text-[7px] uppercase">System Penalty</span>
          </div>
          <div className="text-4xl font-mono font-extralight text-white tracking-widest mt-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            {t.h}<span className="text-red-600 animate-pulse">:</span>{t.m}<span className="text-red-600 animate-pulse">:</span>{t.sec}
          </div>
        </div>
        
        {/* ضباب خفيف عند الأفق */}
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* 2. الخط الفاصل: خط طاقة حاد وقريب جداً */}
      <div className="relative z-50 h-[2px] w-full bg-red-600 shadow-[0_0_35px_5px_rgba(220,38,38,0.8),0_0_10px_1px_#ffffff]">
        {/* توهج الانعكاس على الشاشة */}
        <div className="absolute -top-4 left-0 right-0 h-8 bg-red-600/10 blur-xl" />
      </div>

      {/* 3. الجزء السفلي: أسود بالكامل (True Black) */}
      <div className="relative flex-1 w-full bg-[#000000]">
        {/* لا توجد خلفيات متحركة هنا، فقط سواد مطلق */}
        
        {/* نص "Warning" مخفي تقريباً في السواد */}
        <div className="flex justify-center mt-10">
           <span className="text-red-900/10 text-8xl font-black italic tracking-tighter">SURVIVE</span>
        </div>
      </div>

      {/* تأثير شرارات طاقة حمراء نادرة تتطاير في السماء فقط */}
      <div className="absolute top-0 left-0 right-0 h-[65vh] pointer-events-none z-30 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

    </div>
  );
};
