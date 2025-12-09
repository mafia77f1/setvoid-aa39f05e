import { Quest } from '@/types/game';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestCardProps {
  quest: Quest;
  onComplete: (id: string) => void;
}

const categoryColors = {
  strength: 'border-l-strength',
  mind: 'border-l-mind',
  spirit: 'border-l-spirit',
  quran: 'border-l-quran',
};

export const QuestCard = ({ quest, onComplete }: QuestCardProps) => {
  return (
    <div
      className={cn(
        'quest-card border-r-4',
        categoryColors[quest.category],
        quest.completed && 'completed'
      )}
      onClick={() => !quest.completed && onComplete(quest.id)}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
          quest.completed
            ? 'border-secondary bg-secondary text-secondary-foreground'
            : 'border-muted-foreground'
        )}
      >
        {quest.completed ? (
          <Check className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1">
        <h4 className={cn('font-medium', quest.completed && 'line-through opacity-70')}>
          {quest.title}
        </h4>
        <p className="text-sm text-muted-foreground">{quest.description}</p>
      </div>
      <div className="text-sm font-bold text-primary">+{quest.xpReward} XP</div>
    </div>
  );
};
