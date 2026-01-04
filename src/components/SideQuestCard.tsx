import { useState, useEffect } from 'react';
import { Quest } from '@/types/game';
import { Clock, Play, Check, Gift, X, Coins, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SideQuestCardProps {
  quest: Quest;
  onStart: (questId: string) => void;
  onClaim: (questId: string) => void;
  onClose: (questId: string) => void;
}

export const SideQuestCard = ({ quest, onStart, onClaim, onClose }: SideQuestCardProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [isTimerComplete, setIsTimerComplete] = useState(false);

  const requiredTimeSeconds = (quest.requiredTime || 30) * 60;
  const savedProgress = quest.timeProgress || 0;

  useEffect(() => {
    if (!quest.startedAt) return;

    const startTime = new Date(quest.startedAt).getTime();
    const now = Date.now();
    const elapsedSinceStart = Math.floor((now - startTime) / 1000);
    const totalProgress = savedProgress + elapsedSinceStart;

    if (totalProgress >= requiredTimeSeconds) {
      setIsTimerComplete(true);
      setTimeRemaining(0);
      return;
    }

    setTimeRemaining(requiredTimeSeconds - totalProgress);

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimerComplete(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quest.startedAt, savedProgress, requiredTimeSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = quest.startedAt 
    ? Math.min(((requiredTimeSeconds - timeRemaining) / requiredTimeSeconds) * 100, 100)
    : 0;

  const handleClaim = () => {
    setShowClaimModal(true);
  };

  const confirmClaim = () => {
    onClaim(quest.id);
    setShowClaimModal(false);
  };

  const categoryColors = {
    strength: 'from-red-500/20 to-orange-500/20 border-red-500/40',
    mind: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40',
    spirit: 'from-purple-500/20 to-pink-500/20 border-purple-500/40',
    agility: 'from-green-500/20 to-emerald-500/20 border-green-500/40',
  };

  return (
    <>
      <div className={cn(
        "relative bg-gradient-to-br border-2 rounded-lg p-4 transition-all",
        categoryColors[quest.category],
        quest.completed && "opacity-50"
      )}>
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className={cn(
              "font-bold text-sm text-white mb-1",
              quest.completed && "line-through"
            )}>
              {quest.title}
            </h4>
            <p className="text-[10px] text-slate-400">{quest.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-yellow-400">+{quest.xpReward} XP</div>
            {quest.goldReward && (
              <div className="text-[10px] text-yellow-500 flex items-center gap-1 justify-end">
                <Coins className="w-3 h-3" />
                +{quest.goldReward}
              </div>
            )}
          </div>
        </div>

        {/* Time Info */}
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">
            الوقت المطلوب: {quest.requiredTime || 30} دقيقة
          </span>
        </div>

        {/* Progress Bar */}
        {quest.startedAt && !quest.completed && (
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>التقدم</span>
              <span>{formatTime(timeRemaining)}</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!quest.startedAt && !quest.completed && (
            <button
              onClick={() => onStart(quest.id)}
              className="flex-1 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-blue-500/30 transition-all active:scale-95"
            >
              <Play className="w-3 h-3" />
              بدء المهمة
            </button>
          )}

          {quest.startedAt && !quest.completed && !isTimerComplete && (
            <div className="flex-1 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold text-center">
              جاري التنفيذ...
            </div>
          )}

          {isTimerComplete && !quest.completed && (
            <>
              <button
                onClick={handleClaim}
                className="flex-1 py-2 bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-green-500/30 transition-all active:scale-95"
              >
                <Gift className="w-3 h-3" />
                المطالبة
              </button>
              <button
                onClick={() => onClose(quest.id)}
                className="py-2 px-3 bg-slate-500/20 border border-slate-500/30 text-slate-400 text-xs hover:bg-slate-500/30 transition-all active:scale-95"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          )}

          {quest.completed && (
            <div className="flex-1 py-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold text-center flex items-center justify-center gap-2">
              <Check className="w-3 h-3" />
              مكتملة
            </div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#0a0a0f] border-2 border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.3)] overflow-hidden">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500" />

            {/* Header */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-b border-green-500/30 p-4 text-center">
              <Gift className="w-10 h-10 mx-auto text-green-400 mb-2" />
              <h3 className="text-lg font-black uppercase tracking-widest text-green-400">
                مكافآت المهمة
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-right" dir="rtl">
              <div className="text-center mb-4">
                <h4 className="text-white font-bold">{quest.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{quest.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <span className="text-sm text-blue-400 font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    خبرة
                  </span>
                  <span className="text-lg font-black text-blue-300">+{quest.xpReward} XP</span>
                </div>
                
                {quest.goldReward && (
                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <span className="text-sm text-yellow-400 font-bold flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      ذهب
                    </span>
                    <span className="text-lg font-black text-yellow-300">+{quest.goldReward}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-green-500/20">
              <button
                onClick={confirmClaim}
                className="w-full py-3 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/50 text-green-400 font-bold text-sm uppercase tracking-widest hover:from-green-500/40 hover:to-emerald-500/40 transition-all active:scale-95"
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
