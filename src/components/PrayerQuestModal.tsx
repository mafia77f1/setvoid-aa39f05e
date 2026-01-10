import { PrayerQuest } from '@/types/game';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Clock, Check, MapPin, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PrayerQuestModalProps {
  prayer: PrayerQuest;
  onComplete: (id: string) => void;
  onClose: () => void;
}

export const PrayerQuestModal = ({ prayer, onComplete, onClose }: PrayerQuestModalProps) => {
  const { playQuestComplete, playClick } = useSoundEffects();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const [city] = useState(() => localStorage.getItem('user_city') || 'Baghdad');
  const [country] = useState(() => localStorage.getItem('user_country') || 'Iraq');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(), 800);
  };

  const handleComplete = () => {
    playQuestComplete();
    onComplete(prayer.id);
    handleClose();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-1000",
        isVisible && !isExiting ? "bg-black/90" : "bg-black/0 pointer-events-none"
      )}
      onClick={handleClose}
    >
      {/* ترويسة النظام المستقلة */}
      <div className={cn(
        "fixed top-[15%] left-1/2 -translate-x-1/2 z-[60] transition-all duration-1000",
        isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
      )}>
        <div className="bg-black border border-white/20 px-6 py-1 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <h2 className="text-white font-black tracking-[0.5em] italic text-sm drop-shadow-[0_0_10px_white]">
            SYSTEM: <span className="text-blue-500">DAILY QUEST</span>
          </h2>
        </div>
      </div>

      <div
        className={cn(
          "relative max-w-[340px] w-full bg-[#050505] border-x border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.1)] overflow-hidden",
          isVisible && !isExiting ? "animate-super-smooth-entry" : "opacity-0 scale-y-0 duration-[800ms]"
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6]" />

        <div className="p-6 space-y-5 animate-content-fade">
          {/* اسم الصلاة */}
          <div className="text-center pt-2">
            <h3 className="text-4xl font-black italic text-white drop-shadow-[0_0_15px_white] tracking-tighter">
              {prayer.arabicName}
            </h3>
            <p className="text-[8px] text-white/40 font-black tracking-widest uppercase mt-1 italic">
              "اتصال الروح بالخالق"
            </p>
          </div>

          {/* الإحصائيات المختصرة */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 border border-white/5 p-2 flex items-center justify-between">
              <span className="text-[7px] text-white/40 font-black">TIME</span>
              <span className="text-xs font-black text-white italic">40m</span>
            </div>
            <div className="bg-white/5 border border-white/5 p-2 flex items-center justify-between">
              <span className="text-[7px] text-white/40 font-black">XP</span>
              <span className="text-xs font-black text-blue-400">+{prayer.xpReward}</span>
            </div>
          </div>

          {/* خانة التطوير SPR - تشبه الصورة تماماً */}
          <div className="bg-blue-900/10 border border-blue-500/30 p-3 relative">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[7px] text-blue-400 font-black tracking-widest">RATE</span>
                <span className="text-lg font-black text-white drop-shadow-[0_0_8px_white]">40xp</span>
              </div>
              <div className="text-right">
                <span className="text-[7px] text-blue-400 font-black tracking-widest uppercase">Special Stat Upgrade</span>
                <h4 className="text-white font-black italic text-sm">SPR <span className="text-[8px] text-white/40 ml-1 italic">Spiritual</span></h4>
              </div>
            </div>
          </div>

          {/* الفوائد - مختصرة جداً */}
          <div className="space-y-1.5 py-1">
            {['الطمأنينة القلبية', 'تعزيز الرابطة مع الله', 'الراحة النفسية والسكينة', 'تقوية الإيمان الداخلي'].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-white/70 font-bold bg-white/[0.02] px-2 py-1 border-l border-blue-500/50">
                <div className="w-1 h-1 bg-white rotate-45" />
                {benefit}
              </div>
            ))}
          </div>

          {/* الأزرار */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleComplete}
              disabled={prayer.completed}
              className="w-full py-3 bg-white text-black font-black text-xs tracking-[0.2em] italic hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              ACCEPT & COMPLETE
            </button>
            <button onClick={handleClose} className="w-full text-white/20 text-[8px] font-black tracking-widest uppercase hover:text-white transition-colors text-center">
              CLOSE WINDOW
            </button>
          </div>
        </div>

        <style>{`
          @keyframes super-smooth-entry {
            0% { transform: scaleY(0.005) scaleX(0.1); opacity: 0; }
            40% { transform: scaleY(0.005) scaleX(1); opacity: 1; }
            100% { transform: scaleY(1) scaleX(1); opacity: 1; }
          }
          @keyframes content-fade-in { 
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-super-smooth-entry { animation: super-smooth-entry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-content-fade { animation: content-fade-in 0.6s ease-out 0.6s both; }
        `}</style>
      </div>
    </div>
  );
};
