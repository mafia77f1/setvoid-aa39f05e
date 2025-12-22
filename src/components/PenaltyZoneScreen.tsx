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
    <div className="fixed inset-0 z-[100] bg-[#000000] overflow-hidden font-sans">
      
      {/* 1. الجزء العلوي: مشهد التلال الصحراوية (3D/2D Depth) */}
      <div className="absolute inset-0 z-0 h-[70vh] bg-[#2b1700]">
        
        {/* السماء الصحراوية - تدرج من البرتقالي المحروق للسواد */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#8b4513]/40 via-black to-black z-0" />

        {/* التل البعيد (خلفية) */}
        <div 
          className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[60%] bg-[#5d3211] z-10"
          style={{ clipPath: 'ellipse(70% 50% at 50% 100%)' }}
        />

        {/* التل المتوسط (عمق) */}
        <div 
          className="absolute bottom-[-5%] left-[-20%] w-[140%] h-[45%] bg-[#8b4513] z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          style={{ clipPath: 'ellipse(60% 60% at 30% 100%)' }}
        />

        {/* التل القريب (الذي تقف عليه - POV) */}
        <div 
          className="absolute bottom-0 left-[-10%] w-[120%] h-[35%] bg-[#c27a3f] z-30 shadow-[0_-5px_30px_rgba(0,0,0,0.4)]"
          style={{ 
            clipPath: 'ellipse(80% 70% at 50% 100%)',
            backgroundImage: 'linear-gradient(to top, #bc6c25, #c27a3f)' 
          }}
        />

        {/* نسيج الرمل الموحد لكل التلال ليعطي واقعية */}
        <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay z-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]" />

        {/* تأثير الرياح/الغبار الخفيف فوق التلال */}
        <div className="absolute inset-0 opacity-[0.06] z-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-sand-move" />
      </div>

      {/* 2. العداد المصغر (يبقى في مكانه العلوي) */}
      <div className="relative z-50 flex flex-col items-center pt-8 w-full">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-2 rounded-sm shadow-2xl">
          <div className="text-[#c27a3f] font-black tracking-[0.4em] text-[7px] uppercase mb-1 text-center font-mono">DESERT QUEST</div>
          <div className="text-3xl font-mono font-bold text-white tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* 3. الأرضية السوداء والخط المشع (ثابتة تماماً كما طلبت) */}
      <div className="absolute bottom-0 left-0 right-0 z-50 h-[30vh] bg-[#000000]">
        {/* الخط المشع (التوهج الأحمر الفائق) */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-600 shadow-[0_0_30px_8px_rgba(220,38,38,0.8),0_0_15px_3px_rgba(220,38,38,1)]" />
        
        {/* انعكاس الضوء الأحمر على السواد */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-red-900/30 to-transparent pointer-events-none" />
        
        {/* السواد الفاحم */}
        <div className="w-full h-full bg-[#000000]" />
      </div>

      <style>{`
        @keyframes sand-move {
          from { background-position: 0 0; }
          to { background-position: 1000px 500px; }
        }
        .animate-sand-move { animation: sand-move 100s linear infinite; }
      `}</style>
    </div>
  );
};
