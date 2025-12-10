import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { ProfileCard } from '@/components/ProfileCard';
import { QuestModal } from '@/components/QuestModal';
import { BottomNav } from '@/components/BottomNav';
import { Link } from 'react-router-dom';
import { ChevronLeft, Target, Zap, Trophy, Dumbbell, Brain, Heart, BookOpen, Check, Circle } from 'lucide-react';
import { Quest } from '@/types/game';
import { cn } from '@/lib/utils';

const categoryConfig = {
  strength: { icon: Dumbbell, color: 'text-strength', borderColor: 'border-l-strength' },
  mind: { icon: Brain, color: 'text-mind', borderColor: 'border-l-mind' },
  spirit: { icon: Heart, color: 'text-spirit', borderColor: 'border-l-spirit' },
  quran: { icon: BookOpen, color: 'text-quran', borderColor: 'border-l-quran' },
};

const difficultyColors = {
  easy: 'border-foreground/30',
  medium: 'border-mind/50',
  hard: 'border-spirit/50',
  legendary: 'border-foreground/80',
};

const Index = () => {
  const { gameState, getXpProgress, completeQuest, updatePlayerInfo } = useGameState();
  const { playQuestComplete } = useSoundEffects();
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const handleQuestComplete = (questId: string) => {
    playQuestComplete();
    completeQuest(questId);
  };

  const incompleteQuests = gameState.quests.filter(q => !q.completed).slice(0, 4);
  const unlockedAbilities = gameState.abilities.filter(a => a.unlocked).slice(0, 4);
  const topAchievements = gameState.achievements.slice(0, 4);

  return (
    <div className="min-h-screen pb-24">
      <main className="container mx-auto px-4 py-6 space-y-6">
        <ProfileCard 
          gameState={gameState} 
          getXpProgress={getXpProgress} 
          onUpdateProfile={updatePlayerInfo}
        />

        {/* Daily Quests Section */}
        <section className="system-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-bold">المهمات اليومية</h3>
            </div>
            <Link to="/quests" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {incompleteQuests.map(quest => {
              const config = categoryConfig[quest.category];
              const Icon = config.icon;
              return (
                <div
                  key={quest.id}
                  onClick={() => setSelectedQuest(quest)}
                  className={cn(
                    'quest-card-new border-r-4 cursor-pointer',
                    config.borderColor,
                    difficultyColors[quest.difficulty]
                  )}
                >
                  <div className={cn('ability-icon', `bg-${quest.category}/10`)}>
                    <Icon className={cn('w-6 h-6', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-0.5 truncate">{quest.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{quest.description}</p>
                  </div>
                  <div className="text-left">
                    <div className={cn('text-sm font-bold', config.color)}>+{quest.xpReward}</div>
                    <div className="text-[10px] text-muted-foreground">XP</div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground/50">
                    <Circle className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
            {incompleteQuests.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Check className="w-12 h-12 mx-auto mb-2 text-secondary" />
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
            <Link to="/abilities" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          {unlockedAbilities.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {unlockedAbilities.map(ability => {
                const config = categoryConfig[ability.category];
                const Icon = config.icon;
                return (
                  <div key={ability.id} className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="ability-icon w-8 h-8">
                      <Icon className={cn('w-4 h-4', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{ability.name}</div>
                      <div className="text-[10px] text-muted-foreground">Lv.{ability.level}</div>
                    </div>
                  </div>
                );
              })}
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
            <Link to="/achievements" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {topAchievements.map(achievement => (
              <div
                key={achievement.id}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-lg border',
                  achievement.unlocked ? 'bg-secondary/10 border-secondary/30' : 'bg-muted/10 border-muted/30 opacity-60'
                )}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{achievement.name}</div>
                  <div className="text-[10px] text-muted-foreground">{achievement.progress}/{achievement.requirement}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />

      {selectedQuest && (
        <QuestModal
          quest={selectedQuest}
          onComplete={handleQuestComplete}
          onClose={() => setSelectedQuest(null)}
        />
      )}
    </div>
  );
};

export default Index;
