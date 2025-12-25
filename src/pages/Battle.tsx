import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { 
  Skull, 
  Swords, 
  Zap, 
  Trophy, 
  Flame, 
  ShieldAlert,
  Dna,
  User
} from 'lucide-react';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState, completeQuest, useAbility, resetBoss } = useGameState();
  const { playAttack, playVictory, playUseAbility, playBossDamage } = useSoundEffects();
  const [showVictory, setShowVictory] = useState(false);
  const [loot, setLoot] = useState<{ gold: number; shadowPoints: number; item?: string } | null>(null);
  const [isAttacking, setIsAttacking] = useState(false);

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
        item: bossLevel >= 5 ? 'خنجر ملك الظلال' : undefined
      });
    }
  }, [boss?.defeated, showVictory, playVictory]);

  if (!boss) {
    navigate('/boss');
    return null;
  }

  const handleQuestAction = (questId: string) => {
    setIsAttacking(true);
    playAttack();
    setTimeout(() => {
      playBossDamage();
      completeQuest(questId);
      setIsAttacking(false);
      toast({
        title: "CRITICAL HIT!",
        description: "تم توجيه ضرر مدمر للوحش",
        className: "bg-purple-600 text-white border-none",
      });
    }, 500);
  };

  if (showVictory) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa]">
        <div className="max-w-md w-full p-8 rounded-3xl border-[3px] border-purple-500 bg-white shadow-[0_0_50px_rgba(168,85,247,0.4)] text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 mx-auto mb-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-300">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 italic tracking-tighter">DUNGEON CLEARED</h1>
          <p className="text-slate-500 font-medium mb-8 uppercase tracking-widest text-sm">تمت تصفية المغارة بنجاح</p>

          <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">GOLD EXP</span>
              <span className="text-xl font-black text-yellow-600">+{loot?.gold}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">SHADOW SOULS</span>
              <span className="text-xl font-black text-purple-600">+{loot?.shadowPoints}</span>
            </div>
            {loot?.item && (
              <div className="pt-4 border-t border-slate-200 flex items-center justify-center gap-2 text-blue-600 font-bold">
                <Swords className="w-5 h-5" /> {loot.item}
              </div>
            )}
          </div>

          <Button onClick={() => { resetBoss(); navigate('/boss'); }} className="w-full h-16 bg-black hover:bg-slate-800 text-white rounded-xl text-xl font-bold transition-all hover:scale-105">
            تحدي وحش جديد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 p-4 font-sans selection:bg-purple-200">
      {/* Boss Header Section */}
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-xs font-black tracking-widest mb-2 uppercase">
            Boss Raid in Progress
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{boss.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-2 text-slate-400">
            <Skull className="w-4 h-4" />
            <span className="font-bold">RANK: {boss.level >= 5 ? 'S' : 'A'}</span>
          </div>
        </div>

        {/* Monster HP Bar - Cinematic Style */}
        <div className="relative w-full h-8 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-900 mb-12 shadow-[0_4px_0_0_#000]">
          <div 
            className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500 ease-out"
            style={{ width: canSeeBossHp ? `${(boss.hp / boss.maxHp) * 100}%` : '100%' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] drop-shadow-md">
               {canSeeBossHp ? `${boss.hp} / ${boss.maxHp} HP` : "UNKNOWN THREAT LEVEL"}
             </span>
          </div>
        </div>

        {/* Battle Arena */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          {/* Player Side */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-48 h-48 rounded-full border-[6px] border-blue-500 bg-white flex items-center justify-center transition-all duration-300 relative",
              isAttacking && "-translate-y-4 scale-110 shadow-[0_20px_40px_rgba(59,130,246,0.3)]"
            )}>
              <User className="w-24 h-24 text-blue-500" />
              <div className="absolute -bottom-4 bg-blue-600 text-white px-6 py-1 rounded-full font-black text-sm">PLAYER</div>
            </div>
            <div className="mt-8 w-full max-w-[200px] space-y-2">
               <div className="flex justify-between text-[10px] font-bold text-blue-600 uppercase"><span>Mana</span><span>{gameState.energy}%</span></div>
               <Progress value={gameState.energy} className="h-2 bg-blue-100 [&>div]:bg-blue-500" />
            </div>
          </div>

          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <span className="text-6xl font-black text-slate-100 italic select-none">VS</span>
          </div>

          {/* Boss Side */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-48 h-48 rounded-full border-[6px] border-purple-600 bg-slate-900 flex items-center justify-center relative shadow-2xl overflow-hidden animate-pulse",
              boss.defeated && "grayscale opacity-50"
            )}>
              {/* This represents the Shadow Monster */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
              <Skull className="w-24 h-24 text-purple-500 relative z-10" />
              <div className="absolute -bottom-4 bg-purple-600 text-white px-6 py-1 rounded-full font-black text-sm uppercase">Shadow Beast</div>
            </div>
          </div>
        </div>

        {/* Quests / Actions - System Window Style */}
        <div className="bg-white rounded-3xl border-2 border-slate-900 p-6 shadow-[8px_8px_0_0_#000] mb-8">
          <div className="flex items-center gap-2 mb-6 border-b-2 border-slate-100 pb-4">
            <Zap className="text-yellow-500 fill-yellow-500" />
            <h3 className="font-black text-xl tracking-tight uppercase italic">Active Quests</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gameState.quests.filter(q => !q.completed).map((quest) => (
              <button
                key={quest.id}
                onClick={() => handleQuestAction(quest.id)}
                className="group relative flex flex-col p-4 bg-slate-50 hover:bg-purple-600 rounded-2xl border border-slate-200 transition-all text-right"
              >
                <span className="text-xs font-bold text-slate-400 group-hover:text-purple-200 uppercase mb-1 tracking-tighter">Mission</span>
                <span className="font-black text-slate-900 group-hover:text-white transition-colors uppercase">{quest.title}</span>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Swords className="text-white w-6 h-6 animate-bounce" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {gameState.abilities.filter(a => a.unlocked).map((ability) => (
            <Button
              key={ability.id}
              onClick={() => {
                playUseAbility();
                useAbility(ability.id);
              }}
              className="px-8 py-6 rounded-2xl bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-black shadow-[4px_4px_0_0_#3b82f6] transition-all active:translate-y-1 active:shadow-none"
            >
              <Dna className="ml-2 w-5 h-5" />
              {ability.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Exit Button */}
      <button 
        onClick={() => navigate('/boss')}
        className="fixed bottom-8 left-8 p-4 bg-white border-2 border-slate-900 rounded-full hover:bg-red-50 hover:border-red-500 transition-colors group"
      >
        <ShieldAlert className="w-6 h-6 text-slate-900 group-hover:text-red-500" />
      </button>
    </div>
  );
};

export default Battle;
