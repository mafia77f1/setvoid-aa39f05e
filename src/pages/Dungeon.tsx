import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, Map, DoorOpen, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { ManaStoneAnimation } from '@/components/dungeon/ManaStoneAnimation';
import { DungeonEncounter } from '@/components/dungeon/DungeonEncounter';
import { DungeonClearedScreen } from '@/components/dungeon/DungeonClearedScreen';
import { DungeonMinimap } from '@/components/dungeon/DungeonMinimap';
import { DungeonHUD } from '@/components/dungeon/DungeonHUD';
import { DungeonSystemMessage } from '@/components/dungeon/DungeonSystemMessage';
import { StaminaModal } from '@/components/dungeon/DungeonEncounter';
import { generateDungeon, countRoomTypes, STAMINA_TASKS } from '@/components/dungeon/dungeonGenerator';
import { DungeonRoom, Position, SystemMessage, StaminaTask } from '@/components/dungeon/DungeonTypes';

const GRID_SIZE = 8;

const RANK_THEMES: Record<string, { primary: string; secondary: string; shadow: string }> = {
  E: { primary: '#6b7280', secondary: '#4b5563', shadow: 'rgba(107,114,128,0.2)' },
  D: { primary: '#22c55e', secondary: '#16a34a', shadow: 'rgba(34,197,94,0.2)' },
  C: { primary: '#3b82f6', secondary: '#2563eb', shadow: 'rgba(59,130,246,0.2)' },
  B: { primary: '#a855f7', secondary: '#9333ea', shadow: 'rgba(168,85,247,0.2)' },
  A: { primary: '#f59e0b', secondary: '#d97706', shadow: 'rgba(245,158,11,0.2)' },
  S: { primary: '#ef4444', secondary: '#dc2626', shadow: 'rgba(239,68,68,0.2)' },
};

type DungeonPhase = 'entrance' | 'entering' | 'grotto' | 'event' | 'cleared';
type EventType = 'treasure' | 'monster' | 'boss' | null;

const TYPEWRITER_MESSAGES = [
  'بعد السير، لاحظنا شيئاً مميزاً داخل المغارة، لنكتشف بعدها...',
  'الظلام يزداد... أصوات غريبة تنبعث من الأعماق...',
  'الأرض تهتز قليلاً... شيء ما ينتظرنا في نهاية الممر...',
  'رائحة قديمة تملأ المكان... كأن أحداً مرّ من هنا مؤخراً...',
];

