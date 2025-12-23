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
      
      {/* الجزء العلوي - مساحة أكبر للتركيز */}
      <div className="relative h-[65vh] w-full bg-gradient-to-b from-[#120820] via-[#08040d] to-black flex flex-col items-center justify-center">
        
        {/* إضاءة خلفية خافتة جداً */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(139,92,246,0.1)_0%,transparent_60%)]" />

        {/* العداد - تم تصغيره ليكون أنيقاً */}
        <div className="relative z-50 flex flex-col items-center scale-90"> 
          <div className="mb-2">
            <span className="text-red-600/80 font-medium tracking-[0.8em] text-[7px] uppercase">
              System Penalty
            </span>
          </div>
          <div className="text-2xl font-mono font-extralight text-white/90 tracking-[0.3em]">
            {t.h}<span className="text-red-700 animate-pulse">:</span>{t.m}<span className="text-red-700 animate-pulse">:</span>{t.sec}
          </div>
          {/* خط رفيع جداً تحت العداد */}
          <div className="w-12 h-[1px] bg-red-900/50 mt-2" />
        </div>

        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </div>

      {/* الجزء السفلي - الأرضية */}
      <div className="relative h-[35vh] w-full bg-black">
        
        {/* الخط الأحمر - تم إنزاله للأسفل ليكون في الثلث الأخير من القسم السفلي */}
        <div className="absolute top-[60%] left-0 right-0 z-50">
          <div className="h-[2px] w-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
          <div className="absolute -top-1 w-full h-3 bg-red-500/10 blur-lg" />
        </div>

        {/* نقش الأرضية */}
        <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      </div>

      {/* تأثير الغبار المتطاير */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-float" />

      <style>{`
        @keyframes float {
          0% { background-position: 0 0; }
          100% { background-position: 500px 1000px; }
        }
        .animate-float { animation: float 120s linear infinite; }
      `}</style>
      
    </div>
  );
};
