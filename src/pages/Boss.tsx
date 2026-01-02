import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, ScanLine, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const [enteringGate, setEnteringGate] = useState(null);

  const gates = [
    { id: 'g0', rank: 'S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)' },
    { id: 'g1', rank: 'A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)' },
    { id: 'g3', rank: 'B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)' },
  ];

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans pb-40 overflow-x-hidden">
      
      {/* الخلفية */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(76,29,149,0.15),transparent_80%)]" />
      </div>

      <header className="relative z-20 pt-16 pb-12 px-6 text-center border-b border-white/5">
        <h1 className="relative text-3xl font-black italic tracking-[0.3em] uppercase">
          <span className="text-white drop-shadow-[0_0_100px_rgba(255,255,255,0.5)]">Dungeon</span>
          <span className="block text-xs text-blue-400 mt-2 tracking-[0.5em] font-bold uppercase opacity-70">Gate Recognition System</span>
        </h1>
      </header>

      <main className="relative z-10 px-6 space-y-32 mt-16">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group flex flex-col items-center max-w-sm mx-auto">
            
            {/* 1. البوابة (ثابتة) */}
            <div 
              className="relative w-72 h-72 flex items-center justify-center z-20 transition-transform duration-700 group-hover:scale-105"
              style={{ filter: `drop-shadow(${gate.aura})` }}
            >
              <div className={cn(
                "relative w-full h-full rounded-full overflow-hidden border-2",
                gate.color === 'red' ? "border-red-600/50" : "border-purple-600/50"
              )}>
                <img src="/portal.gif" alt="Portal" className="w-full h-full object-cover mix-blend-screen brightness-125" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,black_90%)]" />
              </div>
            </div>

            {/* 2. كارد المعلومات (ثابت - من الكود رقم 1) */}
            <div 
              onClick={() => setEnteringGate(gate.id)}
              className="relative w-full bg-black/60 border-2 border-slate-200/90 p-5 mt-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 cursor-pointer hover:border-white transition-colors group"
            >
              {/* رتبة البوابة */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="border border-slate-400/50 px-6 py-1 bg-slate-900">
                  <h2 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">
                    RANK: <span className={gate.color === 'red' ? "text-red-500" : "text-blue-400"}>{gate.rank}</span>
                  </h2>
                </div>
              </div>

              {/* بيانات الطاقة والخطر */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <p className="text-[10px] text-slate-400 uppercase font-black">Energy Density</p>
                  </div>
                  <p className="text-base font-mono font-bold text-white italic">{gate.energy} MP</p>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={cn("w-3.5 h-3.5", gate.color === 'red' ? "text-red-500" : "text-blue-400")} />
                    <p className="text-[10px] text-slate-400 uppercase font-black">Danger Level</p>
                  </div>
                  <p className={cn("text-xs font-black uppercase italic", gate.color === 'red' ? "text-red-500 animate-pulse" : "text-blue-400")}>
                    {gate.warning}
                  </p>
                </div>

                {/* نص "اضغط للدخول" يظهر عند التحويم */}
                <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-bold text-blue-400 animate-bounce opacity-0 group-hover:opacity-100 transition-opacity">
                  <ScanLine className="w-3 h-3" />
                  TAP TO INITIATE SEQUENCE
                </div>
              </div>

              {/* 3. شاشة تأكيد الدخول (تظهر فقط عند الضغط على الكارد) */}
              {enteringGate === gate.id && (
                <div className="absolute inset-0 bg-blue-600/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-300">
                  <ShieldAlert className="w-12 h-12 text-white mb-2 animate-pulse" />
                  <h3 className="text-xl font-black italic tracking-tighter mb-1">WARNING!</h3>
                  <p className="text-[10px] leading-tight mb-4 font-bold">DIMENSIONAL TRAVEL MAY CAUSE SEVERE MANA DEPLETION. PROCEED?</p>
                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEnteringGate(null); }}
                      className="flex-1 py-2 bg-black/40 text-[10px] font-black hover:bg-black/60 transition-colors"
                    >
                      ABORT
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); console.log("Gate Entered:", gate.id); }}
                      className="flex-1 py-2 bg-white text-black text-[10px] font-black hover:bg-slate-200 transition-colors"
                    >
                      CONFIRM
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Boss;
