import { PrayerQuest } from '@/types/game';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Check, X, AlertOctagon, Zap, Shield } from 'lucide-react';

interface PrayerQuestModalProps {
  prayer: PrayerQuest;
  onComplete: (id: string) => void;
  onClose: () => void;
}

export const PrayerQuestModal = ({ prayer, onComplete, onClose }: PrayerQuestModalProps) => {
  const { playQuestComplete, playClick } = useSoundEffects();

  const handleComplete = () => {
    playQuestComplete();
    onComplete(prayer.id);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-[10px] animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* النافذة الرئيسية بتصميم سولو ليفلينج الحاد */}
      <div 
        className="relative w-full max-w-lg mx-auto bg-[#05070a]/95 border-l-[6px] border-r-[6px] border-cyan-500 shadow-[0_0_100px_rgba(6,182,212,0.3)] animate-in slide-in-from-bottom-10"
        onClick={e => e.stopPropagation()}
      >
        {/* الخطوط العلوية والسفلية الفضية */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,1)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,1)]" />

        <div className="p-8">
          {/* Header - [QUEST: DAILY QUEST] */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-cyan-400 font-black italic text-3xl tracking-[0.2em] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] uppercase">
                Quest Info
              </h2>
              <p className="text-white/40 text-xs font-bold tracking-[0.4em] uppercase mt-1">Daily Quest: Spirit Strengthening</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white font-black italic text-4xl leading-none">S</span>
              <span className="text-cyan-500 text-[10px] font-bold tracking-widest uppercase mt-1">Rank</span>
            </div>
          </div>

          {/* اسم المهمة - كبير جداً وبارز */}
          <div className="relative mb-16 px-4 py-6 border-y border-white/10 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
            <h3 className="text-center text-5xl md:text-6xl font-black italic text-white tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(6,182,212,0.5)]">
              {prayer.arabicName}
            </h3>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
          </div>

          {/* المتطلبات والمكافآت */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="space-y-2">
              <p className="text-cyan-500/60 text-[10px] font-black tracking-widest uppercase">Goal Status</p>
              <div className="flex items-center gap-3 text-white">
                <Shield className="w-5 h-5 text-cyan-400" />
                <span className="text-xl font-bold italic">01 / 01</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-cyan-500/60 text-[10px] font-black tracking-widest uppercase">Clear Reward</p>
              <div className="flex items-center gap-3 text-white">
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-xl font-bold italic">+{prayer.xpReward} XP</span>
              </div>
            </div>
          </div>

          {/* نص التحذير بتنسيق النظام */}
          <div className="mb-12 p-4 bg-red-950/20 border-l-2 border-red-500/50">
            <div className="flex items-center gap-2 mb-1 text-red-500">
              <AlertOctagon className="w-4 h-4" />
              <span className="text-[10px] font-black tracking-widest uppercase">Warning</span>
            </div>
            <p className="text-xs text-white/70 font-medium italic">
              "Failure to complete this quest will result in a penalty. The path to the monarch requires absolute discipline."
            </p>
          </div>

          {/* أزرار النظام - حادة ولامعة */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleComplete}
              disabled={prayer.completed}
              className={cn(
                "group relative w-full h-16 transition-all duration-300 overflow-hidden skew-x-[-15deg]",
                prayer.completed 
                ? "bg-zinc-800 border border-zinc-700 cursor-not-allowed" 
                : "bg-cyan-500 border border-cyan-300 hover:bg-white"
              )}
            >
              <div className="flex items-center justify-center gap-3 skew-x-[15deg] transition-colors">
                <Check className={cn("w-6 h-6 stroke-[3px]", prayer.completed ? "text-zinc-600" : "text-black group-hover:text-cyan-600")} />
                <span className={cn("text-xl font-black italic uppercase tracking-widest", prayer.completed ? "text-zinc-600" : "text-black group-hover:text-cyan-600")}>
                  {prayer.completed ? "Quest Cleared" : "Complete Quest"}
                </span>
              </div>
              
              {/* تأثير اللمعان عند التمرير */}
              {!prayer.completed && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_0.5s_infinite]" />
              )}
            </button>

            <button
              onClick={() => { playClick(); onClose(); }}
              className="group w-full h-12 bg-transparent border border-white/20 skew-x-[-15deg] hover:bg-white/5 transition-all"
            >
              <div className="flex items-center justify-center gap-2 skew-x-[15deg]">
                <X className="w-4 h-4 text-white/40 group-hover:text-white" />
                <span className="text-sm font-bold text-white/40 uppercase tracking-widest group-hover:text-white">Close Window</span>
              </div>
            </button>
          </div>
        </div>

        {/* تفاصيل زخرفية جانبية */}
        <div className="absolute top-4 right-[-20px] w-10 h-[1px] bg-cyan-500/50 rotate-45" />
        <div className="absolute bottom-4 left-[-20px] w-10 h-[1px] bg-cyan-500/50 rotate-45" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
