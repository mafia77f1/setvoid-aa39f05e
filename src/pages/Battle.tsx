import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { Skull, Swords, Shield, Zap, ArrowRight, Trophy, Dumbbell, Brain, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState, completeQuest, resetBoss } = useGameState();
  const [attacking, setAttacking] = useState(false);
  const [bossHit, setBossHit] = useState(false);
  
  const boss = gameState.currentBoss;
  const bossQuests = boss 
    ? gameState.quests.filter(q => boss.requiredQuests.includes(q.id))
    : [];
  const completedBossQuests = bossQuests.filter(q => q.completed).length;
  const hpPercentage = boss ? (boss.currentHp / boss.maxHp) * 100 : 0;

  const abilities = gameState.abilities.filter(a => a.unlocked);

  const categoryIcons = {
    strength: Dumbbell,
    mind: Brain,
    spirit: Heart,
    quran: BookOpen,
  };

  const handleQuestComplete = (questId: string) => {
    setAttacking(true);
    setTimeout(() => {
      setAttacking(false);
      setBossHit(true);
      
      completeQuest(questId);
      
      setTimeout(() => {
        setBossHit(false);
        
        const updatedBoss = gameState.currentBoss;
        if (updatedBoss && updatedBoss.currentHp <= 0) {
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
    }, 300);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">لا يوجد زعيم حالي</p>
          <Button onClick={() => navigate('/boss')}>
            العودة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-destructive/5 to-background">
      {/* Battle Header */}
      <header className="relative px-4 py-4 border-b border-destructive/30">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/boss')}
          className="absolute right-4 top-4"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-destructive/20 border border-destructive/40">
            <Swords className="w-4 h-4 text-destructive" />
            <span className="text-xs font-bold text-destructive">BATTLE IN PROGRESS</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Boss Display */}
        <div className="system-panel p-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-destructive">{boss.name}</h2>
            <p className="text-sm text-muted-foreground">{boss.description}</p>
          </div>

          {/* Boss Visual */}
          <div className="relative h-48 mb-6 flex items-center justify-center">
            <div className={cn(
              "relative w-36 h-36 rounded-full border-4 flex items-center justify-center transition-all",
              boss.defeated 
                ? "border-secondary/50 bg-secondary/10" 
                : "border-destructive/50 bg-destructive/10",
              bossHit && "animate-damage"
            )}>
              {boss.defeated ? (
                <Trophy className="w-16 h-16 text-secondary" />
              ) : (
                <Skull className={cn("w-16 h-16 text-destructive", attacking && "animate-shake")} />
              )}
            </div>
            
            {/* Glow Effect */}
            {!boss.defeated && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full bg-destructive/20 blur-3xl animate-glow-pulse" />
              </div>
            )}
          </div>

          {/* HP Bar */}
          <div className="max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">HP</span>
              <span className="text-sm font-bold text-destructive">{boss.currentHp} / {boss.maxHp}</span>
            </div>
            <div className="stats-bar h-5 border-destructive/30">
              <div 
                className="stats-bar-fill bg-destructive transition-all duration-500"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-muted-foreground">
                المهمات المكتملة: {completedBossQuests} / {bossQuests.length}
              </span>
            </div>
          </div>
        </div>

        {/* Victory State */}
        {boss.defeated && (
          <div className="system-panel p-6 text-center border-secondary/50">
            <Shield className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary mb-2">تم القضاء على العادة السيئة!</h3>
            <p className="text-muted-foreground mb-4">لقد أثبت قوتك وتغلبت على ضعفك</p>
            <Button onClick={handleNewBoss} className="gap-2">
              <Swords className="w-4 h-4" />
              تحدي زعيم جديد
            </Button>
          </div>
        )}

        {/* Battle Actions */}
        {!boss.defeated && (
          <>
            {/* Available Abilities */}
            {abilities.length > 0 && (
              <div className="system-panel p-4">
                <h3 className="text-sm font-bold mb-3 text-primary">القدرات المتاحة</h3>
                <div className="grid grid-cols-2 gap-2">
                  {abilities.slice(0, 4).map(ability => {
                    const Icon = categoryIcons[ability.category];
                    return (
                      <div 
                        key={ability.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/30"
                      >
                        <div className="ability-icon w-8 h-8">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate">{ability.name}</div>
                          <div className="text-[10px] text-muted-foreground">Lv.{ability.level}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quest Actions */}
            <div className="system-panel p-4">
              <h3 className="text-sm font-bold mb-3 text-destructive">هجمات متاحة</h3>
              <p className="text-xs text-muted-foreground mb-4">أكمل المهمات التالية لإلحاق الضرر بالزعيم</p>
              
              <div className="space-y-3">
                {bossQuests.map(quest => {
                  const Icon = categoryIcons[quest.category];
                  return (
                    <button
                      key={quest.id}
                      onClick={() => !quest.completed && handleQuestComplete(quest.id)}
                      disabled={quest.completed}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-right",
                        quest.completed
                          ? "border-secondary/30 bg-secondary/10 opacity-70"
                          : "border-destructive/30 bg-destructive/10 hover:bg-destructive/20 hover:border-destructive/50"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        quest.completed ? "bg-secondary/20" : "bg-destructive/20"
                      )}>
                        {quest.completed ? (
                          <Shield className="w-5 h-5 text-secondary" />
                        ) : (
                          <Zap className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "font-semibold text-sm",
                          quest.completed && "line-through"
                        )}>
                          {quest.title}
                        </div>
                        <div className="text-xs text-muted-foreground">{quest.description}</div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-destructive">
                          -{Math.floor(boss.maxHp / bossQuests.length)} HP
                        </div>
                      </div>
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