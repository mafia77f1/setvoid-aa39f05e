import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, X } from 'lucide-react';

interface HolographicNotificationProps {
  show: boolean;
  title?: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'levelup';
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const HolographicNotification = ({
  show,
  title = 'NOTIFICATION',
  message,
  type = 'info',
  onClose,
  autoClose = true,
  duration = 4000
}: HolographicNotificationProps) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fade-in">
      {/* Main notification container */}
      <div className="holographic-notification relative w-full max-w-md animate-modal-appear">
        {/* Cracked corners and fragments */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[hsl(200_100%_60%)] opacity-80" />
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[hsl(200_100%_60%)] opacity-80" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[hsl(200_100%_60%)] opacity-80" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[hsl(200_100%_60%)] opacity-80" />
        
        {/* Fracture lines */}
        <div className="absolute top-0 left-1/4 w-px h-4 bg-gradient-to-b from-[hsl(200_100%_70%)] to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-6 bg-gradient-to-b from-[hsl(200_100%_70%)] to-transparent" />
        <div className="absolute bottom-0 left-1/3 w-px h-5 bg-gradient-to-t from-[hsl(200_100%_70%)] to-transparent" />
        
        {/* Digital fragments */}
        <div className="absolute -top-1 left-10 w-3 h-1 bg-[hsl(200_100%_60%/0.6)] rotate-12" />
        <div className="absolute -top-3 right-16 w-4 h-1 bg-[hsl(200_100%_60%/0.4)] -rotate-6" />
        <div className="absolute -bottom-2 left-20 w-2 h-2 bg-[hsl(200_100%_60%/0.5)] rotate-45" />
        
        {/* Top glowing bar */}
        <div className="absolute -top-px left-0 right-0 h-1">
          <div className="h-full bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent animate-pulse" />
        </div>
        
        {/* Main content */}
        <div 
          className="relative rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, hsl(210 50% 8% / 0.98), hsl(210 60% 4% / 0.98))',
            border: '2px solid hsl(200 100% 50% / 0.5)',
            boxShadow: `
              0 0 60px hsl(200 100% 50% / 0.4),
              0 0 120px hsl(200 100% 50% / 0.2),
              inset 0 0 60px hsl(200 100% 50% / 0.05)
            `
          }}
        >
          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
            }}
          />
          
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[hsl(200_100%_50%/0.3)]">
            <AlertCircle className="w-5 h-5 text-[hsl(200_100%_70%)]" />
            <span 
              className="text-sm font-bold tracking-widest"
              style={{
                color: 'hsl(200 100% 70%)',
                textShadow: '0 0 20px hsl(200 100% 60%)'
              }}
            >
              {title}
            </span>
            {onClose && (
              <button 
                onClick={onClose}
                className="mr-auto text-[hsl(200_100%_60%)] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Message */}
          <div className="px-6 py-8 text-center">
            <p 
              className={cn(
                "text-xl font-bold",
                type === 'levelup' && "text-2xl"
              )}
              style={{
                color: 'white',
                textShadow: '0 0 30px hsl(200 100% 80%)'
              }}
            >
              {message}
            </p>
          </div>
          
          {/* Bottom accent line */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent" />
        </div>
        
        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
          <div 
            className="absolute w-full h-px bg-[hsl(200_100%_60%/0.5)]"
            style={{
              animation: 'scanDown 2s linear infinite'
            }}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes scanDown {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};
