import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { useGameState } from '@/hooks/useGameState';
import { Zap, Swords, Target, ArrowUp, Lock, Sparkles, Hexagon, Cpu, ShieldAlert, Hourglass } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SKILL_LEVEL_MULTIPLIERS = [1, 1.3, 1.6, 2.0, 2.5, 3.0];
const SKILL_TIME_REDUCERS = [0, 0.05, 0.1, 0.15, 0.2, 0.25]; // تخفيض الوقت 5% كل مستوى
const UPGRADE_COSTS = [0, 2, 4, 10, 25, 50]; 
const MAX_SKILL_LEVEL = 6;

const getBaseDamage = (strengthLevel: number): number => {
  if (strengthLevel <= 1) return 1;
  if (strengthLevel <= 10) return Math.max(1, Math.floor(Math.pow(1000, (strengthLevel - 1) / 9)));
  return Math.floor(1000 + Math.pow(strengthLevel - 10, 0.7) * 100);
};

const getSkillLevels = () => {
  try {
    const stored = localStorage.getItem('battle_skill_levels');
    if (stored) return JSON.parse(stored);
  } catch {}
  return { basicAttack: 1, thunderDash: 1, daggerStrike: 1 };
};

const saveSkillLevels = (levels: Record<string, number>) => {
  localStorage.setItem('battle_skill_levels', JSON.stringify(levels));
};

