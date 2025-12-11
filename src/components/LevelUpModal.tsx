import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { StatType } from '@/types/game';
import { AlertCircle } from 'lucide-react';

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
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, playLevelUp, onDismiss]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onDismiss}
    >
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[hsl(200_100%_50%/0.2)] rounded-full blur-[100px] animate-aura-pulse" />
      </div>

      {/* Main Panel - Solo Leveling Blue Style */}
      <div className="notification-panel max-w-md w-full mx-auto animate-modal-appear relative">
        {/* Top Decorative Bar */}
        <div className="absolute -top-1 left-4 right-4 h-1 flex justify-center">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent" />
        </div>

        {/* Side Decorations */}
        <div className="absolute top-8 -left-2 w-4 h-32 border-l-2 border-t-2 border-b-2 border-[hsl(200_100%_50%/0.6)] rounded-l-lg" />
        <div className="absolute top-8 -right-2 w-4 h-32 border-r-2 border-t-2 border-b-2 border-[hsl(200_100%_50%/0.6)] rounded-r-lg" />

        <div className="p-8 relative z-10">
          {/* Header - NOTIFICATION */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded border border-[hsl(200_100%_50%/0.5)] bg-[hsl(200_100%_50%/0.1)]">
              <AlertCircle className="w-5 h-5 text-[hsl(200_100%_70%)]" />
              <span className="text-sm font-bold text-[hsl(200_100%_70%)] tracking-[0.2em]">NOTIFICATION</span>
            </div>
          </div>

          {/* Level Up Text */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 animate-level-up" style={{ color: 'hsl(200 100% 70%)', textShadow: '0 0 30px hsl(200 100% 60% / 0.8)' }}>
              Leveled up!
            </h2>
            
            {category && (
              <p className="text-lg text-[hsl(200_100%_60%)] mb-2">
                {categoryNames[category]}
              </p>
            )}
            
            <div 
              className="text-7xl font-bold animate-float mt-4"
              style={{ 
                color: 'hsl(200 100% 70%)', 
                textShadow: '0 0 40px hsl(200 100% 60%), 0 0 80px hsl(200 100% 60% / 0.5)' 
              }}
            >
              {newLevel}
            </div>
            
            <p className="text-sm text-[hsl(200_100%_50%/0.7)] mt-6">
              اضغط للاستمرار
            </p>
          </div>
        </div>

        {/* Bottom Decorative Bar */}
        <div className="absolute -bottom-1 left-4 right-4 h-1 flex justify-center">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent" />
        </div>
      </div>
    </div>
  );
};
