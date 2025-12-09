import { useGameState } from '@/hooks/useGameState';
import { ProfileCard } from '@/components/ProfileCard';
import { QuestCardNew } from '@/components/QuestCardNew';
import { AbilityCardMini } from '@/components/AbilityCardMini';
import { AchievementMini } from '@/components/AchievementMini';
import { BottomNav } from '@/components/BottomNav';
import { Link } from 'react-router-dom';
import { ChevronLeft, Target, Zap, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { gameState, getXpProgress, completeQuest } = useGameState();

  const handleQuestComplete = (questId: string) => {
    completeQuest(questId);
    toast({
      title: 'مهمة مكتملة!',
      description: 'أحسنت! استمر في التقدم',
    });
  };

  // Get some quests for preview
  const incompleteQuests = gameState.quests.filter(q => !q.completed).slice(0, 4);
  const unlockedAbilities = gameState.abilities.filter(a => a.unlocked).slice(0, 4);
  const topAchievements = gameState.achievements.slice(0, 4);

  return (
    <div className="min-h-screen pb-24">
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <ProfileCard gameState={gameState} getXpProgress={getXpProgress} />

        {/* Daily Quests Section */}
        <section className="system-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-bold">المهمات اليومية</h3>
            </div>
            <Link 
              to="/quests" 
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
            >
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {incompleteQuests.map(quest => (
              <QuestCardNew 
                key={quest.id} 
                quest={quest} 
                onComplete={handleQuestComplete} 
              />
            ))}
            {incompleteQuests.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">أكملت جميع المهمات اليوم!</p>
              </div>
            )}
          </div>
        </section>

        {/* Abilities Section */}
        <section className="system-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-bold">القدرات</h3>
            </div>
            <Link 
              to="/abilities" 
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
            >
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          {unlockedAbilities.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {unlockedAbilities.map(ability => (
                <AbilityCardMini key={ability.id} ability={ability} />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 rounded-lg bg-muted/20 border border-muted/30">
              <p className="text-sm text-muted-foreground">ارفع مستوياتك لتفتح قدرات جديدة</p>
            </div>
          )}
        </section>

        {/* Achievements Section */}
        <section className="system-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-secondary" />
              <h3 className="font-bold">الإنجازات</h3>
            </div>
            <Link 
              to="/achievements" 
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
            >
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {topAchievements.map(achievement => (
              <AchievementMini key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>

        {/* Motivational Message */}
        {gameState.totalQuestsCompleted > 0 && (
          <div className="system-panel p-4 text-center border-secondary/30">
            <p className="text-sm font-medium text-secondary">
              {gameState.totalQuestsCompleted >= 50
                ? 'أنت بطل حقيقي! استمر في التقدم'
                : gameState.totalQuestsCompleted >= 20
                ? 'أداء ممتاز! لا تتوقف'
                : 'بداية رائعة! كل خطوة تهم'}
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;