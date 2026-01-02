import { PrayerQuest } from '@/types/game';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Heart, Clock, Check, X, ShieldAlert, Zap } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-500"
      onClick={onClose}
    >
      {/* Container الرئيسي بتصميم الـ System Window */}
      <div 
        className={cn(
          "relative max-w-md w-full mx-auto overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.4)]",
          "border-t-2 border-b-2 border-white/20 bg-[#0a0a0c]",
          "animate-in zoom-in-95 duration-300"
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* الخلفية بنقشة "النظام" */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* الإطار الفضي الجانبي */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-600 via-white to-purple-600" />
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-600 via-white to-purple-600" />

        <div className="relative z-10 p-8">
          {/* Header: [QUEST: DAILY PRAYER] */}
          <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400 fill-purple-400" />
              <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">
                Quest: <span className="text-purple-500 underline decoration-white/30 decoration-double underline-offset-4">Daily Prayer</span>
              </h2>
            </div>
            <div className="bg-white/10 px-3 py-1 skew-x-[-20deg] border border-white/30">
              <span className="text-xs font-black text-white italic tracking-widest">RANK S</span>
            </div>
          </div>

          {/* اسم الصلاة بتوهج فضي وبنفسجي */}
          <div className="text-center mb-10 group">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-purple-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="relative text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                {prayer.arabicName}
              </h3>
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-2" />
            </div>
          </div>

          {/* تفاصيل المهمة (System Info) */}
          <div className="space-y-4 mb-10">
            {/* الوقت */}
            <div className="flex items-center justify-between p-4 bg-white/5 border-l-4 border-purple-500 shadow-inner">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Time Limit</span>
              </div>
              <span className="text-lg font-mono font-black text-white">45:00:00</span>
            </div>

            {/* المكافأة */}
            <div className="flex items-center justify-between p-4 bg-white/5 border-l-4 border-white shadow-inner">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Rewards</span>
              </div>
              <span className="text-lg font-black text-purple-400">+{prayer.xpReward} <span className="text-xs text-white">EXP</span></span>
            </div>
          </div>

          {/* التحذير (Penalty Warning) */}
          <div className="flex items-start gap-4 p-4 border border-red-900/50 bg-red-950/20 mb-10">
            <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0" />
            <p className="text-[10px] leading-tight font-bold text-red-500 uppercase tracking-widest italic">
              Warning: Failure to complete the daily quest will result in a penalty. Prayer is the foundation of faith.
            </p>
          </div>

          {/* الأزرار (Buttons) */}
          <div className="flex gap-4">
            <button
              onClick={handleComplete}
              disabled={prayer.completed}
              className={cn(
                "flex-[2] py-5 relative group transition-all active:scale-95",
                prayer.completed 
                ? "bg-slate-800 text-slate-500" 
                : "bg-white text-black hover:bg-purple-500 hover:text-white"
              )}
            >
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500 group-hover:border-white" />
              <div className="flex items-center justify-center gap-3 font-black italic uppercase tracking-tighter text-xl">
                {prayer.completed ? (
                  <>COMPLETED</>
                ) : (
                  <>
                    <Check className="w-6 h-6 stroke-[4px]" />
                    Accept Reward
                  </>
                )}
              </div>
            </button>

            <button
              onClick={() => { playClick(); onClose(); }}
              className="flex-1 py-5 border-2 border-white/20 text-white font-black italic uppercase tracking-tighter hover:bg-white/10 transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>

        {/* تذييل النافذة (System Footer) */}
        <div className="bg-purple-900/20 py-2 px-8 flex justify-between items-center">
          <div className="h-1 w-1/3 bg-white/10" />
          <span className="text-[8px] text-purple-400 font-black tracking-[0.5em]">SYSTEM INTERFACE V1.0</span>
          <div className="h-1 w-1/3 bg-white/10" />
        </div>
      </div>
    </div>
  );
};
