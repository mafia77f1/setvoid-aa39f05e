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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      
      {/* 1. بيئة صحراء العقاب الفخمة (Penalty Realm) */}
      <div className="absolute inset-0 z-0">
        
        {/* السماء: سماء حمراء غامقة توحي بالخطر */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0000] via-[#3d1a00] to-[#8b4513]" />

        {/* الأرضية: رمال برتقالية محروقة ممتدة للأبد */}
        <div className="absolute bottom-0 left-0 w-full h-[55vh] z-10 overflow-hidden">
          {/* لون الرمل الأساسي مع تدرج للعمق */}
          <div className="absolute inset-0 bg-[#bc6c25] shadow-[inset_0_20px_100px_rgba(0,0,0,0.8)]" />
          
          {/* خط الأفق المشع (السراب القوي) */}
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_40px_10px_rgba(220,38,38,0.5)] z-20" />
          
          {/* نسيج رملي خشن وقوي جداً */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
        </div>

        {/* عاصفة رملية كثيفة (Heavy Sandstorm) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 opacity-30 animate-heavy-storm bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
          <div className="absolute inset-0 opacity-20 animate-sand-fast bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>

        {/* ظلال جانبية تعطي إحساس بالرهبة */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.7)_100%)] z-25" />
      </div>

      {/* 2. واجهة النظام (Solo Leveling System Interface) */}
      <div className="relative z-50 flex flex-col items-center pt-20 w-full">
        
        {/* وميض التحذير العلوي */}
        <div className="mb-4 px-4 py-1 border border-red-600 bg-red-600/10 text-red-500 font-black tracking-[1em] text-[10px] animate-pulse uppercase">
          Penalty Quest: Survival
        </div>

        <div className="relative group">
          {/* خلفية العداد التقنية */}
          <div className="bg-black/90 backdrop-blur-2xl border-x-2 border-red-600 px-12 py-6 shadow-[0_0_50px_rgba(255,0,0,0.2)]">
            
            <div className="text-white/40 text-[8px] font-bold tracking-[0.5em] uppercase mb-2 text-center">Remaining Time</div>
            
            <div className="flex items-baseline gap-1">
               <span className="text-6xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
              </span>
            </div>

            {/* شريط التحميل "مشحون" بالطاقة */}
            <div className="w-full h-[2px] bg-red-900/30 mt-4 relative overflow-hidden">
               <div className="absolute inset-0 bg-red-600 animate-progress-glow" style={{ width: '100%' }} />
            </div>
          </div>

          {/* ديكورات الزوايا */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-red-600" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-red-600" />
        </div>

        <div className="mt-6 flex flex-col items-center gap-1">
           <div className="text-white/20 text-[9px] tracking-[0.4em] font-bold uppercase">Status: In Danger</div>
           <div className="h-[20px] w-[1px] bg-gradient-to-b from-red-600 to-transparent" />
        </div>
      </div>

      {/* الأنيميشن القوي */}
      <style>{`
        @keyframes heavy-storm {
          from { background-position: 0 0; transform: scale(1); }
          to { background-position: 1000px 500px; transform: scale(1.1); }
        }
        @keyframes sand-fast {
          from { background-position: 500px 0; }
          to { background-position: 0 1000px; }
        }
        @keyframes progress-glow {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 10px red; }
          50% { opacity: 1; box-shadow: 0 0 20px red; }
        }
        .animate-heavy-storm { animation: heavy-storm 20s linear infinite; }
        .animate-sand-fast { animation: sand-fast 8s linear infinite; }
        .animate-progress-glow { animation: progress-glow 2s ease-in-out infinite; }
      `}</style>

    </div>
  );
};
