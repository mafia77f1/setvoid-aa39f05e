import { useState, useCallback, useEffect, useRef } from 'react';
import { Swords, Zap, Heart, Battery, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';

interface DamagePopup {
  id: number;
  value: number;
  x: number;
  y: number;
  isCrit: boolean;
}

// Damage formula: levels 1-10 exponential (1 to 1000), then diminishing returns
const getBaseDamage = (strengthLevel: number): number => {
  if (strengthLevel <= 1) return 1;
  if (strengthLevel <= 10) {
    return Math.max(1, Math.floor(Math.pow(1000, (strengthLevel - 1) / 9)));
  }
  return Math.floor(1000 + Math.pow(strengthLevel - 10, 0.7) * 100);
};

const SKILL_LEVEL_MULTIPLIERS = [1, 1.3, 1.6, 2.0, 2.5, 3.0];
const UPGRADE_COSTS = [0, 2, 4, 10, 25, 50]; // stones needed for level 1→2, 2→3, etc.

const getSkillLevels = () => {
  try {
    const stored = localStorage.getItem('battle_skill_levels');
    if (stored) return JSON.parse(stored);
  } catch {}
  return { basicAttack: 1, thunderDash: 1, daggerStrike: 1 };
};

const SoloLevelingBattle = () => {
  const navigate = useNavigate();
  const { gameState } = useGameState();

  // Real player stats
  const strengthLevel = gameState.levels.strength || 1;
  const playerLevel = gameState.totalLevel || 1;
  const playerName = gameState.playerName || 'Hunter';

  // Check if player has dagger
  const hasDagger = (gameState.inventory || []).some(i => i.id === 'dagger' && i.quantity > 0);

  // Skill levels from localStorage
  const skillLevels = getSkillLevels();

  // Calculate damages
  const baseDmg = getBaseDamage(strengthLevel);
  const basicDmg = Math.floor(baseDmg * SKILL_LEVEL_MULTIPLIERS[Math.min(skillLevels.basicAttack - 1, 5)]);
  const thunderDmg = Math.floor(baseDmg * 3 * SKILL_LEVEL_MULTIPLIERS[Math.min(skillLevels.thunderDash - 1, 5)]);
  const daggerDmg = Math.floor(baseDmg * 2 * SKILL_LEVEL_MULTIPLIERS[Math.min(skillLevels.daggerStrike - 1, 5)]);

  // Boss state
  const maxBossHP = Math.max(10000, baseDmg * 30);
  const [bossHP, setBossHP] = useState(maxBossHP);

  // Player state
  const maxPlayerHP = gameState.maxHp || (2000 + playerLevel * 50);
  const maxPlayerMana = gameState.maxEnergy || (150 + playerLevel * 5);
  const [playerHP, setPlayerHP] = useState(maxPlayerHP);
  const [playerMana, setPlayerMana] = useState(maxPlayerMana);

  // Battle state
  const [isAttacking, setIsAttacking] = useState(false);
  const [isBossHit, setIsBossHit] = useState(false);
  const [isPlayerHit, setIsPlayerHit] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>(['⚔️ المعركة بدأت!']);
  const [turnCount, setTurnCount] = useState(1);
  const [screenShake, setScreenShake] = useState(false);
  const [thunderFlash, setThunderFlash] = useState(false);
  const [slashEffect, setSlashEffect] = useState(false);
  const [thunderBoltEffect, setThunderBoltEffect] = useState(false);
  const [daggerEffect, setDaggerEffect] = useState(false);
  const [thunderCooldown, setThunderCooldown] = useState(0);
  const [daggerCooldown, setDaggerCooldown] = useState(0);

  // Audio refs
  const slashSoundRef = useRef<HTMLAudioElement | null>(null);
  const thunderSoundRef = useRef<HTMLAudioElement | null>(null);
  const critSoundRef = useRef<HTMLAudioElement | null>(null);
  const bossDamageSoundRef = useRef<HTMLAudioElement | null>(null);
  const victorySoundRef = useRef<HTMLAudioElement | null>(null);
  const daggerSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    slashSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2803/2803-preview.mp3');
    thunderSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1166/1166-preview.mp3');
    critSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    bossDamageSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2801/2801-preview.mp3');
    victorySoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    daggerSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2788/2788-preview.mp3');
  }, []);

  const playAudio = (ref: React.RefObject<HTMLAudioElement | null>, volume = 0.4) => {
    if (ref.current) {
      ref.current.volume = volume;
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };

  const bossHPPercent = (bossHP / maxBossHP) * 100;
  const playerHPPercent = (playerHP / maxPlayerHP) * 100;
  const playerManaPercent = (playerMana / maxPlayerMana) * 100;
  const isBossDead = bossHP <= 0;
  const isPlayerDead = playerHP <= 0;

  const addDamagePopup = useCallback((value: number, isCrit: boolean) => {
    const id = Date.now() + Math.random();
    const x = 20 + Math.random() * 60;
    const y = 15 + Math.random() * 40;
    setDamagePopups(prev => [...prev, { id, value, x, y, isCrit }]);
    setTimeout(() => setDamagePopups(prev => prev.filter(p => p.id !== id)), 1500);
  }, []);

  const bossCounterAttack = useCallback(() => {
    if (bossHP <= 0) return;
    const bossDmg = 50 + Math.floor(Math.random() * 100) + Math.floor(bossHP / maxBossHP * 50);
    setIsPlayerHit(true);
    setPlayerHP(prev => Math.max(0, prev - bossDmg));
    playAudio(bossDamageSoundRef, 0.3);
    setBattleLog(prev => [`🕷️ البوس هاجم → ${bossDmg} ضرر`, ...prev.slice(0, 4)]);
    setTimeout(() => setIsPlayerHit(false), 400);
  }, [bossHP, maxBossHP]);

  const finishTurn = useCallback(() => {
    setIsAttacking(false);
    setTurnCount(prev => prev + 1);
    setThunderCooldown(prev => Math.max(0, prev - 1));
    setDaggerCooldown(prev => Math.max(0, prev - 1));
    setPlayerMana(prev => Math.min(maxPlayerMana, prev + 5));
  }, [maxPlayerMana]);

  // ===== BASIC ATTACK (5 MP) =====
  const basicAttack = useCallback(() => {
    if (isAttacking || isBossDead || isPlayerDead) return;
    if (playerMana < 5) return;

    setIsAttacking(true);
    setPlayerMana(prev => prev - 5);

    const isCrit = Math.random() < 0.15;
    const finalDmg = isCrit ? Math.floor(basicDmg * 2) : basicDmg;

    setSlashEffect(true);
    playAudio(slashSoundRef, 0.35);
    if (isCrit) playAudio(critSoundRef, 0.5);

    setTimeout(() => {
      setIsBossHit(true);
      setBossHP(prev => Math.max(0, prev - finalDmg));
      addDamagePopup(finalDmg, isCrit);
      setComboCount(prev => prev + 1);
      setBattleLog(prev => [
        `${isCrit ? '💥 كريتيكال! ' : '⚔️ '}ضربة → ${finalDmg.toLocaleString()} ضرر`,
        ...prev.slice(0, 4)
      ]);
      setTimeout(() => { setIsBossHit(false); setSlashEffect(false); }, 400);
    }, 250);

    setTimeout(() => {
      bossCounterAttack();
      setTimeout(() => finishTurn(), 400);
    }, 800);
  }, [isAttacking, isBossDead, isPlayerDead, playerMana, basicDmg, addDamagePopup, bossCounterAttack, finishTurn]);

  // ===== THUNDER DASH (50 MP) =====
  const thunderDash = useCallback(() => {
    if (isAttacking || isBossDead || isPlayerDead || thunderCooldown > 0) return;
    if (playerMana < 50) return;

    setIsAttacking(true);
    setPlayerMana(prev => prev - 50);

    const isCrit = Math.random() < 0.25;
    const finalDmg = isCrit ? Math.floor(thunderDmg * 2.5) : thunderDmg;

    setThunderBoltEffect(true);
    setScreenShake(true);
    playAudio(thunderSoundRef, 0.5);

    setTimeout(() => {
      setThunderFlash(true);
      setTimeout(() => setThunderFlash(false), 150);
    }, 200);

    setTimeout(() => {
      setIsBossHit(true);
      setBossHP(prev => Math.max(0, prev - finalDmg));
      addDamagePopup(finalDmg, isCrit);
      setComboCount(prev => prev + 1);
      if (isCrit) playAudio(critSoundRef, 0.6);
      setBattleLog(prev => [
        `${isCrit ? '⚡💥 كريتيكال! ' : '⚡ '}اندفاع البرق → ${finalDmg.toLocaleString()} ضرر`,
        ...prev.slice(0, 4)
      ]);
      setTimeout(() => { setIsBossHit(false); setScreenShake(false); setThunderBoltEffect(false); }, 500);
    }, 400);

    setThunderCooldown(3);
    setTimeout(() => {
      bossCounterAttack();
      setTimeout(() => finishTurn(), 400);
    }, 1100);
  }, [isAttacking, isBossDead, isPlayerDead, thunderCooldown, playerMana, thunderDmg, addDamagePopup, bossCounterAttack, finishTurn]);

  // ===== DAGGER STRIKE (25 MP) =====
  const daggerStrike = useCallback(() => {
    if (!hasDagger || isAttacking || isBossDead || isPlayerDead || daggerCooldown > 0) return;
    if (playerMana < 25) return;

    setIsAttacking(true);
    setPlayerMana(prev => prev - 25);

    const isCrit = Math.random() < 0.3;
    const finalDmg = isCrit ? Math.floor(daggerDmg * 2) : daggerDmg;

    setDaggerEffect(true);
    setScreenShake(true);
    playAudio(daggerSoundRef, 0.45);
    if (isCrit) playAudio(critSoundRef, 0.5);

    setTimeout(() => {
      setIsBossHit(true);
      setBossHP(prev => Math.max(0, prev - finalDmg));
      addDamagePopup(finalDmg, isCrit);
      setComboCount(prev => prev + 1);
      setBattleLog(prev => [
        `${isCrit ? '🗡️💥 كريتيكال! ' : '🗡️ '}ضربة الخنجر → ${finalDmg.toLocaleString()} ضرر`,
        ...prev.slice(0, 4)
      ]);
      setTimeout(() => { setIsBossHit(false); setDaggerEffect(false); setScreenShake(false); }, 400);
    }, 300);

    setDaggerCooldown(2);
    setTimeout(() => {
      bossCounterAttack();
      setTimeout(() => finishTurn(), 400);
    }, 900);
  }, [hasDagger, isAttacking, isBossDead, isPlayerDead, daggerCooldown, playerMana, daggerDmg, addDamagePopup, bossCounterAttack, finishTurn]);

  useEffect(() => {
    const timer = setTimeout(() => setComboCount(0), 5000);
    return () => clearTimeout(timer);
  }, [comboCount]);

  useEffect(() => {
    if (isBossDead) playAudio(victorySoundRef, 0.5);
  }, [isBossDead]);

  const isBasicDisabled = isAttacking || isBossDead || isPlayerDead || playerMana < 5;
  const isThunderDisabled = isAttacking || isBossDead || isPlayerDead || thunderCooldown > 0 || playerMana < 50;
  const isDaggerDisabled = !hasDagger || isAttacking || isBossDead || isPlayerDead || daggerCooldown > 0 || playerMana < 25;

  return (
    <div
      className={`h-screen bg-black text-white flex flex-col overflow-hidden relative select-none transition-transform duration-75 ${screenShake ? 'animate-screen-shake' : ''}`}
      dir="ltr"
    >
      {thunderFlash && <div className="absolute inset-0 z-50 bg-yellow-200/40 pointer-events-none animate-flash" />}

      {/* ===== BATTLE ARENA ===== */}
      <div className="relative flex-1 min-h-0 flex flex-col">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(15,25,60,1)_0%,rgba(5,5,15,1)_70%,#000_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(6,182,212,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(239,68,68,0.06)_0%,transparent_50%)]" />
        
        {/* Animated grid floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/10 to-transparent" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(60deg)',
              transformOrigin: 'bottom'
            }} 
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                background: i % 3 === 0 ? 'rgba(6,182,212,0.4)' : i % 3 === 1 ? 'rgba(168,85,247,0.3)' : 'rgba(239,68,68,0.3)',
                left: `${5 + Math.random() * 90}%`,
                top: `${10 + Math.random() * 80}%`,
                animation: `float ${3 + Math.random() * 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 z-30 bg-black/60 border border-white/10 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={16} className="text-white/70" />
        </button>

        {/* Turn Counter */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black/80 border border-cyan-500/30 px-5 py-1.5 text-[10px] font-black text-cyan-400 tracking-[0.4em] uppercase backdrop-blur-sm rounded-sm">
            TURN {turnCount}
          </div>
        </div>

        {/* Player Stats Badge - top right */}
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-black/70 border border-purple-500/30 px-3 py-1.5 backdrop-blur-sm rounded-sm">
            <div className="flex items-center gap-2 text-[8px]">
              <span className="text-purple-400 font-bold">STR</span>
              <span className="text-white font-black">{strengthLevel}</span>
              <span className="text-zinc-600">|</span>
              <span className="text-cyan-400 font-bold">DMG</span>
              <span className="text-white font-black">{baseDmg.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Combo */}
        {comboCount > 1 && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20">
            <div className="text-orange-400 font-black italic text-xl drop-shadow-[0_0_15px_rgba(251,146,60,0.9)] animate-bounce">
              {comboCount}x COMBO!
            </div>
          </div>
        )}

        {/* VS */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="text-4xl font-black italic text-white/5 tracking-[0.6em]">VS</div>
        </div>

        {/* ===== PLAYER (LEFT) ===== */}
        <div className="absolute left-2 bottom-[10%] z-10 flex flex-col items-center">
          {/* Player Stats Panel */}
          <div className="mb-2 w-[140px]">
            <div className="bg-black/80 border border-cyan-500/30 p-2 backdrop-blur-md rounded-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-black text-cyan-400 tracking-widest truncate max-w-[70px]">{playerName}</span>
                <span className="text-[8px] font-bold text-cyan-300/80">LV.{playerLevel}</span>
              </div>
              {/* HP */}
              <div className="flex items-center gap-1 mb-1">
                <Heart size={7} className="text-emerald-400 shrink-0" />
                <div className="flex-1 h-2 bg-zinc-900 border border-white/5 overflow-hidden rounded-sm">
                  <div className="h-full transition-all duration-500 rounded-sm"
                    style={{
                      width: `${playerHPPercent}%`,
                      background: playerHPPercent > 50 ? 'linear-gradient(90deg, #10b981, #34d399)' : playerHPPercent > 20 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)'
                    }}
                  />
                </div>
                <span className="text-[6px] text-zinc-500 w-7 text-right">{playerHP}</span>
              </div>
              {/* MP */}
              <div className="flex items-center gap-1">
                <Battery size={7} className="text-blue-400 shrink-0" />
                <div className="flex-1 h-1.5 bg-zinc-900 border border-white/5 overflow-hidden rounded-sm">
                  <div className="h-full transition-all duration-500 rounded-sm"
                    style={{ width: `${playerManaPercent}%`, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}
                  />
                </div>
                <span className="text-[6px] text-zinc-500 w-7 text-right">{playerMana}</span>
              </div>
              {/* Real stats */}
              <div className="mt-1.5 pt-1 border-t border-white/5 grid grid-cols-2 gap-x-2 gap-y-0.5">
                <div className="text-[6px]"><span className="text-red-400">💪</span> <span className="text-zinc-500">{gameState.stats.strength} XP</span></div>
                <div className="text-[6px]"><span className="text-blue-400">🧠</span> <span className="text-zinc-500">{gameState.stats.mind} XP</span></div>
                <div className="text-[6px]"><span className="text-purple-400">✨</span> <span className="text-zinc-500">{gameState.stats.spirit} XP</span></div>
                <div className="text-[6px]"><span className="text-green-400">🏃</span> <span className="text-zinc-500">{gameState.stats.agility} XP</span></div>
              </div>
            </div>
          </div>

          {/* Player Character */}
          <div className={`relative transition-all duration-200 ${isAttacking ? 'translate-x-6 scale-110' : ''} ${isPlayerHit ? '-translate-x-3 brightness-[2]' : ''}`}>
            <div className="absolute -inset-10 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" />
            <img src="/UserPersonality.png" alt="Player" className="w-24 relative z-10 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]" style={{ transform: 'scaleX(-1)' }} />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[130%] h-6">
              <div className="w-full h-full bg-cyan-500/15 rounded-[50%] blur-lg" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-full" />
            </div>
          </div>
        </div>

        {/* ===== BOSS (RIGHT) ===== */}
        <div className="absolute right-0 bottom-[10%] z-10 flex flex-col items-center">
          {/* Boss HP */}
          <div className="mb-2 w-[150px]">
            <div className="bg-black/80 border border-red-500/30 p-2 backdrop-blur-md rounded-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-black text-red-400 tracking-widest">SNOW SPIDER</span>
                <span className="text-[8px] font-bold text-red-300/80">[S]</span>
              </div>
              <div className="h-2.5 bg-zinc-900 border border-white/5 overflow-hidden rounded-sm relative">
                <div className="h-full transition-all duration-500 relative overflow-hidden"
                  style={{
                    width: `${bossHPPercent}%`,
                    background: bossHPPercent > 50 ? 'linear-gradient(90deg, #dc2626, #ef4444)' : bossHPPercent > 20 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #ef4444, #7f1d1d)'
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-energy-flow" />
                </div>
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[6px] text-zinc-500">{bossHP.toLocaleString()}</span>
                <span className="text-[6px] text-zinc-500">{maxBossHP.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Boss Character */}
          <div className={`relative transition-all duration-200 ${isBossHit ? 'scale-90 brightness-[2.5]' : ''} ${isBossDead ? 'opacity-20 grayscale rotate-12 scale-75' : ''}`}>
            {!isBossDead && <div className="absolute -inset-10 bg-red-500/10 rounded-full blur-3xl animate-aura-pulse" />}
            <img src="/BoosSnowSpider.png" alt="Boss" className="w-32 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)] relative z-10" />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[130%] h-6">
              <div className={`w-full h-full rounded-[50%] blur-lg ${isBossDead ? 'bg-red-900/10' : 'bg-red-500/15'}`} />
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-1 rounded-full ${isBossDead ? 'bg-transparent' : 'bg-gradient-to-r from-transparent via-red-400/50 to-transparent'}`} />
            </div>

            {/* Damage popups */}
            {damagePopups.map(popup => (
              <div key={popup.id} className="absolute z-30 pointer-events-none" style={{ left: `${popup.x}%`, top: `${popup.y}%` }}>
                <div
                  className={`font-black italic animate-damage-float ${popup.isCrit ? 'text-yellow-300 text-2xl' : 'text-white text-lg'}`}
                  style={{ textShadow: popup.isCrit ? '0 0 25px rgba(250,204,21,0.9), 0 0 50px rgba(250,204,21,0.5)' : '0 0 12px rgba(255,255,255,0.6)' }}
                >
                  -{popup.value.toLocaleString()}
                  {popup.isCrit && <span className="text-sm ml-1 text-yellow-200">CRIT!</span>}
                </div>
              </div>
            ))}

            {isBossDead && (
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="text-red-500 font-black italic text-xl tracking-[0.3em] animate-pulse drop-shadow-[0_0_25px_rgba(239,68,68,0.9)]">DEFEATED</div>
              </div>
            )}
          </div>
        </div>

        {/* Slash Effect */}
        {slashEffect && (
          <div className="absolute inset-0 z-25 pointer-events-none flex items-center justify-center">
            <div className="w-[200px] h-[200px] relative animate-slash-strike">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-transparent to-transparent rotate-45 blur-sm" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent transform -rotate-12" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12" />
            </div>
          </div>
        )}

        {/* Dagger Effect */}
        {daggerEffect && (
          <div className="absolute inset-0 z-25 pointer-events-none flex items-center justify-center">
            <div className="w-[180px] h-[180px] relative animate-slash-strike">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/40 via-transparent to-transparent rotate-30 blur-sm" />
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent transform -rotate-45" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-200 to-transparent transform rotate-30" />
            </div>
          </div>
        )}

        {/* Thunder Bolt Effect */}
        {thunderBoltEffect && (
          <div className="absolute inset-0 z-25 pointer-events-none">
            <svg className="absolute inset-0 w-full h-full animate-thunder-strike" viewBox="0 0 400 600" fill="none">
              <path d="M200 0 L180 200 L220 200 L160 400 L210 250 L170 250 L200 0" fill="rgba(250,204,21,0.6)" />
              <path d="M250 20 L235 180 L260 180 L220 350 L255 220 L230 220 L250 20" fill="rgba(250,204,21,0.3)" />
            </svg>
            <div className="absolute inset-0 bg-yellow-400/5 animate-pulse" />
          </div>
        )}

        {/* Ground line */}
        <div className="absolute bottom-0 left-0 right-0 h-[12%]">
          <div className="w-full h-full bg-gradient-to-t from-cyan-950/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        </div>
      </div>

      {/* ===== CONTROLS ===== */}
      <div className="relative z-20 bg-gradient-to-b from-[#080818] to-[#050510] border-t border-cyan-500/15">
        {/* Battle Log */}
        <div className="px-3 py-1.5 border-b border-white/5 bg-black/50">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[7px] text-cyan-500/50 font-bold uppercase shrink-0 tracking-wider">LOG</span>
            <span className="text-[8px] text-zinc-400 whitespace-nowrap font-medium">{battleLog[0]}</span>
          </div>
        </div>

        {/* Skill Buttons */}
        <div className="p-3 space-y-2">
          <div className={`grid gap-2 ${hasDagger ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {/* BASIC ATTACK */}
            <button
              onClick={basicAttack}
              disabled={isBasicDisabled}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 overflow-hidden group
                ${isBasicDisabled
                  ? 'bg-zinc-900/60 border-zinc-800/40 opacity-40 cursor-not-allowed'
                  : 'bg-gradient-to-b from-cyan-950/80 to-cyan-900/40 border-cyan-500/40 hover:border-cyan-400/70 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                }`}
            >
              {!isBasicDisabled && <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
              <div className={`mb-1.5 p-1.5 rounded-lg ${isBasicDisabled ? 'bg-zinc-800/50' : 'bg-cyan-500/20'}`}>
                <Swords size={20} className={isBasicDisabled ? 'text-zinc-600' : 'text-cyan-400'} />
              </div>
              <span className={`text-[11px] font-black ${isBasicDisabled ? 'text-zinc-600' : 'text-white'}`}>ضربة أساسية</span>
              <span className="text-[8px] text-zinc-500 mt-0.5">{basicDmg.toLocaleString()} DMG</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                <Battery size={7} className="text-blue-400" />
                <span className="text-[7px] text-blue-400/70">5 MP</span>
              </div>
              {skillLevels.basicAttack > 1 && (
                <span className="absolute top-1 right-1 text-[7px] text-cyan-400 font-bold bg-cyan-500/20 px-1 rounded">+{skillLevels.basicAttack}</span>
              )}
            </button>

            {/* THUNDER DASH */}
            <button
              onClick={thunderDash}
              disabled={isThunderDisabled}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 overflow-hidden group
                ${isThunderDisabled
                  ? 'bg-zinc-900/60 border-zinc-800/40 opacity-40 cursor-not-allowed'
                  : 'bg-gradient-to-b from-yellow-950/60 to-amber-900/30 border-yellow-500/40 hover:border-yellow-400/70 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(234,179,8,0.15)]'
                }`}
            >
              {!isThunderDisabled && <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
              <div className={`mb-1.5 p-1.5 rounded-lg ${isThunderDisabled ? 'bg-zinc-800/50' : 'bg-yellow-500/20'}`}>
                <Zap size={20} className={isThunderDisabled ? 'text-zinc-600' : 'text-yellow-400'} />
              </div>
              <span className={`text-[11px] font-black ${isThunderDisabled ? 'text-zinc-600' : 'text-white'}`}>اندفاع البرق</span>
              <span className="text-[8px] text-zinc-500 mt-0.5">{thunderDmg.toLocaleString()} DMG</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                <Battery size={7} className="text-blue-400" />
                <span className="text-[7px] text-blue-400/70">50 MP</span>
              </div>
              {skillLevels.thunderDash > 1 && (
                <span className="absolute top-1 right-1 text-[7px] text-yellow-400 font-bold bg-yellow-500/20 px-1 rounded">+{skillLevels.thunderDash}</span>
              )}
              {thunderCooldown > 0 && (
                <div className="absolute inset-0 bg-black/75 rounded-xl flex items-center justify-center">
                  <span className="text-yellow-400 font-black text-2xl">{thunderCooldown}</span>
                </div>
              )}
            </button>

            {/* DAGGER STRIKE - only if has dagger */}
            {hasDagger && (
              <button
                onClick={daggerStrike}
                disabled={isDaggerDisabled}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 overflow-hidden group
                  ${isDaggerDisabled
                    ? 'bg-zinc-900/60 border-zinc-800/40 opacity-40 cursor-not-allowed'
                    : 'bg-gradient-to-b from-purple-950/60 to-purple-900/30 border-purple-500/40 hover:border-purple-400/70 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  }`}
              >
                {!isDaggerDisabled && <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
                <div className={`mb-1.5 p-1.5 rounded-lg ${isDaggerDisabled ? 'bg-zinc-800/50' : 'bg-purple-500/20'}`}>
                  <Shield size={20} className={isDaggerDisabled ? 'text-zinc-600' : 'text-purple-400'} />
                </div>
                <span className={`text-[11px] font-black ${isDaggerDisabled ? 'text-zinc-600' : 'text-white'}`}>ضربة الخنجر</span>
                <span className="text-[8px] text-zinc-500 mt-0.5">{daggerDmg.toLocaleString()} DMG</span>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <Battery size={7} className="text-blue-400" />
                  <span className="text-[7px] text-blue-400/70">25 MP</span>
                </div>
                {skillLevels.daggerStrike > 1 && (
                  <span className="absolute top-1 right-1 text-[7px] text-purple-400 font-bold bg-purple-500/20 px-1 rounded">+{skillLevels.daggerStrike}</span>
                )}
                {daggerCooldown > 0 && (
                  <div className="absolute inset-0 bg-black/75 rounded-xl flex items-center justify-center">
                    <span className="text-purple-400 font-black text-2xl">{daggerCooldown}</span>
                  </div>
                )}
              </button>
            )}
          </div>

          {/* Skill descriptions */}
          <div className={`flex gap-1 text-[7px] text-zinc-600 px-1 ${hasDagger ? '' : ''}`}>
            <span className="flex-1 text-center">⚔️ هجمة سريعة</span>
            <span className="flex-1 text-center">⚡ صعق العدو</span>
            {hasDagger && <span className="flex-1 text-center">🗡️ طعنة مميتة</span>}
          </div>
        </div>
      </div>

      {/* Victory Overlay */}
      {isBossDead && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="text-center space-y-4">
            <div className="text-5xl font-black italic text-cyan-400 tracking-[0.4em] drop-shadow-[0_0_50px_rgba(6,182,212,0.9)]"
              style={{ textShadow: '0 0 80px rgba(6,182,212,0.6), 0 0 150px rgba(6,182,212,0.3)' }}
            >
              VICTORY
            </div>
            <div className="text-zinc-400 text-sm tracking-[0.3em] uppercase">العدو قد سقط</div>
            <div className="text-yellow-400 font-bold text-xl mt-4">
              +{(maxBossHP * 0.01).toLocaleString()} XP
            </div>
            <button onClick={() => navigate(-1)}
              className="mt-6 px-8 py-3 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/30 transition-colors"
            >العودة</button>
          </div>
        </div>
      )}

      {/* Defeat Overlay */}
      {isPlayerDead && !isBossDead && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="text-center space-y-4">
            <div className="text-5xl font-black italic text-red-500 tracking-[0.3em] drop-shadow-[0_0_40px_rgba(239,68,68,0.8)]">DEFEAT</div>
            <div className="text-zinc-400 text-sm tracking-[0.2em]">لقد هُزمت...</div>
            <button onClick={() => {
              setPlayerHP(maxPlayerHP);
              setPlayerMana(maxPlayerMana);
              setBossHP(maxBossHP);
              setTurnCount(1);
              setComboCount(0);
              setThunderCooldown(0);
              setDaggerCooldown(0);
              setBattleLog(['⚔️ المعركة بدأت!']);
            }}
              className="mt-4 px-8 py-3 bg-red-500/20 border border-red-500/40 text-red-400 font-bold rounded-lg hover:bg-red-500/30 transition-colors"
            >إعادة المحاولة</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes damage-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          40% { opacity: 1; transform: translateY(-35px) scale(1.3); }
          100% { opacity: 0; transform: translateY(-70px) scale(0.7); }
        }
        .animate-damage-float { animation: damage-float 1.5s ease-out forwards; }
        @keyframes flash { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
        .animate-flash { animation: flash 0.1s ease-out 3; }
        @keyframes screen-shake {
          0%, 100% { transform: translate(0); }
          10% { transform: translate(-4px, 2px); }
          20% { transform: translate(4px, -2px); }
          30% { transform: translate(-3px, -1px); }
          40% { transform: translate(3px, 1px); }
          50% { transform: translate(-2px, 2px); }
        }
        .animate-screen-shake { animation: screen-shake 0.5s ease-out; }
        @keyframes slash-strike {
          0% { opacity: 0; transform: scale(0.3) rotate(-30deg); }
          30% { opacity: 1; transform: scale(1.2) rotate(0deg); }
          100% { opacity: 0; transform: scale(1.5) rotate(15deg); }
        }
        .animate-slash-strike { animation: slash-strike 0.4s ease-out forwards; }
        @keyframes thunder-strike {
          0% { opacity: 0; transform: translateY(-20px); }
          15% { opacity: 1; transform: translateY(0); }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-thunder-strike { animation: thunder-strike 0.6s ease-out forwards; }
        @keyframes aura-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        .animate-aura-pulse { animation: aura-pulse 3s ease-in-out infinite; }
        @keyframes energy-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-energy-flow { animation: energy-flow 2s linear infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-15px); opacity: 0.7; }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SoloLevelingBattle;
