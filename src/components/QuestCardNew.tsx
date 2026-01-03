import { Quest } from '@/types/game';
import { Check, Circle, Dumbbell, Brain, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestCardNewProps {
  quest: Quest;
  onComplete: (id: string) => void;
}

const categoryConfig = {
  strength: { icon: Dumbbell, color: 'text-strength', borderColor: 'border-l-strength', bgColor: 'bg-strength/10' },
  mind: { icon: Brain, color: 'text-mind', borderColor: 'border-l-mind', bgColor: 'bg-mind/10' },
  spirit: { icon: Heart, color: 'text-spirit', borderColor: 'border-l-spirit', bgColor: 'bg-spirit/10' },
  agility: { icon: Zap, color: 'text-agility', borderColor: 'border-l-agility', bgColor: 'bg-agility/10' },
};

export const QuestCardNew = ({ quest, onComplete }: QuestCardNewProps) => {
  const config = categoryConfig[quest.category];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'quest-card-new border-r-4',
        config.borderColor,
        quest.completed && 'completed'
      )}
      onClick={() => !quest.completed && onComplete(quest.id)}
    >
      {/* Category Icon */}
      <div className={cn('ability-icon', config.bgColor)}>
        <Icon className={cn('w-6 h-6', config.color)} />
      </div>

      {/* Quest Info */}
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          'font-semibold text-sm mb-0.5 truncate',
          quest.completed && 'line-through opacity-70'
        )}>
          {quest.title}
        </h4>
        <p className="text-xs text-muted-foreground truncate">{quest.description}</p>
      </div>

      {/* XP Reward */}
      <div className="text-left">
        <div className={cn('text-sm font-bold', config.color)}>+{quest.xpReward}</div>
        <div className="text-[10px] text-muted-foreground">XP</div>
      </div>

      {/* Completion Status */}
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all shrink-0',
          quest.completed
            ? 'border-secondary bg-secondary/20 text-secondary'
            : 'border-muted-foreground/50 hover:border-primary/50'
        )}
      >
        {quest.completed ? (
          <Check className="h-4 w-4" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
      </div>
    </div>
  );
};