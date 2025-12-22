import { useState, useEffect } from 'react';

export const DesertPenaltyQuest = ({ endTime, onTimeComplete }: { endTime: string, onTimeComplete: () => void }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

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
    <div className="fixed inset-0 z-[100] bg-[#1a0f00] overflow-hidden font-sans" style={{ perspective: '1000px' }}>
      
      {/* 1. السماء (شريط علوي صغير وداكن) */}
      <div className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-black via-[#001d3d] to-[#bc6c25] z-0" />

      {/* 2. مجسم الصحراء 3D (Blender-like Mesh) */}
      <div className="absolute inset-0 z-10 flex justify-center">
        <div 
          className="absolute bottom-[-20%] w-[400%] h-[120vh] origin-top"
          style={{ 
            transform: 'rotateX(80deg)',
            background: `
              radial-gradient(circle at 50% 0%, transparent 20%, rgba(0,0,0,0.4) 100%),
              repeating-linear-gradient(0deg, #bc6c25 0px, #bc6c25 2px, transparent 3px, transparent 100px),
              #d4a373
            `,
          }}
        >
          {/* نسيج الرمل المتحرك (حركة للأمام) */}
          <div 
            className="absolute inset-0 opacity-40 animate-ground-advance"
            style={{ 
              backgroundImage: `url('https://www.transparenttextures.com/patterns/sandpaper.png')`,
              backgroundSize: '250px 250px'
            }}
          />
          
          {/* تموجات الكثبان (Dunes) */}
          <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_50%_-20%,transparent_0,transparent_50px,rgba(0,0,0,0.1)_100px)] opacity-50" />
        </div>
      </div>

      {/* 3. الشخصية (منظور الشخص الثالث - تنظر للأمام) */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
        {/* ظل ناعم تحت الشخصية */}
        <div className="w-24 h-6 bg-black/60 blur-xl rounded-full mb-[-20px] scale-x-150" />
        
        {/* الشخصية (بسيطة، هيبة، تنظر للصحراء) */}
        <div className="animate-character-move">
          <svg width="120" height="220" viewBox="0 0 100 200">
            {/* الرأس */}
            <circle cx="50" cy="30" r="12" fill="#000" />
            {/* الأكتاف العريضة والرداء */}
            <path d="M15 50 Q50 35 85 50 L95 190 L5 190 Z" fill="#0f0f0f" />
            {/* تفاصيل الظل على الظهر */}
            <path d="M40 50 L35 190 M60 50 L65 190" stroke="#1a1a1a" strokeWidth="3" opacity="0.5" />
          </svg>
        </div>

        {/* لافتة النظام (نظام سولو ليفلينج) */}
        <div className="mt-2 bg-red-600/10 border border-red-600/50 px-4 py-1 backdrop-blur-sm">
           <span className="text-[10px] text-red-500 font-black tracking-widest uppercase">Penalty: Exhaustion</span>
        </div>
      </div>

      {/* 4. العداد (UI) */}
      <div className="relative z-50 flex flex-col items-center pt-12">
        <div className="bg-black/90 border-t-2 border-red-600 px-12 py-4 shadow-[0_0_60px_rgba(0,0,0,1)]">
          <div className="text-5xl font-mono font-black text-white tracking-[0.2em]">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* 5. ضباب وعاصفة رملية خفيفة */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="absolute inset-0 opacity-10 animate-sand-storm bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      <style>{`
        @keyframes ground-advance {
          from { background-position: 0 0; }
          to { background-position: 0 1500px; }
        }
        @keyframes character-move {
          0%, 100% { transform: translateY(0) scaleX(1); }
          50% { transform: translateY(-10px) scaleX(1.02); }
        }
        @keyframes sand-storm {
          from { background-position: 0 0; }
          to { background-position: 1000px 500px; }
        }
        .animate-ground-advance { animation: ground-advance 12s linear infinite; }
        .animate-character-move { animation: character-move 0.7s ease-in-out infinite; }
        .animate-sand-storm { animation: sand-storm 15s linear infinite; }
      `}</style>

    </div>
  );
};
