import { useState, useCallback, useEffect } from 'react';
import { Swords, Zap, Shield, Flame, Wind, Skull, Heart, Battery } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  nameAr: string;
  icon: React.ReactNode;
  damage: number;
  manaCost: number;
  cooldown: number;
  currentCooldown: number;
  color: string;
  type: 'attack' | 'magic' | 'special';
}

interface DamagePopup {
  id: number;
  value: number;
  x: number;
  y: number;
  isCrit: boolean;
}

const SoloLevelingBattle = () => {
  const [bossHP, setBossHP] = useState(85000);
  const maxBossHP = 100000;
  const [playerHP, setPlayerHP] = useState(2800);
  const maxPlayerHP = 3000;
  const [playerMana, setPlayerMana] = useState(200);
  const maxPlayerMana = 250;
  const [isAttacking, setIsAttacking] = useState(false);
  const [isBossHit, setIsBossHit] = useState(false);
  const [isPlayerHit, setIsPlayerHit] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>(['⚔️ المعركة بدأت!']);
  const [activeSkillEffect, setActiveSkillEffect] = useState<string | null>(null);
  const [turnCount, setTurnCount] = useState(1);

  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: 'Slash', nameAr: 'ضربة', icon: <Swords size={20} />, damage: 3000, manaCost: 0, cooldown: 0, currentCooldown: 0, color: 'from-cyan-400 to-blue-600', type: 'attack' },
    { id: 2, name: 'Fireball', nameAr: 'كرة نار', icon: <Flame size={20} />, damage: 5000, manaCost: 30, cooldown: 2, currentCooldown: 0, color: 'from-orange-400 to-red-600', type: 'magic' },
    { id: 3, name: 'Thunder', nameAr: 'صاعقة', icon: <Zap size={20} />, damage: 8000, manaCost: 50, cooldown: 3, currentCooldown: 0, color: 'from-yellow-300 to-amber-600', type: 'magic' },
    { id: 4, name: 'Wind Blade', nameAr: 'نصل الريح', icon: <Wind size={20} />, damage: 4000, manaCost: 20, cooldown: 1, currentCooldown: 0, color: 'from-emerald-400 to-teal-600', type: 'magic' },
    { id: 5, name: 'Shield', nameAr: 'درع', icon: <Shield size={20} />, damage: 0, manaCost: 40, cooldown: 4, currentCooldown: 0, color: 'from-blue-300 to-indigo-600', type: 'special' },
    { id: 6, name: 'Death Strike', nameAr: 'ضربة الموت', icon: <Skull size={20} />, damage: 15000, manaCost: 80, cooldown: 5, currentCooldown: 0, color: 'from-purple-500 to-violet-900', type: 'special' },
  ]);

  const bossHPPercent = (bossHP / maxBossHP) * 100;
  const playerHPPercent = (playerHP / maxPlayerHP) * 100;
  const playerManaPercent = (playerMana / maxPlayerMana) * 100;

  const addDamagePopup = useCallback((value: number, isCrit: boolean) => {
    const id = Date.now() + Math.random();
    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 40;
    setDamagePopups(prev => [...prev, { id, value, x, y, isCrit }]);
    setTimeout(() => setDamagePopups(prev => prev.filter(p => p.id !== id)), 1200);
  }, []);

  const useSkill = useCallback((skill: Skill) => {
    if (skill.currentCooldown > 0 || isAttacking) return;
    if (skill.manaCost > playerMana) return;
    if (bossHP <= 0) return;

    setIsAttacking(true);
    setActiveSkillEffect(skill.name);
    
    // Deduct mana
    if (skill.manaCost > 0) {
      setPlayerMana(prev => Math.max(0, prev - skill.manaCost));
    }

    // Calculate damage with crit chance
    const isCrit = Math.random() < 0.25;
    const finalDamage = isCrit ? Math.floor(skill.damage * 1.8) : skill.damage;

    // Player attack animation
    setTimeout(() => {
      setIsBossHit(true);
      setBossHP(prev => Math.max(0, prev - finalDamage));
      addDamagePopup(finalDamage, isCrit);
      setComboCount(prev => prev + 1);
      
      setBattleLog(prev => [
        `${isCrit ? '💥 كريتيكال! ' : '⚔️ '}${skill.nameAr} → ${finalDamage.toLocaleString()} ضرر`,
        ...prev.slice(0, 4)
      ]);

      setTimeout(() => setIsBossHit(false), 400);
    }, 300);

    // Set cooldown
    if (skill.cooldown > 0) {
      setSkills(prev => prev.map(s => s.id === skill.id ? { ...s, currentCooldown: s.cooldown } : s));
    }

    // Boss counter-attack
    setTimeout(() => {
      if (bossHP > 0) {
        const bossDmg = 100 + Math.floor(Math.random() * 200);
        setIsPlayerHit(true);
        setPlayerHP(prev => Math.max(0, prev - bossDmg));
        setBattleLog(prev => [
          `🕷️ البوس هاجم → ${bossDmg} ضرر`,
          ...prev.slice(0, 4)
        ]);
        setTimeout(() => setIsPlayerHit(false), 400);
      }
      setIsAttacking(false);
      setActiveSkillEffect(null);
      setTurnCount(prev => prev + 1);

      // Reduce cooldowns
      setSkills(prev => prev.map(s => ({ ...s, currentCooldown: Math.max(0, s.currentCooldown - 1) })));
      
      // Regen mana
      setPlayerMana(prev => Math.min(maxPlayerMana, prev + 15));
    }, 900);
  }, [isAttacking, playerMana, bossHP, addDamagePopup]);

  // Reset combo after inactivity
  useEffect(() => {
    const timer = setTimeout(() => setComboCount(0), 5000);
    return () => clearTimeout(timer);
  }, [comboCount]);

  const isBossDead = bossHP <= 0;

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden relative select-none" dir="ltr">
      
      {/* ===== BATTLE ARENA (Top 50%) ===== */}
      <div className="relative flex-1 min-h-0 flex flex-col">
        
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(15,25,60,1)_0%,rgba(5,5,15,1)_70%,#000_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.08)_0%,transparent_50%)]" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${20 + Math.random() * 60}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* VS Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="relative">
            <div className="text-2xl font-black italic text-cyan-400/30 tracking-[0.5em] animate-pulse-slow">VS</div>
          </div>
        </div>

        {/* Turn Counter */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-black/60 border border-cyan-500/30 px-4 py-1 text-[10px] font-bold text-cyan-400 tracking-[0.3em] uppercase">
            Turn {turnCount}
          </div>
        </div>

        {/* Combo Counter */}
        {comboCount > 1 && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div className="text-orange-400 font-black italic text-lg drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]">
              {comboCount}x COMBO!
            </div>
          </div>
        )}

        {/* ===== BOSS SIDE (Left) ===== */}
        <div className="absolute left-2 md:left-8 bottom-[15%] z-10 flex flex-col items-center">
          {/* Boss HP Bar */}
          <div className="mb-3 w-[160px] md:w-[220px]">
            <div className="bg-black/80 border border-red-500/30 p-2 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black text-red-400 tracking-wider">SNOW SPIDER</span>
                <span className="text-[9px] font-bold text-red-300">[S-RANK]</span>
              </div>
              <div className="h-2 bg-zinc-900 border border-white/5 overflow-hidden relative">
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
                <span className="text-[8px] text-zinc-500">{bossHP.toLocaleString()}</span>
                <span className="text-[8px] text-zinc-500">{maxBossHP.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Boss Character */}
          <div className={`relative transition-all duration-300 ${isBossHit ? 'scale-95 brightness-200' : ''} ${isBossDead ? 'opacity-30 grayscale rotate-12' : ''}`}>
            {/* Boss Aura */}
            {!isBossDead && (
              <div className="absolute -inset-8 bg-red-500/10 rounded-full blur-3xl animate-aura-pulse" />
            )}
            <img 
              src="/BoosSnowSpider.png" 
              alt="Boss" 
              className="w-36 md:w-56 drop-shadow-[0_0_30px_rgba(239,68,68,0.4)] relative z-10"
              style={{ transform: 'scaleX(-1)' }}
            />
            {/* Boss Platform */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[120%] h-4">
              <div className="w-full h-full bg-gradient-to-t from-transparent to-red-500/10 rounded-[50%] blur-md" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-1 bg-red-500/30 rounded-full blur-sm" />
            </div>
          </div>

          {/* Damage popups on boss */}
          {damagePopups.map(popup => (
            <div
              key={popup.id}
              className="absolute z-30 pointer-events-none"
              style={{ left: `${popup.x}%`, top: `${popup.y}%` }}
            >
              <div className={`font-black italic text-lg md:text-2xl animate-damage-float ${popup.isCrit ? 'text-yellow-400 scale-125' : 'text-white'}`}
                style={{ textShadow: popup.isCrit ? '0 0 20px rgba(250,204,21,0.8)' : '0 0 10px rgba(255,255,255,0.5)' }}>
                -{popup.value.toLocaleString()}
                {popup.isCrit && <span className="text-xs ml-1">CRIT!</span>}
              </div>
            </div>
          ))}

          {isBossDead && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <div className="text-red-500 font-black italic text-xl tracking-[0.3em] animate-pulse drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
                DEFEATED
              </div>
            </div>
          )}
        </div>

        {/* ===== PLAYER SIDE (Right) ===== */}
        <div className="absolute right-2 md:right-8 bottom-[15%] z-10 flex flex-col items-center">
          {/* Player Stats */}
          <div className="mb-3 w-[160px] md:w-[200px]">
            <div className="bg-black/80 border border-cyan-500/30 p-2 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-black text-cyan-400 tracking-wider">HUNTER</span>
                <span className="text-[9px] font-bold text-cyan-300">LV.24</span>
              </div>
              {/* HP */}
              <div className="h-1.5 bg-zinc-900 border border-white/5 overflow-hidden mb-1">
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${playerHPPercent}%`,
                    background: 'linear-gradient(90deg, #06b6d4, #3b82f6)'
                  }}
                />
              </div>
              {/* Mana */}
              <div className="h-1 bg-zinc-900 border border-white/5 overflow-hidden">
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${playerManaPercent}%`,
                    background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
                  }}
                />
              </div>
              <div className="flex justify-between mt-1 gap-2">
                <div className="flex items-center gap-1">
                  <Heart size={8} className="text-cyan-400" />
                  <span className="text-[8px] text-zinc-400">{playerHP}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Battery size={8} className="text-purple-400" />
                  <span className="text-[8px] text-zinc-400">{playerMana}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Player Character */}
          <div className={`relative transition-all duration-300 ${isAttacking ? '-translate-x-4 scale-105' : ''} ${isPlayerHit ? 'translate-x-2 brightness-150' : ''}`}>
            {/* Player Aura */}
            <div className="absolute -inset-8 bg-cyan-500/10 rounded-full blur-3xl animate-aura-pulse" />
            <img 
              src="/UserPersonality.png" 
              alt="Player" 
              className="w-28 md:w-48 relative z-10 drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            />
            {/* Player Platform */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[120%] h-4">
              <div className="w-full h-full bg-gradient-to-t from-transparent to-cyan-500/10 rounded-[50%] blur-md" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-1 bg-cyan-500/30 rounded-full blur-sm" />
            </div>
          </div>
        </div>

        {/* Ground / Arena Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[20%]">
          <div className="w-full h-full bg-gradient-to-t from-cyan-950/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        </div>

        {/* Skill Effect Overlay */}
        {activeSkillEffect && (
          <div className="absolute inset-0 z-15 pointer-events-none">
            {activeSkillEffect === 'Fireball' && (
              <div className="absolute inset-0 bg-orange-500/10 animate-pulse" />
            )}
            {activeSkillEffect === 'Thunder' && (
              <div className="absolute inset-0 bg-yellow-300/20 animate-flash" />
            )}
            {activeSkillEffect === 'Death Strike' && (
              <div className="absolute inset-0 bg-purple-900/30 animate-pulse" />
            )}
          </div>
        )}
      </div>

      {/* ===== CONTROL PANEL (Bottom ~45%) ===== */}
      <div className="relative z-20 bg-gradient-to-b from-[#080818] to-[#050510] border-t border-cyan-500/20">
        
        {/* Battle Log */}
        <div className="px-3 py-2 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[8px] text-cyan-500/60 font-bold uppercase shrink-0">LOG:</span>
            <span className="text-[9px] text-zinc-400 whitespace-nowrap">{battleLog[0]}</span>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="p-3">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {skills.map((skill) => {
              const isDisabled = skill.currentCooldown > 0 || isAttacking || skill.manaCost > playerMana || isBossDead;
              return (
                <button
                  key={skill.id}
                  onClick={() => useSkill(skill)}
                  disabled={isDisabled}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200
                    ${isDisabled 
                      ? 'bg-zinc-900/50 border-zinc-800/50 opacity-40 cursor-not-allowed' 
                      : `bg-gradient-to-b ${skill.color} bg-opacity-10 border-white/20 hover:border-white/40 hover:scale-[1.03] active:scale-95 cursor-pointer`
                    }
                    ${!isDisabled ? 'shadow-[0_0_15px_rgba(59,130,246,0.15)]' : ''}
                  `}
                >
                  {/* Skill Icon */}
                  <div className={`mb-1 ${isDisabled ? 'text-zinc-600' : 'text-white'}`}>
                    {skill.icon}
                  </div>
                  
                  {/* Skill Name */}
                  <span className={`text-[10px] font-bold ${isDisabled ? 'text-zinc-600' : 'text-white'}`}>
                    {skill.nameAr}
                  </span>
                  
                  {/* Damage / Info */}
                  <span className="text-[8px] text-zinc-400 mt-0.5">
                    {skill.type === 'special' && skill.damage === 0 ? 'دفاع' : `${(skill.damage / 1000).toFixed(0)}K DMG`}
                  </span>

                  {/* Mana Cost */}
                  {skill.manaCost > 0 && (
                    <div className="absolute top-1 right-1.5 text-[7px] text-purple-300 font-bold">
                      {skill.manaCost}MP
                    </div>
                  )}

                  {/* Cooldown Overlay */}
                  {skill.currentCooldown > 0 && (
                    <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                      <span className="text-cyan-400 font-black text-lg">{skill.currentCooldown}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Ultimate / Execute Button */}
          <button
            onClick={() => useSkill(skills[0])}
            disabled={isAttacking || isBossDead}
            className={`w-full relative py-3 overflow-hidden group rounded-lg border transition-all
              ${isAttacking || isBossDead
                ? 'border-zinc-800 opacity-40 cursor-not-allowed'
                : 'border-cyan-500/40 hover:border-cyan-400/60 active:scale-[0.98]'
              }`
            }
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/30 to-cyan-600/20 group-hover:from-cyan-500/30 group-hover:via-blue-500/40 group-hover:to-cyan-500/30 transition-all" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] animate-energy-flow" />
            <div className="relative z-10 flex items-center justify-center gap-2">
              <Swords size={16} className="text-cyan-400" />
              <span className="font-black italic tracking-[0.2em] uppercase text-sm text-white">
                {isBossDead ? 'VICTORY' : 'هجوم أساسي'}
              </span>
              <Swords size={16} className="text-cyan-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Victory Overlay */}
      {isBossDead && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="text-center">
            <div className="text-5xl font-black italic text-cyan-400 tracking-[0.3em] mb-4 drop-shadow-[0_0_40px_rgba(6,182,212,0.8)]"
              style={{ textShadow: '0 0 60px rgba(6,182,212,0.6), 0 0 120px rgba(6,182,212,0.3)' }}>
              VICTORY
            </div>
            <div className="text-zinc-400 text-sm tracking-[0.2em] uppercase">العدو قد سقط</div>
            <div className="mt-6 text-yellow-400 font-bold text-lg">+{(maxBossHP * 0.01).toLocaleString()} XP</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes damage-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          50% { opacity: 1; transform: translateY(-30px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
        }
        .animate-damage-float {
          animation: damage-float 1.2s ease-out forwards;
        }
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-flash {
          animation: flash 0.15s ease-out 3;
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SoloLevelingBattle;
