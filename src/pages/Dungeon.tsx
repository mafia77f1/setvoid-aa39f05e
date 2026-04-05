import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, DoorOpen, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { ManaStoneAnimation } from '@/components/dungeon/ManaStoneAnimation';
import { DungeonEncounter } from '@/components/dungeon/DungeonEncounter';
import { DungeonClearedScreen } from '@/components/dungeon/DungeonClearedScreen';
import { DungeonHUD } from '@/components/dungeon/DungeonHUD';
import { DungeonSystemMessage } from '@/components/dungeon/DungeonSystemMessage';
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
  'هالة مرعبة تنبعث من العمق...',
  'الظلام يبتلع الضوء... الوحوش تقترب.',
  'الدمار هو الخيار الوحيد للنجاة...',
  'لقد وطأت قدماك منطقة الموت...',
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
  const [staminaTasks] = useState<StaminaTask[]>([...STAMINA_TASKS]);
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

  const { monsters: totalMonsters, treasures: totalTreasures, totalRooms } = grid.length > 0 ? countRoomTypes(grid) : { monsters: 0, treasures: 0, totalRooms: 0 };

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
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleStartDungeon = () => {
    setPhase('entering');
    setTimeout(() => {
      setPhase('grotto');
      addSystemMessage('تم دخول البوابة. استعد للقتال.', 'success');
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
      }, 1000);
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
      addSystemMessage(`عثرت على كنز! +${goldAmount} ذهب`, 'success');
      setTimeout(() => { setPhase('grotto'); setCurrentEvent(null); }, 1500);
    }
  };

  const triggerMonster = () => {
    setCurrentEvent('monster');
    const monsterRooms = grid.flat().filter(r => r.type === 'monster' && !r.cleared);
    if (monsterRooms.length > 0) setEncounter(monsterRooms[0]);
    else {
      addSystemMessage('الممر هادئ بشكل مريب...', 'info');
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
  }, [encounter, navigate]);

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
  }, [encounter]);

  const handleDismissEncounter = () => {
    setEncounter(null);
    setCurrentEvent(null);
    setPhase('grotto');
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
            <div className="absolute inset-0 bg-cover bg-center grayscale-[30%]" style={{ backgroundImage: "url('/tunnel.png')" }}>
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 w-[80%] max-w-xs bg-black/80 border-t-2 border-b-2 border-blue-500/60 p-6 text-center shadow-[0_0_60px_rgba(0,0,0,1)]"
            >
              <h2 className="text-lg font-black mb-1 tracking-tighter">بوابة الرتبة [{rank}]</h2>
              <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-6">مستوى الخطر: مرتفع</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleStartDungeon} className="py-2 bg-blue-900/40 border border-blue-500/50 text-blue-100 text-xs font-bold active:scale-95 transition-all">
                  دخول الزنزانة
                </button>
                <button onClick={() => navigate(-1)} className="py-2 bg-red-900/20 border border-red-900/50 text-red-500/70 text-[10px] font-bold active:scale-95 transition-all">
                  انسحاب
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
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="text-3xl font-black italic tracking-tighter" style={{ color: theme.primary }}>LOADING...</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ GROTTO MAIN VIEW ═══ */}
      {(phase === 'grotto' || phase === 'event') && (
        <>
          <div className="absolute inset-0">
            <img src="/InnerGrotto.png" alt="المغارة" className="w-full h-full object-cover brightness-110 contrast-125" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
          </div>

          {/* HUD - Minimally showing only vital HP/Mana */}
          <div className="absolute top-0 left-0 right-0 z-50 p-4 pointer-events-none">
            <DungeonHUD
              hp={hp} maxHp={maxHp} stamina={stamina} maxStamina={maxStamina}
              mana={mana} maxMana={maxMana} gold={gold}
              monstersDefeated={monstersDefeated} totalMonsters={totalMonsters}
              roomsExplored={roomsExplored} totalRooms={totalRooms} themeColor={theme.primary} rank={rank}
            />
          </div>

          {/* EXIT BUTTON ONLY */}
          <div className="absolute top-6 left-6 z-50">
            {hasExitStone && (
              <button onClick={handleExitWithStone} className="p-2 bg-black/40 border border-emerald-500/40 rounded-lg backdrop-blur-md">
                <DoorOpen className="w-4 h-4 text-emerald-400" />
              </button>
            )}
          </div>

          {/* ═══ THREE GATES ═══ */}
          {phase === 'grotto' && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-10 px-6">
              <div className="flex items-end justify-center gap-4 w-full max-w-sm">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChoosePath('left')}
                  className="flex-1 relative h-24 bg-black/40 border border-white/10 rounded-lg flex flex-col items-center justify-center gap-1 group overflow-hidden"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Left</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChoosePath('center')}
                  className="flex-[1.5] relative h-32 bg-blue-900/20 border border-blue-500/30 rounded-lg flex flex-col items-center justify-center gap-1 group overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                >
                  <ArrowUp className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">Advance</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChoosePath('right')}
                  className="flex-1 relative h-24 bg-black/40 border border-white/10 rounded-lg flex flex-col items-center justify-center gap-1 group overflow-hidden"
                >
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Right</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* ═══ TYPEWRITER EVENT ═══ */}
          {phase === 'event' && !encounter && (
            <div className="absolute inset-x-0 bottom-32 z-40 flex items-center justify-center px-8">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="w-full max-w-xs text-center"
              >
                <p className="text-xs font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight leading-relaxed">
                  {typewriterText}
                  {isTyping && <span className="inline-block w-1 h-3 bg-blue-500 ml-1 animate-pulse" />}
                </p>
              </motion.div>
            </div>
          )}
        </>
      )}

      {/* ═══ EXIT CONFIRMATION ═══ */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div className="w-full max-w-xs bg-black border border-emerald-500/30 p-6 text-center">
              <h3 className="text-sm font-black text-emerald-400 mb-4 tracking-tighter">استخدام حجر العودة؟</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={confirmExit} className="py-2 bg-emerald-900/40 border border-emerald-500/50 text-[10px] font-bold uppercase">Confirm</button>
                <button onClick={() => setShowExitConfirm(false)} className="py-2 bg-white/5 text-[10px] font-bold uppercase">Cancel</button>
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
        {cleared && (
          <DungeonClearedScreen rank={rank} gold={gold} xp={xp} monstersDefeated={monstersDefeated} treasuresFound={treasuresFound} roomsExplored={roomsExplored} themeColor={theme.primary} onExit={() => navigate(-1)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dungeon;
