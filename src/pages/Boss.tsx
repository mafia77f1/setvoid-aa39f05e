import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Skull, Zap, AlertTriangle, Radio, ChevronRight, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  // تعريف بيانات البوابات حسب طلبك (الترتيب اللوني والرتب)
  const gates = [
    { id: 'gate-0', rank: '0', name: boss?.name || 'Void Monarch', color: 'black', label: 'EXTINCTION LEVEL', mana: '?????' },
    { id: 'gate-1', rank: '1', name: 'Shadow Dungeon', color: 'purple', label: 'HIGH-RANK', mana: '95,400' },
    { id: 'gate-2', rank: '3', name: 'Inferno Gate', color: 'purple', label: 'ELITE', mana: '72,100' },
    { id: 'gate-3', rank: '4', name: 'Frozen Labyrinth', color: 'blue', label: 'NORMAL', mana: '24,000' },
    { id: 'gate-4', rank: '5', name: 'Orc Fortress', color: 'blue', label: 'SCOUTING', mana: '8,200' },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white p-4 pb-32 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* Background Overlay - Magic Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <header className="relative z-10 pt-10 mb-12 flex flex-col items-center">
        <div className="relative inline-block">
          <h1 className="text-4xl font-[900] tracking-[0.2em] uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-400 to-slate-700">
            Gate Radar
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-purple-500">
          <Radio className="w-3 h-3 animate-ping" />
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Searching for Mana Fluctuations...</span>
        </div>
      </header>

      <main className="relative z-10 max-w-xl mx-auto space-y-12">
        {gates.map((gate) => (
          <div key={gate.id} className="group relative">
            
            {/* Rank Badge - Extreme Style */}
            <div className={cn(
              "absolute -top-4 left-4 z-20 px-4 py-1 font-black italic text-xs tracking-tighter border-2 skew-x-[-15deg] shadow-lg",
              gate.color === 'black' ? "bg-white text-black border-slate-400" :
              gate.color === 'purple' ? "bg-purple-600 text-white border-purple-400" :
              "bg-blue-600 text-white border-blue-400"
            )}>
              RANK {gate.rank}
            </div>

            {/* The Gate Card */}
            <div className={cn(
              "relative h-44 w-full flex items-center rounded-sm border-r-4 transition-all duration-500 group-hover:scale-[1.03] overflow-hidden bg-black/80",
              gate.color === 'black' ? "border-white shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]" :
              gate.color === 'purple' ? "border-purple-600 shadow-[0_0_40px_-10px_rgba(147,51,234,0.3)]" :
              "border-blue-600 shadow-[0_0_40px_-10px_rgba(37,99,235,0.3)]"
            )}>
              
              {/* PORTAL SECTION (Left Side) */}
              <div className="relative w-44 h-full flex-shrink-0 bg-black overflow-hidden group">
                {/* Visual Vortex */}
                <div className={cn(
                  "absolute inset-0 animate-spin-slow opacity-70 scale-150 blur-sm",
                  gate.color === 'black' ? "bg-[conic-gradient(from_0deg,transparent,#ffffff,transparent,#475569)]" :
                  gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,transparent,#a855f7,transparent,#4c1d95)]" :
                  "bg-[conic-gradient(from_0deg,transparent,#3b82f6,transparent,#1e3a8a)]"
                )} style={{ animationDuration: '8s' }}></div>
                
                {/* Center of Portal */}
                <div className="absolute inset-4 rounded-full bg-black shadow-inner flex items-center justify-center">
                    {gate.color === 'black' ? (
                        <AlertTriangle className="w-12 h-12 text-white animate-pulse" />
                    ) : (
                        <Skull className={cn("w-12 h-12", gate.color === 'purple' ? "text-purple-400" : "text-blue-400")} />
                    )}
                </div>
              </div>

              {/* DATA SECTION (Right Side) */}
              <div className="flex-grow p-5 relative overflow-hidden">
                {/* Background Text Overlay */}
                <div className="absolute -right-2 -bottom-4 opacity-[0.03] rotate-[-12deg]">
                  <Flame size={120} strokeWidth={4} />
                </div>

                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h2 className={cn(
                      "text-[9px] font-black tracking-[0.3em] uppercase mb-1",
                      gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-400" : "text-blue-400"
                    )}>
                      {gate.label} DETECTED
                    </h2>
                    <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:tracking-widest transition-all duration-700">
                      {gate.name}
                    </h3>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            <span className="text-[10px] font-mono text-slate-400 tracking-tighter">MAGICAL ENERGY: {gate.mana}</span>
                        </div>
                        <div className="w-32 h-[3px] bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className={cn("h-full animate-pulse", gate.color === 'black' ? "bg-white" : gate.color === 'purple' ? "bg-purple-500" : "bg-blue-500")} 
                                style={{ width: gate.rank === '0' ? '100%' : gate.rank === '1' ? '80%' : '40%' }}
                            />
                        </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>

              {/* Scanline Animation */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 to-transparent h-10 w-full animate-[scan_2s_linear_infinite]"></div>
            </div>
          </div>
        ))}
      </main>

      <BottomNav />

      {/* Tailwind Style Enhancements */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg) scale(1.5); }
          to { transform: rotate(360deg) scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default Boss;
