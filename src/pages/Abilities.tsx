import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { useGameState } from '@/hooks/useGameState';
import { Zap, Swords, Shield, ArrowUp, Lock, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SKILL_LEVEL_MULTIPLIERS = [1, 1.3, 1.6, 2.0, 2.5, 3.0];
const UPGRADE_COSTS = [0, 2, 4, 10, 25, 50]; // stones for level 1→2, 2→3, etc.
const MAX_SKILL_LEVEL = 6; // Alpha max

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
  const enhancementStones = (gameState.inventory || []).find(i => i.id === 'enhancement_stone')?.quantity || 0;

  const skills = [
    {
      id: 'basicAttack',
      name: 'ضربة أساسية',
      nameEn: 'Basic Attack',
      icon: <Swords className="w-6 h-6" />,
      color: 'cyan',
      mpCost: 5,
      description: 'هجمة سريعة بالسيف تعتمد على القوة البدنية',
      multiplier: 1,
      unlocked: true,
    },
    {
      id: 'thunderDash',
      name: 'اندفاع البرق',
      nameEn: 'Thunderclap Dash',
      icon: <Zap className="w-6 h-6" />,
      color: 'yellow',
      mpCost: 50,
      description: 'هجمة خاطفة تصعق العدو - تسبب اهتزاز الشاشة',
      multiplier: 3,
      unlocked: true,
    },
    {
      id: 'daggerStrike',
      name: 'ضربة الخنجر',
      nameEn: 'Dagger Strike',
      icon: <Shield className="w-6 h-6" />,
      color: 'purple',
      mpCost: 25,
      description: 'طعنة مميتة بالخنجر - تتطلب شراء الخنجر من المتجر',
      multiplier: 2,
      unlocked: hasDagger,
    },
  ];

  const upgradeSkill = (skillId: string) => {
    const currentLevel = skillLevels[skillId] || 1;
    if (currentLevel >= MAX_SKILL_LEVEL) {
      toast({ title: 'الحد الأقصى', description: 'وصلت للحد الأقصى في نسخة Alpha' });
      return;
    }
    const cost = UPGRADE_COSTS[currentLevel] || 50;
    if (enhancementStones < cost) {
      toast({ title: 'أحجار غير كافية', description: `تحتاج ${cost} حجر تطوير`, variant: 'destructive' });
      return;
    }
    // Consume stones
    consumeItem('enhancement_stone', cost);
    const newLevels = { ...skillLevels, [skillId]: currentLevel + 1 };
    setSkillLevels(newLevels);
    saveSkillLevels(newLevels);
    toast({ title: 'تمت الترقية!', description: `${skills.find(s => s.id === skillId)?.name} → المستوى ${currentLevel + 1}` });
  };

  const getColorClasses = (color: string) => ({
    border: color === 'cyan' ? 'border-cyan-500/40' : color === 'yellow' ? 'border-yellow-500/40' : 'border-purple-500/40',
    bg: color === 'cyan' ? 'bg-cyan-500/10' : color === 'yellow' ? 'bg-yellow-500/10' : 'bg-purple-500/10',
    text: color === 'cyan' ? 'text-cyan-400' : color === 'yellow' ? 'text-yellow-400' : 'text-purple-400',
    glow: color === 'cyan' ? 'shadow-[0_0_20px_rgba(6,182,212,0.2)]' : color === 'yellow' ? 'shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
    barBg: color === 'cyan' ? 'bg-cyan-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-purple-500',
    btnBg: color === 'cyan' ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/50' : color === 'yellow' ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/50' : 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50',
  });

  return (
    <div className="min-h-screen bg-[#020817] text-white p-4 font-sans pb-24">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.08),transparent_70%)]" />
      </div>

      <header className="relative z-10 text-center mb-6 border-b border-purple-500/30 pb-4">
        <div className="flex items-center justify-center gap-3">
          <Zap className="w-5 h-5 text-purple-500" />
          <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-white">القدرات القتالية</h1>
          <Zap className="w-5 h-5 text-purple-500" />
        </div>
        <p className="text-[10px] text-zinc-500 mt-1 tracking-wider">BATTLE SKILLS MANAGEMENT</p>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-4">
        {/* Stats overview */}
        <div className="bg-black/60 border border-purple-500/20 p-3 rounded-lg" dir="rtl">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] text-zinc-500">مستوى القوة</span>
              <div className="text-lg font-black text-white">{strengthLevel}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500">الضرر الأساسي</span>
              <div className="text-lg font-black text-cyan-400">{baseDmg.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500">أحجار التطوير</span>
              <div className="text-lg font-black text-yellow-400">💎 {enhancementStones}</div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {skills.map((skill) => {
          const level = skillLevels[skill.id] || 1;
          const colors = getColorClasses(skill.color);
          const currentDmg = Math.floor(baseDmg * skill.multiplier * SKILL_LEVEL_MULTIPLIERS[Math.min(level - 1, 5)]);
          const nextDmg = level < MAX_SKILL_LEVEL ? Math.floor(baseDmg * skill.multiplier * SKILL_LEVEL_MULTIPLIERS[Math.min(level, 5)]) : currentDmg;
          const upgradeCost = level < MAX_SKILL_LEVEL ? UPGRADE_COSTS[level] : 0;
          const canUpgrade = skill.unlocked && level < MAX_SKILL_LEVEL && enhancementStones >= upgradeCost;

          return (
            <div key={skill.id} className={`relative bg-black/60 border ${colors.border} rounded-lg overflow-hidden ${colors.glow} ${!skill.unlocked ? 'opacity-50' : ''}`}>
              {/* Lock overlay */}
              {!skill.unlocked && (
                <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500">يتطلب شراء الخنجر من المتجر</p>
                  </div>
                </div>
              )}

              <div className="p-4" dir="rtl">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`p-2.5 rounded-lg ${colors.bg} ${colors.text}`}>
                    {skill.icon}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-black text-white text-sm">{skill.name}</h3>
                      <span className={`text-[9px] font-bold ${colors.text} tracking-wider`}>{skill.nameEn}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mb-2">{skill.description}</p>

                    {/* Level bar */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] text-zinc-500">المستوى</span>
                      <div className="flex gap-0.5 flex-1">
                        {[...Array(MAX_SKILL_LEVEL)].map((_, i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < level ? colors.barBg : 'bg-zinc-800'}`} />
                        ))}
                      </div>
                      <span className={`text-[10px] font-black ${colors.text}`}>{level}/{MAX_SKILL_LEVEL}</span>
                    </div>

                    {/* Damage info */}
                    <div className="flex items-center justify-between text-[9px] mb-2">
                      <div>
                        <span className="text-zinc-500">الضرر: </span>
                        <span className="text-white font-bold">{currentDmg.toLocaleString()}</span>
                        {level < MAX_SKILL_LEVEL && (
                          <span className="text-emerald-400"> → {nextDmg.toLocaleString()}</span>
                        )}
                      </div>
                      <div>
                        <span className="text-zinc-500">MP: </span>
                        <span className="text-blue-400 font-bold">{skill.mpCost}</span>
                      </div>
                    </div>

                    {/* Upgrade button */}
                    {skill.unlocked && level < MAX_SKILL_LEVEL && (
                      <button
                        onClick={() => upgradeSkill(skill.id)}
                        disabled={!canUpgrade}
                        className={`w-full py-2 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-2 transition-all ${
                          canUpgrade ? colors.btnBg + ' text-white' : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        <ArrowUp size={12} />
                        ترقية (💎 {upgradeCost} حجر)
                      </button>
                    )}
                    {level >= MAX_SKILL_LEVEL && (
                      <div className="w-full py-2 rounded-lg border border-zinc-700/50 bg-zinc-900/30 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-2">
                        <Sparkles size={12} />
                        الحد الأقصى (Alpha)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Enhancement guide */}
        <div className="bg-black/40 border border-zinc-800/50 rounded-lg p-3" dir="rtl">
          <h4 className="text-[10px] text-zinc-400 font-bold mb-2 tracking-wider">📖 دليل التطوير</h4>
          <div className="space-y-1">
            {UPGRADE_COSTS.slice(1).map((cost, i) => (
              <div key={i} className="flex justify-between text-[9px]">
                <span className="text-zinc-500">المستوى {i + 1} → {i + 2}</span>
                <span className="text-yellow-400/80 font-bold">💎 {cost} حجر</span>
              </div>
            ))}
          </div>
          <p className="text-[8px] text-zinc-600 mt-2 border-t border-zinc-800/50 pt-2">
            * احصل على أحجار التطوير من المتجر - النسخة الرسمية ستحتوي على مستويات أكثر
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Abilities;
