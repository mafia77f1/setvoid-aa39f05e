import { PrayerQuest } from '@/types/game';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Heart, Clock, Check, X } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={cn(
          "relative max-w-md w-full mx-auto animate-scale-in",
          "rounded-2xl border-2 border-spirit/60 overflow-hidden",
          "bg-gradient-to-b from-card/95 to-background/95"
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-spirit to-transparent animate-pulse" />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-spirit/20 rounded-full blur-3xl animate-glow-pulse" />
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-spirit/60" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-spirit/60" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-spirit/60" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-spirit/60" />

        <div className="p-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-spirit/20 border border-spirit/40 mb-4">
              <div className="w-2 h-2 rounded-full bg-spirit animate-pulse" />
              <span className="text-sm font-bold text-spirit tracking-wider">مهمة الصلاة</span>
            </div>
          </div>

          {/* Prayer Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-spirit/20 border-2 border-spirit/50 mb-4">
              <Heart className="w-10 h-10 text-spirit" />
            </div>
            <h3 className="text-2xl font-bold text-spirit glow-text">{prayer.arabicName}</h3>
          </div>

          {/* Time */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-lg bg-muted/20">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg font-semibold">الوقت المتبقي: 45 دقيقة</span>
          </div>

          {/* XP Reward */}
          <div className="text-center mb-6">
            <span className="text-lg">المكافأة: </span>
            <span className="text-xl font-bold text-spirit">+{prayer.xpReward} XP</span>
          </div>

          {/* Warning */}
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-6 text-center">
            <p className="text-sm text-destructive">
              الصلاة عمود الدين - لا تفوتها!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleComplete}
              disabled={prayer.completed}
              className={cn(
                "flex-1 p-4 rounded-xl font-bold text-lg transition-all",
                "flex items-center justify-center gap-2",
                prayer.completed
                  ? "bg-secondary/20 border-2 border-secondary/50 text-secondary"
                  : "bg-spirit/20 border-2 border-spirit/50 text-spirit hover:bg-spirit/30",
                "active:scale-95"
              )}
            >
              <Check className="w-5 h-5" />
              {prayer.completed ? 'تم الأداء' : 'صليت'}
            </button>
            <button
              onClick={() => { playClick(); onClose(); }}
              className={cn(
                "px-6 py-4 rounded-xl font-bold text-lg transition-all",
                "bg-muted/30 border-2 border-muted text-muted-foreground",
                "hover:bg-muted/50",
                "active:scale-95"
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Glow Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-spirit to-transparent animate-pulse" />
      </div>
    </div>
  );
};
