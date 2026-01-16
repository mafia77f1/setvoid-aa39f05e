import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  // --- الأنظمة الجديدة (Logic States) ---
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(boss?.hp || 100);
  const [isDead, setIsDead] = useState(false);
  const [canExtract, setCanExtract] = useState(false);
  const [battleLog, setBattleLog] = useState("A gate has opened...");

  // دالة الهجوم
  const handleAttack = () => {
    if (enemyHP <= 0 || playerHP <= 0) return;

    // ضرر اللاعب للوحش
    const playerDamage = Math.floor(Math.random() * 20) + 10;
    const newEnemyHP = Math.max(0, enemyHP - playerDamage);
    setEnemyHP(newEnemyHP);
    setBattleLog(`You dealt ${playerDamage} damage!`);

    // رد فعل الوحش (تأخير بسيط)
    if (newEnemyHP > 0) {
      setTimeout(() => {
        const enemyDamage = Math.floor(Math.random() * 15) + 5;
        setPlayerHP(prev => Math.max(0, prev - enemyDamage));
        setBattleLog(`The enemy struck back for ${enemyDamage}!`);
      }, 500);
    } else {
      setBattleLog("The Boss has fallen. Arise?");
      setIsDead(true);
      setCanExtract(true); // تفعيل نظام استخراج الظلال
    }
  };

  // دالة المغادرة
  const handleExit = () => {
    navigate('/dashboard'); // أو المسار الذي تريده بعد انتهاء القتال
  };

  if (!boss) {
    navigate('/boss');
    return null;
  }

  const HumanoidFigure = ({ color, isEnemy = false, isDead = false }) => (
    <div className={`relative flex flex-col items-center transition-all duration-500 ${isEnemy && !isDead ? 'animate-pulse' : ''} ${isDead ? 'rotate-90 opacity-40 translate-y-10' : ''}`}>
      <div className={`w-8 h-8 rounded-full mb-1 ${color} border-2 border-white/20`} />
      <div className={`w-2 h-2 ${color} opacity-80`} />
      <div className="relative">
        <div className={`absolute -left-6 top-0 w-4 h-16 ${color} rounded-full rotate-12 origin-top border border-white/10`} />
        <div className={`absolute -right-6 top-0 w-4 h-16 ${color} rounded-full -rotate-12 origin-top border border-white/10`} />
        <div className={`w-12 h-20 ${color} rounded-t-lg border-x-2 border-white/10`} />
      </div>
      <div className={`w-12 h-4 ${color} rounded-b-md opacity-90`} />
      <div className="flex gap-2 mt-1">
        <div className={`w-4 h-20 ${color} rounded-b-full border-b-2 border-white/20`} />
        <div className={`w-4 h-20 ${color} rounded-b-full border-b-2 border-white/20`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* واجهة النظام (System UI) */}
      <div className="absolute top-10 flex justify-between w-full px-10 z-20">
        <div className="flex flex-col">
          <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Player HP</span>
          <div className="w-48 h-2 bg-zinc-900 border border-blue-900/30 mt-1">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${playerHP}%` }} />
          </div>
        </div>
        
        <div className="text-center">
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-1">Status Log</p>
            <p className="text-white font-mono text-sm italic">{battleLog}</p>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-red-600 text-xs font-bold uppercase tracking-widest">Enemy HP</span>
          <div className="w-48 h-2 bg-zinc-900 border border-red-900/30 mt-1">
            <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(enemyHP/boss.hp)*100}%` }} />
          </div>
        </div>
      </div>

      <div className="relative w-full h-[60vh] flex flex-col items-center justify-center">
        <div className="absolute bottom-[20%] w-full flex flex-col items-center">
          <div className="w-[90%] h-[3px] bg-red-600 shadow-[0_0_15px_rgba(220,38,38,1)]"></div>
        </div>

        <div className="relative w-full max-w-2xl flex justify-between items-end px-12 pb-[20%] z-10">
          <div className="flex flex-col items-center">
            <span className="mb-4 text-red-600 font-black italic text-xs tracking-widest uppercase opacity-50">
              {isDead ? 'Defeated' : 'Enemy'}
            </span>
            <div className="drop-shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                <HumanoidFigure color="bg-zinc-900" isEnemy={true} isDead={enemyHP <= 0} />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="mb-4 text-blue-400 font-black italic text-xs tracking-widest uppercase opacity-50">Player</span>
            <div className="drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                <HumanoidFigure color="bg-blue-600" isDead={playerHP <= 0} />
            </div>
          </div>
        </div>
      </div>

      {/* أزرار التحكم (Combat Actions) */}
      <div className="mt-6 flex gap-4 z-30">
        {!isDead && playerHP > 0 && (
          <button 
            onClick={handleAttack}
            className="px-8 py-2 border border-blue-500 bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 font-bold uppercase tracking-widest transition-all"
          >
            Attack
          </button>
        )}

        {canExtract && (
          <button 
            onClick={() => { setBattleLog("ARISE!"); setCanExtract(false); }}
            className="px-8 py-2 border border-purple-500 bg-purple-500/10 hover:bg-purple-500/40 text-purple-400 font-bold uppercase tracking-[0.2em] animate-pulse"
          >
            Extract Shadow
          </button>
        )}

        {(isDead || playerHP <= 0) && (
          <button 
            onClick={handleExit}
            className="px-8 py-2 border border-zinc-500 bg-zinc-500/10 hover:bg-zinc-500/30 text-zinc-400 font-bold uppercase tracking-widest transition-all"
          >
            Exit Dungeon
          </button>
        )}
      </div>

      <div className="mt-10 opacity-20 font-mono text-[10px] tracking-[0.5em]">
        ARENA PHASE 01
      </div>
    </div>
  );
};

export default Battle;
