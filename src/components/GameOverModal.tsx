import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useEffect } from 'react';
import { Skull } from 'lucide-react';

interface GameOverModalProps {
  show: boolean;
  onRestart: () => void;
}

export const GameOverModal = ({ show, onRestart }: GameOverModalProps) => {
  const { playGameOver } = useSoundEffects();

  useEffect(() => {
    if (show) {
      playGameOver();
    }
  }, [show, playGameOver]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-destructive/20 backdrop-blur-sm animate-fade-in">
      {/* Pulsing red overlay */}
      <div className="absolute inset-0 bg-destructive/10 animate-pulse" />
      
      <div className={cn(
        "relative max-w-md w-full mx-auto animate-scale-in",
        "rounded-2xl border-2 border-destructive/80 overflow-hidden",
        "bg-gradient-to-b from-destructive/30 to-background/95"
      )}>
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-destructive to-transparent animate-pulse" />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-destructive/30 rounded-full blur-3xl animate-glow-pulse" />
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-destructive/80" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-destructive/80" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-destructive/80" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-destructive/80" />

        <div className="p-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-destructive/30 border border-destructive/60 mb-6">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm font-bold text-destructive tracking-wider">GAME OVER</span>
            </div>
          </div>

          {/* Skull Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/30 border-2 border-destructive mb-4 animate-shake">
              <Skull className="w-14 h-14 text-destructive" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-destructive glow-text mb-4">
              أنت خارج اللعبة
            </h2>
            <p className="text-foreground/80">
              نفدت نقاط صحتك. هل تريد البدء من جديد؟
            </p>
          </div>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className={cn(
              "w-full p-4 rounded-xl font-bold text-lg transition-all",
              "bg-destructive/30 border-2 border-destructive text-destructive",
              "hover:bg-destructive/50",
              "active:scale-95"
            )}
          >
            البدء من جديد
          </button>
        </div>

        {/* Bottom Glow Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-destructive to-transparent animate-pulse" />
      </div>
    </div>
  );
};
