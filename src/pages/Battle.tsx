import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Skull, 
  Swords, 
  Zap, 
  Trophy, 
  Sparkles, 
  ShieldAlert,
  Flame,
  Target
} from 'lucide-react';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState, completeQuest, useAbility, resetBoss } = useGameState();
  const { playAttack, playVictory, playUseAbility, playBossDamage } = useSoundEffects();
  const [showVictory, setShowVictory] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [loot, setLoot] = useState(null);

  const boss = gameState.currentBoss;
  const canSeeBossHp = gameState.abilities.find(a => a.id === 'a7')?.unlocked || false;

  useEffect(() => {
    if (boss?.defeated && !showVictory) {
      setShowVictory(true);
      playVictory();
      const goldReward = 100 * (boss.level || 1);
      setLoot({ gold: goldReward, shadowPoints: (boss.level || 1) * 5 });
    }
  }, [boss?.defeated, showVictory]);

  if (!boss) {
    navigate('/boss');
    return null;
  }

  const handleAction = (questId) => {
    setIsAttacking(true);
    playAttack();
    
    setTimeout(() => {
      playBossDamage();
      completeQuest(questId);
      setIsAttacking(false);
      toast({
        title: "تم توجيه ضربة!",
        description: "النظام: تم استنفاد نقاط حياة العدو",
      });
    }, 500);
  };

  if (showVictory) {
    return <VictoryScreen loot={loot} bossName={boss.name} onReset={() => { resetBoss(); navigate('/boss'); }} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans relative">
      {/* Background System Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Header Info */}
      <div className="relative z-10 flex justify-between p-6 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="flex flex-col">
          <span className="text-xs font-mono text-purple-400 tracking-tiresome">PLAYER STATUS</span>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center border-2 border-white/20">
              <span className="font-bold">LV</span>
            </div>
            <div>
              <div className="text-xl font-black italic uppercase tracking-tighter">SUNG JIN-WOO</div>
              <div className="flex gap-1">
                <Progress value={(gameState.hp / gameState.maxHp) * 100} className="w-32 h-2 bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/boss')} className="text-purple-400 hover:text-white transition-colors">
          <ShieldAlert className="w-8 h-8" />
        </button>
      </div>

      {/* Battle Arena */}
      <div className="relative h-[45vh] flex items-end justify-center px-4">
        {/* The Platform */}
        <div className="absolute bottom-0 w-[120%] h-32 bg-[#111] transform -skew-x-12 border-t-4 border-red-600 shadow-[0_-20px_50px_rgba(220,38,38,0.2)] flex flex-col items-center overflow-hidden">
             <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,#ff0000_20px,#ff0000_40px)]"></div>
        </div>

        <div className="relative w-full max-w-4xl flex justify-between items-end pb-10 z-10">
          {/* Player Sprite */}
          <div className={cn("relative transition-all duration-300", isAttacking && "translate-x-20 scale-110")}>
             <div className="w-32 h-64 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full blur-[2px] opacity-80 animate-pulse relative">
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_#fff]"></div>
             </div>
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/50 rounded-full blur-md"></div>
             <div className="absolute top-0 -right-4 bg-white text-black px-2 py-1 text-xs font-bold skew-x-[-20deg]">RANK E</div>
          </div>

          {/* VS Signal */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
             <span className="text-7xl font-black italic opacity-10 text-white italic tracking-tighter">VS</span>
          </div>

          {/* Boss Sprite */}
          <div className="relative group">
             {canSeeBossHp && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40">
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                        <span>HP</span>
                        <span>{boss.hp}%</span>
                    </div>
                    <Progress value={boss.hp} className="h-1.5 bg-gray-800 [&>div]:bg-red-600" />
                </div>
             )}
             <div className="w-48 h-80 bg-gradient-to-t from-red-900 via-black to-transparent rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                <Skull className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-red-600/20" />
             </div>
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-6 bg-black/70 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Action UI */}
      <div className="relative z-20 p-6 max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 border-l-4 border-purple-500 pl-3">
             <Target className="w-5 h-5 text-purple-400" />
             <h2 className="text-lg font-bold uppercase tracking-widest text-white/90">المهام الحالية للنظام</h2>
          </div>

          <div className="grid gap-4">
            {gameState.quests.map((quest) => (
              <button
                key={quest.id}
                onClick={() => handleAction(quest.id)}
                disabled={isAttacking}
                className="group relative flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/50 rounded-xl transition-all active:scale-95"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-black/40 group-hover:text-purple-400 transition-colors">
                    <Swords className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white uppercase">{quest.name}</div>
                    <div className="text-xs text-gray-400">توجيه ضرر حرج للعدو</div>
                  </div>
                </div>
                <div className="text-purple-400 font-mono font-bold">+20XP</div>
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-4 gap-4">
            {gameState.abilities.map((ability) => (
                <button
                  key={ability.id}
                  onClick={() => playUseAbility()}
                  className="aspect-square flex flex-col items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/40 transition-all"
                >
                    <Zap className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase">{ability.name.split(' ')[0]}</span>
                </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Victory Screen Component
const VictoryScreen = ({ loot, bossName, onReset }) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-white">
    <div className="max-w-md w-full bg-black p-8 rounded-[2rem] text-center border-[12px] border-black shadow-[0_0_0_4px_rgba(168,85,247,0.4)]">
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20"></div>
        <Trophy className="w-20 h-20 mx-auto text-purple-500 relative z-10" />
      </div>
      <h1 className="text-5xl font-black italic text-white mb-2 tracking-tighter uppercase">Quest Cleared</h1>
      <p className="text-purple-400 font-mono mb-8 uppercase tracking-widest">لقد تم القضاء على {bossName}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="text-2xl font-bold text-white">+{loot?.gold}</div>
          <div className="text-[10px] text-gray-500 uppercase">Gold Earned</div>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="text-2xl font-bold text-purple-500">+{loot?.shadowPoints}</div>
          <div className="text-[10px] text-gray-500 uppercase">Shadow Points</div>
        </div>
      </div>

      <Button onClick={onReset} className="w-full h-16 bg-purple-600 hover:bg-purple-700 text-white font-black italic text-xl uppercase rounded-xl border-b-4 border-purple-900 transition-all active:border-b-0">
        استمرار الرحلة
      </Button>
    </div>
  </div>
);

export default Battle;
