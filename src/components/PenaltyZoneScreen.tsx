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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans" style={{ perspective: '1000px' }}>
      
      {/* 1. السماء (في الأعلى تماماً) */}
      <div className={`absolute top-0 left-0 w-full h-[30vh] z-0 ${
        isDay ? 'bg-gradient-to-b from-[#003366] to-[#4facfe]' : 'bg-gradient-to-b from-black via-[#0a0a0a] to-[#1a0f00]'
      }`} />

      {/* 2. الأفق والأرض البعيدة (ثابتة) */}
      <div className="absolute top-[30vh] left-0 w-full h-[20vh] z-10 bg-[#8b4513]" 
           style={{ background: 'linear-gradient(to bottom, #1a0f00 0%, #8b4513 100%)' }} />

      {/* 3. الأرضية الـ 3D المتحركة (تحت رجلك) */}
      <div 
        className="absolute bottom-[-10%] left-[-50%] w-[200%] h-[65vh] z-20"
        style={{ 
          transform: 'rotateX(65deg)',
          transformOrigin: 'top center',
          background: 'linear-gradient(to bottom, #8b4513 0%, #bc6c25 100%)',
          boxShadow: '0px -50px 100px 50px rgba(0,0,0,0.9)' // ظل لدمجها مع الأفق
        }}
      >
        {/* نسيج الرمل اللي يتحرك باتجاهك */}
        <div 
          className="absolute inset-0 opacity-40 animate-ground-flow"
          style={{ 
            backgroundImage: `url('https://www.transparenttextures.com/patterns/sandpaper.png')`,
            backgroundSize: '150px 150px'
          }}
        />
        
        {/* تفاصيل رملية إضافية */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* 4. غبار وعاصفة (POV) */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-20">
        <div className="absolute inset-0 animate-dust-drift bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        {/* تعتيم جانبي */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* 5. العداد العلوي المصغر */}
      <div className="relative z-50 flex flex-col items-center pt-12 w-full">
        <div className="bg-black/70 backdrop-blur-xl border-x-2 border-red-600 px-8 py-3 shadow-2xl">
          <div className="text-white/40 font-bold tracking-[0.4em] text-[7px] uppercase mb-1 text-center font-mono">
            System Penalty Mode
          </div>
          <div className="text-4xl font-mono font-black text-white tracking-widest tabular-nums">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ground-flow {
          from { background-position: 0 0; }
          to { background-position: 0 1200px; }
        }
        @keyframes dust-drift {
          from { background-position: 0 0; }
          to { background-position: 1000px 500px; }
        }
        .animate-ground-flow { animation: ground-flow 12s linear infinite; }
        .animate-dust-drift { animation: dust-drift 40s linear infinite; }
      `}</style>

    </div>
  );
};
