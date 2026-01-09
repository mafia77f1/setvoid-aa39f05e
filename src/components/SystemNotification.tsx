import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SystemNotificationProps {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' }[];
}

export const SystemNotification = ({
  show,
  title,
  message,
  onClose,
  actions = [],
}: SystemNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [alreadyShown, setAlreadyShown] = useState(true); // نبدأ بـ true لمنع الوميض

  useEffect(() => {
    // التحقق إذا كان المستخدم قد رأى الرسالة من قبل في هذا المتصفح
    const hasSeen = localStorage.getItem('system_notification_seen');
    
    if (!hasSeen && show) {
      setAlreadyShown(false);
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsExiting(true);
    // تخزين الحالة في المتصفح لمنع الظهور للأبد
    localStorage.setItem('system_notification_seen', 'true');
    
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 800);
  };

  // إذا رآها مسبقاً أو لا توجد رسالة للعرض، لا ترجع شيئاً
  if (alreadyShown || !show) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]",
        isVisible && !isExiting ? "bg-black/60" : "bg-black/0 pointer-events-none"
      )}
    >
      <div 
        className={cn(
          "relative max-w-sm w-full bg-black border-x border-white/40 shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all ease-[cubic-bezier(0.2,1,0.2,1)]",
          isVisible && !isExiting 
            ? "opacity-100 scale-y-100 duration-[1500ms]" 
            : "opacity-0 scale-y-0 duration-[800ms]",
          "origin-center"
        )}
      >
        {/* خطوط التوهج العلوي والسفلي */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-[1500ms] delay-500",
          isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        )} />
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-[1500ms] delay-500",
          isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        )} />

        <div className={cn(
          "p-8 transition-all duration-1000 delay-700",
          isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          
          {/* Header - توهج خفيف */}
          <div className="text-center mb-8">
            <span className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">
              Terminal Access
            </span>
          </div>

          {/* Title - نص متوهج بقوة */}
          <h3 className="text-2xl font-black text-center text-white tracking-tighter uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mb-4">
            {title}
          </h3>
          
          {/* Message - نص أبيض واضح ونقي */}
          <p className="text-sm text-white/90 font-medium text-center leading-relaxed tracking-wide mb-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
            {message}
          </p>

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
                    "w-full py-3 text-[11px] font-black tracking-[0.3em] uppercase transition-all duration-500",
                    action.variant === 'secondary'
                      ? "text-white/40 hover:text-white"
                      : "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                  )}
                >
                  {action.label}
                </button>
              ))
            ) : (
              <button
                onClick={handleClose}
                className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all"
              >
                Confirm
              </button>
            )}
          </div>
        </div>

        {/* تأثير الـ Scanline الخفيف جداً */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_50%,transparent_50%)] bg-[size:100%_4px]" />
      </div>
    </div>
  );
};
