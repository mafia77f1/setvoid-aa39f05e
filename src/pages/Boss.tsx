import { useGameState } from '@/hooks/useGameState';
import { BossBattleCard } from '@/components/BossBattleCard';
import { BottomNav } from '@/components/BottomNav';
import { RefreshCw, Skull, Zap, Target, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState, resetBoss } = useGameState();
  const boss = gameState.currentBoss;

  const handleNewBoss = () => {
    resetBoss();
    toast({
      title: 'SYSTEM: GATE MANIFESTED',
      description: 'A new Dungeon Gate has opened in your vicinity.',
    });
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-4 font-sans selection:bg-purple-500/30 pb-24 overflow-x-hidden">
      {/* Solo Leveling Gate Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(88,28,235,0.15),transparent_70%)]" />
        {/* Magic Particles Simulation */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <header className="relative z-10 flex flex-col items-center mb-8 pt-6">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex items-center gap-4 mb-2 bg-black/40 px-6 py-2 border-y border-purple-500/30">
            <Zap className="w-5 h-5 text-purple-400 animate-pulse" />
            <h1 className="text-3xl font-black tracking-[0.2em] uppercase italic bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Gate Raid
            </h1>
            <Target className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
            <span className="h-[2px] w-8 bg-purple-600"></span>
            <p className="text-[9px] font-bold text-purple-400 tracking-[0.5em] uppercase">
              Current Instance: Dungeon
            </p>
            <span className="h-[2px] w-8 bg-purple-600"></span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-8">
        
        {/* Gate Portal Visualization */}
        <div className="relative group cursor-default">
          {/* Circular Glow behind the card to mimic a Gate */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] animate-pulse" />
          
          {boss ? (
            <div className="relative animate-in fade-in slide-in-from-top-10 duration-1000">
               {/* Rank Tag (Stylized like Solo Leveling) */}
               <div className="absolute -top-4 -left-2 z-20 bg-red-600 text-white px-4 py-1 skew-x-[-20deg] font-black text-xl border-2 border-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  RANK S
               </div>
               <BossBattleCard boss={boss} />
            </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-purple-500/20 rounded-xl flex items-center justify-center">
                <p className="text-slate-500 animate-pulse uppercase tracking-widest text-xs">No Gate Detected</p>
            </div>
          )}

          {boss?.defeated && (
            <div className="mt-8 animate-in zoom-in duration-500">
              <button 
                onClick={handleNewBoss} 
                className="group relative w-full py-5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-purple-600 to-purple-900 transition-all group-hover:scale-105" />
                <div className="relative flex items-center justify-center gap-4 text-white font-black text-sm tracking-[0.4em] uppercase">
                  <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-700" />
                  Find New Gate
                </div>
                {/* Border accents */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30" />
              </button>
            </div>
          )}
        </div>

        {/* System Analysis - Solo Leveling Style */}
        <div className="relative">
            {/* Background Panel with "Glass" effect */}
            <div className="bg-[#0a0c14]/80 border border-purple-500/30 backdrop-blur-md p-6 relative overflow-hidden">
                {/* Scanner Line Animation */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-[scan_3s_linear_infinite]" />
                
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-4 h-4 text-purple-500" />
                    <h2 className="text-[11px] font-black tracking-widest text-purple-100 uppercase italic">
                      System Analysis Report
                    </h2>
                </div>

                <div className="space-y-5">
                    {[
                        { label: "OBJECTIVE", desc: "Clear quests to weaken the magical core of the boss." },
                        { label: "THREAT LEVEL", desc: "Boss HP reduces with every mission completion." },
                        { label: "REWARD", desc: "Defeating the boss permanently evolves your stats." }
                    ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                            <div className="flex flex-col items-center">
                                <div className="w-2 h-2 bg-purple-500 rotate-45" />
                                <div className="w-[1px] h-10 bg-gradient-to-b from-purple-500 to-transparent" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-purple-400 tracking-tighter mb-1 uppercase">{item.label}</p>
                                <p className="text-[12px] text-slate-300 font-medium leading-tight uppercase tracking-tight">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Decorative UI elements */}
                <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-1 h-1 bg-purple-500"></div>
                    <div className="w-4 h-1 bg-purple-500/30"></div>
                </div>
            </div>
            
            {/* Sub-labels */}
            <div className="flex justify-between mt-2 px-1">
                <p className="text-[8px] text-purple-500/50 font-mono tracking-tighter">ID: GATE-4492-B</p>
                <p className="text-[8px] text-purple-500/50 font-mono tracking-tighter">STATUS: ACTIVE</p>
            </div>
        </div>
      </main>

      <BottomNav />

      {/* Global CSS for the scanner animation */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Boss;
