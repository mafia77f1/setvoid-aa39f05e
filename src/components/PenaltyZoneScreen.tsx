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

      {/* الجزء السفلي - الخط والشخصية البشرية الاحترافية */}
      <div className="relative h-[40vh] w-full bg-black flex flex-col items-center">
        
        <div className="absolute top-[30%] left-0 right-0 z-50 flex flex-col items-center">
          
          {/* مجسم بشري مرسوم بدقة عالية (Humanoid Vector) */}
          <div className="relative mb-[-8px] w-24 h-40 flex justify-center items-end">
            <svg 
              viewBox="0 0 100 200" 
              className="w-full h-full drop-shadow-[0_0_15px_rgba(220,38,38,0.7)]"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* تدرج لوني للجسم */}
              <defs>
                <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="50%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
              </defs>

              {/* رسم الجسم: الرأس، الأكتاف، الظهر، الصدر والأطراف كقطعة واحدة */}
              <path 
                d="M50,15 c5,0 9,4 9,10 c0,6 -4,10 -9,10 c-5,0 -9,-4 -9,-10 c0,-6 4,-10 9,-10 Z 
                   M50,35 c-2,0 -3,2 -3,4 l-1,6 c-12,2 -18,6 -20,15 c-2,10 -1,30 -1,35 c0,3 2,5 4,5 s4,-2 4,-5 l1,-25 l2,40 l-2,50 c0,4 3,6 5,6 s5,-2 5,-6 l3,-45 l3,45 c0,4 3,6 5,6 s5,-2 5,-6 l-2,-50 l2,-40 l1,25 c0,3 2,5 4,5 s4,-2 4,-5 c0,-5 1,-25 -1,-35 c-2,-9 -8,-13 -20,-15 l-1,-6 c0,-2 -1,-4 -3,-4 Z" 
                fill="url(#bodyGradient)"
              />
            </svg>
            
            {/* وهج تحت الشخصية */}
            <div className="absolute bottom-4 w-12 h-4 bg-red-600/40 blur-xl rounded-full" />
          </div>

          {/* الخط الأحمر */}
          <div className="h-[4px] w-full bg-red-600 shadow-[0_0_25px_3px_rgba(220,38,38,1),0_0_50px_15px_rgba(220,38,38,0.5)]" />
          <div className="absolute top-[160px] w-full h-8 bg-red-500/20 blur-xl" />
        </div>

        <div className="w-full h-full opacity-25 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
      </div>

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
