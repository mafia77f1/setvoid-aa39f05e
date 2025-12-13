import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { ProfileCard } from '@/components/ProfileCard';
import { DailyQuestCard } from '@/components/DailyQuestCard';
import { PrayerQuestModal } from '@/components/PrayerQuestModal';
import { SystemNotification } from '@/components/SystemNotification';
import { LevelUpModal } from '@/components/LevelUpModal';
import { BottomNav } from '@/components/BottomNav';
import { Link } from 'react-router-dom';
import { ChevronLeft, Zap, Trophy, Skull, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatType } from '@/types/game';

const Index = () => {
  const { 
    gameState, 
    levelUpInfo,
    dismissLevelUp,
    getXpProgress, 
    completeQuest, 
    updatePlayerInfo,
    completePrayerQuest,
    useAbility
  } = useGameState();
  const { playQuestComplete, playUseAbility } = useSoundEffects();
  const [activePrayerQuest, setActivePrayerQuest] = useState<string | null>(null);
  const [showNewQuestNotification, setShowNewQuestNotification] = useState(false);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  // Get today's daily quest category (rotating daily)
  const getDailyCategory = (): StatType => {
    const dayOfWeek = new Date().getDay();
    const categories: StatType[] = ['strength', 'mind', 'spirit', 'quran'];
    return categories[dayOfWeek % 4];
  };

  const todayCategory = getDailyCategory();
  const dailyQuests = gameState.quests.filter(q => q.category === todayCategory && q.dailyReset);

  // Get XP reward for completing all tasks
  const totalXpReward = dailyQuests.reduce((sum, q) => sum + q.xpReward, 0);

  // Check for prayer time
  useEffect(() => {
    const checkPrayerTime = () => {
      const now = new Date();
      
      const duePrayer = gameState.prayerQuests.find(p => {
        if (p.completed) return false;
        const prayerHour = parseInt(p.time.split(':')[0]);
        const currentHour = now.getHours();
        return currentHour >= prayerHour && currentHour < prayerHour + 1;
      });

      if (duePrayer && !activePrayerQuest) {
        setActivePrayerQuest(duePrayer.id);
      }
    };

    checkPrayerTime();
    const interval = setInterval(checkPrayerTime, 60000);
    return () => clearInterval(interval);
  }, [gameState.prayerQuests, activePrayerQuest]);

  // Show new quest notification
  useEffect(() => {
    const hasIncompleteQuests = dailyQuests.some(q => !q.completed);
    if (hasIncompleteQuests) {
      setShowNewQuestNotification(true);
      const timer = setTimeout(() => setShowNewQuestNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTaskComplete = (taskId: string) => {
    playQuestComplete();
    completeQuest(taskId);
    setSystemMessage('تم إكمال المهمة بنجاح! الزعيم تلقى ضرراً.');
    setTimeout(() => setSystemMessage(null), 3000);
  };

  const handlePrayerComplete = (prayerId: string) => {
    playQuestComplete();
    completePrayerQuest(prayerId);
  };

  const handleUseAbility = (abilityId: string) => {
    playUseAbility();
    useAbility(abilityId);
    
    const ability = gameState.abilities.find(a => a.id === abilityId);
    if (ability) {
      setSystemMessage(`تم تفعيل ${ability.name}!`);
      setTimeout(() => setSystemMessage(null), 3000);
    }
  };

  const currentPrayer = activePrayerQuest 
    ? gameState.prayerQuests.find(p => p.id === activePrayerQuest) 
    : null;

  const unlockedAbilities = gameState.abilities.filter(a => a.unlocked && a.id !== 'a7').slice(0, 4);
  const topAchievements = gameState.achievements.slice(0, 4);

  return (
    <div className="min-h-screen pb-24">
      {/* System Notifications */}
      {showNewQuestNotification && (
        <SystemNotification 
          message="Daily Quest has arrived!"
          type="info"
          onClose={() => setShowNewQuestNotification(false)}
        />
      )}
      
      {systemMessage && (
        <SystemNotification 
          message={systemMessage}
          type="success"
          duration={3000}
          onClose={() => setSystemMessage(null)}
        />
      )}

      <main className="container mx-auto px-4 py-6 space-y-6">
        <ProfileCard 
          gameState={gameState} 
          getXpProgress={getXpProgress} 
          onUpdateProfile={updatePlayerInfo}
        />

        {/* Daily Quest Card */}
        <section>
          <DailyQuestCard
            category={todayCategory}
            quests={dailyQuests}
            xpReward={totalXpReward}
            onTaskComplete={handleTaskComplete}
          />
        </section>

        {/* Abilities Section */}
        <section className="system-panel p-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-bold">القدرات</h3>
            </div>
            <Link to="/abilities" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          {unlockedAbilities.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {unlockedAbilities.map((ability, index) => (
                <button 
                  key={ability.id}
                  onClick={() => handleUseAbility(ability.id)}
                  className={cn(
                    "relative flex items-center gap-3 p-4 rounded-xl transition-all duration-300 group",
                    "bg-gradient-to-r from-primary/10 to-primary/5",
                    "border border-primary/30 hover:border-primary/60",
                    "hover:scale-[1.03] hover:shadow-[0_0_20px_hsl(270_100%_60%/0.3)]",
                    "active:scale-[0.98] animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="ability-icon w-12 h-12 group-hover:animate-ability-activate">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="text-sm font-bold truncate">{ability.name}</div>
                    <div className="text-[10px] text-primary truncate">{ability.effect}</div>
                    {/* Progress bar for ability level */}
                    <div className="mt-1 h-1 rounded-full bg-black/30 overflow-hidden">
                      <div 
                        className="h-full bg-primary/60 rounded-full transition-all"
                        style={{ width: `${(ability.level % 1) * 100}%` }}
                      />
                    </div>
                    <div className="text-[8px] text-muted-foreground mt-0.5">
                      Lv.{Math.floor(ability.level)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 rounded-xl bg-muted/10 border border-muted/20">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">ارفع مستوياتك لتفتح قدرات جديدة</p>
            </div>
          )}
        </section>

        {/* Achievements Section */}
        <section className="system-panel p-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-secondary" />
              <h3 className="font-bold">الإنجازات</h3>
            </div>
            <Link to="/achievements" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {topAchievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all animate-fade-in',
                  achievement.unlocked 
                    ? 'bg-secondary/10 border-secondary/30 hover:border-secondary/50' 
                    : 'bg-muted/5 border-muted/20 opacity-50'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-3xl">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{achievement.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {achievement.progress}/{achievement.requirement}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-1 h-1 rounded-full bg-black/30 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%`,
                        background: achievement.unlocked 
                          ? 'linear-gradient(90deg, hsl(45 100% 50%), hsl(45 100% 60%))' 
                          : 'hsl(0 0% 40%)'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Punishment Zone Link */}
        <Link 
          to="/battle"
          className="block system-panel p-4 border-destructive/30 hover:border-destructive/50 transition-all hover:scale-[1.02] animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 border border-destructive/40 flex items-center justify-center">
                <Skull className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-bold text-destructive">منطقة العقاب</h3>
                <p className="text-xs text-muted-foreground">واجه الزعيم وتغلب على عاداتك السيئة</p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-destructive" />
          </div>
        </Link>
      </main>

      <BottomNav />

      {/* Prayer Quest Modal */}
      {currentPrayer && (
        <PrayerQuestModal
          prayer={currentPrayer}
          onComplete={handlePrayerComplete}
          onClose={() => setActivePrayerQuest(null)}
        />
      )}

      {/* Level Up Modal */}
      {levelUpInfo && levelUpInfo.show && (
        <LevelUpModal
          show={levelUpInfo.show}
          newLevel={levelUpInfo.newLevel}
          category={levelUpInfo.category}
          onDismiss={dismissLevelUp}
        />
      )}
    </div>
  );
};

export default Index;