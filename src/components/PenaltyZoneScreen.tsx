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
      
      {/* 1. مشهد الصحراء الكامل (بدون الخط السفلي) */}
      <div className="absolute inset-0 z-0">
        
        {/* السماء الليلية العميقة */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f00] via-black to-black" />

        {/* التلال البعيدة جداً (أفق الصحراء) */}
        <div 
          className="absolute bottom-[40%] left-0 w-full h-[30%] bg-[#2b1700] opacity-50 z-10"
          style={{ clipPath: 'polygon(0 80%, 20% 60%, 40% 85%, 60% 50%, 80% 90%, 100% 70%, 100% 100%, 0 100%)' }}
        />

        {/* التلال المتوسطة (تعطي عمق المسافة) */}
        <div 
          className="absolute bottom-[20%] left-[-10%] w-[120%] h-[40%] bg-[#5d3211] z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]"
          style={{ clipPath: 'ellipse(70% 50% at 50% 100%)' }}
        />

        {/* التل الأمامي المنخفض (الذي تقف عليه حالياً في أسفل الشاشة) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-[#8b4513] to-[#c27a3f] z-30 shadow-[0_-10px_60px_rgba(0,0,0,0.8)]"
          style={{ clipPath: 'ellipse(100% 100% at 50% 100%)' }}
        >
          {/* نسيج الرمل وتفاصيل الضوء على التل القريب */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]" />
        </div>

        {/* تأثير الغبار والرياح الزاحفة بين التلال */}
        <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-sand-drift" />
      </div>

      {/* 2. العداد المصغر (يبقى ثابتاً في الأعلى) */}
      <div className="relative z-50 flex flex-col items-center pt-10 w-full">
        <div className="bg-black/70 backdrop-blur-xl border border-[#c27a3f]/30 px-6 py-2 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="text-[#c27a3f] font-black tracking-[0.5em] text-[8px] uppercase mb-1 text-center font-mono">DESERT SURVIVAL</div>
          <div className="text-4xl font-mono font-bold text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sand-drift {
          from { background-position: 0 0; }
          to { background-position: 1500px 500px; }
        }
        .animate-sand-drift { 
          animation: sand-drift 120s linear infinite; 
        }
      `}</style>

    </div>
  );
};
