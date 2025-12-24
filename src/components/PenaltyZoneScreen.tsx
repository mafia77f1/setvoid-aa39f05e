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

      {/* الجزء السفلي - الخط والشخصية البشرية */}
      <div className="relative h-[40vh] w-full bg-black flex flex-col items-center">
        
        <div className="absolute top-[30%] left-0 right-0 z-50 flex flex-col items-center">
          
          {/* مجسم بشري انسيابي (Humanoid Silhouette) */}
          <div className="relative mb-[-2px] flex flex-col items-center group animate-pulse-slow">
            
            {/* الرأس والرقبة */}
            <div className="w-4 h-5 bg-white rounded-[45%] mb-[-2px] z-20 shadow-[0_0_10px_white]" />
            <div className="w-2 h-2 bg-white/80 mx-auto" /> 
            
            {/* الجذع (الأكتاف، الصدر، الخصر) */}
            <div className="relative w-12 flex justify-center">
                {/* الأكتاف العريضة */}
                <div className="absolute top-0 w-11 h-4 bg-gradient-to-r from-white/20 via-white to-white/20 rounded-full blur-[0.5px]" />
                
                {/* الذراع اليسرى المتصلة */}
                <div className="absolute left-[-2px] top-[2px] w-[5px] h-11 bg-gradient-to-b from-white to-red-600/40 rounded-full -rotate-[12deg] origin-top shadow-sm" />
                
                {/* القفص الصدري والبطن */}
                <div className="w-8 h-12 bg-gradient-to-b from-white via-white/80 to-red-600/60 rounded-t-[30%] rounded-b-[60%] z-10" />
                
                {/* الذراع اليمنى المتصلة */}
                <div className="absolute right-[-2px] top-[2px] w-[5px] h-11 bg-gradient-to-b from-white to-red-600/40 rounded-full rotate-[12deg] origin-top shadow-sm" />
            </div>

            {/* الحوض والأرجل البشرية */}
            <div className="relative flex justify-center gap-[6px] mt-[-6px]">
                {/* الفخذ والساق اليسرى */}
                <div className="w-[6px] h-14 flex flex-col">
                  <div className="h-7 bg-gradient-to-b from-red-600/60 to-red-600 rounded-t-full" /> {/* فخذ */}
                  <div className="h-7 bg-red-600 rounded-b-full mt-[-2px]" /> {/* ساق */}
                </div>
                
                {/* الفخذ والساق اليمنى */}
                <div className="w-[6px] h-14 flex flex-col">
                  <div className="h-7 bg-gradient-to-b from-red-600/60 to-red-600 rounded-t-full" /> {/* فخذ */}
                  <div className="h-7 bg-red-600 rounded-b-full mt-[-2px]" /> {/* ساق */}
                </div>
            </div>

            {/* الارتكاز والوهج */}
            <div className="absolute -bottom-3 w-16 h-6 bg-red-600/30 blur-xl rounded-full" />
          </div>

          {/* الخط الأحمر */}
          <div className="h-[4px] w-full bg-red-600 shadow-[0_0_25px_3px_rgba(220,38,38,1),0_0_50px_15px_rgba(220,38,38,0.5)]" />
          <div className="absolute top-[105px] w-full h-8 bg-red-500/20 blur-xl" />
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
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(0.98); }
        }
        .animate-float { animation: float 100s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      `}</style>
      
    </div>
  );
};
