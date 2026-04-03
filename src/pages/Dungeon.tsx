import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, TreasureChest, Coffee, Eye, ChevronRight } from 'lucide-react';

const DungeonAdventure = () => {
  const [depth, setDepth] = useState(1); // العمق داخل المغارة
  const [hp, setHp] = useState(100);
  const [mana, setMana] = useState(50);
  const [isPathing, setIsPathing] = useState(false);

  // توليد خيارات الأنفاق عشوائياً
  const generatePaths = () => [
    { id: 1, type: 'monster', label: 'نفق الدماء', icon: <Skull />, risk: 'عالي' },
    { id: 2, type: 'treasure', label: 'ممر الذهب', icon: <TreasureChest />, risk: 'متوسط' },
    { id: 3, type: 'rest', label: 'ملاذ آمن', icon: <Coffee />, risk: 'منخفض' },
  ];

  const [currentPaths, setCurrentPaths] = useState(generatePaths());

  const handleChoice = (path) => {
    setIsPathing(true);
    
    // محاكاة الركض داخل النفق
    setTimeout(() => {
      setDepth(prev => prev + 1);
      setCurrentPaths(generatePaths());
      setIsPathing(false);
      // هنا تضع منطق الأحداث (قتال، كنز، إلخ)
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#050508] text-white flex flex-col font-sans overflow-hidden">
      
      {/* HUD العلوي - يشبه نظام سولو ليفلينج */}
      <div className="p-6 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
        <div>
          <h2 className="text-blue-500 text-xs font-mono tracking-widest">FLOOR: {depth}</h2>
          <div className="flex gap-2 mt-1">
             <div className="h-1 w-20 bg-red-900/30 rounded-full overflow-hidden border border-red-500/20">
                <div className="h-full bg-red-500" style={{ width: `${hp}%` }} />
             </div>
             <div className="h-1 w-20 bg-blue-900/30 rounded-full overflow-hidden border border-blue-500/20">
                <div className="h-full bg-blue-500" style={{ width: `${mana}%` }} />
             </div>
          </div>
        </div>
        <button className="p-2 border border-blue-500/30 rounded-full bg-blue-500/5 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          <Eye size={18} className="text-blue-400" />
        </button>
      </div>

      {/* ساحة المغارة */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {!isPathing ? (
            <motion.div 
              key="paths"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="grid grid-cols-1 gap-4 w-full max-w-md"
            >
              <p className="text-center text-gray-500 text-sm mb-4 italic">"اختر مسارك بحذر.. الظلال لا ترحم"</p>
              
              {currentPaths.map((path) => (
                <motion.button
                  key={path.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(path)}
                  className="group relative h-28 rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-r from-white/5 to-transparent p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 group-hover:border-blue-500/50 transition-colors">
                      {path.icon}
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-lg">{path.label}</h3>
                      <span className="text-[10px] text-gray-400 uppercase tracking-tighter">الخطر: {path.risk}</span>
                    </div>
                  </div>
                  <ChevronRight className="opacity-20 group-hover:opacity-100 group-hover:translate-x-[-5px] transition-all" />
                  
                  {/* تأثير التوهج عند الوقوف عليه */}
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="pathing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-1 h-32 bg-gradient-to-b from-blue-500 to-transparent animate-pulse rounded-full" />
              <p className="mt-4 text-xs font-mono text-blue-400 animate-pulse tracking-[0.5em]">تقدم نحو العمق...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* خلفية جمالية (أجواء المغارة) */}
      <div className="absolute inset-0 pointer-events-none z-[-1] opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/cave-texture.png')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]" />
      </div>
    </div>
  );
};

export default DungeonAdventure;
