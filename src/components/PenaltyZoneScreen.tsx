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
      
      {/* 1. الجزء العلوي: لون الصحراء الجبار */}
      <div className="absolute inset-0 z-0 h-[70vh] bg-[#c27a3f]">
        {/* تدرج يعطي عمق للرمل (من الفاتح للداكن) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#d4a373]/50 via-[#bc6c25]/80 to-[#2b1700]" />
        
        {/* تفاصيل الكثبان الرملية (منحنيات خفيفة) */}
        <div className="absolute bottom-0 left-0 right-0 h-full opacity-40" 
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 100%, #8b4513 0%, transparent 70%)`
          }} 
        />

        {/* نسيج الرمل الحقيقي */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]" />
        
        {/* تأثير الرياح والغبار الرملي */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-sand-move" />
      </div>

      {/* 2. العداد المصغر (فوق) */}
      <div className="relative z-50 flex flex-col items-center pt-8 w-full">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-2 rounded-sm shadow-xl">
          <div className="text-white/70 font-black tracking-[0.4em] text-[8px] uppercase mb-1 text-center font-mono">DESERT PENALTY</div>
          <div className="text-3xl font-mono font-bold text-white tracking-tighter tabular-nums">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* 3. الأرضية السوداء والخط المشع (ممنوع اللمس - ثابتة مثل ما طلبت) */}
      <div className="absolute bottom-0 left-0 right-0 z-40 h-[30vh] bg-[#000000]">
        {/* الخط المشع (توهج أحمر فائق) */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-600 shadow-[0_0_30px_8px_rgba(220,38,38,0.8),0_0_15px_3px_rgba(220,38,38,1)] z-50" />
        
        {/* انعكاس الضوء الأحمر على بداية السواد */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-red-900/30 to-transparent pointer-events-none" />
        
        {/* السواد الفاحم (أدنى جزء) */}
        <div className="w-full h-full bg-[#000000]" />
      </div>

      <style>{`
        @keyframes sand-move {
          from { background-position: 0 0; }
          to { background-position: 1000px 500px; }
        }
        .animate-sand-move { animation: sand-move 80s linear infinite; }
      `}</style>
    </div>
  );
};
