import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Dumbbell, Brain, Heart, BookOpen, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { StatType, Quest, QuestDifficulty } from '@/types/game';
import { QuestTaskModal } from './QuestTaskModal';

interface DailyQuestCardProps {
  category: StatType;
  quests: Quest[];
  xpReward: number;
  onTaskComplete: (taskId: string) => void;
  timeRemaining?: string;
}

const categoryConfig = {
  strength: { 
    icon: Dumbbell, 
    name: 'تدريب القوة',
    englishName: 'Strength Training',
    color: 'text-strength',
    bgColor: 'bg-strength',
    borderColor: 'border-strength'
  },
  mind: { 
    icon: Brain, 
    name: 'تدريب العقل',
    englishName: 'Mind Training',
    color: 'text-mind',
    bgColor: 'bg-mind',
    borderColor: 'border-mind'
  },
  spirit: { 
    icon: Heart, 
    name: 'تدريب الروح',
    englishName: 'Spirit Training',
    color: 'text-spirit',
    bgColor: 'bg-spirit',
    borderColor: 'border-spirit'
  },
  quran: { 
    icon: BookOpen, 
    name: 'تدريب القرآن',
    englishName: 'Quran Training',
    color: 'text-quran',
    bgColor: 'bg-quran',
    borderColor: 'border-quran'
  },
};

const difficultyColors = {
  easy: 'border-l-foreground/50',
  medium: 'border-l-[hsl(210_100%_60%)]',
  hard: 'border-l-primary',
  legendary: 'border-l-foreground',
};

export const DailyQuestCard = ({ 
  category, 
  quests, 
  xpReward, 
  onTaskComplete,
  timeRemaining 
}: DailyQuestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const config = categoryConfig[category];
  const Icon = config.icon;
  const completedTasks = quests.filter(q => q.completed).length;
  const allCompleted = completedTasks === quests.length;

  return (
    <>
      <div className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300",
        "bg-gradient-to-b from-[hsl(200_80%_12%)] to-[hsl(210_60%_6%)]",
        "border-2 border-[hsl(200_100%_40%/0.3)]",
        "animate-modal-appear",
        allCompleted && "opacity-70"
      )}>
        {/* Glowing border effect */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent" />
        
        {/* Header */}
        <div 
          className="p-4 border-b border-[hsl(200_100%_50%/0.2)] cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[hsl(200_100%_70%)]" />
              <span className="text-sm font-bold text-[hsl(200_100%_70%)] tracking-wider">NOTIFICATION</span>
            </div>
            <div className="flex items-center gap-2">
              {timeRemaining && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <Clock className="w-3 h-3" />
                  {timeRemaining}
                </div>
              )}
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
          
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-foreground/80">• [You've become a Player.] ☐</p>
            <p className="text-foreground/80">
              • [Daily Quest: <span className={cn("font-semibold", config.color)}>{config.englishName}</span> has arrived.] ☐
            </p>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-4 animate-fade-in">
            {/* Goal Section */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-[hsl(200_100%_70%)] tracking-wider underline underline-offset-4">
                العقد
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {completedTasks}/{quests.length} مهمات مكتملة
              </p>
            </div>

            {/* Tasks List */}
            <div className="space-y-2 mb-4">
              {quests.map((quest) => (
                <button
                  key={quest.id}
                  onClick={() => !quest.completed && setSelectedQuest(quest)}
                  disabled={quest.completed}
                  className={cn(
                    "w-full flex items-center justify-between py-3 px-4 rounded-lg border-l-4 transition-all text-right",
                    "bg-[hsl(200_50%_10%/0.5)] hover:bg-[hsl(200_50%_15%/0.5)]",
                    "border border-[hsl(200_100%_50%/0.1)]",
                    difficultyColors[quest.difficulty],
                    quest.completed && "opacity-60"
                  )}
                >
                  <div className="flex-1">
                    <span className={cn(
                      "text-sm font-medium",
                      quest.completed ? "line-through text-muted-foreground" : "text-foreground"
                    )}>
                      {quest.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-primary">+{quest.xpReward} XP</span>
                      {quest.timeLimit && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {quest.timeLimit} د
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                    quest.completed 
                      ? "border-[hsl(150_60%_50%)] bg-[hsl(150_60%_50%/0.2)]" 
                      : "border-[hsl(200_100%_50%/0.5)]"
                  )}>
                    {quest.completed && <span className="text-[hsl(150_60%_50%)]">✓</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* Warning */}
            <div className="text-center py-3 border-t border-[hsl(200_100%_50%/0.2)]">
              <p className="text-xs text-muted-foreground">
                WARNING: Failure to complete the daily quest will result in an appropriate{' '}
                <span className="text-destructive font-bold">penalty</span>.
              </p>
            </div>

            {/* XP Reward */}
            <div className="text-center mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <span className="text-sm font-bold text-primary">
                المكافأة الإجمالية: +{xpReward} XP
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quest Detail Modal */}
      {selectedQuest && (
        <QuestTaskModal
          quest={selectedQuest}
          isOpen={!!selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onComplete={() => onTaskComplete(selectedQuest.id)}
        />
      )}
    </>
  );
};
