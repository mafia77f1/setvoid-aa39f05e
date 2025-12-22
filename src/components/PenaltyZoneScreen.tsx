import { useState, useEffect } from 'react';

export const PenaltyZoneScreen = ({ endTime, onTimeComplete }: { endTime: string, onTimeComplete: () => void }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isDay, setIsDay] = useState(false);

  useEffect(() => {
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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans" style={{ perspective: '1000px' }}>
      
      {/* 1. السماء (بعيدة جداً وصغيرة) */}
      <div className={`absolute top-0 left-0 w-full h-[25vh] transition-colors duration-[3000ms] z-0 ${
        isDay 
        ? 'bg-gradient-to-b from-[#004466] to-[#87ceeb]' 
        : 'bg-gradient-to-b from-[#000000] to-[#1a0f00]'
      }`} />

      {/* 2. الأرضية الـ 3D (كأنك واقف عليها) */}
      <div 
        className="absolute bottom-0 left-[-50%] w-[200%] h-[80vh] z-10"
        style={{ 
          background: 'linear-gradient(to bottom, #8b4513 0%, #bc6c25 100%)',
          transform: 'rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      >
        {/* نسيج الرمل مكرر ليعطي إيحاء بالمسافة */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay animate-ground-move"
          style={{ 
            backgroundImage: "url('https://www.transparenttextures.com/patterns/sandpaper.png')",
            backgroundSize: '100px 100px'
          }} 
        />
        
        {/* خطوط منظور خفيفة لتعزيز الـ 3D */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_99px,rgba(0,0,0,0.05)_100px)]" />
      </div>

      {/* 3. تأثير تلاشي الأفق (لدمج الأرض بالسماء بشكل طبيعي) */}
      <div className="absolute top-[20vh] left-0 w-full h-[15vh] bg-gradient-to-b from-[#1a0f00] via-[#8b4513]/50 to-transparent z-20 pointer-events-none" />

      {/* 4. غبار رملي يتطاير باتجاهك (يعزز الـ POV) */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-20">
        <div className="absolute inset-0 animate-sand-storm bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      {/* 5. العداد المصغر الأنيق (System UI) */}
      <div className="relative z-50 flex flex-col items-center pt-10 w-full">
        <div className="bg-black/60 backdrop-blur-xl border border-white/5 px-8 py-3 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
            <span className="text-white/60 font-black tracking-[0.5em] text-[8px] uppercase font-mono">
              Penalty Zone Active
            </span>
          </div>
          <div className="text-4xl font-mono font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ground-move {
          from { background-position: 0 0; }
          to { background-position: 0 1000px; }
        }
        @keyframes sand-storm {
          0% { transform: scale(1) translate(0, 0); opacity: 0.1; }
          50% { transform: scale(1.1) translate(10px, 10px); opacity: 0.3; }
          100% { transform: scale(1.2) translate(0, 0); opacity: 0.1; }
        }
        .animate-sand-storm { 
          animation: sand-storm 8s ease-in-out infinite; 
        }
        .animate-ground-move {
          animation: ground-move 60s linear infinite;
        }
      `}</style>

    </div>
  );
};
