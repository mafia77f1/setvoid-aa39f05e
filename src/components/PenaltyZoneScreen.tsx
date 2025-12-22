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
      
      {/* 1. السماء والأفق البعيد */}
      <div className={`absolute top-0 left-0 w-full h-[45vh] transition-colors duration-[3000ms] ${
        isDay ? 'bg-gradient-to-b from-[#003366] to-[#4facfe]' : 'bg-gradient-to-b from-black via-[#050505] to-[#1a0f00]'
      }`}>
        {/* تأثير السراب والضباب عند الأفق */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#8b4513] via-transparent to-transparent opacity-60 mix-blend-screen animate-pulse" />
      </div>

      {/* 2. الأرضية الـ 3D الجبارة (POV) */}
      <div 
        className="absolute bottom-[-20%] left-[-50%] w-[200%] h-[100vh] origin-top"
        style={{ 
          transform: 'rotateX(72deg)',
          background: 'radial-gradient(circle at 50% 0%, #bc6c25 0%, #8b4513 50%, #4a2c0f 100%)',
        }}
      >
        {/* نسيج الرمل المتحرك بقوة */}
        <div 
          className="absolute inset-0 opacity-40 animate-ground-flow"
          style={{ 
            backgroundImage: `url('https://www.transparenttextures.com/patterns/sandpaper.png')`,
            backgroundSize: '150px 150px'
          }}
        />

        {/* ظلال التموجات الرملية (Dunes Shadows) */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: 'repeating-radial-gradient(circle at 50% -100%, transparent 0, transparent 100px, rgba(0,0,0,0.5) 150px)',
            backgroundSize: '100% 200%'
          }}
        />

        {/* إضاءة مركزية تحت قدمك */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
      </div>

      {/* 3. تأثيرات الجو (عاصفة رملية حقيقية) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {/* غبار سريع */}
        <div className="absolute inset-0 opacity-30 animate-sand-storm-fast bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        {/* غبار بطيء وعميق */}
        <div className="absolute inset-0 opacity-10 animate-sand-storm-slow bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] scale-150" />
        
        {/* تعتيم الأطراف (Vignette) لتركيز النظر للأفق */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* 4. العداد التقني (Solo Leveling System UI) */}
      <div className="relative z-50 flex flex-col items-center pt-14 w-full">
        <div className="group relative">
          <div className="bg-black/60 backdrop-blur-xl border-t border-white/10 px-10 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-center gap-3 mb-1">
               <div className="h-[1px] w-6 bg-red-600 animate-pulse" />
               <span className="text-white/40 font-black tracking-[0.5em] text-[8px] uppercase font-mono">Penalty Quest Time</span>
               <div className="h-[1px] w-6 bg-red-600 animate-pulse" />
            </div>
            <div className="text-5xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
            </div>
          </div>
          {/* ديكورات الزوايا */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-600" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-600" />
        </div>
      </div>

      <style>{`
        @keyframes ground-flow {
          from { background-position: 0 0; }
          to { background-position: 0 1000px; }
        }
        @keyframes sand-storm-fast {
          0% { transform: translate(-5%, -5%) scale(1); opacity: 0.1; }
          50% { transform: translate(5%, 5%) scale(1.1); opacity: 0.3; }
          100% { transform: translate(-5%, -5%) scale(1); opacity: 0.1; }
        }
        @keyframes sand-storm-slow {
          from { background-position: 0 0; }
          to { background-position: 2000px 1000px; }
        }
        .animate-ground-flow { animation: ground-flow 10s linear infinite; }
        .animate-sand-storm-fast { animation: sand-storm-fast 5s ease-in-out infinite; }
        .animate-sand-storm-slow { animation: sand-storm-slow 60s linear infinite; }
      `}</style>

    </div>
  );
};
