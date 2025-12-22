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
      
      {/* 1. الكهف والصخور العلوية */}
      <div className="absolute inset-0 z-0 h-[70vh]">
        {/* التوهج العميق */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(120,0,0,0.15)_0%,#000000_85%)] z-10" />
        
        {/* صخرة الطرف الأيسر (نازلة من الزاوية) */}
        <div 
          className="absolute top-0 left-0 w-[35%] h-[50%] bg-[#080000] z-20 shadow-[20px_20px_50px_rgba(0,0,0,0.9)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 80% 40%, 40% 100%, 0 70%)' }}
        />

        {/* صخرة الطرف الأيمن (نازلة من الزاوية) */}
        <div 
          className="absolute top-0 right-0 w-[30%] h-[45%] bg-[#080000] z-20 shadow-[-20px_20px_50px_rgba(0,0,0,0.9)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 60% 100%, 20% 50%)' }}
        />

        {/* نسيج صخري خفيف جداً فوق الصخور */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/rocky-wall.png')] z-15" />
      </div>

      {/* 2. العداد المصغر (فوق في النص) */}
      <div className="relative z-50 flex flex-col items-center pt-8 w-full">
        <div className="bg-black/90 border border-red-900/50 px-5 py-2 rounded-md shadow-[0_0_20px_rgba(255,0,0,0.1)]">
          <div className="text-red-700 font-black tracking-[0.4em] text-[7px] uppercase mb-1 text-center">PENALTY TIME</div>
          <div className="text-3xl font-mono font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* 3. الأرضية السوداء والخط المشع (ثابتين مثل ما طلبت) */}
      <div className="absolute bottom-0 left-0 right-0 z-40 h-[30vh] bg-[#000000]">
        {/* الخط المشع */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600 shadow-[0_0_25px_5px_rgba(220,38,38,0.6),0_0_10px_2px_rgba(220,38,38,0.8)] z-50" />
        
        {/* توهج أحمر منعكس */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none" />
        
        {/* السواد الفاحم */}
        <div className="w-full h-full bg-[#000000]" />
      </div>

      {/* غبار الكهف */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-cave-dust" />

      <style>{`
        @keyframes cave-dust {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }
        .animate-cave-dust { animation: cave-dust 180s linear infinite; }
      `}</style>
    </div>
  );
};
