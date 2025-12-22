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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      
      {/* 1. بيئة صحراء العقاب الفخمة (الخلفية) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0000] via-[#3d1a00] to-[#8b4513]" />
        <div className="absolute bottom-0 left-0 w-full h-[60vh] z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[#bc6c25] shadow-[inset_0_20px_100px_rgba(0,0,0,0.8)]" />
          <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600 shadow-[0_0_30px_5px_rgba(220,38,38,0.6)] z-20" />
          <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
        </div>
        
        {/* العواصف الرملية */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 opacity-20 animate-heavy-storm bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
          <div className="absolute inset-0 opacity-20 animate-sand-fast bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
      </div>

      {/* 2. عداد الوقت المصغر والأنيق (في الأعلى) */}
      <div className="relative z-50 flex flex-col items-center pt-10 w-full">
        
        <div className="relative group">
          {/* حاوية العداد المصغرة */}
          <div className="bg-black/80 backdrop-blur-xl border border-red-600/40 px-6 py-2 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col items-center">
            
            {/* نص الحالة الصغير */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-1 bg-red-600 animate-pulse rounded-full" />
              <div className="text-red-500 font-black tracking-[0.3em] text-[7px] uppercase">
                Penalty Quest Status
              </div>
              <div className="w-1 h-1 bg-red-600 animate-pulse rounded-full" />
            </div>
            
            {/* الوقت المصغر */}
            <div className="text-3xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
            </div>

            {/* شريط تقدم نحيف جداً */}
            <div className="w-full h-[1px] bg-red-900/40 mt-2 relative overflow-hidden">
               <div className="absolute inset-0 bg-red-600 animate-progress-glow" style={{ width: '100%' }} />
            </div>
          </div>

          {/* زوايا ديكور ناعمة */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-red-600" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-red-600" />
        </div>

        {/* تسمية المنطقة */}
        <div className="mt-3 text-white/40 text-[8px] tracking-[0.6em] font-bold uppercase">
          Desert Domain
        </div>
      </div>

      <style>{`
        @keyframes heavy-storm {
          from { background-position: 0 0; transform: scale(1); }
          to { background-position: 1000px 500px; transform: scale(1.05); }
        }
        @keyframes sand-fast {
          from { background-position: 500px 0; }
          to { background-position: 0 1000px; }
        }
        @keyframes progress-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-heavy-storm { animation: heavy-storm 25s linear infinite; }
        .animate-sand-fast { animation: sand-fast 10s linear infinite; }
        .animate-progress-glow { animation: progress-glow 2s ease-in-out infinite; }
      `}</style>

    </div>
  );
};
