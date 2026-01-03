import { useGameState } from '@/hooks/useGameState';
import { AchievementBadge } from '@/components/AchievementBadge';
import { BottomNav } from '@/components/BottomNav';
import { Trophy, Target, Lock, Crown, Zap, Swords } from 'lucide-react';

const Achievements = () => {
  const { gameState } = useGameState();
  
  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked);
  const lockedAchievements = gameState.achievements.filter(a => !a.unlocked);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30 pb-24 overflow-x-hidden">
      
      {/* تأثيرات الخلفية العميقة - Gate Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(30,64,175,0.3),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        {/* خطوط الـ Scanline المتحركة */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,4px_100%]" />
      </div>

      <header className="relative z-10 pt-10 pb-6 px-4 text-center">
        <div className="inline-block relative">
          <div className="absolute inset-0 blur-2xl bg-blue-600/20 rounded-full animate-pulse" />
          <h1 className="relative text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-200 to-blue-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            Achievements
          </h1>
        </div>
        
        {/* شريط التقدم العلوي - Player Rank Style */}
        <div className="mt-4 max-w-[250px] mx-auto">
          <div className="flex justify-between text-[10px] font-bold text-blue-400 mb-1 uppercase tracking-widest">
            <span>Completion Rate</span>
            <span>{Math.round((unlockedAchievements.length / gameState.achievements.length) * 100)}%</span>
          </div>
          <div className="h-1 w-full bg-blue-950 border border-blue-500/30 rounded-full overflow-hidden p-[1px]">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
              style={{ width: `${(unlockedAchievements.length / gameState.achievements.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 space-y-10">
        
        {/* قسم الإنجازات المحققة - بأسلوب بطاقات المهام المكتملة */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-1 bg-blue-500/20 border border-blue-500/50">
              <Swords className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-blue-100 italic">Unlocked Titles</h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {unlockedAchievements.map((achievement) => (
              <div key={achievement.id} className="relative group">
                {/* الإطار الخارجي المضيء */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-600/50 via-cyan-400/50 to-blue-600/50 opacity-100 blur-[2px]" />
                
                <div className="relative bg-[#050b18] border border-white/20 p-4 shadow-2xl">
                  {/* زوايا كلاسيكية للنظام */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-400" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-400" />
                  
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-900/20 border border-blue-500/40 flex items-center justify-center relative overflow-hidden group-hover:bg-blue-500/10 transition-colors">
                        <AchievementBadge achievement={achievement} />
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-blue-300 transition-colors">
                          {achievement.name}
                        </h3>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight italic">
                        {achievement.description || "System reward for overcoming the trials."}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-black text-blue-500/60 uppercase block">Status</span>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">Cleared</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* قسم الإنجازات المغلقة - بأسلوب غامض وداكن */}
        <section className="pb-10">
          <div className="flex items-center gap-3 mb-6 opacity-50">
            <Lock className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 italic">Locked Trials</h2>
            <div className="flex-1 h-[1px] bg-slate-800" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {lockedAchievements.map((achievement) => (
              <div key={achievement.id} className="relative bg-black/40 border border-slate-800 p-3 group grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 flex items-center justify-center opacity-30">
                     <AchievementBadge achievement={achievement} />
                  </div>
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter line-clamp-1">
                    ???
                  </h3>
                  <div className="px-2 py-[2px] bg-slate-800/50 border border-slate-700 rounded-full">
                    <span className="text-[8px] text-slate-400 font-mono">Hidden Reward</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* رسالة تذييل النظام */}
      <div className="fixed bottom-20 left-0 w-full px-6 pointer-events-none z-20">
        <div className="bg-blue-600/5 backdrop-blur-md border-y border-blue-500/20 py-2">
           <p className="text-[9px] text-center text-blue-400/60 font-mono animate-pulse">
             [ ATTENTION: UNLOCKING MORE TITLES WILL INCREASE YOUR PLAYER RANK ]
           </p>
        </div>
      </div>

      <BottomNav />

      {/* Keyframe Animations for CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
      `}} />
    </div>
  );
};

export default Achievements;
