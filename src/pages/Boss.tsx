import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Radio, ChevronRight, Activity, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: '0', name: boss?.name || 'Void Monarch', color: 'black', type: 'Calamity', energy: 'UNKNOWN', desc: 'The atmosphere is heavy. A presence that defies the laws of the system.' },
    { id: 'g1', rank: '1', name: 'Shadow Labyrinth', color: 'purple', type: 'Elite', energy: '98,000', desc: 'High-level magic detected. Multiple boss-class monsters inside.' },
    { id: 'g2', rank: '3', name: 'Inferno Raid', color: 'purple', type: 'Dungeon', energy: '65,000', desc: 'Volcanic environment. High fire resistance required.' },
    { id: 'g3', rank: '4', name: 'Ice Citadel', color: 'blue', type: 'Normal', energy: '22,000', desc: 'A common gate for mid-tier hunters.' },
    { id: 'g4', rank: '5', name: 'Orc Fortress', color: 'blue', type: 'Scouting', energy: '4,500', desc: 'Low level threat. Suitable for training.' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-3 font-sans selection:bg-purple-500/30 pb-24 overflow-x-hidden">
      
      {/* Background System FX */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <header className="relative z-10 flex justify-between items-end mb-10 px-2 pt-6">
        <div>
          <h1 className="text-3xl font-[1000] tracking-tighter italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            WORLD GATES
          </h1>
          <div className="flex items-center gap-2 text-purple-500">
            <div className="h-1 w-1 bg-purple-500 rounded-full animate-ping" />
            <span className="text-[9px] font-black tracking-[0.4em] uppercase">Mana Waves Detected</span>
          </div>
        </div>
        <div className="text-right border-r-2 border-purple-600 pr-3">
          <p className="text-[9px] font-bold text-slate-500 uppercase italic">Status</p>
          <p className="text-xs font-black text-white tracking-widest uppercase animate-pulse">Scanning...</p>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group">
            
            {/* Card Content - Market Style */}
            <div className="relative bg-[#0a0f1e] border-2 border-slate-200/90 p-5 shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.7)]">
              
              {/* Floating Header */}
              <div className="flex justify-center mb-6 mt-[-2rem]">
                <div className={cn(
                  "border border-slate-400/50 px-6 py-1 bg-[#020617] shadow-xl flex items-center gap-3",
                  gate.color === 'black' ? "border-white" : ""
                )}>
                  <div className={cn("w-2 h-2 rotate-45", gate.color === 'black' ? "bg-white shadow-[0_0_8px_white]" : gate.color === 'purple' ? "bg-purple-500" : "bg-blue-500")} />
                  <h2 className="text-[10px] font-black tracking-[0.2em] text-white uppercase italic">
                    {gate.type} GATE <span className="text-slate-500">INSTANCE</span>
                  </h2>
                </div>
              </div>

              {/* Layout Row */}
              <div className="flex gap-5">
                
                {/* Visual GATE Section (The Portal) */}
                <div className={cn(
                  "w-28 h-28 flex-shrink-0 relative overflow-hidden border border-white/10 shadow-inner bg-black",
                  gate.color === 'black' ? "rounded-full shadow-[0_0_25px_rgba(255,255,255,0.4)]" : "rounded-sm"
                )}>
                  {/* The Actual Magic Portal Visual */}
                  <div className={cn(
                    "absolute inset-[-50%] animate-[spin_10s_linear_infinite] blur-md opacity-80",
                    gate.color === 'black' ? "bg-[conic-gradient(from_0deg,transparent,#ffffff,transparent,#475569,#ffffff)]" :
                    gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,transparent,#a855f7,transparent,#4c1d95,#a855f7)]" :
                    "bg-[conic-gradient(from_0deg,transparent,#3b82f6,transparent,#1e3a8a,#3b82f6)]"
                  )} />
                  
                  {/* Vortex Core */}
                  <div className="absolute inset-[15%] bg-black rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center">
                     <div className={cn(
                       "w-full h-full rounded-full animate-pulse opacity-50",
                       gate.color === 'black' ? "bg-white/20" : gate.color === 'purple' ? "bg-purple-500/20" : "bg-blue-500/20"
                     )} />
                  </div>

                  {/* High-Tech Frame Corners */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40" />
                </div>

                {/* Data Column */}
                <div className="flex-1 flex flex-col justify-center space-y-3">
                  <div className="flex justify-between items-end border-b border-white/5 pb-1">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Gate Rank</span>
                    <span className={cn(
                      "text-2xl font-[1000] italic leading-none drop-shadow-lg",
                      gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-400" : "text-blue-400"
                    )}>
                      {gate.rank === '0' ? 'S' : gate.rank}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 p-2 border-r-2 border-purple-500">
                    <div>
                      <p className="text-[7px] font-bold text-slate-400 uppercase">Energy Output</p>
                      <p className="text-[11px] font-black tracking-widest uppercase text-white">{gate.energy}</p>
                    </div>
                    <Zap className={cn("w-4 h-4", gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-400" : "text-blue-400")} />
                  </div>
                </div>
              </div>

              {/* Description Panel */}
              <div className="mt-5 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-700" />
                <p className="pl-4 text-[10px] text-slate-400 leading-relaxed italic uppercase font-medium">
                  {gate.desc}
                </p>
              </div>

              {/* Action Button - Massive Style */}
              <button className={cn(
                "w-full mt-6 py-4 flex items-center justify-between px-6 transition-all active:scale-95 group overflow-hidden relative",
                gate.color === 'black' ? "bg-white text-black" : 
                gate.color === 'purple' ? "bg-purple-600/10 border border-purple-500 text-purple-400" : 
                "bg-blue-600/10 border border-blue-500 text-blue-400"
              )}>
                {/* Light reflection effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4" />
                  <span className="text-[11px] font-black tracking-[0.5em] uppercase italic">Deploy Hunter</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Boss;
