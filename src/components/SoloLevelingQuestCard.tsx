import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, 
  Dumbbell, 
  Brain, 
  Heart, 
  Zap,
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Skull,
  Play,
  X,
  CheckCircle,
  Timer
} from 'lucide-react';
import { StatType, Quest } from '@/types/game';
import { useNavigate } from 'react-router-dom';

interface SoloLevelingQuestCardProps {
  quests: Quest[];
  onTaskComplete: (taskId: string) => void;
  onStartQuest: (questId: string) => void;
  timeRemaining?: string;
}

const categoryConfig = {
  strength: { 
    icon: Dumbbell, 
    name: 'القوة',
    englishName: 'STRENGTH',
    color: 'hsl(0 70% 55%)',
    gradient: 'from-red-500/20 to-red-900/20',
  },
  mind: { 
    icon: Brain, 
    name: 'العقل',
    englishName: 'MIND',
    color: 'hsl(210 80% 55%)',
    gradient: 'from-blue-500/20 to-blue-900/20',
  },
  spirit: { 
    icon: Heart, 
    name: 'الروح',
    englishName: 'SPIRIT',
    color: 'hsl(270 70% 60%)',
    gradient: 'from-purple-500/20 to-purple-900/20',
  },
  vitality: { 
    icon: Zap, 
    name: 'الرشاقة',
    englishName: 'VITALITY',
    color: 'hsl(150 60% 45%)',
    gradient: 'from-green-500/20 to-green-900/20',
  },
};

const difficultyConfig = {
  easy: { color: 'hsl(0 0% 70%)', name: 'E', bgColor: 'bg-gray-500/20' },
  medium: { color: 'hsl(210 100% 60%)', name: 'D', bgColor: 'bg-blue-500/20' },
  hard: { color: 'hsl(270 100% 60%)', name: 'C', bgColor: 'bg-purple-500/20' },
  legendary: { color: 'hsl(45 100% 50%)', name: 'S', bgColor: 'bg-yellow-500/20' },
};

interface QuestModalProps {
  quest: Quest;
  onClose: () => void;
  onStart: () => void;
  onComplete: () => void;
}

