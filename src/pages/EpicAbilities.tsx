import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { cn } from '@/lib/utils';
import { Zap, Lock, Dumbbell, Brain, Heart, Sparkles, Shield, Clock, Flame } from 'lucide-react';
import { Ability, StatType } from '@/types/game';

const categoryConfig: Record<StatType, { icon: any; color: string; gradient: string; name: string }> = {
  strength: { icon: Dumbbell, color: 'hsl(0 70% 55%)', gradient: 'from-red-500/20 to-red-900/20', name: 'القوة' },
  mind: { icon: Brain, color: 'hsl(210 80% 55%)', gradient: 'from-blue-500/20 to-blue-900/20', name: 'العقل' },
  spirit: { icon: Heart, color: 'hsl(270 70% 60%)', gradient: 'from-purple-500/20 to-purple-900/20', name: 'الروح' },
  agility: { icon: Zap, color: 'hsl(150 60% 45%)', gradient: 'from-green-500/20 to-green-900/20', name: 'الرشاقة' },
};

const EpicAbilities = () => {
  const { gameState, useAbility } = useGameState();
  const { playUseAbility } = useSoundEffects();
  const [activatingAbility, setActivatingAbility] = useState<string | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  
  const unlockedAbilities = gameState.abilities.filter(a => a.unlocked);
  const lockedAbilities = gameState.abilities.filter(a => !a.unlocked);

  const handleUseAbility = (ability: Ability) => {
    if (!ability.unlocked || ability.id === 'a7') return;
    
    setActivatingAbility(ability.id);
    playUseAbility();
    
    setTimeout(() => {
      useAbility(ability.id);
      setActivatingAbility(null);
      setSelectedAbility(null);
    }, 1500);
  };

  const AbilityCard = ({ ability, index }: { ability: Ability; index: number }) => {
    const config = categoryConfig[ability.category] || categoryConfig.strength;
    const Icon = config.icon;
    const isActivating = activatingAbility === ability.id;

    return (
      <button
        onClick={() => setSelectedAbility(ability)}
        className={cn(
          "relative w-full p-4 rounded-xl transition-all duration-300 text-right overflow-hidden",
          "border-2 hover:scale-[1.02]",
          ability.unlocked ? "hover:border-opacity-80" : "opacity-50",
          "animate-fade-in"
        )}
        style={{ 
          animationDelay: `${index * 0.1}s`,
          background: `linear-gradient(135deg, ${ability.unlocked ? `${config.color}15` : 'hsl(0 0% 10%)'}, transparent)`,
          borderColor: ability.unlocked ? `${config.color}40` : 'hsl(0 0% 20%)',
          boxShadow: ability.unlocked ? `0 0 30px ${config.color}20` : 'none',
        }}
      >
        {/* Activation overlay */}
        {isActivating && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
            <div className="relative">
              <Flame 
                className="w-16 h-16 animate-spin"
                style={{ color: config.color, filter: `drop-shadow(0 0 20px ${config.color})` }}
              />
            </div>
          </div>
        )}

        {/* Lock overlay */}
        {!ability.unlocked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto text-gray-500 mb-2" />
              <span className="text-xs text-gray-500">المستوى {ability.requiredLevel}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
            style={{ 
              background: `linear-gradient(135deg, ${config.color}30, ${config.color}10)`,
              border: `2px solid ${config.color}50`,
              boxShadow: ability.unlocked ? `0 0 20px ${config.color}30` : 'none',
            }}
          >
            <Icon className="w-8 h-8" style={{ color: config.color }} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">{ability.name}</span>
              {ability.unlocked && (
                <span 
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: `${config.color}30`, color: config.color }}
                >
                  Lv.{ability.level}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 line-clamp-1">{ability.description}</p>
            {ability.effect && (
              <div 
                className="mt-2 text-xs flex items-center gap-1"
                style={{ color: config.color }}
              >
                <Sparkles className="w-3 h-3" />
                {ability.effect}
              </div>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white pb-40 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.08),transparent_40%)]" />
      </div>

      {/* Header */}
      <header className="relative z-20 pt-12 pb-8 px-6 text-center border-b border-purple-500/20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-2">
          <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          <span className="text-xs font-black tracking-[0.3em] text-purple-400">SKILL INVENTORY</span>
        </div>
        <h1 className="text-3xl font-black text-white mt-2">القدرات</h1>
        <p className="text-sm text-gray-500 mt-1">اكتسب قدرات جديدة مع تقدمك في المستويات</p>
      </header>

      <main className="relative z-10 px-6 py-8 space-y-8">
        {/* Unlocked Abilities */}
        {unlockedAbilities.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="font-bold text-white">القدرات المكتسبة</h2>
                <p className="text-xs text-gray-500">{unlockedAbilities.length} قدرة مفتوحة</p>
              </div>
            </div>
            <div className="space-y-3">
              {unlockedAbilities.map((ability, i) => (
                <AbilityCard key={ability.id} ability={ability} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Locked Abilities */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-500/20 border border-gray-500/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h2 className="font-bold text-white">القدرات المقفلة</h2>
              <p className="text-xs text-gray-500">{lockedAbilities.length} قدرة للفتح</p>
            </div>
          </div>
          <div className="space-y-3">
            {lockedAbilities.map((ability, i) => (
              <AbilityCard key={ability.id} ability={ability} index={i} />
            ))}
          </div>
        </section>

        {unlockedAbilities.length === 0 && (
          <div className="p-8 rounded-xl bg-black/40 border border-white/5 text-center">
            <Shield className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-500">ارفع مستوياتك لتفتح قدرات جديدة!</p>
          </div>
        )}
      </main>

      {/* Ability Detail Modal */}
      {selectedAbility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedAbility(null)} />
          
          <div 
            className="relative w-full max-w-sm rounded-2xl overflow-hidden animate-scale-in"
            style={{
              background: 'linear-gradient(180deg, hsl(270 50% 8%), hsl(270 60% 3%))',
              border: `2px solid ${categoryConfig[selectedAbility.category]?.color || 'hsl(270 70% 50%)'}50`,
              boxShadow: `0 0 60px ${categoryConfig[selectedAbility.category]?.color || 'hsl(270 70% 50%)'}30`,
            }}
          >
            <div className="p-6 text-center">
              <div 
                className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
                style={{ 
                  background: `linear-gradient(135deg, ${categoryConfig[selectedAbility.category]?.color}30, ${categoryConfig[selectedAbility.category]?.color}10)`,
                  border: `2px solid ${categoryConfig[selectedAbility.category]?.color}50`,
                }}
              >
                {(() => {
                  const Icon = categoryConfig[selectedAbility.category]?.icon || Zap;
                  return <Icon className="w-10 h-10" style={{ color: categoryConfig[selectedAbility.category]?.color }} />;
                })()}
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">{selectedAbility.name}</h2>
              <p className="text-sm text-gray-400 mb-4">{selectedAbility.description}</p>
              
              <div 
                className="p-4 rounded-xl mb-4"
                style={{ 
                  background: `${categoryConfig[selectedAbility.category]?.color}10`,
                  border: `1px solid ${categoryConfig[selectedAbility.category]?.color}30`,
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" style={{ color: categoryConfig[selectedAbility.category]?.color }} />
                  <span className="text-sm font-bold" style={{ color: categoryConfig[selectedAbility.category]?.color }}>التأثير</span>
                </div>
                <p className="text-sm text-white">{selectedAbility.effect}</p>
              </div>

              {selectedAbility.cooldownDays > 0 && (
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>مهلة الاستخدام: {selectedAbility.cooldownDays} أيام</span>
                </div>
              )}
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setSelectedAbility(null)}
                className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold hover:bg-white/10 transition-all"
              >
                إغلاق
              </button>
              {selectedAbility.unlocked && selectedAbility.id !== 'a7' && (
                <button
                  onClick={() => handleUseAbility(selectedAbility)}
                  disabled={activatingAbility === selectedAbility.id}
                  className="flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${categoryConfig[selectedAbility.category]?.color}, ${categoryConfig[selectedAbility.category]?.color}80)`,
                    border: `1px solid ${categoryConfig[selectedAbility.category]?.color}60`,
                  }}
                >
                  <Zap className="w-5 h-5" />
                  استخدام
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default EpicAbilities;