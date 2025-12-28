import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Skull, Zap, Radio, ChevronRight, Activity, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  // البوابات مصنفة حسب طلبك بالضبط
  const gates = [
    { id: 'g0', rank: '0', name: boss?.name || 'Void Monarch', color: 'black', type: 'Calamity', energy: 'MAXIMUM', desc: 'A gate that leads to the eternal void. Success rate is 0.01%.' },
    { id: 'g1', rank: '1', name: 'Shadow Labyrinth', color: 'purple', type: 'Elite', energy: '98,000', desc: 'High-level magic detected. Multiple boss-class monsters inside.' },
    { id: 'g2', rank: '3', name: 'Inferno Raid', color: 'purple', type: 'Dungeon', energy: '65,000', desc: 'Volcanic environment. High fire resistance required.' },
    { id: 'g3', rank: '4', name: 'Ice Citadel', color: 'blue', type: 'Normal', energy: '22,000', desc: 'A common gate for mid-tier hunters.' },
    { id: 'g4', rank: '5', name: 'Goblin Nest', color: 'blue', type: 'Scouting', energy: '4,500', desc: 'Low level threat. Suitable for training.' },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-purple-500/30 pb-24 overflow-x-hidden">
      {/* Background Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(88,28,235,0.1),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,4px_100%]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-10 border-b-2 border-slate-700/50 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            GATE RADAR
          </h1>
          <p className="text-[9px] font-bold text-purple-500 tracking-[0.3em] uppercase opacity-80">System Detection Active</p>
        </div>
        <div className="bg-purple-950/30 border border-purple-500/50 px-4 py-1.5 flex items-center gap-3">
          <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="font-mono font-black text-white text-xs tracking-widest italic">
            {gates.length} GATES FOUND
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-10">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group cursor-pointer active:scale-95 transition-transform duration-200">
            {/* التوهج الخلفي عند الحوم */}
            <div className={cn(
              "absolute -inset-1 blur-md opacity-0 group-hover:opacity-40 transition duration-500",
              gate.color === 'black' ? "bg-white" : gate.color === 'purple' ? "bg-purple-600" : "bg-blue-600"
            )} />
            
            <div className="relative bg-black/80 border-2 border-slate-200/90 p-4 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
              
              {/* Header Badge - Market Style */}
              <div className="flex justify-center mb-5 mt-[-1.5rem]">
                <div className={cn(
                  "border border-slate-400/50 px-6 py-0.5 bg-slate-900/95 shadow-[0_0_15px_rgba(255,255,255,0.1)]",
                  gate.color === 'black' ? "border-white" : ""
                )}>
                  <h2 className="text-[10px] font-black tracking-[0.2em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase italic">
                    GATE TYPE: <span className={cn(
                      gate.color === 'black' ? "text-white underline" : 
                      gate.color === 'purple' ? "text-purple-400" : "text-blue-400"
                    )}>{gate.type}</span>
                  </h2>
                </div>
              </div>

              {/* Main Info Row (Horizontal) */}
              <div className="flex gap-4">
                {/* Portal Icon Section */}
                <div className={cn(
                  "w-24 h-24 border border-slate-600 flex items-center justify-center relative flex-shrink-0 overflow-hidden",
                  gate.color === 'black' ? "bg-slate-900 shadow-[inset_0_0_20px_white]" : "bg-black"
                )}>
                  {/* الدوامة المتحركة */}
                  <div className={cn(
                    "absolute inset-0 animate-spin-slow opacity-30 blur-[2px]",
                    gate.color === 'black' ? "bg-[conic-gradient(from_0deg,transparent,white,transparent,white)]" :
                    gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,transparent,#a855f7,transparent,#a855f7)]" :
                    "bg-[conic-gradient(from_0deg,transparent,#3b82f6,transparent,#3b82f6)]"
                  )} />
                  
                  <div className="z-10 relative">
                    {gate.color === 'black' ? (
                        <ShieldAlert className="w-10 h-10 text-white drop-shadow-[0_0_10px_white]" />
                    ) : (
                        <Skull className={cn("w-10 h-10", gate.color === 'purple' ? "text-purple-400 shadow-purple-500" : "text-blue-400")} />
                    )}
                  </div>

                  {/* Corners */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
                </div>

                {/* Vertical Stats Section */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-center border-b border-white/10 pb-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter italic">Rank</p>
                    <p className={cn(
                      "text-xl font-black italic drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]",
                      gate.color === 'black' ? "text-white underline" : 
                      gate.color === 'purple' ? "text-purple-400" : "text-blue-400"
                    )}>
                      {gate.rank === '0' ? '???' : gate.rank}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-white/10 pb-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter italic">Mana</p>
                    <p className="text-xs font-bold text-white tracking-widest uppercase">
                        {gate.energy} <span className="text-[8px] text-slate-500">m.p</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter italic">Status</p>
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-[9px] font-black text-green-500 uppercase">Open</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Box */}
              <div className="mt-4 bg-slate-950/50 p-2 border-l-2 border-slate-500">
                <p className="text-[10px] text-slate-300 font-medium italic leading-relaxed uppercase tracking-tight">
                  {gate.desc}
                </p>
              </div>

              {/* Enter Button - Market Purchase Style */}
              <button className={cn(
                "w-full mt-4 py-3 flex items-center justify-center gap-4 transition-all active:scale-[0.98] border shadow-lg",
                gate.color === 'black' ? "bg-white text-black font-black border-white hover:bg-slate-200 shadow-white/10" :
                gate.color === 'purple' ? "bg-purple-900/20 text-purple-400 border-purple-500/50 hover:bg-purple-900/40" :
                "bg-blue-900/20 text-blue-400 border-blue-500/50 hover:bg-blue-900/40"
              )}>
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase">Enter Dungeon</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg) scale(2); }
          to { transform: rotate(360deg) scale(2); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Boss;
