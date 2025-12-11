import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { ProfileCard } from '@/components/ProfileCard';
import { DailyQuestCard } from '@/components/DailyQuestCard';
import { PrayerQuestModal } from '@/components/PrayerQuestModal';
import { QuranRecitationModal } from '@/components/QuranRecitationModal';
import { BottomNav } from '@/components/BottomNav';
import { Link } from 'react-router-dom';
import { ChevronLeft, Zap, Trophy, BookOpen, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatType } from '@/types/game';

const Index = () => {
  const { 
    gameState, 
    getXpProgress, 
    completeQuest, 
    updatePlayerInfo,
    completePrayerQuest,
    setSelectedReciter
  } = useGameState();
  const { playQuestComplete } = useSoundEffects();
  const [activePrayerQuest, setActivePrayerQuest] = useState<string | null>(null);
  const [showQuranModal, setShowQuranModal] = useState(false);
  const [showNewQuestNotification, setShowNewQuestNotification] = useState(false);

  // Get today's daily quest category (rotating daily)
  const getDailyCategory = (): StatType => {
    const dayOfWeek = new Date().getDay();
    const categories: StatType[] = ['strength', 'mind', 'spirit', 'quran'];
    return categories[dayOfWeek % 4];
  };

  const todayCategory = getDailyCategory();
  const dailyQuests = gameState.quests.filter(q => q.category === todayCategory && q.dailyReset);
  const dailyTasks = dailyQuests.map(q => ({
    id: q.id,
    title: q.title,
    completed: q.completed
  }));

  // Get XP reward for completing all tasks
  const totalXpReward = dailyQuests.reduce((sum, q) => sum + q.xpReward, 0);

  // Check for prayer time
  useEffect(() => {
    const checkPrayerTime = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // Find if any prayer is due
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
    const interval = setInterval(checkPrayerTime, 60000); // Check every minute
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
  };

  const handlePrayerComplete = (prayerId: string) => {
    playQuestComplete();
    completePrayerQuest(prayerId);
  };

  const currentPrayer = activePrayerQuest 
    ? gameState.prayerQuests.find(p => p.id === activePrayerQuest) 
    : null;

  const unlockedAbilities = gameState.abilities.filter(a => a.unlocked).slice(0, 4);
  const topAchievements = gameState.achievements.slice(0, 4);
  const quranAbility = gameState.abilities.find(a => a.id === 'a7' && a.unlocked);

  return (
    <div className="min-h-screen pb-24">
      {/* New Quest Notification */}
      {showNewQuestNotification && (
        <div className="fixed top-4 left-4 right-4 z-40 animate-slide-in-bottom">
          <div className="notification-panel p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[hsl(200_100%_70%)]" />
            <div className="flex-1">
              <span className="text-sm font-bold text-[hsl(200_100%_70%)]">
                [Daily Quest has arrived!]
              </span>
            </div>
            <button 
              onClick={() => setShowNewQuestNotification(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6 space-y-6">
        <ProfileCard 
          gameState={gameState} 
          getXpProgress={getXpProgress} 
          onUpdateProfile={updatePlayerInfo}
        />

        {/* Daily Quest Card - Solo Leveling Style */}
        <section>
          <DailyQuestCard
            category={todayCategory}
            tasks={dailyTasks}
            difficulty={dailyQuests[0]?.difficulty || 'medium'}
            xpReward={totalXpReward}
            onTaskComplete={handleTaskComplete}
          />
        </section>

        {/* Quran Recitation Button */}
        {quranAbility && (
          <button
            onClick={() => setShowQuranModal(true)}
            className="w-full system-panel p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform"
          >
            <div className="ability-icon bg-quran/20 border-quran/40">
              <BookOpen className="w-6 h-6 text-quran" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="font-bold text-quran">تلاوة القرآن الكريم</h3>
              <p className="text-xs text-muted-foreground">استمع للقرآن واكسب XP</p>
            </div>
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        )}

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
              {unlockedAbilities.map(ability => (
                <div 
                  key={ability.id} 
                  className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/30"
                >
                  <div className="ability-icon w-8 h-8">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{ability.name}</div>
                    <div className="text-[10px] text-muted-foreground">Lv.{Math.floor(ability.level)}</div>
                  </div>
                </div>
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
                  achievement.unlocked 
                    ? 'bg-secondary/10 border-secondary/30' 
                    : 'bg-muted/10 border-muted/30 opacity-60'
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

      {/* Prayer Quest Modal */}
      {currentPrayer && (
        <PrayerQuestModal
          prayer={currentPrayer}
          onComplete={handlePrayerComplete}
          onClose={() => setActivePrayerQuest(null)}
        />
      )}

      {/* Quran Recitation Modal */}
      <QuranRecitationModal
        isOpen={showQuranModal}
        onClose={() => setShowQuranModal(false)}
        selectedReciter={gameState.selectedReciter}
        onReciterChange={setSelectedReciter}
      />
    </div>
  );
};

export default Index;
