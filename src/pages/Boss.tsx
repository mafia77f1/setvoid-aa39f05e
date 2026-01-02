import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, ScanLine, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  // حالة للتحكم في أي كارد يظهر عند الضغط على البوابة
  const [selectedGate, setSelectedGate] = useState(null);

  const gates = [
    { id: 'g0', rank: 'S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)' },
    { id: 'g1', rank: 'A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)' },
    { id: 'g3', rank: 'B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)' },
  ];

  const handleEnterGate = (gateId) => {
    console.log("Initiating Dungeon Entry:", gateId);
    // منطق الانتقال للمرحلة التالية
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden">
      
      {/* خلفية النظام الثابتة */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(76,29,149,0.15),transparent_80%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
      </div>

      <header className="relative z-20 pt-16 pb-12 px-6 text-center border-b border-white/5">
        <h1 className="relative text-3xl font-black italic tracking-[0.3em] uppercase">
          <span className="text-white drop-shadow-[0_0_100px_rgba(255,255,255,0.5)]">Dungeon</span>
          <span className="block text-xs text-blue-400 mt-2 tracking-[0.5em] font-bold uppercase opacity-70">Gate Recognition System</span>
        </h1>
      </header>

      <main className="relative z-10 px-6 space-y-24 mt-16">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group flex flex-col items-center max-w-sm mx-auto">
            
            {/* البوابة الدائرية - عند الضغط تفتح الكارد */}
            <div 
              onClick={() => setSelectedGate(selectedGate === gate.id ? null : gate.id)}
              className={cn(
                "relative w-72 h-72 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 active:scale-90 z-20",
                selectedGate === gate.id ? "scale-110 brightness-150" : "brightness-100"
              )}
              style={{ filter: `drop-shadow(${gate.aura})` }}
            >
              <div className={cn(
                "relative w-full h-full rounded-full overflow-hidden border-2 transition-colors",
                gate.color === 'red' ? "border-red-600/50" : "border-purple-600/50"
              )}>
                <img 
                  src="/portal.gif" 
                  alt="Portal" 
                  className="w-full h-full object-cover scale-110 mix-blend-screen brightness-125"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,black_100%)] opacity-80" />
              </div>

              {/* نص إرشادي يختفي عند الاختيار */}
              {selectedGate !== gate.id && (
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                  <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white drop-shadow-2xl">Analyze Gate</span>
                </div>
              )}
            </div>

            {/* كارد المعلومات - يظهر فقط عند الضغط على البوابة */}
            {selectedGate === gate.id && (
              <div className="relative w-full bg-black/80 border-2 border-white/90 p-5 mt-10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-10 animate-in fade-in slide-in-from-top-4 duration-500 backdrop-blur-md">
                
                {/* ترويسة الرتبة */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="border border-white/50 px-6 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    <h2 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">
                      RANK: <span className={gate.color === 'red' ? "text-red-500" : "text-blue-400"}>{gate.rank}</span>
                    </h2>
                  </div>
                </div>

                {/* بيانات النظام */}
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Energy Density</p>
                    </div>
                    <p className="text-base font-mono font-bold text-white italic">{gate.energy} MP</p>
                  </div>

                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn("w-3.5 h-3.5", gate.color === 'red' ? "text-red-500" : "text-blue-400")} />
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Danger Level</p>
                    </div>
                    <p className={cn("text-xs font-black uppercase italic tracking-widest", gate.color === 'red' ? "text-red-500 animate-pulse" : "text-blue-400")}>
                      {gate.warning}
                    </p>
                  </div>

                  {/* زر الدخول (الذي طلبته) */}
                  <button 
                    onClick={() => handleEnterGate(gate.id)}
                    className="w-full mt-4 bg-white hover:bg-blue-500 hover:text-white text-black transition-all duration-300 py-3 flex items-center justify-center gap-3 group/btn"
                  >
                    <ScanLine className="w-4 h-4 group-hover/btn:animate-spin" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Enter Dungeon</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>

                  <p className="text-[8px] text-center text-slate-500 font-bold uppercase tracking-widest mt-2">
                    Final warning: Mana stabilization required
                  </p>
                </div>
              </div>
            )}

          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Boss;
