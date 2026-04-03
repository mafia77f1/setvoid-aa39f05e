import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Zap, skull, Shield, TreasureChest, DoorOpen, Wind } from 'lucide-react';
import { DungeonHUD } from '@/components/dungeon/DungeonHUD';
import { DungeonSystemMessage } from '@/components/dungeon/DungeonSystemMessage';
import { DungeonEncounter } from '@/components/dungeon/DungeonEncounter';
import { DungeonClearedScreen } from '@/components/dungeon/DungeonClearedScreen';

// --- Types ---
interface PathOption {
  id: string;
  type: 'monster' | 'treasure' | 'trap' | 'rest' | 'boss';
  title: string;
  description: string;
  color: string;
  icon: JSX.Element;
}

const RANK_THEMES: Record<string, any> = {
  E: { primary: '#6b7280', glow: 'rgba(107,114,128,0.2)' },
  D: { primary: '#22c55e', glow: 'rgba(34,197,94,0.2)' },
  C: { primary: '#3b82f6', glow: 'rgba(59,130,246,0.2)' },
  B: { primary: '#a855f7', glow: 'rgba(168,85,247,0.2)' },
  A: { primary: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
  S: { primary: '#ef4444', glow: 'rgba(239,68,68,0.3)' },
};

const Dungeon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rank = (searchParams.get('rank') || 'E').toUpperCase();
  const theme = RANK_THEMES[rank] || RANK_THEMES['E'];

  // --- States ---
  const [entering, setEntering] = useState(true);
  const [floor, setFloor] = useState(1);
  const [maxFloors] = useState(10); // الطابق العاشر هو البوس
  const [paths, setPaths] = useState<PathOption[]>([]);
  const [stats, setStats] = useState({ hp: 100, maxHp: 100, stamina: 15, maxStamina: 20, gold: 0, xp: 0 });
  const [encounter, setEncounter] = useState<PathOption | null>(null);
  const [systemMessages, setSystemMessages] = useState<any[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cleared, setCleared] = useState(false);

  // --- Helpers ---
  const generatePaths = useCallback((currentFloor: number): PathOption[] => {
    if (currentFloor === maxFloors) {
      return [{
        id: 'boss-room',
        type: 'boss',
        title: 'عرين سيد المغارة',
        description: 'طاقة مرعبة تخرج من هذا الباب.. لا مجال للتراجع',
        color: '#ef4444',
        icon: <Skull className="w-8 h-8" />
      }];
    }

    const types: PathOption['type'][] = ['monster', 'treasure', 'trap', 'rest'];
    return [1, 2, 3].map((i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const config = {
        monster: { title: 'نفق مظلم', desc: 'تسمع أصوات سلاسل وحوش', color: '#ff4444', icon: <Zap /> },
        treasure: { title: 'نفق مضيء', desc: 'بريق الذهب يلمع في الداخل', color: '#fbbf24', icon: <TreasureChest /> },
        trap: { title: 'نفق ضيق', desc: 'رياح غريبة تهب من الداخل', color: '#6b7280', icon: <Wind /> },
        rest: { title: 'نفق هادئ', desc: 'تشعر بنسيم بارد ومريح', color: '#3b82f6', icon: <Shield /> },
      }[type];

      return {
        id: `path-${currentFloor}-${i}`,
        type,
        title: config.title,
        description: config.desc,
        color: config.color,
        icon: config.icon
      };
    });
  }, [maxFloors]);

  // --- Initial Load ---
  useEffect(() => {
    setPaths(generatePaths(1));
    setTimeout(() => setEntering(false), 2500);
  }, [generatePaths]);

  // --- Logic ---
  const handlePathSelection = (path: PathOption) => {
    if (stats.stamina <= 0) return;

    setIsTransitioning(true);
    
    // محاكاة "الدخول" للنفق
    setTimeout(() => {
      setStats(prev => ({ ...prev, stamina: prev.stamina - 1 }));
      
      if (path.type === 'trap') {
        setStats(prev => ({ ...prev, hp: Math.max(0, prev.hp - 15) }));
        addSystemMessage("وقعت في فخ مفاجئ!", "danger");
        nextFloor();
      } else if (path.type === 'rest') {
        setStats(prev => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 20) }));
        addSystemMessage("استرحت قليلاً واستعدت بعض طاقتك", "success");
        nextFloor();
      } else {
        setEncounter(path);
      }
      setIsTransitioning(false);
    }, 800);
  };

  const nextFloor = () => {
    if (floor >= maxFloors) {
      setCleared(true);
      return;
    }
    setFloor(prev => prev + 1);
    setPaths(generatePaths(floor + 1));
  };

  const addSystemMessage = (text: string, type: any) => {
    const msg = { id: Date.now(), text, type };
    setSystemMessages(prev => [msg, ...prev].slice(0, 3));
  };

  return (
    <div className="fixed inset-0 bg-[#050508] text-slate-100 overflow-hidden font-sans select-none" dir="rtl">
      
      {/* الخلفية الديناميكية */}
      <div className="absolute inset-0 opacity-30 transition-colors duration-1000" 
           style={{ background: `radial-gradient(circle at center, ${theme.glow} 0%, transparent 80%)` }} />

      {/* HUD */}
      {!entering && (
        <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
          <DungeonHUD 
            hp={stats.hp} maxHp={stats.maxHp}
            stamina={stats.stamina} maxStamina={stats.maxStamina}
            mana={50} maxMana={50}
            gold={stats.gold} rank={rank} themeColor={theme.primary}
          />
          <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="text-xs text-gray-400">الطابق</span>
            <span className="mr-2 font-bold text-lg">{floor}/{maxFloors}</span>
          </div>
        </div>
      )}

      {/* منطقة اختيار الأنفاق */}
      {!entering && !encounter && !cleared && (
        <div className="h-full flex flex-col items-center justify-center p-6 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-black mb-2 tracking-tight">اختر مسارك</h2>
            <p className="text-gray-400 text-sm">كل خيار سيحدد مصيرك داخل المغارة</p>
          </motion.div>

          <div className="w-full max-w-md space-y-4">
            {paths.map((path, idx) => (
              <motion.button
                key={path.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePathSelection(path)}
                disabled={isTransitioning}
                className="relative w-full group overflow-hidden"
              >
                <div className="relative z-10 flex items-center p-5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-sm group-hover:border-white/30 transition-all">
                  <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: `${path.color}20`, color: path.color }}>
                    {path.icon}
                  </div>
                  <div className="text-right flex-1 mr-4">
                    <h3 className="font-bold text-lg" style={{ color: path.color }}>{path.title}</h3>
                    <p className="text-xs text-gray-400">{path.description}</p>
                  </div>
                  <DoorOpen className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
                
                {/* تأثير الحركة عند الانتقال */}
                <AnimatePresence>
                  {isTransitioning && (
                    <motion.div 
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ scale: 20, opacity: 1 }}
                      className="absolute inset-0 z-0 pointer-events-none"
                      style={{ backgroundColor: path.color }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* شاشة الدخول السينمائية */}
      <AnimatePresence>
        {entering && (
          <motion.div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center space-y-6" exit={{ opacity: 0 }}>
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-black italic tracking-tighter"
              style={{ color: theme.primary, textShadow: `0 0 30px ${theme.glow}` }}
            >
              {rank}-RANK GATE
            </motion.h1>
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
               <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity }} className="w-full h-full bg-blue-500" />
            </div>
          </motion.h1>
        )}
      </AnimatePresence>

      {/* التعامل مع المواجهات (وحوش/كنوز) */}
      <AnimatePresence>
        {encounter && (
          <DungeonEncounter 
            room={encounter} 
            themeColor={theme.primary}
            onDefeatMonster={() => {
              setStats(p => ({ ...p, xp: p.xp + 50, gold: p.gold + 100 }));
              setEncounter(null);
              nextFloor();
            }}
            onDismiss={() => {
              setEncounter(null);
              nextFloor();
            }}
          />
        )}
      </AnimatePresence>

      <DungeonSystemMessage messages={systemMessages} />
      {cleared && <DungeonClearedScreen stats={stats} onExit={() => navigate('/home')} />}
    </div>
  );
};

export default Dungeon;
