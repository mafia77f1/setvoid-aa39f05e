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
      
      {/* الجزء العلوي */}
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

      {/* الجزء السفلي والخط الأحمر مع المجسم */}
      <div className="relative h-[40vh] w-full bg-black flex flex-col items-center">
        
        {/* الخط الأحمر والمجسم */}
        <div className="absolute top-[30%] left-0 right-0 z-50 flex justify-center items-center">
          {/* الخط الأيسر */}
          <div className="h-[4px] flex-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,1)]" />
          
          {/* المجسم (The Object) */}
          <div className="relative mx-0 flex items-center justify-center group">
             {/* وهج خلف المجسم */}
             <div className="absolute w-24 h-24 bg-red-600/30 blur-2xl rounded-full animate-pulse" />
             
             {/* شكل سداسي (Hexagon) */}
             <div className="w-16 h-16 bg-black border-2 border-red-600 rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.8)] overflow-hidden">
                <div className="rotate-[-45deg] flex flex-col items-center">
                   <div className="w-6 h-[2px] bg-red-600 mb-1"></div>
                   <div className="w-4 h-4 border-2 border-red-600 rounded-full animate-spin-slow"></div>
                   <div className="w-6 h-[2px] bg-red-600 mt-1"></div>
                </div>
             </div>
          </div>

          {/* الخط الأيمن */}
          <div className="h-[4px] flex-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,1)]" />
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
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 100s linear infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
      
    </div>
  );
};
