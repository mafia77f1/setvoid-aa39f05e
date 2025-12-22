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
      
      {/* 1. بيئة الصحراء (الجزء العلوي) */}
      <div className="absolute inset-0 z-0 h-[70vh] bg-[#050000]">
        {/* السماء المظلمة */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0000] to-transparent z-10" />
        
        {/* الكثبان الرملية (محاكاة باستخدام التدرجات المنحنية) */}
        <div 
          className="absolute bottom-0 left-0 w-full h-full z-20 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 20% 100%, #1a0000 0%, transparent 50%),
              radial-gradient(ellipse at 80% 100%, #120000 0%, transparent 50%)
            `
          }}
        />

        {/* نسيج الرمل (Sand Texture) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')] z-25" />

        {/* أفق الصحراء البعيد */}
        <div className="absolute bottom-0 w-full h-[2px] bg-red-900/10 blur-sm z-30" />
      </div>

      {/* 2. العداد المصغر (يبقى في الأعلى) */}
      <div className="relative z-50 flex flex-col items-center pt-8 w-full">
        <div className="bg-black/80 border border-red-900/30 px-6 py-2 rounded-md shadow-2xl backdrop-blur-sm">
          <div className="text-red-700 font-black tracking-[0.5em] text-[7px] uppercase mb-1 text-center">DESERT PENALTY</div>
          <div className="text-3xl font-mono font-bold text-white tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* 3. الأرضية السوداء الفاحمة والخط المشع (ثابتين تماماً) */}
      <div className="absolute bottom-0 left-0 right-0 z-40 h-[30vh] bg-[#000000]">
        {/* الخط المشع */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_30px_6px_rgba(220,38,38,0.7),0_0_12px_2px_rgba(220,38,38,0.9)] z-50" />
        
        {/* توهج أحمر منعكس على حافة السواد */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-red-900/25 to-transparent pointer-events-none" />
        
        {/* السواد الفاحم العميق */}
        <div className="w-full h-full bg-[#000000]" />
      </div>

      {/* تأثير الغبار الصحراوي (Sand Dust) */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-sand-drift" />

      <style>{`
        @keyframes sand-drift {
          from { background-position: 0 0; }
          to { background-position: 1200px 400px; }
        }
        .animate-sand-drift { animation: sand-drift 100s linear infinite; }
      `}</style>
    </div>
  );
};
