import { PrayerQuest } from '@/types/game';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Clock, Check, MapPin, Save, ChevronLeft } from 'lucide-react';
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
  
  // تحميل الإعدادات المحفوظة من LocalStorage أو استخدام قيم افتراضية
  const [city, setCity] = useState(() => localStorage.getItem('user_city') || 'Baghdad');
  const [country, setCountry] = useState(() => localStorage.getItem('user_country') || 'Iraq');
  
  const [showLocationSettings, setShowLocationSettings] = useState(false);
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
        const time = timings[prayer.id.charAt(0).toUpperCase() + prayer.id.slice(1)]; 
        setPrayerTime(time || "00:00");
        
        // حفظ البيانات في LocalStorage عند النجاح فقط
        localStorage.setItem('user_city', city);
        localStorage.setItem('user_country', country);
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
        "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-700",
        isVisible && !isExiting ? "bg-black/80" : "bg-black/0 pointer-events-none"
      )}
      onClick={handleClose}
    >
      <div
        className={cn(
          "relative max-w-sm w-full bg-black/90 border-x border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]",
          isVisible && !isExiting ? "animate-modal-entry" : "opacity-0 scale-y-0 duration-500"
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* الخطوط المتوهجة العلوية والسفلية (نفس ستايل الـ Onboarding) */}
        <div className="absolute -top-[1px] left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6] z-20" />
        <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_15px_#3b82f6] z-20" />

        <div className="p-6">
          {/* الترويسة */}
          <div className="flex justify-center mb-6 mt-[-1.5rem]">
            <div className="border border-blue-500/50 px-4 py-0.5 bg-slate-900">
              <h2 className="text-[9px] font-black tracking-[0.3em] text-white uppercase italic">
                SYSTEM: <span className="text-blue-400">DAILY QUEST</span>
              </h2>
            </div>
          </div>

          {showLocationSettings ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setShowLocationSettings(false)} className="text-slate-400 hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-white font-black text-xs uppercase tracking-widest italic">Location Sync</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-[8px] text-blue-400 uppercase font-bold mb-2">Current Prayer Time</p>
                  <p className="text-xl font-mono text-white tracking-tighter">{isLoading ? "..." : prayerTime || "--:--"}</p>
                </div>

                <div className="space-y-2">
                  <input 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="COUNTRY"
                    className="w-full bg-white/5 border border-white/10 p-2 text-white text-xs font-bold outline-none focus:border-blue-500 transition-all uppercase"
                  />
                  <input 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="CITY"
                    className="w-full bg-white/5 border border-white/10 p-2 text-white text-xs font-bold outline-none focus:border-blue-500 transition-all uppercase"
                  />
                </div>
              </div>

              <button
                onClick={() => { fetchPrayerTimings(); setShowLocationSettings(false); }}
                className="w-full py-3 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] italic hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save & Sync
              </button>
            </div>
          ) : (
            <div className={cn(
              "space-y-6 transition-opacity duration-500 delay-500",
              isVisible && !isExiting ? "opacity-100" : "opacity-0"
            )}>
              <div className="text-center relative">
                <h3 className="text-4xl font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] tracking-tighter">
                  {prayer.arabicName}
                </h3>
                <button 
                  onClick={() => setShowLocationSettings(true)}
                  className="absolute -right-2 -top-2 p-2 text-slate-500 hover:text-blue-400 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-white/10 p-3 bg-white/5">
                  <p className="text-[8px] text-slate-500 uppercase font-black mb-1 tracking-tighter">Completion Time</p>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-sm font-black italic">40m</span>
                  </div>
                </div>
                <div className="border border-white/10 p-3 bg-white/5">
                  <p className="text-[8px] text-slate-500 uppercase font-black mb-1 tracking-tighter">Quest Reward</p>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-sm font-black text-blue-400 drop-shadow-[0_0_8px_#3b82f6]">
                      +{prayer.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleComplete}
                  disabled={prayer.completed}
                  className={cn(
                    "w-full py-4 font-black text-[12px] tracking-[0.2em] uppercase italic transition-all active:scale-[0.97]",
                    prayer.completed
                      ? "bg-slate-800 text-slate-500 border border-slate-700"
                      : "bg-white text-black hover:bg-blue-500 hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    {prayer.completed ? 'Mission Accomplished' : 'Complete Quest'}
                  </span>
                </button>

                <button
                  onClick={() => { playClick(); handleClose(); }}
                  className="w-full py-2 bg-transparent text-slate-500 text-[9px] font-bold tracking-[0.2em] uppercase hover:text-white transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ستايل الأنيميشن المخصص */}
        <style>{`
          @keyframes modal-entry {
            0% { transform: scaleY(0.005) scaleX(0.1); opacity: 0; }
            40% { transform: scaleY(0.005) scaleX(1); opacity: 1; }
            100% { transform: scaleY(1) scaleX(1); opacity: 1; }
          }
          .animate-modal-entry {
            animation: modal-entry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
      </div>
    </div>
  );
};
