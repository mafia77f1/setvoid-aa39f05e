import { useState, useCallback, useEffect, useRef } from 'react';
import { Swords, Zap, Heart, Battery, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DamagePopup {
  id: number;
  value: number;
  x: number;
  y: number;
  isCrit: boolean;
}

const SoloLevelingBattle = () => {
  const navigate = useNavigate();
  const playerLevel = 24;

  // Boss state
  const maxBossHP = 100000;
  const [bossHP, setBossHP] = useState(85000);

  // Player state - scales with level
  const maxPlayerHP = 2000 + playerLevel * 50;
  const maxPlayerMana = 150 + playerLevel * 5;
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
  const [basicSlashCooldown, setBasicSlashCooldown] = useState(0);
  const [thunderCooldown, setThunderCooldown] = useState(0);

  // Audio refs
  const slashSoundRef = useRef<HTMLAudioElement | null>(null);
  const thunderSoundRef = useRef<HTMLAudioElement | null>(null);
  const critSoundRef = useRef<HTMLAudioElement | null>(null);
  const bossDamageSoundRef = useRef<HTMLAudioElement | null>(null);
  const victorySoundRef = useRef<HTMLAudioElement | null>(null);

  // Preload sounds
  useEffect(() => {
    slashSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2803/2803-preview.mp3');
    thunderSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1166/1166-preview.mp3');
    critSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    bossDamageSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2801/2801-preview.mp3');
    victorySoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
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

  const addDamagePopup = useCallback((value: number, isCrit: boolean, onBoss: boolean) => {
    const id = Date.now() + Math.random();
    const x = 20 + Math.random() * 60;
    const y = 15 + Math.random() * 40;
    setDamagePopups(prev => [...prev, { id, value, x, y, isCrit }]);
    setTimeout(() => setDamagePopups(prev => prev.filter(p => p.id !== id)), 1500);
  }, []);

  const bossCounterAttack = useCallback(() => {
    if (bossHP <= 0) return;
    const bossDmg = 80 + Math.floor(Math.random() * 150);
    setIsPlayerHit(true);
    setPlayerHP(prev => Math.max(0, prev - bossDmg));
    playAudio(bossDamageSoundRef, 0.3);
    setBattleLog(prev => [`🕷️ البوس هاجم → ${bossDmg} ضرر`, ...prev.slice(0, 4)]);
    setTimeout(() => setIsPlayerHit(false), 400);
  }, [bossHP]);

  const finishTurn = useCallback(() => {
    setIsAttacking(false);
    setTurnCount(prev => prev + 1);
    setBasicSlashCooldown(prev => Math.max(0, prev - 1));
    setThunderCooldown(prev => Math.max(0, prev - 1));
    setPlayerMana(prev => Math.min(maxPlayerMana, prev + 10));
  }, [maxPlayerMana]);

  // ===== BASIC ATTACK =====
  const basicAttack = useCallback(() => {
    if (isAttacking || isBossDead || isPlayerDead || basicSlashCooldown > 0) return;

    setIsAttacking(true);
    const baseDmg = 1500 + playerLevel * 80;
    const isCrit = Math.random() < 0.2;
    const finalDmg = isCrit ? Math.floor(baseDmg * 2) : baseDmg;

    // Slash visual
    setSlashEffect(true);
    playAudio(slashSoundRef, 0.35);
    if (isCrit) playAudio(critSoundRef, 0.5);

    setTimeout(() => {
      setIsBossHit(true);
      setBossHP(prev => Math.max(0, prev - finalDmg));
      addDamagePopup(finalDmg, isCrit, true);
      setComboCount(prev => prev + 1);
      setBattleLog(prev => [
        `${isCrit ? '💥 كريتيكال! ' : '⚔️ '}ضربة → ${finalDmg.toLocaleString()} ضرر`,
        ...prev.slice(0, 4)
      ]);
      setTimeout(() => {
        setIsBossHit(false);
        setSlashEffect(false);
      }, 400);
    }, 250);

    setTimeout(() => {
      bossCounterAttack();
      setTimeout(() => finishTurn(), 400);
    }, 800);
  }, [isAttacking, isBossDead, isPlayerDead, basicSlashCooldown, playerLevel, addDamagePopup, bossCounterAttack, finishTurn]);

  // ===== THUNDER DASH =====
  const thunderDash = useCallback(() => {
    if (isAttacking || isBossDead || isPlayerDead || thunderCooldown > 0) return;
    if (playerMana < 60) return;

    setIsAttacking(true);
    setPlayerMana(prev => prev - 60);

    const baseDmg = 5000 + playerLevel * 200;
    const isCrit = Math.random() < 0.3;
    const finalDmg = isCrit ? Math.floor(baseDmg * 2.5) : baseDmg;

    // Thunder visuals - screen shake + flash
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
      addDamagePopup(finalDmg, isCrit, true);
      setComboCount(prev => prev + 1);

      if (isCrit) playAudio(critSoundRef, 0.6);

      setBattleLog(prev => [
        `${isCrit ? '⚡💥 كريتيكال! ' : '⚡ '}اندفاع البرق → ${finalDmg.toLocaleString()} ضرر`,
        ...prev.slice(0, 4)
      ]);

      setTimeout(() => {
        setIsBossHit(false);
        setScreenShake(false);
        setThunderBoltEffect(false);
      }, 500);
    }, 400);

    setThunderCooldown(3);

    setTimeout(() => {
      bossCounterAttack();
      setTimeout(() => finishTurn(), 400);
    }, 1100);
  }, [isAttacking, isBossDead, isPlayerDead, thunderCooldown, playerMana, playerLevel, addDamagePopup, bossCounterAttack, finishTurn]);

  // Reset combo after inactivity
  useEffect(() => {
    const timer = setTimeout(() => setComboCount(0), 5000);
    return () => clearTimeout(timer);
  }, [comboCount]);

  // Victory sound
  useEffect(() => {
    if (isBossDead) playAudio(victorySoundRef, 0.5);
  }, [isBossDead]);

  const isSlashDisabled = isAttacking || isBossDead || isPlayerDead || basicSlashCooldown > 0;
  const isThunderDisabled = isAttacking || isBossDead || isPlayerDead || thunderCooldown > 0 || playerMana < 60;

  return (
    <div
      className={`h-screen bg-black text-white flex flex-col overflow-hidden relative select-none transition-transform duration-75 ${screenShake ? 'animate-screen-shake' : ''}`}
      dir="ltr"
    >
      {/* Thunder Flash Overlay */}
      {thunderFlash && (
        <div className="absolute inset-0 z-50 bg-yellow-200/40 pointer-events-none animate-flash" />
      )}

      {/* ===== BATTLE ARENA (Top ~60%) ===== */}
      <div className="relative flex-1 min-h-0 flex flex-col">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(15,25,60,1)_0%,rgba(5,5,15,1)_70%,#000_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(6,182,212,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(239,68,68,0.06)_0%,transparent_50%)]" />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-cyan-400/30 rounded-full"
              style={{
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
          <div className="bg-black/70 border border-cyan-500/30 px-5 py-1.5 text-[10px] font-black text-cyan-400 tracking-[0.4em] uppercase backdrop-blur-sm">
            TURN {turnCount}
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
          <div className="text-3xl font-black italic text-white/10 tracking-[0.6em]">VS</div>
        </div>

        {/* ===== PLAYER (LEFT) ===== */}
        <div className="absolute left-4 md:left-12 bottom-[12%] z-10 flex flex-col items-center">
          {/* Player Stats */}
          <div className="mb-3 w-[150px] md:w-[200px]">
            <div className="bg-black/80 border border-cyan-500/30 p-2 backdrop-blur-md rounded-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-black text-cyan-400 tracking-widest">HUNTER</span>
                <span className="text-[9px] font-bold text-cyan-300/80">LV.{playerLevel}</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <Heart size={8} className="text-emerald-400 shrink-0" />
                <div className="flex-1 h-2 bg-zinc-900 border border-white/5 overflow-hidden rounded-sm">
                  <div
                    className="h-full transition-all duration-500 rounded-sm"
                    style={{
                      width: `${playerHPPercent}%`,
                      background: playerHPPercent > 50
                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                        : playerHPPercent > 20
                          ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                          : 'linear-gradient(90deg, #ef4444, #f87171)'
                    }}
                  />
                </div>
                <span className="text-[7px] text-zinc-500 w-8 text-right">{playerHP}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Battery size={8} className="text-blue-400 shrink-0" />
                <div className="flex-1 h-1.5 bg-zinc-900 border border-white/5 overflow-hidden rounded-sm">
                  <div
                    className="h-full transition-all duration-500 rounded-sm"
                    style={{
                      width: `${playerManaPercent}%`,
                      background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                    }}
                  />
                </div>
                <span className="text-[7px] text-zinc-500 w-8 text-right">{playerMana}</span>
              </div>
            </div>
          </div>

          {/* Player Character */}
          <div className={`relative transition-all duration-200 ${isAttacking ? 'translate-x-6 scale-110' : ''} ${isPlayerHit ? '-translate-x-3 brightness-[2]' : ''}`}>
            <div className="absolute -inset-10 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" />
            <img
              src="/UserPersonality.png"
              alt="Player"
              className="w-28 md:w-44 relative z-10 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]"
              style={{ transform: 'scaleX(-1)' }}
            />
            {/* Platform glow */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[130%] h-6">
              <div className="w-full h-full bg-cyan-500/15 rounded-[50%] blur-lg" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-full" />
            </div>
          </div>
        </div>

        {/* ===== BOSS (RIGHT) ===== */}
        <div className="absolute right-2 md:right-8 bottom-[12%] z-10 flex flex-col items-center">
          {/* Boss HP */}
          <div className="mb-3 w-[160px] md:w-[220px]">
            <div className="bg-black/80 border border-red-500/30 p-2 backdrop-blur-md rounded-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-black text-red-400 tracking-widest">SNOW SPIDER</span>
                <span className="text-[9px] font-bold text-red-300/80">[S-RANK]</span>
              </div>
              <div className="h-2.5 bg-zinc-900 border border-white/5 overflow-hidden rounded-sm relative">
                <div
                  className="h-full transition-all duration-500 relative overflow-hidden"
                  style={{
                    width: `${bossHPPercent}%`,
                    background: bossHPPercent > 50
                      ? 'linear-gradient(90deg, #dc2626, #ef4444)'
                      : bossHPPercent > 20
                        ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                        : 'linear-gradient(90deg, #ef4444, #7f1d1d)'
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-energy-flow" />
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[7px] text-zinc-500">{bossHP.toLocaleString()}</span>
                <span className="text-[7px] text-zinc-500">{maxBossHP.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Boss Character */}
          <div className={`relative transition-all duration-200 ${isBossHit ? 'scale-90 brightness-[2.5]' : ''} ${isBossDead ? 'opacity-20 grayscale rotate-12 scale-75' : ''}`}>
            {!isBossDead && (
              <div className="absolute -inset-10 bg-red-500/10 rounded-full blur-3xl animate-aura-pulse" />
            )}
            <img
              src="/BoosSnowSpider.png"
              alt="Boss"
              className="w-36 md:w-52 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)] relative z-10"
            />
            {/* Platform glow */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[130%] h-6">
              <div className={`w-full h-full rounded-[50%] blur-lg ${isBossDead ? 'bg-red-900/10' : 'bg-red-500/15'}`} />
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-1 rounded-full ${isBossDead ? 'bg-transparent' : 'bg-gradient-to-r from-transparent via-red-400/50 to-transparent'}`} />
            </div>

            {/* Damage popups */}
            {damagePopups.map(popup => (
              <div
                key={popup.id}
                className="absolute z-30 pointer-events-none"
                style={{ left: `${popup.x}%`, top: `${popup.y}%` }}
              >
                <div
                  className={`font-black italic animate-damage-float ${popup.isCrit ? 'text-yellow-300 text-2xl md:text-3xl' : 'text-white text-lg md:text-xl'}`}
                  style={{ textShadow: popup.isCrit ? '0 0 25px rgba(250,204,21,0.9), 0 0 50px rgba(250,204,21,0.5)' : '0 0 12px rgba(255,255,255,0.6)' }}
                >
                  -{popup.value.toLocaleString()}
                  {popup.isCrit && <span className="text-sm ml-1 text-yellow-200">CRIT!</span>}
                </div>
              </div>
            ))}

            {isBossDead && (
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="text-red-500 font-black italic text-xl tracking-[0.3em] animate-pulse drop-shadow-[0_0_25px_rgba(239,68,68,0.9)]">
                  DEFEATED
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Slash Effect Overlay */}
        {slashEffect && (
          <div className="absolute inset-0 z-25 pointer-events-none flex items-center justify-center">
            <div className="w-[200px] h-[200px] relative animate-slash-strike">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-transparent to-transparent rotate-45 blur-sm" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent transform -rotate-12" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12" />
            </div>
          </div>
        )}

        {/* Thunder Bolt Effect */}
        {thunderBoltEffect && (
          <div className="absolute inset-0 z-25 pointer-events-none">
            {/* Lightning bolts */}
            <svg className="absolute inset-0 w-full h-full animate-thunder-strike" viewBox="0 0 400 600" fill="none">
              <path d="M200 0 L180 200 L220 200 L160 400 L210 250 L170 250 L200 0" fill="rgba(250,204,21,0.6)" />
              <path d="M250 20 L235 180 L260 180 L220 350 L255 220 L230 220 L250 20" fill="rgba(250,204,21,0.3)" />
            </svg>
            <div className="absolute inset-0 bg-yellow-400/5 animate-pulse" />
          </div>
        )}

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-[15%]">
          <div className="w-full h-full bg-gradient-to-t from-cyan-950/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        </div>
      </div>

      {/* ===== CONTROLS (Bottom ~40%) ===== */}
      <div className="relative z-20 bg-gradient-to-b from-[#080818] to-[#050510] border-t border-cyan-500/15">

        {/* Battle Log */}
        <div className="px-3 py-2 border-b border-white/5 bg-black/50">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[8px] text-cyan-500/50 font-bold uppercase shrink-0 tracking-wider">LOG</span>
            <span className="text-[9px] text-zinc-400 whitespace-nowrap font-medium">{battleLog[0]}</span>
          </div>
        </div>

        {/* Two Skill Buttons */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">

            {/* BASIC ATTACK */}
            <button
              onClick={basicAttack}
              disabled={isSlashDisabled}
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 overflow-hidden group
                ${isSlashDisabled
                  ? 'bg-zinc-900/60 border-zinc-800/40 opacity-40 cursor-not-allowed'
                  : 'bg-gradient-to-b from-cyan-950/80 to-cyan-900/40 border-cyan-500/40 hover:border-cyan-400/70 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                }
              `}
            >
              {!isSlashDisabled && (
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <div className={`mb-2 p-2 rounded-lg ${isSlashDisabled ? 'bg-zinc-800/50' : 'bg-cyan-500/20'}`}>
                <Swords size={24} className={isSlashDisabled ? 'text-zinc-600' : 'text-cyan-400'} />
              </div>
              <span className={`text-sm font-black ${isSlashDisabled ? 'text-zinc-600' : 'text-white'}`}>
                ضربة أساسية
              </span>
              <span className="text-[9px] text-zinc-500 mt-0.5">
                {(1500 + playerLevel * 80).toLocaleString()} DMG
              </span>
              <span className="text-[8px] text-cyan-500/60 mt-0.5">مجانية</span>

              {basicSlashCooldown > 0 && (
                <div className="absolute inset-0 bg-black/75 rounded-xl flex items-center justify-center">
                  <span className="text-cyan-400 font-black text-2xl">{basicSlashCooldown}</span>
                </div>
              )}
            </button>

            {/* THUNDER DASH */}
            <button
              onClick={thunderDash}
              disabled={isThunderDisabled}
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 overflow-hidden group
                ${isThunderDisabled
                  ? 'bg-zinc-900/60 border-zinc-800/40 opacity-40 cursor-not-allowed'
                  : 'bg-gradient-to-b from-yellow-950/60 to-amber-900/30 border-yellow-500/40 hover:border-yellow-400/70 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(234,179,8,0.15)]'
                }
              `}
            >
              {!isThunderDisabled && (
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <div className={`mb-2 p-2 rounded-lg ${isThunderDisabled ? 'bg-zinc-800/50' : 'bg-yellow-500/20'}`}>
                <Zap size={24} className={isThunderDisabled ? 'text-zinc-600' : 'text-yellow-400'} />
              </div>
              <span className={`text-sm font-black ${isThunderDisabled ? 'text-zinc-600' : 'text-white'}`}>
                اندفاع البرق
              </span>
              <span className="text-[9px] text-zinc-500 mt-0.5">
                {(5000 + playerLevel * 200).toLocaleString()} DMG
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Battery size={8} className="text-blue-400" />
                <span className="text-[8px] text-blue-400/70">60 MP</span>
              </div>

              {thunderCooldown > 0 && (
                <div className="absolute inset-0 bg-black/75 rounded-xl flex items-center justify-center">
                  <span className="text-yellow-400 font-black text-2xl">{thunderCooldown}</span>
                </div>
              )}
            </button>
          </div>

          {/* Skill descriptions */}
          <div className="flex gap-2 text-[8px] text-zinc-600 px-1">
            <span className="flex-1 text-center">⚔️ هجمة سريعة بالسيف</span>
            <span className="flex-1 text-center">⚡ هجمة خاطفة تصعق العدو</span>
          </div>
        </div>
      </div>

      {/* Victory Overlay */}
      {isBossDead && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="text-center space-y-4">
            <div
              className="text-5xl md:text-6xl font-black italic text-cyan-400 tracking-[0.4em] drop-shadow-[0_0_50px_rgba(6,182,212,0.9)]"
              style={{ textShadow: '0 0 80px rgba(6,182,212,0.6), 0 0 150px rgba(6,182,212,0.3)' }}
            >
              VICTORY
            </div>
            <div className="text-zinc-400 text-sm tracking-[0.3em] uppercase">العدو قد سقط</div>
            <div className="text-yellow-400 font-bold text-xl mt-4">
              +{(maxBossHP * 0.01).toLocaleString()} XP
            </div>
            <button
              onClick={() => navigate(-1)}
              className="mt-6 px-8 py-3 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/30 transition-colors"
            >
              العودة
            </button>
          </div>
        </div>
      )}

      {/* Player Dead Overlay */}
      {isPlayerDead && !isBossDead && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="text-center space-y-4">
            <div className="text-5xl font-black italic text-red-500 tracking-[0.3em] drop-shadow-[0_0_40px_rgba(239,68,68,0.8)]">
              DEFEAT
            </div>
            <div className="text-zinc-400 text-sm tracking-[0.2em]">لقد هُزمت...</div>
            <button
              onClick={() => {
                setPlayerHP(maxPlayerHP);
                setPlayerMana(maxPlayerMana);
                setBossHP(85000);
                setTurnCount(1);
                setComboCount(0);
                setThunderCooldown(0);
                setBasicSlashCooldown(0);
                setBattleLog(['⚔️ المعركة بدأت!']);
              }}
              className="mt-4 px-8 py-3 bg-red-500/20 border border-red-500/40 text-red-400 font-bold rounded-lg hover:bg-red-500/30 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes damage-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          40% { opacity: 1; transform: translateY(-35px) scale(1.3); }
          100% { opacity: 0; transform: translateY(-70px) scale(0.7); }
        }
        .animate-damage-float {
          animation: damage-float 1.5s ease-out forwards;
        }
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-flash {
          animation: flash 0.1s ease-out 3;
        }
        @keyframes screen-shake {
          0%, 100% { transform: translate(0); }
          10% { transform: translate(-4px, 2px); }
          20% { transform: translate(4px, -2px); }
          30% { transform: translate(-3px, -1px); }
          40% { transform: translate(3px, 1px); }
          50% { transform: translate(-2px, 2px); }
          60% { transform: translate(2px, -1px); }
          70% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, -1px); }
          90% { transform: translate(-1px, 0); }
        }
        .animate-screen-shake {
          animation: screen-shake 0.5s ease-out;
        }
        @keyframes slash-strike {
          0% { opacity: 0; transform: scale(0.3) rotate(-30deg); }
          30% { opacity: 1; transform: scale(1.2) rotate(0deg); }
          100% { opacity: 0; transform: scale(1.5) rotate(15deg); }
        }
        .animate-slash-strike {
          animation: slash-strike 0.4s ease-out forwards;
        }
        @keyframes thunder-strike {
          0% { opacity: 0; transform: translateY(-20px); }
          15% { opacity: 1; transform: translateY(0); }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-thunder-strike {
          animation: thunder-strike 0.6s ease-out forwards;
        }
        @keyframes aura-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        .animate-aura-pulse {
          animation: aura-pulse 3s ease-in-out infinite;
        }
        @keyframes energy-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-energy-flow {
          animation: energy-flow 2s linear infinite;
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SoloLevelingBattle;
