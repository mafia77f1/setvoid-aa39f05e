import { useState, useEffect } from 'react';

export const PenaltyZoneScreen = ({ endTime, onTimeComplete }: { endTime: string, onTimeComplete: () => void }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isDay, setIsDay] = useState(false);

  useEffect(() => {
    // التبديل بين النهار والليل (النهار من 6 ص إلى 6 م)
    const hour = new Date().getHours();
    setIsDay(hour >= 6 && hour < 18);

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
      
      {/* 1. بيئة الصحراء الشاملة (80% من الشاشة رمال) */}
      <div className="absolute inset-0 z-0 flex flex-col">
        
        {/* السماء: شريط صغير جداً في الأعلى (20% من الشاشة) */}
        <div className={`h-[20vh] w-full transition-colors duration-[3000ms] ${
          isDay 
          ? 'bg-gradient-to-b from-[#005f99] to-[#87ceeb]' 
          : 'bg-gradient-to-b from-black via-[#0a0a0a] to-[#1a0f00]'
        }`} />

        {/* الصحراء الممتدة: تأخذ أغلب المساحة (80% من الشاشة) */}
        <div className="h-[80vh] w-full relative">
          {/* لون الرمل الأساسي مع تدرج يعطي عمقاً وكأن الأرض ممتدة أمامك */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#8b4513] via-[#bc6c25] to-[#a0522d]" />
          
          {/* تأثير تلاشي الأفق (لدمج الأرض بالسماء بدون خط فاصل) */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent -translate-y-full" />

          {/* نسيج الرمل الخشن لزيادة الواقعية */}
          <div className="absolute inset-0 opacity-25 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]" />

          {/* ظلال خفيفة توحي بأنك تنظر لمساحة منبسطة وشاسعة */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        {/* تأثير العاصفة الرملية الخفيفة على كامل الشاشة */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-10">
          <div className="absolute inset-0 animate-sand-fast bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
      </div>

      {/* 2. العداد المصغر والأنيق (فوق في منطقة السماء) */}
      <div className="relative z-50 flex flex-col items-center pt-8 w-full">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-2 rounded-sm shadow-2xl">
          {/* لمبة الحالة */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDay ? 'bg-blue-400' : 'bg-red-600'}`} />
            <div className="text-white/80 font-black tracking-[0.4em] text-[8px] uppercase font-mono">
              System Domain: {isDay ? 'Day' : 'Night'}
            </div>
          </div>
          
          {/* الوقت الرقمي */}
          <div className="text-4xl font-mono font-bold text-white tracking-tighter drop-shadow-lg">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* 3. تأثير "الضباب الرملي" عند الأفق لزيادة الواقعية */}
      <div className="absolute top-[15vh] left-0 w-full h-24 bg-gradient-to-b from-transparent via-[#bc6c25]/30 to-transparent z-10 pointer-events-none" />

      <style>{`
        @keyframes sand-fast {
          from { background-position: 0 0; }
          to { background-position: 1200px 600px; }
        }
        .animate-sand-fast { animation: sand-fast 25s linear infinite; }
      `}</style>

    </div>
  );
};
