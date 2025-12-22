import { useState, useEffect } from 'react';

export const SoloLevelingPenaltyScreen = ({ endTime, onTimeComplete }) => {
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
    <div className="fixed inset-0 z-[100] bg-[#0a0000] overflow-hidden font-sans select-none">
      
      {/* 1. الخلفية السينمائية (تدرج أحمر وأسود مثل الصور) */}
      <div className="absolute inset-0 z-0">
        {/* توهج أحمر علوي (مثل الشمس الحمراء في الصورة) */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-red-600/20 blur-[120px] rounded-full" />
        
        {/* تأثير الضباب والدخان السفل */}
        <div className="absolute bottom-0 left-0 w-full h-[60vh] bg-gradient-to-t from-black via-red-950/20 to-transparent z-10" />
        
        {/* نسيج الأرضية المظلمة */}
        <div className="absolute inset-0 opacity-40 mix-blend-soft-light bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* 2. نظام العداد (System HUD) - مستوحى من واجهة سولو ليفلينج */}
      <div className="relative z-50 flex flex-col items-center justify-start pt-16 px-6">
        
        {/* إطار العداد العلوي */}
        <div className="relative group">
          {/* خطوط التصميم الجانبية (UI Borders) */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-[80%] w-[2px] bg-red-600 shadow-[0_0_10px_#dc2626]" />
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 h-[80%] w-[2px] bg-red-600 shadow-[0_0_10px_#dc2626]" />
          
          <div className="flex flex-col items-center">
             <span className="text-[10px] text-red-500 font-bold tracking-[0.3em] uppercase mb-1 animate-pulse">
               System Penalty Mode
             </span>
             
             {/* الوقت الرقمي المتوهج */}
             <div className="text-6xl font-mono font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
               {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
             </div>
             
             <div className="mt-2 h-[1px] w-48 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
             <p className="mt-2 text-[9px] text-gray-400 font-medium tracking-widest uppercase">
               Goal: Survival in the Endless Desert
             </p>
          </div>
        </div>
      </div>

      {/* 3. عناصر الجرافيك الوسطى (Silhouette) */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        {/* ظل خفيف لشخصية (Optional) أو وحش خلفي كما في الصورة الأولى */}
        <div className="w-full h-full opacity-30 mix-blend-overlay bg-center bg-no-repeat bg-contain" 
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/asfalt-dark.png')` }} />
      </div>

      {/* 4. تأثير العاصفة والشرارات (Particles) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="absolute inset-0 animate-ember bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      {/* 5. بار الحالة السفلي (Level/Exp) */}
      <div className="absolute bottom-10 left-0 w-full px-10 z-50">
        <div className="flex justify-between items-end mb-1">
          <span className="text-red-500 font-bold text-xs italic">LV. 001</span>
          <span className="text-white/40 text-[8px]">HP 100% / MP 100%</span>
        </div>
        <div className="h-[3px] w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-red-600 shadow-[0_0_8px_#dc2626] w-[75%] animate-pulse" />
        </div>
      </div>

      <style>{`
        @keyframes ember {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        .animate-ember {
          animation: ember 40s linear infinite;
        }
      `}</style>

    </div>
  );
};
