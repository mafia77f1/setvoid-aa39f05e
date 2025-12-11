import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, AlertCircle, Dumbbell, Brain, Heart, BookOpen, Clock } from 'lucide-react';
import { StatType, Quest, QuestDifficulty } from '@/types/game';

interface DailyQuestCardProps {
  category: StatType;
  tasks: { id: string; title: string; completed: boolean }[];
  difficulty: QuestDifficulty;
  xpReward: number;
  onTaskComplete: (taskId: string) => void;
  timeRemaining?: string;
}

const categoryConfig = {
  strength: { 
    icon: Dumbbell, 
    name: 'تدريب القوة',
    color: 'text-strength',
    bgColor: 'bg-strength',
    borderColor: 'border-strength'
  },
  mind: { 
    icon: Brain, 
    name: 'تدريب العقل',
    color: 'text-mind',
    bgColor: 'bg-mind',
    borderColor: 'border-mind'
  },
  spirit: { 
    icon: Heart, 
    name: 'تدريب الروح',
    color: 'text-spirit',
    bgColor: 'bg-spirit',
    borderColor: 'border-spirit'
  },
  quran: { 
    icon: BookOpen, 
    name: 'تدريب القرآن',
    color: 'text-quran',
    bgColor: 'bg-quran',
    borderColor: 'border-quran'
  },
};

const difficultyColors = {
  easy: { border: 'border-r-foreground/60', label: 'سهل', labelColor: 'text-foreground/80' },
  medium: { border: 'border-r-mind', label: 'متوسط', labelColor: 'text-mind' },
  hard: { border: 'border-r-spirit', label: 'صعب', labelColor: 'text-spirit' },
  legendary: { border: 'border-r-foreground/90', label: 'أسطوري', labelColor: 'text-foreground' },
};

export const DailyQuestCard = ({ 
  category, 
  tasks, 
  difficulty, 
  xpReward, 
  onTaskComplete,
  timeRemaining 
}: DailyQuestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = categoryConfig[category];
  const diffConfig = difficultyColors[difficulty];
  const Icon = config.icon;
  const completedTasks = tasks.filter(t => t.completed).length;
  const allCompleted = completedTasks === tasks.length;

  return (
    <div 
      className={cn(
        "notification-panel cursor-pointer transition-all duration-300",
        "animate-modal-appear",
        allCompleted && "opacity-70"
      )}
      onClick={() => !allCompleted && setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="p-4 border-b border-[hsl(200_100%_50%/0.2)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[hsl(200_100%_70%)]" />
            <span className="text-sm font-bold text-[hsl(200_100%_70%)] tracking-wider">QUEST INFO</span>
          </div>
          {timeRemaining && (
            <div className="flex items-center gap-1 text-xs text-destructive">
              <Clock className="w-3 h-3" />
              {timeRemaining}
            </div>
          )}
        </div>
        <p className="text-xs text-[hsl(200_100%_50%/0.6)] mt-1">
          [Daily Quest: {config.name} has arrived.]
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Goal Section */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-[hsl(200_100%_70%)] tracking-wider underline underline-offset-4">
            العقد
          </h3>
        </div>

        {/* Tasks List */}
        <div className="space-y-3 mb-4">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className={cn(
                "flex items-center justify-between py-2 px-3 rounded transition-all",
                task.completed 
                  ? "bg-[hsl(150_60%_30%/0.2)]" 
                  : "hover:bg-[hsl(200_100%_50%/0.1)]"
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (!task.completed) onTaskComplete(task.id);
              }}
            >
              <span className={cn(
                "text-sm",
                task.completed ? "line-through text-muted-foreground" : "text-foreground"
              )}>
                {task.title}
              </span>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-xs",
                  task.completed ? "text-[hsl(150_60%_50%)]" : "text-muted-foreground"
                )}>
                  {task.completed ? "✓" : "○"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="text-center py-3 border-t border-[hsl(200_100%_50%/0.2)]">
          <p className="text-xs text-muted-foreground">
            WARNING: Failure to complete the daily quest will result in an appropriate{' '}
            <span className="text-destructive font-bold">penalty</span>.
          </p>
        </div>

        {/* Completion Checkbox */}
        <div className="flex justify-center mt-4">
          <div className={cn(
            "w-10 h-10 rounded border-2 flex items-center justify-center transition-all",
            allCompleted 
              ? "border-[hsl(150_60%_50%)] bg-[hsl(150_60%_50%/0.2)]" 
              : "border-[hsl(200_100%_50%/0.5)]"
          )}>
            {allCompleted && <Check className="w-6 h-6 text-[hsl(150_60%_50%)]" />}
          </div>
        </div>

        {/* XP Reward */}
        <div className="text-center mt-3">
          <span className="text-xs text-[hsl(200_100%_60%)]">
            المكافأة: +{xpReward} XP
          </span>
        </div>
      </div>
    </div>
  );
};
