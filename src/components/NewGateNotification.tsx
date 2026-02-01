import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Gate } from '@/types/game';
import { Target, Zap, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewGateNotificationProps {
  show: boolean;
  gate: Gate | null;
  onClose: () => void;
}

export const NewGateNotification = ({ show, gate, onClose }: NewGateNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { playNotification } = useSoundEffects();
  const navigate = useNavigate();

  useEffect(() => {
    if (show && gate) {
      // تشغيل صوت الإشعار
      playNotification();
      
      // إظهار الإشعار مع تأخير للأنيميشن
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [show, gate, playNotification]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      setIsVisible(false);
      onClose();
    }, 500);
  };

  const handleNavigate = () => {
    handleClose();
    setTimeout(() => navigate('/gates'), 600);
  };

  if (!show || !gate) return null;

  const rankColors: Record<string, { border: string; text: string; bg: string; glow: string }> = {
    'E': { border: 'border-gray-500', text: 'text-gray-400', bg: 'bg-gray-900/80', glow: 'shadow-[0_0_30px_rgba(107,114,128,0.4)]' },
    'D': { border: 'border-green-500', text: 'text-green-400', bg: 'bg-green-900/80', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.4)]' },
    'C': { border: 'border-blue-500', text: 'text-blue-400', bg: 'bg-blue-900/80', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.4)]' },
    'B': { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-900/80', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]' },
    'A': { border: 'border-orange-500', text: 'text-orange-400', bg: 'bg-orange-900/80', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.4)]' },
    'S': { border: 'border-red-500', text: 'text-red-400', bg: 'bg-red-900/80', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]' },
  };

  const colors = rankColors[gate.rank] || rankColors['E'];

  return (
    <div className={cn(
      "fixed inset-0 z-[200] flex items-start justify-center pt-16 p-4 transition-all duration-500",
      isVisible && !isExiting ? "bg-black/60 backdrop-blur-sm" : "bg-transparent pointer-events-none"
    )}>
      <div className={cn(
        "relative max-w-sm w-full transition-all duration-500",
        isVisible && !isExiting 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 -translate-y-10 scale-95"
      )}>
        {/* الإشعار الرئيسي */}
        <div className={cn(
          "relative border-2 p-4 overflow-hidden",
          colors.border,
          colors.bg,
          colors.glow
        )}>
          {/* أنيميشن الخط المتحرك */}
          <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
            <div className={cn(
              "h-full animate-pulse",
              gate.rank === 'S' ? 'bg-red-500' : 
              gate.rank === 'A' ? 'bg-orange-500' : 
              gate.rank === 'B' ? 'bg-purple-500' : 
              gate.rank === 'C' ? 'bg-blue-500' : 
              gate.rank === 'D' ? 'bg-green-500' : 'bg-gray-500'
            )} />
          </div>

          {/* زر الإغلاق */}
          <button
            onClick={handleClose}
            className="absolute top-2 left-2 p-1 bg-white/10 hover:bg-white/20 transition-colors rounded"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>

          {/* المحتوى */}
          <div className="flex items-center gap-4">
            {/* أيقونة البوابة */}
            <div className={cn(
              "w-16 h-16 rounded border-2 flex items-center justify-center animate-pulse",
              colors.border,
              "bg-black/50"
            )}>
              <Target className={cn("w-8 h-8", colors.text)} />
            </div>

            {/* التفاصيل */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-[10px] font-bold tracking-widest uppercase", colors.text)}>
                  بوابة جديدة
                </span>
                <Zap className={cn("w-3 h-3 animate-bounce", colors.text)} />
              </div>
              <h3 className="text-white font-bold text-lg">{gate.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "px-2 py-0.5 text-xs font-bold border",
                  colors.border,
                  colors.text
                )}>
                  رتبة {gate.rank}
                </span>
                <span className="text-xs text-slate-400">
                  {gate.energyDensity === '???' ? (
                    <span className="text-yellow-400">طاقة: ??? <span className="text-[10px]">(مستوى عالي)</span></span>
                  ) : (
                    <>طاقة: {gate.energyDensity}</>
                  )}
                </span>
              </div>
              {gate.danger === '???' && (
                <div className="mt-1 text-[10px] text-yellow-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>معلومات محجوبة - البوابة أعلى من مستواك</span>
                </div>
              )}
            </div>
          </div>

          {/* زر الذهاب للبوابات */}
          <button
            onClick={handleNavigate}
            className={cn(
              "w-full mt-4 py-2 font-bold text-sm uppercase tracking-wider transition-all active:scale-95 border",
              colors.border,
              "bg-black/50 hover:bg-black/70",
              colors.text
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <Target className="w-4 h-4" />
              <span>استكشاف البوابات</span>
            </div>
          </button>
        </div>

        {/* تحذير الخطر */}
        {(gate.rank === 'A' || gate.rank === 'S') && (
          <div className="mt-2 flex items-center gap-2 justify-center animate-pulse">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-red-400 font-bold">تحذير: بوابة عالية الخطورة!</span>
          </div>
        )}
      </div>
    </div>
  );
};
