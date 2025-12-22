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
    <div className="fixed inset-0 z-[100] bg-[#0a0000] overflow-hidden font-sans select-none">
      
      {/* الخلفية: وهج أحمر عميق */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#410000] via-[#1a0000] to-black opacity-60" />

      {/* الشياطين (الظلال الجانبية) */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {/* الشيطان الأيمن */}
        <div className="absolute -right-20 bottom-0 w-[500px] h-[600px] opacity-40 mix-blend-screen animate-pulse">
            <img src="https://path-to-your-demon-silhouette.png" className="w-full h-full object-contain filter grayscale invert brightness-50 sepia-[1] hue-rotate-[-50deg]" alt="" />
        </div>
        {/* الشيطان الأيسر */}
        <div className="absolute -left-20 bottom-0 w-[500px] h-[600px] opacity-40 mix-blend-screen animate-pulse delay-700">
             <img src="https://path-to-your-demon-silhouette.png" className="w-full h-full object-contain scale-x-[-1] filter grayscale invert brightness-50 sepia-[1] hue-rotate-[-50deg]" alt="" />
        </div>
      </div>

      {/* العداد العلوي */}
      <div className="relative z-50 flex flex-col items-center pt-12 w-full">
        <span className="text-white/60 text-[10px] tracking-[0.3em] font-bold mb-1">REMAINING TIME</span>
        <div className="text-5xl font-mono font-bold text-white drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
          {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </div>
        
        {/* شريط التقدم (LV) */}
        <div className="mt-4 flex items-center gap-3">
            <span className="text-white/80 font-bold text-xs bg-red-900/40 px-2 py-0.5 rounded border border-red-500/30">LV.</span>
            <div className="w-48 h-2 bg-black/50 rounded-full border border-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-800 to-red-500 w-3/4 shadow-[0_0_10px_red]" />
            </div>
            <button className="text-white/50 text-xl font-light">+</button>
        </div>
      </div>

      {/* الشخصية المركزية والفقاعة */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-40 mt-32">
        {/* فقاعة الكلام */}
        <div className="relative mb-6 bg-black/60 border border-red-500/40 px-6 py-2 rounded-xl backdrop-blur-sm shadow-[0_0_20px_rgba(255,0,0,0.2)]">
            <p className="text-white text-lg font-arabic font-medium" dir="rtl">
                النملي حصل على الكلب
            </p>
            {/* سهم الفقاعة */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/60 border-r border-b border-red-500/40 rotate-45" />
        </div>

        {/* أيقونة الشخصية (Stick Figure) */}
        <div className="w-24 h-40 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white rounded-full mb-1 shadow-[0_0_15px_white]" /> {/* الرأس */}
            <div className="w-1 h-16 bg-white shadow-[0_0_10px_white]" /> {/* الجسم */}
            <div className="flex gap-10 -mt-14"> {/* الأذرع */}
                <div className="w-1 h-12 bg-white rotate-[20deg] origin-top shadow-[0_0_10px_white]" />
                <div className="w-1 h-12 bg-white -rotate-[20deg] origin-top shadow-[0_0_10px_white]" />
            </div>
            <div className="flex gap-6 mt-2"> {/* الأرجل */}
                <div className="w-1 h-16 bg-white rotate-[5deg] shadow-[0_0_10px_white]" />
                <div className="w-1 h-16 bg-white -rotate-[5deg] shadow-[0_0_10px_white]" />
            </div>
        </div>
      </div>

      {/* تأثيرات جزيئات الرماد المتطاير */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute inset-0 animate-ember-flow opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <style>{`
        @keyframes ember-flow {
          from { background-position: 0 0; }
          to { background-position: -500px -1000px; }
        }
        .animate-ember-flow { animation: ember-flow 20s linear infinite; }
        .font-arabic { font-family: 'Noto Sans Arabic', sans-serif; }
      `}</style>

    </div>
  );
};
