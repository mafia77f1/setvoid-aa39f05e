import { useGameState } from '@/hooks/useGameState';
import { AchievementBadge } from '@/components/AchievementBadge';
import { BottomNav } from '@/components/BottomNav';

const Achievements = () => {
  const { gameState } = useGameState();
  
  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked);
  const lockedAchievements = gameState.achievements.filter(a => !a.unlocked);

  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-border bg-card/50 px-4 py-6">
        <h1 className="text-2xl font-bold">الإنجازات</h1>
        <p className="text-muted-foreground">
          {unlockedAchievements.length} من {gameState.achievements.length} إنجاز محقق
        </p>
      </header>

      <main className="container mx-auto px-4 py-6">
        {unlockedAchievements.length > 0 && (
          <>
            <h3 className="mb-4 text-lg font-semibold text-secondary">الإنجازات المحققة</h3>
            <div className="mb-8 grid grid-cols-2 gap-4">
              {unlockedAchievements.map(achievement => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </>
        )}

        <h3 className="mb-4 text-lg font-semibold">الإنجازات القادمة</h3>
        <div className="grid grid-cols-2 gap-4">
          {lockedAchievements.map(achievement => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Achievements;
