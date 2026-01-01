import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Activity, ScanLine, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)' },
    { id: 'g1', rank: 'A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)' },
    { id: 'g3', rank: 'B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)' },
  ];

  const handleGateEntry = (gateId) => {
    console.log("Entering Gate:", gateId);
    // هنا يمكنك إضافة منطق الدخول أو الانتقال
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

      <main className="relative z-10 px-6 space-y-40 mt-16">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group flex flex-col items-center max-w-sm mx-auto">
            
            {/* البوابة الدائرية (قابلة للضغط الآن) */}
            <div 
              onClick={() => handleGateEntry(gate.id)}
              className="relative w-72 h-72 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 active:scale-90 z-20"
              style={{ filter: `drop-shadow(${gate.aura})` }}
            >
              <div className={cn(
                "relative w-full h-full rounded-full overflow-hidden border-2 transition-colors",
                gate.color === 'red' ? "border-red-600/50 group-hover:border-red-500" : "border-purple-600/50 group-hover:border-purple-500"
              )}>
                <img 
                  src="/portal.gif" 
                  alt="Portal" 
                  className="w-full h-full object-cover scale-110 mix-blend-screen brightness-125 transition-all group-hover:brightness-150"
                />
                {/* تلميح بصري للدخول */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,black_100%)] opacity-80" />
              </div>

              {/* تأثير نص "TAP TO ENTER" يظهر عند التحويم */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white drop-shadow-2xl">Enter Gate</span>
              </div>
            </div>

            {/* كارد المعلومات - تم إنزاله للأسفل وإبعاده قليلاً */}
            <div className="relative w-full bg-black/60 border-2 border-slate-200/90 p-5 mt-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10">
              
              {/* ترويسة الرتبة */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="border border-slate-400/50 px-6 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <h2 className="text-[10px] font-black tracking-[0.3em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase">
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
                  <p className="text-base font-mono font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic">
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

                {/* ملاحظة تقنية */}
                <div className="mt-2 py-2 px-3 bg-white/5 border-l-2 border-white/20">
                  <p className="text-[9px] text-slate-500 font-bold italic leading-relaxed uppercase tracking-tighter">
                    Dimensional crack confirmed. Tap the portal above to initiate transition sequence.
                  </p>
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
