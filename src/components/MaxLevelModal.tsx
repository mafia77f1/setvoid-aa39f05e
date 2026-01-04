import { useState, useEffect } from 'react';
import { Crown, ExternalLink, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaxLevelModalProps {
  show: boolean;
  onDismiss: () => void;
}

export const MaxLevelModal = ({ show, onDismiss }: MaxLevelModalProps) => {
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
        "relative w-full max-w-md bg-[#0a0a0f] border-2 border-purple-500/50 shadow-[0_0_80px_rgba(168,85,247,0.4)] transition-all duration-500 overflow-hidden",
        isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
      )}>
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-500" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-500" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-500" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500" />

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-b border-purple-500/30 p-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.6)]">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-[0.2em] uppercase text-purple-400">
            مستوى 50
          </h2>
          <p className="text-xs text-purple-300 mt-1">الحد الأقصى في النسخة التجريبية</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-center" dir="rtl">
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <Lock className="w-5 h-5" />
            <span className="text-sm font-bold">تم إيقاف نظام التطور</span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            لقد وصلت إلى <span className="text-purple-400 font-bold">الحد الأقصى للمستوى</span> في هذه النسخة التجريبية.
          </p>

          <p className="text-xs text-slate-400">
            لإطلاق النسخة الرسمية الكاملة، يرجى متابعة موقعنا الإلكتروني للحصول على آخر التحديثات.
          </p>

          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <a 
              href="https://your-website.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors font-bold"
            >
              <ExternalLink className="w-4 h-4" />
              زيارة الموقع الرسمي
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/20">
          <button
            onClick={handleDismiss}
            className="w-full py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-purple-400 font-bold text-sm uppercase tracking-widest hover:from-purple-500/30 hover:to-pink-500/30 transition-all active:scale-95"
          >
            حسناً
          </button>
        </div>
      </div>
    </div>
  );
};
