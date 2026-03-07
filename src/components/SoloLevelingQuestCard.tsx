import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { 
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
  Timer,
  Crown,
  Target,
  Pause
} from 'lucide-react';
import { StatType, Quest } from '@/types/game';
import { useNavigate } from 'react-router-dom';

interface SoloLevelingQuestCardProps {
  quests: Quest[];
  onTaskComplete: (taskId: string) => void;
  onStartQuest: (questId: string) => void;
  onUpdateQuestProgress?: (questId: string, timeProgress: number) => void;
  timeRemaining?: string;
}

const categoryConfig = {
  strength: { 
    icon: Dumbbell, 
    name: 'القوة',
    englishName: 'STR',
  },
  mind: { 
    icon: Brain, 
    name: 'العقل',
    englishName: 'INT',
  },
  spirit: { 
    icon: Heart, 
    name: 'الروح',
    englishName: 'SPR',
  },
  agility: { 
    icon: Zap, 
    name: 'الرشاقة',
    englishName: 'AGI',
  },
};

const difficultyConfig = {
  easy: { name: 'E' },
  medium: { name: 'D' },
  hard: { name: 'C' },
  legendary: { name: 'S' },
};

interface QuestModalProps {
  quest: Quest;
  onClose: () => void;
  onStart: () => void;
  onComplete: () => void;
  onUpdateProgress?: (timeProgress: number) => void;
}

