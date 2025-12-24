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

      {/* الجزء السفلي - الشخصية القوية جسدياً */}
      <div className="relative h-[40vh] w-full bg-black flex flex-col items-center">
        
        <div className="absolute top-[25%] left-0 right-0 z-50 flex flex-col items-center">
          
          {/* مجسم بشري قوي (Powerful Humanoid) */}
          <div className="relative mb-[-12px] w-32 h-48 flex justify-center items-end scale-110">
            <svg 
              viewBox="0 0 100 200" 
              className="w-full h-full drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="muscularBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="60%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>
              </defs>

              {/* رسم الجسم: رأس، رقبة، أكتاف عريضة، أذرع قوية، وجذع رياضي */}
              <path 
                d="M50,10 c4,0 7,3 7,8 c0,5 -3,8 -7,8 c-4,0 -7,-3 -7,-8 c0,-5 3,-8 7,-8 Z 
                   M48,26 h4 v6 h-4 Z 
                   M50,32 c-4,0 -6,2 -8,4 c-8,2 -18,5 -22,14 c-3,8 -2,35 -2,40 c0,4 3,6 6,6 s6,-2 6,-6 c0,-5 -1,-22 1,-28 c2,-2 4,0 4,2 v45 l-3,55 c0,5 4,8 7,8 s7,-3 7,-8 l3,-45 l3,45 c0,5 4,8 7,8 s7,-3 7,-8 l-3,-55 v-45 c0,-2 2,-4 4,-2 c2,6 1,23 1,28 c0,4 3,6 6,6 s6,-2 6,-6 c0,-5 1,-32 -2,-40 c-4,-9 -14,-12 -22,-14 c-2,-2 -4,-4 -8,-4 Z" 
                fill="url(#muscularBody)"
              />
            </svg>
            
            {/* وهج القاعدة */}
            <div className="absolute bottom-6 w-16 h-5 bg-red-600/50 blur-xl rounded-full" />
          </div>

          {/* الخط الأحمر المتوهج */}
          <div className="h-[5px] w-full bg-red-600 shadow-[0_0_30px_5px_rgba(220,38,38,1)]" />
          <div className="absolute top-[180px] w-full h-10 bg-red-500/20 blur-2xl" />
        </div>

        <div className="w-full h-full opacity-25 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
      </div>

      <style>{`
        @keyframes float {
          0% { background-position: 0 0; }
          100% { background-position: 500px 1000px; }
        }
        .animate-float { animation: float 100s linear infinite; }
      `}</style>
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.09] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-float" />
    </div>
  );
};
