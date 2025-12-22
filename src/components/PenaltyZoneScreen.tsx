import { useState, useEffect } from 'react';

/**
 * PenaltyZoneScreen - نسخة الصحراء المنبسطة الكاملة
 * @param endTime - الوقت الذي ينتهي عنده العداد (مثلاً بعد 4 ساعات)
 * @param onTimeComplete - وظيفة تُنفذ عند انتهاء الوقت
 */
export const PenaltyZoneScreen = ({ 
  endTime = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), 
  onTimeComplete 
}: { 
  endTime?: string, 
  onTimeComplete?: () => void 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  // تحديث عداد الوقت كل ثانية
  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining <= 0 && onTimeComplete) {
        onTimeComplete();
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [endTime, onTimeComplete]);

  // تنسيق الوقت إلى ساعات:دقائق:ثواني
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return {
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(sec).padStart(2, '0')
    };
  };

  const t = formatTime(timeRemaining);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      
      {/* 1. بيئة الصحراء المنبسطة بالكامل (الشاشة كاملة) */}
      <div className="absolute inset-0 z-0">
        
        {/* لون الرمل الأساسي الجبار */}
        <div className="absolute inset-0 bg-[#bc6c25]" />

        {/* تدرج العمق والأفق (يسحب العين من الأسفل للأعلى نحو الظلام) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#4a2c0f]/80 to-transparent z-10" />

        {/* نسيج الرمل (Texture) الممتد لإعطاء واقعية للملمس */}
        <div 
          className="absolute inset-0 opacity-25 mix-blend-overlay z-20"
          style={{ 
            backgroundImage: "url('https://www.transparenttextures.com/patterns/sandpaper.png')",
            backgroundSize: '150px 150px'
          }}
        />

        {/* تأثير الرياح والغبار الرملي الزاحف على الأرضية */}
        <div className="absolute inset-0 z-30 opacity-20 pointer-events-none">
          <div className="absolute inset-0 animate-sand-drift bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>

        {/* إضاءة مركزية خفيفة جداً تعطي بعداً للمكان */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,190,118,0.15)_0%,transparent_70%)] z-25" />
      </div>

      {/* 2. العداد الرقمي المصغر (Solo Leveling Style) في الأعلى */}
      <div className="relative z-50 flex flex-col items-center pt-16 w-full">
        <div className="bg-black/80 backdrop-blur-xl border border-[#dda15e]/30 px-10 py-4 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.7)]">
          {/* نص المهمة */}
          <div className="text-[#dda15e] font-black tracking-[0.6em] text-[9px] uppercase mb-2 text-center font-mono opacity-90 animate-pulse">
            PENALTY MISSION: SURVIVE
          </div>
          
          {/* أرقام الوقت */}
          <div className="flex items-center gap-2">
            <span className="text-5xl font-mono font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {t.hours}:{t.minutes}:{t.seconds}
            </span>
          </div>

          {/* شريط تقدم نحيف جداً */}
          <div className="w-full h-[1px] bg-[#dda15e]/20 mt-3 overflow-hidden">
            <div className="h-full bg-[#dda15e] animate-shimmer" style={{ width: '100%', backgroundSize: '200% 100%' }} />
          </div>
        </div>

        {/* نص تحذيري خافت تحت العداد */}
        <div className="mt-4 text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">
          Time Remaining in Desert Domain
        </div>
      </div>

      {/* أنيميشن الرياح والشريط */}
      <style>{`
        @keyframes sand-drift {
          from { background-position: 0 0; }
          to { background-position: 1200px 600px; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-sand-drift { 
          animation: sand-drift 100s linear infinite; 
        }
        .animate-shimmer {
          animation: shimmer 4s linear infinite;
          background-image: linear-gradient(90deg, transparent, rgba(221,161,94,0.5), transparent);
        }
      `}</style>

    </div>
  );
};