const QuestModal = ({ quest, onClose, onStart, onComplete, onUpdateProgress }: QuestModalProps) => {
  const savedProgress = quest.timeProgress || 0;
  const [timeProgress, setTimeProgress] = useState<number>(savedProgress);
  const [isRunning, setIsRunning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const config = categoryConfig[quest.category];
  const diffConfig = difficultyConfig[quest.difficulty];
  const Icon = config.icon;

  const requiredTimeInSeconds = (quest.requiredTime || 0) * 60;
  const isCompleted = timeProgress >= requiredTimeInSeconds;

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  useEffect(() => {
    const currentProgress = quest.timeProgress || 0;
    setTimeProgress(currentProgress);
  }, [quest.timeProgress]);

  useEffect(() => {
    if (quest.startedAt && !quest.completed && !isCompleted) {
      setIsRunning(true);
    }
  }, [quest.startedAt, quest.completed, isCompleted]);

  useEffect(() => {
    if (!isRunning || isCompleted) return;
    const timer = setInterval(() => {
      setTimeProgress(prev => {
        const newProgress = prev + 1;
        if (onUpdateProgress) onUpdateProgress(newProgress);
        if (newProgress >= requiredTimeInSeconds) setIsRunning(false);
        return newProgress;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, requiredTimeInSeconds, onUpdateProgress, isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    onStart();
    setIsRunning(true);
  };

  const progressPercentage = requiredTimeInSeconds > 0 
    ? Math.min((timeProgress / requiredTimeInSeconds) * 100, 100) 
    : 0;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={cn(
          "absolute inset-0 backdrop-blur-md transition-all duration-500",
          isVisible ? "bg-black/90" : "bg-black/0"
        )}
        onClick={handleClose}
      />
      
      <div className={cn(
        "relative w-full max-w-sm transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)]",
        isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"
      )}>
        {/* Outer glow - Solo Leveling cyan/blue */}
        <div className="absolute -inset-2 bg-gradient-to-b from-cyan-500/20 via-blue-500/10 to-cyan-500/20 blur-xl opacity-60" />
        
        {/* Main Panel */}
        <div className="relative overflow-hidden" style={{
          background: 'linear-gradient(180deg, rgba(8,20,40,0.98) 0%, rgba(4,12,28,0.99) 50%, rgba(8,20,40,0.98) 100%)',
          border: '2px solid rgba(56,189,248,0.4)',
          boxShadow: '0 0 60px rgba(56,189,248,0.15), inset 0 0 60px rgba(56,189,248,0.05)',
        }}>
          {/* Grid background pattern */}
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: `
              linear-gradient(rgba(56,189,248,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56,189,248,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }} />

          {/* Top glow line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
          
          {/* Bottom glow line */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)]" />

          {/* Corner accents - metallic style */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-cyan-400/70" />
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-cyan-400/70" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-cyan-400/70" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-cyan-400/70" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-1.5 text-slate-500 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ═══ HEADER: (!) QUEST INFO ═══ */}
          <div className="relative px-6 pt-7 pb-5 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              {/* Alert icon */}
              <div className="w-9 h-9 border-2 border-slate-400/60 flex items-center justify-center bg-transparent">
                <span className="text-slate-300 font-black text-lg">!</span>
              </div>
              {/* QUEST INFO badge */}
              <div className="border-2 border-slate-400/60 px-5 py-1.5 bg-transparent">
                <span className="text-sm font-black tracking-[0.3em] text-white uppercase">
                  QUEST INFO
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 font-mono">
              [Daily Quest: <span className="text-cyan-300 font-bold">{quest.title}</span> has arrived.]
            </p>
          </div>

          {/* Separator line */}
          <div className="mx-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

          {/* ═══ GOAL SECTION ═══ */}
          <div className="px-6 py-5">
            <h3 className="text-center text-lg font-black tracking-[0.2em] text-white mb-5 underline underline-offset-8 decoration-slate-600">
              GOAL
            </h3>
            
            {/* Quest task details */}
            <div className="space-y-4 mb-5">
              {/* Main task */}
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-300 font-medium">{quest.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {quest.requiredTime ? (
                    <span className="text-sm text-slate-400 font-mono">
                      [{formatTime(timeProgress)}/{formatTime(requiredTimeInSeconds)}]
                    </span>
                  ) : quest.sets && quest.repsPerSet ? (
                    <span className="text-sm text-slate-400 font-mono">
                      [{quest.repsPerSet}×{quest.sets}]
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400 font-mono">[1/1]</span>
                  )}
                  <div className={cn(
                    "w-5 h-5 border flex items-center justify-center",
                    isCompleted || quest.completed
                      ? "border-emerald-500/60 bg-emerald-500/10"
                      : "border-slate-600"
                  )}>
                    {(isCompleted || quest.completed) && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Time progress bar */}
              {quest.requiredTime && (
                <div className="px-4">
                  <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/30">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        isCompleted 
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                          : "bg-gradient-to-r from-cyan-500 to-blue-400 shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                      )}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  {isRunning && !isCompleted && (
                    <p className="text-[9px] text-cyan-500/60 text-center mt-1.5 animate-pulse font-mono">
                      ▸ Timer active...
                    </p>
                  )}
                </div>
              )}

              {/* Reward info */}
              <div className="flex items-center justify-between px-4 pt-2 border-t border-slate-700/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Reward</span>
                </div>
                <span className="text-sm font-black text-cyan-300 tracking-wider">+{quest.xpReward} XP</span>
              </div>

              {quest.goldReward && (
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-500/70" />
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Gold</span>
                  </div>
                  <span className="text-sm font-black text-yellow-400/80 tracking-wider">+{quest.goldReward} G</span>
                </div>
              )}
            </div>
          </div>

          {/* Separator */}
          <div className="mx-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

          {/* ═══ WARNING SECTION ═══ */}
          <div className="px-6 py-4">
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              <span className="text-red-400 font-bold">WARNING:</span> Failure to complete the daily quest will result in an appropriate <span className="text-red-400 font-bold">penalty</span>.
            </p>
          </div>

          {/* ═══ ACTION BUTTON ═══ */}
          <div className="px-6 pb-6 pt-2">
            {quest.completed ? (
              <div className="flex items-center justify-center gap-3 py-4 border border-emerald-500/30 bg-emerald-500/5">
                <div className="w-7 h-7 border-2 border-emerald-500/50 flex items-center justify-center bg-emerald-500/10">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-black text-emerald-400 tracking-[0.2em] text-sm">COMPLETED</span>
              </div>
            ) : !quest.startedAt ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleClose}
                  className="py-3.5 border border-slate-700/50 text-slate-500 font-bold text-xs tracking-[0.2em] uppercase hover:text-slate-300 hover:border-slate-500/50 transition-all"
                >
                  CLOSE
                </button>
                <button
                  onClick={handleStart}
                  className="py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-xs tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_40px_rgba(56,189,248,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4" />
                  ACCEPT
                </button>
              </div>
            ) : (
              <button
                onClick={onComplete}
                disabled={!isCompleted}
                className={cn(
                  "w-full py-4 font-black text-sm tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2",
                  isCompleted
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95"
                    : "border border-slate-700/50 text-slate-600 cursor-not-allowed"
                )}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    CLAIM REWARD
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    <Timer className="w-4 h-4 animate-pulse" />
                    {Math.ceil((requiredTimeInSeconds - timeProgress) / 60)}m REMAINING
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SoloLevelingQuestCard = ({ 
  quests, 
  onTaskComplete,
  onStartQuest,
  onUpdateQuestProgress,
  timeRemaining 
}: SoloLevelingQuestCardProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  // تحديث المهمة المختارة عند تغير قائمة المهمات
  useEffect(() => {
    if (selectedQuest) {
      const updatedQuest = quests.find(q => q.id === selectedQuest.id);
      if (updatedQuest) {
        setSelectedQuest(updatedQuest);
      }
    }
  }, [quests]);

  const getQuestsPerCategory = () => {
    const categories: StatType[] = ['strength', 'mind', 'spirit', 'agility'];
    const selectedQuests: Quest[] = [];
    
    categories.forEach(category => {
      const categoryQuests = quests.filter(q => q.category === category && q.dailyReset && q.isMainQuest !== false);
      if (categoryQuests.length > 0) {
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

  const handleUpdateProgress = (timeProgress: number) => {
    if (selectedQuest && onUpdateQuestProgress) {
      onUpdateQuestProgress(selectedQuest.id, timeProgress);
    }
  };

  return (
    <>
      {/* Completion Modal */}
      {showCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fade-in">
          <div className="max-w-sm w-full text-center relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-white/10 via-slate-300/20 to-white/10 blur-2xl" />
            <div className="relative p-8 bg-gradient-to-b from-slate-900 to-black border border-white/20 rounded-sm">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent" />
              
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/20 to-white/5 border-2 border-white/30 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                <Crown className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
              </div>
              
              <h2 className="text-2xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] mb-2 tracking-wider">
                QUEST COMPLETE
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                لقد أتممت جميع المهمات اليومية!
              </p>
              <p className="text-4xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] mb-6">
                +{displayQuests.reduce((sum, q) => sum + q.xpReward, 0) * 2} XP
              </p>
              <button
                onClick={() => setShowCompletion(false)}
                className="w-full py-4 rounded-sm bg-gradient-to-r from-white to-slate-200 text-black font-black tracking-wider shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                CONTINUE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Quest Card */}
      <div className="relative">
        {/* Outer glow effect */}
        <div className={cn(
          "absolute -inset-[2px] rounded-sm blur-sm",
          allCompleted 
            ? "bg-gradient-to-r from-emerald-500/30 via-emerald-400/40 to-emerald-500/30" 
            : "bg-gradient-to-r from-white/10 via-slate-300/20 to-white/10"
        )} />
        
        <div className={cn(
          "relative overflow-hidden rounded-sm",
          "bg-gradient-to-b from-slate-900 via-slate-950 to-black",
          "border",
          allCompleted ? "border-emerald-500/40" : "border-white/15"
        )}>
          {/* Animated top line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent" />
          
          {/* Scan line effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan-line" />
          </div>
          
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/30" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/30" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/30" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/30" />
          
          {/* Header */}
          <div 
            className="p-5 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <Target className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)] animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-black text-white tracking-[0.25em] block drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                    DAILY QUEST
                  </span>
                  <span className="text-[10px] text-slate-500">المهمات اليومية</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {timeRemaining && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-slate-800/50 border border-slate-600/30">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-300 font-mono font-bold">{timeRemaining}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/5 border border-white/15">
                  <span className="text-xs font-black text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                    {completedTasks}/{displayQuests.length}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>

            {/* System message */}
            <div className="p-4 rounded-sm bg-black/40 border border-white/5">
              <p className="text-sm text-slate-300 flex items-start gap-2 font-mono">
                <span className="text-white">▸</span>
                <span>[You have received a <span className="text-white font-bold">Daily Quest</span>.]</span>
              </p>
              <p className="text-sm text-slate-300 flex items-start gap-2 mt-1 font-mono">
                <span className="text-white">▸</span>
                <span>[Complete all tasks for <span className="text-white font-bold">bonus XP</span>.]</span>
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

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
                      "w-full flex items-center gap-4 p-4 rounded-sm transition-all duration-300 text-right group",
                      "bg-gradient-to-r from-black/40 to-transparent",
                      "border hover:scale-[1.01]",
                      quest.completed 
                        ? "border-emerald-500/30 bg-emerald-500/5" 
                        : "border-white/10 hover:border-white/25 hover:bg-white/5"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Category icon */}
                    <div className={cn(
                      "w-14 h-14 rounded-sm flex items-center justify-center shrink-0 transition-all",
                      quest.completed
                        ? "bg-emerald-500/10 border border-emerald-500/30"
                        : "bg-white/5 border border-white/15 group-hover:border-white/30 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    )}>
                      <Icon className={cn(
                        "w-7 h-7 transition-all",
                        quest.completed 
                          ? "text-emerald-400" 
                          : "text-slate-400 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                      )} />
                    </div>
                    
                    {/* Quest info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={cn(
                          "text-sm font-bold truncate transition-all",
                          quest.completed 
                            ? "line-through text-slate-500" 
                            : "text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                        )}>
                          {quest.title}
                        </span>
                        <span className={cn(
                          "text-[10px] font-black px-2 py-0.5 rounded-sm tracking-wider",
                          quest.completed
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/10 text-white/70 border border-white/20"
                        )}>
                          {diffConfig.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "text-sm font-black",
                            quest.completed ? "text-emerald-400" : "text-white"
                          )}>
                            +{quest.xpReward} XP
                          </span>
                          {quest.timeLimit && (
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {quest.timeLimit}m
                            </span>
                          )}
                          {quest.startedAt && !quest.completed && (
                            <span className="text-[10px] text-white flex items-center gap-1 animate-pulse">
                              <Timer className="w-3 h-3" />
                              IN PROGRESS
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold tracking-wider text-slate-500">
                          {config.englishName}
                        </span>
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className={cn(
                      "w-10 h-10 rounded-sm flex items-center justify-center shrink-0 transition-all",
                      quest.completed 
                        ? "bg-emerald-500/20 border border-emerald-500/40" 
                        : "bg-white/5 border border-white/10 group-hover:border-white/25"
                    )}>
                      {quest.completed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Play className="w-4 h-4 text-slate-500 group-hover:text-white" />
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Warning section */}
              <div className="mt-4 flex items-center justify-between p-4 rounded-sm bg-slate-900/50 border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <Skull className="w-5 h-5 text-slate-500" />
                  <p className="text-xs text-slate-500">
                    <span className="text-slate-400 font-bold">WARNING:</span> Boss attacks every hour!
                  </p>
                </div>
                <button
                  onClick={() => navigate('/battle')}
                  className="text-[10px] px-4 py-2 rounded-sm bg-white/5 border border-white/15 text-white/70 font-bold hover:bg-white/10 hover:text-white transition-all tracking-wider"
                >
                  PENALTY ZONE
                </button>
              </div>

              {/* Total XP */}
              <div className="mt-2 p-4 rounded-sm bg-gradient-to-r from-white/5 via-white/[0.02] to-transparent border border-white/10">
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  <span className="text-sm font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] tracking-wider">
                    TOTAL REWARD: +{displayQuests.reduce((sum, q) => sum + q.xpReward, 0)} XP
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quest Modal */}
      {selectedQuest && (
        <QuestModal
          quest={selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onStart={handleStartQuest}
          onComplete={handleCompleteQuest}
          onUpdateProgress={handleUpdateProgress}
        />
      )}
    </>
  );
};
