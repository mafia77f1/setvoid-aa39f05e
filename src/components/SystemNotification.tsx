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
  const [hasAppeared, setHasAppeared] = useState(false); // للتحكم في الظهور لمرة واحدة

  useEffect(() => {
    if (show && !hasAppeared) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasAppeared(true); // تثبيت الحالة أنه ظهر مرة واحدة
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [show, hasAppeared]);

  const handleClose = () => {
    setIsExiting(true);
    // جعل الخروج أسرع قليلاً من الدخول للحفاظ على سلاسة التجربة
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 800); 
  };

  if (!show || (hasAppeared && !isVisible && !isExiting)) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-1000",
        isVisible && !isExiting ? "bg-black/70" : "bg-black/0 pointer-events-none"
      )}
      onClick={handleClose}
    >
      <div 
        className={cn(
          "relative max-w-sm w-full bg-black/95 border-x-2 border-slate-200/90 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all ease-[cubic-bezier(0.23,1,0.32,1)]",
          // انيميشن الانفتاح الطولي
          isVisible && !isExiting 
            ? "opacity-100 scale-y-100 duration-[1500ms]" 
            : "opacity-0 scale-y-0 duration-[1000ms]",
          "origin-center" // الانفتاح يبدأ من المنتصف للطول
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* الخطوط العلوية والسفلية المتمددة */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[2px] bg-white transition-all duration-[1200ms] delay-300",
          isVisible && !isExiting ? "scale-x-100" : "scale-x-0"
        )} />
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-[2px] bg-white transition-all duration-[1200ms] delay-300",
          isVisible && !isExiting ? "scale-x-100" : "scale-x-0"
        )} />

        {/* الزوايا الديكورية */}
        <div className="absolute top-0 left-0 w-2 h-8 border-l-2 border-white -translate-x-[2px]" />
        <div className="absolute bottom-0 right-0 w-2 h-8 border-r-2 border-white translate-x-[2px]" />

        {/* زر الإغلاق */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:rotate-90 transition-all duration-300 z-20"
        >
          <X className="w-4 h-4 text-white/50 hover:text-white" />
        </button>

        {/* Content Container - يظهر بعد تمدد الإطار */}
        <div className={cn(
          "p-8 transition-opacity duration-1000 delay-[800ms]",
          isVisible && !isExiting ? "opacity-100" : "opacity-0"
        )}>
          {/* Header */}
          <div className="flex justify-center mb-10">
            <div className="relative border border-white/20 px-6 py-1 overflow-hidden">
              <div className="absolute inset-0 bg-white/5 animate-pulse" />
              <span className="relative text-[9px] font-black tracking-[0.5em] text-white/80 uppercase italic">
                Secure Transmission
              </span>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-6 mb-10">
            <h3 className="text-xl font-light tracking-[0.2em] text-white uppercase">
              {title}
            </h3>
            
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed tracking-wider uppercase">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {actions.length > 0 ? (
              actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    handleClose();
                  }}
                  className={cn(
                    "w-full py-3 text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300",
                    action.variant === 'secondary'
                      ? "border border-white/10 text-white/40 hover:bg-white/5"
                      : "bg-white text-black hover:bg-transparent hover:text-white border border-white"
                  )}
                >
                  {action.label}
                </button>
              ))
            ) : (
              <button
                onClick={handleClose}
                className="w-full py-4 bg-white text-black font-black text-[10px] tracking-[0.4em] uppercase hover:invert transition-all"
              >
                Acknowledge
              </button>
            )}
          </div>
        </div>

        {/* Scanline & Noise Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02),rgba(255,255,255,0.05))] bg-[size:100%_4px,4px_100%]" />
      </div>
    </div>
  );
};
