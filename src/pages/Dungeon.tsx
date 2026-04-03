import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Map, Footprints, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { DungeonRoom, Position, SystemMessage, StaminaTask } from '@/components/dungeon/DungeonTypes';
import { generateDungeon, countRoomTypes, STAMINA_TASKS } from '@/components/dungeon/dungeonGenerator';
import { DungeonMinimap } from '@/components/dungeon/DungeonMinimap';
import { DungeonHUD } from '@/components/dungeon/DungeonHUD';
import { DungeonSystemMessage } from '@/components/dungeon/DungeonSystemMessage';
import { DungeonEncounter, StaminaModal } from '@/components/dungeon/DungeonEncounter';
import { DungeonClearedScreen } from '@/components/dungeon/DungeonClearedScreen';

const GRID_SIZE = 8;

const RANK_THEMES: Record<string, { primary: string; secondary: string }> = {
  E: { primary: '#6b7280', secondary: '#4b5563' },
  D: { primary: '#22c55e', secondary: '#16a34a' },
  C: { primary: '#3b82f6', secondary: '#2563eb' },
  B: { primary: '#a855f7', secondary: '#9333ea' },
  A: { primary: '#f59e0b', secondary: '#d97706' },
  S: { primary: '#ef4444', secondary: '#dc2626' },
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
  const [showMap, setShowMap] = useState(true);
  const [encounter, setEncounter] = useState<DungeonRoom | null>(null);
  const [showStaminaModal, setShowStaminaModal] = useState(false);
  const [staminaTasks, setStaminaTasks] = useState<StaminaTask[]>([...STAMINA_TASKS]);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [cleared, setCleared] = useState(false);
  const [monstersDefeated, setMonstersDefeated] = useState(0);
  const [treasuresFound, setTreasuresFound] = useState(0);
  const [roomsExplored, setRoomsExplored] = useState(1);
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
    addSystemMessage('بوابة رتبة ' + rank + ' مفتوحة!', 'warning');
    setTimeout(() => addSystemMessage('احذر... وحوش تتربص في الظلام', 'danger'), 2000);
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
    if (encounter || cleared || entering) return;

    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;
    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) return;

    if (stamina <= 0) {
      addSystemMessage('⚠ طاقتك نفدت! أكمل مهمة لاستعادتها', 'warning');
      setShowStaminaModal(true);
      return;
    }

    setStamina(prev => Math.max(0, prev - 1));
    setPlayerPos({ x: nx, y: ny });

    // Reveal fog of war
    setGrid(prev => {
      const newGrid = revealAround({ x: nx, y: ny }, prev);
      const room = newGrid[ny][nx];

      if (!room.visited) {
        room.visited = true;
        setRoomsExplored(prev => prev + 1);

        // Handle encounters
        if (room.type === 'monster' || room.type === 'boss') {
          if (!room.cleared) {
            setTimeout(() => {
              if (room.type === 'boss') {
                addSystemMessage('⚠ BOSS DETECTED! ⚠', 'danger');
              } else {
                addSystemMessage('وحش يهاجمك!', 'danger');
              }
              setEncounter(room);
            }, 200);
          }
        } else if (room.type === 'treasure' && !room.cleared) {
          setTimeout(() => {
            addSystemMessage('كنز! أكمل المهمة لجمعه', 'success');
            setEncounter(room);
          }, 200);
        } else if (room.type === 'trap' && !room.cleared) {
          const dmg = room.trap?.damage || 10;
          setHp(prev => Math.max(0, prev - dmg));
          room.cleared = true;
          addSystemMessage(`فخ! خسرت ${dmg} HP`, 'danger');
        } else if (room.type === 'empty') {
          // Small chance of discovery
          if (Math.random() < 0.2) {
            addSystemMessage(room.description, 'info');
          }
        }
      } else if ((room.type === 'monster' || room.type === 'boss') && !room.cleared) {
        setTimeout(() => setEncounter(room), 200);
      } else if (room.type === 'treasure' && !room.cleared) {
        setTimeout(() => setEncounter(room), 200);
      }

      return newGrid;
    });
  }, [playerPos, stamina, encounter, cleared, entering, revealAround, addSystemMessage]);

  const handleDefeatMonster = useCallback(() => {
    if (!encounter) return;
    const monster = encounter.monster;
    if (!monster) return;

    setGrid(prev => {
      const ng = prev.map(row => row.map(r => ({ ...r })));
      ng[encounter.y][encounter.x].cleared = true;
      if (ng[encounter.y][encounter.x].monster) {
        ng[encounter.y][encounter.x].monster!.defeated = true;
      }
      return ng;
    });

    setGold(prev => prev + monster.goldReward);
    setXp(prev => prev + monster.xpReward);
    setMonstersDefeated(prev => prev + 1);
    setMana(prev => Math.min(maxMana, prev + 5));

    if (encounter.type === 'boss') {
      addSystemMessage('🏆 DUNGEON CLEARED!', 'success');
      setTimeout(() => setCleared(true), 500);
    } else {
      addSystemMessage(`هزمت ${monster.name}! +${monster.xpReward}XP +${monster.goldReward}💰`, 'success');
    }

    setEncounter(null);
  }, [encounter, maxMana, addSystemMessage]);

  const handleCollectTreasure = useCallback(() => {
    if (!encounter) return;
    const treasure = encounter.treasure;
    if (!treasure) return;

    setGrid(prev => {
      const ng = prev.map(row => row.map(r => ({ ...r })));
      ng[encounter.y][encounter.x].cleared = true;
      if (ng[encounter.y][encounter.x].treasure) {
        ng[encounter.y][encounter.x].treasure!.collected = true;
      }
      return ng;
    });

    if (treasure.type === 'gold') {
      setGold(prev => prev + treasure.amount);
    }
    setXp(prev => prev + 10);
    setTreasuresFound(prev => prev + 1);

    addSystemMessage(`حصلت على ${treasure.name}!`, 'success');
    setEncounter(null);
  }, [encounter, addSystemMessage]);

  const handleStaminaTask = useCallback((taskId: string) => {
    setStaminaTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    const task = staminaTasks.find(t => t.id === taskId);
    if (task) {
      setStamina(prev => Math.min(maxStamina, prev + task.staminaReward));
      addSystemMessage(`+${task.staminaReward} طاقة! ${task.text}`, 'success');
    }
  }, [staminaTasks, maxStamina, addSystemMessage]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (entering || encounter) return;
      switch (e.key) {
        case 'ArrowUp': case 'w': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': movePlayer(1, 0); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [movePlayer, entering, encounter]);

  // Joystick handlers
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
    const clampedDist = Math.min(dist, maxDist);
    const angle = Math.atan2(dy, dx);
    setJoystickPos({ x: Math.cos(angle) * clampedDist, y: Math.sin(angle) * clampedDist });
    if (dist > 15) {
      let mdx = 0, mdy = 0;
      if (Math.abs(dx) > Math.abs(dy)) mdx = dx > 0 ? 1 : -1;
      else mdy = dy > 0 ? 1 : -1;
      if (mdx !== lastMoveDir.current.dx || mdy !== lastMoveDir.current.dy) {
        lastMoveDir.current = { dx: mdx, dy: mdy };
        if (moveTimerRef.current) clearInterval(moveTimerRef.current);
        movePlayer(mdx, mdy);
        moveTimerRef.current = setInterval(() => movePlayer(mdx, mdy), 300);
      }
    } else {
      lastMoveDir.current = { dx: 0, dy: 0 };
      if (moveTimerRef.current) { clearInterval(moveTimerRef.current); moveTimerRef.current = null; }
    }
  };

  const handleJoystickEnd = () => {
    joystickActive.current = false;
    setJoystickPos({ x: 0, y: 0 });
    lastMoveDir.current = { dx: 0, dy: 0 };
    if (moveTimerRef.current) { clearInterval(moveTimerRef.current); moveTimerRef.current = null; }
  };

  // Room cell size based on viewport
  const cellSize = Math.min(40, (typeof window !== 'undefined' ? window.innerWidth - 32 : 320) / GRID_SIZE);

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden select-none flex flex-col" dir="rtl">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 30%, ${theme.primary}08 0%, transparent 70%)`,
        }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(${theme.primary}40 1px, transparent 1px), linear-gradient(90deg, ${theme.primary}40 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* ═══ ENTERING CINEMATIC ═══ */}
      <AnimatePresence>
        {entering && (
          <motion.div
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ background: theme.primary, left: '50%', top: '50%' }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 600],
                    y: [0, (Math.random() - 0.5) * 600],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{ duration: 2, delay: 0.5 + Math.random() * 0.5, ease: 'easeOut' }}
                />
              ))}
            </div>

            <motion.div
              className="text-center space-y-8 relative z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="relative mx-auto w-28 h-28 flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute inset-0 rounded-full border-2 opacity-30" style={{ borderColor: theme.primary }} />
                <div className="absolute inset-2 rounded-full border opacity-20" style={{ borderColor: theme.secondary }} />
                <motion.span className="text-5xl relative z-10" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  🕳️
                </motion.span>
              </motion.div>

              <div>
                <motion.h1
                  className="text-3xl font-black tracking-[0.4em] uppercase"
                  style={{ color: theme.primary, textShadow: `0 0 40px ${theme.primary}` }}
                  initial={{ letterSpacing: '2em', opacity: 0 }}
                  animate={{ letterSpacing: '0.4em', opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  المغارة
                </motion.h1>
                <motion.p
                  className="text-[10px] tracking-[0.6em] uppercase mt-3 font-bold font-mono"
                  style={{ color: theme.secondary }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1 }}
                >
                  RANK {rank} DUNGEON
                </motion.p>
              </div>

              <motion.div className="w-56 h-1 mx-auto rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)` }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                />
              </motion.div>

              <motion.p
                className="text-[9px] tracking-[0.3em] uppercase font-mono"
                style={{ color: theme.primary }}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ⚠ احذر من الظلام ⚠
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Messages */}
      <DungeonSystemMessage messages={systemMessages} />

      {/* ═══ TOP BAR ═══ */}
      {!entering && (
        <div className="absolute top-0 left-0 right-0 z-40 p-3 flex items-start justify-between gap-2">
          {/* Minimap */}
          {showMap && grid.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <DungeonMinimap grid={grid} playerPos={playerPos} themeColor={theme.primary} />
            </motion.div>
          )}

          {/* Right side */}
          <div className="flex flex-col gap-2 items-end flex-shrink-0" style={{ maxWidth: '140px' }}>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMap(p => !p)}
                className="w-9 h-9 rounded-xl bg-black/80 border flex items-center justify-center backdrop-blur-xl active:scale-90 transition-transform"
                style={{ borderColor: `${theme.primary}30` }}
              >
                <Map className="w-3.5 h-3.5" style={{ color: `${theme.primary}80` }} />
              </button>
              <button
                onClick={() => setShowStaminaModal(true)}
                className="w-9 h-9 rounded-xl bg-black/80 border flex items-center justify-center backdrop-blur-xl active:scale-90 transition-transform"
                style={{ borderColor: stamina <= 3 ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.3)' }}
              >
                <Footprints className="w-3.5 h-3.5" style={{ color: stamina <= 3 ? '#ef4444' : '#22c55e' }} />
              </button>
            </div>
            <DungeonHUD
              hp={hp} maxHp={maxHp}
              stamina={stamina} maxStamina={maxStamina}
              mana={mana} maxMana={maxMana}
              gold={gold}
              monstersDefeated={monstersDefeated}
              totalMonsters={totalMonsters}
              roomsExplored={roomsExplored}
              totalRooms={totalRooms}
              themeColor={theme.primary}
              rank={rank}
            />
          </div>
        </div>
      )}

      {/* ═══ DUNGEON GRID ═══ */}
      {!entering && grid.length > 0 && (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div
            className="relative rounded-2xl overflow-hidden border"
            style={{
              width: GRID_SIZE * cellSize + 4,
              height: GRID_SIZE * cellSize + 4,
              borderColor: `${theme.primary}15`,
              boxShadow: `0 0 60px ${theme.primary}10, inset 0 0 30px rgba(0,0,0,0.5)`,
              background: 'rgba(0,0,0,0.4)',
            }}
          >
            {grid.map((row, y) =>
              row.map((room, x) => {
                const isPlayer = playerPos.x === x && playerPos.y === y;
                const isBoss = room.type === 'boss' && !room.cleared;
                const isMonster = room.type === 'monster' && !room.cleared;
                const isTreasure = room.type === 'treasure' && !room.cleared;

                return (
                  <div
                    key={`${x}-${y}`}
                    className="absolute transition-all duration-300"
                    style={{
                      left: x * cellSize + 2,
                      top: y * cellSize + 2,
                      width: cellSize,
                      height: cellSize,
                      background: !room.revealed
                        ? '#08080f'
                        : isPlayer
                        ? `${theme.primary}20`
                        : room.visited
                        ? 'rgba(20,22,30,0.8)'
                        : 'rgba(15,16,22,0.6)',
                      borderRight: '1px solid rgba(255,255,255,0.03)',
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      boxShadow: isPlayer ? `inset 0 0 15px ${theme.primary}30` : undefined,
                    }}
                  >
                    {room.revealed && (
                      <div className="w-full h-full flex items-center justify-center relative">
                        {/* Room content */}
                        {isPlayer && (
                          <motion.div
                            className="w-[70%] h-[70%] rounded-full flex items-center justify-center border-2 z-10"
                            animate={{ boxShadow: [`0 0 8px ${theme.primary}60`, `0 0 16px ${theme.primary}80`, `0 0 8px ${theme.primary}60`] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{
                              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                              borderColor: `${theme.primary}80`,
                            }}
                          >
                            <span className="text-[10px]">⚔️</span>
                          </motion.div>
                        )}
                        {!isPlayer && isBoss && (
                          <motion.div
                            animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="absolute inset-0 rounded-sm" style={{ background: 'rgba(239,68,68,0.15)', boxShadow: '0 0 20px rgba(239,68,68,0.3)' }} />
                            <span className="text-lg relative z-10">💀</span>
                          </motion.div>
                        )}
                        {!isPlayer && isMonster && (
                          <motion.span
                            className="text-sm"
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            {room.monster?.icon || '👹'}
                          </motion.span>
                        )}
                        {!isPlayer && isTreasure && (
                          <motion.span
                            className="text-sm"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {room.treasure?.icon || '💰'}
                          </motion.span>
                        )}
                        {!isPlayer && room.type === 'trap' && !room.cleared && room.revealed && room.visited && (
                          <span className="text-sm opacity-50">⚡</span>
                        )}
                        {!isPlayer && room.cleared && (room.type === 'monster' || room.type === 'boss') && (
                          <span className="text-[10px] opacity-30">✓</span>
                        )}
                        {!isPlayer && room.cleared && room.type === 'treasure' && (
                          <span className="text-[10px] opacity-30">✓</span>
                        )}
                        {/* Fog overlay for revealed but not visited */}
                        {room.revealed && !room.visited && (
                          <div className="absolute inset-0 bg-black/40" />
                        )}
                      </div>
                    )}
                    {/* Full fog */}
                    {!room.revealed && (
                      <div className="w-full h-full" style={{
                        background: 'linear-gradient(135deg, #08080f 0%, #0a0a14 100%)',
                      }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ═══ CONTROLS ═══ */}
      {!entering && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-8">
          {/* D-Pad */}
          <div className="relative w-32 h-32">
            {/* Center joystick area */}
            <div
              ref={joystickRef}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,0,0,0.5), rgba(0,0,0,0.8))',
                border: `2px solid ${theme.primary}15`,
                boxShadow: `inset 0 0 30px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.4)`,
              }}
              onTouchStart={(e) => { e.preventDefault(); handleJoystickStart(e.touches[0].clientX, e.touches[0].clientY); }}
              onTouchMove={(e) => { e.preventDefault(); handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY); }}
              onTouchEnd={handleJoystickEnd}
              onMouseDown={(e) => handleJoystickStart(e.clientX, e.clientY)}
              onMouseMove={(e) => { if (joystickActive.current) handleJoystickMove(e.clientX, e.clientY); }}
              onMouseUp={handleJoystickEnd}
              onMouseLeave={handleJoystickEnd}
            >
              {/* Direction arrows */}
              <ChevronUp className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4" style={{ color: `${theme.primary}40` }} />
              <ChevronDown className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4" style={{ color: `${theme.primary}40` }} />
              <ChevronLeft className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: `${theme.primary}40` }} />
              <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: `${theme.primary}40` }} />

              <motion.div
                className="absolute top-1/2 left-1/2 w-14 h-14 rounded-full border-2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  background: `linear-gradient(135deg, ${theme.secondary}90, ${theme.primary}60)`,
                  borderColor: `${theme.primary}40`,
                  transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
                  boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 15px ${theme.primary}20`,
                  transition: joystickActive.current ? 'none' : 'transform 0.2s ease-out',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ EXIT BUTTON ═══ */}
      {!entering && !cleared && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate(-1)}
          className="absolute bottom-3 right-3 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-xl active:scale-90 transition-transform"
          style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${theme.primary}20` }}
        >
          <ArrowLeft className="w-3.5 h-3.5" style={{ color: `${theme.primary}80` }} />
          <span className="text-[10px] font-bold tracking-wider" style={{ color: `${theme.primary}80` }}>خروج</span>
        </motion.button>
      )}

      {/* ═══ ENCOUNTER MODAL ═══ */}
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
      </AnimatePresence>

      {/* ═══ STAMINA MODAL ═══ */}
      <AnimatePresence>
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

      {/* ═══ CLEARED SCREEN ═══ */}
      {cleared && (
        <DungeonClearedScreen
          rank={rank}
          gold={gold}
          xp={xp}
          monstersDefeated={monstersDefeated}
          treasuresFound={treasuresFound}
          roomsExplored={roomsExplored}
          themeColor={theme.primary}
          onExit={() => navigate(-1)}
        />
      )}
    </div>
  );
};

export default Dungeon;
