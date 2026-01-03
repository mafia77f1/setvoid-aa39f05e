import { useGameState } from '@/hooks/useGameState';
import { AchievementBadge } from '@/components/AchievementBadge';
import { BottomNav } from '@/components/BottomNav';
import { Trophy, Shield, Star, Zap, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Achievements = () => {
  const { gameState } = useGameState();
  
  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked);
  const lockedAchievements = gameState.achievements.filter(a => !a.unlocked);

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      {/* تأثيرات الخلفية التقنية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-10 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
          Player Achievements
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">
            {unlockedAchievements.length}/{gameState.achievements.length}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-16">
        {/* نستخدم نفس ماب المتجر لعرض الإنجازات */}
        {[...unlockedAchievements, ...lockedAchievements].map((achievement) => (
          <div key={achievement.id} className={cn(
            "relative group transition-all duration-500",
            !achievement.unlocked && "opacity-60 grayscale-[0.8]"
          )}>
            {/* التوهج الخلفي عند الحوم */}
            <div className="absolute -inset-0.5 bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative bg-black/60 border-2 border-slate-200/90 p-5 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
              
              {/* ترويسة الكارد - نفس سلك المتجر بالضبط */}
              <div className="flex justify-center mb-6 mt-[-1.8rem]">
                <div className={cn(
                  "border px-6 py-1 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]",
                  achievement.unlocked ? "border-slate-400/80" : "border-slate-700/50"
                )}>
                  <h2 className="text-xs font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase">
                    {achievement.unlocked ? "ACHIEVEMENT: UNLOCKED" : "LOCKED STATUS"}
                  </h2>
                </div>
              </div>

              {/* محتوى الكارد المُنظم */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-6">
                  {/* أيقونة الإنجاز ببرواز فخم */}
                  <div className="w-20 h-20 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0 overflow-hidden">
                    {achievement.unlocked ? (
                      <div className="relative z-10 scale-125">
                         <AchievementBadge achievement={achievement} />
                      </div>
                    ) : (
                      <Lock className="w-8 h-8 text-slate-700" />
                    )}
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white" />
                  </div>

                  {/* معلومات الإنجاز - نصوص واضحة وغير متداخلة */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-[9px] text-blue-400 uppercase font-bold tracking-[0.2em] mb-1">Title Name</p>
                      <h3 className="text-base font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic uppercase leading-none">
                        {achievement.unlocked ? achievement.name : "Locked Achievement"}
                      </h3>
                    </div>
                    
                    <div className="h-[1px] bg-white/10 w-full" />
                    
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Rarity</p>
                      <p className="text-[10px] font-bold text-yellow-500 uppercase italic">S-Rank Task</p>
                    </div>
                  </div>
                </div>

                {/* الوصف - مساحة كافية للنص */}
                <div className="py-3 border-y border-slate-700/50 bg-white/[0.02] px-2">
                  <p className="text-[11px] text-slate-300 italic leading-relaxed text-center">
                    {achievement.unlocked 
                      ? achievement.description 
                      : "The details of this achievement are hidden until the requirements are met."}
                  </p>
                </div>

                {/* الحالة - زر شكلي يشبه زر الشراء */}
                <div className={cn(
                  "w-full py-2 border text-center text-[10px] font-bold tracking-[0.3em] uppercase transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                  achievement.unlocked 
                    ? "bg-blue-500/20 border-blue-400/50 text-blue-300" 
                    : "bg-red-900/10 border-red-900/40 text-red-900/60"
                )}>
                  {achievement.unlocked ? "Claimed Reward" : "Locked Trial"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* رسالة النظام في الأسفل */}
      <div className="mt-12 text-center opacity-40">
        <p className="text-[9px] font-mono tracking-widest uppercase">
          [ End of Achievements List ]
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Achievements;
