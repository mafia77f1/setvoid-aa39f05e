import { useState } from 'react';
import { Dumbbell, Brain, Heart, Flame, Shield, Zap, Bell, Target, Scroll, Crown, Trophy, Smartphone } from 'lucide-react';
import { GameState, Gate } from '@/types/game';
import { cn } from '@/lib/utils';
import { EditProfileModal } from './EditProfileModal';
import { NewGateNotification } from './NewGateNotification';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface ProfileCardProps {
  gameState: GameState;
  getXpProgress: (xp: number) => number;
  onUpdateProfile?: (name: string, title: string) => void;
}

const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-strength' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-mind' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-spirit' },
  { key: 'agility', label: 'AGI', icon: Zap, color: 'text-agility' },
] as const;

const getRankColor = (totalLevel: number) => {
  if (totalLevel >= 50) return { border: 'border-orange-400', bg: 'bg-orange-400/10', glow: 'shadow-orange-400/50', text: 'text-orange-400', rankName: 'A' };
  if (totalLevel >= 35) return { border: 'border-purple-400', bg: 'bg-purple-400/10', glow: 'shadow-purple-400/50', text: 'text-purple-400', rankName: 'B' };
  if (totalLevel >= 20) return { border: 'border-blue-400', bg: 'bg-blue-400/10', glow: 'shadow-blue-400/50', text: 'text-blue-400', rankName: 'C' };
  if (totalLevel >= 10) return { border: 'border-green-400', bg: 'bg-green-400/10', glow: 'shadow-green-400/50', text: 'text-green-400', rankName: 'D' };
  return { border: 'border-gray-400', bg: 'bg-gray-400/10', glow: 'shadow-gray-400/50', text: 'text-gray-400', rankName: 'E' };
};

