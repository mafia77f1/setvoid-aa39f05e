import { useState, useCallback, useEffect, useRef } from 'react';
import { Swords, Zap, Heart, Battery, ArrowLeft, Shield, Wind, Eye, Flame } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';

interface DamagePopup {
  id: number;
  value: number;
  x: number;
  y: number;
  isCrit: boolean;
  isPlayer?: boolean;
  isDodge?: boolean;
}

interface BossConfig {
  name: string;
  rank: string;
  image: string;
  color: string;
  hpMultiplier: number;
  attackPower: number;
  attackSpeed: number;
  dodgeChance: number; // boss dodge chance
}

const BOSSES_BY_RANK: Record<string, BossConfig> = {
  E: { name: 'عنكبوت الظل', rank: 'E', image: '/BoosSnowSpider.png', color: '#6b7280', hpMultiplier: 10, attackPower: 15, attackSpeed: 4000, dodgeChance: 0.08 },
  D: { name: 'ذئب الصحراء', rank: 'D', image: '/BoosSnowSpider.png', color: '#22c55e', hpMultiplier: 20, attackPower: 30, attackSpeed: 3500, dodgeChance: 0.12 },
  C: { name: 'فارس الظلام', rank: 'C', image: '/BoosSnowSpider.png', color: '#3b82f6', hpMultiplier: 35, attackPower: 55, attackSpeed: 3000, dodgeChance: 0.18 },
  B: { name: 'تنين الجليد', rank: 'B', image: '/BoosSnowSpider.png', color: '#a855f7', hpMultiplier: 60, attackPower: 90, attackSpeed: 2500, dodgeChance: 0.22 },
  A: { name: 'ملك الوحوش', rank: 'A', image: '/BoosSnowSpider.png', color: '#f59e0b', hpMultiplier: 100, attackPower: 150, attackSpeed: 2000, dodgeChance: 0.28 },
  S: { name: 'إمبراطور الظلام', rank: 'S', image: '/BoosSnowSpider.png', color: '#ef4444', hpMultiplier: 200, attackPower: 250, attackSpeed: 1800, dodgeChance: 0.35 },
};

const getBaseDamage = (strengthLevel: number): number => {
  if (strengthLevel <= 1) return 1;
  if (strengthLevel <= 10) return Math.max(1, Math.floor(Math.pow(1000, (strengthLevel - 1) / 9)));
  return Math.floor(1000 + Math.pow(strengthLevel - 10, 0.7) * 100);
};

const SKILL_LEVEL_MULTIPLIERS = [1, 1.3, 1.6, 2.0, 2.5, 3.0];

const getSkillLevels = () => {
  try {
    const stored = localStorage.getItem('battle_skill_levels');
    if (stored) return JSON.parse(stored);
  } catch {}
  return { basicAttack: 1, thunderDash: 1, daggerStrike: 1, swordStrike: 1, darkVoid: 1 };
};

// Dark Void charge requirement
const DARK_VOID_CHARGE_REQUIRED = 15;

