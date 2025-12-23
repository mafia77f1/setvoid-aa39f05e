import { useState, useEffect } from 'react';

interface PenaltyZoneScreenProps {
  endTime: string; 
  onTimeComplete: () => void;
}

export const PenaltyZoneScreen = ({ endTime, onTimeComplete }: PenaltyZoneScreenProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

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

  const formatTime = (s: number) => {
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    return {
      h: String(hours).padStart(2, '0'),
      m: String(minutes).padStart(2, '0'),
      sec: String(seconds).padStart(2, '0')
    };
  };

  const t = formatTime(timeRemaining);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans select-none flex flex-col">
      
      {/* الجزء العلوي - أجواء سولو ليفلينج */}
      <div className="relative h-[65vh] w-full bg-gradient-to-b from-[#1a0b2e] via-[#0d0517] to-black flex flex-col items-center justify-center">
        
        {/* إضاءة خلفية مركزية */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.2)_0%,transparent_70%)]" />

        {/* منطقة العداد الكبيرة */}
        <div className="relative z-50 flex flex-col items-center">
          {/* اسم المنطقة - كبير وبارز */}
          <div className="mb-4 flex flex-col items-center">
            <span className="text-red-600 font-black tracking-[0.8em] text-xl md:text-2xl uppercase italic drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              Penalty Zone
            </span>
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-600 to-transparent mt-2 shadow-[0_0_10px_rgba(220,38,38,1)]" />
          </div>

          {/* العداد الرقمي - ضخم */}
          <div className="text-7xl md:text-9xl font-mono font-bold text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {t.h}<span className="text-red-600 animate-pulse">:</span>{t.m}<span className="text-red-600 animate-pulse">:</span>{t.sec}
          </div>
          
          <span className="text-gray-500 text-xs mt-4 tracking-[0.3em] uppercase">Time Remaining Until Redemption</span>
        </div>

        {/* تأثير الضباب السفلي */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </div>

      {/* الجزء السفلي - الأرضية مع الخط الأحمر المُزاح للأسفل */}
      <div className="relative h-[35vh] w-full bg-black flex justify-center">
        
        {/* الخط الأحمر - تم إنزاله قليلاً ليعطي مدى بصري أبعد */}
        <div className="absolute top-10 left-0 right-0 z-50">
          <div className="h-[4px] w-full bg-red-600 shadow-[0_0_30px_5px_rgba(220,38,38,0.8),0_0_60px_15px_rgba(220,38,38,0.3)]" />
          <div className="absolute -top-2 w-full h-8 bg-red-600/10 blur-xl" />
        </div>

        {/* تفاصيل الأرضية */}
        <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
        
        {/* نصوص تحذيرية صغيرة جداً في الأسفل لإضافة طابع تقني (System UI) */}
        <div className="absolute bottom-6 w-full px-10 flex justify-between items-end opacity-40">
            <div className="text-[10px] text-red-500 font-mono">STATUS: PENALIZED</div>
            <div className="text-[10px] text-red-500 font-mono text-right">SYSTEM_ERROR_0x992<br/>UNAUTHORIZED_EXIT_STRICTLY_PROHIBITED</div>
        </div>
      </div>

      {/* تأثير الغبار المتطاير */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-float" />

      <style>{`
        @keyframes float {
          0% { background-position: 0 0; }
          100% { background-position: 500px 1000px; }
        }
        .animate-float { animation: float 80s linear infinite; }
      `}</style>
      
    </div>
  );
};
