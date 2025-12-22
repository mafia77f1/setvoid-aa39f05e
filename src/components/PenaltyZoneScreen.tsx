import { useState, useEffect } from 'react';

export const PenaltyZoneScreen = ({ endTime, onTimeComplete }: { endTime: string, onTimeComplete: () => void }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 18;

  useEffect(() => {
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
      
      {/* 1. السماء (الخلفية البعيدة) */}
      <div className={`absolute inset-0 z-0 transition-colors duration-[3000ms] ${
        isDay 
        ? 'bg-gradient-to-b from-[#004a7c] via-[#00a8cc] to-[#bc6c25]' 
        : 'bg-gradient-to-b from-black via-[#0f0a05] to-[#4d2600]'
      }`} />

      {/* 2. الأرض الواسعة جداً (Infinite 3D Floor) */}
      <div 
        className="absolute bottom-[-100px] left-[-100%] w-[300%] h-[75vh] z-10"
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          className="absolute inset-0 origin-top"
          style={{ 
            transform: 'rotateX(75deg)',
            background: 'linear-gradient(to bottom, #4d2600 0%, #bc6c25 30%, #d4a373 100%)',
            boxShadow: 'inset 0 100px 100px rgba(0,0,0,0.8)' // تظليل للأفق
          }}
        >
          {/* نسيج الرمل المتحرك */}
          <div 
            className="absolute inset-0 opacity-40 animate-ground-move"
            style={{ 
              backgroundImage: `url('https://www.transparenttextures.com/patterns/sandpaper.png')`,
              backgroundSize: '200px 200px'
            }}
          />
          
          {/* خطوط المنظور لزيادة إحساس المساحة */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_49%,rgba(0,0,0,0.05)_50%,transparent_51%)] bg-[length:5%_100%]" />
        </div>
      </div>

      {/* 3. ضباب الأفق (لإخفاء حافة الأرض) */}
      <div className="absolute top-[25vh] left-0 w-full h-[15vh] bg-gradient-to-b from-transparent via-[#4d2600]/80 to-transparent z-20 pointer-events-none" />

      {/* 4. تأثيرات العاصفة والغبار القوي */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-20">
        <div className="absolute inset-0 animate-dust-storm bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* 5. العداد العلوي (System UI) */}
      <div className="relative z-50 flex flex-col items-center pt-10 w-full">
        <div className="bg-black/80 backdrop-blur-md border border-red-600/30 px-6 py-2 shadow-[0_0_30px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 bg-red-600 animate-ping rounded-full" />
             <span className="text-white/40 font-bold tracking-[0.4em] text-[8px] uppercase font-mono">Penalty Quest Time</span>
          </div>
          <div className="text-4xl font-mono font-black text-white tracking-widest tabular-nums">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ground-move {
          from { background-position: 0 0; }
          to { background-position: 0 1000px; }
        }
        @keyframes dust-storm {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-30px, 15px); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-ground-move { animation: ground-move 10s linear infinite; }
        .animate-dust-storm { animation: dust-storm 8s ease-in-out infinite; }
      `}</style>

    </div>
  );
};
