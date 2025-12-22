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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans" style={{ perspective: '800px' }}>
      
      {/* 1. الأفق والسماء (بعيدة جداً) */}
      <div className={`absolute top-0 left-0 w-full h-[40vh] transition-colors duration-[3000ms] ${
        isDay ? 'bg-[#4facfe]' : 'bg-black'
      }`}>
        {/* توهج خفيف عند خط الأفق لدمج الأرض بالسماء */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#bc6c25] to-transparent opacity-30" />
      </div>

      {/* 2. الأرضية الـ 3D (الرمل تحت رجليك) */}
      <div 
        className="absolute bottom-0 left-[-50%] w-[200%] h-[70vh] origin-top flex justify-center"
        style={{ 
          transform: 'rotateX(75deg)',
          background: 'linear-gradient(to bottom, #8b4513 0%, #bc6c25 40%, #c27a3f 100%)',
        }}
      >
        {/* نسيج الرمل المتحرك لإعطاء إحساس المشي أو حركة الرياح */}
        <div 
          className="absolute inset-0 opacity-40 animate-sand-move"
          style={{ 
            backgroundImage: `url('https://www.transparenttextures.com/patterns/sandpaper.png')`,
            backgroundSize: '200px 200px'
          }}
        />

        {/* خطوط المنظور (Perspective Lines) - هي اللي تعطي إحساس الـ 3D الحقيقي */}
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 49%, rgba(0,0,0,0.05) 50%, transparent 51%)',
            backgroundSize: '10% 100%' 
          }}
        />
      </div>

      {/* 3. تأثير "السراب" والغبار الذي يضرب في وجهك (POV) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute inset-0 opacity-20 animate-dust bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        {/* تظليل جانبي كأنك تنظر من خلال خوذة أو عين */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* 4. العداد (واجهة نظام سولو ليفلينج) */}
      <div className="relative z-50 flex flex-col items-center pt-12 w-full">
        <div className="bg-black/70 backdrop-blur-md border border-white/5 p-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-1.5 bg-red-600 animate-ping rounded-full" />
             <span className="text-white/50 font-bold tracking-[0.4em] text-[8px] uppercase">Desert Penalty</span>
          </div>
          <div className="text-4xl font-mono font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sand-move {
          from { background-position: 0 0; }
          to { background-position: 0 1000px; }
        }
        @keyframes dust {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-20px, 10px); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-sand-move { animation: sand-move 15s linear infinite; }
        .animate-dust { animation: dust 10s ease-in-out infinite; }
      `}</style>

    </div>
  );
};
