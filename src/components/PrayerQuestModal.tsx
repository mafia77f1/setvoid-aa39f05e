import { PrayerQuest } from '@/types/game';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Clock, Check, MapPin, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PrayerQuestModalProps {
  prayer: PrayerQuest;
  onComplete: (id: string) => void;
  onClose: () => void;
}

export const PrayerQuestModal = ({ prayer, onComplete, onClose }: PrayerQuestModalProps) => {
  const { playQuestComplete, playClick } = useSoundEffects();
  
  // إعدادات الموقع والوقت - ظاهرة دائماً للتجربة
  const [city, setCity] = useState('Baghdad');
  const [country, setCountry] = useState('Iraq');
  const [prayerTime, setPrayerTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPrayerTimings();
  }, []);

  const fetchPrayerTimings = async () => {
    setIsLoading(true);
    try {
      // استخدام التاريخ الحالي من الجهاز للتجربة
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2&date=${today}`
      );
      const data = await response.json();
      if (data.code === 200) {
        const timings = data.data.timings;
        // استخراج وقت الصلاة بناءً على معرف المهمة (مثل Fajr, Dhuhr...)
        const time = timings[prayer.id.charAt(0).toUpperCase() + prayer.id.slice(1)]; 
        setPrayerTime(time || "00:00");
      }
    } catch (error) {
      console.error("Error fetching timings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    playQuestComplete();
    onComplete(prayer.id);
  };

  return (
    /* تم إزالة fixed و inset-0 لجعل الكارد يظهر دائماً في مكانه بالصفحة */
    <div className="relative w-full flex items-center justify-center p-4 py-10">
      <div
        className={cn(
          "relative max-w-sm w-full bg-black/80 border-2 border-slate-200/90 p-5 shadow-[0_0_30px_rgba(30,58,138,0.4)] opacity-100 scale-100"
        )}
      >
        {/* الترويسة العلوية - ثابتة */}
        <div className="flex justify-center mb-6 mt-[-1.8rem]">
          <div className="border border-slate-400/50 px-5 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">
              QUEST: <span className="text-blue-400">Daily Prayer</span>
            </h2>
          </div>
        </div>

        {/* محتوى المهمة */}
        <div className="space-y-6">
          {/* اسم الصلاة */}
          <div className="text-center py-2">
            <h3 className="text-3xl font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] tracking-tighter">
              {prayer.arabicName}
            </h3>
          </div>

          {/* واجهة الموقع - ظاهرة دائماً للتجربة */}
          <div className="border border-white/10 p-3 bg-white/5 space-y-3">
             <div className="grid grid-cols-2 gap-2">
                <input 
                  placeholder="Country"
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-black/60 border border-white/20 p-2 text-white text-[10px] outline-none focus:border-blue-500"
                />
                <input 
                  placeholder="City"
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-black/60 border border-white/20 p-2 text-white text-[10px] outline-none focus:border-blue-500"
                />
             </div>
             <button 
               onClick={fetchPrayerTimings}
               className="w-full py-2 bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[9px] font-bold uppercase tracking-widest hover:bg-blue-500/30 transition-all"
             >
               <span className="flex items-center justify-center gap-2">
                 <Save className="w-3 h-3" /> Save & Update Time
               </span>
             </button>
          </div>

          {/* معلومات المهمة والوقت المجلوب من الـ API */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-white/10 p-2 bg-white/5">
              <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Prayer Time</p>
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-3 h-3 text-blue-400" />
                <span className="text-xs font-mono font-bold uppercase">
                    {isLoading ? "Loading..." : prayerTime || "00:00"}
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

          {/* نص الوصف */}
          <div className="py-3 border-t border-slate-700/50 text-center px-2">
            <p className="text-[10px] text-slate-400 italic leading-relaxed">
              "Prayer timing is synced for {city}, {country}"
            </p>
          </div>

          {/* الأزرار */}
          <div className="space-y-2">
            <button
              onClick={handleComplete}
              disabled={prayer.completed || isLoading}
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
          </div>
        </div>

        {/* الزوايا الديكورية */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/30" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/30" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-white/30" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/30" />
      </div>
    </div>
  );
};
