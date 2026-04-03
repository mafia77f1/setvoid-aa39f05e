import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, TreasureChest, Coffee, ChevronLeft, ShieldAlert, Sparkles, LogIn, LogOut } from 'lucide-react';

const DungeonAdventure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rank = (searchParams.get('rank') || 'E').toUpperCase();

  // --- حالات اللعبة ---
  const [gameState, setGameState] = useState<'entrance' | 'exploring' | 'pathing' | 'event'>('entrance');
  const [depth, setDepth] = useState(1);
  const [hp, setHp] = useState(100);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  // توليد المسارات
  const paths = [
    { id: 'p1', type: 'monster', label: 'ممر الوحوش', icon: <Skull className="text-red-500" />, risk: 'عالي' },
    { id: 'p2', type: 'treasure', label: 'غرفة الغنائم', icon: <TreasureChest className="text-yellow-500" />, risk: 'متوسط' },
    { id: 'p3', type: 'rest', label: 'منطقة استراحة', icon: <Coffee className="text-green-500" />, risk: 'آمن' },
  ];

  const handlePathSelect = () => {
    setGameState('pathing');
    setTimeout(() => {
      setDepth(prev => prev + 1);
      setGameState('exploring');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden font-sans" dir="rtl">
      
      {/* 1. شاشة البداية (The Entrance Screen) */}
      <AnimatePresence>
        {gameState === 'entrance' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-[100] flex items-center justify-center p-6"
          >
            {/* خلفية النفق من الـ Public */}
            <div 
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: "url('/خلفية النفق.png')" }}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            {/* إشعار النظام - System Notification */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative z-10 w-full max-w-sm bg-[#0a0a0f]/90 border-2 border-blue-500/40 rounded-2xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.3)] text-center"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-1 rounded text-[10px] font-black tracking-widest border border-blue-400">
                إشعار النظام
              </div>
              
              <h2 className="text-xl font-bold mb-4 mt-2">لقد عثرت على بوابة [رتبة {rank}]</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                هل ترغب في دخول المغارة؟ <br/> 
                <span className="text-red-500/80">تحذير: بمجرد الدخول قد لا تستطيع التراجع.</span>
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setGameState('exploring')}
                  className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/40"
                >
                  <LogIn size={18} /> دخول
                </button>
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold transition-all active:scale-95"
                >
                  <LogOut size={18} /> انسحاب
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. واجهة المغارة الرئيسية (تظهر بعد الدخول) */}
      <div className="relative z-10 h-full flex flex-col">
        {/* HUD العلوي */}
        <div className="p-6 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-blue-500 text-[10px] font-mono tracking-widest">FLOOR: {depth}</h2>
            <div className="w-24 h-1 bg-red-900/30 rounded-full overflow-hidden border border-red-500/20">
               <motion.div className="h-full bg-red-500 shadow-[0_0_10px_red]" animate={{ width: `${hp}%` }} />
            </div>
          </div>
          <button onClick={() => navigate(-1)} className="p-2 border border-white/5 rounded-full"><ShieldAlert size={18} className="text-gray-500" /></button>
        </div>

        {/* محتوى المغارة */}
        <main className="flex-1 flex items-center justify-center p-6">
          <AnimatePresence mode="wait">
            {gameState === 'pathing' ? (
              <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                <div className="w-1 h-32 bg-gradient-to-b from-blue-600 to-transparent animate-pulse" />
                <p className="mt-4 text-xs font-mono text-blue-400 animate-pulse tracking-[0.4em]">تخطي جدار المانا...</p>
              </motion.div>
            ) : (
              <motion.div key="s" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-4">
                <h3 className="text-center text-xs text-gray-500 mb-6 italic">"أي الأقدار ستختار؟"</h3>
                {paths.map((path) => (
                  <button
                    key={path.id}
                    onClick={handlePathSelect}
                    className="w-full group p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-blue-500/40 hover:bg-blue-500/5 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/50 rounded-xl group-hover:scale-110 transition-transform">{path.icon}</div>
                      <div className="text-right leading-none">
                        <span className="text-lg font-bold block">{path.label}</span>
                        <span className="text-[9px] text-gray-500 uppercase tracking-tighter">مستوى الخطر: {path.risk}</span>
                      </div>
                    </div>
                    <ChevronLeft className="opacity-20 group-hover:opacity-100 group-hover:-translate-x-2 transition-all" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* خلفية ثابتة خفيفة للداخل */}
      <div className="absolute inset-0 z-0 bg-[#050508]" />
    </div>
  );
};

export default DungeonAdventure;
