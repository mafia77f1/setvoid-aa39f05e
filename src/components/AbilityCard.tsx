import { Ability } from '@/types/game';
import { Lock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AbilityCardProps {
  ability: Ability;
}

const categoryColors = {
  strength: 'text-strength border-strength/30',
  mind: 'text-mind border-mind/30',
  spirit: 'text-spirit border-spirit/30',
  quran: 'text-quran border-quran/30',
};

export const AbilityCard = ({ ability }: AbilityCardProps) => {
  return (
    <div
      className={cn(
        'ability-card',
        ability.unlocked ? categoryColors[ability.category] : 'locked'
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full',
          ability.unlocked ? 'bg-primary/20' : 'bg-muted'
        )}
      >
        {ability.unlocked ? (
          <Zap className={cn('h-7 w-7', categoryColors[ability.category].split(' ')[0])} />
        ) : (
          <Lock className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <h4 className="font-semibold">{ability.name}</h4>
      <p className="text-xs text-muted-foreground">{ability.description}</p>
      {ability.unlocked ? (
        <span className="level-badge mt-2">المستوى {ability.level}</span>
      ) : (
        <span className="mt-2 text-xs text-muted-foreground">
          يتطلب المستوى {ability.requiredLevel}
        </span>
      )}
    </div>
  );
};
