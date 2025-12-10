import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { cn } from '@/lib/utils';

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useGameState();
  const { playClick, playLevelUp } = useSoundEffects();
  const [step, setStep] = useState<'welcome' | 'name' | 'loading'>('welcome');
  const [playerName, setPlayerName] = useState('');

  const handleAccept = () => {
    playClick();
    setStep('name');
  };

  const handleDecline = () => {
    // Close/refresh the page
    window.close();
  };

  const handleStart = () => {
    if (playerName.trim()) {
      playLevelUp();
      setStep('loading');
      setTimeout(() => {
        completeOnboarding(playerName.trim());
        navigate('/');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {step === 'welcome' && (
        <div className={cn(
          "relative max-w-lg w-full mx-auto animate-scale-in",
          "rounded-2xl border-2 border-primary/60 overflow-hidden",
          "bg-gradient-to-b from-card/95 to-background/95"
        )}>
          {/* Top Glow Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          {/* Corner Decorations */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/60" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/60" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/60" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/20 border border-primary/40 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-bold text-primary tracking-wider">NOTIFICATION</span>
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-4 mb-10">
              <p className="text-lg text-foreground/80">
                لقد حصلت على المؤهلات
              </p>
              <p className="text-lg">
                لتصبح <span className="text-primary font-bold glow-text">لاعب</span>. هل ستقبل؟
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleAccept}
                className={cn(
                  "px-8 py-3 rounded-lg font-bold text-lg transition-all",
                  "bg-primary/20 border-2 border-primary/60 text-primary",
                  "hover:bg-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20",
                  "active:scale-95"
                )}
              >
                نعم
              </button>
              <button
                onClick={handleDecline}
                className={cn(
                  "px-8 py-3 rounded-lg font-bold text-lg transition-all",
                  "bg-destructive/20 border-2 border-destructive/60 text-destructive",
                  "hover:bg-destructive/30 hover:border-destructive hover:shadow-lg hover:shadow-destructive/20",
                  "active:scale-95"
                )}
              >
                لا
              </button>
            </div>
          </div>

          {/* Bottom Glow Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      )}

      {step === 'name' && (
        <div className={cn(
          "relative max-w-lg w-full mx-auto animate-scale-in",
          "rounded-2xl border-2 border-primary/60 overflow-hidden",
          "bg-gradient-to-b from-card/95 to-background/95"
        )}>
          {/* Top Glow Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          {/* Corner Decorations */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/60" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/60" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/60" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/20 border border-primary/40 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-bold text-primary tracking-wider">أدخل اسمك</span>
              </div>
            </div>

            {/* Input */}
            <div className="mb-8">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="اسم اللاعب..."
                className={cn(
                  "w-full px-6 py-4 rounded-lg text-center text-xl font-bold",
                  "bg-background/50 border-2 border-primary/40",
                  "text-foreground placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/20",
                  "transition-all"
                )}
                autoFocus
              />
            </div>

            {/* Button */}
            <div className="text-center">
              <button
                onClick={handleStart}
                disabled={!playerName.trim()}
                className={cn(
                  "px-12 py-4 rounded-lg font-bold text-xl transition-all",
                  "bg-primary/20 border-2 border-primary/60 text-primary",
                  "hover:bg-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/20",
                  "active:scale-95",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                ابدأ
              </button>
            </div>
          </div>

          {/* Bottom Glow Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      )}

      {step === 'loading' && (
        <div className="text-center animate-scale-in">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-4 border-4 border-secondary/30 rounded-full" />
            <div className="absolute inset-4 border-4 border-secondary border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
          <p className="text-xl font-bold text-primary glow-text animate-pulse">
            جاري إنشاء شخصيتك...
          </p>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
