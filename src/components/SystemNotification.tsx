import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SystemNotificationProps {
  show: boolean;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' }[];
}

export const SystemNotification = ({
  show,
  title,
  message,
  type = 'info',
  onClose,
  actions = [],
}: SystemNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      // Delay for entrance animation
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 300);
  };

  if (!show) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300",
        isVisible && !isExiting ? "bg-black/80" : "bg-black/0"
      )}
      onClick={handleClose}
    >
      {/* إطار النافذة الرئيسي - ستايل الماركت */}
      <div 
        className={cn(
          "relative max-w-sm w-full bg-black/90 border-2 border-slate-200/90 shadow-[0_0_30px_rgba(30,58,138,0.5)] transition-all duration-500",
          isVisible && !isExiting 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-90 translate-y-8"
        )}
        style={{
          animation: isVisible && !isExiting ? 'notification-glitch 0.5s ease-out' : undefined
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* الزوايا الديكورية البيضاء */}
        <div className={cn(
          "absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white z-10 transition-all duration-700",
          isVisible && !isExiting ? "opacity-100" : "opacity-0 -translate-x-2 -translate-y-2"
        )} />
        <div className={cn(
          "absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white z-10 transition-all duration-700",
          isVisible && !isExiting ? "opacity-100" : "opacity-0 translate-x-2 -translate-y-2"
        )} />
        <div className={cn(
          "absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white z-10 transition-all duration-700",
          isVisible && !isExiting ? "opacity-100" : "opacity-0 -translate-x-2 translate-y-2"
        )} />
        <div className={cn(
          "absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white z-10 transition-all duration-700",
          isVisible && !isExiting ? "opacity-100" : "opacity-0 translate-x-2 translate-y-2"
        )} />

        {/* زر الإغلاق */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-4 h-4 text-slate-400 hover:text-white" />
        </button>

        <div className="p-6">
          {/* Header - العنوان الطائر فوق الإطار */}
          <div className={cn(
            "flex justify-center mb-8 mt-[-2.5rem] transition-all duration-500 delay-100",
            isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}>
            <div className="border border-slate-400/50 px-4 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <span className="text-[10px] font-black tracking-[0.3em] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] uppercase italic">
                System Message
              </span>
            </div>
          </div>

          {/* Content */}
          <div className={cn(
            "text-center space-y-4 mb-8 transition-all duration-500 delay-200",
            isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <h3 className="text-lg font-black italic tracking-wider text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase">
              {title}
            </h3>
            
            <div className={cn(
              "h-[1px] w-full bg-gradient-to-r from-transparent via-slate-500/50 to-transparent transition-all duration-700 delay-300",
              isVisible && !isExiting ? "scale-x-100" : "scale-x-0"
            )} />
            
            <p className="text-xs text-slate-300 font-bold leading-relaxed italic tracking-tight">
              {message}
            </p>
          </div>

          {/* Actions - الأزرار */}
          <div className={cn(
            "flex flex-col gap-2 transition-all duration-500 delay-300",
            isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  handleClose();
                }}
                className={cn(
                  "w-full py-3 text-[10px] font-black tracking-[0.2em] uppercase transition-all active:scale-95 border",
                  action.variant === 'secondary'
                    ? "bg-transparent border-slate-700 text-slate-500 hover:text-slate-300"
                    : "bg-white/10 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-white/20"
                )}
              >
                {action.label}
              </button>
            ))}
            
            {actions.length === 0 && (
              <button
                onClick={handleClose}
                className="w-full py-3 bg-white text-black font-black text-[10px] tracking-[0.3em] uppercase hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                Confirm
              </button>
            )}
          </div>
        </div>

        {/* Scanline Effect Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
        
        {/* Glitch line effect */}
        {isVisible && !isExiting && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-full h-[2px] bg-white/30 animate-[scan-line_2s_linear_infinite]" />
          </div>
        )}
      </div>
    </div>
  );
};
