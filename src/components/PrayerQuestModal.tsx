import { PrayerQuest } from '@/types/game';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Clock, Check, MapPin, Save, ChevronLeft, Zap, HeartPulse } from 'lucide-react';
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
        "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-all duration-1000",
        isVisible && !isExiting ? "bg-black/90" : "bg-black/0 pointer-events-none"
      )}
      onClick={handleClose}
    >
      {/* ترويسة النظام المنفصلة */}
      <div className={cn(
        "fixed top-[10%] left-1/2 -translate-x-1/2 z-[60] transition-all duration-1000",
        isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
      )}>
        <div className="bg-black border border-white/20 px-8 py-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <h2 className="text-white font-black tracking-[0.6em] italic text-lg sm:text-xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
            SYSTEM: <span className="text-blue-500">DAILY QUEST</span>
          </h2>
        </div>
      </div>

      <div
        className={cn(
          "relative max-w-md w-full bg-[#050505] border-x border-white/10 shadow-[0_0_60px_rgba(59,130,246,0.1)] min-h-[600px] flex flex-col",
          isVisible && !isExiting ? "animate-super-smooth-entry" : "opacity-0 scale-y-0 duration-[800ms]"
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute -top-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_#3b82f6]" />
        <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent shadow-[0_0_15px_white]" />

        <div className="p-8 flex-1 flex flex-col">
          {showLocationSettings ? (
            <div className="space-y-6 animate-content-fade">
              <div className="flex items-center gap-2">
                <button onClick={() => setShowLocationSettings(false)} className="text-white/40 hover:text-white"><ChevronLeft /></button>
                <h3 className="text-white font-black tracking-widest uppercase italic">Location Settings</h3>
              </div>
              <div className="space-y-4 pt-4">
                 <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 text-white font-bold" placeholder="COUNTRY" />
                 <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 text-white font-bold" placeholder="CITY" />
                 <button onClick={() => { fetchPrayerTimings(); setShowLocationSettings(false); }} className="w-full py-4 bg-white text-black font-black italic tracking-widest">SAVE DATA</button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-content-fade flex-1 flex flex-col">
              {/* اسم الصلاة والوصف */}
              <div className="text-center relative">
                <h3 className="text-5xl font-black italic text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] tracking-tighter mb-2">
                  {prayer.arabicName}
                </h3>
                <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">ارتقِ بروحك من خلال الاتصال بخالقك</p>
                <button onClick={() => setShowLocationSettings(true)} className="absolute right-0 top-0 text-white/20 hover:text-blue-400"><MapPin size={18} /></button>
              </div>

              {/* قسم الإحصائيات (القديم) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.03] border border-white/10 p-4 relative overflow-hidden group">
                  <p className="text-[9px] text-white/40 font-black mb-1">TIME LIMIT</p>
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={16} className="text-blue-400" />
                    <span className="text-lg font-black italic">40m</span>
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-4">
                  <p className="text-[9px] text-white/40 font-black mb-1">XP REWARD</p>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-lg font-black italic text-blue-400 drop-shadow-[0_0_10px_#3b82f6]">+{prayer.xpReward}</span>
                  </div>
                </div>
              </div>

              {/* خانة التطوير SPR */}
              <div className="bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-500/30 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] text-blue-400 font-black mb-1 tracking-widest uppercase">Special Stat Upgrade</p>
                    <h4 className="text-white font-black italic text-xl">SPR <span className="text-[10px] text-white/60 ml-2">Spiritual Power</span></h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-white/40 font-black mb-1">RATE</p>
                    <p className="text-white font-black italic text-xl text-blue-400 drop-shadow-[0_0_8px_#3b82f6]">40xp</p>
                  </div>
                </div>
              </div>

              {/* ماذا ستكسب من الصلاة */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <HeartPulse size={14} className="text-white/60" />
                  <span className="text-[10px] text-white/60 font-black tracking-widest uppercase">Spiritual Benefits</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {['الطمأنينة القلبية', 'تعزيز الرابطة مع الله', 'الراحة النفسية والسكينة', 'تقوية الإيمان الداخلي'].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/[0.02] p-3 border-l-2 border-blue-500/50">
                      <div className="w-1.5 h-1.5 bg-white rotate-45 shadow-[0_0_5px_white]" />
                      <span className="text-white/80 text-xs font-bold">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* الأزرار */}
              <div className="space-y-3 pt-6">
                <button
                  onClick={handleComplete}
                  disabled={prayer.completed}
                  className={cn(
                    "w-full py-5 font-black text-sm tracking-[0.3em] uppercase italic transition-all active:scale-[0.98]",
                    prayer.completed
                      ? "bg-white/5 text-white/20 border border-white/10"
                      : "bg-white text-black hover:bg-blue-500 hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Zap size={18} />
                    {prayer.completed ? 'COMPLETED' : 'ACCEPT & COMPLETE'}
                  </span>
                </button>
                <button onClick={handleClose} className="w-full text-white/30 text-[10px] font-black tracking-widest uppercase hover:text-white transition-colors">DISMISS WINDOW</button>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes super-smooth-entry {
            0% { transform: scaleY(0.005) scaleX(0.1); opacity: 0; filter: brightness(5); }
            40% { transform: scaleY(0.005) scaleX(1); opacity: 1; filter: brightness(2); }
            100% { transform: scaleY(1) scaleX(1); opacity: 1; filter: brightness(1); }
          }
          @keyframes content-fade-in { 
            0% { opacity: 0; transform: translateY(20px); filter: blur(10px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          .animate-super-smooth-entry { animation: super-smooth-entry 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-content-fade { animation: content-fade-in 0.8s ease-out 0.8s both; }
        `}</style>
      </div>
    </div>
  );
};
