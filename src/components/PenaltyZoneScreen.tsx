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
      
      {/* مشهد الصحراء اللامتناهي */}
      <div className="absolute inset-0 z-0 bg-[#050000]">
        
        {/* 1. التل البعيد جداً (The Distant Dune) */}
        <div 
          className="absolute bottom-[40%] left-[-10%] w-[120%] h-[15%] bg-[#1a0f00] z-10 opacity-60"
          style={{ clipPath: 'ellipse(60% 100% at 70% 100%)' }}
        />

        {/* 2. التل المتوسط (The Middle Dune) */}
        <div 
          className="absolute bottom-[20%] left-[-20%] w-[140%] h-[30%] bg-[#402208] z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.7)]"
          style={{ clipPath: 'ellipse(70% 100% at 30% 100%)' }}
        />

        {/* 3. التل الأولي القريب (The Foreground - مكان وقوفك) */}
        <div 
          className="absolute bottom-0 left-[-5%] w-[110%] h-[38%] z-30 shadow-[0_-15px_60px_rgba(0,0,0,0.9)]"
          style={{ 
            clipPath: 'ellipse(80% 100% at 50% 100%)',
            background: 'linear-gradient(to top, #8b4513 0%, #c27a3f 100%)'
          }}
        >
          {/* نسيج الرمل للتل القريب لزيادة الواقعية */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]" />
        </div>

        {/* تأثيرات الجو: تدرج السماء للأسود الفاحم */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent z-0 opacity-80" />
        
        {/* غبار رملي خفيف يتحرك بالخلفية */}
        <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-sand-drift" />
      </div>

      {/* العداد المصغر بالأعلى */}
      <div className="relative z-50 flex flex-col items-center pt-12 w-full">
        <div className="bg-black/80 backdrop-blur-xl border border-[#c27a3f]/40 px-8 py-3 rounded-sm shadow-2xl">
          <div className="text-[#c27a3f] font-black tracking-[0.5em] text-[9px] uppercase mb-1 text-center font-mono">DESERT PENALTY</div>
          <div className="text-4xl font-mono font-bold text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
          {/* شريط تحميل صغير جداً تحت الوقت لزيادة التفاصيل */}
          <div className="w-full h-[1px] bg-[#c27a3f]/20 mt-2 overflow-hidden">
             <div className="h-full bg-[#c27a3f] animate-pulse" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sand-drift {
          from { background-position: 0 0; }
          to { background-position: 1000px 500px; }
        }
        .animate-sand-drift { animation: sand-drift 140s linear infinite; }
      `}</style>

    </div>
  );
};
