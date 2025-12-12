import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Clock, Star, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { Quest } from '@/types/game';

interface QuestTaskModalProps {
  quest: Quest;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const difficultyConfig = {
  easy: { 
    color: 'text-foreground/80', 
    bgColor: 'bg-foreground/10',
    borderColor: 'border-foreground/30',
    label: 'سهل',
    stars: 1
  },
  medium: { 
    color: 'text-[hsl(210_100%_60%)]', 
    bgColor: 'bg-[hsl(210_100%_50%/0.1)]',
    borderColor: 'border-[hsl(210_100%_50%/0.3)]',
    label: 'متوسط',
    stars: 2
  },
  hard: { 
    color: 'text-primary', 
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    label: 'صعب',
    stars: 3
  },
  legendary: { 
    color: 'text-foreground', 
    bgColor: 'bg-foreground/10',
    borderColor: 'border-foreground/50',
    label: 'أسطوري',
    stars: 4
  },
};

export const QuestTaskModal = ({ quest, isOpen, onClose, onComplete }: QuestTaskModalProps) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const config = difficultyConfig[quest.difficulty];

  if (!isOpen) return null;

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      onComplete();
      setIsCompleting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-md rounded-xl overflow-hidden animate-modal-appear",
        "bg-gradient-to-b from-[hsl(200_80%_12%)] to-[hsl(210_60%_6%)]",
        "border-2",
        config.borderColor
      )}>
        {/* Glowing top border */}
        <div className={cn(
          "absolute inset-x-0 top-0 h-0.5",
          "bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent"
        )} />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[hsl(200_100%_50%/0.2)]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[hsl(200_100%_70%)]" />
            <span className="text-sm font-bold text-[hsl(200_100%_70%)] tracking-wider">
              QUEST INFO
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground mt-3">{quest.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <div className="p-4 rounded-lg bg-[hsl(200_50%_10%/0.5)] border border-[hsl(200_100%_50%/0.1)]">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {quest.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Difficulty */}
            <div className={cn(
              "p-3 rounded-lg border text-center",
              config.bgColor,
              config.borderColor
            )}>
              <div className="flex justify-center gap-0.5 mb-1">
                {[...Array(config.stars)].map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4 fill-current", config.color)} />
                ))}
              </div>
              <span className={cn("text-xs font-bold", config.color)}>{config.label}</span>
            </div>

            {/* Time Limit */}
            <div className="p-3 rounded-lg bg-[hsl(200_50%_10%/0.5)] border border-[hsl(200_100%_50%/0.1)] text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-orange-400" />
              <span className="text-xs text-muted-foreground">
                {quest.timeLimit ? `${quest.timeLimit} دقيقة` : 'طوال اليوم'}
              </span>
            </div>
          </div>

          {/* Reward */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">المكافأة</span>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold text-primary">+{quest.xpReward} XP</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <p className="text-xs text-center text-muted-foreground">
            ⚠️ عدم إكمال المهمات اليومية سيؤدي إلى <span className="text-destructive font-bold">عقوبة</span>
          </p>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-0">
          {quest.completed ? (
            <div className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[hsl(150_60%_30%/0.2)] border border-[hsl(150_60%_50%/0.3)]">
              <CheckCircle className="w-5 h-5 text-[hsl(150_60%_50%)]" />
              <span className="font-bold text-[hsl(150_60%_50%)]">مكتملة</span>
            </div>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className={cn(
                "w-full py-4 rounded-lg font-bold text-lg transition-all",
                "bg-gradient-to-r from-primary to-primary/80",
                "border border-primary/50 shadow-lg shadow-primary/20",
                "hover:from-primary/90 hover:to-primary/70",
                "active:scale-[0.98]",
                isCompleting && "animate-pulse"
              )}
            >
              {isCompleting ? 'جارٍ الإكمال...' : 'إكمال المهمة'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};