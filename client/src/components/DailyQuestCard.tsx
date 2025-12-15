import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Dumbbell, Brain, Heart, BookOpen, Clock, ChevronDown, ChevronUp, Sparkles, Skull } from 'lucide-react';
import { StatType, Quest } from '@/types/game';
import { QuestTaskModal } from './QuestTaskModal';
import { useNavigate } from 'react-router-dom';

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
    color: 'hsl(0 70% 55%)',
  },
  mind: { 
    icon: Brain, 
    name: 'تدريب العقل',
    englishName: 'Mind Training',
    color: 'hsl(210 80% 55%)',
  },
  spirit: { 
    icon: Heart, 
    name: 'تدريب الروح',
    englishName: 'Spirit Training',
    color: 'hsl(270 70% 60%)',
  },
  quran: { 
    icon: BookOpen, 
    name: 'تدريب القرآن',
    englishName: 'Quran Training',
    color: 'hsl(150 60% 45%)',
  },
};

const difficultyConfig = {
  easy: { color: 'hsl(0 0% 70%)', name: 'سهل' },
  medium: { color: 'hsl(210 100% 60%)', name: 'متوسط' },
  hard: { color: 'hsl(270 100% 60%)', name: 'صعب' },
  legendary: { color: 'hsl(45 100% 50%)', name: 'أسطوري' },
};

