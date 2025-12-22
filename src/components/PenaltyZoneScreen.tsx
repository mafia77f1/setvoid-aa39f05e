import { useState, useEffect } from 'react';

export const PenaltyZoneScreen = ({ endTime, onTimeComplete }: { endTime: string, onTimeComplete: () => void }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(endTime).getTime() - Date.now()) / 1000));
      setTimeRemaining(remaining);
      if (remaining <= 0) onTimeComplete();
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime, onTimeComplete]);

  const h = Math.floor(timeRemaining / 3600);
  const m = Math.floor((timeRemaining % 3600) / 60);
  const s = timeRemaining % 60;

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      
      {/* مشهد الصحراء المنبسطة */}
      <div className="absolute inset-0 z-0">
        
        {/* السماء الليلية - تدرج عميق جداً */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0500] via-black to-black z-0" />

        {/* التل الأولي المنبسط (The Flat Dune) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[30vh] z-30 shadow-[0_-20px_80px_rgba(0,0,0,0.9)]"
          style={{ 
            background: 'linear-gradient(to top, #5d3211 0%, #c27a3f 100%)',
            clipPath: 'ellipse(150% 100% at 50% 100%)' // منحنى خفيف جداً لتبدو منبسطة
          }}
        >
          {/* نسيج الرمل الناعم */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]" />
          
          {/* وهج خفيف على حافة التل */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ffd4a3]/20 to-transparent" />
        </div>

        {/* أفق الصحراء المفتوح (تدرج لوني يعطي إيحاء بالمدى البعيد) */}
        <div className="absolute bottom-[30vh] left-0 w-full h-[10vh] bg-gradient-to-t from-black to-transparent opacity-50 z-10" />

        {/* تأثير غبار خفيف جداً في الأفق */}
        <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-sand-float" />
      </div>

      {/* العداد المصغر في الأعلى */}
      <div className="relative z-50 flex flex-col items-center pt-12 w-full">
        <div className="bg-black/60 backdrop-blur-md border border-[#c27a3f]/20 px-8 py-3 rounded-sm shadow-2xl">
          <div className="text-[#c27a3f] font-black tracking-[0.6em] text-[8px] uppercase mb-1 text-center font-mono opacity-80">DESERT ZONE</div>
          <div className="text-4xl font-mono font-bold text-white tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sand-float {
          from { background-position: 0 0; }
          to { background-position: 1000px 500px; }
        }
        .animate-sand-float { animation: sand-float 200s linear infinite; }
      `}</style>

    </div>
  );
};
