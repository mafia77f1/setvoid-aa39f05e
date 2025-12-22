import { useState, useEffect } from 'react';

export const DesertPenaltyQuest = ({ endTime, onTimeComplete }: { endTime: string, onTimeComplete: () => void }) => {
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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans" style={{ perspective: '1200px' }}>
      
      {/* 1. السماء - شريط علوي صغير وداكن جداً ليعطي هيبة */}
      <div className="absolute top-0 left-0 w-full h-[15vh] bg-gradient-to-b from-black via-[#0a0a0a] to-[#bc6c25] z-0" />

      {/* 2. مجسم الصحراء 3D الواسع (الرمل المتحرك للأمام) */}
      <div className="absolute inset-0 z-10 flex justify-center">
        <div 
          className="absolute bottom-[-30%] w-[400%] h-[110vh] origin-top"
          style={{ 
            transform: 'rotateX(80deg)',
            // مزيج ألوان ليعطي عمق الكثبان الرملية
            background: `
              radial-gradient(circle at 50% 0%, transparent 10%, rgba(0,0,0,0.7) 100%),
              #bc6c25
            `,
          }}
        >
          {/* نسيج الرمل المتحرك (السرعة تعطي إحساس المشي) */}
          <div 
            className="absolute inset-0 opacity-40 animate-ground-advance"
            style={{ 
              backgroundImage: `url('https://www.transparenttextures.com/patterns/sandpaper.png')`,
              backgroundSize: '200px 200px'
            }}
          />
          
          {/* خطوط الطول لزيادة تأثير الـ 3D والسرعة */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_48%,rgba(0,0,0,0.05)_50%,transparent_52%)] bg-[length:5%_100%]" />
        </div>
      </div>

      {/* 3. الشخصية (منظور الشخص الثالث - تنظر للأمام نحو الأفق) */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
        {/* ظل الشخصية على الرمل */}
        <div className="w-20 h-5 bg-black/60 blur-xl rounded-full mb-[-15px] scale-x-150" />
        
        {/* جسم الشخصية - مصمم ليكون غامض (Silhouette) */}
        <div className="animate-character-move">
          <svg width="110" height="200" viewBox="0 0 100 200">
            {/* الرأس */}
            <circle cx="50" cy="35" r="13" fill="#000" />
            {/* رداء طويل عريض الكتفين */}
            <path d="M15 60 Q50 40 85 60 L95 190 L5 190 Z" fill="#0d0d0d" />
            {/* تفاصيل بسيطة للرداء */}
            <path d="M50 60 L50 190" stroke="#1a1a1a" strokeWidth="2" opacity="0.4" />
          </svg>
        </div>

        {/* لافتة النظام فوق الشخصية */}
        <div className="mt-4 bg-black/60 border border-red-900/50 px-3 py-1 backdrop-blur-sm">
           <span className="text-[9px] text-red-600 font-black tracking-[0.3em] uppercase">Status: Exhausted</span>
        </div>
      </div>

      {/* 4. العداد (UI النظام - سولو ليفلينج ستايل) */}
      <div className="relative z-50 flex flex-col items-center pt-10">
        <div className="bg-black/90 border-t-2 border-red-600 px-12 py-4 shadow-[0_20px_50px_rgba(0,0,0,1)]">
          <div className="text-[10px] text-red-600 font-bold tracking-[0.6em] uppercase mb-1 text-center">Penalty Quest</div>
          <div className="text-5xl font-mono font-black text-white tracking-[0.1em] tabular-nums">
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* 5. تأثيرات الجو (عاصفة رملية وتعتيم سينمائي) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {/* غبار متطاير */}
        <div className="absolute inset-0 opacity-20 animate-sand-storm bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        {/* تعتيم الأطراف لتركيز النظر للداخل */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      <style>{`
        @keyframes ground-advance {
          from { background-position: 0 0; }
          to { background-position: 0 1200px; }
        }
        @keyframes character-move {
          0%, 100% { transform: translateY(0) scaleX(1); }
          50% { transform: translateY(-8px) scaleX(1.03); }
        }
        @keyframes sand-storm {
          from { background-position: 0 0; }
          to { background-position: 800px 400px; }
        }
        .animate-ground-advance { animation: ground-advance 10s linear infinite; }
        .animate-character-move { animation: character-move 0.7s ease-in-out infinite; }
        .animate-sand-storm { animation: sand-storm 15s linear infinite; }
      `}</style>

    </div>
  );
};
