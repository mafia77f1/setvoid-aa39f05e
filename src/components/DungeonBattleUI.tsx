import { useState, useEffect } from 'react';
import { Boss, Quest, Ability, StatType } from '@/types/game';
import { cn } from '@/lib/utils';
import { 
  Skull, 
  Swords, 
  Shield,
  Heart,
  Zap,
  Dumbbell,
  Brain,
  BookOpen,
  Flame,
  Sparkles,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DungeonBattleUIProps {
  boss: Boss;
  playerHp: number;
  maxPlayerHp: number;
  playerEnergy: number;
  maxPlayerEnergy: number;
  quests: Quest[];
  abilities: Ability[];
  canSeeBossHp: boolean;
  onQuestComplete: (questId: string) => void;
  onUseAbility: (abilityId: string) => void;
  onExit: () => void;
}

// Boss descriptions for different bosses
const bossDescriptions: Record<string, string> = {
  'زعيم الكسل': 'يجعلك تتصفح الإنترنت لساعات ويمنعك من إنجاز مهامك!',
  'زعيم التسويف': 'يجعلك تؤجل كل شيء للغد ويقتل إنتاجيتك!',
  'حارس العزيمة': 'يختبر قوة إرادتك ويحاول كسر عزيمتك!',
  'ملك الفوضى': 'يشتت أفكارك ويجعل حياتك فوضى!',
  'سيد التشتت': 'يسرق تركيزك ويجعلك تنسى أهدافك!',
  'إمبراطور الضعف': 'يستغل ضعفك ويمنعك من التطور!',
};

export const DungeonBattleUI = ({
  boss,
  playerHp,
  maxPlayerHp,
  playerEnergy,
  maxPlayerEnergy,
  quests,
  abilities,
  canSeeBossHp,
  onQuestComplete,
  onUseAbility,
  onExit
}: DungeonBattleUIProps) => {
  const [isAttacking, setIsAttacking] = useState(false);
  const [bossHit, setBossHit] = useState(false);
  const [abilityEffect, setAbilityEffect] = useState<string | null>(null);
  const [bossMessage, setBossMessage] = useState<string | null>(null);
  const [shakeScreen, setShakeScreen] = useState(false);

  const hpPercentage = (boss.currentHp / boss.maxHp) * 100;
  const playerHpPercentage = (playerHp / maxPlayerHp) * 100;
  const playerEnergyPercentage = (playerEnergy / maxPlayerEnergy) * 100;
  const bossLevel = boss.level || 1;

  const categoryIcons: Record<StatType, React.ReactNode> = {
    strength: <Dumbbell className="w-5 h-5" />,
    mind: <Brain className="w-5 h-5" />,
    spirit: <Heart className="w-5 h-5" />,
    quran: <BookOpen className="w-5 h-5" />,
    vitality: <Zap className="w-5 h-5" />,
  };

  // Boss taunts
  const bossTaunts = [
    "هل تظن أنك ستنتصر؟ أنت ضعيف!",
    "استسلم الآن... لن تهزمني أبداً!",
    "كل محاولاتك بلا جدوى!",
    "أنا أقوى من إرادتك!",
    "لقد فشلت من قبل... وستفشل مجدداً!",
  ];

  useEffect(() => {
    if (!boss.defeated) {
      const interval = setInterval(() => {
        const randomTaunt = bossTaunts[Math.floor(Math.random() * bossTaunts.length)];
        setBossMessage(randomTaunt);
        setTimeout(() => setBossMessage(null), 3000);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [boss.defeated]);

  const handleQuestComplete = (questId: string) => {
    setIsAttacking(true);
    setShakeScreen(true);
    
    setTimeout(() => {
      setBossHit(true);
      onQuestComplete(questId);
      
      setTimeout(() => {
        setIsAttacking(false);
        setBossHit(false);
        setShakeScreen(false);
      }, 500);
    }, 300);
  };

  const handleUseAbility = (abilityId: string) => {
    const ability = abilities.find(a => a.id === abilityId);
    if (!ability) return;
    
    setAbilityEffect(ability.name);
    onUseAbility(abilityId);
    
    setTimeout(() => {
      setAbilityEffect(null);
    }, 1500);
  };

  const availableQuests = quests.filter(q => !q.completed && q.dailyReset);
  const unlockedAbilities = abilities.filter(a => a.unlocked);

  // Determine dungeon tier color
  const getDungeonTierColor = () => {
    if (bossLevel >= 10) return { main: 'hsl(0 100% 50%)', name: 'أحمر' };
    if (bossLevel >= 5) return { main: 'hsl(270 100% 60%)', name: 'بنفسجي' };
    if (bossLevel >= 3) return { main: 'hsl(210 100% 60%)', name: 'أزرق' };
    return { main: 'hsl(0 0% 70%)', name: 'أبيض' };
  };

  const dungeonTier = getDungeonTierColor();
  const bossDescription = bossDescriptions[boss.customName || boss.name] || 'زعيم خطير يختبر قوتك!';

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      shakeScreen && "animate-shake"
    )}>
      {/* Dungeon atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-background/90 to-black" />
        
        {/* Cave walls effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(ellipse at 30% 20%, ${dungeonTier.main}20 0%, transparent 50%),
                             radial-gradient(ellipse at 70% 80%, ${dungeonTier.main}15 0%, transparent 50%)`
          }}
        />
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? dungeonTier.main : 'hsl(0 0% 50% / 0.4)',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Boss aura */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: `${dungeonTier.main}30` }}
        />
      </div>

      {/* Ability Effect Overlay */}
      {abilityEffect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
          <div className="text-center animate-scale-in">
            <Zap className="w-24 h-24 mx-auto text-primary mb-4 animate-pulse" />
            <h2 
              className="text-3xl font-bold text-primary"
              style={{ textShadow: '0 0 30px hsl(270 100% 60%)' }}
            >
              {abilityEffect}
            </h2>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/20 border border-destructive/50 text-destructive hover:bg-destructive/30"
          >
            <span>خروج</span>
          </button>
          <div 
            className="px-4 py-2 rounded-lg border-2 font-bold"
            style={{ 
              borderColor: dungeonTier.main,
              backgroundColor: `${dungeonTier.main}20`,
              color: dungeonTier.main,
              boxShadow: `0 0 20px ${dungeonTier.main}40`
            }}
          >
            المغارة LV.{bossLevel} ({dungeonTier.name})
          </div>
        </div>

        {/* Boss Section */}
        <div className={cn(
          "relative p-4 rounded-2xl mb-4 border-2",
          bossHit && "animate-damage"
        )}
          style={{
            background: 'linear-gradient(180deg, hsl(0 50% 5%), hsl(0 60% 3%))',
            borderColor: `${dungeonTier.main}60`,
            boxShadow: `0 0 60px ${dungeonTier.main}30, inset 0 0 40px hsl(0 0% 0% / 0.5)`
          }}
        >
          {/* Boss Message Bubble */}
          {bossMessage && (
            <div 
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-destructive/90 text-sm max-w-xs text-center animate-fade-in z-20"
              style={{ boxShadow: '0 0 20px hsl(0 70% 50% / 0.5)' }}
            >
              <AlertTriangle className="w-4 h-4 inline-block ml-1" />
              {bossMessage}
            </div>
          )}

          {/* Boss HP Bar - Hidden if not visible */}
          {canSeeBossHp ? (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold flex items-center gap-1" style={{ color: dungeonTier.main }}>
                  <Skull className="w-4 h-4" />
                  {boss.customName || boss.name}
                </span>
                <span className="text-muted-foreground">{boss.currentHp}/{boss.maxHp}</span>
              </div>
              <div 
                className="h-5 rounded-full overflow-hidden border"
                style={{ 
                  backgroundColor: 'hsl(0 0% 10%)',
                  borderColor: `${dungeonTier.main}40`
                }}
              >
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${hpPercentage}%`,
                    background: `linear-gradient(90deg, hsl(0 70% 40%), hsl(0 70% 50%))`,
                    boxShadow: '0 0 15px hsl(0 70% 50% / 0.5)'
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 rounded-lg bg-black/50 border border-muted/30 text-center">
              <Eye className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
              <p className="text-sm text-muted-foreground">HP مخفي - استخدم قدرة "كشف الخفي"</p>
            </div>
          )}

          {/* Boss Description */}
          <p className="text-xs text-center text-muted-foreground mb-4 px-4">
            {bossDescription}
          </p>

          {/* Boss Visual */}
          <div className="flex justify-center py-6">
            <div className={cn(
              "relative w-44 h-44 rounded-full flex items-center justify-center",
              !boss.defeated && "animate-pulse-slow"
            )}
              style={{
                background: `linear-gradient(135deg, ${dungeonTier.main}30, hsl(0 0% 5%))`,
                border: `4px solid ${dungeonTier.main}60`,
                boxShadow: `0 0 80px ${dungeonTier.main}40, inset 0 0 50px ${dungeonTier.main}20`
              }}
            >
              {boss.defeated ? (
                <Shield className="w-20 h-20 text-muted-foreground" />
              ) : (
                <>
                  <Skull className={cn(
                    "w-24 h-24",
                    isAttacking && "animate-shake"
                  )} style={{ color: dungeonTier.main }} />
                  <Flame className="absolute -top-4 left-2 w-10 h-10 text-orange-500 animate-float" />
                  <Flame className="absolute -top-6 right-4 w-8 h-8 text-red-500 animate-float" style={{ animationDelay: '0.5s' }} />
                  <Sparkles className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-500 animate-pulse" />
                  
                  {/* Phase indicator */}
                  {hpPercentage < 30 && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-30" />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Phase indicator text */}
          {!boss.defeated && hpPercentage < 30 && (
            <div className="text-center mb-2">
              <span className="px-3 py-1 rounded bg-destructive/30 text-destructive text-sm font-bold animate-pulse">
                ⚠️ وضع الغضب! ⚠️
              </span>
            </div>
          )}
        </div>

        {/* Player Stats */}
        <div 
          className="p-4 rounded-xl mb-4 border"
          style={{
            background: 'linear-gradient(135deg, hsl(210 50% 8%), hsl(210 60% 4%))',
            borderColor: 'hsl(270 100% 60% / 0.3)'
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            {/* HP */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold">HP</span>
                <span className="text-xs text-muted-foreground mr-auto">{playerHp}/{maxPlayerHp}</span>
              </div>
              <div className="h-4 rounded-full overflow-hidden bg-black/50 border border-red-500/30">
                <div 
                  className="h-full transition-all"
                  style={{ 
                    width: `${playerHpPercentage}%`,
                    background: 'linear-gradient(90deg, hsl(0 70% 40%), hsl(0 70% 55%))',
                    boxShadow: 'inset 0 0 10px hsl(0 70% 60% / 0.5)'
                  }}
                />
              </div>
            </div>
            
            {/* Energy */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold">MP</span>
                <span className="text-xs text-muted-foreground mr-auto">{playerEnergy}/{maxPlayerEnergy}</span>
              </div>
              <div className="h-4 rounded-full overflow-hidden bg-black/50 border border-blue-500/30">
                <div 
                  className="h-full transition-all"
                  style={{ 
                    width: `${playerEnergyPercentage}%`,
                    background: 'linear-gradient(90deg, hsl(210 100% 40%), hsl(210 100% 55%))',
                    boxShadow: 'inset 0 0 10px hsl(210 100% 60% / 0.5)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Abilities */}
        {unlockedAbilities.length > 0 && (
          <div 
            className="p-4 rounded-xl mb-4 border"
            style={{
              background: 'linear-gradient(135deg, hsl(270 30% 8%), hsl(270 40% 4%))',
              borderColor: 'hsl(270 100% 60% / 0.3)'
            }}
          >
            <h3 className="font-bold mb-3 flex items-center gap-2 text-primary">
              <Zap className="w-5 h-5" />
              المهارات النشطة
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {unlockedAbilities.slice(0, 4).map(ability => (
                <button
                  key={ability.id}
                  onClick={() => handleUseAbility(ability.id)}
                  disabled={boss.defeated}
                  className={cn(
                    "p-3 rounded-xl text-center transition-all relative overflow-hidden",
                    "bg-gradient-to-b from-primary/20 to-primary/5",
                    "border border-primary/40",
                    "hover:border-primary/80 hover:scale-105",
                    "active:scale-95",
                    boss.defeated && "opacity-50 cursor-not-allowed"
                  )}
                  style={{
                    boxShadow: '0 0 15px hsl(270 100% 60% / 0.2)'
                  }}
                >
                  <Zap className="w-6 h-6 mx-auto text-primary mb-1" />
                  <span className="text-[10px] block truncate">{ability.name.replace('قدرة ', '')}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Attack Quests */}
        <div 
          className="p-4 rounded-xl border"
          style={{
            background: 'linear-gradient(135deg, hsl(0 30% 8%), hsl(0 40% 4%))',
            borderColor: `${dungeonTier.main}30`
          }}
        >
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: dungeonTier.main }}>
            <Swords className="w-5 h-5" />
            هجمات المهام
          </h3>
          
          {availableQuests.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {availableQuests.slice(0, 6).map(quest => (
                <button
                  key={quest.id}
                  onClick={() => handleQuestComplete(quest.id)}
                  disabled={boss.defeated || isAttacking}
                  className={cn(
                    "p-3 rounded-xl text-right transition-all relative overflow-hidden group",
                    "bg-gradient-to-br from-card/60 to-card/30",
                    "border border-primary/30",
                    "hover:border-primary/60 hover:scale-[1.02]",
                    "active:scale-[0.98]",
                    isAttacking && "animate-attack",
                    boss.defeated && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {/* Attack effect on hover */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center gap-2 mb-1 relative z-10">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      quest.category === 'strength' && "bg-red-500/20 text-red-400",
                      quest.category === 'mind' && "bg-blue-500/20 text-blue-400",
                      quest.category === 'spirit' && "bg-purple-500/20 text-purple-400",
                      quest.category === 'quran' && "bg-green-500/20 text-green-400"
                    )}>
                      {categoryIcons[quest.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{quest.title}</div>
                      <div className="text-[10px] text-destructive flex items-center gap-1">
                        <Swords className="w-3 h-3" />
                        +{quest.xpReward} ضرر
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Skull className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>لا توجد مهمات متاحة حالياً</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
