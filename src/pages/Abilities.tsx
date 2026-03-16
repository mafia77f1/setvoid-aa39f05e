import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { useGameState } from '@/hooks/useGameState';
import { Zap, Swords, Shield, ArrowUp, Lock, Sparkles, Hexagon, Cpu, Flame, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SKILL_LEVEL_MULTIPLIERS = [1, 1.3, 1.6, 2.0, 2.5, 3.0];
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
      name: 'ضربة النصل الأساسية',
      nameEn: 'Core Blade Strike',
      icon: <Swords className="w-7 h-7" />,
      color: 'cyan',
      mpCost: 5,
      description: 'الهجوم القياسي للنظام، يعتمد على تسريع المانا في النصل.',
      multiplier: 1,
      unlocked: true,
      tag: 'Physical'
    },
    {
      id: 'thunderDash',
      name: 'اندفاع البرق السماوي',
      nameEn: 'Celestial Thunder',
      icon: <Zap className="w-7 h-7" />,
      color: 'yellow',
      mpCost: 50,
      description: 'تجاوز حدود السرعة البشرية، صعق الأعداء بمانا البرق.',
      multiplier: 3,
      unlocked: true,
      tag: 'Ultimate'
    },
    {
      id: 'daggerStrike',
      name: 'اغتيال الظلال',
      nameEn: 'Shadow Assassination',
      icon: <Target className="w-7 h-7" />,
      color: 'purple',
      mpCost: 25,
      description: 'طعنة تخترق دفاعات العدو السحرية، تتطلب خنجر الظلال.',
      multiplier: 2,
      unlocked: hasDagger,
      tag: 'Stealth'
    },
  ];

  const upgradeSkill = (skillId: string) => {
    const currentLevel = skillLevels[skillId] || 1;
    if (currentLevel >= MAX_SKILL_LEVEL) {
      toast({ title: 'System Error', description: 'تم الوصول للحد الأقصى للنواة' });
      return;
    }
    const cost = UPGRADE_COSTS[currentLevel] || 50;
    if (coreStones < cost) {
      toast({ title: 'مانا غير كافية', description: `تحتاج إلى ${cost} من أحجار النواة`, variant: 'destructive' });
      return;
    }
    
    consumeItem('enhancement_stone', cost);
    const newLevels = { ...skillLevels, [skillId]: currentLevel + 1 };
    setSkillLevels(newLevels);
    saveSkillLevels(newLevels);
    toast({ title: 'SYSTEM UPGRADE', description: 'تم تحسين مصفوفة المهارة بنجاح' });
  };

  const colors: any = {
    cyan: { border: 'border-cyan-500/50', text: 'text-cyan-400', bg: 'bg-cyan-500/20', glow: 'shadow-cyan-900/40', bar: 'bg-cyan-500' },
    yellow: { border: 'border-amber-500/50', text: 'text-amber-400', bg: 'bg-amber-500/20', glow: 'shadow-amber-900/40', bar: 'bg-amber-500' },
    purple: { border: 'border-fuchsia-500/50', text: 'text-fuchsia-400', bg: 'bg-fuchsia-500/20', glow: 'shadow-fuchsia-900/40', bar: 'bg-fuchsia-500' },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 font-sans pb-28 relative overflow-hidden">
      {/* Background Tech Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.5)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

      {/* Header Profile System */}
      <header className="relative z-10 flex flex-col items-center mb-8 pt-4">
        <div className="flex items-center gap-4 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
            <Hexagon className="w-8 h-8 text-primary animate-pulse" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
        </div>
        <h1 className="text-2xl font-black italic tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          مصفوفة المهارات
        </h1>
        <p className="text-[9px] font-mono text-primary tracking-[0.4em] uppercase">Ability Core Matrix v2.0</p>
      </header>

      <main className="relative z-10 max-w-lg mx-auto space-y-6">
        {/* Core Stats Bar */}
        <div className="grid grid-cols-3 gap-3 bg-black/80 border-y border-white/5 backdrop-blur-md p-4 rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="text-center border-r border-white/10">
            <p className="text-[8px] text-zinc-500 uppercase font-black">S. Level</p>
            <p className="text-xl font-black italic text-white">{strengthLevel}</p>
          </div>
          <div className="text-center border-r border-white/10">
            <p className="text-[8px] text-zinc-500 uppercase font-black">Base DMG</p>
            <p className="text-xl font-black italic text-cyan-400">{baseDmg.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-[8px] text-zinc-500 uppercase font-black">Core Stones</p>
            <p className="text-xl font-black italic text-amber-500">💎 {coreStones}</p>
          </div>
        </div>

        {/* Skills Interface */}
        <div className="space-y-6">
          {skills.map((skill) => {
            const level = skillLevels[skill.id] || 1;
            const style = colors[skill.color];
            const currentDmg = Math.floor(baseDmg * skill.multiplier * SKILL_LEVEL_MULTIPLIERS[Math.min(level - 1, 5)]);
            const nextDmg = level < MAX_SKILL_LEVEL ? Math.floor(baseDmg * skill.multiplier * SKILL_LEVEL_MULTIPLIERS[Math.min(level, 5)]) : currentDmg;
            const upgradeCost = level < MAX_SKILL_LEVEL ? UPGRADE_COSTS[level] : 0;
            const canUpgrade = skill.unlocked && level < MAX_SKILL_LEVEL && coreStones >= upgradeCost;

            return (
              <div key={skill.id} className={cn(
                "group relative bg-[#0a0a0a] border-l-4 rounded-xl transition-all duration-500",
                style.border,
                skill.unlocked ? `shadow-lg ${style.glow}` : "opacity-40"
              )}>
                {!skill.unlocked && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 rounded-xl backdrop-blur-md">
                        <Lock className="w-8 h-8 text-zinc-700 mb-2" />
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">LOCKED: Requires Dagger</span>
                    </div>
                )}

                <div className="p-5" dir="rtl">
                  {/* Skill Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={cn("p-4 rounded-2xl border bg-black shadow-inner relative", style.border, style.text)}>
                        {skill.icon}
                        <div className="absolute -top-2 -right-2 bg-black border border-white/10 px-2 py-0.5 rounded text-[8px] font-black italic text-white/50">
                            {skill.tag}
                        </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-black text-white tracking-tight">{skill.name}</h3>
                        <span className={cn("text-[10px] font-mono font-bold uppercase", style.text)}>{skill.nameEn}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed italic">"{skill.description}"</p>
                    </div>
                  </div>

                  {/* Leveling Matrix */}
                  <div className="grid grid-cols-2 gap-4 bg-black/40 p-3 rounded-xl border border-white/5 mb-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[9px] text-zinc-500 font-black uppercase">Core Sync</span>
                            <span className={cn("text-xs font-black", style.text)}>LV. {level}</span>
                        </div>
                        <div className="flex gap-1 h-1.5">
                            {[...Array(MAX_SKILL_LEVEL)].map((_, i) => (
                                <div key={i} className={cn("flex-1 rounded-full transition-all duration-500", i < level ? style.bar : "bg-zinc-800")} />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-end">
                        <span className="text-[9px] text-zinc-500 font-black uppercase tracking-tighter">Mana Output</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-white font-black text-sm">{currentDmg.toLocaleString()}</span>
                            {level < MAX_SKILL_LEVEL && (
                                <span className="text-emerald-500 text-[10px] font-bold">▲ {nextDmg.toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                  </div>

                  {/* Upgrade Interaction */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                        <Cpu className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] font-black text-blue-400">MP: {skill.mpCost}</span>
                    </div>

                    {level < MAX_SKILL_LEVEL ? (
                        <button
                            onClick={() => upgradeSkill(skill.id)}
                            disabled={!canUpgrade}
                            className={cn(
                                "flex-1 h-11 rounded-lg border-b-4 font-black text-xs uppercase tracking-widest transition-all active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2",
                                canUpgrade 
                                ? `bg-gradient-to-r from-zinc-800 to-black ${style.border} text-white hover:brightness-125` 
                                : "bg-zinc-900 border-zinc-800 text-zinc-700 cursor-not-allowed"
                            )}
                        >
                            <ArrowUp size={14} className={canUpgrade ? "animate-bounce" : ""} />
                            ترقية النواة (💎 {upgradeCost})
                        </button>
                    ) : (
                        <div className="flex-1 h-11 rounded-lg bg-zinc-900/50 border border-white/5 flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-black uppercase italic">
                            <Sparkles size={14} className="text-amber-500" />
                            Core Level Maxed (Alpha)
                        </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Protocol Guide */}
        <div className="relative p-4 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <Flame className="w-16 h-16 text-white" />
            </div>
            <h4 className="text-[10px] font-black text-zinc-300 mb-3 tracking-[0.2em] flex items-center gap-2">
                <Shield className="w-3 h-3 text-primary" /> SYSTEM UPGRADE PROTOCOLS
            </h4>
            <div className="grid grid-cols-2 gap-y-2">
                {UPGRADE_COSTS.slice(1).map((cost, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                        <span className="text-[9px] text-zinc-500 font-bold">LV.{i+1} → LV.{i+2}:</span>
                        <span className="text-[10px] text-amber-500 font-black tracking-tighter">💎 {cost} CORES</span>
                    </div>
                ))}
            </div>
            <p className="text-[8px] text-zinc-600 mt-4 italic border-t border-white/5 pt-2">
                * تحذير: ترقية المهارات تزيد من استهلاك المانا بشكل طردي مع قوة الإخراج.
            </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Abilities;
