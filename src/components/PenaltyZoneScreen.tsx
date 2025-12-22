import { useState, useEffect } from 'react';

export const PenaltyZoneScreen = ({ endTime, onTimeComplete }: { endTime: string, onTimeComplete: () => void }) => {
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
    <div className="fixed inset-0 z-[100] bg-[#1a0a00] overflow-hidden font-sans">
      
      {/* 1. بيئة صحراء سولو ليفلينج (Penalty Zone) */}
      <div className="absolute inset-0 z-0">
        
        {/* السماء: سماء برتقالية باهتة ومغبرة مثل مشهد العقاب */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4d2600] via-[#261300] to-[#bc6c25]" />

        {/* الأرضية المنبسطة تماماً (Infinite Desert Floor) */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-[#bc6c25] z-10">
          {/* تأثير التلاشي في الأفق (السراب) */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-[#bc6c25]/50 to-[#bc6c25] -translate-y-full" />
          
          {/* نسيج الرمل الخشن */}
          <div className="absolute inset-0 opacity-40 mix-blend-soft-light bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]" />
          
          {/* ظلال خفيفة على الأرض تعطي إيحاء بالمساحة الشاسعة */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,0,0,0.4)_0%,transparent_80%)]" />
        </div>

        {/* تأثير الرياح والعاصفة الرملية الخفيفة (مثل سولو ليفلينج) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 opacity-20 animate-sand-storm bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
      </div>

      {/* 2. العداد العلوي (نفس ستايل النظام في الانمي) */}
      <div className="relative z-50 flex flex-col items-center pt-16 w-full">
        {/* علامة التحذير */}
        <div className="mb-2 text-red-500 font-black tracking-[0.5em] text-xs animate-pulse">
          [ WARNING: PENALTY QUEST ]
        </div>

        <div className="bg-black/60 backdrop-blur-md border-2 border-red-600/50 px-10 py-4 rounded-none shadow-[0_0_30px_rgba(220,38,38,0.2)] relative">
          {/* زوايا الديكور التقنية */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-600" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-red-600" />
          
          <div className="text-white/60 text-[9px] font-bold tracking-[0.3em] uppercase mb-1">Time Remaining</div>
          <div className="text-5xl font-mono font-black text-white tracking-widest tabular-nums">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>

        <div className="mt-4 text-white/30 text-[10px] tracking-[0.2em] font-medium">
          GOAL: SURVIVE UNTIL THE TIME EXPIRES
        </div>
      </div>

      {/* أنيميشن العاصفة الرملية */}
      <style>{`
        @keyframes sand-storm {
          0% { background-position: 0 0; opacity: 0.1; }
          50% { opacity: 0.25; }
          100% { background-position: 1500px 200px; opacity: 0.1; }
        }
        .animate-sand-storm { 
          animation: sand-storm 10s linear infinite; 
        }
      `}</style>

    </div>
  );
};
