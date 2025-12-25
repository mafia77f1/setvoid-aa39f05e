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
  Zap, 
  Target,
  Trophy,
  ChevronRight
} from 'lucide-react';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState, completeQuest, useAbility, resetBoss } = useGameState();
  const { playAttack, playVictory, playUseAbility, playBossDamage } = useSoundEffects();
  const [showVictory, setShowVictory] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);

  const boss = gameState.currentBoss;
  const canSeeBossHp = gameState.abilities.find(a => a.id === 'a7')?.unlocked || false;

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

  const handleQuestAction = (questId: string) => {
    setIsAttacking(true);
    playAttack();
    setTimeout(() => {
      playBossDamage();
      completeQuest(questId);
      setIsAttacking(false);
    }, 400);
  };

  if (showVictory) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center animate-in zoom-in duration-500">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
          <h1 className="text-5xl font-black text-white italic tracking-tighter mb-8">VICTORY</h1>
          <Button onClick={() => { resetBoss(); navigate('/boss'); }} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-xl rounded-none skew-x-[-12deg]">
            CONTINUE
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      
      {/* 1. Header & Boss HP Bar */}
      <div className="pt-10 px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-1">
          <div className="h-[2px] w-12 bg-red-600" />
          <h1 className="text-4xl font-black tracking-[0.2em] italic">BOSS RAID</h1>
          <div className="h-[2px] w-12 bg-red-600" />
        </div>
        <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-4">
          {boss.name} HP
        </p>
        
        {/* Cinematic HP Bar */}
        <div className="max-w-md mx-auto relative h-4 bg-slate-900 border border-white/10 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-800 to-red-500 transition-all duration-700 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            style={{ width: `${(boss.hp / boss.maxHp) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[10px] text-red-500 font-black tracking-[0.3em] uppercase opacity-80">
          {canSeeBossHp ? `HP: ${boss.hp} / ${boss.maxHp}` : "UNKNOWN THREAT"}
        </p>
      </div>

      {/* 2. Battle Arena (The Characters) */}
      <div className="flex-1 relative flex items-center justify-center min-h-[300px]">
        {/* Light Beam Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        
        <div className="flex justify-between w-full max-w-xl px-4 relative z-10">
          {/* Player (Blue Silhouette) */}
          <div className={cn(
            "relative transition-all duration-300",
            isAttacking ? "translate-x-12 scale-110" : ""
          )}>
            <div className="w-32 h-48 bg-blue-400/20 blur-2xl absolute inset-0 rounded-full" />
            <img 
              src="https://api.iconify.design/mdi:human-handsup.svg?color=%2360a5fa" 
              className="w-32 h-48 object-contain drop-shadow-[0_0_20px_rgba(96,165,250,0.8)]" 
              alt="Player"
            />
            {/* Blue Aura Effect */}
            <div className="absolute top-0 left-0 w-full h-full animate-pulse bg-blue-500/10 mix-blend-screen" />
          </div>

          {/* Boss (Purple Silhouette) */}
          <div className="relative">
            <div className="w-40 h-56 bg-purple-600/20 blur-3xl absolute inset-0 rounded-full" />
            <img 
              src="https://api.iconify.design/mdi:emoticon-devil-outline.svg?color=%23a855f7" 
              className="w-40 h-56 object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]" 
              alt="Boss"
            />
            {/* Smoke Effect (Simulated with Gradient) */}
            <div className="absolute -bottom-4 left-0 w-full h-12 bg-gradient-to-t from-purple-900/40 to-transparent blur-xl" />
          </div>
        </div>

        {/* Floor Line */}
        <div className="absolute bottom-20 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
      </div>

      {/* 3. Actions / Quests Area */}
      <div className="p-6 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-md mx-auto space-y-3">
          
          {/* Section Label */}
          <div className="relative flex justify-center mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-blue-900/50"></div></div>
            <span className="relative px-4 bg-[#050505] text-[10px] font-black text-blue-400 tracking-[0.4em] uppercase">Active Quests</span>
          </div>

          {/* Quest Cards */}
          {gameState.quests.filter(q => !q.completed).map((quest) => (
            <button
              key={quest.id}
              onClick={() => handleQuestAction(quest.id)}
              className="w-full group relative bg-black/40 border border-blue-900/30 hover:border-blue-400 p-4 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 border border-blue-900 group-hover:bg-blue-500/10 transition-colors">
                  <Swords className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-sm font-black text-slate-200 group-hover:text-white tracking-wide uppercase">{quest.title}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Required Action: Execute Attack</p>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-900 group-hover:text-blue-400" />
              </div>
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}

          {/* Ability Section */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button className="bg-transparent border border-purple-900 text-purple-400 text-[10px] font-black tracking-widest hover:bg-purple-900/20">
              <Zap className="w-3 h-3 ml-2" /> CHALLENGE ABILITY
            </Button>
            <Button className="bg-transparent border border-red-900 text-red-500 text-[10px] font-black tracking-widest hover:bg-red-900/20">
              <Target className="w-3 h-3 ml-2" /> WEAK POINT
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Navigation Overlay (Optional) */}
      <div className="h-16 border-t border-white/5 bg-black flex items-center justify-around opacity-50 px-8">
         <div className="w-6 h-6 border border-white/20 rounded-sm" />
         <div className="w-6 h-6 border border-white/20 rounded-sm" />
         <div className="w-10 h-10 border-2 border-blue-500 rotate-45 flex items-center justify-center"><div className="-rotate-45 text-[8px]">BOSS</div></div>
         <div className="w-6 h-6 border border-white/20 rounded-sm" />
         <div className="w-6 h-6 border border-white/20 rounded-sm" />
      </div>
    </div>
  );
};

export default Battle;
