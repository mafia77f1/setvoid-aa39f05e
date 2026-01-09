import { PrayerQuest } from '@/types/game';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Clock, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PrayerQuestModalProps {
  prayer: PrayerQuest;
  onComplete: (id: string) => void;
  onClose: () => void;
}

export const PrayerQuestModal = ({ prayer, onComplete, onClose }: PrayerQuestModalProps) => {
  const { playQuestComplete, playClick } = useSoundEffects();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // أنيميشن الدخول يبدأ فور تحميل المكون
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 800); // وقت الخروج
  };

  const handleComplete = () => {
    playQuestComplete();
    onComplete(prayer.id);
    handleClose(); // نغلقها بالأنيميشن بعد الإكمال
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]",
        isVisible && !isExiting ? "bg-black/60" : "bg-black/0"
      )}
      onClick={handleClose}
    >
      {/* الإطار الرئيسي مع أنيميشن الانفتاح الطولي */}
      <div 
        className={cn(
          "relative max-w-sm w-full bg-black border-x border-white/40 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all ease-[cubic-bezier(0.2,1,0.2,1)]",
          isVisible && !isExiting 
            ? "opacity-100 scale-y-100 duration-[1500ms]" 
            : "opacity-0 scale-y-0 duration-[800ms]",
          "origin-center"
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* خطوط التوهج الكريستالي العلوية والسفلية */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1500ms] delay-500",
          isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        )} />
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1500ms] delay-500",
          isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        )} />

        {/* زر الإغلاق السريع */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:rotate-90 transition-all duration-300 z-20"
        >
          <X className="w-4 h-4 text-white/30 hover:text-white" />
        </button>

        <div className={cn(
          "p-8 transition-all duration-1000 delay-700",
          isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          
          {/* Header - Quest Label */}
          <div className="flex justify-center mb-8">
            <div className="border border-white/20 px-4 py-0.5 bg-white/5">
              <span className="text-[9px] font-black tracking-[0.4em] text-white/60 uppercase">
                Active Objective
              </span>
            </div>
          </div>

          {/* اسم الصلاة - توهج أبيض مكثف */}
          <div className="text-center mb-8">
            <h3 className="text-4xl font-black italic text-white tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
              {prayer.arabicName}
            </h3>
            <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mt-2 font-bold">
              Daily Prayer Mission
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 mb-8">
            <div className="bg-black p-4">
              <p className="text-[8px] text-white/30 uppercase font-black mb-1">Time Window</p>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-white" />
                <span className="text-xs font-mono font-bold text-white">45:00</span>
              </div>
            </div>
            <div className="bg-black p-4">
              <p className="text-[8px] text-white/30 uppercase font-black mb-1">Spirit Gain</p>
              <span className="text-xs font-bold text-white drop-shadow-[0_0_8px_white]">
                +{prayer.xpReward} XP
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] text-white/60 text-center italic leading-relaxed mb-10 px-4">
            "Establishing prayer is the foundation of your spiritual journey."
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleComplete}
              disabled={prayer.completed}
              className={cn(
                "w-full py-4 font-black text-[11px] tracking-[0.4em] uppercase transition-all duration-500",
                prayer.completed
                  ? "bg-white/5 text-white/20 cursor-not-allowed"
                  : "bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] active:scale-95"
              )}
            >
              {prayer.completed ? 'Mission Accomplished' : 'Execute Prayer'}
            </button>
          </div>
        </div>

        {/* Scanlines Effect Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_50%,transparent_50%)] bg-[size:100%_4px]" />
      </div>
    </div>
  );
};
