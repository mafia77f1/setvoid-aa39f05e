import { useState, useEffect } from 'react';

export const PenaltyZoneScreen = ({ endTime, onTimeComplete }: { endTime: string, onTimeComplete: () => void }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    // تحديد ما إذا كان الوقت الآن نهاراً أم ليلاً (بين 6 صباحاً و 6 مساءً)
    const hour = new Date().getHours();
    setIsDay(hour >= 6 && hour < 18);

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(endTime).getTime() - Date.now()) / 1000));
      setTimeRemaining(remaining);
      if (remaining <= 0 && onTimeComplete) onTimeComplete();
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime, onTimeComplete]);

  const h = Math.floor(timeRemaining / 3600);
  const m = Math.floor((timeRemaining % 3600) / 60);
  const s = timeRemaining % 60;

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      
      {/* 1. بيئة الصحراء (بدون خط فاصل) */}
      <div className="absolute inset-0 z-0">
        
        {/* السماء: تتغير بناءً على الوقت (أزرق للنهار / أسود لليل) */}
        <div className={`absolute inset-0 transition-colors duration-[2000ms] ${
          isDay 
          ? 'bg-gradient-to-b from-[#0077be] via-[#add8e6] to-[#bc6c25]' 
          : 'bg-gradient-to-b from-[#000000] via-[#1a0f00] to-[#bc6c25]'
        }`} />

        {/* الأرضية: رمال منبسطة ممتدة للأفق (تمت إزالة الخط الفاصل) */}
        <div className="absolute bottom-0 left-0 w-full h-[60vh] z-10">
          {/* لون الرمل مع تدرج ناعم يختفي في السماء */}
          <div className="absolute inset-0 bg-[#bc6c25] opacity-90 shadow-[inset_0_50px_100px_rgba(0,0,0,0.3)]" />
          
          {/* نسيج الرمل */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]" />
        </div>

        {/* تأثير الرياح والغبار (شفاف وخفيف) */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-10">
          <div className="absolute inset-0 animate-sand-fast bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
      </div>

      {/* 2. العداد المصغر الأنيق في الأعلى */}
      <div className="relative z-50 flex flex-col items-center pt-10 w-full">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-2 rounded-sm shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className={`w-1 h-1 rounded-full animate-pulse ${isDay ? 'bg-blue-400' : 'bg-red-600'}`} />
            <div className="text-white/70 font-black tracking-[0.3em] text-[7px] uppercase font-mono">
              {isDay ? 'Day Mission' : 'Night Penalty'}
            </div>
          </div>
          
          <div className="text-3xl font-mono font-bold text-white tracking-widest">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sand-fast {
          from { background-position: 0 0; }
          to { background-position: 1000px 500px; }
        }
        .animate-sand-fast { animation: sand-fast 20s linear infinite; }
      `}</style>
    </div>
  );
};