const Dungeon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { gameState, consumeItem } = useGameState();
  const rank = (searchParams.get('rank') || 'E').toUpperCase();
  const theme = RANK_THEMES[rank] || RANK_THEMES['E'];

  const [phase, setPhase] = useState<DungeonPhase>('entrance');
  const [currentEvent, setCurrentEvent] = useState<EventType>(null);
  const [encounter, setEncounter] = useState<DungeonRoom | null>(null);

  // Dungeon grid state (kept for minimap & tracking)
  const [grid, setGrid] = useState<DungeonRoom[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: GRID_SIZE - 1 });
  const [hp, setHp] = useState(100);
  const [maxHp] = useState(100);
  const [stamina, setStamina] = useState(15);
  const [maxStamina] = useState(20);
  const [mana, setMana] = useState(50);
  const [maxMana] = useState(50);
  const [gold, setGold] = useState(0);
  const [xp, setXp] = useState(0);
  const [monstersDefeated, setMonstersDefeated] = useState(0);
  const [treasuresFound, setTreasuresFound] = useState(0);
  const [roomsExplored, setRoomsExplored] = useState(1);
  const [staminaTasks, setStaminaTasks] = useState<StaminaTask[]>([...STAMINA_TASKS]);
  const [showStaminaModal, setShowStaminaModal] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showExitAnimation, setShowExitAnimation] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const msgCounter = useRef(0);

  // Typewriter state
  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typewriterDone, setTypewriterDone] = useState(false);

  // Steps tracking
  const [totalSteps, setTotalSteps] = useState(0);

  const hasExitStone = (gameState.inventory || []).some(i => i.id === 'gate_exit_stone' && i.quantity > 0);

  useEffect(() => {
    setGrid(generateDungeon(rank));
  }, [rank]);

  const { monsters: totalMonsters, treasures: totalTreasures, totalRooms } = grid.length > 0 ? countRoomTypes(grid) : { monsters: 0, treasures: 0, totalRooms: 0 };

  const addSystemMessage = useCallback((text: string, type: SystemMessage['type']) => {
    msgCounter.current++;
    const msg: SystemMessage = { id: `msg-${msgCounter.current}`, text, type, timestamp: Date.now() };
    setSystemMessages(prev => [...prev, msg]);
    setTimeout(() => setSystemMessages(prev => prev.filter(m => m.id !== msg.id)), 4000);
  }, []);

  // Typewriter effect
  const startTypewriter = useCallback((text: string, onDone?: () => void) => {
    setTypewriterText('');
    setIsTyping(true);
    setTypewriterDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypewriterText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTypewriterDone(true);
        onDone?.();
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleStartDungeon = () => {
    setPhase('entering');
    setTimeout(() => {
      setPhase('grotto');
      addSystemMessage('تم دخول البوابة بنجاح', 'success');
    }, 2500);
  };

  const handleExitWithStone = () => {
    if (!hasExitStone) return;
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    consumeItem('gate_exit_stone', 1);
    setShowExitConfirm(false);
    setShowExitAnimation(true);
  };

  const handleExitAnimationComplete = () => {
    setShowExitAnimation(false);
    navigate(-1);
  };

  // Pick a random event when choosing a path
  const handleChoosePath = (pathLabel: string) => {
    if (stamina <= 0) {
      setShowStaminaModal(true);
      return;
    }
    setStamina(prev => Math.max(0, prev - 1));
    setTotalSteps(prev => prev + 1);

    // Pick a random message
    const msg = TYPEWRITER_MESSAGES[Math.floor(Math.random() * TYPEWRITER_MESSAGES.length)];
    
    // Show typewriter, then show event
    setPhase('event');
    startTypewriter(msg, () => {
      // After typewriter, decide event
      setTimeout(() => {
        const roll = Math.random();
        if (roll < 0.25) {
          triggerTreasure();
        } else if (roll < 0.65) {
          triggerMonster();
        } else if (roll < 0.80 && totalSteps >= 3) {
          triggerBoss();
        } else {
          triggerMonster();
        }
      }, 800);
    });
  };

  const triggerTreasure = () => {
    setCurrentEvent('treasure');
    // Find an uncollected treasure room
    const treasureRooms = grid.flat().filter(r => r.type === 'treasure' && !r.cleared);
    if (treasureRooms.length > 0) {
      setEncounter(treasureRooms[0]);
    } else {
      // Fallback: give gold directly
      const goldAmount = Math.floor(Math.random() * 30) + 10;
      setGold(prev => prev + goldAmount);
      setTreasuresFound(prev => prev + 1);
      addSystemMessage(`لقد عثرت على كنز مفقود! +${goldAmount} ذهب`, 'success');
      setTimeout(() => { setPhase('grotto'); setCurrentEvent(null); }, 2000);
    }
  };

  const triggerMonster = () => {
    setCurrentEvent('monster');
    const monsterRooms = grid.flat().filter(r => r.type === 'monster' && !r.cleared);
    if (monsterRooms.length > 0) {
      setEncounter(monsterRooms[0]);
    } else {
      addSystemMessage('الممر آمن... لا وحوش هنا', 'info');
      setTimeout(() => { setPhase('grotto'); setCurrentEvent(null); }, 1500);
    }
  };

  const triggerBoss = () => {
    setCurrentEvent('boss');
    const bossRoom = grid.flat().find(r => r.type === 'boss' && !r.cleared);
    if (bossRoom) {
      setEncounter(bossRoom);
    } else {
      setCleared(true);
      setPhase('cleared');
    }
  };

  const handleDefeatMonster = useCallback(() => {
    if (!encounter) return;
    setGrid(prev => {
      const ng = prev.map(row => row.map(r => ({ ...r })));
      ng[encounter.y][encounter.x].cleared = true;
      return ng;
    });
    setGold(prev => prev + (encounter.monster?.goldReward || 0));
    setXp(prev => prev + (encounter.monster?.xpReward || 0));
    setMonstersDefeated(prev => prev + 1);
    setRoomsExplored(prev => prev + 1);
    
    if (encounter.type === 'boss') {
      // Navigate to battle page for boss
      navigate('/battle');
      return;
    }
    
    setEncounter(null);
    setCurrentEvent(null);
    setPhase('grotto');
    addSystemMessage('تم هزيمة الوحش!', 'success');
  }, [encounter, navigate, addSystemMessage]);

  const handleCollectTreasure = useCallback(() => {
    if (!encounter || !encounter.treasure) return;
    setGrid(prev => {
      const ng = prev.map(row => row.map(r => ({ ...r })));
      ng[encounter.y][encounter.x].cleared = true;
      return ng;
    });
    setGold(prev => prev + (encounter.treasure?.amount || 0));
    setTreasuresFound(prev => prev + 1);
    setRoomsExplored(prev => prev + 1);
    setEncounter(null);
    setCurrentEvent(null);
    setPhase('grotto');
    addSystemMessage(`تم جمع الكنز! +${encounter.treasure?.amount} ذهب`, 'success');
  }, [encounter, addSystemMessage]);

  const handleDismissEncounter = () => {
    setEncounter(null);
    setCurrentEvent(null);
    setPhase('grotto');
  };

  const handleStaminaTask = (taskId: string) => {
    const task = staminaTasks.find(t => t.id === taskId);
    if (task) {
      setStamina(prev => Math.min(maxStamina, prev + task.staminaReward));
      setStaminaTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020205] text-white overflow-hidden select-none flex flex-col font-sans" dir="rtl">
      
      <ManaStoneAnimation show={showExitAnimation} onComplete={handleExitAnimationComplete} />
      <DungeonSystemMessage messages={systemMessages} />

      {/* ═══ ENTRANCE SCREEN ═══ */}
      <AnimatePresence>
        {phase === 'entrance' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/tunnel.png')" }}>
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <motion.div
              initial={{ scale: 0.9, y: 60 }} animate={{ scale: 1, y: 40 }}
              className="relative z-10 w-[85%] max-w-sm bg-[#0a0a0f]/90 border-2 border-blue-500/40 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(59,130,246,0.3)]"
            >
              <div className="bg-blue-600 w-fit mx-auto px-4 py-1 rounded-full text-[10px] font-black mb-4 border border-blue-400">إشعار النظام</div>
              <h2 className="text-xl font-bold mb-2">لقد رصدت بوابة [رتبة {rank}]</h2>
              <p className="text-gray-400 text-xs mb-8">هل ترغب في استكشاف هذا النفق؟ الأخطار مجهولة بالداخل.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleStartDungeon} className="flex items-center justify-center gap-2 py-3 bg-blue-600 rounded-xl font-bold active:scale-95 transition-transform">
                  <LogIn size={18} /> دخول
                </button>
                <button onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl font-bold active:scale-95 transition-transform">
                  <LogOut size={18} /> انسحاب
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ LOADING ═══ */}
      <AnimatePresence>
        {phase === 'entering' && (
          <motion.div className="absolute inset-0 z-[100] bg-black flex items-center justify-center flex-col" exit={{ opacity: 0 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-24 h-24 rounded-full border-b-2 border-t-2 mb-8" style={{ borderColor: theme.primary }} />
            <h1 className="text-2xl font-black tracking-widest" style={{ color: theme.primary }}>جاري فتح البوابة...</h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ GROTTO MAIN VIEW ═══ */}
      {(phase === 'grotto' || phase === 'event') && (
        <>
          {/* Background: InnerGrotto.png */}
          <div className="absolute inset-0">
            <img src="/InnerGrotto.png" alt="المغارة" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />
            {/* Atmospheric particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
                  style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                  animate={{ y: [-20, 20], opacity: [0, 0.6, 0] }}
                  transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
                />
              ))}
            </div>
          </div>

          {/* HUD */}
          <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
            <div className="pointer-events-auto">
              <DungeonHUD
                hp={hp} maxHp={maxHp} stamina={stamina} maxStamina={maxStamina}
                mana={mana} maxMana={maxMana} gold={gold}
                monstersDefeated={monstersDefeated} totalMonsters={totalMonsters}
                roomsExplored={roomsExplored} totalRooms={totalRooms} themeColor={theme.primary} rank={rank}
              />
            </div>
            <div className="flex flex-col gap-2 pointer-events-auto">
              <button onClick={() => setShowMap(!showMap)} className="p-3 bg-black/60 rounded-full border border-white/10 backdrop-blur-sm">
                <Map className="w-5 h-5 text-blue-400" />
              </button>
              {hasExitStone && (
                <button onClick={handleExitWithStone} className="p-3 bg-black/60 rounded-full border border-emerald-500/30 hover:border-emerald-400/50 transition-colors backdrop-blur-sm">
                  <DoorOpen className="w-5 h-5 text-emerald-400" />
                </button>
              )}
            </div>
          </div>

          {/* ═══ THREE GATES ═══ */}
          {phase === 'grotto' && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-12 px-4">
              {/* Stamina warning */}
              {stamina <= 3 && stamina > 0 && (
                <p className="text-[10px] text-yellow-500 animate-pulse font-mono mb-3">
                  ⚠ الطاقة منخفضة ({stamina}/{maxStamina})
                </p>
              )}

              <p className="text-[10px] text-cyan-400/60 tracking-[0.4em] mb-4 font-mono uppercase">اختر طريقك</p>

              <div className="flex items-end justify-center gap-3 w-full max-w-sm">
                {/* Left Gate */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoosePath('left')}
                  className="flex-1 relative h-32 rounded-xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-400/60 transition-all group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <ChevronLeft className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-purple-300">بوابة اليسار</span>
                    <span className="text-[8px] text-purple-400/60 font-mono">-1 طاقة</span>
                  </div>
                </motion.button>

                {/* Center Gate */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoosePath('center')}
                  className="flex-1 relative h-40 rounded-xl overflow-hidden border-2 border-cyan-500/40 hover:border-cyan-400/70 transition-all group shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 via-cyan-900/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <ArrowUp className="w-10 h-10 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-cyan-300">بوابة المنتصف</span>
                    <span className="text-[8px] text-cyan-400/60 font-mono">-1 طاقة</span>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                </motion.button>

                {/* Right Gate */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoosePath('right')}
                  className="flex-1 relative h-32 rounded-xl overflow-hidden border-2 border-amber-500/30 hover:border-amber-400/60 transition-all group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-amber-900/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <ChevronRight className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-amber-300">بوابة اليمين</span>
                    <span className="text-[8px] text-amber-400/60 font-mono">-1 طاقة</span>
                  </div>
                </motion.button>
              </div>
            </div>
          )}

          {/* ═══ TYPEWRITER EVENT ═══ */}
          {phase === 'event' && !encounter && (
            <div className="absolute inset-0 z-40 flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.1)]"
              >
                <div className="text-[9px] font-mono tracking-[0.4em] uppercase text-cyan-400/60 mb-3 text-center">SYSTEM MESSAGE</div>
                <p className="text-sm text-slate-300 leading-relaxed text-center min-h-[3rem]" dir="rtl">
                  {typewriterText}
                  {isTyping && <span className="inline-block w-0.5 h-4 bg-cyan-400 animate-pulse mr-1" />}
                </p>
                {isTyping && (
                  <div className="flex justify-center mt-4">
                    <motion.div
                      className="flex gap-1"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      ))}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </>
      )}

      {/* ═══ MINIMAP ═══ */}
      <AnimatePresence>
        {showMap && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute top-20 right-4 z-[60] bg-black/90 p-2 rounded-2xl border border-white/10">
            <DungeonMinimap grid={grid} playerPos={playerPos} themeColor={theme.primary} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ EXIT CONFIRMATION ═══ */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-[#0a0a15]/95 border-2 border-emerald-500/40 rounded-2xl p-6 text-center"
            >
              <img src="/ManaStoneElement.png" alt="حجر الخروج" className="w-16 h-16 mx-auto mb-4 object-contain" />
              <h3 className="text-lg font-bold text-emerald-400 mb-2">استخدام حجر الخروج؟</h3>
              <p className="text-xs text-slate-400 mb-6">سيتم استخدام حجر الخروج من البوابة للمغادرة فوراً</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={confirmExit} className="py-3 bg-emerald-600 rounded-xl font-bold text-sm active:scale-95 transition-transform">
                  تأكيد الخروج
                </button>
                <button onClick={() => setShowExitConfirm(false)} className="py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm active:scale-95 transition-transform">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ ENCOUNTER MODALS ═══ */}
      <AnimatePresence>
        {encounter && (
          <DungeonEncounter
            room={encounter}
            onDefeatMonster={handleDefeatMonster}
            onCollectTreasure={handleCollectTreasure}
            onDismiss={handleDismissEncounter}
            themeColor={theme.primary}
          />
        )}
        {showStaminaModal && (
          <StaminaModal open={showStaminaModal} tasks={staminaTasks} onComplete={handleStaminaTask} onClose={() => setShowStaminaModal(false)} themeColor={theme.primary} />
        )}
        {cleared && (
          <DungeonClearedScreen rank={rank} gold={gold} xp={xp} monstersDefeated={monstersDefeated} treasuresFound={treasuresFound} roomsExplored={roomsExplored} themeColor={theme.primary} onExit={() => navigate(-1)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dungeon;
