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
      
      {/* الجزء العلوي - بنفسجي غامق (أجواء السولو ليفلينج) */}
      <div className="relative h-[60vh] w-full bg-gradient-to-b from-[#1a0b2e] via-[#0d0517] to-black flex flex-col items-center">
        
        {/* إضاءة بنفسجية خافتة في الخلفية */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.15)_0%,transparent_70%)]" />

        {/* العداد العلوي - صغير واحترافي */}
        <div className="relative z-50 mt-12 flex flex-col items-center">
          <div className="px-4 py-1 border-x border-red-600/30">
            <span className="text-red-500 font-bold tracking-[0.5em] text-[8px] uppercase">
              Penalty Countdown
            </span>
          </div>
          <div className="text-3xl font-mono font-light text-white tracking-widest mt-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            {t.h}<span className="text-red-600 animate-pulse">:</span>{t.m}<span className="text-red-600 animate-pulse">:</span>{t.sec}
          </div>
        </div>

        {/* تأثير ضبابي بنفسجي فوق خط الأفق */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </div>

      {/* الجزء السفلي - أسود فاحم (الأرضية) */}
      <div className="relative h-[40vh] w-full bg-black">
        
        {/* الخط الأحمر القريب جداً من الشاشة */}
        <div className="absolute top-0 left-0 right-0 z-50">
          {/* الخط الأساسي المتوهج */}
          <div className="h-[3px] w-full bg-red-600 shadow-[0_0_20px_2px_rgba(220,38,38,0.9),0_0_40px_10px_rgba(220,38,38,0.4)]" />
          
          {/* انعكاس الضوء الأحمر على "عدسة" الشاشة القريبة */}
          <div className="absolute -top-1 w-full h-4 bg-red-500/20 blur-md" />
        </div>

        {/* تفاصيل الأرضية السوداء (تأثير صخري باهت جداً) */}
        <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        
        {/* ظل أسود إضافي لتعميق السواد في الأسفل */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
      </div>

      {/* تأثير الغبار البنفسجي/الأحمر المتطاير */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.07] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-float" />

      <style>{`
        @keyframes float {
          0% { background-position: 0 0; }
          100% { background-position: 500px 1000px; }
        }
        .animate-float { animation: float 100s linear infinite; }
      `}</style>
      
    </div>
  );
};
