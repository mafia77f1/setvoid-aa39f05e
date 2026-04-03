import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Map, Footprints, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Target, Zap } from 'lucide-react';
import { DungeonRoom, Position, SystemMessage, StaminaTask } from '@/components/dungeon/DungeonTypes';
import { generateDungeon, countRoomTypes, STAMINA_TASKS } from '@/components/dungeon/dungeonGenerator';
import { DungeonMinimap } from '@/components/dungeon/DungeonMinimap';
import { DungeonHUD } from '@/components/dungeon/DungeonHUD';
import { DungeonSystemMessage } from '@/components/dungeon/DungeonSystemMessage';
import { DungeonEncounter, StaminaModal } from '@/components/dungeon/DungeonEncounter';
import { DungeonClearedScreen } from '@/components/dungeon/DungeonClearedScreen';

const GRID_SIZE = 8;

const RANK_THEMES: Record<string, { primary: string; secondary: string; glow: string }> = {
  E: { primary: '#6b7280', secondary: '#4b5563', glow: 'rgba(107,114,128,0.2)' },
  D: { primary: '#22c55e', secondary: '#16a34a', glow: 'rgba(34,197,94,0.2)' },
  C: { primary: '#3b82f6', secondary: '#2563eb', glow: 'rgba(59,130,246,0.2)' },
  B: { primary: '#a855f7', secondary: '#9333ea', glow: 'rgba(168,85,247,0.2)' },
  A: { primary: '#f59e0b', secondary: '#d97706', glow: 'rgba(245,158,11,0.2)' },
  S: { primary: '#ef4444', secondary: '#dc2626', glow: 'rgba(239,68,68,0.3)' },
};