export const DailyQuestCard = ({ 
  category, 
  quests, 
  xpReward, 
  onTaskComplete,
  timeRemaining 
}: DailyQuestCardProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const config = categoryConfig[category];
  const Icon = config.icon;
  const completedTasks = quests.filter(q => q.completed).length;
  const allCompleted = completedTasks === quests.length && quests.length > 0;

  // Show completion celebration
  useEffect(() => {
    if (allCompleted && !showCompletion) {
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 5000);
    }
  }, [allCompleted]);

  // Get 4 quests (one from each category simulation - we'll take first 4)
  const displayQuests = quests.slice(0, 4);

  return (
    <>
      {/* Completion Celebration Modal */}
      {showCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="notification-panel max-w-sm w-full p-8 text-center animate-modal-appear">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-[hsl(45_100%_50%)] animate-float" />
            <h2 className="text-2xl font-bold text-[hsl(200_100%_70%)] mb-2">
              لقد أتممت العقد!
            </h2>
            <p className="text-lg text-[hsl(45_100%_50%)] font-bold mb-4">
              مكافأة إضافية ضخمة!
            </p>
            <p className="text-sm text-muted-foreground">
              +{xpReward * 2} XP إضافي
            </p>
            <button
              onClick={() => setShowCompletion(false)}
              className="mt-6 px-8 py-3 rounded-lg bg-primary/20 border border-primary/40 text-primary font-bold hover:bg-primary/30 transition-all"
            >
              رائع!
            </button>
          </div>
        </div>
      )}

      <div className={cn(
        "relative rounded-2xl overflow-hidden transition-all duration-500",
        "bg-gradient-to-b from-[hsl(200_80%_10%)] to-[hsl(210_70%_5%)]",
        "border-2",
        allCompleted ? "border-[hsl(150_60%_50%/0.5)]" : "border-[hsl(200_100%_40%/0.4)]",
        "animate-modal-appear"
      )}>
        {/* Animated border glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent animate-energy-flow" />
        </div>
        
        {/* Header */}
        <div 
          className="p-5 border-b border-[hsl(200_100%_50%/0.2)] cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <AlertCircle className="w-6 h-6 text-[hsl(200_100%_70%)]" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[hsl(200_100%_60%)] animate-pulse" />
              </div>
              <span className="text-sm font-bold text-[hsl(200_100%_70%)] tracking-[0.15em]">DAILY QUEST</span>
            </div>
            <div className="flex items-center gap-3">
              {timeRemaining && (
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-destructive/20 border border-destructive/30">
                  <Clock className="w-3 h-3 text-destructive" />
                  <span className="text-xs text-destructive font-mono">{timeRemaining}</span>
                </div>
              )}
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
          
          {/* System messages */}
          <div className="mt-4 space-y-2">
            <p className="text-sm text-foreground/90 flex items-center gap-2">
              <span className="text-[hsl(200_100%_60%)]">▸</span>
              [You have become a <span className="text-[hsl(200_100%_70%)] font-bold">Player</span>.]
            </p>
            <p className="text-sm text-foreground/90 flex items-center gap-2">
              <span className="text-[hsl(200_100%_60%)]">▸</span>
              [Daily Quest: <span className="font-bold" style={{ color: config.color }}>{config.englishName}</span> has arrived.]
            </p>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-5 animate-fade-in">
            {/* Contract Title */}
            <div className="text-center mb-6">
              <div className="inline-block">
                <h3 className="text-xl font-bold text-[hsl(200_100%_70%)] tracking-wider relative">
                  العقد
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent" />
                </h3>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="w-20 h-2 rounded-full bg-black/50 border border-primary/20 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(completedTasks / Math.max(displayQuests.length, 1)) * 100}%`,
                      background: allCompleted 
                        ? 'linear-gradient(90deg, hsl(150 60% 50%), hsl(150 80% 60%))'
                        : 'linear-gradient(90deg, hsl(200 100% 50%), hsl(200 100% 70%))'
                    }}
                  />
                </div>
                <span className="text-sm font-mono text-muted-foreground">
                  {completedTasks}/{displayQuests.length}
                </span>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3 mb-6">
              {displayQuests.map((quest, index) => {
                const diffConfig = difficultyConfig[quest.difficulty];
                return (
                  <button
                    key={quest.id}
                    onClick={() => !quest.completed && setSelectedQuest(quest)}
                    disabled={quest.completed}
                    className={cn(
                      "w-full flex items-center gap-4 py-4 px-5 rounded-xl transition-all duration-300 text-right group",
                      "bg-gradient-to-r from-[hsl(200_40%_8%)] to-[hsl(200_30%_6%)]",
                      "border-2 hover:scale-[1.02]",
                      quest.completed 
                        ? "border-[hsl(150_60%_50%/0.3)] opacity-70" 
                        : "border-[hsl(200_100%_50%/0.2)] hover:border-[hsl(200_100%_50%/0.4)]",
                      "animate-fade-in"
                    )}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      borderLeftWidth: '4px',
                      borderLeftColor: diffConfig.color
                    }}
                  >
                    {/* Difficulty indicator */}
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ 
                        background: `${diffConfig.color}20`,
                        border: `1px solid ${diffConfig.color}40`
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: diffConfig.color }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "text-sm font-bold truncate",
                          quest.completed ? "line-through text-muted-foreground" : "text-foreground"
                        )}>
                          {quest.title}
                        </span>
                        <span 
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{ 
                            background: `${diffConfig.color}20`,
                            color: diffConfig.color
                          }}
                        >
                          {diffConfig.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-primary">+{quest.xpReward} XP</span>
                        {quest.timeLimit && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {quest.timeLimit} دقيقة
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div className={cn(
                      "w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
                      quest.completed 
                        ? "border-[hsl(150_60%_50%)] bg-[hsl(150_60%_50%/0.2)]" 
                        : "border-[hsl(200_100%_50%/0.4)] group-hover:border-[hsl(200_100%_50%/0.7)]"
                    )}>
                      {quest.completed && (
                        <span className="text-[hsl(150_60%_50%)] text-lg">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Punishment Warning */}
            <div className="flex items-center justify-between py-4 px-4 rounded-xl bg-destructive/5 border border-destructive/20">
              <div className="flex items-center gap-3">
                <Skull className="w-5 h-5 text-destructive" />
                <p className="text-xs text-muted-foreground">
                  <span className="text-destructive font-bold">تحذير:</span> عدم إكمال المهمات يؤدي إلى عقوبة!
                </p>
              </div>
              <button
                onClick={() => navigate('/battle')}
                className="text-xs px-3 py-1.5 rounded-lg bg-destructive/20 border border-destructive/40 text-destructive font-bold hover:bg-destructive/30 transition-all"
              >
                منطقة العقاب
              </button>
            </div>

            {/* XP Reward */}
            <div className="mt-4 text-center p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold text-primary">
                  المكافأة الإجمالية: +{xpReward} XP
                </span>
              </div>
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