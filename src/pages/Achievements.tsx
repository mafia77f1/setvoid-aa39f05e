import { useGameState } from '@/hooks/useGameState';
import { AchievementBadge } from '@/components/AchievementBadge';
import { BottomNav } from '@/components/BottomNav';
import { Trophy, Shield, Flame, Star, Zap } from 'lucide-react';

const Achievements = () => {
  const { gameState } = useGameState();
  
  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked);
  const lockedAchievements = gameState.achievements.filter(a => !a.unlocked);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 pb-24 font-sans selection:bg-blue-500/30">
      {/* Background Effect - يشبه ضباب البوابات */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(30,64,175,0.15)_0%,_transparent_50%)] pointer-events-none" />

      <header className="relative px-6 py-10 flex flex-col items-center">
        {/* Decorative Badge */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
          <div className="relative bg-black/60 border-2 border-blue-500/50 p-3 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Trophy className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400">
          قائمة الإنجازات
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-[2px] w-8 bg-blue-500/50"></div>
          <p className="text-xs font-bold tracking-[0.2em] text-blue-400/80 uppercase">
             Level Status: {unlockedAchievements.length} / {gameState.achievements.length}
          </p>
          <div className="h-[2px] w-8 bg-blue-500/50"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 space-y-8 relative">
        
        {/* Unlocked Achievements Section */}
        {unlockedAchievements.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4 px-2">
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">إنجازات تم فتحها</h3>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {unlockedAchievements.map(achievement => (
                <div key={achievement.id} className="relative group transition-transform active:scale-95">
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg opacity-40 blur-[2px]"></div>
                  <div className="relative bg-[#0f1115] rounded-lg p-1 border border-white/10">
                    <AchievementBadge achievement={achievement} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Locked Achievements Section */}
        <section>
          <div className="flex items-center gap-3 mb-4 px-2">
            <Shield className="w-5 h-5 text-slate-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">مهام قيد الانتظار</h3>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-500/30 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 opacity-70 grayscale">
            {lockedAchievements.map(achievement => (
              <div key={achievement.id} className="bg-black/40 rounded-lg p-1 border border-white/5 border-dashed">
                <AchievementBadge achievement={achievement} />
              </div>
            ))}
          </div>
        </section>

        {/* System Message Style Footer */}
        <div className="mt-10 p-4 border border-blue-500/20 bg-blue-500/5 rounded-md">
          <p className="text-[10px] text-blue-300/60 leading-relaxed text-center font-mono">
            [ تنبيه: الاستمرار في تحقيق الإنجازات سيرفع من رتبة اللاعب (Rank) ويفتح مهارات مخفية ]
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Achievements;
