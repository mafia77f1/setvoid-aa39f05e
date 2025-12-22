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
      
      {/* 1. خلفية الصحراء الحقيقية (Realistic Background) */}
      <div className="absolute inset-0 z-0">
        {/* صورة صحراء واقعية ممتدة للأفق */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2076&auto=format&fit=crop')",
            filter: 'brightness(0.6) contrast(1.2) saturate(1.2)' // تعديل سينمائي للصحراء
          }}
        />
        
        {/* طبقة تظليل علوية وسفلية لتركيز النظر على العداد */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40 z-10" />
        
        {/* تأثير العاصفة الرملية فوق الصورة الحقيقية */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-20">
          <div className="absolute inset-0 animate-sand-storm bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
      </div>

      {/* 2. واجهة العداد (Style: Solo Leveling System) */}
      <div className="relative z-50 flex flex-col items-center justify-start pt-20 w-full h-full">
        
        {/* إشعار النظام المومض */}
        <div className="mb-6 px-6 py-1.5 border-2 border-red-600 bg-red-600/20 text-red-500 font-black tracking-[0.8em] text-[10px] animate-pulse uppercase shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          [ Penalty Quest: Survive ]
        </div>

        {/* العداد الرقمي الفخم */}
        <div className="relative group">
          <div className="bg-black/85 backdrop-blur-xl border-x-4 border-red-600 px-14 py-8 shadow-[0_0_60px_rgba(0,0,0,1)]">
            
            <div className="text-white/40 text-[9px] font-bold tracking-[0.4em] uppercase mb-3 text-center">Remaining Time</div>
            
            <div className="flex items-center justify-center gap-1">
               <span className="text-7xl font-mono font-black text-white tracking-[0.1em] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
              </span>
            </div>

            {/* شريط الطاقة السفلي للعداد */}
            <div className="w-full h-1 bg-red-900/30 mt-6 relative overflow-hidden">
               <div className="absolute inset-0 bg-red-600 shadow-[0_0_10px_red]" style={{ width: '100%' }} />
            </div>
          </div>

          {/* ديكورات زوايا سولو ليفلينج */}
          <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-red-600" />
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-red-600" />
        </div>

        {/* معلومات المهمة */}
        <div className="mt-8 text-center space-y-2">
           <div className="text-white font-bold tracking-[0.2em] text-xs uppercase bg-black/40 px-4 py-1">Goal: Run 10km or Survive</div>
           <div className="text-red-500/80 text-[10px] tracking-[0.3em] font-black uppercase animate-bounce">Warning: If failed, heart stops.</div>
        </div>
      </div>

      <style>{`
        @keyframes sand-storm {
          from { background-position: 0 0; }
          to { background-position: 2000px 1000px; }
        }
        .animate-sand-storm { 
          animation: sand-storm 60s linear infinite; 
        }
      `}</style>

    </div>
  );
};
