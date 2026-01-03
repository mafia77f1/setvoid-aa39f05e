import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Trophy, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Achievements = () => {
  const { gameState } = useGameState();
  
  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked);
  const lockedAchievements = gameState.achievements.filter(a => !a.unlocked);

  // تعريف ألوان الرتب لتسهيل التحكم بها
  const rankColors = {
    'S': { border: 'border-yellow-500/80', shadow: 'shadow-[0_0_25px_rgba(234,179,8,0.3)]', text: 'text-yellow-400', glow: 'bg-yellow-500/20' },
    'A': { border: 'border-purple-500/80', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]', text: 'text-purple-400', glow: 'bg-purple-500/20' },
    'B': { border: 'border-blue-500/80', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]', text: 'text-blue-400', glow: 'bg-blue-500/20' },
    'C': { border: 'border-green-500/80', shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]', text: 'text-green-400', glow: 'bg-green-500/20' },
    'D': { border: 'border-slate-400/80', shadow: 'shadow-[0_0_15px_rgba(148,163,184,0.2)]', text: 'text-slate-300', glow: 'bg-slate-500/10' },
    'E': { border: 'border-slate-600/50', shadow: 'shadow-none', text: 'text-slate-500', glow: 'bg-transparent' },
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-10 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
          System Achievements
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">
            {unlockedAchievements.length}/{gameState.achievements.length}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-16">
        {[...unlockedAchievements, ...lockedAchievements].map((achievement) => {
          // استخراج الرتبة وتحديد الألوان (افتراضياً E إذا لم توجد)
          const rank = achievement.rarity || 'E';
          const style = rankColors[rank as keyof typeof rankColors] || rankColors.E;

          return (
            <div key={achievement.id} className={cn(
              "relative group transition-all duration-500",
              !achievement.unlocked && "opacity-60 grayscale"
            )}>
              {/* الهالة الخلفية بناءً على الرتبة */}
              <div className={cn(
                "absolute -inset-1 blur-md opacity-0 group-hover:opacity-100 transition duration-500",
                style.glow
              )} />
              
              {/* الكارد الرئيسي مع تغيير الحدود والظل حسب الرتبة */}
              <div className={cn(
                "relative bg-black/60 border-2 p-5 transition-colors duration-500",
                achievement.unlocked ? style.border : "border-slate-800",
                achievement.unlocked ? style.shadow : "shadow-none"
              )}>
                
                <div className="flex justify-center mb-6 mt-[-1.8rem]">
                  <div className={cn(
                    "border px-6 py-1 bg-slate-900/90",
                    achievement.unlocked ? style.border : "border-slate-700/50"
                  )}>
                    <h2 className={cn(
                      "text-[10px] font-black tracking-widest uppercase italic",
                      achievement.unlocked ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-slate-500"
                    )}>
                      {achievement.unlocked ? "Mission Cleared" : "Data Restricted"}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-24 h-24 border flex items-center justify-center bg-black/40 relative flex-shrink-0 overflow-hidden",
                      achievement.unlocked ? style.border : "border-slate-700/50"
                    )}>
                      {achievement.unlocked ? (
                        <img 
                          src="/AchievementIcon.png" 
                          alt="Achievement Icon" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="relative flex items-center justify-center w-full h-full bg-slate-900/50">
                          <Lock className="w-8 h-8 text-slate-700" />
                          <img 
                            src="/AchievementIcon.png" 
                            alt="Locked" 
                            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
                          />
                        </div>
                      )}
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/70" />
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/70" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="relative">
                        <p className="text-[8px] text-blue-400 font-black uppercase tracking-[0.2em] mb-1">Title</p>
                        <h3 className="text-sm font-black text-white italic uppercase tracking-tight leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                          {achievement.unlocked ? achievement.name : "????? ????"}
                        </h3>
                      </div>
                      
                      <div className={cn("h-[1px] bg-gradient-to-r from-blue-500/40 to-transparent w-full")} />
                      
                      <div className="flex justify-between items-center">
                        <p className="text-[9px] text-slate-500 uppercase font-bold">Rarity:</p>
                        <p className={cn("text-[10px] font-bold italic uppercase", achievement.unlocked ? style.text : "text-slate-600")}>
                          {rank}-Rank
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-3 border-y border-slate-800/50 bg-white/[0.02] px-4">
                    <p className="text-[11px] text-slate-300 italic leading-relaxed text-center">
                      {achievement.unlocked 
                        ? achievement.description 
                        : "The system has hidden the details for this trial."}
                    </p>
                  </div>

                  <div className={cn(
                    "w-full py-1.5 border text-center text-[9px] font-black tracking-[0.4em] uppercase transition-colors",
                    achievement.unlocked 
                      ? `${style.border} bg-blue-600/10 text-blue-200` 
                      : "bg-black/40 border-slate-900 text-slate-700"
                  )}>
                    {achievement.unlocked ? "Claimed" : "Locked"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
};

export default Achievements;
