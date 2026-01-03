import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Trophy, Lock, Star, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const Achievements = () => {
  const { gameState } = useGameState();
  
  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked);
  const lockedAchievements = gameState.achievements.filter(a => !a.unlocked);

  // دمج القائمتين لعرض المحقق أولاً
  const allAchievements = [...unlockedAchievements, ...lockedAchievements];

  return (
    <div className="min-h-screen bg-[#020817] text-white p-4 font-sans selection:bg-blue-500/30 pb-28">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(30,58,138,0.2),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[size:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
      </div>

      <header className="relative z-10 flex flex-col items-center mb-12 mt-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-blue-500" />
          <h1 className="text-2xl font-black tracking-[0.2em] uppercase italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            Achievements
          </h1>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-blue-500" />
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-1 rounded-full backdrop-blur-sm">
          <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest flex items-center gap-2">
            <Trophy className="w-3 h-3" />
            System Progression: {unlockedAchievements.length} / {gameState.achievements.length}
          </p>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-20">
        {allAchievements.map((achievement) => (
          <div key={achievement.id} className={cn(
            "relative group transition-all duration-700",
            !achievement.unlocked && "grayscale opacity-40"
          )}>
            
            {/* Outer Glow Frame */}
            <div className={cn(
              "absolute -inset-[2px] blur-[2px] transition-opacity duration-500 opacity-50 group-hover:opacity-100",
              achievement.unlocked ? "bg-gradient-to-r from-blue-600 via-white to-blue-600" : "bg-slate-700"
            )} />
            
            <div className="relative bg-[#050b18] border-2 border-slate-200/90 p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              
              {/* Floating Header Tag */}
              <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 z-20">
                <div className="bg-slate-900 border border-slate-200/90 px-6 py-0.5 shadow-xl">
                  <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase italic">
                    {achievement.unlocked ? "Mission Cleared" : "Data Locked"}
                  </span>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="relative h-48 w-full overflow-hidden border-b border-white/10">
                {/* Achievement Image from Public */}
                <img 
                  src="/AchievementIcon.png" 
                  alt="Achievement" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-[#050b18]/40 to-transparent" />
                
                {/* Central Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 blur-xl bg-blue-500/40 animate-pulse" />
                    {achievement.unlocked ? (
                      <ShieldCheck className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] relative z-10" />
                    ) : (
                      <Lock className="w-16 h-16 text-slate-500 relative z-10" />
                    )}
                  </div>
                </div>
              </div>

              {/* Text Info Section */}
              <div className="p-5 space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] mb-1">
                    {achievement.unlocked ? achievement.name : "????? ??????"}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-[1px] w-8 bg-blue-500/40" />
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="h-[1px] w-8 bg-blue-500/40" />
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 p-3 rounded-sm">
                  <p className="text-[11px] text-slate-400 leading-relaxed text-center italic font-medium">
                    {achievement.unlocked 
                      ? achievement.description 
                      : "The system has restricted access to this information. Complete the hidden requirements to synchronize."}
                  </p>
                </div>

                {/* Bottom Status Bar */}
                <div className={cn(
                  "py-2 px-4 border text-center text-[10px] font-black tracking-[0.4em] uppercase transition-all",
                  achievement.unlocked 
                    ? "bg-blue-600/20 border-blue-400/50 text-blue-100 shadow-[inset_0_0_15px_rgba(59,130,246,0.3)]" 
                    : "bg-black/40 border-slate-800 text-slate-600"
                )}>
                  {achievement.unlocked ? "Claimed Rewards" : "Access Denied"}
                </div>
              </div>

              {/* Decorative Corners */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/30" />
            </div>
          </div>
        ))}
      </main>

      {/* System Footer Text */}
      <div className="mt-20 py-10 border-t border-blue-900/30 flex justify-center">
        <p className="text-[8px] font-mono text-blue-500/40 tracking-[0.5em] uppercase animate-pulse">
          Monitoring Player Growth...
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Achievements;
