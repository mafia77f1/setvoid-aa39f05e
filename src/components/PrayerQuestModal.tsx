import { PrayerQuest } from '@/types/game';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Clock, Check, X, ShieldAlert, MapPin, Save, ChevronLeft } from 'lucide-react';
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
  
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [city, setCity] = useState('Baghdad');
  const [country, setCountry] = useState('Iraq');
  const [prayerTime, setPrayerTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    fetchPrayerTimings();
    return () => clearTimeout(timer);
  }, []);

  const fetchPrayerTimings = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2&date=${today}`
      );
      const data = await response.json();
      if (data.code === 200) {
        const timings = data.data.timings;
        // نستخدم معرف الصلاة لجلب الوقت، وإذا لم يوجد نعرض --:-- بدل الإخفاء
        const time = timings[prayer.id.charAt(0).toUpperCase() + prayer.id.slice(1)]; 
        setPrayerTime(time || "00:00");
      }
    } catch (error) {
      console.error("Error fetching timings:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-1000",
        isVisible && !isExiting ? "bg-black/80" : "bg-black/0 pointer-events-none"
      )}
      onClick={handleClose}
    >
      <div
        className={cn(
          "relative max-w-sm w-full bg-black/80 border-2 border-slate-200/90 p-5 shadow-[0_0_30px_rgba(30,58,138,0.4)] transition-all ease-[cubic-bezier(0.23,1,0.32,1)]",
          isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1500ms]" : "opacity-0 scale-y-0 duration-[800ms]",
          "origin-center"
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className={cn(
          "flex justify-center mb-6 mt-[-1.8rem] transition-all duration-700 delay-700",
          isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}>
          <div className="border border-slate-400/50 px-5 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">
              QUEST: <span className="text-blue-400">Daily Prayer</span>
            </h2>
          </div>
        </div>

        {showLocationSettings ? (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setShowLocationSettings(false)} className="text-slate-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Set Location</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">Country</label>
                <input 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-2 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 uppercase font-bold ml-1">City / Province</label>
                <input 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-2 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={() => { fetchPrayerTimings(); setShowLocationSettings(false); }}
              className="w-full py-3 mt-4 bg-blue-500/20 border border-blue-500/50 text-blue-300 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-blue-500/30 transition-all"
            >
              <span className="flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save Location
              </span>
            </button>
          </div>
        ) : (
          <div className={cn(
            "space-y-6 transition-all duration-1000 delay-[800ms]",
            isVisible && !isExiting ? "opacity-100" : "opacity-0"
          )}>
            <div className="text-center py-2 relative">
              <h3 className="text-3xl font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] tracking-tighter">
                {prayer.arabicName}
              </h3>
              <button 
                onClick={() => setShowLocationSettings(true)}
                className="absolute right-0 top-0 text-slate-500 hover:text-blue-400 transition-colors"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-white/10 p-2 bg-white/5">
                <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Prayer Time</p>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span className="text-xs font-mono font-bold">
                    {/* هنا يظهر الوقت دائماً أو حالة التحميل دون إخفاء الكارد */}
                    {isLoading ? "LOADING..." : prayerTime || "--:--"}
                  </span>
                </div>
              </div>
              <div className="border border-white/10 p-2 bg-white/5">
                <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Clear Reward</p>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-xs font-bold text-blue-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                    +{prayer.xpReward} XP
                  </span>
                </div>
              </div>
            </div>

            <div className="py-3 border-t border-slate-700/50 text-center px-2">
              <p className="text-[10px] text-slate-400 italic leading-relaxed">
                "Location: {city}, {country}"
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleComplete}
                // الزر يبقى متاحاً للضغط لإتمام المهمة في أي وقت
                disabled={prayer.completed}
                className={cn(
                  "w-full py-3 border transition-all active:scale-[0.98] font-bold text-[11px] tracking-[0.2em] uppercase",
                  prayer.completed
                    ? "bg-slate-800/50 border-slate-700 text-slate-500"
                    : "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20 shadow-[0_0_15px_rgba(96,165,250,0.2)]"
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-3.5 h-3.5" />
                  {prayer.completed ? 'Quest Cleared' : 'Complete Quest'}
                </span>
              </button>

              <button
                onClick={() => { playClick(); handleClose(); }}
                className="w-full py-2 bg-transparent border border-white/10 text-slate-500 text-[9px] font-bold tracking-[0.1em] uppercase hover:bg-white/5 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

        {/* Decor Corners */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/30" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/30" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/30" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/30" />
      </div>
    </div>
  );
};
