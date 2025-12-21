import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

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
    window.close();
  };

  const handleStart = () => {
    if (playerName.trim()) {
      playLevelUp();
      setStep('loading');
      setTimeout(() => {
        completeOnboarding(playerName.trim());
        navigate('/');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects - Blue glow like Solo Leveling */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(200_100%_50%/0.1)] rounded-full blur-[100px] animate-pulse-slow" />
      </div>

      {step === 'welcome' && (
        <div className="notification-panel max-w-lg w-full mx-auto animate-modal-appear relative">
          {/* Side Decorations */}
          <div className="absolute top-12 -left-3 w-6 h-40 border-l-2 border-t-2 border-b-2 border-[hsl(200_100%_50%/0.5)] rounded-l-lg" />
          <div className="absolute top-12 -right-3 w-6 h-40 border-r-2 border-t-2 border-b-2 border-[hsl(200_100%_50%/0.5)] rounded-r-lg" />

          <div className="p-8">
            {/* Header - Notification */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded border border-[hsl(200_100%_50%/0.5)] bg-[hsl(200_100%_50%/0.1)]">
                <AlertCircle className="w-5 h-5 text-[hsl(200_100%_70%)]" />
                <span className="text-sm font-bold text-[hsl(200_100%_70%)] tracking-[0.2em]">NOTIFICATION</span>
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-4 mb-12">
              <p className="text-lg text-foreground/80">
                You have acquired the qualifications
              </p>
              <p className="text-lg">
                to be a <span className="text-[hsl(200_100%_70%)] font-bold" style={{ textShadow: '0 0 20px hsl(200 100% 60% / 0.5)' }}>Player</span>. Will you accept?
              </p>
            </div>

            {/* Buttons - Solo Leveling Style */}
            <div className="flex gap-6 justify-center">
              <button
                onClick={handleAccept}
                className={cn(
                  "px-10 py-4 rounded font-bold text-lg transition-all",
                  "bg-transparent border-2 border-[hsl(200_100%_50%/0.6)] text-[hsl(200_100%_70%)]",
                  "hover:bg-[hsl(200_100%_50%/0.1)] hover:border-[hsl(200_100%_50%)] hover:shadow-[0_0_30px_hsl(200_100%_50%/0.3)]",
                  "active:scale-95"
                )}
              >
                Yes
              </button>
              <button
                onClick={handleDecline}
                className={cn(
                  "px-10 py-4 rounded font-bold text-lg transition-all",
                  "bg-transparent border-2 border-[hsl(200_100%_50%/0.3)] text-[hsl(200_100%_50%/0.5)]",
                  "hover:bg-[hsl(200_100%_50%/0.05)] hover:border-[hsl(200_100%_50%/0.4)]",
                  "active:scale-95"
                )}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'name' && (
        <div className="notification-panel max-w-lg w-full mx-auto animate-modal-appear relative">
          {/* Side Decorations */}
          <div className="absolute top-12 -left-3 w-6 h-48 border-l-2 border-t-2 border-b-2 border-[hsl(200_100%_50%/0.5)] rounded-l-lg" />
          <div className="absolute top-12 -right-3 w-6 h-48 border-r-2 border-t-2 border-b-2 border-[hsl(200_100%_50%/0.5)] rounded-r-lg" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded border border-[hsl(200_100%_50%/0.5)] bg-[hsl(200_100%_50%/0.1)]">
                <AlertCircle className="w-5 h-5 text-[hsl(200_100%_70%)]" />
                <span className="text-sm font-bold text-[hsl(200_100%_70%)] tracking-[0.2em]">ENTER YOUR NAME</span>
              </div>
            </div>

            {/* Prompt */}
            <div className="text-center mb-6">
              <p className="text-foreground/70">
                Please enter your character name
              </p>
            </div>

            {/* Input */}
            <div className="mb-8">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="اسم اللاعب..."
                className={cn(
                  "w-full px-6 py-4 rounded text-center text-xl font-bold",
                  "bg-[hsl(210_50%_8%)] border-2 border-[hsl(200_100%_50%/0.4)]",
                  "text-foreground placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:border-[hsl(200_100%_50%/0.8)] focus:shadow-[0_0_20px_hsl(200_100%_50%/0.2)]",
                  "transition-all"
                )}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />
            </div>

            {/* Button */}
            <div className="text-center">
              <button
                onClick={handleStart}
                disabled={!playerName.trim()}
                className={cn(
                  "px-16 py-4 rounded font-bold text-xl transition-all",
                  "bg-transparent border-2 border-[hsl(200_100%_50%/0.6)] text-[hsl(200_100%_70%)]",
                  "hover:bg-[hsl(200_100%_50%/0.1)] hover:border-[hsl(200_100%_50%)] hover:shadow-[0_0_30px_hsl(200_100%_50%/0.3)]",
                  "active:scale-95",
                  "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[hsl(200_100%_50%/0.6)] disabled:hover:shadow-none"
                )}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="text-center animate-modal-appear">
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-[hsl(200_100%_50%/0.3)] rounded-full" />
            <div className="absolute inset-0 border-4 border-[hsl(200_100%_60%)] border-t-transparent rounded-full animate-spin" />
            {/* Inner ring */}
            <div className="absolute inset-6 border-4 border-[hsl(200_100%_50%/0.2)] rounded-full" />
            <div className="absolute inset-6 border-4 border-[hsl(200_100%_50%)] border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
            {/* Glow */}
            <div className="absolute inset-0 bg-[hsl(200_100%_50%/0.1)] rounded-full blur-xl animate-pulse" />
          </div>
          <p 
            className="text-2xl font-bold animate-pulse"
            style={{ color: 'hsl(200 100% 70%)', textShadow: '0 0 30px hsl(200 100% 60% / 0.8)' }}
          >
            Creating Character...
          </p>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
