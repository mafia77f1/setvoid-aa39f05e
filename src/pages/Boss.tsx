import { useState } from 'react'; // أضفنا useState للتحكم في إظهار الكارد
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  // حالة لتخزين معرف البوابة التي تم الضغط عليها
  const [activeGate, setActiveGate] = useState(null);

  const gates = [
    { id: 'g0', rank: 'S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)' },
    { id: 'g1', rank: 'A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)' },
    { id: 'g3', rank: 'B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)' },
  ];

  const handleGateClick = (gateId) => {
    // إذا ضغط المستخدم على نفس البوابة المفتوحة، نقوم بإغلاقها، وإلا نفتح الجديدة
    setActiveGate(activeGate === gateId ? null : gateId);
    console.log("Gate Selected:", gateId);
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

      <main className="relative z-10 px-6 space-y-20 mt-16">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group flex flex-col items-center max-w-sm mx-auto">
            
            {/* البوابة الدائرية (عند الضغط تظهر المعلومات) */}
            <div 
              onClick={() => handleGateClick(gate.id)}
              className={cn(
                "relative w-72 h-72 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-105 active:scale-95 z-20",
                activeGate === gate.id ? "scale-110" : "scale-100 opacity-80 hover:opacity-100"
              )}
              style={{ filter: `drop-shadow(${gate.aura})` }}
            >
              <div className={cn(
                "relative w-full h-full rounded-full overflow-hidden border-2 transition-all duration-500",
                gate.color === 'red' ? "border-red-600/50" : "border-purple-600/50",
                activeGate === gate.id && "border-white ring-4 ring-white/20"
              )}>
                <img 
                  src="/portal.gif" 
                  alt="Portal" 
                  className="w-full h-full object-cover scale-110 mix-blend-screen brightness-125 transition-all group-hover:brightness-150"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,black_100%)] opacity-80" />
              </div>

              {/* نص إرشادي يختفي عند الفتح */}
              {!activeGate && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse">
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white shadow-black drop-shadow-lg">Analyze Gate</span>
                  <ChevronDown className="w-4 h-4 mt-1 opacity-50" />
                </div>
              )}
            </div>

            {/* كارد المعلومات - يظهر فقط إذا كانت هذه البوابة هي النشطة */}
            <div className={cn(
              "relative w-full transition-all duration-500 origin-top overflow-hidden z-10",
              activeGate === gate.id 
                ? "max-h-[500px] opacity-100 mt-8 translate-y-0" 
                : "max-h-0 opacity-0 mt-0 -translate-y-10"
            )}>
              <div className="bg-black/80 border-2 border-slate-200/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
                
                {/* ترويسة الرتبة */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="border border-slate-400/50 px-6 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
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
                    <p className="text-base font-mono font-bold text-white italic">
                      {gate.energy} <span className="text-[9px] opacity-40">MP</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn("w-3.5 h-3.5", gate.color === 'red' ? "text-red-500" : "text-blue-400")} />
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Danger Level</p>
                    </div>
                    <p className={cn(
                      "text-xs font-black uppercase italic tracking-widest",
                      gate.color === 'red' ? "text-red-500 animate-pulse" : "text-blue-400"
                    )}>
                      {gate.warning}
                    </p>
                  </div>

                  {/* زر الدخول النهائي */}
                  <button 
                    className="w-full py-3 mt-2 bg-white/5 border border-white/20 hover:bg-white/10 transition-colors group/btn"
                    onClick={(e) => {
                      e.stopPropagation(); // لمنع إغلاق الكارد عند الضغط على الزر
                      console.log("Proceeding to:", gate.id);
                    }}
                  >
                    <p className="text-[10px] text-white font-black italic uppercase tracking-[0.2em] group-hover/btn:text-blue-400">
                      Initiate Transition Sequence
                    </p>
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Boss;
