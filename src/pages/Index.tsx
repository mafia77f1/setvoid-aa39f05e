import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { ProfileCard } from '@/components/ProfileCard';
import { SoloLevelingQuestCard } from '@/components/SoloLevelingQuestCard';
import { PrayerQuestModal } from '@/components/PrayerQuestModal';
import { SystemNotification } from '@/components/SystemNotification';
import { LevelUpModal } from '@/components/LevelUpModal';
import { MaxLevelModal } from '@/components/MaxLevelModal';
import { GateDiscoveryNotification } from '@/components/GateDiscoveryNotification';
import { NewGateNotification } from '@/components/NewGateNotification';
import { BottomNav } from '@/components/BottomNav';
import { Link } from 'react-router-dom';
import { ChevronLeft, Zap, Trophy, Skull, Sparkles, ShoppingBag, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatType, Gate } from '@/types/game';



const Index = () => {
  const { 
    gameState, 
    levelUpInfo,
    dismissLevelUp,
    getXpProgress, 
    completeQuest, 
    updatePlayerInfo,
    completePrayerQuest,
    useAbility,
    startSideQuest,
    updateSideQuestProgress
  } = useGameState();
  const { playQuestComplete, playUseAbility } = useSoundEffects();
  const [activePrayerQuest, setActivePrayerQuest] = useState<string | null>(null);
  const [showNewQuestNotification, setShowNewQuestNotification] = useState(false);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);
  const [showMaxLevelModal, setShowMaxLevelModal] = useState(false);
  const [showGateNotification, setShowGateNotification] = useState(false);
  const [discoveredGate, setDiscoveredGate] = useState<Gate | null>(null);
  const [showNewGateNotification, setShowNewGateNotification] = useState(false);
  const [newGate, setNewGate] = useState<Gate | null>(null);

  // Check for max level - المستوى الأقصى هو 50
  const maxLevel = Math.max(
    gameState.levels.strength,
    gameState.levels.mind,
    gameState.levels.spirit,
    gameState.levels.agility
  );
  
  useEffect(() => {
    if (maxLevel >= 50) {
      setShowMaxLevelModal(true);
    }
  }, [maxLevel]);

  // Get only main daily quests (not side quests)
  const dailyQuests = gameState.quests.filter(q => q.dailyReset && q.isMainQuest !== false);

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

  // إشعار البوابات الجديدة
  useEffect(() => {
    const gates = gameState.gates || [];
    const shownGates = JSON.parse(localStorage.getItem('shownGateNotifications') || '[]');
    
    const newGates = gates.filter(g => !shownGates.includes(g.id) && g.discovered);
    
    if (newGates.length > 0) {
      // عرض إشعار لأول بوابة جديدة
      setDiscoveredGate(newGates[0]);
      setShowGateNotification(true);
      
      // تحديث البوابات المعروضة
      const updatedShown = [...shownGates, ...newGates.map(g => g.id)];
      localStorage.setItem('shownGateNotifications', JSON.stringify(updatedShown));
    }
  }, [gameState.gates]);

  // الاستماع لإشعار البوابات الجديدة
  useEffect(() => {
    const handleNewGate = () => {
      const gates = gameState.gates || [];
      if (gates.length > 0) {
        setNewGate(gates[0]);
        setShowNewGateNotification(true);
      }
    };

    window.addEventListener('newGateAppeared', handleNewGate);
    return () => window.removeEventListener('newGateAppeared', handleNewGate);
  }, [gameState.gates]);

  const handleTaskComplete = (taskId: string) => {
    playQuestComplete();
    completeQuest(taskId);
    setSystemMessage('تم إكمال المهمة بنجاح! الزعيم تلقى ضرراً.');
    setTimeout(() => setSystemMessage(null), 3000);
  };

  const handleStartQuest = (questId: string) => {
    startSideQuest(questId);
  };

  const handleUpdateQuestProgress = (questId: string, timeProgress: number) => {
    updateSideQuestProgress(questId, timeProgress);
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
          show={showNewQuestNotification}
          title="مهمة يومية جديدة"
          message="Daily Quest has arrived!"
          type="info"
          onClose={() => setShowNewQuestNotification(false)}
        />
      )}
      
      {systemMessage && (
        <SystemNotification 
          show={!!systemMessage}
          title="تم بنجاح"
          message={systemMessage}
          type="success"
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
          <SoloLevelingQuestCard
            quests={dailyQuests}
            onTaskComplete={handleTaskComplete}
            onStartQuest={handleStartQuest}
            onUpdateQuestProgress={handleUpdateQuestProgress}
          />
        </section>

        {/* Gates Link */}
        <Link 
          to="/gates"
          className="block system-panel p-4 border-purple-500/30 hover:border-purple-500/50 transition-all hover:scale-[1.02] animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-purple-400">البوابات</h3>
                <p className="text-xs text-muted-foreground">استكشف البوابات</p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-purple-400" />
          </div>
        </Link>

        {/* Market Link */}
        <Link 
          to="/market"
          className="block system-panel p-4 border-yellow-500/30 hover:border-yellow-500/50 transition-all hover:scale-[1.02] animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-bold text-yellow-400">السوق</h3>
                <p className="text-xs text-muted-foreground">اشتري المعدات والأدوات</p>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-yellow-400" />
          </div>
        </Link>

        {/* Abilities Section - Locked */}
        <Link 
          to="/abilities"
          className="block system-panel p-4 border-slate-600/30 hover:border-slate-500/50 transition-all hover:scale-[1.02] animate-fade-in opacity-60"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-500/20 border border-slate-500/40 flex items-center justify-center">
                <Zap className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-400">القدرات</h3>
                <p className="text-xs text-slate-500">قريباً في النسخة الرسمية</p>
              </div>
            </div>
            <span className="text-xs text-slate-500 border border-slate-600 px-2 py-1 rounded">مقفل</span>
          </div>
        </Link>

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

      {/* Max Level Modal */}
      <MaxLevelModal 
        show={showMaxLevelModal} 
        onDismiss={() => setShowMaxLevelModal(false)} 
      />

      {/* Gate Discovery Notification */}
      <GateDiscoveryNotification
        show={showGateNotification}
        gate={discoveredGate}
        hasManaGauge={gameState.inventory?.some(item => item.id === 'mana_meter' && item.quantity > 0) || false}
        playerPower={gameState.totalLevel || 1}
        onClose={() => setShowGateNotification(false)}
        onEnter={() => setShowGateNotification(false)}
      />

      {/* New Gate Notification with Sound */}
      <NewGateNotification
        show={showNewGateNotification}
        gate={newGate}
        onClose={() => setShowNewGateNotification(false)}
      />
    </div>
  );
};

export default Index;