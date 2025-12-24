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

      {/* الجزء السفلي - شخصية ذات حواف حادة ومسطحة */}
      <div className="relative h-[40vh] w-full bg-black flex flex-col items-center">
        
        <div className="absolute top-[10%] left-0 right-0 z-50 flex flex-col items-center">
          
          {/* مجسم حاد الزوايا (Sharp Polygon Body) */}
          <div className="relative mb-[-20px] w-48 h-72 flex justify-center items-end scale-90">
            <svg 
              viewBox="0 0 100 200" 
              className="w-full h-full drop-shadow-[0_0_25px_rgba(255,0,0,0.8)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="sharpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#ffffff" />
                  <stop offset="80%" stopColor="#ff0000" />
                  <stop offset="100%" stopColor="#220000" />
                </linearGradient>
              </defs>

              {/* الرسم: أكتاف مسطحة عريضة، رقبة حادة، خصر رياضي ضيق، وأطراف مستقيمة */}
              <path 
                d="
                /* الرأس المسطح الحاد */
                M44,15 L56,15 L58,28 L42,28 Z 
                
                /* الرقبة الواضحة */
                M47,28 L53,28 L53,35 L47,35 Z 
                
                /* الجسم العلوي: أكتاف مسطحة وعريضة جداً */
                M15,35 L85,35 L82,45 L70,60 L50,65 L30,60 L18,45 Z
                
                /* الذراع اليسرى الحادة */
                M15,35 L10,65 L14,70 L20,45 Z
                
                /* الذراع اليمنى الحادة */
                M85,35 L90,65 L86,70 L80,45 Z
                
                /* الجذع والخصر النحيف V-SHAPE */
                M30,60 L50,65 L70,60 L65,100 L35,100 Z
                
                /* الرجل اليسرى */
                M35,100 L42,100 L38,180 L30,180 Z
                
                /* الرجل اليمنى */
                M58,100 L65,100 L70,180 L62,180 Z
                " 
                fill="url(#sharpGradient)"
                stroke="#ff0000"
                strokeWidth="1"
                strokeLinejoin="miter"
              />
            </svg>
            
            {/* انعكاس الضوء تحت الشخصية */}
            <div className="absolute bottom-4 w-28 h-8 bg-red-600/50 blur-3xl rounded-full" />
          </div>

          {/* الخط الأحمر القوي */}
          <div className="h-[5px] w-full bg-red-600 shadow-[0_0_40px_12px_rgba(220,38,38,1)]" />
        </div>

        <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
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
