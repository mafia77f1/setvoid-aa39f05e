import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Map, ChevronUp, ChevronLeft, ChevronRight, ShieldAlert, LogIn, LogOut } from 'lucide-react';
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
  const [showEntrance, setShowEntrance] = useState(true); 
  const [entering, setEntering] = useState(false);
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
  const [showMap, setShowMap] = useState(false);
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

  // Initialize dungeon
  useEffect(() => {
    const newGrid = generateDungeon(rank);
    setGrid(newGrid);
  }, [rank]);

  const addSystemMessage = useCallback((text: string, type: SystemMessage['type']) => {
    msgCounter.current++;
    const msg: SystemMessage = { id: `msg-${msgCounter.current}`, text, type, timestamp: Date.now() };
    setSystemMessages(prev => [...prev, msg]);
    setTimeout(() => { setSystemMessages(prev => prev.filter(m => m.id !== msg.id)); }, 4000);
  }, []);

  const { monsters: totalMonsters, treasures: totalTreasures, totalRooms } = grid.length > 0 ? countRoomTypes(grid) : { monsters: 0, treasures: 0, totalRooms: 0 };

  const revealAround = useCallback((pos: Position, g: DungeonRoom[][]) => {
    const newGrid = g.map(row => row.map(r => ({ ...r })));
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ny = pos.y + dy; const nx = pos.x + dx;
        if (ny >= 0 && ny < GRID_SIZE && nx >= 0 && nx < GRID_SIZE) { newGrid[ny][nx].revealed = true; }
      }
    }
    return newGrid;
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (encounter || cleared || entering || isMoving || showEntrance) return;
    const nx = playerPos.x + dx; const ny = playerPos.y + dy;
    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) return;
    if (stamina <= 0) { setShowStaminaModal(true); return; }

    setIsMoving(true);
    setStamina(prev => Math.max(0, prev - 1));

    setTimeout(() => {
      setPlayerPos({ x: nx, y: ny });
      setGrid(prev => {
        const newGrid = revealAround({ x: nx, y: ny }, prev);
        const room = newGrid[ny][nx];
        if (!room.visited) {
          room.visited = true;
          setRoomsExplored(prev => prev + 1);
          if (room.type !== 'empty') setTimeout(() => setEncounter(room), 300);
          if (room.type === 'trap') { setHp(p => Math.max(0, p - 10)); addSystemMessage('فخ مفاجئ! -10 HP', 'danger'); }
        } else if ((room.type !== 'empty') && !room.cleared) {
          setTimeout(() => setEncounter(room), 300);
        }
        return newGrid;
      });
      setIsMoving(false);
    }, 400);
  }, [playerPos, stamina, encounter, cleared, entering, isMoving, revealAround, addSystemMessage, showEntrance]);

  const handleStartDungeon = () => {
    setShowEntrance(false);
    setEntering(true);
    setTimeout(() => {
        setEntering(false);
        addSystemMessage('تم دخول البوابة بنجاح', 'success');
    }, 2500);
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
    if (encounter.type === 'boss') setTimeout(() => setCleared(true), 800);
    setEncounter(null);
  }, [encounter]);

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

  const handleStaminaTask = (taskId: string) => {
    const task = staminaTasks.find(t => t.id === taskId);
    if (task) {
      setStamina(prev => Math.min(maxStamina, prev + task.staminaReward));
      setStaminaTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    }
  };

  const currentRoom = grid[playerPos.y]?.[playerPos.x];

  const getNearbyPath = (dx: number, dy: number) => {
    const ny = playerPos.y + dy;
    const nx = playerPos.x + dx;
    if (ny < 0 || ny >= GRID_SIZE || nx < 0 || nx >= GRID_SIZE) return null;
    return grid[ny][nx];
  };

  return (
    <div className="fixed inset-0 bg-[#020205] text-white overflow-hidden select-none flex flex-col font-sans" dir="rtl">
      
      {/* ═══ 1. شاشة البداية ═══ */}
      <AnimatePresence>
        {showEntrance && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] flex items-center justify-center"
          >
            {/* الخلفية بدون ضبابية وباسم الملف الجديد */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/tunnel.png')" }}>
                <div className="absolute inset-0 bg-black/40" />
            </div>
            
            {/* تم إنزال مربع الإشعار ليكون تحت شوي عبر إضافة mt-20 أو ضبط y */}
            <motion.div 
              initial={{ scale: 0.9, y: 60 }} animate={{ scale: 1, y: 40 }}
              className="relative z-10 w-[85%] max-w-sm bg-[#0a0a0f]/90 border-2 border-blue-500/40 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(59,130,246,0.3)]"
            >
              <div className="bg-blue-600 w-fit mx-auto px-4 py-1 rounded-full text-[10px] font-black mb-4 border border-blue-400">إشعار النظام</div>
              <h2 className="text-xl font-bold mb-2">لقد رصدت بوابة [رتبة {rank}]</h2>
              <p className="text-gray-400 text-xs mb-8">هل ترغب في استكشاف هذا النفق؟ الأخطار مجهولة بالداخل.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleStartDungeon} className="flex items-center justify-center gap-2 py-3 bg-blue-600 rounded-xl font-bold active:scale-95 transition-transform"><LogIn size={18}/> دخول</button>
                <button onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl font-bold active:scale-95 transition-transform"><LogOut size={18}/> انسحاب</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 2. التحميل السينمائي ═══ */}
      <AnimatePresence>
        {entering && (
          <motion.div className="absolute inset-0 z-[100] bg-black flex items-center justify-center flex-col" exit={{ opacity: 0 }}>
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-24 h-24 rounded-full border-b-2 border-t-2 mb-8" style={{ borderColor: theme.primary }} />
             <h1 className="text-2xl font-black tracking-widest" style={{ color: theme.primary }}>جاري فتح البوابة...</h1>
          </motion.div>
        )}
      </AnimatePresence>

      <DungeonSystemMessage messages={systemMessages} />

      {/* ═══ 3. HUD ═══ */}
      {!showEntrance && !entering && (
        <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
           <div className="pointer-events-auto">
             <DungeonHUD 
                hp={hp} maxHp={maxHp} stamina={stamina} maxStamina={maxStamina} 
                mana={mana} maxMana={maxMana} gold={gold} 
                monstersDefeated={monstersDefeated} totalMonsters={totalMonsters}
                roomsExplored={roomsExplored} totalRooms={totalRooms} themeColor={theme.primary} rank={rank}
             />
           </div>
           <button onClick={() => setShowMap(!showMap)} className="p-3 bg-black/60 rounded-full border border-white/10 pointer-events-auto"><Map className="w-5 h-5 text-blue-400" /></button>
        </div>
      )}

      {/* ═══ 4. عرض المسارات الثلاثة ═══ */}
      {!showEntrance && !entering && (
        <div className="flex-1 relative flex items-center justify-center p-4">
           <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
              <p className="text-center text-[10px] text-gray-500 tracking-[0.4em] mb-4">اختر طريقك التالي</p>
              
              {[
                { label: 'النفق الأمامي', dx: 0, dy: -1, icon: <ChevronUp /> },
                { label: 'النفق الأيمن', dx: 1, dy: 0, icon: <ChevronRight /> },
                { label: 'النفق الأيسر', dx: -1, dy: 0, icon: <ChevronLeft /> }
              ].map((path, idx) => {
                const targetRoom = getNearbyPath(path.dx, path.dy);
                return (
                  <motion.button
                    key={idx}
                    disabled={!targetRoom || isMoving}
                    onClick={() => movePlayer(path.dx, path.dy)}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-5 rounded-2xl border flex items-center justify-between transition-all ${
                      !targetRoom ? 'opacity-20 grayscale' : 'bg-white/[0.03] border-white/10 hover:border-blue-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-black/40 rounded-lg">{path.icon}</div>
                        <div className="text-right">
                            <span className="block font-bold text-sm">{path.label}</span>
                            <span className="text-[9px] text-gray-500 uppercase italic">
                                {targetRoom?.visited ? 'مستكشف سابقاً' : 'منطقة مجهولة'}
                            </span>
                        </div>
                    </div>
                    {targetRoom?.visited && (
                        <div className="text-xl">
                            {targetRoom.type === 'monster' && '👹'}
                            {targetRoom.type === 'treasure' && '🎁'}
                            {targetRoom.type === 'empty' && '🕯️'}
                        </div>
                    )}
                  </motion.button>
                );
              })}
           </div>
        </div>
      )}

      {/* ═══ MINIMAP ═══ */}
      <AnimatePresence>
        {showMap && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute top-20 right-4 z-[60] bg-black/90 p-2 rounded-2xl border border-white/10">
             <DungeonMinimap grid={grid} playerPos={playerPos} themeColor={theme.primary} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MODALS & SCREENS ═══ */}
      <AnimatePresence>
        {encounter && (
          <DungeonEncounter room={encounter} onDefeatMonster={handleDefeatMonster} onCollectTreasure={handleCollectTreasure} onDismiss={() => setEncounter(null)} themeColor={theme.primary} />
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
