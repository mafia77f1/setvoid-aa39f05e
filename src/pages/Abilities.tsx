import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { cn } from '@/lib/utils';
import { Zap, Lock, Dumbbell, Brain, Heart, Sparkles, Shield, Clock } from 'lucide-react';
import { Ability, StatType } from '@/types/game';

const categoryIcons = {
  strength: Dumbbell,
  mind: Brain,
  spirit: Heart,
  agility: Zap,
};

const categoryColors = {
  strength: { color: 'text-strength', bg: 'bg-strength/20', border: 'border-strength/40' },
  mind: { color: 'text-mind', bg: 'bg-mind/20', border: 'border-mind/40' },
  spirit: { color: 'text-spirit', bg: 'bg-spirit/20', border: 'border-spirit/40' },
  agility: { color: 'text-quran', bg: 'bg-quran/20', border: 'border-quran/40' },
};

const Abilities = () => {
  const { gameState, useAbility } = useGameState();
  const { playUseAbility } = useSoundEffects();
  const [activatingAbility, setActivatingAbility] = useState<string | null>(null);
  
  const unlockedAbilities = gameState.abilities.filter(a => a.unlocked);
  const lockedAbilities = gameState.abilities.filter(a => !a.unlocked);

  const handleUseAbility = (ability: Ability) => {
    if (!ability.unlocked || ability.id === 'a7') return;
    
    setActivatingAbility(ability.id);
    playUseAbility();
    
    // Animate ability activation
    setTimeout(() => {
      useAbility(ability.id);
      setActivatingAbility(null);
    }, 800);
  };

  const AbilityCard = ({ ability }: { ability: Ability }) => {
    const Icon = categoryIcons[ability.category];
    const colors = categoryColors[ability.category];
    const isActivating = activatingAbility === ability.id;

    return (
      <div
        className={cn(
          "relative rounded-xl overflow-hidden transition-all duration-300",
          ability.unlocked ? colors.bg : "bg-muted/10",
          ability.unlocked ? colors.border : "border-muted/30",
          "border-2",
          isActivating && "animate-ability-activate"
        )}
      >
        {/* Activation Effect Overlay */}
        {isActivating && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
            <div className="relative">
              <Sparkles className={cn("w-16 h-16 animate-spin", colors.color)} />
              <div className={cn("absolute inset-0 blur-xl", colors.bg, "animate-pulse")} />
            </div>
          </div>
        )}

        {/* Lock Overlay */}
        {!ability.unlocked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">
                المستوى {ability.requiredLevel} مطلوب
              </span>
            </div>
          </div>
        )}

        <div className="p-4">
          {/* Icon & Level */}
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center",
              ability.unlocked ? colors.bg : "bg-muted/20",
              "border",
              ability.unlocked ? colors.border : "border-muted/30"
            )}>
              <Icon className={cn("w-7 h-7", ability.unlocked ? colors.color : "text-muted-foreground")} />
            </div>
            {ability.unlocked && (
              <span className={cn("text-xs font-bold px-2 py-1 rounded-full", colors.bg, colors.color)}>
                Lv.{Math.floor(ability.level)}
              </span>
            )}
          </div>

          {/* Name & Description */}
          <h4 className={cn(
            "font-bold mb-1",
            ability.unlocked ? "text-foreground" : "text-muted-foreground"
          )}>
            {ability.name}
          </h4>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {ability.description}
          </p>

          {/* Effect */}
          <div className={cn(
            "text-xs p-2 rounded-lg mb-3",
            ability.unlocked ? "bg-primary/10 text-primary" : "bg-muted/20 text-muted-foreground"
          )}>
            <Sparkles className="w-3 h-3 inline-block mr-1" />
            {ability.effect}
          </div>

          {/* Cooldown & Use Button */}
          {ability.unlocked && ability.id !== 'a7' && (
            <button
              onClick={() => handleUseAbility(ability)}
              disabled={isActivating}
              className={cn(
                "w-full py-2 px-4 rounded-lg font-bold text-sm transition-all",
                "bg-gradient-to-r from-primary to-primary/80",
                "border border-primary/50",
                "hover:from-primary/90 hover:to-primary/70",
                "active:scale-[0.98]",
                "flex items-center justify-center gap-2"
              )}
            >
              <Zap className="w-4 h-4" />
              استخدام القدرة
            </button>
          )}

          {ability.unlocked && ability.cooldownDays > 0 && (
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>مهلة: {ability.cooldownDays} أيام</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="relative px-4 py-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/40">
          <Zap className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-primary">القدرات</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">اكتسب قدرات جديدة مع تقدمك</p>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Unlocked Abilities */}
        {unlockedAbilities.length > 0 && (
          <section className="system-panel p-4">
            <h3 className="mb-4 text-lg font-semibold text-secondary flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              القدرات المكتسبة ({unlockedAbilities.length})
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {unlockedAbilities.map(ability => (
                <AbilityCard key={ability.id} ability={ability} />
              ))}
            </div>
          </section>
        )}

        {/* Locked Abilities */}
        <section className="system-panel p-4">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5 text-muted-foreground" />
            القدرات المقفلة ({lockedAbilities.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {lockedAbilities.map(ability => (
              <AbilityCard key={ability.id} ability={ability} />
            ))}
          </div>
        </section>

        {unlockedAbilities.length === 0 && (
          <div className="mt-6 system-panel p-6 text-center">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              ارفع مستوياتك لتفتح قدرات جديدة!
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Abilities;