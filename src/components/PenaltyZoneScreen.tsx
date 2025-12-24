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

      {/* الجزء السفلي - الشخصية الرياضية الحادة */}
      <div className="relative h-[40vh] w-full bg-black flex flex-col items-center">
        
        <div className="absolute top-[20%] left-0 right-0 z-50 flex flex-col items-center">
          
          {/* مجسم بشري "ناشف" وحاد (Aesthetic Shredded Physique) */}
          <div className="relative mb-[-12px] w-32 h-56 flex justify-center items-end scale-125">
            <svg 
              viewBox="0 0 100 200" 
              className="w-full h-full drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="shreddedBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="70%" stopColor="#ff0000" />
                  <stop offset="100%" stopColor="#450a0a" />
                </linearGradient>
              </defs>

              {/* الرسم: رأس حاد، رقبة قوية، أكتاف عريضة جداً، خصر منحوت، وأرجل قوية */}
              <path 
                d="M50,5 c3,0 5.5,3 5.5,7 c0,4 -2.5,7 -5.5,7 c-3,0 -5.5,-3 -5.5,-7 c0,-4 2.5,-7 5.5,-7 Z 
                   M48,19 h4 v5 h-4 Z 
                   M50,24 c-5,0 -12,2 -16,6 c-8,2 -16,6 -18,12 c-2,8 0,35 0,38 c0,3 2,4 4,4 s4,-1 4,-4 v-28 c3,-2 6,0 6,2 v42 l-4,60 c0,4 3,6 5,6 s5,-2 5,-6 l4,-45 h2 l4,45 c0,4 3,6 5,6 s5,-2 5,-6 l-4,-60 v-42 c0,-2 3,-4 6,-2 v28 c0,3 2,4 4,4 s4,-1 4,-4 c0,-3 2,-30 0,-38 c-2,-6 -10,-10 -18,-12 c-4,-4 -11,-6 -16,-6 Z" 
                fill="url(#shreddedBody)"
              />
            </svg>
            
            {/* وهج الأرضية */}
            <div className="absolute bottom-10 w-20 h-6 bg-red-600/60 blur-2xl rounded-full" />
          </div>

          {/* الخط الأحمر الرئيسي */}
          <div className="h-[4px] w-full bg-red-600 shadow-[0_0_35px_8px_rgba(220,38,38,1)]" />
          <div className="absolute top-[215px] w-full h-12 bg-red-500/30 blur-3xl" />
        </div>

        <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
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
