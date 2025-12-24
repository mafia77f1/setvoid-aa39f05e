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
          
          {/* مجسم جسم الإنسان الطبيعي (Anatomical Human Silhouette) */}
          <div className="relative mb-[-1px] flex flex-col items-center scale-110">
            
            {/* الرأس (بيضاوي طبيعي) */}
            <div className="w-[18px] h-[22px] bg-white rounded-[50%_50%_45%_45%] shadow-[0_0_10px_rgba(255,255,255,0.5)] z-30" />
            
            {/* الرقبة */}
            <div className="w-[6px] h-[4px] bg-white/90 mt-[-2px] z-20" />

            {/* الجذع (الصدر والخصر) */}
            <div className="relative w-14 flex flex-col items-center">
                {/* الأكتاف العريضة الانسيابية */}
                <div className="absolute top-0 w-12 h-5 bg-white rounded-[50%_50%_20%_20%] z-10" />
                
                {/* الذراع اليسرى (متصلة وبنسب طبيعية) */}
                <div className="absolute left-[-1px] top-1 w-3 h-[45px] bg-gradient-to-b from-white via-white/70 to-red-600/30 rounded-full -rotate-[8deg] origin-top" />
                
                {/* القفص الصدري يضيق عند الخصر */}
                <div className="w-[26px] h-[38px] bg-gradient-to-b from-white via-white/80 to-red-600/50 rounded-[20%_20%_40%_40%] z-10" />
                
                {/* الذراع اليمنى (متصلة وبنسب طبيعية) */}
                <div className="absolute right-[-1px] top-1 w-3 h-[45px] bg-gradient-to-b from-white via-white/70 to-red-600/30 rounded-full rotate-[8deg] origin-top" />
            </div>

            {/* الحوض والأرجل البشرية */}
            <div className="flex justify-center gap-[4px] mt-[-4px]">
                {/* الرجل اليسرى (فخذ، ركبة، ساق) */}
                <div className="w-[9px] h-[55px] flex flex-col items-center">
                  <div className="w-full h-[28px] bg-gradient-to-b from-red-600/50 to-red-600 rounded-[40%_40%_20%_20%]" /> {/* فخذ */}
                  <div className="w-[7px] h-[27px] bg-red-600 rounded-b-full shadow-[0_4px_8px_rgba(220,38,38,0.4)]" /> {/* ساق */}
                </div>
                
                {/* الرجل اليمنى (فخذ، ركبة، ساق) */}
                <div className="w-[9px] h-[55px] flex flex-col items-center">
                  <div className="w-full h-[28px] bg-gradient-to-b from-red-600/50 to-red-600 rounded-[40%_40%_20%_20%]" /> {/* فخذ */}
                  <div className="w-[7px] h-[27px] bg-red-600 rounded-b-full shadow-[0_4px_8px_rgba(220,38,38,0.4)]" /> {/* ساق */}
                </div>
            </div>

            {/* وهج تحت الأرجل */}
            <div className="absolute -bottom-2 w-16 h-4 bg-red-600/40 blur-lg rounded-full" />
          </div>

          {/* الخط الأحمر */}
          <div className="h-[4px] w-full bg-red-600 shadow-[0_0_25px_3px_rgba(220,38,38,1),0_0_50px_15px_rgba(220,38,38,0.5)]" />
          <div className="absolute top-[120px] w-full h-8 bg-red-500/20 blur-xl" />
        </div>

        {/* تفاصيل الأرضية */}
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
