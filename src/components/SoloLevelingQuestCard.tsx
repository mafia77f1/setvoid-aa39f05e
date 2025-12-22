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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent animate-energy-flow" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className={cn(
          "px-6 pt-8 pb-4 text-center",
          `bg-gradient-to-b ${config.gradient}`
        )}>
          <div 
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
            style={{ 
              background: `linear-gradient(135deg, ${config.color}30, ${config.color}10)`,
              border: `2px solid ${config.color}50`,
            }}
          >
            <Icon className="w-10 h-10" style={{ color: config.color }} />
          </div>
          <h2 className="text-xl font-bold text-white">{quest.title}</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-center text-sm text-gray-300">
            {quest.description}
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
            <span className="text-sm text-gray-400">الوقت</span>
            <span className="text-xl font-mono font-bold text-orange-400">
              {isRunning && countdown !== null ? formatTime(countdown) : (quest.timeLimit ? `${quest.timeLimit}m` : '∞')}
            </span>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          {quest.completed ? (
            <div className="flex-1 py-4 text-center rounded-xl bg-green-500/20 text-green-400 font-bold">مكتملة</div>
          ) : (
            <>
              {!quest.startedAt ? (
                <button onClick={handleStart} className="flex-1 py-4 rounded-xl bg-primary text-white font-bold">ابدأ</button>
              ) : (
                <button onClick={handleCompleteQuest} disabled={!canComplete} className="flex-1 py-4 rounded-xl bg-green-600 text-white font-bold disabled:opacity-30">إكمال</button>
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

  const displayQuests = quests.filter(q => q.dailyReset).slice(0, 4);
  const completedTasks = displayQuests.filter(q => q.completed).length;
  const allCompleted = completedTasks === displayQuests.length && displayQuests.length > 0;

  const handleQuestClick = (quest: Quest) => setSelectedQuest(quest);
  const handleStartQuest = () => selectedQuest && onStartQuest(selectedQuest.id);
  const handleCompleteQuest = () => {
    if (selectedQuest) {
      onTaskComplete(selectedQuest.id);
      setSelectedQuest(null);
    }
  };

  return (
    <>
      <div className={cn(
        "relative rounded-2xl overflow-hidden bg-black/80 border-2 transition-all",
        allCompleted ? "border-green-500/50" : "border-primary/40"
      )}>
        {/* Header */}
        <div className="p-5 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-primary" />
              <div>
                <span className="text-xs font-bold text-primary tracking-widest block uppercase">Daily Quest</span>
                <span className="text-[10px] text-gray-500">المهمات اليومية</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white bg-primary/20 px-2 py-1 rounded">{completedTasks}/{displayQuests.length}</span>
              {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </div>
          </div>
        </div>

        {/* Quest List */}
        {isExpanded && (
          <div className="p-5 space-y-3">
            {displayQuests.map((quest) => (
              <button
                key={quest.id}
                onClick={() => handleQuestClick(quest)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                  quest.completed ? "bg-green-500/10 border-green-500/30 opacity-60" : "bg-white/5 border-white/10 hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-3 text-right">
                  <div className="p-2 rounded-lg bg-black/40">
                    {categoryConfig[quest.category] && <categoryConfig[quest.category].icon className="w-5 h-5" style={{ color: categoryConfig[quest.category].color }} />}
                  </div>
                  <span className={cn("text-sm font-bold", quest.completed && "line-through")}>{quest.title}</span>
                </div>
                {quest.completed ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Play className="w-4 h-4 text-primary" />}
              </button>
            ))}

            {/* Warning - زر منطقة العقاب المعدل */}
            <div className="mt-4 p-4 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skull className="w-5 h-5 text-red-500 animate-pulse" />
                <div className="text-right">
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-tighter">Warning</p>
                  <p className="text-[9px] text-gray-400">الفشل يعني مواجهة وحوش الصحراء</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/penalty')} // تعديل المسار هنا ليذهب لمنطقة العقاب
                className="text-[10px] px-3 py-2 rounded bg-red-600 text-white font-black hover:bg-red-700 transition-all uppercase italic"
              >
                دخول العقاب
              </button>
            </div>
          </div>
        )}
      </div>

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
