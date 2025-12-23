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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans select-none flex flex-col" style={{ perspective: '800px' }}>
      
      {/* 1. الجزء العلوي - بنفسجي غامق جداً (السماء/الكهف) */}
      <div className="relative h-[55vh] w-full bg-gradient-to-b from-[#120621] via-[#08020d] to-black flex flex-col items-center">
        {/* توهج بنفسجي بعيد */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(139,92,246,0.1)_0%,transparent_60%)]" />

        {/* العداد العلوي - تصميم System UI مصغر */}
        <div className="relative z-50 mt-10 text-center">
          <p className="text-red-600 font-black tracking-[0.6em] text-[8px] uppercase opacity-70 mb-1">Penalty Mission</p>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-3xl font-mono font-bold text-white/90">{t.h}</span>
            <span className="text-xl text-red-600 animate-pulse">:</span>
            <span className="text-3xl font-mono font-bold text-white/90">{t.m}</span>
            <span className="text-xl text-red-600 animate-pulse">:</span>
            <span className="text-3xl font-mono font-bold text-white/90">{t.sec}</span>
          </div>
        </div>
      </div>

      {/* 2. المنصة الحمراء العريضة (الخط الذي طلبته) */}
      <div className="relative h-[5vh] w-full z-50">
        {/* المنصة المستطيلة المتوهجة */}
        <div 
          className="absolute inset-0 bg-red-600 shadow-[0_0_50px_rgba(220,38,38,0.8),inset_0_0_20px_rgba(255,255,255,0.5)] border-t border-white/30"
          style={{ 
            transform: 'rotateX(20deg) scaleX(1.1)',
            boxShadow: '0 0 40px #ff0000, 0 10px 60px #7f0000'
          }}
        >
          {/* تأثير البرق/الشرارات على المنصة */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
        </div>
      </div>

      {/* 3. الجزء السفلي - أرضية سوداء فاحمة قريبة جداً */}
      <div className="relative h-[40vh] w-full bg-[#050505] flex justify-center">
        {/* ظل المنصة على الأرضية السوداء */}
        <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-red-950/40 to-transparent blur-xl" />
        
        {/* النص التحذيري الضخم - أسود على أسود (يظهر كبروز) */}
        <div className="mt-16 opacity-10">
            <h2 className="text-[15vw] font-black italic text-white tracking-tighter select-none">
                SURVIVE
            </h2>
        </div>
      </div>

      {/* تأثير الغبار الرقمي المتطاير */}
      <div className="absolute inset-0 pointer-events-none z-[60] opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-slow-float" />

      <style>{`
        @keyframes slow-float {
          from { background-position: 0 0; }
          to { background-position: 0 -1000px; }
        }
        .animate-slow-float { animation: slow-float 60s linear infinite; }
      `}</style>
      
    </div>
  );
};
