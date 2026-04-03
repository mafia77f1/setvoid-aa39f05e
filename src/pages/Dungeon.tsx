import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Map, Footprints, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, ShieldAlert } from 'lucide-react';
import { DungeonRoom, Position, SystemMessage, StaminaTask } from '@/components/dungeon/DungeonTypes';
import { generateDungeon, countRoomTypes, STAMINA_TASKS } from '@/components/dungeon/dungeonGenerator';
import { DungeonMinimap } from '@/components/dungeon/DungeonMinimap';
import { DungeonHUD } from '@/components/dungeon/DungeonHUD';
import { DungeonSystemMessage } from '@/components/dungeon/DungeonSystemMessage';
import { DungeonEncounter, StaminaModal } from '@/components/dungeon/DungeonEncounter';
import { DungeonClearedScreen } from '@/components/dungeon/DungeonClearedScreen';

const GRID_SIZE = 8;

const RANK_THEMES: Record<string, { primary: string; secondary: string; shadow: string }> = {
  E: { primary: '#6b7280', secondary: '#4b5563', shadow: 'rgba(107,114,128,0.2)' },
  D: { primary: '#22c55e', secondary: '#16a34a', shadow: 'rgba(34,197,94,0.2)' },
  C: { primary: '#3b82f6', secondary: '#2563eb', shadow: 'rgba(59,130,246,0.2)' },
  B: { primary: '#a855f7', secondary: '#9333ea', shadow: 'rgba(168,85,247,0.2)' },
  A: { primary: '#f59e0b', secondary: '#d97706', shadow: 'rgba(245,158,11,0.2)' },
  S: { primary: '#ef4444', secondary: '#dc2626', shadow: 'rgba(239,68,68,0.2)' },
};

