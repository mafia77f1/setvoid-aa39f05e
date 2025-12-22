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
      
      {/* 1. السماء والأفق */}
      <div className={`absolute inset-0 z-0 transition-colors duration-[3000ms] ${
        isDay ? 'bg-gradient-to-b from-[#1e3a8a] via-[#3b82f6] to-[#f59e0b]' : 'bg-gradient-to-b from-black via-[#1a0f00] to-[#451a03]'
      }`} />

      {/* 2. الأرضية الـ 3D الواسعة */}
      <div className="absolute inset-0 z-10" style={{ perspective: '800px', perspectiveOrigin: '50% 40%' }}>
        <div 
          className="absolute bottom-[-20%] left-[-50%] w-[200%] h-[100vh] origin-top animate-sand-scroll"
          style={{ 
            transform: 'rotateX(70deg)',
            background: 'repeating-linear-gradient(0deg, #bc6c25 0px, #bc6c25 100px, #a15a1d 101px, #a15a1d 200px)',
            backgroundImage: `url('https://www.transparenttextures.com/patterns/sandpaper.png')`,
            backgroundColor: '#bc6c25'
          }}
        >
          {/* تموجات الرمل الـ 3D */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.2)_0%,transparent_50%,rgba(0,0,0,0.2)_100%)]" />
        </div>
      </div>

      {/* 3. شخصية اللاعب (منظور ثالث) */}
      <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        {/* تأثير الظل تحت الشخصية */}
        <div className="w-16 h-4 bg-black/40 blur-md rounded-full mb-[-10px]" />
        
        {/* جسم الشخصية (بسيط وسينمائي) */}
        <svg width="80" height="160" viewBox="0 0 100 200" className="animate-character-walk">
          {/* الرأس */}
          <circle cx="50" cy="30" r="15" fill="#111" />
          {/* الجسم / الرداء */}
          <path d="M30 50 L70 50 L80 150 L20 150 Z" fill="#222" />
          {/* اليدين */}
          <line x1="30" y1="60" x2="15" y2="100" stroke="#111" strokeWidth="8" strokeLinecap="round" />
          <line x1="70" y1="60" x2="85" y2="100" stroke="#111" strokeWidth="8" strokeLinecap="round" />
        </svg>

        {/* مؤشر الحالة فوق الرأس (نظام سولو ليفلينج) */}
        <div className="absolute -top-10 whitespace-nowrap bg-black/50 px-2 py-0.5 border border-red-500/50">
          <span className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">Player: Struggling</span>
        </div>
      </div>

      {/* 4. العداد العلوي (واجهة النظام) */}
      <div className="relative z-50 flex flex-col items-center pt-8 w-full">
        <div className="bg-black/80 backdrop-blur-xl border-b-2 border-red-600 px-10 py-4 shadow-2xl">
          <div className="text-[8px] text-red-500 font-black tracking-[0.5em] uppercase mb-1 text-center">Penalty Timer</div>
          <div className="text-5xl font-mono font-black text-white tracking-widest tabular-nums">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* 5. عاصفة رملية وتأثير الضباب */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="absolute inset-0 opacity-30 animate-dust-move bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/20" />
      </div>

      <style>{`
        @keyframes sand-scroll {
          from { background-position: 0 0; }
          to { background-position: 0 1000px; }
        }
        @keyframes character-walk {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
        }
        @keyframes dust-move {
          from { background-position: 0 0; }
          to { background-position: 500px 1000px; }
        }
        .animate-sand-scroll { animation: sand-scroll 8s linear infinite; }
        .animate-character-walk { animation: character-walk 0.6s ease-in-out infinite; }
        .animate-dust-move { animation: dust-move 20s linear infinite; }
      `}</style>

    </div>
  );
};
