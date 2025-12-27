import { useGameState } from '@/hooks/useGameState';
import { BossBattleCard } from '@/components/BossBattleCard';
import { BottomNav } from '@/components/BottomNav';
import { RefreshCw, Skull, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState, resetBoss } = useGameState();
  const boss = gameState.currentBoss;

  const handleNewBoss = () => {
    resetBoss();
    toast({
      title: 'SYSTEM: NEW INSTANCE',
      description: 'A new Dungeon Boss has appeared.',
    });
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-red-500/30 pb-24">
      {/* Background Overlay with Red Hint for Boss (Optional) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(185,28,28,0.1),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <header className="relative z-10 flex flex-col items-center mb-10 pt-4">
        <div className="flex items-center gap-3 mb-2">
          <Skull className="w-6 h-6 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <h1 className="text-2xl font-black tracking-[0.3em] uppercase italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)]">
            Boss Raid
          </h1>
          <Skull className="w-6 h-6 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        </div>
        <div className="h-[1px] w-full max-w-[200px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent mb-2" />
        <p className="text-[10px] font-bold text-red-400 tracking-[0.4em] uppercase opacity-80">
          Eliminate the Negative Habit
        </p>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-8">
        {/* Boss Display Window */}
        <div className="relative">
          {boss && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
               <BossBattleCard boss={boss} />
            </div>
          )}

          {boss?.defeated && (
            <div className="mt-8 animate-in slide-in-from-bottom-4 duration-700">
              <button 
                onClick={handleNewBoss} 
                className="w-full py-4 bg-red-600/10 hover:bg-red-600/20 border-2 border-red-500/50 text-white font-black text-xs tracking-[0.3em] uppercase transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] flex items-center justify-center gap-3 active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                Summon Next Boss
              </button>
            </div>
          )}
        </div>

        {/* System Tips Panel - Matching Market Style */}
        <div className="relative bg-black/60 border-2 border-slate-200/90 p-5 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
          <div className="flex justify-center mb-6 mt-[-2rem]">
            <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 flex items-center gap-2">
              <ShieldAlert className="w-3 h-3 text-white shadow-[0_0_5px_white]" />
              <h2 className="text-[9px] font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase italic">
                Raid Instructions
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 group">
              <div className="mt-1 w-1.5 h-1.5 bg-white shadow-[0_0_5px_white] rotate-45 shrink-0" />
              <p className="text-[11px] text-slate-300 font-bold tracking-tight leading-relaxed group-hover:text-white transition-colors">
                COMPLETE ASSIGNED QUESTS TO INFLICT <span className="text-white drop-shadow-[0_0_5px_white]">CRITICAL DAMAGE</span> TO THE BOSS.
              </p>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="mt-1 w-1.5 h-1.5 bg-white shadow-[0_0_5px_white] rotate-45 shrink-0" />
              <p className="text-[11px] text-slate-300 font-bold tracking-tight leading-relaxed group-hover:text-white transition-colors">
                EACH MISSION CLEARED DECREASES THE BOSS'S <span className="text-white drop-shadow-[0_0_5px_white]">HP BAR</span>.
              </p>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="mt-1 w-1.5 h-1.5 bg-white shadow-[0_0_5px_white] rotate-45 shrink-0" />
              <p className="text-[11px] text-slate-300 font-bold tracking-tight leading-relaxed group-hover:text-white transition-colors">
                DEFEAT THE BOSS TO PERMANENTLY OVERCOME YOUR <span className="text-white drop-shadow-[0_0_5px_white]">NEGATIVE TRAITS</span>.
              </p>
            </div>
          </div>

          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Boss;
