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

  // هذا الجزء يضمن تفعيل الأنيميشن فور ظهور المكون
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 800); // مدة خروج الأنيميشن
  };

  const handleComplete = () => {
    playQuestComplete();
    onComplete(prayer.id);
    handleClose();
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-1000",
        isVisible && !isExiting ? "bg-black/70" : "bg-black/0 pointer-events-none"
      )}
      onClick={handleClose}
    >
      <div 
        className={cn(
          "relative max-w-sm w-full bg-black border-x border-white/40 shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all ease-[cubic-bezier(0.23,1,0.32,1)]",
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

        {/* زر إغلاق X في الزاوية */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:rotate-90 transition-all duration-300 z-[160]"
        >
          <X className="w-4 h-4 text-white/40 hover:text-white" />
        </button>

        <div className={cn(
          "p-8 transition-all duration-1000 delay-700",
          isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          
          {/* Label العلوي */}
          <div className="flex justify-center mb-8">
            <div className="border border-white/20 px-4 py-0.5 bg-white/5">
              <span className="text-[9px] font-black tracking-[0.4em] text-white/60 uppercase">
                Divine Mission
              </span>
            </div>
          </div>

          {/* اسم الصلاة - توهج أبيض مكثف */}
          <div className="text-center mb-8">
            <h3 className="text-4xl font-black italic text-white tracking-tighter uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
              {prayer.arabicName}
            </h3>
            <div className="h-[1px] w-12 bg-white/20 mx-auto mt-4" />
          </div>

          {/* تفاصيل المهمة */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center">
              <p className="text-[8px] text-white/30 uppercase font-black mb-1">Window</p>
              <span className="text-xs font-mono font-bold text-white uppercase">45 Mins</span>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-[8px] text-white/30 uppercase font-black mb-1">Reward</p>
              <span className="text-xs font-bold text-white drop-shadow-[0_0_8px_white]">
                +{prayer.xpReward} XP
              </span>
            </div>
          </div>

          {/* أزرار الأكشن */}
          <div className="space-y-3">
            <button
              onClick={handleComplete}
              disabled={prayer.completed}
              className={cn(
                "w-full py-4 font-black text-[11px] tracking-[0.4em] uppercase transition-all duration-500 border",
                prayer.completed
                  ? "bg-transparent border-white/5 text-white/20 cursor-not-allowed"
                  : "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] active:scale-95"
              )}
            >
              {prayer.completed ? 'Already Cleared' : 'Complete Quest'}
            </button>
            
            <button
              onClick={handleClose}
              className="w-full py-2 text-[9px] font-bold text-white/30 hover:text-white/60 tracking-[0.2em] uppercase transition-colors"
            >
              Dismiss Window
            </button>
          </div>
        </div>

        {/* تأثير الخطوط الرقمية (Scanlines) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_50%,transparent_50%)] bg-[size:100%_4px]" />
      </div>
    </div>
  );
};
