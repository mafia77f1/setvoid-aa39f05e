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
  Gift,
  Zap,
  User,
  Ghost
} from 'lucide-react';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState, completeQuest, useAbility, resetBoss } = useGameState();
  const { playAttack, playVictory, playUseAbility, playBossDamage } = useSoundEffects();
  const [showVictory, setShowVictory] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [loot, setLoot] = useState<{ gold: number; shadowPoints: number; item?: string } | null>(null);

  const boss = gameState.currentBoss;
  const canSeeBossHp = gameState.abilities.find(a => a.id === 'a7')?.unlocked || false;

  useEffect(() => {
    if (boss && boss.defeated && !showVictory) {
      setShowVictory(true);
      playVictory();
      const bossLevel = boss.level || 1;
      const goldReward = 50 * bossLevel + Math.floor(Math.random() * 50);
      const shadowReward = bossLevel >= 3 ? Math.floor(bossLevel * 2 + Math.random() * 5) : 0;
      setLoot({
        gold: goldReward,
        shadowPoints: shadowReward,
        item: bossLevel >= 5 ? 'سيف الظلال العظيم' : undefined
      });
    }
  }, [boss?.defeated, showVictory, playVictory]);

  if (!boss) {
    navigate('/boss');
    return null;
  }

  const handleQuestComplete = (questId: string) => {
    setIsAttacking(true);
    playAttack();
    setTimeout(() => {
      playBossDamage();
      completeQuest(questId);
      setIsAttacking(false);
      toast({
        title: "تم تنفيذ المهارة!",
        description: "ضرر حرج للزعيم",
      });
    }, 500);
  };

  const handleUseAbility = (abilityId: string) => {
    playUseAbility();
    useAbility(abilityId);
  };

  // شاشة النصر بتصميم Solo Leveling
  if (showVictory) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0c] overflow-hidden relative">
        {/* خلفية مشعة */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50" />
        
        <div className="max-w-md w-full p-8 rounded-none border-t-2 border-b-2 border-purple-500 bg-black/80 backdrop-blur-xl relative z-10 text-center shadow-[0_0_50px_rgba(168,85,247,0.2)]">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-purple-600 px-6 py-1 skew-x-[-20deg] border-2 border-white">
            <span className="text-white font-black italic text-xl uppercase tracking-tighter">Level Up</span>
          </div>

          <h1 className="text-5xl font-black text-white mb-2 italic tracking-tighter">لقد هزمت الزعيم</h1>
          <p className="text-purple-400 font-mono mb-8 uppercase tracking-widest">[تم الحصول على المكافآت]</p>

          {loot && (
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 bg-white/5 border-l-4 border-yellow-500">
                <span className="text-gray-400 font-bold">الذهب</span>
                <span className="text-yellow-500 font-black text-xl">+{loot.gold} G</span>
              </div>
              {loot.shadowPoints > 0 && (
                <div className="flex justify-between items-center p-3 bg-white/5 border-l-4 border-purple-500">
                  <span className="text-gray-400 font-bold">نقاط الظل</span>
                  <span className="text-purple-500 font-black text-xl">+{loot.shadowPoints} SP</span>
                </div>
              )}
              {loot.item && (
                <div className="p-4 bg-purple-900/20 border border-purple-500/50 flex items-center gap-4">
                  <div className="p-2 bg-purple-500"><Gift className="text-white" /></div>
                  <div className="text-right">
                    <p className="text-xs text-purple-300">عنصر جديد</p>
                    <p className="text-white font-bold">{loot.item}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={() => { resetBoss(); navigate('/boss'); }} 
            className="w-full h-16 bg-white text-black hover:bg-purple-500 hover:text-white transition-all font-black text-xl rounded-none border-r-4 border-purple-600"
          >
            العودة للمقبرة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-sans relative overflow-hidden">
      {/* منطقة المواجهة - Arena */}
      <div className="h-[50vh] relative bg-gradient-to-b from-purple-100 to-white flex items-center justify-center">
        {/* المنصة */}
        <div className="absolute bottom-10 w-full h-24 bg-gradient-to-t from-black/20 to-transparent flex items-center justify-center">
             <div className="w-[80%] h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_15px_red]" />
        </div>

        {/* الشخصية (اللاعب) */}
        <div className={cn(
          "absolute left-[15%] bottom-16 transition-all duration-300",
          isAttacking ? "translate-x-20 scale-110" : ""
        )}>
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full" />
            <div className="bg-white border-4 border-black p-4 rounded-full relative z-10 shadow-2xl">
              <User size={60} className="text-black" />
            </div>
            <div className="mt-4 bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase tracking-tighter italic">
              Level {gameState.level}
            </div>
          </div>
        </div>

        {/* الوحش (الظل) */}
        <div className="absolute right-[15%] bottom-16 animate-pulse">
          <div className="relative">
             <div className="absolute -inset-10 bg-purple-600/30 blur-3xl rounded-full animate-bounce" />
             <div className="bg-purple-950 border-4 border-black p-6 rounded-2xl relative z-10 rotate-12 shadow-[10px_10px_0px_#000]">
               <Ghost size={80} className="text-purple-400" />
             </div>
             <div className="mt-4 bg-purple-600 text-white text-[10px] px-2 py-0.5 font-bold uppercase text-center italic">
               Boss: {boss.name}
            </div>
          </div>
        </div>

        {/* تفاصيل الطاقة و HP فوق الرؤوس */}
        <div className="absolute top-10 w-full px-10 flex justify-between items-start">
            <div className="space-y-2 w-48">
                <div className="flex justify-between text-[10px] font-black uppercase italic">
                    <span>Player HP</span>
                    <span>{gameState.hp}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 border border-black overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }} />
                </div>
            </div>

            <div className="space-y-2 w-48 text-left">
                <div className="flex justify-between text-[10px] font-black uppercase italic">
                    <span>{canSeeBossHp ? boss.hp : '????'}</span>
                    <span>Boss HP</span>
                </div>
                <div className="h-2 w-full bg-gray-200 border border-black overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(boss.hp / boss.maxHp) * 100}%` }} />
                </div>
            </div>
        </div>
      </div>

      {/* منطقة الأوامر والقوائم */}
      <div className="flex-1 bg-white border-t-4 border-black p-6">
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
          onExit={() => navigate('/boss')}
        />
      </div>
    </div>
  );
};

export default Battle;
