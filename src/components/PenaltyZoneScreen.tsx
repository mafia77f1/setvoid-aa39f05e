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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans" style={{ perspective: '1200px' }}>
      
      {/* 1. السماء (شريط صغير جداً في الأعلى) */}
      <div className={`absolute top-0 left-0 w-full h-[20vh] transition-colors duration-[3000ms] ${
        isDay ? 'bg-gradient-to-b from-[#003366] to-[#4facfe]' : 'bg-black'
      }`} />

      {/* 2. الصحراء الكبرى (3D وواسعة جداً) */}
      <div 
        className="absolute bottom-[-10%] left-[-100%] w-[300%] h-[90vh] origin-top"
        style={{ 
          transform: 'rotateX(75deg)',
          background: 'linear-gradient(to bottom, #4a2c0f 0%, #bc6c25 30%, #d4a373 100%)',
        }}
      >
        {/* نسيج الرمل المتحرك للأمام باتجاهك */}
        <div 
          className="absolute inset-0 opacity-50 animate-ground-flow"
          style={{ 
            backgroundImage: `url('https://www.transparenttextures.com/patterns/sandpaper.png')`,
            backgroundSize: '200px 200px'
          }}
        />
        
        {/* خطوط منظور لتعميق المساحة */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_49%,rgba(0,0,0,0.1)_50%,transparent_51%)] bg-[length:10%_100%]" />
      </div>

      {/* 3. الشخصية (ظهر الشخصية وهو ينظر للصحراء) */}
      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center scale-110">
        {/* ظل الشخصية على الرمل */}
        <div className="w-20 h-4 bg-black/40 blur-lg rounded-full mb-[-15px]" />
        
        {/* الشخصية (بشكل غامض وسينمائي) */}
        <svg width="100" height="180" viewBox="0 0 100 200" className="animate-character-bob">
          {/* الرأس والرقبة */}
          <circle cx="50" cy="35" r="14" fill="#000" />
          {/* الجسم العريض (الرداء) */}
          <path d="M20 60 Q50 40 80 60 L90 180 L10 180 Z" fill="#111" />
          {/* تفاصيل الرداء */}
          <path d="M50 60 L50 180" stroke="#222" strokeWidth="2" />
        </svg>
      </div>

      {/* 4. العداد التقني (فوق الشخصية) */}
      <div className="relative z-50 flex flex-col items-center pt-10 w-full">
        <div className="bg-black/80 backdrop-blur-xl border-x-2 border-red-600 px-8 py-2">
          <div className="text-[7px] text-red-500 font-black tracking-[0.5em] uppercase text-center">System: Penalty Mode</div>
          <div className="text-4xl font-mono font-bold text-white tracking-widest">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* 5. عاصفة وغبار POV */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-20">
        <div className="absolute inset-0 animate-sand-drift bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      <style>{`
        @keyframes ground-flow {
          from { background-position: 0 0; }
          to { background-position: 0 1200px; }
        }
        @keyframes character-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes sand-drift {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }
        .animate-ground-flow { animation: ground-flow 10s linear infinite; }
        .animate-character-bob { animation: character-bob 0.8s ease-in-out infinite; }
        .animate-sand-drift { animation: sand-drift 20s linear infinite; }
      `}</style>

    </div>
  );
};
