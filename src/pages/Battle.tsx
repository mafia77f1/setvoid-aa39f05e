import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
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
  ArrowRight,
  Flame,
  Sparkles
} from 'lucide-react';
import { StatType } from '@/types/game';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState, completeQuest, useAbility, resetBoss } = useGameState();
  const { playAttack, playVictory, playUseAbility, playBossDamage } = useSoundEffects();
  const [isAttacking, setIsAttacking] = useState(false);
  const [bossHit, setBossHit] = useState(false);
  const [abilityEffect, setAbilityEffect] = useState<string | null>(null);
  const [showVictory, setShowVictory] = useState(false);

  const boss = gameState.currentBoss;

  useEffect(() => {
    if (boss && boss.defeated && !showVictory) {
      setShowVictory(true);
      playVictory();
    }
  }, [boss?.defeated, showVictory, playVictory]);

  if (!boss) {
    navigate('/boss');
    return null;
  }

  const hpPercentage = (boss.currentHp / boss.maxHp) * 100;
  const playerHpPercentage = (gameState.hp / gameState.maxHp) * 100;
  const playerEnergyPercentage = (gameState.energy / gameState.maxEnergy) * 100;
  const bossLevel = Math.floor(boss.maxHp / 50) + 1;

  const categoryIcons: Record<StatType, React.ReactNode> = {
    strength: <Dumbbell className="w-5 h-5" />,
    mind: <Brain className="w-5 h-5" />,
    spirit: <Heart className="w-5 h-5" />,
    quran: <BookOpen className="w-5 h-5" />,
  };

  const handleQuestComplete = (questId: string) => {
    setIsAttacking(true);
    playAttack();
    
    setTimeout(() => {
      setBossHit(true);
      playBossDamage();
      completeQuest(questId);
      
      setTimeout(() => {
        setIsAttacking(false);
        setBossHit(false);
        toast({
          title: "ضربة ناجحة!",
          description: "تم توجيه ضرر للزعيم",
        });
      }, 500);
    }, 300);
  };

  const handleUseAbility = (abilityId: string) => {
    const ability = gameState.abilities.find(a => a.id === abilityId);
    if (!ability) return;
    
    setAbilityEffect(ability.name);
    playUseAbility();
    useAbility(abilityId);
    
    setTimeout(() => {
      setAbilityEffect(null);
      toast({
        title: `تم تفعيل ${ability.name}!`,
        description: ability.effect,
      });
    }, 1500);
  };

  const handleNewBoss = () => {
    resetBoss();
    setShowVictory(false);
    navigate('/boss');
  };

  const availableQuests = gameState.quests.filter(q => !q.completed && q.dailyReset);
  const unlockedAbilities = gameState.abilities.filter(a => a.unlocked);

  return (
    <div className="min-h-screen dungeon-bg relative overflow-hidden">
      {/* Cave/Dungeon atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        
        {/* Fog effects */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary/10 to-transparent" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Red danger glow for boss */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-destructive/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Ability Effect Overlay */}
      {abilityEffect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
          <div className="text-center animate-ability-activate">
            <Zap className="w-24 h-24 mx-auto text-primary mb-4" />
            <h2 className="text-3xl font-bold text-primary glow-text">{abilityEffect}</h2>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/boss')}
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <ArrowRight className="w-5 h-5" />
            <span>خروج</span>
          </button>
          <div className="px-4 py-1 rounded bg-destructive/20 border border-destructive/50">
            <span className="text-sm font-bold text-destructive">المغارة LV.{bossLevel}</span>
          </div>
        </div>

        {/* Boss Section */}
        <div className={cn(
          "relative p-4 rounded-2xl mb-4",
          "bg-gradient-to-b from-black/60 to-destructive/10",
          "border-2 border-destructive/40",
          bossHit && "animate-damage"
        )}
          style={{
            boxShadow: '0 0 60px hsl(0 70% 40% / 0.3), inset 0 0 40px hsl(0 0% 0% / 0.5)'
          }}
        >
          {/* Boss HP Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-destructive font-bold flex items-center gap-1">
                <Skull className="w-4 h-4" />
                {boss.customName || boss.name}
              </span>
              <span className="text-muted-foreground">{boss.currentHp}/{boss.maxHp}</span>
            </div>
            <div className="h-5 rounded-full overflow-hidden bg-black/60 border border-destructive/40">
              <div 
                className="h-full hp-bar transition-all duration-500"
                style={{ 
                  width: `${hpPercentage}%`,
                  boxShadow: '0 0 15px hsl(0 70% 50% / 0.5)'
                }}
              />
            </div>
          </div>

          {/* Boss Visual */}
          <div className="flex justify-center py-8">
            <div className={cn(
              "relative w-40 h-40 rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-destructive/30 to-black/60",
              "border-4 border-destructive/50",
              !boss.defeated && "animate-pulse-slow"
            )}
              style={{
                boxShadow: '0 0 80px hsl(0 70% 40% / 0.5), inset 0 0 50px hsl(0 70% 30% / 0.4)'
              }}
            >
              {boss.defeated ? (
                <Shield className="w-20 h-20 text-muted-foreground" />
              ) : (
                <>
                  <Skull className={cn(
                    "w-20 h-20 text-destructive",
                    isAttacking && "animate-shake"
                  )} />
                  <Flame className="absolute -top-4 left-2 w-8 h-8 text-orange-500 animate-float" />
                  <Flame className="absolute -top-6 right-4 w-6 h-6 text-red-500 animate-float" style={{ animationDelay: '0.5s' }} />
                  <Sparkles className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-500 animate-pulse" />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Victory State */}
        {showVictory && (
          <div className="system-panel p-6 mb-4 text-center animate-modal-appear">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 border-2 border-green-500/60 flex items-center justify-center">
              <Swords className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">النصر!</h2>
            <p className="text-muted-foreground mb-4">لقد هزمت {boss.customName || boss.name}</p>
            <Button onClick={handleNewBoss} className="w-full bg-primary hover:bg-primary/80">
              تحدي زعيم جديد
            </Button>
          </div>
        )}

        {/* Player Stats */}
        <div className="system-panel p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            {/* HP */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-xs">HP</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden bg-black/50 border border-red-500/30">
                <div 
                  className="h-full hp-bar"
                  style={{ width: `${playerHpPercentage}%` }}
                />
              </div>
            </div>
            
            {/* Energy */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-xs">MP</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden bg-black/50 border border-blue-500/30">
                <div 
                  className="h-full energy-bar"
                  style={{ width: `${playerEnergyPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Abilities */}
        {unlockedAbilities.length > 0 && (
          <div className="system-panel p-4 mb-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              القدرات
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {unlockedAbilities.slice(0, 4).map(ability => (
                <button
                  key={ability.id}
                  onClick={() => handleUseAbility(ability.id)}
                  disabled={boss.defeated}
                  className={cn(
                    "p-3 rounded-lg text-center transition-all",
                    "bg-primary/10 border border-primary/30",
                    "hover:bg-primary/20 hover:scale-105",
                    "active:scale-95",
                    boss.defeated && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Zap className="w-6 h-6 mx-auto text-primary mb-1" />
                  <span className="text-[10px] block truncate">{ability.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Attack Quests */}
        <div className="system-panel p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Swords className="w-5 h-5 text-destructive" />
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
                    "p-3 rounded-xl text-right transition-all relative overflow-hidden",
                    "bg-gradient-to-br from-card/80 to-card/40",
                    "border border-primary/30",
                    "hover:border-primary/60 hover:scale-[1.02]",
                    "active:scale-[0.98]",
                    isAttacking && "animate-attack",
                    boss.defeated && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      quest.category === 'strength' && "bg-red-500/20 text-red-400",
                      quest.category === 'mind' && "bg-blue-500/20 text-blue-400",
                      quest.category === 'spirit' && "bg-purple-500/20 text-purple-400",
                      quest.category === 'quran' && "bg-green-500/20 text-green-400"
                    )}>
                      {categoryIcons[quest.category]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{quest.title}</div>
                      <div className="text-[10px] text-primary">+{quest.xpReward} ضرر</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>لا توجد مهمات متاحة حالياً</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Battle;
