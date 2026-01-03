import { useGameState } from '@/hooks/useGameState';
import { AchievementBadge } from '@/components/AchievementBadge';
import { BottomNav } from '@/components/BottomNav';
import { Trophy, Lock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const Achievements = () => {
  const { gameState } = useGameState();
  
  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked);
  const lockedAchievements = gameState.achievements.filter(a => !a.unlocked);

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      {/* تأثيرات الخلفية التقنية المستوحاة من المتجر */}
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
        {[...unlockedAchievements, ...lockedAchievements].map((achievement) => (
          <div key={achievement.id} className={cn(
            "relative group transition-all duration-500",
            !achievement.unlocked && "opacity-60 grayscale-[0.8]"
          )}>
            {/* التوهج الخلفي عند التحويم */}
            <div className="absolute -inset-0.5 bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative bg-black/60 border-2 border-slate-200/90 p-5 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
              
              {/* ترويسة الكارد - نفس ستايل المتجر */}
              <div className="flex justify-center mb-6 mt-[-1.8rem]">
                <div className={cn(
                  "border px-6 py-1 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]",
                  achievement.unlocked ? "border-slate-400/80" : "border-slate-700/50"
                )}>
                  <h2 className="text-xs font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase">
                    {achievement.unlocked ? "MISSION: ACCOMPLISHED" : "MISSION: LOCKED"}
                  </h2>
                </div>
              </div>

              {/* محتوى الكارد */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-5">
                  {/* مربع الصورة المحدث - باستخدام AchievementIcon.png */}
                  <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0 overflow-hidden">
                    {/* الصورة المطلوبة كخلفية داخل المربع */}
                    <img 
                      src="/AchievementIcon.png" 
                      alt="Achievement Frame" 
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* أيقونة الإنجاز أو القفل فوق الصورة */}
                    <div className="relative z-10 scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                      {achievement.unlocked ? (
                        <AchievementBadge achievement={achievement} />
                      ) : (
                        <Lock className="w-8 h-8 text-slate-500 opacity-50" />
                      )}
                    </div>

                    {/* زوايا "النظام" البيضاء */}
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white" />
                  </div>

                  {/* بيانات الإنجاز */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-[8px] text-blue-400 uppercase font-black tracking-[0.2em] mb-0.5">Title Acquired</p>
                      <h3 className="text-sm font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic uppercase leading-tight">
                        {achievement.unlocked ? achievement.name : "????? ????"}
                      </h3>
                    </div>
                    
                    <div className="h-[1px] bg-blue-500/20 w-full" />
                    
                    <div className="flex justify-between items-center bg-blue-500/5 px-2 py-1">
                      <p className="text-[8px] text-slate-400 uppercase font-bold">Grade:</p>
                      <p className="text-[10px] font-bold text-blue-100 uppercase italic">S-Rank</p>
                    </div>
                  </div>
                </div>

                {/* وصف المهمة */}
                <div className="py-3 border-y border-slate-700/50 bg-white/[0.01] px-3 relative overflow-hidden">
                  <p className="text-[10px] text-slate-300 italic leading-relaxed text-center relative z-10">
                    {achievement.unlocked 
                      ? achievement.description 
                      : "The system has restricted information regarding this hidden achievement."}
                  </p>
                </div>

                {/* الزر السفلي (الحالة) */}
                <div className={cn(
                  "w-full py-1.5 border text-center text-[9px] font-black tracking-[0.3em] uppercase transition-all",
                  achievement.unlocked 
                    ? "bg-blue-600/10 border-blue-400/40 text-blue-200 drop-shadow-[0_0_5px_rgba(59,130,246,0.2)]" 
                    : "bg-slate-900/50 border-slate-800 text-slate-600"
                )}>
                  {achievement.unlocked ? "Synchronized" : "Locked"}
                </div>
              </div>

              {/* تأثيرات جمالية في الزوايا */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
            </div>
          </div>
        ))}
      </main>

      <div className="mt-16 text-center">
        <div className="inline-block h-1 w-20 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <p className="text-[8px] font-mono text-slate-500 mt-2 tracking-[0.4em] uppercase">
          System Version 1.0.4 - Achievements Module
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Achievements;