const Dungeon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rank = (searchParams.get('rank') || 'E').toUpperCase();
  const theme = RANK_THEMES[rank] || RANK_THEMES['E'];

  // State
  const [entering, setEntering] = useState(true);
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
  const [showMap, setShowMap] = useState(false); // Map hidden by default for immersion
  const [encounter, setEncounter] = useState<DungeonRoom | null>(null);
  const [showStaminaModal, setShowStaminaModal] = useState(false);
  const [staminaTasks, setStaminaTasks] = useState<StaminaTask[]>([...STAMINA_TASKS]);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [cleared, setCleared] = useState(false);
  const [monstersDefeated, setMonstersDefeated] = useState(0);
  const [treasuresFound, setTreasuresFound] = useState(0);
  const [roomsExplored, setRoomsExplored] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const msgCounter = useRef(0);

  // Joystick state
  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickCenter = useRef<Position>({ x: 0, y: 0 });
  const joystickActive = useRef(false);
  const [joystickPos, setJoystickPos] = useState<Position>({ x: 0, y: 0 });
  const moveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMoveDir = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  // Initialize dungeon
  useEffect(() => {
    const newGrid = generateDungeon(rank);
    setGrid(newGrid);
    setTimeout(() => setEntering(false), 3000);
    addSystemMessage('تم اكتشاف بوابة رتبة ' + rank, 'warning');
  }, [rank]);

  const addSystemMessage = useCallback((text: string, type: SystemMessage['type']) => {
    msgCounter.current++;
    const msg: SystemMessage = { id: `msg-${msgCounter.current}`, text, type, timestamp: Date.now() };
    setSystemMessages(prev => [...prev, msg]);
    setTimeout(() => {
      setSystemMessages(prev => prev.filter(m => m.id !== msg.id));
    }, 4000);
  }, []);

  const { monsters: totalMonsters, treasures: totalTreasures, totalRooms } = grid.length > 0 ? countRoomTypes(grid) : { monsters: 0, treasures: 0, totalRooms: 0 };

  const revealAround = useCallback((pos: Position, g: DungeonRoom[][]) => {
    const newGrid = g.map(row => row.map(r => ({ ...r })));
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ny = pos.y + dy;
        const nx = pos.x + dx;
        if (ny >= 0 && ny < GRID_SIZE && nx >= 0 && nx < GRID_SIZE) {
          newGrid[ny][nx].revealed = true;
        }
      }
    }
    return newGrid;
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (encounter || cleared || entering || isMoving) return;

    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;
    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) return;

    if (stamina <= 0) {
      addSystemMessage('⚠ الطاقة منخفضة جداً لاستكشاف المزيد!', 'warning');
      setShowStaminaModal(true);
      return;
    }

    setIsMoving(true);
    setStamina(prev => Math.max(0, prev - 1));

    // Simulate movement delay for animation
    setTimeout(() => {
      setPlayerPos({ x: nx, y: ny });
      setGrid(prev => {
        const newGrid = revealAround({ x: nx, y: ny }, prev);
        const room = newGrid[ny][nx];

        if (!room.visited) {
          room.visited = true;
          setRoomsExplored(prev => prev + 1);
          if (room.type === 'monster' || room.type === 'boss') {
             setTimeout(() => setEncounter(room), 300);
          } else if (room.type === 'treasure') {
             setTimeout(() => setEncounter(room), 300);
          } else if (room.type === 'trap') {
             setHp(p => Math.max(0, p - 10));
             addSystemMessage('فخ مفاجئ! -10 HP', 'danger');
          }
        } else if ((room.type === 'monster' || room.type === 'boss' || room.type === 'treasure') && !room.cleared) {
          setTimeout(() => setEncounter(room), 300);
        }
        return newGrid;
      });
      setIsMoving(false);
    }, 400);
  }, [playerPos, stamina, encounter, cleared, entering, isMoving, revealAround, addSystemMessage]);

  const handleDefeatMonster = useCallback(() => {
    if (!encounter) return;
    const monster = encounter.monster;
    if (!monster) return;

    setGrid(prev => {
      const ng = prev.map(row => row.map(r => ({ ...r })));
      ng[encounter.y][encounter.x].cleared = true;
      return ng;
    });

    setGold(prev => prev + monster.goldReward);
    setXp(prev => prev + monster.xpReward);
    setMonstersDefeated(prev => prev + 1);
    
    if (encounter.type === 'boss') {
      addSystemMessage('تم تصفية المغارة بنجاح!', 'success');
      setTimeout(() => setCleared(true), 800);
    }
    setEncounter(null);
  }, [encounter, addSystemMessage]);

  const handleCollectTreasure = useCallback(() => {
    if (!encounter || !encounter.treasure) return;
    setGrid(prev => {
      const ng = prev.map(row => row.map(r => ({ ...r })));
      ng[encounter.y][encounter.x].cleared = true;
      return ng;
    });
    setGold(prev => prev + (encounter.treasure?.amount || 0));
    setTreasuresFound(prev => prev + 1);
    setEncounter(null);
  }, [encounter]);

  const handleStaminaTask = useCallback((taskId: string) => {
    setStaminaTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    const task = staminaTasks.find(t => t.id === taskId);
    if (task) {
      setStamina(prev => Math.min(maxStamina, prev + task.staminaReward));
      addSystemMessage(`+${task.staminaReward} طاقة مستعادة`, 'success');
    }
  }, [staminaTasks, maxStamina, addSystemMessage]);

  // Joystick logic
  const handleJoystickStart = (clientX: number, clientY: number) => {
    if (entering || !joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    joystickCenter.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    joystickActive.current = true;
    handleJoystickMove(clientX, clientY);
  };

  const handleJoystickMove = (clientX: number, clientY: number) => {
    if (!joystickActive.current) return;
    const dx = clientX - joystickCenter.current.x;
    const dy = clientY - joystickCenter.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 40;
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxDist);
    setJoystickPos({ x: Math.cos(angle) * clampedDist, y: Math.sin(angle) * clampedDist });

    if (dist > 20) {
      let mdx = 0, mdy = 0;
      if (Math.abs(dx) > Math.abs(dy)) mdx = dx > 0 ? 1 : -1;
      else mdy = dy > 0 ? 1 : -1;
      if (mdx !== lastMoveDir.current.dx || mdy !== lastMoveDir.current.dy) {
        lastMoveDir.current = { dx: mdx, dy: mdy };
        if (moveTimerRef.current) clearInterval(moveTimerRef.current);
        movePlayer(mdx, mdy);
        moveTimerRef.current = setInterval(() => movePlayer(mdx, mdy), 600);
      }
    }
  };

  const handleJoystickEnd = () => {
    joystickActive.current = false;
    setJoystickPos({ x: 0, y: 0 });
    lastMoveDir.current = { dx: 0, dy: 0 };
    if (moveTimerRef.current) clearInterval(moveTimerRef.current);
  };

  const currentRoom = grid[playerPos.y]?.[playerPos.x];

  return (
    <div className="fixed inset-0 bg-[#020205] text-white overflow-hidden select-none flex flex-col font-sans" dir="rtl">
      
      {/* ═══ ATMOSPHERIC BACKGROUND ═══ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* ═══ ENTERING CINEMATIC ═══ */}
      <AnimatePresence>
        {entering && (
          <motion.div className="absolute inset-0 z-[100] bg-black flex items-center justify-center flex-col" exit={{ opacity: 0 }}>
             <motion.div 
               animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="w-32 h-32 rounded-full border-b-4 border-t-4 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
               style={{ borderColor: theme.primary }}
             >
                <div className="text-4xl text-white drop-shadow-lg">🕳️</div>
             </motion.div>
             <h1 className="text-4xl font-black tracking-widest uppercase mb-2" style={{ color: theme.primary }}>بوابة الرتبة {rank}</h1>
             <p className="text-xs tracking-[0.5em] text-white/40 animate-pulse">جاري فحص ممانعة المانا...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <DungeonSystemMessage messages={systemMessages} />

      {/* ═══ TOP HUD ═══ */}
      {!entering && (
        <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
           <div className="flex flex-col gap-2 pointer-events-auto">
             <DungeonHUD 
                hp={hp} maxHp={maxHp} stamina={stamina} maxStamina={maxStamina} 
                mana={mana} maxMana={maxMana} gold={gold} 
                monstersDefeated={monstersDefeated} totalMonsters={totalMonsters}
                roomsExplored={roomsExplored} totalRooms={totalRooms} themeColor={theme.primary} rank={rank}
             />
           </div>
           
           <div className="flex flex-col gap-2 pointer-events-auto">
              <button onClick={() => setShowMap(!showMap)} className="p-3 bg-black/60 rounded-full border border-white/10 backdrop-blur-md active:scale-90">
                <Map className="w-5 h-5 text-blue-400" />
              </button>
           </div>
        </div>
      )}

      {/* ═══ IMMERSIVE TUNNEL VIEW (THE NEW STUFF) ═══ */}
      {!entering && (
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
           
           {/* Shadow Visual Effect */}
           <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_20%,#000_80%)]" />

           <AnimatePresence mode="wait">
             <motion.div
               key={`${playerPos.x}-${playerPos.y}`}
               initial={{ scale: 1.5, opacity: 0, z: -100 }}
               animate={{ scale: 1, opacity: 1, z: 0 }}
               exit={{ scale: 0.7, opacity: 0 }}
               transition={{ duration: 0.4, ease: "easeOut" }}
               className="relative w-[85%] max-w-sm aspect-[4/5] flex flex-col items-center justify-center rounded-[2rem] border-2"
               style={{ 
                  borderColor: `${theme.primary}40`,
                  background: `linear-gradient(180deg, ${theme.primary}10 0%, #000 100%)`,
                  boxShadow: `0 0 60px ${theme.shadow}`
               }}
             >
                {/* Room Contents */}
                <div className="text-8xl mb-8 relative">
                   {currentRoom?.type === 'monster' && <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }}>👹</motion.span>}
                   {currentRoom?.type === 'boss' && <motion.span animate={{ scale: [1, 1.2, 1] }} className="filter drop-shadow-[0_0_20px_red]">💀</motion.span>}
                   {currentRoom?.type === 'treasure' && <motion.span animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity }}>🎁</motion.span>}
                   {currentRoom?.type === 'empty' && <span className="opacity-40">🕯️</span>}
                   {currentRoom?.type === 'trap' && <span className="text-red-500">⚡</span>}
                </div>

                <div className="text-center px-8">
                   <h2 className="text-xl font-bold uppercase tracking-widest text-white/80">{currentRoom?.description}</h2>
                   <div className="mt-4 flex gap-2 justify-center">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-white/40">LOC: {playerPos.x},{playerPos.y}</span>
                   </div>
                </div>

                {/* Radar Scan Effect */}
                <motion.div 
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
             </motion.div>
           </AnimatePresence>

           {/* Moving Indicator */}
           {isMoving && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 border-[20px] border-white/5 z-20 pointer-events-none"
             />
           )}
        </div>
      )}

      {/* ═══ MINIMAP OVERLAY ═══ */}
      <AnimatePresence>
        {showMap && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-20 right-4 z-[60] bg-black/90 p-2 rounded-2xl border border-white/10 backdrop-blur-xl"
          >
             <DungeonMinimap grid={grid} playerPos={playerPos} themeColor={theme.primary} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ CONTROLS ═══ */}
      {!entering && (
        <div className="h-64 flex items-center justify-center relative z-50">
           <div className="relative group">
              {/* Glow background for Joystick */}
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl opacity-50 group-active:opacity-100 transition-opacity" />
              
              <div
                ref={joystickRef}
                className="w-36 h-36 rounded-full border-4 border-white/5 bg-black/40 backdrop-blur-md relative overflow-hidden"
                onMouseDown={(e) => handleJoystickStart(e.clientX, e.clientY)}
                onTouchStart={(e) => { e.preventDefault(); handleJoystickStart(e.touches[0].clientX, e.touches[0].clientY); }}
                onMouseMove={(e) => handleJoystickMove(e.clientX, e.clientY)}
                onTouchMove={(e) => { e.preventDefault(); handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY); }}
                onMouseUp={handleJoystickEnd}
                onMouseLeave={handleJoystickEnd}
                onTouchEnd={handleJoystickEnd}
              >
                {/* Visual Stick */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{
                    background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`,
                    borderColor: 'rgba(255,255,255,0.2)',
                    boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 20px ${theme.shadow}`,
                    x: joystickPos.x,
                    y: joystickPos.y,
                  }}
                />
                
                {/* Arrow Indicators */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                   <ChevronUp className="absolute top-2" />
                   <ChevronDown className="absolute bottom-2" />
                   <ChevronLeft className="absolute left-2" />
                   <ChevronRight className="absolute right-2" />
                </div>
              </div>
           </div>
        </div>
      )}

      {/* ═══ EXIT BUTTON ═══ */}
      {!entering && (
        <button 
          onClick={() => navigate(-1)} 
          className="absolute bottom-6 right-6 p-4 bg-black/60 border border-white/5 rounded-2xl flex items-center gap-2 active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-bold">خروج من البوابة</span>
        </button>
      )}

      {/* ═══ MODALS ═══ */}
      <AnimatePresence>
        {encounter && (
          <DungeonEncounter
            room={encounter}
            onDefeatMonster={handleDefeatMonster}
            onCollectTreasure={handleCollectTreasure}
            onDismiss={() => setEncounter(null)}
            themeColor={theme.primary}
          />
        )}
        {showStaminaModal && (
          <StaminaModal
            open={showStaminaModal}
            tasks={staminaTasks}
            onComplete={handleStaminaTask}
            onClose={() => setShowStaminaModal(false)}
            themeColor={theme.primary}
          />
        )}
      </AnimatePresence>

      {cleared && (
        <DungeonClearedScreen
          rank={rank} gold={gold} xp={xp}
          monstersDefeated={monstersDefeated} treasuresFound={treasuresFound}
          roomsExplored={roomsExplored} themeColor={theme.primary} onExit={() => navigate(-1)}
        />
      )}
    </div>
  );
};

export default Dungeon;