const SoloLevelingBattle = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { gameState } = useGameState();

  const gateRank = (searchParams.get('rank') || 'E').toUpperCase();
  const bossConfig = BOSSES_BY_RANK[gateRank] || BOSSES_BY_RANK['E'];

  const strengthLevel = gameState.levels.strength || 1;
  const playerLevel = gameState.totalLevel || 1;
  const playerName = gameState.playerName || 'Hunter';
  const hasDagger = (gameState.inventory || []).some(i => i.id === 'dagger' && i.quantity > 0);
  const skillLevels = getSkillLevels();
  const canUseDarkVoid = playerLevel >= 25;

  // Damage calculations
  const baseDmg = getBaseDamage(strengthLevel);
  const basicDmg = Math.floor(baseDmg * SKILL_LEVEL_MULTIPLIERS[Math.min((skillLevels.basicAttack || 1) - 1, 5)]);
  const swordDmg = Math.floor(baseDmg * 1.8 * SKILL_LEVEL_MULTIPLIERS[Math.min((skillLevels.swordStrike || 1) - 1, 5)]);
  const thunderDmg = Math.floor(baseDmg * 3 * SKILL_LEVEL_MULTIPLIERS[Math.min((skillLevels.thunderDash || 1) - 1, 5)]);
  const daggerDmg = Math.floor(baseDmg * 2 * SKILL_LEVEL_MULTIPLIERS[Math.min((skillLevels.daggerStrike || 1) - 1, 5)]);
  const darkVoidDmg = Math.floor(baseDmg * 8 * SKILL_LEVEL_MULTIPLIERS[Math.min((skillLevels.darkVoid || 1) - 1, 5)]);

  // Boss state
  const maxBossHP = Math.max(100, baseDmg * bossConfig.hpMultiplier);
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
  const [isBossAdvancing, setIsBossAdvancing] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>(['⚔️ المعركة بدأت!']);
  const [screenShake, setScreenShake] = useState(false);
  const [thunderFlash, setThunderFlash] = useState(false);
  const [slashEffect, setSlashEffect] = useState(false);
  const [thunderBoltEffect, setThunderBoltEffect] = useState(false);
  const [daggerEffect, setDaggerEffect] = useState(false);
  const [swordEffect, setSwordEffect] = useState(false);
  const [darkVoidEffect, setDarkVoidEffect] = useState(false);

  // Cooldowns (seconds) - basic has NO cooldown
  const [swordCooldown, setSwordCooldown] = useState(0);
  const [thunderCooldown, setThunderCooldown] = useState(0);
  const [daggerCooldown, setDaggerCooldown] = useState(0);

  // Abilities
  const [ragingSpeedActive, setRagingSpeedActive] = useState(false);
  const [ragingSpeedCooldown, setRagingSpeedCooldown] = useState(0);
  const [ragingSpeedTimer, setRagingSpeedTimer] = useState(0);
  const [dodgedAttack, setDodgedAttack] = useState(false);

  // Dark Void charge counter
  const [darkVoidCharge, setDarkVoidCharge] = useState(0);

  // Boss fury - triggers at <25% HP
  const [bossFury, setBossFury] = useState(0);
  const [ultimateFuryActive, setUltimateFuryActive] = useState(false);

  // Audio
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
    if (ref.current) { ref.current.volume = volume; ref.current.currentTime = 0; ref.current.play().catch(() => {}); }
  };

  const bossHPPercent = (bossHP / maxBossHP) * 100;
  const playerHPPercent = (playerHP / maxPlayerHP) * 100;
  const playerManaPercent = (playerMana / maxPlayerMana) * 100;
  const isBossDead = bossHP <= 0;
  const isPlayerDead = playerHP <= 0;
  const battleOver = isBossDead || isPlayerDead;

  const addDamagePopup = useCallback((value: number, isCrit: boolean, isPlayer = false, isDodge = false) => {
    const id = Date.now() + Math.random();
    const x = 20 + Math.random() * 60;
    const y = 15 + Math.random() * 40;
    setDamagePopups(prev => [...prev, { id, value, x, y, isCrit, isPlayer, isDodge }]);
    setTimeout(() => setDamagePopups(prev => prev.filter(p => p.id !== id)), 1500);
  }, []);

  // ===== COOLDOWN TIMER =====
  useEffect(() => {
    if (battleOver) return;
    const interval = setInterval(() => {
      setSwordCooldown(prev => Math.max(0, prev - 1));
      setThunderCooldown(prev => Math.max(0, prev - 1));
      setDaggerCooldown(prev => Math.max(0, prev - 1));
      setRagingSpeedCooldown(prev => Math.max(0, prev - 1));
      setRagingSpeedTimer(prev => {
        if (prev <= 1) { setRagingSpeedActive(false); return 0; }
        return prev - 1;
      });
      setPlayerMana(prev => Math.min(maxPlayerMana, prev + 2));
    }, 1000);
    return () => clearInterval(interval);
  }, [battleOver, maxPlayerMana]);

  // ===== BOSS FURY at <25% HP =====
  useEffect(() => {
    if (battleOver) return;
    if (bossHPPercent < 25 && bossFury < 100) {
      setBossFury(100);
    }
  }, [bossHPPercent, battleOver, bossFury]);

  useEffect(() => {
    if (bossFury >= 100 && !ultimateFuryActive && !battleOver) {
      setUltimateFuryActive(true);
      setScreenShake(true);
      setBattleLog(prev => ['🔥💀 Ultimate Fury! البوس في حالة غضب مطلق!', ...prev.slice(0, 4)]);
      setTimeout(() => setScreenShake(false), 1000);
      // Fury stays active until boss dies (rage mode at <25%)
    }
  }, [bossFury, ultimateFuryActive, battleOver]);

  // ===== BOSS AUTO-ATTACK with advance animation =====
  useEffect(() => {
    if (battleOver) return;
    const interval = setInterval(() => {
      if (bossHP <= 0 || playerHP <= 0) return;

      // Boss advances first
      setIsBossAdvancing(true);
      setTimeout(() => {
        setIsBossAdvancing(false);
        
        // Check dodge
        if (ragingSpeedActive) {
          const dodgeChance = bossConfig.rank === 'E' || bossConfig.rank === 'D' ? 0.85 : 0.80;
          if (Math.random() < dodgeChance) {
            setDodgedAttack(true);
            setBattleLog(prev => ['💨 تفادي! Raging Speed نشط!', ...prev.slice(0, 4)]);
            setTimeout(() => setDodgedAttack(false), 600);
            return;
          }
        }

        const furyMultiplier = ultimateFuryActive ? 3 : 1;
        const bossDmg = Math.floor((bossConfig.attackPower + Math.floor(Math.random() * bossConfig.attackPower * 0.5)) * furyMultiplier);
        
        setIsPlayerHit(true);
        setPlayerHP(prev => Math.max(0, prev - bossDmg));
        playAudio(bossDamageSoundRef, 0.3);
        addDamagePopup(bossDmg, ultimateFuryActive, true);
        setBattleLog(prev => [
          `${ultimateFuryActive ? '🔥💀 ' : '🕷️ '}${bossConfig.name} هاجم → ${bossDmg} ضرر`,
          ...prev.slice(0, 4)
        ]);
        setTimeout(() => setIsPlayerHit(false), 400);
      }, 600); // Advance takes 600ms
    }, bossConfig.attackSpeed);
    return () => clearInterval(interval);
  }, [battleOver, bossHP, playerHP, ragingSpeedActive, ultimateFuryActive, bossConfig, addDamagePopup]);

  // Helper: attempt attack with boss dodge check
  const attemptDamage = (dmg: number, isCrit: boolean, label: string) => {
    // Boss dodge check
    if (Math.random() < bossConfig.dodgeChance) {
      addDamagePopup(0, false, false, true);
      setBattleLog(prev => [`🛡️ ${bossConfig.name} تفادى الهجوم!`, ...prev.slice(0, 4)]);
      return;
    }
    setIsBossHit(true);
    setBossHP(prev => Math.max(0, prev - dmg));
    addDamagePopup(dmg, isCrit);
    setComboCount(prev => prev + 1);
    setDarkVoidCharge(prev => Math.min(DARK_VOID_CHARGE_REQUIRED, prev + 1));
    setBattleLog(prev => [label, ...prev.slice(0, 4)]);
    setTimeout(() => setIsBossHit(false), 400);
  };

  // ===== BASIC ATTACK (5 MP, NO cooldown) =====
  const basicAttack = useCallback(() => {
    if (isAttacking || battleOver || playerMana < 5) return;
    setIsAttacking(true);
    setPlayerMana(prev => prev - 5);
    const isCrit = Math.random() < 0.15;
    const finalDmg = isCrit ? Math.floor(basicDmg * 2) : basicDmg;
    setSlashEffect(true);
    playAudio(slashSoundRef, 0.35);
    if (isCrit) playAudio(critSoundRef, 0.5);
    setTimeout(() => {
      attemptDamage(finalDmg, isCrit, `${isCrit ? '💥 كريتيكال! ' : '⚔️ '}ضربة → ${finalDmg.toLocaleString()} ضرر`);
      setTimeout(() => setSlashEffect(false), 400);
    }, 250);
    setTimeout(() => setIsAttacking(false), 500);
  }, [isAttacking, battleOver, playerMana, basicDmg]);

  // ===== SWORD STRIKE (15 MP, 4s cooldown) =====
  const swordStrike = useCallback(() => {
    if (isAttacking || battleOver || swordCooldown > 0 || playerMana < 15) return;
    setIsAttacking(true);
    setPlayerMana(prev => prev - 15);
    const isCrit = Math.random() < 0.2;
    const finalDmg = isCrit ? Math.floor(swordDmg * 2) : swordDmg;
    setSwordEffect(true);
    setScreenShake(true);
    playAudio(slashSoundRef, 0.45);
    if (isCrit) playAudio(critSoundRef, 0.5);
    setTimeout(() => {
      attemptDamage(finalDmg, isCrit, `${isCrit ? '🗡️💥 كريتيكال! ' : '🗡️ '}ضربة السيف → ${finalDmg.toLocaleString()} ضرر`);
      setTimeout(() => { setSwordEffect(false); setScreenShake(false); }, 400);
    }, 300);
    setSwordCooldown(4);
    setTimeout(() => setIsAttacking(false), 700);
  }, [isAttacking, battleOver, swordCooldown, playerMana, swordDmg]);

  // ===== THUNDER DASH (50 MP, 8s cooldown) =====
  const thunderDash = useCallback(() => {
    if (isAttacking || battleOver || thunderCooldown > 0 || playerMana < 50) return;
    setIsAttacking(true);
    setPlayerMana(prev => prev - 50);
    const isCrit = Math.random() < 0.25;
    const finalDmg = isCrit ? Math.floor(thunderDmg * 2.5) : thunderDmg;
    setThunderBoltEffect(true);
    setScreenShake(true);
    playAudio(thunderSoundRef, 0.5);
    setTimeout(() => { setThunderFlash(true); setTimeout(() => setThunderFlash(false), 150); }, 200);
    setTimeout(() => {
      attemptDamage(finalDmg, isCrit, `${isCrit ? '⚡💥 كريتيكال! ' : '⚡ '}اندفاع البرق → ${finalDmg.toLocaleString()} ضرر`);
      if (isCrit) playAudio(critSoundRef, 0.6);
      setTimeout(() => { setScreenShake(false); setThunderBoltEffect(false); }, 500);
    }, 400);
    setThunderCooldown(8);
    setTimeout(() => setIsAttacking(false), 900);
  }, [isAttacking, battleOver, thunderCooldown, playerMana, thunderDmg]);

  // ===== DAGGER STRIKE (25 MP, 5s cooldown) =====
  const daggerStrikeAction = useCallback(() => {
    if (!hasDagger || isAttacking || battleOver || daggerCooldown > 0 || playerMana < 25) return;
    setIsAttacking(true);
    setPlayerMana(prev => prev - 25);
    const isCrit = Math.random() < 0.3;
    const finalDmg = isCrit ? Math.floor(daggerDmg * 2) : daggerDmg;
    setDaggerEffect(true);
    setScreenShake(true);
    playAudio(daggerSoundRef, 0.45);
    if (isCrit) playAudio(critSoundRef, 0.5);
    setTimeout(() => {
      attemptDamage(finalDmg, isCrit, `${isCrit ? '🗡️💥 كريتيكال! ' : '🗡️ '}ضربة الخنجر → ${finalDmg.toLocaleString()} ضرر`);
      setTimeout(() => { setDaggerEffect(false); setScreenShake(false); }, 400);
    }, 300);
    setDaggerCooldown(5);
    setTimeout(() => setIsAttacking(false), 700);
  }, [hasDagger, isAttacking, battleOver, daggerCooldown, playerMana, daggerDmg]);

  // ===== DARK VOID (charge-based ultimate, hidden if level < 25) =====
  const darkVoidStrike = useCallback(() => {
    if (!canUseDarkVoid || isAttacking || battleOver || darkVoidCharge < DARK_VOID_CHARGE_REQUIRED) return;
    setIsAttacking(true);
    setDarkVoidCharge(0);
    const isCrit = Math.random() < 0.4;
    const finalDmg = isCrit ? Math.floor(darkVoidDmg * 3) : darkVoidDmg;
    setDarkVoidEffect(true);
    setScreenShake(true);
    playAudio(thunderSoundRef, 0.6);
    playAudio(critSoundRef, 0.7);
    setTimeout(() => {
      attemptDamage(finalDmg, isCrit, `${isCrit ? '🌑💥 كريتيكال! ' : '🌑 '}ثقب الظلام → ${finalDmg.toLocaleString()} ضرر`);
      setTimeout(() => { setDarkVoidEffect(false); setScreenShake(false); }, 800);
    }, 500);
    setTimeout(() => setIsAttacking(false), 1200);
  }, [canUseDarkVoid, isAttacking, battleOver, darkVoidCharge, darkVoidDmg]);

  // ===== RAGING SPEED (75 MP, 20s cooldown, 8s) =====
  const activateRagingSpeed = useCallback(() => {
    if (battleOver || ragingSpeedCooldown > 0 || ragingSpeedActive || playerMana < 75) return;
    setPlayerMana(prev => prev - 75);
    setRagingSpeedActive(true);
    setRagingSpeedTimer(8);
    setRagingSpeedCooldown(20);
    setBattleLog(prev => ['💨 Raging Speed! تفادي 80-85% من الهجمات!', ...prev.slice(0, 4)]);
  }, [battleOver, ragingSpeedCooldown, ragingSpeedActive, playerMana]);

  useEffect(() => { const t = setTimeout(() => setComboCount(0), 5000); return () => clearTimeout(t); }, [comboCount]);
  useEffect(() => { if (isBossDead) playAudio(victorySoundRef, 0.5); }, [isBossDead]);

  const isDarkVoidReady = darkVoidCharge >= DARK_VOID_CHARGE_REQUIRED;

  return (
    <div className={`h-screen bg-black text-white flex flex-col overflow-hidden relative select-none transition-transform duration-75 ${screenShake ? 'animate-screen-shake' : ''}`} dir="ltr">
      {thunderFlash && <div className="absolute inset-0 z-50 bg-yellow-200/40 pointer-events-none animate-flash" />}
      
      {/* Ultimate Fury red overlay */}
      {ultimateFuryActive && (
        <div className="absolute inset-0 z-40 pointer-events-none animate-fury-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, rgba(139,0,0,0.6) 100%)' }} />
      )}

      {dodgedAttack && <div className="absolute inset-0 z-40 pointer-events-none bg-cyan-400/10 animate-flash" />}

      {/* Dark Void Effect */}
      {darkVoidEffect && (
        <div className="absolute inset-0 z-45 pointer-events-none">
          <div className="absolute inset-0 bg-purple-950/60 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(88,28,135,0.6) 40%, transparent 70%)', animation: 'dark-void-expand 1s ease-out' }} />
        </div>
      )}

      {/* BATTLE ARENA */}
      <div className="relative flex-1 min-h-0 flex flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(15,25,60,1)_0%,rgba(5,5,15,1)_70%,#000_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(6,182,212,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(239,68,68,0.06)_0%,transparent_50%)]" />
        
        {/* Grid floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/10 to-transparent" 
            style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg)', transformOrigin: 'bottom' }} />
        </div>

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`,
                background: i % 3 === 0 ? 'rgba(6,182,212,0.4)' : i % 3 === 1 ? 'rgba(168,85,247,0.3)' : `${bossConfig.color}66`,
                left: `${5 + Math.random() * 90}%`, top: `${10 + Math.random() * 80}%`,
                animation: `float ${3 + Math.random() * 5}s ease-in-out infinite`, animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Back button */}
        <button onClick={() => navigate(-1)} className="absolute top-3 left-3 z-30 bg-black/60 border border-white/10 p-2 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} className="text-white/70" />
        </button>

        {/* Boss Rank Badge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
          <div className="px-5 py-1.5 text-[10px] font-black tracking-[0.4em] uppercase backdrop-blur-sm rounded-sm border"
            style={{ borderColor: `${bossConfig.color}50`, backgroundColor: `${bossConfig.color}20`, color: bossConfig.color }}>
            RANK {bossConfig.rank} GATE
          </div>
        </div>

        {/* Boss Fury Bar - shows when HP < 25% */}
        {bossHPPercent < 50 && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 w-40">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-[7px] text-red-400 font-bold tracking-wider">ULTIMATE FURY</span>
              <span className="text-[7px] text-red-300 ml-auto">{Math.floor(bossFury)}%</span>
            </div>
            <div className="h-2 bg-zinc-900 border border-red-500/20 rounded-full overflow-hidden">
              <div className="h-full transition-all duration-500 rounded-full"
                style={{ 
                  width: `${bossFury}%`,
                  background: bossFury >= 100 ? 'linear-gradient(90deg, #dc2626, #ff0000, #dc2626)' : 'linear-gradient(90deg, #991b1b, #dc2626)',
                  boxShadow: bossFury >= 100 ? '0 0 15px rgba(239,68,68,0.8)' : 'none',
                }}
              />
            </div>
            {ultimateFuryActive && (
              <div className="text-center mt-1">
                <span className="text-[8px] font-black text-red-500 animate-pulse tracking-widest">⚠️ RAGE MODE ⚠️</span>
              </div>
            )}
          </div>
        )}

        {/* Dark Void Charge */}
        {canUseDarkVoid && (
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-black/70 border border-purple-500/30 px-2 py-1.5 backdrop-blur-sm rounded-sm">
              <div className="flex items-center gap-1 text-[7px]">
                <Eye size={8} className="text-purple-400" />
                <span className="text-purple-300 font-bold">VOID</span>
              </div>
              <div className="w-16 h-1.5 bg-zinc-900 rounded-full overflow-hidden mt-1">
                <div className="h-full transition-all duration-300 rounded-full"
                  style={{ 
                    width: `${(darkVoidCharge / DARK_VOID_CHARGE_REQUIRED) * 100}%`,
                    background: isDarkVoidReady ? 'linear-gradient(90deg, #7c3aed, #a855f7)' : 'linear-gradient(90deg, #4c1d95, #6d28d9)',
                    boxShadow: isDarkVoidReady ? '0 0 10px rgba(139,92,246,0.8)' : 'none',
                  }}
                />
              </div>
              <span className="text-[6px] text-purple-400/60">{darkVoidCharge}/{DARK_VOID_CHARGE_REQUIRED}</span>
            </div>
          </div>
        )}

        {/* Combo */}
        {comboCount > 1 && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
            <div className="text-orange-400 font-black italic text-xl drop-shadow-[0_0_15px_rgba(251,146,60,0.9)] animate-bounce">
              {comboCount}x COMBO!
            </div>
          </div>
        )}

        {/* Raging Speed indicator */}
        {ragingSpeedActive && (
          <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 z-20">
            <div className="bg-cyan-500/20 border border-cyan-400/40 px-3 py-1 rounded-full">
              <span className="text-[9px] text-cyan-300 font-bold animate-pulse">💨 Raging Speed {ragingSpeedTimer}s</span>
            </div>
          </div>
        )}

        {/* VS */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="text-4xl font-black italic text-white/5 tracking-[0.6em]">VS</div>
        </div>

        {/* ===== PLAYER (LEFT) ===== */}
        <div className="absolute left-2 bottom-[10%] z-10 flex flex-col items-center">
          <div className="mb-2 w-[130px]">
            <div className="bg-black/80 border border-cyan-500/30 p-2 backdrop-blur-md rounded-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-black text-cyan-400 tracking-widest truncate max-w-[70px]">{playerName}</span>
                <span className="text-[8px] font-bold text-cyan-300/80">LV.{playerLevel}</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <Heart size={7} className="text-emerald-400 shrink-0" />
                <div className="flex-1 h-2 bg-zinc-900 border border-white/5 overflow-hidden rounded-sm">
                  <div className="h-full transition-all duration-500 rounded-sm"
                    style={{ width: `${playerHPPercent}%`, background: playerHPPercent > 50 ? 'linear-gradient(90deg, #10b981, #34d399)' : playerHPPercent > 20 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)' }} />
                </div>
                <span className="text-[6px] text-zinc-500 w-7 text-right">{playerHP}</span>
              </div>
              <div className="flex items-center gap-1">
                <Battery size={7} className="text-blue-400 shrink-0" />
                <div className="flex-1 h-1.5 bg-zinc-900 border border-white/5 overflow-hidden rounded-sm">
                  <div className="h-full transition-all duration-500 rounded-sm"
                    style={{ width: `${playerManaPercent}%`, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }} />
                </div>
                <span className="text-[6px] text-zinc-500 w-7 text-right">{playerMana}</span>
              </div>
            </div>
          </div>
          <div className={`relative transition-all duration-200 ${isAttacking ? 'translate-x-6 scale-110' : ''} ${isPlayerHit ? '-translate-x-3 brightness-[2]' : ''} ${ragingSpeedActive ? 'animate-raging-speed' : ''}`}>
            <div className="absolute -inset-10 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" />
            <img src="/UserPersonality.png" alt="Player" className="w-24 relative z-10 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]" style={{ transform: 'scaleX(-1)' }} />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[130%] h-6">
              <div className="w-full h-full bg-cyan-500/15 rounded-[50%] blur-lg" />
            </div>
            {damagePopups.filter(p => p.isPlayer).map(popup => (
              <div key={popup.id} className="absolute z-30 pointer-events-none" style={{ left: `${popup.x}%`, top: `${popup.y}%` }}>
                <div className="font-black italic animate-damage-float text-red-400 text-lg" style={{ textShadow: '0 0 12px rgba(239,68,68,0.8)' }}>
                  -{popup.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== BOSS (RIGHT) ===== */}
        <div className="absolute right-0 bottom-[10%] z-10 flex flex-col items-center">
          <div className="mb-2 w-[150px]">
            <div className="bg-black/80 border p-2 backdrop-blur-md rounded-sm" style={{ borderColor: `${bossConfig.color}50` }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-black tracking-widest" style={{ color: bossConfig.color }}>{bossConfig.name}</span>
                <span className="text-[8px] font-bold" style={{ color: `${bossConfig.color}cc` }}>[{bossConfig.rank}]</span>
              </div>
              <div className="h-2.5 bg-zinc-900 border border-white/5 overflow-hidden rounded-sm relative">
                <div className="h-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${bossHPPercent}%`, background: `linear-gradient(90deg, ${bossConfig.color}99, ${bossConfig.color})` }}>
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-energy-flow" />
                </div>
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[6px] text-zinc-500">{bossHP.toLocaleString()}</span>
                <span className="text-[6px] text-zinc-500">{maxBossHP.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className={`relative transition-all duration-200 ${isBossHit ? 'scale-90 brightness-[2.5]' : ''} ${isBossDead ? 'opacity-20 grayscale rotate-12 scale-75' : ''} ${ultimateFuryActive ? 'animate-fury-boss' : ''} ${isBossAdvancing ? '-translate-x-8 scale-110' : ''}`}>
            {!isBossDead && <div className="absolute -inset-10 rounded-full blur-3xl animate-aura-pulse" style={{ backgroundColor: `${bossConfig.color}20` }} />}
            {ultimateFuryActive && <div className="absolute -inset-6 rounded-full blur-2xl animate-pulse" style={{ backgroundColor: 'rgba(239,68,68,0.4)' }} />}
            <img src={bossConfig.image} alt="Boss" className="w-32 relative z-10" style={{ filter: `drop-shadow(0 0 30px ${bossConfig.color}80)` }} />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[130%] h-6">
              <div className="w-full h-full rounded-[50%] blur-lg" style={{ backgroundColor: `${bossConfig.color}25` }} />
            </div>
            {damagePopups.filter(p => !p.isPlayer).map(popup => (
              <div key={popup.id} className="absolute z-30 pointer-events-none" style={{ left: `${popup.x}%`, top: `${popup.y}%` }}>
                {popup.isDodge ? (
                  <div className="font-black italic animate-damage-float text-zinc-400 text-lg" style={{ textShadow: '0 0 12px rgba(150,150,150,0.6)' }}>MISS!</div>
                ) : (
                  <div className={`font-black italic animate-damage-float ${popup.isCrit ? 'text-yellow-300 text-2xl' : 'text-white text-lg'}`}
                    style={{ textShadow: popup.isCrit ? '0 0 25px rgba(250,204,21,0.9)' : '0 0 12px rgba(255,255,255,0.6)' }}>
                    -{popup.value.toLocaleString()}
                    {popup.isCrit && <span className="text-sm ml-1 text-yellow-200">CRIT!</span>}
                  </div>
                )}
              </div>
            ))}
            {isBossDead && (
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <div className="font-black italic text-xl tracking-[0.3em] animate-pulse drop-shadow-[0_0_25px_rgba(239,68,68,0.9)]" style={{ color: bossConfig.color }}>DEFEATED</div>
              </div>
            )}
          </div>
        </div>

        {/* Effects */}
        {slashEffect && (
          <div className="absolute inset-0 z-25 pointer-events-none flex items-center justify-center">
            <div className="w-[200px] h-[200px] relative animate-slash-strike">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-transparent to-transparent rotate-45 blur-sm" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent transform -rotate-12" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12" />
            </div>
          </div>
        )}
        {swordEffect && (
          <div className="absolute inset-0 z-25 pointer-events-none flex items-center justify-center">
            <div className="w-[220px] h-[220px] relative animate-slash-strike">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/40 via-transparent to-transparent rotate-30 blur-sm" />
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent transform -rotate-20" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-200 to-transparent transform rotate-25" />
            </div>
          </div>
        )}
        {daggerEffect && (
          <div className="absolute inset-0 z-25 pointer-events-none flex items-center justify-center">
            <div className="w-[180px] h-[180px] relative animate-slash-strike">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/40 via-transparent to-transparent rotate-30 blur-sm" />
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent transform -rotate-45" />
            </div>
          </div>
        )}
        {thunderBoltEffect && (
          <div className="absolute inset-0 z-25 pointer-events-none">
            <svg className="absolute inset-0 w-full h-full animate-thunder-strike" viewBox="0 0 400 600" fill="none">
              <path d="M200 0 L180 200 L220 200 L160 400 L210 250 L170 250 L200 0" fill="rgba(250,204,21,0.6)" />
              <path d="M250 20 L235 180 L260 180 L220 350 L255 220 L230 220 L250 20" fill="rgba(250,204,21,0.3)" />
            </svg>
            <div className="absolute inset-0 bg-yellow-400/5 animate-pulse" />
          </div>
        )}

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

        {/* ATTACKS ROW */}
        <div className="px-2 pt-2 pb-1">
          <div className="flex items-center gap-1 mb-1">
            <Swords size={8} className="text-zinc-500" />
            <span className="text-[7px] text-zinc-600 font-bold uppercase tracking-wider">ATTACKS</span>
          </div>
          <div className={`grid gap-1.5 ${hasDagger ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {/* BASIC - no cooldown */}
            <SkillButton onClick={basicAttack} disabled={isAttacking || battleOver || playerMana < 5}
              icon={<Swords size={14} />} name="ضربة" dmg={basicDmg} mpCost={5}
              colorFrom="from-cyan-950/80" colorTo="to-cyan-900/40" borderColor="border-cyan-500/40" hoverBorder="hover:border-cyan-400/70"
              iconColor="text-cyan-400" iconBg="bg-cyan-500/20" />

            {/* SWORD STRIKE */}
            <SkillButton onClick={swordStrike} disabled={isAttacking || battleOver || swordCooldown > 0 || playerMana < 15}
              icon={<Flame size={14} />} name="السيف" dmg={swordDmg} mpCost={15} cooldown={swordCooldown}
              colorFrom="from-amber-950/60" colorTo="to-amber-900/30" borderColor="border-amber-500/40" hoverBorder="hover:border-amber-400/70"
              iconColor="text-amber-400" iconBg="bg-amber-500/20" cooldownColor="text-amber-400" />

            {/* THUNDER */}
            <SkillButton onClick={thunderDash} disabled={isAttacking || battleOver || thunderCooldown > 0 || playerMana < 50}
              icon={<Zap size={14} />} name="البرق" dmg={thunderDmg} mpCost={50} cooldown={thunderCooldown}
              colorFrom="from-yellow-950/60" colorTo="to-yellow-900/30" borderColor="border-yellow-500/40" hoverBorder="hover:border-yellow-400/70"
              iconColor="text-yellow-400" iconBg="bg-yellow-500/20" cooldownColor="text-yellow-400" />

            {/* DAGGER */}
            {hasDagger && (
              <SkillButton onClick={daggerStrikeAction} disabled={!hasDagger || isAttacking || battleOver || daggerCooldown > 0 || playerMana < 25}
                icon={<Shield size={14} />} name="خنجر" dmg={daggerDmg} mpCost={25} cooldown={daggerCooldown}
                colorFrom="from-purple-950/60" colorTo="to-purple-900/30" borderColor="border-purple-500/40" hoverBorder="hover:border-purple-400/70"
                iconColor="text-purple-400" iconBg="bg-purple-500/20" cooldownColor="text-purple-400" />
            )}
          </div>
        </div>

        {/* ABILITIES ROW */}
        <div className="px-2 pb-2 pt-1">
          <div className="flex items-center gap-1 mb-1">
            <Zap size={8} className="text-zinc-500" />
            <span className="text-[7px] text-zinc-600 font-bold uppercase tracking-wider">ABILITIES</span>
          </div>
          <div className={`grid gap-1.5 ${canUseDarkVoid ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {/* RAGING SPEED */}
            <button onClick={activateRagingSpeed}
              disabled={battleOver || ragingSpeedCooldown > 0 || ragingSpeedActive || playerMana < 75}
              className={`relative flex items-center gap-2 p-2 rounded-xl border-2 transition-all duration-200 overflow-hidden
                ${battleOver || ragingSpeedCooldown > 0 || ragingSpeedActive || playerMana < 75
                  ? 'bg-zinc-900/60 border-zinc-800/40 opacity-40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-950/60 to-teal-900/30 border-teal-500/40 hover:border-teal-400/70 active:scale-95 cursor-pointer'
                }`}
            >
              <div className="p-1 rounded-lg bg-teal-500/20"><Wind size={14} className="text-teal-400" /></div>
              <div className="text-left">
                <span className="text-[9px] font-black text-white block">تفادي</span>
                <span className="text-[6px] text-zinc-500">75 MP · 80-85% تفادي</span>
              </div>
              {ragingSpeedCooldown > 0 && !ragingSpeedActive && (
                <div className="absolute inset-0 bg-black/75 rounded-xl flex items-center justify-center">
                  <span className="text-teal-400 font-black text-lg">{ragingSpeedCooldown}s</span>
                </div>
              )}
              {ragingSpeedActive && (
                <div className="absolute inset-0 bg-teal-500/20 rounded-xl flex items-center justify-center border-2 border-teal-400/60">
                  <span className="text-teal-300 font-black text-lg animate-pulse">{ragingSpeedTimer}s</span>
                </div>
              )}
            </button>

            {/* DARK VOID */}
            {canUseDarkVoid && (
              <button onClick={darkVoidStrike}
                disabled={isAttacking || battleOver || !isDarkVoidReady}
                className={`relative flex items-center gap-2 p-2 rounded-xl border-2 transition-all duration-200 overflow-hidden
                  ${isAttacking || battleOver || !isDarkVoidReady
                    ? 'bg-zinc-900/60 border-zinc-800/40 opacity-40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-950/80 to-violet-900/40 border-purple-500/50 hover:border-purple-400/80 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  }`}
              >
                <div className={`p-1 rounded-lg ${isDarkVoidReady ? 'bg-purple-500/30 animate-pulse' : 'bg-zinc-800/50'}`}>
                  <Eye size={14} className={isDarkVoidReady ? 'text-purple-400' : 'text-zinc-600'} />
                </div>
                <div className="text-left">
                  <span className={`text-[9px] font-black block ${isDarkVoidReady ? 'text-purple-300' : 'text-zinc-600'}`}>ثقب الظلام</span>
                  <span className="text-[6px] text-zinc-500">{darkVoidDmg.toLocaleString()} DMG · {darkVoidCharge}/{DARK_VOID_CHARGE_REQUIRED}</span>
                </div>
                {!isDarkVoidReady && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-800">
                    <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${(darkVoidCharge / DARK_VOID_CHARGE_REQUIRED) * 100}%` }} />
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Victory */}
      {isBossDead && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="text-center space-y-4">
            <div className="text-5xl font-black italic text-cyan-400 tracking-[0.4em] drop-shadow-[0_0_50px_rgba(6,182,212,0.9)]">VICTORY</div>
            <div className="text-zinc-400 text-sm tracking-[0.3em] uppercase">العدو قد سقط</div>
            <div className="text-sm mt-2 px-3 py-1 rounded" style={{ color: bossConfig.color, borderColor: `${bossConfig.color}40`, border: '1px solid' }}>
              {bossConfig.name} [{bossConfig.rank}]
            </div>
            <div className="text-yellow-400 font-bold text-xl mt-4">+{(maxBossHP * 0.01).toLocaleString()} XP</div>
            <button onClick={() => navigate(-1)} className="mt-6 px-8 py-3 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/30 transition-colors">العودة</button>
          </div>
        </div>
      )}

      {/* Defeat */}
      {isPlayerDead && !isBossDead && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="text-center space-y-4">
            <div className="text-5xl font-black italic text-red-500 tracking-[0.3em] drop-shadow-[0_0_40px_rgba(239,68,68,0.8)]">DEFEAT</div>
            <div className="text-zinc-400 text-sm tracking-[0.2em]">لقد هُزمت...</div>
            <button onClick={() => {
              setPlayerHP(maxPlayerHP); setPlayerMana(maxPlayerMana); setBossHP(maxBossHP);
              setComboCount(0); setSwordCooldown(0); setThunderCooldown(0); setDaggerCooldown(0);
              setRagingSpeedCooldown(0); setRagingSpeedActive(false); setRagingSpeedTimer(0);
              setBossFury(0); setUltimateFuryActive(false); setDarkVoidCharge(0);
              setBattleLog(['⚔️ المعركة بدأت!']);
            }} className="mt-4 px-8 py-3 bg-red-500/20 border border-red-500/40 text-red-400 font-bold rounded-lg hover:bg-red-500/30 transition-colors">
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes damage-float { 0% { opacity: 1; transform: translateY(0) scale(1); } 40% { opacity: 1; transform: translateY(-35px) scale(1.3); } 100% { opacity: 0; transform: translateY(-70px) scale(0.7); } }
        .animate-damage-float { animation: damage-float 1.5s ease-out forwards; }
        @keyframes flash { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
        .animate-flash { animation: flash 0.1s ease-out 3; }
        @keyframes screen-shake { 0%, 100% { transform: translate(0); } 10% { transform: translate(-4px, 2px); } 20% { transform: translate(4px, -2px); } 30% { transform: translate(-3px, -1px); } 40% { transform: translate(3px, 1px); } }
        .animate-screen-shake { animation: screen-shake 0.5s ease-out; }
        @keyframes slash-strike { 0% { opacity: 0; transform: scale(0.3) rotate(-30deg); } 30% { opacity: 1; transform: scale(1.2) rotate(0deg); } 100% { opacity: 0; transform: scale(1.5) rotate(15deg); } }
        .animate-slash-strike { animation: slash-strike 0.4s ease-out forwards; }
        @keyframes thunder-strike { 0% { opacity: 0; transform: translateY(-20px); } 15% { opacity: 1; transform: translateY(0); } 50% { opacity: 1; } 100% { opacity: 0; } }
        .animate-thunder-strike { animation: thunder-strike 0.6s ease-out forwards; }
        @keyframes aura-pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.15); } }
        .animate-aura-pulse { animation: aura-pulse 3s ease-in-out infinite; }
        @keyframes energy-flow { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-energy-flow { animation: energy-flow 2s linear infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); opacity: 0.3; } 50% { transform: translateY(-15px); opacity: 0.7; } }
        @keyframes fury-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        .animate-fury-pulse { animation: fury-pulse 0.8s ease-in-out infinite; }
        @keyframes fury-boss { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.05) translateX(-2px); filter: brightness(1.3) hue-rotate(-10deg); } 75% { transform: scale(1.05) translateX(2px); filter: brightness(1.3) hue-rotate(10deg); } }
        .animate-fury-boss { animation: fury-boss 0.6s ease-in-out infinite; }
        @keyframes raging-speed { 0%, 100% { transform: scaleX(-1); } 25% { transform: scaleX(-1) translateX(3px); opacity: 0.7; } 50% { transform: scaleX(-1) translateX(-3px); opacity: 1; } }
        .animate-raging-speed img { animation: raging-speed 0.3s ease-in-out infinite; }
        @keyframes dark-void-expand { 0% { transform: translate(-50%,-50%) scale(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

// Reusable skill button
interface SkillButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  name: string;
  dmg: number;
  mpCost: number;
  cooldown?: number;
  colorFrom: string;
  colorTo: string;
  borderColor: string;
  hoverBorder: string;
  iconColor: string;
  iconBg: string;
  cooldownColor?: string;
}

const SkillButton = ({ onClick, disabled, icon, name, dmg, mpCost, cooldown, colorFrom, colorTo, borderColor, hoverBorder, iconColor, iconBg, cooldownColor }: SkillButtonProps) => (
  <button onClick={onClick} disabled={disabled}
    className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl border-2 transition-all duration-200 overflow-hidden
      ${disabled ? 'bg-zinc-900/60 border-zinc-800/40 opacity-40 cursor-not-allowed' : `bg-gradient-to-b ${colorFrom} ${colorTo} ${borderColor} ${hoverBorder} active:scale-95 cursor-pointer`}`}>
    <div className={`mb-0.5 p-1 rounded-lg ${disabled ? 'bg-zinc-800/50' : iconBg}`}>
      <span className={disabled ? 'text-zinc-600' : iconColor}>{icon}</span>
    </div>
    <span className={`text-[8px] font-black ${disabled ? 'text-zinc-600' : 'text-white'}`}>{name}</span>
    <span className="text-[6px] text-zinc-500">{dmg.toLocaleString()}</span>
    <div className="flex items-center gap-0.5">
      <Battery size={5} className="text-blue-400" />
      <span className="text-[5px] text-blue-400/70">{mpCost}</span>
    </div>
    {cooldown !== undefined && cooldown > 0 && (
      <div className="absolute inset-0 bg-black/75 rounded-xl flex items-center justify-center">
        <span className={`${cooldownColor || 'text-white'} font-black text-lg`}>{cooldown}s</span>
      </div>
    )}
  </button>
);

export default SoloLevelingBattle;