const Dungeon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rank = (searchParams.get('rank') || 'E').toUpperCase();
  const theme = RANK_THEMES[rank] || RANK_THEMES['E'];

  // --- States ---
  const [entering, setEntering] = useState(true);
  const [grid, setGrid] = useState<DungeonRoom[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: GRID_SIZE - 1 });
  const [stats, setStats] = useState({ hp: 100, maxHp: 100, stamina: 15, maxStamina: 20, mana: 50, gold: 0, xp: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [encounter, setEncounter] = useState<DungeonRoom | null>(null);
  const [showStaminaModal, setShowStaminaModal] = useState(false);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [cleared, setCleared] = useState(false);
  const msgCounter = useRef(0);

  // --- Joystick Logic ---
  const [joystickPos, setJoystickPos] = useState<Position>({ x: 0, y: 0 });
  const joystickActive = useRef(false);
  const moveTimerRef = useRef<any>(null);

  // --- Initialize ---
  useEffect(() => {
    const newGrid = generateDungeon(rank);
    setGrid(newGrid);
    setTimeout(() => setEntering(false), 2500);
    addSystemMessage(`تم رصد بوابة من الرتبة [${rank}]`, 'warning');
  }, [rank]);

  const addSystemMessage = useCallback((text: string, type: SystemMessage['type']) => {
    msgCounter.current++;
    const msg: SystemMessage = { id: `msg-${msgCounter.current}`, text, type, timestamp: Date.now() };
    setSystemMessages(prev => [msg, ...prev].slice(0, 5));
    setTimeout(() => setSystemMessages(prev => prev.filter(m => m.id !== msg.id)), 5000);
  }, []);

  // --- Movement & Logic ---
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (encounter || cleared || entering || isMoving) return;

    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;
    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) return;

    if (stats.stamina <= 0) {
      setShowStaminaModal(true);
      return;
    }

    setIsMoving(true);
    setStats(prev => ({ ...prev, stamina: Math.max(0, prev.stamina - 1) }));
    
    // تأخير الحركة لإعطاء شعور بالخطوات
    setTimeout(() => {
      setPlayerPos({ x: nx, y: ny });
      updateGridState(nx, ny);
      setIsMoving(false);
    }, 100);
  }, [playerPos, stats.stamina, encounter, cleared, entering, isMoving]);

  const updateGridState = (nx: number, ny: number) => {
    setGrid(prev => {
      const newGrid = [...prev.map(row => [...row])];
      
      // كشف الغرف المحيطة (Line of Sight)
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          const targetY = ny + y, targetX = nx + x;
          if (newGrid[targetY]?.[targetX]) newGrid[targetY][targetX].revealed = true;
        }
      }

      const room = newGrid[ny][nx];
      if (!room.visited) {
        room.visited = true;
        handleRoomEvents(room);
      } else if (!room.cleared && (room.type === 'monster' || room.type === 'boss' || room.type === 'treasure')) {
        setEncounter(room);
      }
      
      return newGrid;
    });
  };

  const handleRoomEvents = (room: DungeonRoom) => {
    if (room.type === 'monster' || room.type === 'boss') {
      setTimeout(() => setEncounter(room), 300);
      addSystemMessage(room.type === 'boss' ? "طاقة مرعبة تنبعث من الأمام!" : "عدو يقترب!", 'danger');
    } else if (room.type === 'treasure') {
      setTimeout(() => setEncounter(room), 300);
    } else if (room.type === 'trap') {
      const dmg = 15;
      setStats(p => ({ ...p, hp: Math.max(0, p.hp - dmg) }));
      addSystemMessage(`وقع في فخ! فقدت ${dmg} HP`, 'danger');
    }
  };

  const cellSize = Math.min(45, (typeof window !== 'undefined' ? window.innerWidth - 40 : 320) / GRID_SIZE);

  return (
    <div className="fixed inset-0 bg-[#020205] text-slate-100 overflow-hidden font-sans select-none" dir="rtl">
      
      {/* التأثيرات الخلفية (Ambient) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ background: `radial-gradient(circle at center, ${theme.glow} 0%, transparent 70%)` }} />
      
      {/* HUD & Stats */}
      {!entering && (
        <>
          <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-start">
             <DungeonHUD 
                hp={stats.hp} maxHp={stats.maxHp}
                stamina={stats.stamina} maxStamina={stats.maxStamina}
                mana={stats.mana} maxMana={50}
                gold={stats.gold} rank={rank} themeColor={theme.primary}
             />
             <div className="flex flex-col gap-2">
                <button onClick={() => setShowMap(!showMap)} className="p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
                   <Map size={20} color={theme.primary} />
                </button>
             </div>
          </div>
          <DungeonSystemMessage messages={systemMessages} />
        </>
      )}

      {/* Grid Rendering */}
      {!entering && (
        <div className="h-full flex items-center justify-center p-4">
          <motion.div 
            className="relative grid gap-1 p-2 rounded-xl bg-black/40 border border-white/5 shadow-2xl"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
              boxShadow: `0 0 40px ${theme.glow}`
            }}
          >
            {grid.map((row, y) => row.map((room, x) => {
              const isPlayer = playerPos.x === x && playerPos.y === y;
              const distance = Math.sqrt(Math.pow(x - playerPos.x, 2) + Math.pow(y - playerPos.y, 2));
              const isVisible = distance < 2.5; // نطاق الرؤية

              return (
                <div 
                  key={`${x}-${y}`}
                  className="relative rounded-sm overflow-hidden transition-all duration-700"
                  style={{ 
                    width: cellSize, height: cellSize,
                    backgroundColor: room.revealed ? '#0a0a0f' : '#020205',
                    opacity: isVisible ? 1 : room.revealed ? 0.3 : 0.1
                  }}
                >
                  {/* Room Content */}
                  <AnimatePresence>
                    {isPlayer && (
                      <motion.div 
                        layoutId="player"
                        className="absolute inset-0 z-20 flex items-center justify-center"
                        initial={false}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                         <div className="w-3/4 h-3/4 rounded-full border-2 shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                              style={{ borderColor: theme.primary, background: `radial-gradient(circle, ${theme.primary} 0%, transparent 100%)` }} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {room.revealed && !isPlayer && (
                    <div className="w-full h-full flex items-center justify-center opacity-80">
                      {room.type === 'boss' && !room.cleared && <span className="animate-pulse text-red-500 drop-shadow-[0_0_8px_red]">💀</span>}
                      {room.type === 'monster' && !room.cleared && <span className="text-orange-400">👹</span>}
                      {room.type === 'treasure' && !room.cleared && <span className="animate-bounce text-yellow-400">💎</span>}
                      {room.visited && <div className="absolute inset-0 bg-white/[0.02]" />}
                    </div>
                  )}
                </div>
              );
            }))}
          </motion.div>
        </div>
      )}

      {/* Joystick & Controls */}
      {!entering && !encounter && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-12 pointer-events-none">
          <div className="pointer-events-auto relative w-36 h-36 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl">
             <div className="grid grid-cols-3 gap-2">
                <div /> 
                <button onClick={() => movePlayer(0, -1)} className="p-3 active:scale-90 transition-transform"><ChevronUp color={theme.primary}/></button>
                <div />
                <button onClick={() => movePlayer(-1, 0)} className="p-3 active:scale-90 transition-transform"><ChevronRight color={theme.primary}/></button>
                <div className="w-8 h-8 rounded-full border border-white/20" />
                <button onClick={() => movePlayer(1, 0)} className="p-3 active:scale-90 transition-transform"><ChevronLeft color={theme.primary}/></button>
                <div />
                <button onClick={() => movePlayer(0, 1)} className="p-3 active:scale-90 transition-transform"><ChevronDown color={theme.primary}/></button>
                <div />
             </div>
          </div>
        </div>
      )}

      {/* Cinematic Entrance */}
      <AnimatePresence>
        {entering && (
          <motion.div 
            className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center space-y-6"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
               className="text-center"
            >
              <h2 className="text-xs tracking-[0.5em] text-blue-400 mb-2">SYSTEM: INITIALIZING GATE</h2>
              <h1 className="text-5xl font-black italic tracking-tighter" style={{ color: theme.primary, textShadow: `0 0 20px ${theme.glow}` }}>
                {rank}-RANK DUNGEON
              </h1>
              <div className="mt-4 h-[2px] w-64 bg-white/10 overflow-hidden mx-auto">
                <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }} animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {encounter && (
          <DungeonEncounter 
            room={encounter} 
            themeColor={theme.primary}
            onDefeatMonster={() => {
              setStats(p => ({ ...p, xp: p.xp + 20, gold: p.gold + 50 }));
              setEncounter(null);
              updateGridState(playerPos.x, playerPos.y); // تحديث الحالة لمسح الوحش
            }}
            onDismiss={() => setEncounter(null)}
          />
        )}
      </AnimatePresence>

      {cleared && <DungeonClearedScreen stats={stats} onExit={() => navigate('/home')} />}
    </div>
  );
};

export default Dungeon;
