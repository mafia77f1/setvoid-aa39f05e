import { useGameState } from '@/hooks/useGameState';
import { CharacterAvatar } from '@/components/CharacterAvatar';
import { StatCard } from '@/components/StatCard';
import { BottomNav } from '@/components/BottomNav';
import { Flame } from 'lucide-react';

const Index = () => {
  const { gameState, getXpProgress } = useGameState();
  const totalLevel = gameState.levels.strength + gameState.levels.mind + gameState.levels.spirit + gameState.levels.quran;

  const todayQuests = gameState.quests.filter(q => q.completed).length;
  const totalQuests = gameState.quests.length;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-border bg-card/50 px-4 py-8">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />
        
        <div className="relative">
          <CharacterAvatar name={gameState.playerName} totalLevel={totalLevel} />
          
          {/* Streak indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-medium">{gameState.streakDays} أيام متتالية</span>
          </div>

          {/* Today's progress */}
          <div className="mt-4 rounded-xl bg-muted/50 p-3 text-center">
            <p className="text-sm text-muted-foreground">
              مهمات اليوم: <span className="font-bold text-foreground">{todayQuests}/{totalQuests}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <main className="container mx-auto px-4 py-6">
        <h3 className="mb-4 text-lg font-semibold">مستوياتك</h3>
        <div className="grid gap-4">
          <StatCard
            category="strength"
            level={gameState.levels.strength}
            xp={gameState.stats.strength}
            xpProgress={getXpProgress(gameState.stats.strength)}
          />
          <StatCard
            category="mind"
            level={gameState.levels.mind}
            xp={gameState.stats.mind}
            xpProgress={getXpProgress(gameState.stats.mind)}
          />
          <StatCard
            category="spirit"
            level={gameState.levels.spirit}
            xp={gameState.stats.spirit}
            xpProgress={getXpProgress(gameState.stats.spirit)}
          />
          <StatCard
            category="quran"
            level={gameState.levels.quran}
            xp={gameState.stats.quran}
            xpProgress={getXpProgress(gameState.stats.quran)}
          />
        </div>

        {/* Motivational Message */}
        {gameState.totalQuestsCompleted > 0 && (
          <div className="mt-6 rounded-xl border border-secondary/30 bg-secondary/10 p-4 text-center">
            <p className="text-sm font-medium text-secondary">
              {gameState.totalQuestsCompleted >= 50
                ? '🎉 أنت بطل حقيقي! استمر في التقدم'
                : gameState.totalQuestsCompleted >= 20
                ? '💪 أداء ممتاز! لا تتوقف'
                : '🌟 بداية رائعة! كل خطوة تهم'}
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
