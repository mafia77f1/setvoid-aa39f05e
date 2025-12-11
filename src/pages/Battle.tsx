import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Skull, Swords, Shield, Zap, ArrowRight, Trophy, Dumbbell, Brain, Heart, BookOpen, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState, completeQuest, resetBoss, useAbility } = useGameState();
  const { playAttack, playVictory } = useSoundEffects();
  const [attacking, setAttacking] = useState(false);
  const [bossHit, setBossHit] = useState(false);
  const [abilityEffect, setAbilityEffect] = useState<string | null>(null);
  
  const boss = gameState.currentBoss;
  const bossQuests = boss 
    ? gameState.quests.filter(q => boss.requiredQuests.includes(q.id))
    : [];
  const completedBossQuests = bossQuests.filter(q => q.completed).length;
  const hpPercentage = boss ? (boss.currentHp / boss.maxHp) * 100 : 0;
  const playerHpPercentage = (gameState.hp / gameState.maxHp) * 100;
  const playerEnergyPercentage = (gameState.energy / gameState.maxEnergy) * 100;

  const abilities = gameState.abilities.filter(a => a.unlocked);

  const categoryIcons = {
    strength: Dumbbell,
    mind: Brain,
    spirit: Heart,
    quran: BookOpen,
  };

  const handleQuestComplete = (questId: string) => {
    playAttack();
    setAttacking(true);
    setTimeout(() => {
      setAttacking(false);
      setBossHit(true);
      
      completeQuest(questId);
      
      setTimeout(() => {
        setBossHit(false);
        
        // Check if boss is defeated
        if (boss && boss.currentHp <= Math.floor(boss.maxHp / bossQuests.length)) {
          playVictory();
          toast({
            title: 'انتصار مجيد!',
            description: 'لقد هزمت الزعيم وتغلبت على العادة السيئة!',
          });
        } else {
          toast({
            title: 'ضربة ناجحة!',
            description: 'لقد أضعفت الزعيم، استمر في القتال!',
          });
        }
      }, 500);
    }, 400);
  };

  const handleUseAbility = (abilityId: string, abilityName: string) => {
    useAbility(abilityId);
    setAbilityEffect(abilityName);
    setTimeout(() => setAbilityEffect(null), 2000);
    toast({
      title: 'قدرة مفعلة!',
      description: `تم استخدام ${abilityName}`,
    });
  };

  const handleNewBoss = () => {
    resetBoss();
    toast({
      title: 'تحدي جديد!',
      description: 'زعيم جديد في انتظارك',
    });
  };

  if (!boss) {
    return (
      <div className="min-h-screen flex items-center justify-center dungeon-bg">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">لا يوجد زعيم حالي</p>
          <Button onClick={() => navigate('/boss')}>العودة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dungeon-bg relative overflow-hidden">
      {/* Ability Effect Overlay */}
      {abilityEffect && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="text-4xl font-bold text-primary animate-level-up glow-text">
            {abilityEffect}
          </div>
          <div className="absolute inset-0 bg-primary/10 animate-pulse" />
        </div>
      )}

      {/* Dungeon Atmosphere Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/50 animate-float" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-destructive/50 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-primary/30 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Battle Header */}
      <header className="relative px-4 py-4 border-b border-destructive/30 bg-black/40 backdrop-blur-sm z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/boss')}
          className="absolute right-4 top-4"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-destructive/20 border border-destructive/40 animate-border-glow">
            <Swords className="w-4 h-4 text-destructive" />
            <span className="text-xs font-bold text-destructive tracking-wider">BATTLE IN PROGRESS</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4 relative z-10">
        {/* Boss HP Bar - Top */}
        <div className="bg-black/60 rounded-lg p-3 border border-destructive/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Skull className="w-5 h-5 text-destructive" />
              <span className="font-bold text-destructive">{boss.customName || boss.name}</span>
            </div>
            <span className="text-sm text-destructive">{boss.currentHp}/{boss.maxHp}</span>
          </div>
          <div className="h-4 rounded-full bg-black/60 border border-destructive/40 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                "bg-gradient-to-r from-destructive to-orange-500",
                bossHit && "animate-shake"
              )}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>

        {/* Boss Visual Area */}
        <div className="relative h-[200px] flex items-center justify-center">
          {/* Boss Glow */}
          {!boss.defeated && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-destructive/20 blur-3xl animate-glow-pulse" />
            </div>
          )}

          {/* Boss Figure */}
          <div className={cn(
            "relative w-40 h-40 rounded-full border-4 flex items-center justify-center transition-all z-10",
            boss.defeated 
              ? "border-secondary/50 bg-secondary/10" 
              : "border-destructive/60 bg-gradient-to-b from-destructive/30 to-black/50",
            bossHit && "animate-damage"
          )}>
            {boss.defeated ? (
              <Trophy className="w-20 h-20 text-secondary" />
            ) : (
              <>
                <Skull className={cn("w-20 h-20 text-destructive", attacking && "animate-shake")} />
                {/* Flames around boss */}
                <Flame className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-orange-500/70 animate-float" />
              </>
            )}
          </div>
        </div>

        {/* Victory State */}
        {boss.defeated && (
          <div className="notification-panel p-6 text-center border-secondary/50">
            <Shield className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary mb-2">تم القضاء على الزعيم!</h3>
            <p className="text-muted-foreground mb-4">لقد أثبت قوتك وتغلبت على ضعفك</p>
            <Button onClick={handleNewBoss} className="gap-2 bg-primary hover:bg-primary/80">
              <Swords className="w-4 h-4" />
              تحدي زعيم جديد
            </Button>
          </div>
        )}

        {/* Battle Actions */}
        {!boss.defeated && (
          <>
            {/* Player Stats */}
            <div className="bg-black/60 rounded-lg p-3 border border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-primary">{gameState.playerName}</span>
                <span className="text-xs text-muted-foreground">Lv.{gameState.totalLevel}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-destructive w-8">HP</span>
                  <div className="flex-1 h-3 rounded-full bg-black/60 border border-destructive/30 overflow-hidden">
                    <div className="h-full rounded-full hp-bar transition-all" style={{ width: `${playerHpPercentage}%` }} />
                  </div>
                  <span className="text-xs text-destructive w-12 text-left">{gameState.hp}/{gameState.maxHp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[hsl(200_100%_60%)] w-8">MP</span>
                  <div className="flex-1 h-3 rounded-full bg-black/60 border border-[hsl(200_100%_50%/0.3)] overflow-hidden">
                    <div className="h-full rounded-full energy-bar transition-all" style={{ width: `${playerEnergyPercentage}%` }} />
                  </div>
                  <span className="text-xs text-[hsl(200_100%_60%)] w-12 text-left">{gameState.energy}/{gameState.maxEnergy}</span>
                </div>
              </div>
            </div>

            {/* Available Abilities */}
            {abilities.length > 0 && (
              <div className="system-panel p-3">
                <h3 className="text-xs font-bold mb-2 text-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  القدرات
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {abilities.slice(0, 4).map(ability => {
                    const Icon = categoryIcons[ability.category];
                    const canUse = !ability.lastUsed || 
                      (new Date().getTime() - new Date(ability.lastUsed).getTime()) / (1000 * 60 * 60 * 24) >= ability.cooldownDays;
                    
                    return (
                      <button 
                        key={ability.id}
                        onClick={() => canUse && handleUseAbility(ability.id, ability.name)}
                        disabled={!canUse}
                        className={cn(
                          "ability-icon w-full aspect-square transition-all",
                          canUse 
                            ? "hover:scale-110 cursor-pointer" 
                            : "opacity-40 cursor-not-allowed"
                        )}
                      >
                        <Icon className="w-5 h-5 text-primary" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quest Actions - Attack Buttons */}
            <div className="system-panel p-3">
              <h3 className="text-xs font-bold mb-3 text-destructive flex items-center gap-2">
                <Zap className="w-4 h-4" />
                هجمات متاحة
              </h3>
              
              <div className="space-y-2">
                {bossQuests.map(quest => {
                  const Icon = categoryIcons[quest.category];
                  const damage = Math.floor(boss.maxHp / bossQuests.length);
                  
                  return (
                    <button
                      key={quest.id}
                      onClick={() => !quest.completed && handleQuestComplete(quest.id)}
                      disabled={quest.completed}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-right",
                        quest.completed
                          ? "border-secondary/30 bg-secondary/10 opacity-60"
                          : "border-destructive/40 bg-destructive/10 hover:bg-destructive/20 hover:border-destructive/60 hover:scale-[1.01]"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        quest.completed ? "bg-secondary/20" : "bg-destructive/20"
                      )}>
                        {quest.completed ? (
                          <Shield className="w-5 h-5 text-secondary" />
                        ) : (
                          <Icon className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "font-semibold text-sm",
                          quest.completed && "line-through text-muted-foreground"
                        )}>
                          {quest.title}
                        </div>
                        <div className="text-xs text-muted-foreground">{quest.description}</div>
                      </div>
                      {!quest.completed && (
                        <div className="text-left">
                          <div className="text-sm font-bold text-destructive">-{damage} HP</div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Battle;
