import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SystemNotificationProps {
  show: boolean;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' }[];
}

const typeConfig = {
  info: { borderColor: 'border-primary/60', glowColor: 'via-primary', headerBg: 'bg-primary/20', headerColor: 'text-primary' },
  success: { borderColor: 'border-secondary/60', glowColor: 'via-secondary', headerBg: 'bg-secondary/20', headerColor: 'text-secondary' },
  warning: { borderColor: 'border-yellow-500/60', glowColor: 'via-yellow-500', headerBg: 'bg-yellow-500/20', headerColor: 'text-yellow-500' },
  error: { borderColor: 'border-destructive/60', glowColor: 'via-destructive', headerBg: 'bg-destructive/20', headerColor: 'text-destructive' },
};

export const SystemNotification = ({
  show,
  title,
  message,
  type = 'info',
  onClose,
  actions = [],
}: SystemNotificationProps) => {
  if (!show) return null;

  const config = typeConfig[type];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={cn(
          "relative max-w-md w-full mx-auto animate-scale-in",
          "rounded-2xl border-2 overflow-hidden",
          config.borderColor,
          "bg-gradient-to-b from-card/95 to-background/95"
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Glow Bar */}
        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent", config.glowColor)} />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Corner Decorations */}
        <div className={cn("absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2", config.borderColor)} />
        <div className={cn("absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2", config.borderColor)} />
        <div className={cn("absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2", config.borderColor)} />

        <div className="p-6 pt-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className={cn(
              "inline-flex items-center gap-3 px-4 py-2 rounded-lg",
              config.headerBg, "border", config.borderColor
            )}>
              <div className={cn("w-2 h-2 rounded-full animate-pulse", config.headerBg.replace('/20', ''))} />
              <span className={cn("text-sm font-bold tracking-wider", config.headerColor)}>NOTIFICATION</span>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className={cn("text-xl font-bold mb-3", config.headerColor)}>{title}</h3>
            <p className="text-foreground/80">{message}</p>
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex gap-3 justify-center">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={cn(
                    "px-6 py-3 rounded-lg font-bold transition-all active:scale-95",
                    action.variant === 'secondary'
                      ? "bg-muted/30 border-2 border-muted text-foreground hover:bg-muted/50"
                      : cn(config.headerBg, "border-2", config.borderColor, config.headerColor, "hover:opacity-80")
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Glow Bar */}
        <div className={cn("absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent", config.glowColor)} />
      </div>
    </div>
  );
};
