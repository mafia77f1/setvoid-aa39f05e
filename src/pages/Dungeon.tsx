import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, TreasureChest, Coffee, Eye, ChevronLeft, ShieldAlert, Sparkles } from 'lucide-react';

// --- الأنماط البصرية حسب الرتبة ---
const RANK_THEMES: Record<string, any> = {
  E: { primary: '#6b7280', glow: 'rgba(107,114,128,0.2)' },
  S: { primary: '#ef4444', glow: 'rgba(239,68,68,0.3)' },
  // يمكنك إضافة البقية هنا بنفس النمط
};

const DungeonAdventure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rank = (searchParams.get('rank') || 'E').toUpperCase();
  const theme = RANK_THEMES[rank] || RANK_THEMES['E'];

  // --- حالات اللعبة (States) ---
  const [depth, setDepth] = useState(1);
  const [hp, setHp] = useState(100);
  const [mana, setMana] = useState(50);
  const [isPathing, setIsPathing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  // --- وظيفة توليد المسارات العشوائية ---
  const generatePaths = () => [
    { id: 'p1', type: 'monster', label: 'ممر الوحوش', icon: <Skull className="text-red-500" />, risk: 'عالي', reward: 'XP ++' },
    { id: 'p2', type: 'treasure', label: 'غرفة الغنائم', icon: <TreasureChest className="text-yellow-500" />, risk: 'متوسط', reward: 'ذهب +' },
    { id: 'p3', type: 'rest', label: 'منطقة استشفاء', icon: <Coffee className="text-green-500" />, risk: 'آمن', reward: 'HP ++' },
  ];

  const [paths, setPaths] = useState(generatePaths());

  // --- منطق اختيار النفق ---
  const handlePathSelect = (path: any) => {
    setIsPathing(true);
    
    // محاكاة الركض داخل النفق (1.5 ثانية)
    setTimeout(() => {
      setIsPathing(false);
      setDepth(prev => prev + 1);
      
      // هنا نقرر ماذا يحدث داخل النفق
      if (path.type === 'monster') {
        setCurrentEvent({ title: "وحش من الرتبة الملعونة!", detail: "يجب عليك هزيمته للمتابعة", action: "قتال" });
      } else if (path.type === 'rest') {
        setHp(prev => Math.min(100, prev + 20));
        setCurrentEvent({ title: "نسمة مانا نقية", detail: "استعدت 20 من صحتك", action: "متابعة" });
      } else {
        setCurrentEvent({ title: "صندوق قديم", detail: "وجدت 50 قطعة ذهبية", action: "جمع" });
      }
      
      setPaths(generatePaths()); // تجهيز الأبواب القادمة
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#050508] text-white flex flex-col overflow-hidden font-sans" dir="rtl">
      
      {/* 1. HUD - واجهة النظام */}
      <div className="p-6 flex justify-between items-start z-50">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-mono">
              LEVEL: {depth}
            </span>
            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 font-mono text-uppercase">
              RANK: {rank}
            </span>
          </div>
          {/* بار الصحة */}
          <div className="w-32 h-1.5 bg-gray-900 rounded-full overflow-hidden border border-white/5">
            <motion.div className="h-full bg-red-600" animate={{ width: `${hp}%` }} />
          </div>
        </div>

        <button onClick={() => navigate(-1)} className="p-2 text-white/40 hover:text-white transition-colors">
          <ShieldAlert size={20} />
        </button>
      </div>

      {/* 2. ساحة الاستكشاف الرئيسية */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-6">
        
        <AnimatePresence mode="wait">
          {/* حالة الركض داخل النفق */}
          {isPathing ? (
            <motion.div 
              key="pathing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-[1px] h-40 bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-pulse" />
              <motion.p 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="mt-6 text-xs font-mono tracking-[0.5em] text-blue-400 uppercase"
              >
                جاري استكشاف العمق...
              </motion.p>
            </motion.div>
          ) 
          /* حالة مواجهة حدث (وحش/كنز) */
          : currentEvent ? (
            <motion.div 
              key="event"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <Sparkles className="text-blue-400" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black mb-2 tracking-tight">{currentEvent.title}</h2>
                <p className="text-gray-400 text-sm">{currentEvent.detail}</p>
              </div>
              <button 
                onClick={() => setCurrentEvent(null)}
                className="px-8 py-3 bg-blue-600 rounded-xl font-bold text-sm hover:bg-blue-500 active:scale-95 transition-all"
              >
                {currentEvent.action}
              </button>
            </motion.div>
          )
          /* حالة اختيار الأبواب */
          : (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm space-y-4"
            >
              <p className="text-center text-[10px] text-blue-500/60 font-bold tracking-[0.3em] mb-8">
                نظام الاستشعار رصد 3 مسارات محتملة
              </p>
              
              {paths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => handlePathSelect(path)}
                  className="w-full group relative p-5 rounded-2xl border border-white/5 bg-gradient-to-l from-white/[0.02] to-transparent hover:border-blue-500/40 hover:from-blue-500/10 transition-all duration-300 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform">
                      {path.icon}
                    </div>
                    <div className="text-right">
                      <h4 className="font-bold text-md group-hover:text-blue-400 transition-colors">{path.label}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[9px] text-gray-500 uppercase tracking-tighter">الخطر: {path.risk}</span>
                        <span className="text-[9px] text-blue-500/50 uppercase tracking-tighter">||</span>
                        <span className="text-[9px] text-yellow-500/70 uppercase tracking-tighter">{path.reward}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="text-gray-700 group-hover:text-blue-400 group-hover:-translate-x-2 transition-all" size={18} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 3. تأثيرات بصرية خلفية */}
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(15,15,25,1)_0%,_rgba(5,5,8,1)_100%)]" />
        {/* خطوط تقنية خفيفة */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
    </div>
  );
};

export default DungeonAdventure;
