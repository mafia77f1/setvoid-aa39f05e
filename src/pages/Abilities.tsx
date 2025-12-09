import { useGameState } from '@/hooks/useGameState';
import { AbilityCard } from '@/components/AbilityCard';
import { BottomNav } from '@/components/BottomNav';
import { Zap } from 'lucide-react';

const Abilities = () => {
  const { gameState } = useGameState();
  
  const unlockedAbilities = gameState.abilities.filter(a => a.unlocked);
  const lockedAbilities = gameState.abilities.filter(a => !a.unlocked);

  return (
    <div className="min-h-screen pb-24">
      <header className="relative px-4 py-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/40">
          <Zap className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-primary">القدرات</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">اكتسب قدرات جديدة مع تقدمك</p>
      </header>

      <main className="container mx-auto px-4 py-6">
        {unlockedAbilities.length > 0 && (
          <div className="system-panel p-4 mb-6">
            <h3 className="mb-4 text-lg font-semibold text-secondary flex items-center gap-2">
              <Zap className="w-5 h-5" />
              القدرات المكتسبة
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {unlockedAbilities.map(ability => (
                <AbilityCard key={ability.id} ability={ability} />
              ))}
            </div>
          </div>
        )}

        <div className="system-panel p-4">
          <h3 className="mb-4 text-lg font-semibold">القدرات المقفلة</h3>
          <div className="grid grid-cols-2 gap-4">
            {lockedAbilities.map(ability => (
              <AbilityCard key={ability.id} ability={ability} />
            ))}
          </div>
        </div>

        {unlockedAbilities.length === 0 && (
          <div className="mt-6 system-panel p-6 text-center">
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