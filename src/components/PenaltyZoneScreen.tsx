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
      
      {/* الجزء العلوي - العداد */}
      <div className="relative h-[60vh] w-full bg-gradient-to-b from-[#1a0b2e] via-[#0d0517] to-black flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.2)_0%,transparent_70%)]" />

        <div className="relative z-50 flex flex-col items-center w-full px-4">
          <div className="px-6 py-1 border-x-2 border-red-600/40 mb-6">
            <span className="text-red-500 font-bold tracking-[0.5em] text-[12px] md:text-[14px] uppercase">
              Penalty Countdown
            </span>
          </div>
          
          <div className="text-6xl sm:text-7xl md:text-9xl font-mono font-light text-white tracking-[0.1em] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            {t.h}<span className="text-red-600 animate-pulse">:</span>{t.m}<span className="text-red-600 animate-pulse">:</span>{t.sec}
          </div>
        </div>

        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-10" />
      </div>

      {/* الجزء السفلي - الخط الأحمر والمجسم المفصل */}
      <div className="relative h-[40vh] w-full bg-black flex flex-col items-center">
        
        {/* منطقة الشخصية والخط */}
        <div className="absolute top-[30%] left-0 right-0 z-50 flex flex-col items-center">
          
          {/* مجسم الشخصية (Avatar) مع اليدين والرجلين */}
          <div className="relative mb-[-2px] flex flex-col items-center">
            
            {/* الرأس */}
            <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white] mb-1" />
            
            {/* الجذع واليدين */}
            <div className="relative flex items-start justify-center">
                {/* اليد اليسرى */}
                <div className="w-[3px] h-8 bg-gradient-to-b from-white to-red-600/50 -rotate-12 mr-1 rounded-full opacity-80" />
                
                {/* الجذع (الصدر) */}
                <div className="w-7 h-9 bg-gradient-to-b from-white via-white/80 to-red-600/40 rounded-t-lg shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                
                {/* اليد اليمنى */}
                <div className="w-[3px] h-8 bg-gradient-to-b from-white to-red-600/50 rotate-12 ml-1 rounded-full opacity-80" />
            </div>

            {/* الحوض والأرجل */}
            <div className="flex justify-center gap-2 mt-[-2px]">
                {/* الرجل اليسرى */}
                <div className="w-[4px] h-10 bg-gradient-to-b from-red-600/40 to-red-600 rounded-full" />
                {/* الرجل اليمنى */}
                <div className="w-[4px] h-10 bg-gradient-to-b from-red-600/40 to-red-600 rounded-full" />
            </div>

            {/* وهج تحت أرجل الشخصية */}
            <div className="absolute -bottom-1 w-12 h-4 bg-red-600/30 blur-md rounded-[100%]" />
          </div>

          {/* الخط الأحمر المتوهج */}
          <div className="h-[4px] w-full bg-red-600 shadow-[0_0_25px_3px_rgba(220,38,38,1),0_0_50px_15px_rgba(220,38,38,0.5)]" />
          <div className="absolute top-[82px] w-full h-8 bg-red-500/20 blur-xl" />
        </div>

        {/* تفاصيل الأرضية */}
        <div className="w-full h-full opacity-25 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
      </div>

      {/* تأثير الغبار المتطاير */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.09] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-float" />

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
