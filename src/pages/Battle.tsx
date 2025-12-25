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
  Trophy,
  Sparkles,
  Gift,
  Zap,
  User,
  ShieldAlert
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
      setLoot({
        gold: 50 * bossLevel + Math.floor(Math.random() * 50),
        shadowPoints: bossLevel >= 3 ? Math.floor(bossLevel * 2 + Math.random() * 5) : 0,
        item: bossLevel >= 5 ? 'خنجر الملك الملعون' : undefined
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
      toast({ title: "ضربة قاضية!", description: "تم توجيه ضرر بنظام الظل" });
    }, 400);
  };

  // شاشة النصر بنظام Solo Leveling System
  if (showVictory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
        <div className="w-full max-w-md border-2 border-purple-500 bg-black/90 p-8 shadow-[0_0_40px_rgba(168,85,247,0.4)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <Trophy className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-black text-center text-white italic mb-2 tracking-tighter uppercase">Quest Cleared</h1>
          <p className="text-center text-purple-400 font-mono text-sm mb-6">[تمت تصفية المغارة بنجاح]</p>
          
          <div className="space-y-3 mb-8">
            <div className="flex justify-between border-b border-white/10 py-2">
              <span className="text-gray-400">الذهب المكتسب:</span>
              <span className="text-yellow-500 font-bold">+{loot?.gold} G</span>
            </div>
            <div className="flex justify-between border-b border-white/10 py-2">
              <span className="text-gray-400">نقاط الخبرة:</span>
              <span className="text-purple-500 font-bold">+{loot?.shadowPoints} XP</span>
            </div>
          </div>

          <Button onClick={() => { resetBoss(); navigate('/boss'); }} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-14 rounded-none border-b-4 border-purple-900">
            تأكيد المكافأة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      {/* سماء المغارة */}
      <div className="h-[45vh] relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black">
        
        {/* المنصة (Arena) */}
        <div className="absolute bottom-4 w-full flex justify-center">
            <div className="w-[90%] h-[120px] bg-gradient-to-b from-purple-500/10 to-transparent border-t-2 border-purple-500/50 skew-x-[-20deg] relative">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[1px] bg-red-500 shadow-[0_0_15px_red]" />
            </div>
        </div>

        {/* اللاعب */}
        <div className={cn("absolute left-[15%] bottom-12 transition-transform duration-300 z-20", isAttacking && "translate-x-24 scale-110")}>
            <div className="bg-white p-3 rounded-lg border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <User size={40} className="text-black" />
            </div>
            <div className="mt-2 text-[10px] font-bold text-center bg-blue-600 px-1 italic">LV.{gameState.level}</div>
        </div>

        {/* البوس */}
        <div className="absolute right-[15%] bottom-12 z-20 animate-pulse">
            <div className="bg-black p-4 rounded-lg border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                <Skull size={55} className="text-red-600" />
            </div>
            <div className="mt-2 text-[10px] font-bold text-center bg-red-600 px-1 italic uppercase tracking-widest">Boss</div>
        </div>

        {/* عدادات الـ HP العلوية */}
        <div className="absolute top-6 w-full px-6 flex justify-between gap-10">
            <div className="flex-1">
                <div className="flex justify-between text-[10px] mb-1 font-black italic text-blue-400">
                    <span>PLAYER HP</span>
                    <span>{gameState.hp}/{gameState.maxHp}</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }} />
                </div>
            </div>
            <div className="flex-1 text-right">
                <div className="flex justify-between text-[10px] mb-1 font-black italic text-red-500">
                    <span>{canSeeBossHp ? `${boss.hp}/${boss.maxHp}` : '????????'}</span>
                    <span>BOSS HP</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(boss.hp / boss.maxHp) * 100}%` }} />
                </div>
            </div>
        </div>
      </div>

      {/* منطقة المهام والتحكم */}
      <div className="flex-1 bg-[#111] border-t-2 border-purple-500/30 p-4 rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-md mx-auto h-full">
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
              onUseAbility={(id) => { playUseAbility(); useAbility(id); }}
              onExit={() => navigate('/boss')}
            />
        </div>
      </div>
    </div>
  );
};

export default Battle;
