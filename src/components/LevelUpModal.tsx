import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { StatType } from '@/types/game';

interface LevelUpModalProps {
  show: boolean;
  newLevel: number;
  category?: StatType;
  onDismiss: () => void;
}

const categoryNames: Record<StatType, string> = {
  strength: 'القوة',
  mind: 'العقل',
  spirit: 'الروح',
  quran: 'القرآن',
};

export const LevelUpModal = ({ show, newLevel, category, onDismiss }: LevelUpModalProps) => {
  const { playLevelUp } = useSoundEffects();

  useEffect(() => {
    if (show) {
      playLevelUp();
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, playLevelUp, onDismiss]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={onDismiss}
    >
      <div className={cn(
        "relative max-w-md w-full mx-auto animate-scale-in",
        "rounded-2xl border-2 border-primary/60 overflow-hidden",
        "bg-gradient-to-b from-card/95 to-background/95"
      )}>
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-glow-pulse" />
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/60" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/60" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/60" />

        <div className="p-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/20 border border-primary/40 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-bold text-primary tracking-wider">NOTIFICATION</span>
            </div>
          </div>

          {/* Level Up Text */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary glow-text mb-4 animate-level-up">
              ارتقيت!
            </h2>
            
            {category && (
              <p className="text-lg text-foreground/80 mb-2">
                {categoryNames[category]}
              </p>
            )}
            
            <div className="text-6xl font-bold text-primary glow-text animate-float">
              {newLevel}
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              اضغط للاستمرار
            </p>
          </div>
        </div>

        {/* Bottom Glow Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
      </div>
    </div>
  );
};
