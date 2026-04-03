import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Footprints, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { DungeonRoom, Position, SystemMessage } from '@/components/dungeon/DungeonTypes';
import { generateDungeon } from '@/components/dungeon/dungeonGenerator';
import { DungeonHUD } from '@/components/dungeon/DungeonHUD';
import { DungeonSystemMessage } from '@/components/dungeon/DungeonSystemMessage';
import { DungeonEncounter, StaminaModal } from '@/components/dungeon/DungeonEncounter';

const GRID_SIZE = 8;

const Dungeon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rank = (searchParams.get('rank') || 'E').toUpperCase();
  const [isShaking, setIsShaking] = useState(false);

  // --- States ---
  const [entering, setEntering] = useState(true);
  const [grid, setGrid] = useState<DungeonRoom[][]>([]);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: GRID_SIZE - 1 });
  const [stats, setStats] = useState({ stamina: 20, hp: 100 });
  const [encounter, setEncounter] = useState<DungeonRoom | null>(null);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);

  // --- Initialize Dungeon ---
  useEffect(() => {
    const newGrid = generateDungeon(rank);
    // كشف نقطة البداية فقط
    newGrid[GRID_SIZE - 1][0].revealed = true;
    newGrid[GRID_SIZE - 1][0].visited = true;
    setGrid(newGrid);
    setTimeout(() => setEntering(false), 2000);
  }, [rank]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  };

  const addSystemMessage = useCallback((text: string, type: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    setSystemMessages(prev => [{ id, text, type, timestamp: Date.now() }, ...prev].slice(0, 3));
  }, []);

  // --- Optimized Movement ---
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (encounter || entering) return;

    setPlayerPos(prev => {
      const nx = prev.x + dx;
      const ny = prev.y + dy;

      if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) {
        triggerShake(); // اهتزاز عند الاصطدام بالجدار
        return prev;
      }

      if (stats.stamina <= 0) {
        addSystemMessage("طاقتك نفدت.. استرح قليلاً", "warning");
        return prev;
      }

      // تحديث الخريطة والمنطق داخلياً
      const updatedGrid = [...grid];
      const targetRoom = updatedGrid[ny][nx];

      // كشف الغرف المجاورة (Fog of War)
      targetRoom.revealed = true;
      targetRoom.visited = true;
      
      if (!targetRoom.cleared && (targetRoom.type !== 'empty')) {
        setTimeout(() => setEncounter(targetRoom), 150);
      }

      setStats(s => ({ ...s, stamina: s.stamina - 1 }));
      setGrid(updatedGrid);
      return { x: nx, y: ny };
    });
  }, [grid, encounter, entering, stats.stamina]);

  // --- Render Room (Memoized for Performance) ---
  const renderGrid = useMemo(() => {
    return grid.map((row, y) => row.map((room, x) => {
      const isPlayer = playerPos.x === x && playerPos.y === y;
      const isNear = Math.abs(x - playerPos.x) <= 1 && Math.abs(y - playerPos.y) <= 1;

      return (
        <div 
          key={`${x}-${y}`}
          className="relative transition-all duration-500 border-[0.5px] border-white/5"
          style={{ 
            width: '42px', height: '42px',
            backgroundColor: isPlayer ? '#1a1a2e' : room.revealed ? '#05050a' : '#000',
            boxShadow: isPlayer ? 'inset 0 0 15px rgba(59, 130, 246, 0.5)' : 'none'
          }}
        >
          {room.revealed && (
            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-1000 ${isNear ? 'opacity-100' : 'opacity-20'}`}>
              {isPlayer ? (
                 <motion.div className="w-5 h-5 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]" 
                  animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                 />
              ) : (
                <>
                  {room.type === 'monster' && !room.cleared && <span className="text-sm">👹</span>}
                  {room.type === 'boss' && !room.cleared && <span className="text-xl animate-pulse">💀</span>}
                  {room.type === 'treasure' && !room.cleared && <span className="text-sm text-yellow-500">💰</span>}
                </>
              )}
            </div>
          )}
          {/* تأثير الظلام المتدرج */}
          {!isNear && room.revealed && <div className="absolute inset-0 bg-black/60" />}
        </div>
      );
    }));
  }, [grid, playerPos]);

  return (
    <motion.div 
      animate={isShaking ? { x: [-5, 5, -5, 0] } : {}}
      className="fixed inset-0 bg-[#020205] text-white flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50" />

      {/* Top Info */}
      <div className="absolute top-6 w-full px-6 flex justify-between items-start z-50">
        <DungeonHUD stamina={stats.stamina} rank={rank} hp={stats.hp} />
        <DungeonSystemMessage messages={systemMessages} />
      </div>

      {/* Game Board */}
      {!entering && (
        <div className="relative border-4 border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
           <div 
            className="grid" 
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 42px)` }}
           >
            {renderGrid}
           </div>
           
           {/* Scan Overlay (يتحرك مع اللاعب) */}
           <div 
             className="absolute pointer-events-none transition-all duration-300 rounded-full"
             style={{
               width: '126px', height: '126px',
               left: playerPos.x * 42 - 42, top: playerPos.y * 42 - 42,
               background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
               border: '1px solid rgba(59,130,246,0.1)'
             }}
           />
        </div>
      )}

      {/* Mini Joystick (تصغير وحل مشكلة اللاق) */}
      {!entering && (
        <div className="absolute bottom-8 right-8 z-50">
          <div className="relative w-28 h-28 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center shadow-2xl">
            <button onClick={() => movePlayer(0, -1)} className="absolute top-1 p-2 active:scale-75 transition-all text-blue-400/50"><ChevronUp /></button>
            <button onClick={() => movePlayer(0, 1)} className="absolute bottom-1 p-2 active:scale-75 transition-all text-blue-400/50"><ChevronDown /></button>
            <button onClick={() => movePlayer(-1, 0)} className="absolute left-1 p-2 active:scale-75 transition-all text-blue-400/50"><ChevronRight /></button>
            <button onClick={() => movePlayer(1, 0)} className="absolute right-1 p-2 active:scale-75 transition-all text-blue-400/50"><ChevronLeft /></button>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
              <Compass size={16} className="text-blue-400 animate-spin-slow" />
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Start */}
      <AnimatePresence>
        {entering && (
          <motion.div 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-black tracking-[0.3em] text-blue-500 shadow-blue-500/50"
            >
              GATE RANK {rank}
            </motion.h1>
            <p className="text-white/40 mt-2 font-mono text-xs animate-pulse">يتم الآن فحص مستويات المانا...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encounter Modal */}
      {encounter && (
        <DungeonEncounter 
          room={encounter} 
          onDismiss={() => setEncounter(null)}
          onDefeat={() => {
            encounter.cleared = true;
            addSystemMessage("تمت تصفية التهديد!", "success");
            setEncounter(null);
          }}
        />
      )}
    </motion.div>
  );
};

export default Dungeon;
