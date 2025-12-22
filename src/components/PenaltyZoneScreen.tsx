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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      
      {/* الطبقة 1: السماء (الخلفية العلوية) */}
      <div className={`absolute top-0 left-0 w-full h-[25vh] z-0 ${
        isDay ? 'bg-gradient-to-b from-[#004a7c] to-[#00a8cc]' : 'bg-black'
      }`} />

      {/* الطبقة 2: صورة الصحراء الكاملة (ثابتة - تعطي عمق للمكان) */}
      <div 
        className="absolute top-[15vh] left-0 w-full h-[85vh] z-10 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2076&auto=format&fit=crop')",
          filter: 'brightness(0.7) contrast(1.2)'
        }}
      >
        {/* تظليل لدمج الصورة مع السماء */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/50" />
      </div>

      {/* الطبقة 3: الرمل المتحرك (أسفل الشاشة - كأنك تمشي عليه فعلاً) */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] z-20 overflow-hidden">
        {/* تأثير الـ 3D للرمل القريب */}
        <div 
          className="absolute inset-0 origin-bottom"
          style={{ 
            transform: 'rotateX(60deg)',
            background: 'linear-gradient(to bottom, transparent, #bc6c25 40%, #8b4513 100%)'
          }}
        >
          {/* نسيج الرمل المتحرك بسرعة */}
          <div 
            className="absolute inset-0 opacity-60 animate-ground-fast"
            style={{ 
              backgroundImage: `url('https://www.transparenttextures.com/patterns/sandpaper.png')`,
              backgroundSize: '150px 150px'
            }}
          />
        </div>
        {/* ظل قوي لدمج الرمل المتحرك مع صورة الصحراء الثابتة */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-transparent to-[#bc6c25]" />
      </div>

      {/* الطبقة 4: تأثير الغبار والعاصفة (POV) */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-20">
        <div className="absolute inset-0 animate-sand-drift bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* العداد التقني (System UI) */}
      <div className="relative z-50 flex flex-col items-center pt-10 w-full">
        <div className="bg-black/80 backdrop-blur-xl border-x-2 border-red-600 px-8 py-3 shadow-[0_0_40px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-1 justify-center">
             <div className="w-1.5 h-1.5 bg-red-600 animate-ping rounded-full" />
             <span className="text-white/40 font-bold tracking-[0.4em] text-[8px] uppercase">Penalty Realm</span>
          </div>
          <div className="text-4xl font-mono font-black text-white tracking-widest tabular-nums">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ground-fast {
          from { background-position: 0 0; }
          to { background-position: 0 800px; }
        }
        @keyframes sand-drift {
          from { background-position: 0 0; }
          to { background-position: 1000px 500px; }
        }
        .animate-ground-fast { animation: ground-fast 5s linear infinite; }
        .animate-sand-drift { animation: sand-drift 30s linear infinite; }
      `}</style>

    </div>
  );
};
