import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, DoorOpen, ChevronLeft, ChevronRight, ArrowUp, Skull, TreasureChest } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { ManaStoneAnimation } from '@/components/dungeon/ManaStoneAnimation';
import { DungeonEncounter } from '@/components/dungeon/DungeonEncounter';
import { DungeonClearedScreen } from '@/components/dungeon/DungeonClearedScreen';
import { DungeonSystemMessage } from '@/components/dungeon/DungeonSystemMessage';
import { generateDungeon, countRoomTypes } from '@/components/dungeon/dungeonGenerator';
import { DungeonRoom, Position, SystemMessage } from '@/components/dungeon/DungeonTypes';

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

  const [grid, setGrid] = useState<DungeonRoom[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: GRID_SIZE - 1 });
  const [stamina, setStamina] = useState(15);
  const [gold, setGold] = useState(0);
  const [xp, setXp] = useState(0);
  const [monstersDefeated, setMonstersDefeated] = useState(0);
  const [treasuresFound, setTreasuresFound] = useState(0);
  const [roomsExplored, setRoomsExplored] = useState(1);
  const [cleared, setCleared] = useState(false);
  const [showExitAnimation, setShowExitAnimation] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const msgCounter = useRef(0);

  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [totalSteps, setTotalSteps] = useState(0);

  const hasExitStone = (gameState.inventory || []).some(i => i.id === 'gate_exit_stone' && i.quantity > 0);

  useEffect(() => {
    setGrid(generateDungeon(rank));
  }, [rank]);

  const { monsters: totalMonsters, treasures: totalTreasures } = grid.length > 0 ? countRoomTypes(grid) : { monsters: 0, treasures: 0 };

  const addSystemMessage = useCallback((text: string, type: SystemMessage['type']) => {
    msgCounter.current++;
    const msg: SystemMessage = { id: `msg-${msgCounter.current}`, text, type, timestamp: Date.now() };
    setSystemMessages(prev => [...prev, msg]);
    setTimeout(() => setSystemMessages(prev => prev.filter(m => m.id !== msg.id)), 4000);
  }, []);

  const startTypewriter = useCallback((text: string, onDone?: () => void) => {
    setTypewriterText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypewriterText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
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

  const confirmExit = () => {
    consumeItem('gate_exit_stone', 1);
    setShowExitConfirm(false);
    setShowExitAnimation(true);
  };

  const handleExitAnimationComplete = () => {
    setShowExitAnimation(false);
    navigate(-1);
  };

  const handleChoosePath = (pathLabel: string) => {
    if (stamina <= 0) return;
    setStamina(prev => Math.max(0, prev - 1));
    setTotalSteps(prev => prev + 1);

    const msg = TYPEWRITER_MESSAGES[Math.floor(Math.random() * TYPEWRITER_MESSAGES.length)];
    
    setPhase('event');
    startTypewriter(msg, () => {
      setTimeout(() => {
        const roll = Math.random();
        if (roll < 0.25) triggerTreasure();
        else if (roll < 0.65) triggerMonster();
        else if (roll < 0.80 && totalSteps >= 3) triggerBoss();
        else triggerMonster();
      }, 800);
    });
  };

  const triggerTreasure = () => {
    setCurrentEvent('treasure');
    const treasureRooms = grid.flat().filter(r => r.type === 'treasure' && !r.cleared);
    if (treasureRooms.length > 0) setEncounter(treasureRooms[0]);
    else {
      const goldAmount = Math.floor(Math.random() * 30) + 10;
      setGold(prev => prev + goldAmount);
      setTreasuresFound(prev => prev + 1);
      addSystemMessage(`+${goldAmount} ذهب`, 'success');
      setTimeout(() => { setPhase('grotto'); setCurrentEvent(null); }, 1500);
    }
  };

  const triggerMonster = () => {
    setCurrentEvent('monster');
    const monsterRooms = grid.flat().filter(r => r.type === 'monster' && !r.cleared);
    if (monsterRooms.length > 0) setEncounter(monsterRooms[0]);
    else {
      addSystemMessage('الممر آمن', 'info');
      setTimeout(() => { setPhase('grotto'); setCurrentEvent(null); }, 1200);
    }
  };

  const triggerBoss = () => {
    setCurrentEvent('boss');
    const bossRoom = grid.flat().find(r => r.type === 'boss' && !r.cleared);
    if (bossRoom) setEncounter(bossRoom);
    else {
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
      navigate('/battle');
      return;
    }
    
    setEncounter(null);
    setCurrentEvent(null);
    setPhase('grotto');
    addSystemMessage('تمت تصفية العدو', 'success');
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
    addSystemMessage(`تم الحصول على الكنز`, 'success');
  }, [encounter, addSystemMessage]);

  return (
    <div className="fixed inset-0 bg-[#020205] text-white overflow-hidden select-none flex flex-col font-sans" dir="rtl">
      
      <ManaStoneAnimation show={showExitAnimation} onComplete={handleExitAnimationComplete} />
      <DungeonSystemMessage messages={systemMessages} />

      {/* ═══ ENTRANCE SCREEN ═══ */}
      <AnimatePresence>
        {phase === 'entrance' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[200] flex items-center justify-center">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/tunnel.png')" }} />
            <motion.div initial={{ scale: 0.9, y: 60 }} animate={{ scale: 1, y: 40 }} className="relative z-10 w-[85%] max-w-sm bg-[#0a0a0f]/80 border border-blue-500/40 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <div className="bg-blue-600 w-fit mx-auto px-3 py-0.5 rounded text-[8px] font-black mb-3 border border-blue-400 uppercase">System Notification</div>
              <h2 className="text-lg font-bold mb-1 tracking-tight">رصد بوابة: رتبة {rank}</h2>
              <p className="text-gray-400 text-[10px] mb-6">هل أنت مستعد لمواجهة ما يقبع في الداخل؟</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleStartDungeon} className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 rounded-lg text-xs font-bold active:scale-95 transition-transform"><LogIn size={14} /> دخول</button>
                <button onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold active:scale-95 transition-transform"><LogOut size={14} /> انسحاب</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ LOADING ═══ */}
      <AnimatePresence>
        {phase === 'entering' && (
          <motion.div className="absolute inset-0 z-[100] bg-black flex items-center justify-center flex-col" exit={{ opacity: 0 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 rounded-full border-b-2 border-t-2 mb-4" style={{ borderColor: theme.primary }} />
            <h1 className="text-lg font-black tracking-widest uppercase" style={{ color: theme.primary }}>Initializing Gate...</h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ GROTTO MAIN VIEW ═══ */}
      {(phase === 'grotto' || phase === 'event') && (
        <>
          <div className="absolute inset-0">
            <img src="/InnerGrotto.png" alt="المغارة" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10" /> {/* تقليل التعتيم لزيادة الوضوح */}
          </div>

          {/* MINIMAL HUD: Only Stats */}
          <div className="absolute top-6 left-6 right-6 z-50 flex justify-between items-start pointer-events-none">
            <div className="flex gap-4 pointer-events-auto">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                    <Skull size={14} className="text-red-500" />
                    <span className="text-[10px] font-bold">{monstersDefeated}/{totalMonsters}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                    <TreasureChest size={14} className="text-yellow-500" />
                    <span className="text-[10px] font-bold">{treasuresFound}/{totalTreasures}</span>
                </div>
            </div>
            
            {hasExitStone && (
              <button onClick={() => setShowExitConfirm(true)} className="p-2.5 bg-black/40 rounded-lg border border-emerald-500/30 backdrop-blur-md pointer-events-auto">
                <DoorOpen className="w-4 h-4 text-emerald-400" />
              </button>
            )}
          </div>

          {/* ═══ GATES ═══ */}
          {phase === 'grotto' && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-10 px-4">
              <p className="text-[9px] text-cyan-400/80 tracking-[0.3em] mb-4 font-black uppercase">حدد المسار التالي</p>
              <div className="flex items-end justify-center gap-2 w-full max-w-xs">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleChoosePath('left')} className="flex-1 relative h-24 rounded-lg overflow-hidden border border-purple-500/30 bg-purple-900/20">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <ChevronLeft className="w-5 h-5 text-purple-400" />
                    <span className="text-[8px] font-bold">يسار</span>
                  </div>
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleChoosePath('center')} className="flex-1 relative h-32 rounded-lg overflow-hidden border border-cyan-500/50 bg-cyan-900/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <ArrowUp className="w-6 h-6 text-cyan-400" />
                    <span className="text-[9px] font-black">منتصف</span>
                  </div>
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleChoosePath('right')} className="flex-1 relative h-24 rounded-lg overflow-hidden border border-amber-500/30 bg-amber-900/20">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <ChevronRight className="w-5 h-5 text-amber-400" />
                    <span className="text-[8px] font-bold">يمين</span>
                  </div>
                </motion.button>
              </div>
            </div>
          )}

          {/* ═══ TYPEWRITER EVENT ═══ */}
          {phase === 'event' && !encounter && (
            <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/20">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xs bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-2xl">
                <div className="text-[7px] font-mono tracking-widest uppercase text-cyan-500/60 mb-2 text-center">System Log</div>
                <p className="text-[11px] text-slate-200 text-center leading-relaxed" dir="rtl">{typewriterText}</p>
              </motion.div>
            </div>
          )}
        </>
      )}

      {/* ═══ EXIT CONFIRMATION ═══ */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-xs bg-[#0a0a15] border border-emerald-500/40 rounded-xl p-5 text-center">
              <h3 className="text-sm font-bold text-emerald-400 mb-4 uppercase tracking-tighter">استخدام حجر العودة؟</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={confirmExit} className="py-2 bg-emerald-600 rounded-lg font-bold text-[10px]">تأكيد</button>
                <button onClick={() => setShowExitConfirm(false)} className="py-2 bg-white/5 rounded-lg font-bold text-[10px]">تراجع</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ ENCOUNTER ═══ */}
      <AnimatePresence>
        {encounter && (
          <DungeonEncounter
            room={encounter}
            onDefeatMonster={handleDefeatMonster}
            onCollectTreasure={handleCollectTreasure}
            onDismiss={() => { setEncounter(null); setCurrentEvent(null); setPhase('grotto'); }}
            themeColor={theme.primary}
          />
        )}
        {cleared && (
          <DungeonClearedScreen rank={rank} gold={gold} xp={xp} monstersDefeated={monstersDefeated} treasuresFound={treasuresFound} roomsExplored={roomsExplored} themeColor={theme.primary} onExit={() => navigate(-1)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dungeon;
