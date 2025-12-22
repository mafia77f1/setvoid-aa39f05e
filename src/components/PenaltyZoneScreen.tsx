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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans" style={{ perspective: '1200px', perspectiveOrigin: '50% 40%' }}>
      
      {/* 1. السماء (الأفق البعيد) */}
      <div className={`absolute inset-0 z-0 transition-colors duration-[3000ms] ${
        isDay 
        ? 'bg-gradient-to-b from-[#004a7c] via-[#00a8cc] to-[#f4a261]' 
        : 'bg-gradient-to-b from-black via-[#0f0a05] to-[#2b1600]'
      }`} />

      {/* 2. مجسم الصحراء 3D (التلال والكثبان) */}
      <div className="absolute inset-0 z-10">
        
        {/* التلال البعيدة (مجسمات ثابتة لتعطي عمق) */}
        <div className="absolute top-[35%] left-[-10%] w-[120%] h-[20vh] bg-[#8b4513] rounded-[100%] blur-[2px] opacity-80" 
             style={{ transform: 'scaleY(0.3)' }} />
        <div className="absolute top-[38%] right-[-15%] w-[100%] h-[25vh] bg-[#bc6c25] rounded-[100%] blur-[1px] opacity-90" 
             style={{ transform: 'scaleY(0.4)' }} />

        {/* الأرضية الواسعة المتحركة (Infinite Sand Floor) */}
        <div 
          className="absolute bottom-[-50%] left-[-50%] w-[200%] h-[120vh] origin-top"
          style={{ 
            transform: 'rotateX(75deg)',
            background: 'linear-gradient(to bottom, #4d2600 0%, #bc6c25 20%, #d4a373 100%)',
          }}
        >
          {/* نسيج الرمل المتحرك تحتك */}
          <div 
            className="absolute inset-0 opacity-40 animate-ground-move"
            style={{ 
              backgroundImage: `url('https://www.transparenttextures.com/patterns/sandpaper.png')`,
              backgroundSize: '150px 150px'
            }}
          />
          
          {/* تموجات الرمل (Sand Ripples) - تعطي شكل التلال الصغيرة */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_100px,rgba(0,0,0,0.1)_120px)]" />
        </div>
      </div>

      {/* 3. تأثير "توهج الأفق" ودمج السماء بالأرض */}
      <div className="absolute top-[35vh] left-0 w-full h-[15vh] bg-gradient-to-b from-transparent via-[#bc6c25]/40 to-transparent z-20 pointer-events-none" />

      {/* 4. غبار العاصفة (POV) - ذرات رمل تتطاير أمام الكاميرا */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-25">
        <div className="absolute inset-0 animate-dust-storm bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        {/* تعتيم الأطراف السينمائي */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* 5. العداد العلوي (System UI) */}
      <div className="relative z-50 flex flex-col items-center pt-10 w-full">
        <div className="bg-black/70 backdrop-blur-xl border-x-[3px] border-red-600 px-10 py-4 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2 mb-1 justify-center">
             <div className="w-2 h-2 bg-red-600 animate-ping rounded-full shadow-[0_0_10px_red]" />
             <span className="text-white/40 font-black tracking-[0.5em] text-[9px] uppercase font-mono">System Penalty Mode</span>
          </div>
          <div className="text-5xl font-mono font-black text-white tracking-widest tabular-nums drop-shadow-md">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
        {/* وصف المهمة الصغير */}
        <div className="mt-4 text-white/20 text-[10px] tracking-[0.3em] font-bold uppercase italic">
          Goal: Survival in the Endless Desert
        </div>
      </div>

      <style>{`
        @keyframes ground-move {
          from { background-position: 0 0; }
          to { background-position: 0 1000px; }
        }
        @keyframes dust-storm {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-20px, 10px); opacity: 0.4; }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-ground-move { animation: ground-move 12s linear infinite; }
        .animate-dust-storm { animation: dust-storm 6s ease-in-out infinite; }
      `}</style>

    </div>
  );
};
