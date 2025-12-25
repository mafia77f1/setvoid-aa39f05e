import { Quest } from '@/types/game';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface QuestModalProps {
  quest: Quest;
  onComplete: (id: string) => void;
  onClose: () => void;
}

// تغيير الاسم هنا ليطابق الاستدعاء في الملف الآخر
export const QuestTaskModal = ({ quest, onComplete, onClose }: QuestModalProps) => {
  const { playQuestComplete, playClick } = useSoundEffects();

  const handleComplete = () => {
    playQuestComplete();
    onComplete(quest.id);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-md animate-fade-in text-slate-200"
      onClick={onClose}
    >
      <div 
        className={cn(
          "relative max-w-md w-full mx-auto animate-scale-in pb-8",
          "bg-[#031525] border border-[#3fb5ff]/40 shadow-[0_0_40px_rgba(63,181,255,0.2)]"
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* L-Corners */}
        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-[#3fb5ff]" />
        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-[#3fb5ff]" />

        {/* Close Button */}
        <button
          onClick={() => { playClick(); onClose(); }}
          className="absolute top-4 right-4 z-10 p-1 border border-[#3fb5ff]/30 text-[#3fb5ff] hover:bg-[#3fb5ff]/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block border border-[#3fb5ff]/60 px-8 py-1 mb-4">
              <span className="text-sm font-bold tracking-[0.3em] text-[#e2f3ff] uppercase">Quest Detail</span>
            </div>
            <h3 className="text-2xl font-bold text-[#3fb5ff] tracking-wider uppercase">{quest.title}</h3>
          </div>

          {/* Description */}
          <div className="mb-8 p-4 border-y border-[#3fb5ff]/10 bg-[#3fb5ff]/5">
            <p className="text-center text-slate-300 leading-relaxed uppercase text-sm tracking-wide">
              {quest.description || "No description provided by the system."}
            </p>
          </div>

          {/* Details Table */}
          <div className="space-y-4 mb-10">
            <div className="flex justify-between border-b border-[#3fb5ff]/20 pb-2">
              <span className="text-[#3fb5ff]/70 text-xs">Reward</span>
              <span className="font-bold text-[#3fb5ff]">+{quest.xpReward} XP</span>
            </div>
            <div className="flex justify-between border-b border-[#3fb5ff]/20 pb-2">
              <span className="text-[#3fb5ff]/70 text-xs">Penalty</span>
              <span className="font-bold text-[#ff3b3b]">Appropriate Penalty</span>
            </div>
          </div>

          {/* Complete Button (The Blue Box) */}
          <button
            onClick={handleComplete}
            disabled={quest.completed}
            className={cn(
              "w-full h-14 flex items-center justify-center gap-3 transition-all border-2",
              quest.completed
                ? "border-slate-600 text-slate-600 bg-transparent"
                : "border-[#3fb5ff] bg-[#3fb5ff]/10 text-[#3fb5ff] hover:bg-[#3fb5ff]/20 active:scale-95 shadow-[0_0_15px_rgba(63,181,255,0.2)]"
            )}
          >
            <Check className={cn("w-6 h-6", quest.completed ? "text-slate-600" : "text-[#4ade80]")} strokeWidth={3} />
            <span className="font-bold tracking-widest uppercase text-lg">
              {quest.completed ? "Mission Complete" : "Complete Mission"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