export const ProfileCard = ({ gameState, getXpProgress, onUpdateProfile }: ProfileCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTestGateNotif, setShowTestGateNotif] = useState(false);
  const [testGate, setTestGate] = useState<Gate | null>(null);
  const { playNotification } = useSoundEffects();
  const { 
    permission, 
    isSupported, 
    isReady,
    requestPermission, 
    notifyNewGate, 
    notifyNewQuest,
    notifyAchievement 
  } = usePushNotifications();
  
  // حساب المستوى الكلي = مجموع المستويات الأربعة / 4
  const totalLevel = Math.floor(
    (gameState.levels.strength + gameState.levels.mind + gameState.levels.spirit + gameState.levels.agility) / 4
  );
  const todayQuests = gameState.quests.filter(q => q.completed && q.isMainQuest !== false).length;
  const totalQuests = gameState.quests.filter(q => q.isMainQuest !== false).length;
  const rankColor = getRankColor(totalLevel);
  const hpPercentage = (gameState.hp / gameState.maxHp) * 100;
  const energyPercentage = (gameState.energy / gameState.maxEnergy) * 100;

  // دالة اختبار إشعار البوابة
  const testGateNotification = async () => {
    const testGateData: Gate = {
      id: 'test_gate_' + Date.now(),
      name: 'بوابة اختبار',
      rank: 'B',
      requiredPower: 25,
      energyDensity: '28,500',
      danger: 'HIGH DANGER',
      color: 'purple',
      discovered: true,
      completed: false,
      isFullyRevealed: true,
      rewards: { xp: 1000, gold: 300, shadowPoints: 20 },
    };
    setTestGate(testGateData);
    setShowTestGateNotif(true);
    playNotification();
    
    // إرسال Push Notification
    await notifyNewGate('بوابة اختبار', 'B');
  };

  // دالة اختبار إشعار المهمة
  const testQuestNotification = async (isMain: boolean = false) => {
    playNotification();
    await notifyNewQuest(
      isMain ? 'أكمل تمارين القوة اليومية' : 'اقرأ 10 صفحات من كتاب',
      isMain
    );
  };

  // دالة اختبار إشعار الإنجاز
  const testAchievementNotification = async () => {
    playNotification();
    await notifyAchievement('صياد البوابات - أكملت 10 بوابات');
  };

  return (
    <>
      <div className={cn("profile-card", rankColor.border, totalLevel >= 50 && "shadow-2xl")}>
        <div className="corner-decoration corner-tl" />
        <div className="corner-decoration corner-tr" />
        <div className="corner-decoration corner-bl" />
        <div className="corner-decoration corner-br" />
        
        <div className="scan-line" />

        <div className="status-header">
          <h2>الحالة</h2>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-6 mb-4">
            {/* القسم الأيسر: المعلومات بالعربي */}
            <div className="flex-1 flex flex-col gap-1 text-right" dir="rtl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-primary/70 font-bold">الاسم:</span>
                <span className="font-semibold text-sm">{gameState.playerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-primary/70 font-bold">الرتبة:</span>
                <span className={cn("font-bold text-sm", rankColor.text)}>{rankColor.rankName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-primary/70 font-bold">اللقب:</span>
                <span className="text-sm text-primary">
                  {gameState.equippedTitle || '-'}
                </span>
                {gameState.equippedTitle && (
                  <span className="text-[8px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">مجهز</span>
                )}
              </div>
            </div>

            {/* القسم الأيمن: اللفل */}
            <div className="text-center">
              <div className={cn("text-5xl font-bold glow-text", rankColor.text)}>{totalLevel}</div>
              <div className="text-[10px] text-muted-foreground tracking-widest font-bold">المستوى</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-destructive" />
                  <span className="text-xs">HP</span>
                </div>
                <span className="text-xs font-bold">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="stats-bar h-3">
                <div className="stats-bar-fill bg-destructive" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-secondary" />
                  <span className="text-xs">ENERGY</span>
                </div>
                <span className="text-xs font-bold">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="stats-bar h-3">
                <div className="stats-bar-fill bg-secondary" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-4" />

          <div className="flex items-center justify-around mb-4 py-3 rounded-lg bg-card/50 border border-primary/20">
            <div className="text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
              <div className="text-lg font-bold">{gameState.streakDays}</div>
              <div className="text-[10px] text-muted-foreground">أيام متتالية</div>
            </div>
            <div className="w-px h-10 bg-primary/30" />
            <div className="text-center">
              <div className="text-lg font-bold">{todayQuests}/{totalQuests}</div>
              <div className="text-[10px] text-muted-foreground">مهمات اليوم</div>
            </div>
            <div className="w-px h-10 bg-primary/30" />
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">{gameState.gold || 0}</div>
              <div className="text-[10px] text-muted-foreground">ذهب</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-primary/10">
                  <Icon className={cn('w-5 h-5', stat.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-sm font-bold', stat.color)}>{stat.label}</span>
                      <span className="stat-value text-sm">{level}</span>
                    </div>
                    <div className="stats-bar h-2">
                      <div className={cn('stats-bar-fill', stat.color.replace('text-', 'bg-'))} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* أزرار اختبار الإشعارات - تظهر فقط بعد التصدير */}
          {(() => {
            const isRealEnvironment = !window.location.hostname.includes('lovable.app') && 
                                       !window.location.hostname.includes('localhost');
            
            if (!isRealEnvironment) {
              return (
                <div className="mt-4 p-3 bg-card/50 border border-primary/20 rounded-lg">
                  <h4 className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    إشعارات Push
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    ⚠️ الإشعارات الخارجية تعمل فقط بعد تصدير التطبيق من GitHub وتشغيله على هاتفك
                  </p>
                </div>
              );
            }
            
            return (
              <div className="mt-4 p-3 bg-card/50 border border-primary/20 rounded-lg">
                <h4 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  اختبار إشعارات Push
                  {isReady && (
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      جاهز
                    </span>
                  )}
                </h4>
                
                {/* حالة الإذن */}
                <div className="mb-3 p-2 rounded bg-background/50 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">حالة الإشعارات:</span>
                    <span className={cn(
                      "font-bold",
                      permission === 'granted' ? 'text-green-400' : 
                      permission === 'denied' ? 'text-destructive' : 'text-yellow-400'
                    )}>
                      {permission === 'granted' ? '✓ مفعّل' : 
                       permission === 'denied' ? '✗ مرفوض' : '⚠ غير مفعّل'}
                    </span>
                  </div>
                  {!isSupported && (
                    <p className="text-destructive mt-1">متصفحك لا يدعم الإشعارات</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={testGateNotification}
                    className="p-2 text-xs bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded hover:bg-purple-500/20 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Target className="w-3 h-3" />
                    بوابة جديدة
                  </button>
                  <button
                    onClick={() => testQuestNotification(false)}
                    className="p-2 text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded hover:bg-blue-500/20 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Scroll className="w-3 h-3" />
                    مهمة جانبية
                  </button>
                  <button
                    onClick={() => testQuestNotification(true)}
                    className="p-2 text-xs bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded hover:bg-orange-500/20 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Crown className="w-3 h-3" />
                    مهمة أساسية
                  </button>
                  <button
                    onClick={testAchievementNotification}
                    className="p-2 text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded hover:bg-yellow-500/20 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Trophy className="w-3 h-3" />
                    إنجاز جديد
                  </button>
                </div>
                
                {/* زر تفعيل الإشعارات */}
                {isSupported && permission !== 'granted' && (
                  <button
                    onClick={requestPermission}
                    className="w-full mt-3 p-2.5 text-xs bg-primary/10 border border-primary/30 text-primary rounded hover:bg-primary/20 font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {permission === 'denied' ? 'الإشعارات مرفوضة - فعّل من إعدادات المتصفح' : 'تفعيل إشعارات الهاتف'}
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* إشعار البوابة التجريبي */}
      <NewGateNotification
        show={showTestGateNotif}
        gate={testGate}
        onClose={() => setShowTestGateNotif(false)}
      />
    </>
  );
};
