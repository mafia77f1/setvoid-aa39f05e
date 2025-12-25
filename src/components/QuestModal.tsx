import { Quest } from '@/types/game';
import { cn } from '@/lib/utils';
import { Check, Clock, Dumbbell, Brain, Heart, BookOpen, Zap, X } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface QuestModalProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onClose: () => void;
}

const categoryConfig = {
  strength: { icon: Dumbbell, color: 'text-strength', bgColor: 'bg-strength/20', borderColor: 'border-strength/50', name: 'القوة' },
  mind: { icon: Brain, color: 'text-mind', bgColor: 'bg-mind/20', borderColor: 'border-mind/50', name: 'العقل' },
  spirit: { icon: Heart, color: 'text-spirit', bgColor: 'bg-spirit/20', borderColor: 'border-spirit/50', name: 'الروح' },
  quran: { icon: BookOpen, color: 'text-quran', bgColor: 'bg-quran/20', borderColor: 'border-quran/50', name: 'القرآن' },
};

const difficultyConfig = {
  easy: { color: 'text-foreground', bgColor: 'bg-foreground/10', borderColor: 'border-foreground/30', label: 'سهلة' },
  medium: { color: 'text-mind', bgColor: 'bg-mind/10', borderColor: 'border-mind/30', label: 'متوسطة' },
  hard: { color: 'text-spirit', bgColor: 'bg-spirit/10', borderColor: 'border-spirit/30', label: 'صعبة' },
  legendary: { color: 'text-foreground', bgColor: 'bg-foreground/20', borderColor: 'border-foreground/50', label: 'أسطورية' },
};

export const QuestModal = ({ quest, onComplete, onClose }: QuestModalProps) => {
  const { playQuestComplete, playClick } = useSoundEffects();
  const config = categoryConfig[quest.category];
  const difficulty = difficultyConfig[quest.difficulty];
  const Icon = config.icon;

  const handleComplete = () => {
    playQuestComplete();
    onComplete(quest.id);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={cn(
          "relative max-w-md w-full mx-auto animate-scale-in",
          "rounded-2xl border-2 overflow-hidden",
          config.borderColor,
          "bg-gradient-to-b from-card/95 to-background/95"
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Glow Bar */}
        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent", config.color)} />
        
        {/* Close Button */}
        <button
          onClick={() => { playClick(); onClose(); }}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Corner Decorations */}
        <div className={cn("absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2", config.borderColor)} />
        <div className={cn("absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2", config.borderColor)} />
        <div className={cn("absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2", config.borderColor)} />

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className={cn(
              "inline-flex items-center gap-3 px-4 py-2 rounded-lg mb-4",
              config.bgColor, "border", config.borderColor
            )}>
              <div className={cn("w-2 h-2 rounded-full animate-pulse", config.bgColor.replace('/20', ''))} />
              <span className={cn("text-sm font-bold tracking-wider", config.color)}>QUEST INFO</span>
            </div>
          </div>

          {/* Quest Category */}
          <p className="text-sm text-muted-foreground text-center mb-4">
            [مهمة يومية: {config.name}]
          </p>

          {/* Quest Title */}
          <div className="text-center mb-6">
            <div className={cn(
              "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4",
              config.bgColor, "border", config.borderColor
            )}>
              <Icon className={cn("w-8 h-8", config.color)} />
            </div>
            <h3 className={cn("text-xl font-bold", config.color)}>{quest.title}</h3>
            <p className="text-muted-foreground mt-2">{quest.description}</p>
          </div>

          {/* Quest Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <span className="text-sm text-muted-foreground">المكافأة</span>
              <div className="flex items-center gap-1">
                <Zap className={cn("w-4 h-4", config.color)} />
                <span className={cn("font-bold", config.color)}>+{quest.xpReward} XP</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <span className="text-sm text-muted-foreground">الصعوبة</span>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-semibold",
                difficulty.bgColor, difficulty.color
              )}>
                {difficulty.label}
              </span>
            </div>

            {quest.timeLimit && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground">الوقت المقترح</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">{quest.timeLimit} دقيقة</span>
                </div>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-6">
            <p className="text-sm text-destructive text-center">
              تحذير: عدم إكمال المهمات سيؤدي إلى <span className="font-bold">عقوبة</span> مناسبة
            </p>
          </div>

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={quest.completed}
            className={cn(
              "w-full p-4 rounded-xl font-bold text-lg transition-all",
              "flex items-center justify-center gap-3",
              quest.completed
                ? "bg-secondary/20 border-2 border-secondary/50 text-secondary"
                : cn(config.bgColor, "border-2", config.borderColor, config.color, "hover:opacity-80"),
              "active:scale-95"
            )}
          >
            {quest.completed ? (
              <>
                <Check className="w-6 h-6" />
                مكتملة
              </>
            ) : (
              <>
                <Check className="w-6 h-6" />
                إكمال المهمة
              </>
            )}
          </button>
        </div>

        {/* Bottom Glow Bar */}
        <div className={cn("absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent", config.color)} />
      </div>
    </div>
  );
};
