import { Ability } from '@/types/game';
import { Lock, Zap, Dumbbell, Brain, Heart, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AbilityCardMiniProps {
  ability: Ability;
}

const categoryIcons = {
  strength: Dumbbell,
  mind: Brain,
  spirit: Heart,
  quran: BookOpen,
};

const categoryColors = {
  strength: 'text-strength border-strength/30 bg-strength/10',
  mind: 'text-mind border-mind/30 bg-mind/10',
  spirit: 'text-spirit border-spirit/30 bg-spirit/10',
  quran: 'text-quran border-quran/30 bg-quran/10',
};

export const AbilityCardMini = ({ ability }: AbilityCardMiniProps) => {
  const Icon = ability.unlocked ? (categoryIcons[ability.category] || Zap) : Lock;
  const colorClass = categoryColors[ability.category];

  return (
    <div
      className={cn(
        'relative p-3 rounded-lg border transition-all duration-300',
        ability.unlocked 
          ? colorClass
          : 'border-muted/50 bg-muted/20 opacity-50'
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn('w-4 h-4', ability.unlocked ? colorClass.split(' ')[0] : 'text-muted-foreground')} />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold truncate">{ability.name}</h4>
        </div>
        {ability.unlocked && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-card/50 border border-current/20">
            Lv.{ability.level}
          </span>
        )}
      </div>
    </div>
  );
};