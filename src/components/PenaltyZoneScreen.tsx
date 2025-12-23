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
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans select-none flex flex-col items-center">
      
      {/* 1. الخلفية الدرامية (Mana Void) */}
      <div className="absolute inset-0 z-0 h-[80vh] bg-gradient-to-b from-[#0a0212] via-[#120626] to-black">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.15)_0%,transparent_60%)] animate-pulse" />
      </div>

      {/* 2. حاوية العداد (The System Interface) */}
      <div className="relative z-50 mt-24 w-full max-w-2xl px-4" style={{ perspective: '1000px' }}>
        <div className="relative transform rotateX-10 border-y border-purple-500/20 bg-gradient-to-r from-transparent via-purple-900/10 to-transparent py-10">
          
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black border border-purple-500 px-4 py-0.5 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <span className="text-[10px] font-bold text-purple-400 tracking-[0.5em] uppercase">
              Warning
            </span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="text-purple-400/60 text-xs font-bold tracking-[0.4em] mb-4 uppercase italic">
              Penalty Quest: Survive the Void
            </div>
            
            <div className="flex items-baseline gap-3 text-7xl md:text-9xl font-black italic tracking-tighter">
              <span className="text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">{t.h}</span>
              <span className="text-purple-600 animate-pulse">:</span>
              <span className="text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">{t.m}</span>
              <span className="text-purple-600 animate-pulse">:</span>
              <span className="text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">{t.sec}</span>
            </div>

            <div className="w-64 h-[2px] bg-purple-900/30 mt-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-purple-500 animate-scan shadow-[0_0_10px_#a855f7]" />
            </div>
          </div>

          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50" />
          <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50" />
        </div>

        <div className="text-center mt-8 space-y-2">
          <p className="text-purple-300/50 text-[10px] tracking-[0.2em] font-medium uppercase animate-bounce">
            [ Time remaining until execution ]
          </p>
        </div>
      </div>

      {/* 3. المنصة السفلية العريضة (The Heavy Platform) */}
      <div className="absolute bottom-0 left-0 right-0 z-40 h-[22vh] flex flex-col items-center">
        
        {/* سطح المنصة العلوي مع منظور مائل */}
        <div 
          className="w-full h-16 bg-gradient-to-t from-[#0a0a0a] to-[#1a1a1a] border-t border-purple-500/30" 
          style={{ transform: 'perspective(500px) rotateX(45deg)', transformOrigin: 'bottom' }}
        />

        {/* جسم المنصة الرئيسي والضخم */}
        <div className="w-full flex-1 bg-[#050505] border-t-2 border-purple-900/40 relative overflow-hidden">
          
          {/* توهج ضوئي منعكس من العداد */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[3px] bg-purple-500/20 blur-md" />
          
          {/* علامات ميكانيكية جانبية */}
          <div className="flex justify-between px-12 pt-8 opacity-20">
            <div className="h-1.5 w-24 bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            <div className="h-1.5 w-24 bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          </div>

          {/* نص النظام الخلفي الضخم */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="text-[120px] font-black text-white/[0.02] tracking-tighter uppercase italic select-none">
                Void System
             </div>
          </div>

          {/* خط أحمر خافت جداً للتحذير النهائي */}
          <div className="absolute bottom-4 left-0 right-0 h-[1px] bg-red-900/10" />
        </div>

        {/* ظل سفلي عميق */}
        <div className="w-full h-4 bg-black" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@1,900&family=Rajdhani:wght@500;700&display=swap');
        
        .font-sans { font-family: 'Rajdhani', sans-serif; }
        .font-black { font-family: 'Exo 2', sans-serif; }

        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan {
          animation: scan 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .rotateX-10 {
          transform: rotateX(15deg);
          transform-style: preserve-3d;
        }
      `}</style>

    </div>
  );
};
