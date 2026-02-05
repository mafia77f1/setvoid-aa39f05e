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

  // إشعار البوابات الجديدة - يظهر فقط للبوابات الموجودة فعلاً
  useEffect(() => {
    const gates = gameState.gates || [];
    if (gates.length === 0) return;
    
    const shownGates = JSON.parse(localStorage.getItem('shownGateNotifications') || '[]');
    const newGates = gates.filter(g => !shownGates.includes(g.id) && g.discovered);
    
    if (newGates.length > 0) {
      // عرض إشعار لأول بوابة جديدة موجودة
      setDiscoveredGate(newGates[0]);
      setShowGateNotification(true);
      
      // تحديث البوابات المعروضة
      const updatedShown = [...shownGates, ...newGates.map(g => g.id)];
      localStorage.setItem('shownGateNotifications', JSON.stringify(updatedShown));
    }
  }, [gameState.gates]);

  // الاستماع لإشعار البوابات الجديدة من التحديث التلقائي
  useEffect(() => {
    const handleNewGate = () => {
      // جلب البوابات الحالية مباشرة من الـ state
      const gates = gameState.gates || [];
      if (gates.length > 0) {
        const firstGate = gates[0];
        if (firstGate) {
          setNewGate(firstGate);
          setShowNewGateNotification(true);
        }
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