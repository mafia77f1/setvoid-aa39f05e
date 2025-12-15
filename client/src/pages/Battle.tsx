import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { DungeonBattleUI } from '@/components/DungeonBattleUI';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Skull, 
  Swords, 
  Shield,
  Trophy,
  Sparkles,
  Gift
} from 'lucide-react';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState, completeQuest, useAbility, resetBoss } = useGameState();
  const { playAttack, playVictory, playUseAbility, playBossDamage } = useSoundEffects();
  const [showVictory, setShowVictory] = useState(false);
  const [loot, setLoot] = useState<{ gold: number; shadowPoints: number; item?: string } | null>(null);

  const boss = gameState.currentBoss;

  // Check if player can see boss HP (via Quran ability)
  const canSeeBossHp = gameState.abilities.find(a => a.id === 'a7')?.unlocked || false;

  useEffect(() => {
    if (boss && boss.defeated && !showVictory) {
      setShowVictory(true);
      playVictory();
      
      // Generate loot
      const bossLevel = boss.level || 1;
      const goldReward = 50 * bossLevel + Math.floor(Math.random() * 50);
      const shadowReward = bossLevel >= 3 ? Math.floor(bossLevel * 2 + Math.random() * 5) : 0;
      
      setLoot({
        gold: goldReward,
        shadowPoints: shadowReward,
        item: bossLevel >= 5 ? 'سلاح نادر' : undefined
      });
    }
  }, [boss?.defeated, showVictory, playVictory]);

  if (!boss) {
    navigate('/boss');
    return null;
  }

  const handleQuestComplete = (questId: string) => {
    playAttack();
    setTimeout(() => {
      playBossDamage();
      completeQuest(questId);
      toast({
        title: "ضربة ناجحة!",
        description: "تم توجيه ضرر للزعيم",
      });
    }, 300);
  };

  const handleUseAbility = (abilityId: string) => {
    const ability = gameState.abilities.find(a => a.id === abilityId);
    if (!ability) return;
    
    playUseAbility();
    useAbility(abilityId);
    
    toast({
      title: `تم تفعيل ${ability.name}!`,
      description: ability.effect,
    });
  };

  const handleNewBoss = () => {
    resetBoss();
    setShowVictory(false);
    setLoot(null);
    navigate('/boss');
  };

  const handleExit = () => {
    navigate('/boss');
  };

  // Victory Screen
  if (showVictory) {
    const bossLevel = boss.level || 1;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black via-background to-black">
        <div 
          className="max-w-md w-full p-8 rounded-2xl border-2 animate-scale-in text-center"
          style={{
            background: 'linear-gradient(180deg, hsl(120 30% 8%), hsl(120 40% 4%))',
            borderColor: 'hsl(120 70% 50%)',
            boxShadow: '0 0 60px hsl(120 70% 50% / 0.4)'
          }}
        >
          {/* Victory Icon */}
          <div 
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center animate-bounce"
            style={{
              background: 'linear-gradient(135deg, hsl(120 70% 40%), hsl(120 70% 30%))',
              boxShadow: '0 0 40px hsl(120 70% 50% / 0.6)'
            }}
          >
            <Trophy className="w-12 h-12 text-white" />
          </div>

          <h1 
            className="text-3xl font-bold mb-2"
            style={{ 
              color: 'hsl(120 70% 60%)',
              textShadow: '0 0 30px hsl(120 70% 50% / 0.6)'
            }}
          >
            النصر!
          </h1>
          <p className="text-muted-foreground mb-6">
            لقد هزمت {boss.customName || boss.name}
          </p>

          {/* Loot Section */}
          {loot && (
            <div 
              className="p-4 rounded-xl mb-6 border"
              style={{
                background: 'linear-gradient(135deg, hsl(45 50% 10%), hsl(45 60% 5%))',
                borderColor: 'hsl(45 100% 50% / 0.5)'
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Gift className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-yellow-500">المكافآت</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <span className="text-2xl">🪙</span>
                  <div className="text-lg font-bold text-yellow-500">+{loot.gold}</div>
                  <div className="text-xs text-muted-foreground">ذهب</div>
                </div>
                {loot.shadowPoints > 0 && (
                  <div className="text-center">
                    <Sparkles className="w-6 h-6 mx-auto text-primary" />
                    <div className="text-lg font-bold text-primary">+{loot.shadowPoints}</div>
                    <div className="text-xs text-muted-foreground">نقاط ظل</div>
                  </div>
                )}
              </div>

              {loot.item && (
                <div className="mt-4 p-2 rounded-lg bg-primary/20 border border-primary/40">
                  <div className="flex items-center justify-center gap-2">
                    <Swords className="w-4 h-4 text-primary" />
                    <span className="text-primary font-bold">{loot.item}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={handleNewBoss} 
            className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/80"
          >
            <Skull className="w-5 h-5 ml-2" />
            تحدي زعيم جديد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DungeonBattleUI
      boss={boss}
      playerHp={gameState.hp}
      maxPlayerHp={gameState.maxHp}
      playerEnergy={gameState.energy}
      maxPlayerEnergy={gameState.maxEnergy}
      quests={gameState.quests}
      abilities={gameState.abilities}
      canSeeBossHp={canSeeBossHp}
      onQuestComplete={handleQuestComplete}
      onUseAbility={handleUseAbility}
      onExit={handleExit}
    />
  );
};

export default Battle;