const Abilities = () => {
  const { gameState, consumeItem } = useGameState();
  const [skillLevels, setSkillLevels] = useState(getSkillLevels());

  const strengthLevel = gameState.levels.strength || 1;
  const baseDmg = getBaseDamage(strengthLevel);
  const hasDagger = (gameState.inventory || []).some(i => i.id === 'dagger' && i.quantity > 0);
  const coreStones = (gameState.inventory || []).find(i => i.id === 'enhancement_stone')?.quantity || 0;

  const skills = [
    {
      id: 'basicAttack',
      name: 'نصل الجليد الفضي',
      nameEn: 'Silver Ice Blade',
      icon: <Swords className="w-8 h-8" />,
      color: 'silver',
      mpCost: 5,
      description: 'هجوم قياسي مشبع بمانا الجليد الفضي، سريع وقاتل.',
      multiplier: 1,
      baseCastTime: 0.5, // ثانية
      unlocked: true,
      tag: 'Physical'
    },
    {
      id: 'thunderDash',
      name: 'اندفاع البرق الأزرق السماوي',
      nameEn: 'Celestial Blue Thunder',
      icon: <Zap className="w-8 h-8" />,
      color: 'blue',
      mpCost: 50,
      description: 'تجاوز حدود السرعة، صعق الأعداء بمانا البرق الأزرق.',
      multiplier: 3,
      baseCastTime: 1.5, // ثانية
      unlocked: true,
      tag: 'Ultimate'
    },
    {
      id: 'daggerStrike',
      name: 'اغتيال الظلال البنفسجية',
      nameEn: 'Violet Shadow Assassination',
      icon: <Target className="w-8 h-8" />,
      color: 'violet',
      mpCost: 25,
      description: 'طعنة تخترق الدفاعات السحرية، طاقة بنفسجية مدمرة.',
      multiplier: 2,
      baseCastTime: 1.0, // ثانية
      unlocked: hasDagger,
      tag: 'Stealth'
    },
  ];

  const upgradeSkill = (skillId: string) => {
    const currentLevel = skillLevels[skillId] || 1;
    if (currentLevel >= MAX_SKILL_LEVEL) {
      toast({ title: 'System Error', description: 'وصلت مصفوفة النواة للحد الأقصى' });
      return;
    }
    const cost = UPGRADE_COSTS[currentLevel] || 50;
    if (coreStones < cost) {
      toast({ title: 'نواة غير كافية', description: `تحتاج إلى ${cost} من أحجار النواة💎`, variant: 'destructive' });
      return;
    }
    
    consumeItem('enhancement_stone', cost);
    const newLevels = { ...skillLevels, [skillId]: currentLevel + 1 };
    setSkillLevels(newLevels);
    saveSkillLevels(newLevels);
    toast({ title: 'SYSTEM UPGRADE', description: 'تم تحسين مصفوفة المهارة بنجاح' });
  };

  const colors: any = {
    silver: { border: 'border-zinc-400', text: 'text-zinc-100', bg: 'bg-zinc-800/20', glow: 'shadow-zinc-700/50', bar: 'bg-zinc-300', btn: 'from-zinc-700 to-zinc-900 border-zinc-500' },
    blue: { border: 'border-blue-500', text: 'text-blue-300', bg: 'bg-blue-900/30', glow: 'shadow-blue-800/60', bar: 'bg-blue-400', btn: 'from-blue-600 to-blue-900 border-blue-500' },
    violet: { border: 'border-fuchsia-600', text: 'text-fuchsia-200', bg: 'bg-fuchsia-900/40', glow: 'shadow-fuchsia-800/70', bar: 'bg-fuchsia-500', btn: 'from-fuchsia-600 to-fuchsia-950 border-fuchsia-600' },
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white p-4 font-sans pb-32 relative overflow-hidden">
      {/* Background Celestial Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(20,30,50,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(20,30,50,0.4)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(100,200,255,0.1),transparent_60%)] pointer-events-none" />

      {/* Header Profile System */}
      <header className="relative z-10 flex flex-col items-center mb-10 pt-4">
        <div className="flex items-center gap-4 mb-2 opacity-80">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-zinc-400" />
            <Hexagon className="w-10 h-10 text-zinc-300 animate-pulse" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-zinc-400" />
        </div>
        <h1 className="text-3xl font-black italic tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          مصفوفة الجبروت
        </h1>
        <p className="text-[10px] font-mono text-blue-300 tracking-[0.5em] uppercase">Ability Core Matrix v3.0</p>
      </header>

      <main className="relative z-10 max-w-xl mx-auto space-y-8">
        {/* Core Stats Bar (Silver & Blue) */}
        <div className="grid grid-cols-3 gap-3 bg-zinc-950/90 border-y-2 border-zinc-700/50 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group shadow-[0_0_30px_rgba(100,200,255,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="text-center border-r-2 border-zinc-800">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">S. Level</p>
            <p className="text-2xl font-black italic text-zinc-100">{strengthLevel}</p>
          </div>
          <div className="text-center border-r-2 border-zinc-800">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Base DMG</p>
            <p className="text-2xl font-black italic text-blue-300">{baseDmg.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Core Stones</p>
            <p className="text-2xl font-black italic text-blue-100">💎 {coreStones}</p>
          </div>
        </div>

        {/* Skills Interface */}
        <div className="space-y-8">
          {skills.map((skill) => {
            const level = skillLevels[skill.id] || 1;
            const style = colors[skill.color];
            
            // حسابات الدمج والوقت
            const currentMultiplier = skill.multiplier * SKILL_LEVEL_MULTIPLIERS[Math.min(level - 1, 5)];
            const currentDmg = Math.floor(baseDmg * currentMultiplier);
            const currentCastTime = skill.baseCastTime * (1 - SKILL_TIME_REDUCERS[Math.min(level - 1, 5)]);

            // حسابات المستوى التالي
            const nextMultiplier = skill.multiplier * SKILL_LEVEL_MULTIPLIERS[Math.min(level, 5)];
            const nextDmg = Math.floor(baseDmg * nextMultiplier);
            const nextCastTime = skill.baseCastTime * (1 - SKILL_TIME_REDUCERS[Math.min(level, 5)]);

            const upgradeCost = level < MAX_SKILL_LEVEL ? UPGRADE_COSTS[level] : 0;
            const canUpgrade = skill.unlocked && level < MAX_SKILL_LEVEL && coreStones >= upgradeCost;

            return (
              <div key={skill.id} className={cn(
                "group relative bg-[#04060c] border-l-[6px] rounded-xl transition-all duration-500 overflow-hidden",
                style.border,
                skill.unlocked ? `shadow-xl ${style.glow}` : "opacity-30"
              )}>
                {/* الخلفية الداخلية للمهارة */}
                <div className={cn("absolute inset-0 opacity-10", style.bg)} />

                {!skill.unlocked && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 rounded-xl backdrop-blur-md">
                        <Lock className="w-10 h-10 text-zinc-700 mb-2" />
                        <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest border border-zinc-800 px-4 py-1 rounded-lg">LOCKED: Requires Dagger</span>
                    </div>
                )}

                <div className="p-6" dir="rtl">
                  {/* Skill Header */}
                  <div className="flex items-start gap-5 mb-5 relative z-10">
                    <div className={cn("p-5 rounded-3xl border-2 bg-black shadow-2xl relative", style.border, style.text)}>
                        {skill.icon}
                        <div className="absolute -top-3 -right-3 bg-black border-2 border-zinc-700 px-3 py-1 rounded-md text-[9px] font-black italic text-zinc-100/70">
                            {skill.tag}
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <h3 className="text-xl font-black text-white tracking-tight drop-shadow-[0_0_10px_currentColor]">{skill.name}</h3>
                        <span className={cn("text-[11px] font-mono font-bold uppercase whitespace-nowrap", style.text)}>{skill.nameEn}</span>
                      </div>
                      <p className="text-[12px] text-zinc-300 leading-relaxed italic border-r-2 border-zinc-700 pr-3">"{skill.description}"</p>
                    </div>
                  </div>

                  {/* Leveling Matrix & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-black/50 p-4 rounded-xl border-2 border-zinc-800 mb-5 relative z-10">
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Core Sync Matrix</span>
                            <span className={cn("text-sm font-black italic", style.text)}>LV. {level}</span>
                        </div>
                        <div className="flex gap-1.5 h-2">
                            {[...Array(MAX_SKILL_LEVEL)].map((_, i) => (
                                <div key={i} className={cn("flex-1 rounded-full transition-all duration-500", i < level ? style.bar : "bg-zinc-800")} />
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-r-2 md:border-r-0 md:border-t-2 border-zinc-800 pt-3 md:pt-0 md:border-none">
                        <div className="flex flex-col justify-center items-end border-r-2 md:border-r-0 border-zinc-800 pr-3 md:pr-0">
                            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-tighter flex items-center gap-1"><Zap size={10} /> Mana Output</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-white font-black text-base">{currentDmg.toLocaleString()}</span>
                                {level < MAX_SKILL_LEVEL && (
                                    <span className="text-blue-300 text-[11px] font-bold">▲ {nextDmg.toLocaleString()}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-end">
                            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-tighter flex items-center gap-1"><Hourglass size={10} /> Cast Time</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-white font-black text-base">{currentCastTime.toFixed(1)}s</span>
                                {level < MAX_SKILL_LEVEL && (
                                    <span className="text-blue-300 text-[11px] font-bold">▼ {nextCastTime.toFixed(1)}s</span>
                                )}
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Upgrade Interaction */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-blue-950/20 border border-blue-800/30 rounded-xl">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        <span className="text-[11px] font-black text-blue-300 uppercase">Cost: {skill.mpCost} MP</span>
                    </div>

                    {level < MAX_SKILL_LEVEL ? (
                        <button
                            onClick={() => upgradeSkill(skill.id)}
                            disabled={!canUpgrade}
                            className={cn(
                                "flex-1 h-12 rounded-xl border-b-4 font-black text-xs uppercase tracking-widest transition-all active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2.5 shadow-lg",
                                canUpgrade 
                                ? `bg-gradient-to-br ${style.btn} text-white hover:brightness-125` 
                                : "bg-zinc-900 border-zinc-800 text-zinc-700 cursor-not-allowed"
                            )}
                        >
                            <ArrowUp size={16} className={canUpgrade ? "animate-bounce" : ""} />
                            ترقية المصفوفة (💎 {upgradeCost})
                        </button>
                    ) : (
                        <div className="flex-1 h-12 rounded-xl bg-gradient-to-r from-zinc-800 to-black border-2 border-zinc-700/50 flex items-center justify-center gap-2.5 text-zinc-500 text-[11px] font-black uppercase italic shadow-inner">
                            <Sparkles size={16} className="text-white/30 animate-pulse" />
                            Core Level Maxed (Alpha)
                        </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Protocols Guide */}
        <div className="relative p-5 rounded-3xl bg-black border-2 border-zinc-800 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-3 opacity-5">
                <ShieldAlert className="w-20 h-20 text-white" />
            </div>
            <h4 className="text-[11px] font-black text-zinc-300 mb-4 tracking-[0.3em] flex items-center gap-2">
                <Hexagon className="w-3.5 h-3.5 text-blue-400" /> SYSTEM CORE UPGRADE PROTOCOLS
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {UPGRADE_COSTS.slice(1).map((cost, i) => (
                    <div key={i} className="flex items-center justify-between bg-zinc-950/50 p-2 rounded-lg border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">LV.{i+1} → LV.{i+2}</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-zinc-100 font-bold">Coeff: {(SKILL_LEVEL_MULTIPLIERS[i+1]*100).toFixed(0)}%</span>
                            <span className="text-[11px] text-blue-400 font-black">💎 {cost} CORES</span>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-[9px] text-zinc-600 mt-5 italic border-t-2 border-zinc-800 pt-3 flex items-center gap-2">
                <Lock size={10} /> تحذير: ترقية المهارات تقلل وقت الإلقاء بشكل طفيف وتزيد من إخراج المانا بشكل هائل.
            </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Abilities;
