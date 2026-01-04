import { useState, useEffect } from 'react';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlphaNoticeModalProps {
  show: boolean;
  onDismiss: () => void;
}

export const AlphaNoticeModal = ({ show, onDismiss }: AlphaNoticeModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    }
  }, [show]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!show) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300",
      isVisible ? "bg-black/90 backdrop-blur-md" : "bg-transparent"
    )}>
      <div className={cn(
        "relative w-full max-w-md bg-[#0a0a0f] border-2 border-yellow-500/50 shadow-[0_0_60px_rgba(234,179,8,0.3)] transition-all duration-500 overflow-hidden",
        isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
      )}>
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow-500" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-yellow-500" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-yellow-500" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow-500" />

        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border-b border-yellow-500/30 p-4">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500 animate-pulse" />
            <h2 className="text-lg font-black tracking-[0.2em] uppercase text-yellow-500">
              نسخة Alpha
            </h2>
            <AlertTriangle className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-right" dir="rtl">
          <p className="text-sm text-slate-300 leading-relaxed">
            هذه النسخة هي نسخة <span className="text-yellow-400 font-bold">Alpha</span> ولا تعتبر النسخة الرسمية الأولى، فإنها فيها العديد من المشاكل والعديد من التغييرات التي تم حذفها من هذه النسخة لضمان تجربة المستخدم الكاملة بدون مشاكل كبيرة تعيق واجهة المستخدم.
          </p>

          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-400">
              في حال مواجهة أي مشكلة في النظام يرجى طرحها في الرابط الرسمي للديسكورد
            </p>
            <a 
              href="https://discord.gg/your-server" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              انضم للديسكورد
            </a>
          </div>

          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-xs text-orange-400 font-bold">
              ⚠️ ملاحظة مهمة: هذه فقط النسخة الأولى وتعتبر جزء بسيط جداً من النسخة الرسمية الأولى
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-yellow-500/20">
          <button
            onClick={handleDismiss}
            className="w-full py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 text-yellow-400 font-bold text-sm uppercase tracking-widest hover:from-yellow-500/30 hover:to-orange-500/30 transition-all active:scale-95"
          >
            فهمت، متابعة
          </button>
        </div>

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
        </div>
      </div>
    </div>
  );
};
