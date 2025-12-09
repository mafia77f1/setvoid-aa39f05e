import { useGameState } from '@/hooks/useGameState';
import { AbilityCard } from '@/components/AbilityCard';
import { BottomNav } from '@/components/BottomNav';

const Abilities = () => {
  const { gameState } = useGameState();
  
  const unlockedAbilities = gameState.abilities.filter(a => a.unlocked);
  const lockedAbilities = gameState.abilities.filter(a => !a.unlocked);

  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-border bg-card/50 px-4 py-6">
        <h1 className="text-2xl font-bold">القدرات</h1>
        <p className="text-muted-foreground">اكتسب قدرات جديدة مع تقدمك</p>
      </header>

      <main className="container mx-auto px-4 py-6">
        {unlockedAbilities.length > 0 && (
          <>
            <h3 className="mb-4 text-lg font-semibold text-secondary">القدرات المكتسبة</h3>
            <div className="mb-8 grid grid-cols-2 gap-4">
              {unlockedAbilities.map(ability => (
                <AbilityCard key={ability.id} ability={ability} />
              ))}
            </div>
          </>
        )}

        <h3 className="mb-4 text-lg font-semibold">القدرات المقفلة</h3>
        <div className="grid grid-cols-2 gap-4">
          {lockedAbilities.map(ability => (
            <AbilityCard key={ability.id} ability={ability} />
          ))}
        </div>

        {unlockedAbilities.length === 0 && (
          <div className="mt-8 rounded-xl border border-border bg-card/50 p-6 text-center">
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
