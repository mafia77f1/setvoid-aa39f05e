import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, Skull } from 'lucide-react';

interface PunishmentScreenProps {
  endTime: string;
  onTimeComplete: () => void;
}

export const PunishmentScreen = ({ endTime, onTimeComplete }: PunishmentScreenProps) => {
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
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-destructive/30 to-black flex items-center justify-center">
      {/* Pulsing Red Background */}
      <div className="absolute inset-0 bg-destructive/20 animate-pulse" />
      
      {/* Warning Stripes */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <div 
          className="h-full w-[200%] animate-[slide_2s_linear_infinite]"
          style={{
            background: 'repeating-linear-gradient(90deg, hsl(0 70% 50% / 0.8) 0px, hsl(0 70% 50% / 0.8) 40px, hsl(0 70% 30% / 0.8) 40px, hsl(0 70% 30% / 0.8) 80px)'
          }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <div 
          className="h-full w-[200%] animate-[slide_2s_linear_infinite]"
          style={{
            background: 'repeating-linear-gradient(90deg, hsl(0 70% 50% / 0.8) 0px, hsl(0 70% 50% / 0.8) 40px, hsl(0 70% 30% / 0.8) 40px, hsl(0 70% 30% / 0.8) 80px)'
          }}
        />
      </div>

      <div className="relative z-10 text-center p-8 max-w-md">
        {/* Warning Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-destructive bg-destructive/20 flex items-center justify-center animate-pulse">
            <Skull className="w-16 h-16 text-destructive" />
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-destructive/30 blur-xl animate-glow-pulse" />
        </div>

        {/* Warning Title */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-destructive/30 border border-destructive/60 mb-6">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <span className="font-bold text-destructive tracking-wider">PENALTY ZONE</span>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-destructive mb-4" style={{ textShadow: '0 0 20px hsl(0 70% 50% / 0.5)' }}>
          لم تكمل المهمات اليومية!
        </h2>
        <p className="text-muted-foreground mb-8">
          عقوبة عدم إكمال المهمات. سيتم خصم مستواك وصحتك إذا لم تنتظر.
        </p>

        {/* Timer */}
        <div className="bg-black/50 rounded-xl border-2 border-destructive/60 p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-destructive" />
            <span className="text-sm text-destructive/80">الوقت المتبقي</span>
          </div>
          <div className="text-5xl font-bold font-mono text-destructive" style={{ textShadow: '0 0 30px hsl(0 70% 50% / 0.5)' }}>
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Warning Text */}
        <p className="text-xs text-destructive/70">
          انتظر حتى انتهاء العقوبة للعودة إلى اللعبة
        </p>
      </div>

      <style>{`
        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
