import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, Skull, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PunishmentScreenProps {
  endTime: string;
  onTimeComplete: () => void;
  onExit?: () => void;
}

export const PunishmentScreen = ({ endTime, onTimeComplete, onExit }: PunishmentScreenProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const calculateRemaining = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      return remaining;
    };

    setTimeRemaining(calculateRemaining());

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
        onTimeComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onTimeComplete]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Animated red background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950 via-red-900/90 to-black" />
      
      {/* Pulsing overlay */}
      <div className="absolute inset-0 bg-destructive/20 animate-pulse" />
      
      {/* Warning stripes - top */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <div 
          className="h-full w-[200%]"
          style={{
            background: 'repeating-linear-gradient(90deg, hsl(0 70% 50% / 0.8) 0px, hsl(0 70% 50% / 0.8) 40px, hsl(0 70% 25% / 0.8) 40px, hsl(0 70% 25% / 0.8) 80px)',
            animation: 'slideStripes 2s linear infinite'
          }}
        />
      </div>
      
      {/* Warning stripes - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <div 
          className="h-full w-[200%]"
          style={{
            background: 'repeating-linear-gradient(90deg, hsl(0 70% 50% / 0.8) 0px, hsl(0 70% 50% / 0.8) 40px, hsl(0 70% 25% / 0.8) 40px, hsl(0 70% 25% / 0.8) 80px)',
            animation: 'slideStripes 2s linear infinite reverse'
          }}
        />
      </div>
      
      {/* Floating danger particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-red-500/40 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}

      <div className="relative z-10 text-center p-6 max-w-md w-full mx-4">
        {/* Exit button */}
        {onExit && (
          <button 
            onClick={onExit}
            className="absolute top-0 right-0 p-2 text-red-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        
        {/* Warning Icon with glow */}
        <div className="relative mb-8">
          <div 
            className="w-32 h-32 mx-auto rounded-full border-4 border-destructive flex items-center justify-center animate-pulse"
            style={{
              background: 'linear-gradient(180deg, hsl(0 70% 30%), hsl(0 70% 15%))',
              boxShadow: '0 0 60px hsl(0 70% 50% / 0.5), inset 0 0 40px hsl(0 70% 40% / 0.3)'
            }}
          >
            <Skull className="w-16 h-16 text-destructive" />
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-destructive/30 blur-2xl animate-glow-pulse" />
        </div>

        {/* Warning Title */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-destructive/30 border border-destructive/60 mb-6">
          <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
          <span className="font-bold text-destructive tracking-wider">PENALTY ZONE</span>
        </div>

        {/* Message */}
        <h2 
          className="text-2xl font-bold text-destructive mb-4"
          style={{ textShadow: '0 0 30px hsl(0 70% 50% / 0.6)' }}
        >
          لم تكمل المهمات اليومية!
        </h2>
        <p className="text-red-300/80 mb-8 text-sm">
          عقوبة عدم إكمال المهمات. انتظر حتى انتهاء العقوبة أو سيتم خصم مستواك وصحتك.
        </p>

        {/* Timer */}
        <div 
          className="rounded-xl border-2 border-destructive/60 p-6 mb-6"
          style={{
            background: 'linear-gradient(180deg, hsl(0 50% 8%), hsl(0 60% 4%))',
            boxShadow: '0 0 40px hsl(0 70% 40% / 0.3), inset 0 0 30px hsl(0 0% 0% / 0.5)'
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className="w-6 h-6 text-destructive animate-pulse" />
            <span className="text-sm text-red-400">الوقت المتبقي</span>
          </div>
          <div 
            className="text-5xl font-bold font-mono text-destructive"
            style={{ textShadow: '0 0 40px hsl(0 70% 50% / 0.6)' }}
          >
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Warning Text */}
        <p className="text-xs text-red-400/70 mb-4">
          انتظر حتى انتهاء العقوبة للعودة إلى اللعبة
        </p>
        
        {/* Demo exit button for testing */}
        {onExit && (
          <Button 
            onClick={onExit}
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive/20"
          >
            خروج (للتجربة)
          </Button>
        )}
      </div>

      <style>{`
        @keyframes slideStripes {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