const QuestModal = ({ quest, onClose, onStart, onComplete }: QuestModalProps) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const config = categoryConfig[quest.category];
  const diffConfig = difficultyConfig[quest.difficulty];
  const Icon = config.icon;

  useEffect(() => {
    if (quest.startedAt && quest.timerDuration) {
      const startTime = new Date(quest.startedAt).getTime();
      const endTime = startTime + (quest.timerDuration * 1000);
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      
      if (remaining > 0) {
        setCountdown(remaining);
        setIsRunning(true);
      }
    }
  }, [quest.startedAt, quest.timerDuration]);

  useEffect(() => {
    if (!isRunning || countdown === null) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    onStart();
    if (quest.timeLimit) {
      setCountdown(quest.timeLimit * 60);
      setIsRunning(true);
    }
  };

  const canComplete = countdown === 0 || !quest.timeLimit || quest.startedAt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className={cn(
        "relative w-full max-w-sm rounded-2xl overflow-hidden",
        "bg-gradient-to-b from-[hsl(220_60%_8%)] to-[hsl(220_70%_4%)]",
        "border-2 border-[hsl(200_100%_40%/0.5)]",
        "shadow-[0_0_60px_hsl(200_100%_50%/0.2)]",
        "animate-modal-appear"
      )}>
        {/* Glowing border effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent animate-energy-flow" />
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-[hsl(200_100%_60%)] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-[hsl(200_100%_60%)] to-transparent" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Header with category */}
        <div className={cn(
          "px-6 pt-8 pb-4 text-center",
          `bg-gradient-to-b ${config.gradient}`
        )}>
          <div 
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ 
              background: `linear-gradient(135deg, ${config.color}30, ${config.color}10)`,
              border: `2px solid ${config.color}50`,
              boxShadow: `0 0 30px ${config.color}30`
            }}
          >
            <Icon className="w-10 h-10" style={{ color: config.color }} />
          </div>
          
          <div 
            className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-2"
            style={{ 
              background: `${config.color}20`,
              color: config.color,
              border: `1px solid ${config.color}40`
            }}
          >
            {config.englishName}
          </div>
          
          <h2 className="text-xl font-bold text-white">{quest.title}</h2>
          
          {/* Difficulty badge */}
          <div 
            className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-xs font-bold"
            style={{ background: `${diffConfig.color}20`, color: diffConfig.color }}
          >
            <span>RANK</span>
            <span>{diffConfig.name}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <div className="p-4 rounded-xl bg-black/30 border border-white/5">
            <p className="text-sm text-gray-300 text-center leading-relaxed">
              {quest.description}
            </p>
            
            {/* Sets info for exercises */}
            {quest.sets && quest.repsPerSet && (
              <div className="mt-3 p-3 rounded-lg bg-white/5 text-center">
                <span className="text-lg font-bold" style={{ color: config.color }}>
                  {quest.repsPerSet} × {quest.sets}
                </span>
                <span className="text-xs text-gray-400 block mt-1">مجموعات</span>
              </div>
            )}
          </div>

          {/* Timer / Time limit */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-gray-400">الوقت</span>
            </div>
            {isRunning && countdown !== null ? (
              <span className="text-2xl font-mono font-bold text-orange-400">
                {formatTime(countdown)}
              </span>
            ) : (
              <span className="text-sm text-gray-300">
                {quest.timeLimit ? `${quest.timeLimit} دقيقة` : 'طوال اليوم'}
              </span>
            )}
          </div>

          {/* Reward */}
          <div 
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ 
              background: `linear-gradient(90deg, ${config.color}10, transparent)`,
              border: `1px solid ${config.color}30`
            }}
          >
            <span className="text-sm text-gray-400">المكافأة</span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: config.color }} />
              <span className="text-xl font-bold" style={{ color: config.color }}>
                +{quest.xpReward} XP
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 pt-0 flex gap-3">
          {quest.completed ? (
            <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-green-500/20 border border-green-500/40">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="font-bold text-green-400">مكتملة</span>
            </div>
          ) : (
            <>
              {!quest.startedAt ? (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 py-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/30 transition-all"
                  >
                    رفض
                  </button>
                  <button
                    onClick={handleStart}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 border border-primary/50 text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    ابدأ
                  </button>
                </>
              ) : (
                <button
                  onClick={onComplete}
                  disabled={!canComplete}
                  className={cn(
                    "flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                    canComplete
                      ? "bg-gradient-to-r from-green-500 to-green-600 border border-green-400/50 text-white hover:opacity-90"
                      : "bg-gray-500/20 border border-gray-500/40 text-gray-500 cursor-not-allowed"
                  )}
                >
                  <CheckCircle className="w-5 h-5" />
                  {canComplete ? 'إكمال المهمة' : 'انتظر انتهاء الوقت'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const SoloLevelingQuestCard = ({ 
  quests, 
  onTaskComplete,
  onStartQuest,
  timeRemaining 
}: SoloLevelingQuestCardProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  // Get one quest from each category
  const getQuestsPerCategory = () => {
    const categories: StatType[] = ['strength', 'mind', 'spirit', 'vitality'];
    const selectedQuests: Quest[] = [];
    
    categories.forEach(category => {
      const categoryQuests = quests.filter(q => q.category === category && q.dailyReset);
      if (categoryQuests.length > 0) {
        // Get the first incomplete quest, or the first quest if all completed
        const incompleteQuest = categoryQuests.find(q => !q.completed) || categoryQuests[0];
        selectedQuests.push(incompleteQuest);
      }
    });
    
    return selectedQuests;
  };

  const displayQuests = getQuestsPerCategory();
  const completedTasks = displayQuests.filter(q => q.completed).length;
  const allCompleted = completedTasks === displayQuests.length && displayQuests.length > 0;

  useEffect(() => {
    if (allCompleted && !showCompletion) {
      setShowCompletion(true);
      setTimeout(() => setShowCompletion(false), 5000);
    }
  }, [allCompleted]);

  const handleQuestClick = (quest: Quest) => {
    setSelectedQuest(quest);
  };

  const handleStartQuest = () => {
    if (selectedQuest) {
      onStartQuest(selectedQuest.id);
    }
  };

  const handleCompleteQuest = () => {
    if (selectedQuest) {
      onTaskComplete(selectedQuest.id);
      setSelectedQuest(null);
    }
  };

  return (
    <>
      {/* Completion Modal */}
      {showCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="max-w-sm w-full p-8 text-center rounded-2xl bg-gradient-to-b from-[hsl(200_80%_10%)] to-[hsl(210_70%_5%)] border-2 border-[hsl(200_100%_50%/0.5)] shadow-[0_0_80px_hsl(200_100%_50%/0.3)] animate-modal-appear">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-2 border-yellow-500/50 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-yellow-400 animate-float" />
            </div>
            <h2 className="text-2xl font-bold text-[hsl(200_100%_70%)] mb-2">
              لقد أتممت العقد!
            </h2>
            <p className="text-lg text-yellow-400 font-bold mb-4">
              DAILY QUEST COMPLETE
            </p>
            <p className="text-4xl font-bold text-yellow-300 mb-6">
              +{displayQuests.reduce((sum, q) => sum + q.xpReward, 0) * 2} XP
            </p>
            <button
              onClick={() => setShowCompletion(false)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 border border-primary/50 font-bold text-white hover:opacity-90 transition-all"
            >
              رائع!
            </button>
          </div>
        </div>
      )}

      {/* Main Quest Card */}
      <div className={cn(
        "relative rounded-2xl overflow-hidden",
        "bg-gradient-to-b from-[hsl(220_60%_8%)] to-[hsl(220_80%_4%)]",
        "border-2",
        allCompleted ? "border-green-500/50" : "border-[hsl(200_100%_40%/0.4)]",
        "shadow-[0_0_40px_hsl(200_100%_50%/0.1)]"
      )}>
        {/* Animated top border */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent animate-energy-flow" />
        
        {/* Header */}
        <div 
          className="p-5 border-b border-[hsl(200_100%_50%/0.15)] cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <AlertTriangle className="w-6 h-6 text-[hsl(200_100%_70%)]" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[hsl(200_100%_60%)] animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-[hsl(200_100%_70%)] tracking-[0.2em] block">
                  DAILY QUEST
                </span>
                <span className="text-[10px] text-gray-500">المهمات اليومية</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {timeRemaining && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs text-red-400 font-mono font-bold">{timeRemaining}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[hsl(200_100%_50%/0.1)] border border-[hsl(200_100%_50%/0.3)]">
                <span className="text-xs font-bold text-[hsl(200_100%_70%)]">
                  {completedTasks}/{displayQuests.length}
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>

          {/* System message */}
          <div className="mt-4 p-3 rounded-xl bg-black/30 border border-[hsl(200_100%_50%/0.1)]">
            <p className="text-sm text-gray-300 flex items-center gap-2">
              <span className="text-[hsl(200_100%_60%)]">▸</span>
              [You have received a <span className="text-[hsl(200_100%_70%)] font-bold">Daily Quest</span>.]
            </p>
            <p className="text-sm text-gray-300 flex items-center gap-2 mt-1">
              <span className="text-[hsl(200_100%_60%)]">▸</span>
              [Complete all tasks to receive <span className="text-yellow-400 font-bold">bonus rewards</span>.]
            </p>
          </div>
        </div>

        {/* Quest List */}
        {isExpanded && (
          <div className="p-5 space-y-3 animate-fade-in">
            {displayQuests.map((quest, index) => {
              const config = categoryConfig[quest.category];
              const diffConfig = difficultyConfig[quest.difficulty];
              const Icon = config.icon;

              return (
                <button
                  key={quest.id}
                  onClick={() => handleQuestClick(quest)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-right group",
                    "bg-gradient-to-r from-black/40 to-transparent",
                    "border-2 hover:scale-[1.02]",
                    quest.completed 
                      ? "border-green-500/30 opacity-60" 
                      : "border-white/5 hover:border-[hsl(200_100%_50%/0.3)]",
                    "animate-fade-in"
                  )}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    borderLeftWidth: '4px',
                    borderLeftColor: config.color
                  }}
                >
                  {/* Category icon */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                    style={{ 
                      background: `linear-gradient(135deg, ${config.color}30, ${config.color}10)`,
                      border: `1px solid ${config.color}40`,
                      boxShadow: quest.completed ? 'none' : `0 0 20px ${config.color}20`
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: config.color }} />
                  </div>
                  
                  {/* Quest info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "text-sm font-bold truncate",
                        quest.completed ? "line-through text-gray-500" : "text-white"
                      )}>
                        {quest.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{ 
                            background: `${diffConfig.color}20`,
                            color: diffConfig.color,
                            border: `1px solid ${diffConfig.color}30`
                          }}
                        >
                          {diffConfig.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs font-bold"
                          style={{ color: config.color }}
                        >
                          +{quest.xpReward} XP
                        </span>
                        {quest.timeLimit && (
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {quest.timeLimit}m
                          </span>
                        )}
                        {quest.startedAt && !quest.completed && (
                          <span className="text-[10px] text-orange-400 flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            جاري
                          </span>
                        )}
                      </div>
                      <span 
                        className="text-[10px] font-bold tracking-wider"
                        style={{ color: config.color }}
                      >
                        {config.englishName}
                      </span>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all",
                    quest.completed 
                      ? "bg-green-500/20 border border-green-500/40" 
                      : "bg-white/5 border border-white/10 group-hover:border-[hsl(200_100%_50%/0.4)]"
                  )}>
                    {quest.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-500 group-hover:text-[hsl(200_100%_60%)]" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Warning and actions */}
            <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-3">
                <Skull className="w-5 h-5 text-red-400" />
                <p className="text-xs text-gray-400">
                  <span className="text-red-400 font-bold">تحذير:</span> الزعيم يهاجم كل ساعة!
                </p>
              </div>
              <button
                onClick={() => navigate('/battle')}
                className="text-xs px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/30 transition-all"
              >
                منطقة العقاب
              </button>
            </div>

            {/* Total XP */}
            <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-[hsl(200_100%_50%/0.1)] via-[hsl(200_100%_50%/0.05)] to-transparent border border-[hsl(200_100%_50%/0.2)]">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-[hsl(200_100%_70%)]" />
                <span className="text-lg font-bold text-[hsl(200_100%_70%)]">
                  المكافأة الإجمالية: +{displayQuests.reduce((sum, q) => sum + q.xpReward, 0)} XP
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quest Modal */}
      {selectedQuest && (
        <QuestModal
          quest={selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onStart={handleStartQuest}
          onComplete={handleCompleteQuest}
        />
      )}
    </>
  );
};
