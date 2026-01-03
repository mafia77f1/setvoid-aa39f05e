import { useGameState } from '@/hooks/useGameState';
import { AchievementBadge } from '@/components/AchievementBadge';
import { BottomNav } from '@/components/BottomNav';
import { Trophy } from 'lucide-react';

const Achievements = () => {
  const { gameState } = useGameState();
  
  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked);
  const lockedAchievements = gameState.achievements.filter(a => !a.unlocked);

  return (
    <div className="min-h-screen pb-24">
      <header className="relative px-4 py-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/20 border border-secondary/40">
          <Trophy className="w-5 h-5 text-secondary" />
          <h1 className="text-xl font-bold text-secondary">الإنجازات</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {unlockedAchievements.length} من {gameState.achievements.length} إنجاز محقق
        </p>
      </header>

      <main className="container mx-auto px-4 py-6">
        {unlockedAchievements.length > 0 && (
          <div className="system-panel p-4 mb-6 border-secondary/30">
            <h3 className="mb-4 text-lg font-semibold text-secondary flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              الإنجازات المحققة
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {unlockedAchievements.map(achievement => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        <div className="system-panel p-4">
          <h3 className="mb-4 text-lg font-semibold">الإنجازات القادمة</h3>
          <div className="grid grid-cols-2 gap-4">
            {lockedAchievements.map(achievement => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Achievements;