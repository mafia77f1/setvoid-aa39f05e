import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Sparkles, ArrowLeft, Swords, Heart, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Position { x: number; y: number; }

interface CaveItem {
  id: string;
  pos: Position;
  type: 'loot' | 'portal' | 'enemy';
  name: string;
  icon: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  collected?: boolean;
  hp?: number;
  maxHp?: number;
  damage?: number;
  defeated?: boolean;
}

const RARITY_COLORS: Record<string, string> = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

const CAVE_WIDTH = 20;
const CAVE_HEIGHT = 24;
const TILE_SIZE = 40;

// Generate a more complex cave with corridors and rooms
const generateCaveMap = (): number[][] => {
  const map: number[][] = Array.from({ length: CAVE_HEIGHT }, () => Array(CAVE_WIDTH).fill(1));

  // Carve rooms
  const rooms = [
    { x: 2, y: 20, w: 5, h: 3 },   // Start room
    { x: 8, y: 18, w: 4, h: 4 },
    { x: 14, y: 19, w: 4, h: 3 },
    { x: 3, y: 14, w: 4, h: 3 },
    { x: 10, y: 13, w: 5, h: 4 },
    { x: 15, y: 12, w: 3, h: 3 },
    { x: 1, y: 8, w: 4, h: 4 },
    { x: 7, y: 7, w: 6, h: 4 },
    { x: 15, y: 6, w: 3, h: 4 },
    { x: 5, y: 2, w: 4, h: 3 },
    { x: 11, y: 1, w: 5, h: 3 },   // Boss room
  ];

  rooms.forEach(r => {
    for (let y = r.y; y < r.y + r.h && y < CAVE_HEIGHT; y++) {
      for (let x = r.x; x < r.x + r.w && x < CAVE_WIDTH; x++) {
        if (x > 0 && x < CAVE_WIDTH - 1 && y > 0 && y < CAVE_HEIGHT - 1) map[y][x] = 0;
      }
    }
  });

  // Carve corridors between rooms
  const corridors: [Position, Position][] = [
    [{ x: 6, y: 21 }, { x: 8, y: 19 }],
    [{ x: 11, y: 19 }, { x: 14, y: 20 }],
    [{ x: 4, y: 20 }, { x: 4, y: 15 }],
    [{ x: 6, y: 15 }, { x: 10, y: 15 }],
    [{ x: 14, y: 14 }, { x: 15, y: 13 }],
    [{ x: 3, y: 14 }, { x: 3, y: 10 }],
    [{ x: 4, y: 9 }, { x: 7, y: 9 }],
    [{ x: 12, y: 13 }, { x: 12, y: 10 }],
    [{ x: 12, y: 8 }, { x: 15, y: 8 }],
    [{ x: 9, y: 7 }, { x: 9, y: 4 }],
    [{ x: 8, y: 3 }, { x: 11, y: 2 }],
    [{ x: 16, y: 6 }, { x: 16, y: 4 }],
    [{ x: 14, y: 3 }, { x: 16, y: 3 }],
  ];

  corridors.forEach(([a, b]) => {
    let cx = a.x, cy = a.y;
    while (cx !== b.x || cy !== b.y) {
      if (cx > 0 && cx < CAVE_WIDTH - 1 && cy > 0 && cy < CAVE_HEIGHT - 1) {
        map[cy][cx] = 0;
        // Make corridors 2 wide sometimes
        if (cx + 1 < CAVE_WIDTH - 1) map[cy][cx + 1] = 0;
      }
      if (cx < b.x) cx++;
      else if (cx > b.x) cx--;
      else if (cy < b.y) cy++;
      else if (cy > b.y) cy--;
    }
    if (cx > 0 && cx < CAVE_WIDTH - 1 && cy > 0 && cy < CAVE_HEIGHT - 1) map[cy][cx] = 0;
  });

  return map;
};

const CAVE_MAP = generateCaveMap();

const LOOT_BY_RANK: Record<string, Omit<CaveItem, 'id' | 'pos' | 'type'>[]> = {
  E: [
    { name: 'حجر طاقة صغير', icon: '💎', rarity: 'common' },
    { name: 'عشبة شفاء', icon: '🌿', rarity: 'common' },
    { name: 'جرعة صغيرة', icon: '🧪', rarity: 'common' },
  ],
  D: [
    { name: 'حجر طاقة', icon: '💎', rarity: 'common' },
    { name: 'درع خفيف', icon: '🛡️', rarity: 'rare' },
    { name: 'جرعة مانا', icon: '🧪', rarity: 'common' },
    { name: 'خاتم بسيط', icon: '💍', rarity: 'common' },
  ],
  C: [
    { name: 'حجر طاقة نادر', icon: '💠', rarity: 'rare' },
    { name: 'سيف قديم', icon: '⚔️', rarity: 'rare' },
    { name: 'تعويذة حماية', icon: '📜', rarity: 'rare' },
    { name: 'درع متين', icon: '🛡️', rarity: 'rare' },
  ],
  B: [
    { name: 'حجر طاقة ملحمي', icon: '🔮', rarity: 'epic' },
    { name: 'خوذة الظلام', icon: '⛑️', rarity: 'epic' },
    { name: 'خاتم القوة', icon: '💍', rarity: 'rare' },
    { name: 'سيف ملحمي', icon: '⚔️', rarity: 'epic' },
  ],
  A: [
    { name: 'حجر طاقة أسطوري', icon: '✨', rarity: 'legendary' },
    { name: 'درع التنين', icon: '🐉', rarity: 'epic' },
    { name: 'سهم ناري', icon: '🏹', rarity: 'epic' },
    { name: 'عباءة الظلام', icon: '🧥', rarity: 'legendary' },
  ],
  S: [
    { name: 'جوهرة الظلام', icon: '🌑', rarity: 'legendary' },
    { name: 'تاج الإمبراطور', icon: '👑', rarity: 'legendary' },
    { name: 'روح الظلام', icon: '💀', rarity: 'legendary' },
    { name: 'سيف القيامة', icon: '⚔️', rarity: 'legendary' },
    { name: 'درع الإمبراطور', icon: '🛡️', rarity: 'legendary' },
  ],
};

const LOOT_POSITIONS: Position[] = [
  { x: 3, y: 21 }, { x: 9, y: 19 }, { x: 15, y: 20 },
  { x: 4, y: 15 }, { x: 11, y: 14 }, { x: 16, y: 13 },
  { x: 2, y: 9 }, { x: 9, y: 8 }, { x: 16, y: 7 },
  { x: 6, y: 3 },
];

const ENEMY_POSITIONS: Position[] = [
  { x: 10, y: 19 }, { x: 5, y: 15 }, { x: 12, y: 14 },
  { x: 3, y: 9 }, { x: 10, y: 8 }, { x: 8, y: 3 },
];

const ENEMIES_BY_RANK: Record<string, { name: string; icon: string; hp: number; damage: number }[]> = {
  E: [
    { name: 'جرذ المغارة', icon: '🐀', hp: 20, damage: 3 },
    { name: 'خفاش الظلام', icon: '🦇', hp: 15, damage: 2 },
  ],
  D: [
    { name: 'عنكبوت سام', icon: '🕷️', hp: 40, damage: 5 },
    { name: 'هيكل عظمي', icon: '💀', hp: 50, damage: 6 },
  ],
  C: [
    { name: 'غول الظلام', icon: '👹', hp: 80, damage: 10 },
    { name: 'فارس ميت', icon: '⚔️', hp: 100, damage: 12 },
  ],
  B: [
    { name: 'تنين صغير', icon: '🐲', hp: 150, damage: 18 },
    { name: 'شيطان ناري', icon: '😈', hp: 130, damage: 20 },
  ],
  A: [
    { name: 'حارس الظلام', icon: '🗿', hp: 250, damage: 30 },
    { name: 'وحش الهاوية', icon: '👾', hp: 300, damage: 35 },
  ],
  S: [
    { name: 'لورد الظلام', icon: '🌑', hp: 500, damage: 50 },
    { name: 'إمبراطور الأشباح', icon: '👻', hp: 450, damage: 55 },
  ],
};

const PORTAL_POS: Position = { x: 13, y: 2 };

const Dungeon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rank = (searchParams.get('rank') || 'E').toUpperCase();

  const [playerPos, setPlayerPos] = useState<Position>({ x: 4, y: 21 });
  const [playerDir, setPlayerDir] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [items, setItems] = useState<CaveItem[]>([]);
  const [collected, setCollected] = useState<CaveItem[]>([]);
  const [showLoot, setShowLoot] = useState<CaveItem | null>(null);
  const [entering, setEntering] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [playerHp, setPlayerHp] = useState(100);
  const [combatEnemy, setCombatEnemy] = useState<CaveItem | null>(null);
  const [combatDamageNumbers, setCombatDamageNumbers] = useState<{ id: number; value: number; x: number; y: number; isPlayer?: boolean }[]>([]);
  const [combatShake, setCombatShake] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  let damageCounter = useRef(0);

  // Joystick state
  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickCenter = useRef<Position>({ x: 0, y: 0 });
  const joystickActive = useRef(false);
  const [joystickPos, setJoystickPos] = useState<Position>({ x: 0, y: 0 });
  const moveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMoveDir = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  // Torch flicker
  const [torchFlicker, setTorchFlicker] = useState(1);

  useEffect(() => {
    const iv = setInterval(() => setTorchFlicker(0.85 + Math.random() * 0.3), 150);
    return () => clearInterval(iv);
  }, []);

  // Init items
  useEffect(() => {
    const lootData = LOOT_BY_RANK[rank] || LOOT_BY_RANK['E'];
    const caveItems: CaveItem[] = lootData.map((l, i) => ({
      ...l,
      id: `loot-${i}`,
      pos: LOOT_POSITIONS[i % LOOT_POSITIONS.length],
      type: 'loot' as const,
    }));
    caveItems.push({
      id: 'portal',
      pos: PORTAL_POS,
      type: 'portal',
      name: 'بوابة الزعيم',
      icon: '🌀',
    });
    setItems(caveItems);
    setTimeout(() => setEntering(false), 2500);
  }, [rank]);

  // Scroll viewport to player
  useEffect(() => {
    if (viewportRef.current) {
      const px = playerPos.x * TILE_SIZE;
      const py = playerPos.y * TILE_SIZE;
      viewportRef.current.scrollTo({
        left: px - viewportRef.current.clientWidth / 2 + TILE_SIZE / 2,
        top: py - viewportRef.current.clientHeight / 2 + TILE_SIZE / 2,
        behavior: 'smooth',
      });
    }
  }, [playerPos]);

  const canMove = useCallback((x: number, y: number) => {
    if (x < 0 || x >= CAVE_WIDTH || y < 0 || y >= CAVE_HEIGHT) return false;
    return CAVE_MAP[y][x] === 0;
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (dx > 0) setPlayerDir('right');
    else if (dx < 0) setPlayerDir('left');
    else if (dy < 0) setPlayerDir('up');
    else if (dy > 0) setPlayerDir('down');

    setPlayerPos(prev => {
      const nx = prev.x + dx;
      const ny = prev.y + dy;
      if (!canMove(nx, ny)) return prev;

      const hitItem = items.find(i => i.pos.x === nx && i.pos.y === ny && !i.collected);
      if (hitItem) {
        if (hitItem.type === 'loot') {
          setTimeout(() => {
            setItems(p => p.map(i => i.id === hitItem.id ? { ...i, collected: true } : i));
            setCollected(p => [...p, hitItem]);
            setShowLoot(hitItem);
            setTimeout(() => setShowLoot(null), 2000);
          }, 0);
        } else if (hitItem.type === 'portal') {
          setTimeout(() => navigate(`/battle?rank=${rank}`), 0);
          return prev;
        }
      }
      setTimeout(() => {
        setIsMoving(true);
        setTimeout(() => setIsMoving(false), 150);
      }, 0);
      return { x: nx, y: ny };
    });
  }, [canMove, items, navigate, rank]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (entering) return;
      switch (e.key) {
        case 'ArrowUp': case 'w': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': movePlayer(1, 0); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [movePlayer, entering]);

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
    const cx = Math.cos(angle) * clampedDist;
    const cy = Math.sin(angle) * clampedDist;
    setJoystickPos({ x: cx, y: cy });

    if (dist > 15) {
      let mdx = 0, mdy = 0;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX > absY) {
        mdx = dx > 0 ? 1 : -1;
      } else {
        mdy = dy > 0 ? 1 : -1;
      }

      if (mdx !== lastMoveDir.current.dx || mdy !== lastMoveDir.current.dy) {
        lastMoveDir.current = { dx: mdx, dy: mdy };
        if (moveTimerRef.current) clearInterval(moveTimerRef.current);
        movePlayer(mdx, mdy);
        moveTimerRef.current = setInterval(() => movePlayer(mdx, mdy), 180);
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

  const totalLoot = items.filter(i => i.type === 'loot').length;
  const collectedCount = collected.length;

  // Wall tile variations
  const getWallStyle = (x: number, y: number): React.CSSProperties => {
    const seed = (x * 7 + y * 13) % 5;
    const colors = [
      'linear-gradient(135deg, #1a1510 0%, #2a2015 50%, #1a1510 100%)',
      'linear-gradient(135deg, #1c1812 0%, #2c2218 50%, #1c1812 100%)',
      'linear-gradient(135deg, #181410 0%, #281e14 50%, #181410 100%)',
      'linear-gradient(135deg, #1e1a14 0%, #2e2418 50%, #1e1a14 100%)',
      'linear-gradient(135deg, #161210 0%, #261c14 50%, #161210 100%)',
    ];
    return {
      background: colors[seed],
      boxShadow: 'inset 0 0 12px rgba(0,0,0,0.8), inset 0 2px 4px rgba(80,60,30,0.1)',
    };
  };

  const getFloorStyle = (x: number, y: number): React.CSSProperties => {
    const seed = (x * 3 + y * 7) % 4;
    const shades = ['#0d0b08', '#0e0c09', '#0c0a07', '#0f0d0a'];
    return {
      background: shades[seed],
      boxShadow: 'inset 0 0 3px rgba(0,0,0,0.3)',
    };
  };

  const getRankColor = () => {
    const colors: Record<string, string> = { E: '#6b7280', D: '#22c55e', C: '#3b82f6', B: '#a855f7', A: '#f59e0b', S: '#ef4444' };
    return colors[rank] || '#6b7280';
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden select-none flex flex-col" dir="rtl">
      {/* Entering cinematic */}
      <AnimatePresence>
        {entering && (
          <motion.div
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="text-6xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🕳️
              </motion.div>
              <h1 className="text-2xl font-black tracking-[0.3em]" style={{ color: getRankColor() }}>
                دخول المغارة
              </h1>
              <p className="text-[10px] text-stone-600 tracking-[0.5em] uppercase">RANK {rank} DUNGEON</p>
              <div className="w-48 h-1.5 mx-auto bg-stone-900 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${getRankColor()}, ${getRankColor()}cc)` }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                />
              </div>
              <motion.p
                className="text-[9px] text-stone-700 tracking-widest"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                احذر من الظلام...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimap */}
      {showMap && !entering && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 left-2 z-40 bg-black/90 border border-stone-700/30 rounded-lg p-2 backdrop-blur-md"
        >
          <div className="flex items-center gap-1 mb-1.5">
            <Map className="w-3 h-3 text-stone-500" />
            <span className="text-[7px] text-stone-500 tracking-[0.2em] uppercase">الخريطة</span>
          </div>
          <div className="relative" style={{ width: CAVE_WIDTH * 4, height: CAVE_HEIGHT * 4 }}>
            {CAVE_MAP.map((row, y) =>
              row.map((cell, x) => (
                <div key={`m-${x}-${y}`} className="absolute" style={{
                  left: x * 4, top: y * 4, width: 4, height: 4,
                  background: cell === 1 ? '#292018' : '#0d0b08',
                  borderRadius: cell === 1 ? 0 : 0.5,
                }} />
              ))
            )}
            {items.filter(i => !i.collected).map(item => (
              <motion.div key={item.id} className="absolute rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  left: item.pos.x * 4 + 0.5, top: item.pos.y * 4 + 0.5,
                  width: 3, height: 3,
                  background: item.type === 'portal' ? '#ef4444' : '#f59e0b',
                  boxShadow: item.type === 'portal' ? '0 0 6px #ef4444' : '0 0 4px #f59e0b',
                }}
              />
            ))}
            <motion.div className="absolute rounded-full"
              animate={{ boxShadow: ['0 0 4px #22d3ee', '0 0 8px #22d3ee', '0 0 4px #22d3ee'] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                left: playerPos.x * 4 - 0.5, top: playerPos.y * 4 - 0.5,
                width: 5, height: 5, background: '#22d3ee',
                transition: 'left 0.15s, top 0.15s',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 px-0.5">
            <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-full bg-cyan-400" /><span className="text-[5px] text-stone-600">أنت</span></div>
            <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[5px] text-stone-600">غنيمة</span></div>
            <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[5px] text-stone-600">بوابة</span></div>
          </div>
        </motion.div>
      )}

      {/* Map toggle */}
      {!entering && (
        <button onClick={() => setShowMap(p => !p)}
          className="absolute top-2 right-2 z-40 w-9 h-9 rounded-xl bg-stone-900/80 border border-stone-700/30 flex items-center justify-center backdrop-blur-md active:scale-90 transition-transform">
          <Map className="w-4 h-4 text-stone-500" />
        </button>
      )}

      {/* Loot counter */}
      {!entering && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-black/90 border border-amber-500/20 rounded-full px-4 py-1.5 flex items-center gap-2 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] text-amber-300 font-bold">{collectedCount}/{totalLoot}</span>
        </motion.div>
      )}

      {/* Loot popup */}
      <AnimatePresence>
        {showLoot && (
          <motion.div
            className="absolute top-1/4 left-1/2 z-50"
            initial={{ x: '-50%', scale: 0.5, opacity: 0 }}
            animate={{ x: '-50%', scale: 1, opacity: 1 }}
            exit={{ x: '-50%', scale: 0.8, opacity: 0, y: -30 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className="bg-black/95 border-2 rounded-2xl px-8 py-5 text-center space-y-2 backdrop-blur-md"
              style={{ borderColor: RARITY_COLORS[showLoot.rarity || 'common'] + '80', boxShadow: `0 0 40px ${RARITY_COLORS[showLoot.rarity || 'common']}40` }}>
              <motion.span
                className="text-4xl block"
                animate={{ y: [0, -8, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.8 }}
              >
                {showLoot.icon}
              </motion.span>
              <p className="text-sm font-black" style={{ color: RARITY_COLORS[showLoot.rarity || 'common'] }}>
                {showLoot.name}
              </p>
              <p className="text-[8px] uppercase tracking-[0.3em] font-bold"
                style={{ color: RARITY_COLORS[showLoot.rarity || 'common'] + 'aa' }}>
                {showLoot.rarity}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cave viewport */}
      <div ref={viewportRef} className="flex-1 overflow-hidden relative">
        {/* Darkness overlay - torch light effect */}
        <div className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 180px 200px at ${
              (playerPos.x * TILE_SIZE + TILE_SIZE / 2)}px ${
              (playerPos.y * TILE_SIZE + TILE_SIZE / 2)}px, 
              transparent 0%, 
              rgba(0,0,0,0.3) 40%, 
              rgba(0,0,0,0.7) 60%, 
              rgba(0,0,0,0.92) 80%, 
              rgba(0,0,0,0.98) 100%)`,
            opacity: torchFlicker,
            transition: 'opacity 0.1s',
          }}
        />

        <div className="relative" style={{ width: CAVE_WIDTH * TILE_SIZE, height: CAVE_HEIGHT * TILE_SIZE }}>
          {/* Tiles */}
          {CAVE_MAP.map((row, y) =>
            row.map((cell, x) => (
              <div key={`t-${x}-${y}`} className="absolute" style={{
                left: x * TILE_SIZE, top: y * TILE_SIZE,
                width: TILE_SIZE, height: TILE_SIZE,
                ...(cell === 1 ? getWallStyle(x, y) : getFloorStyle(x, y)),
              }}>
                {cell === 1 && (
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `radial-gradient(circle at ${30 + (x * 17) % 40}% ${20 + (y * 13) % 60}%, rgba(80,60,30,0.15) 1px, transparent 1px)`,
                    backgroundSize: '8px 8px',
                  }} />
                )}
                {cell === 0 && (
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at ${(x * 11) % 100}% ${(y * 7) % 100}%, rgba(60,40,20,0.2) 0.5px, transparent 0.5px)`,
                    backgroundSize: '6px 6px',
                  }} />
                )}
              </div>
            ))
          )}

          {/* Items */}
          {items.filter(i => !i.collected).map(item => (
            <div key={item.id} className="absolute flex items-center justify-center z-10" style={{
              left: item.pos.x * TILE_SIZE, top: item.pos.y * TILE_SIZE,
              width: TILE_SIZE, height: TILE_SIZE,
            }}>
              {item.type === 'portal' ? (
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <motion.div className="absolute inset-0 rounded-full"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)' }}
                  />
                  <motion.div className="absolute inset-1 rounded-full border-2 border-red-500/60"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, rgba(0,0,0,0.8) 100%)', boxShadow: '0 0 25px rgba(239,68,68,0.5)' }}
                  />
                  <motion.span className="text-xl relative z-10"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >🌀</motion.span>
                </div>
              ) : (
                <div className="relative">
                  <motion.div className="absolute -inset-2 rounded-full"
                    animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ background: `radial-gradient(circle, ${RARITY_COLORS[item.rarity || 'common']}50 0%, transparent 70%)` }}
                  />
                  <motion.span className="text-lg relative z-10 block"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >{item.icon}</motion.span>
                </div>
              )}
            </div>
          ))}

          {/* Player */}
          <div className="absolute z-20 flex items-center justify-center" style={{
            left: playerPos.x * TILE_SIZE, top: playerPos.y * TILE_SIZE,
            width: TILE_SIZE, height: TILE_SIZE,
            transition: 'left 0.13s ease-out, top 0.13s ease-out',
          }}>
            <div className="relative">
              {/* Torch glow */}
              <motion.div className="absolute -inset-6 rounded-full"
                animate={{ opacity: [0.4, 0.6, 0.4], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{ background: 'radial-gradient(circle, rgba(255,180,80,0.15) 0%, rgba(255,120,40,0.05) 50%, transparent 70%)' }}
              />
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg",
                "bg-gradient-to-b from-cyan-400 to-cyan-600 border-cyan-300/60 shadow-cyan-500/40",
                isMoving && "scale-110"
              )} style={{ transition: 'transform 0.1s' }}>
                <span className="text-xs" style={{
                  transform: playerDir === 'left' ? 'scaleX(-1)' : playerDir === 'right' ? 'scaleX(1)' : 'none',
                }}>⚔️</span>
              </div>
            </div>
          </div>

          {/* Ambient torch light on player */}
          <div className="absolute z-5 pointer-events-none" style={{
            left: playerPos.x * TILE_SIZE - 80 + TILE_SIZE / 2,
            top: playerPos.y * TILE_SIZE - 80 + TILE_SIZE / 2,
            width: 160, height: 160,
            background: `radial-gradient(circle, rgba(255,160,60,${0.04 * torchFlicker}) 0%, transparent 70%)`,
            transition: 'left 0.13s ease-out, top 0.13s ease-out',
          }} />
        </div>
      </div>

      {/* Joystick */}
      {!entering && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
          <div
            ref={joystickRef}
            className="relative w-28 h-28 rounded-full bg-stone-900/60 border-2 border-stone-700/30 backdrop-blur-md flex items-center justify-center"
            style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)' }}
            onTouchStart={(e) => {
              e.preventDefault();
              handleJoystickStart(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={handleJoystickEnd}
            onMouseDown={(e) => handleJoystickStart(e.clientX, e.clientY)}
            onMouseMove={(e) => { if (joystickActive.current) handleJoystickMove(e.clientX, e.clientY); }}
            onMouseUp={handleJoystickEnd}
            onMouseLeave={handleJoystickEnd}
          >
            {/* Direction indicators */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-stone-600 text-[8px]">▲</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-stone-600 text-[8px]">▼</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-600 text-[8px]">◀</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-600 text-[8px]">▶</div>

            {/* Thumb */}
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-b from-stone-600 to-stone-700 border-2 border-stone-500/40"
              style={{
                transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                boxShadow: '0 4px 15px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.1)',
                transition: joystickActive.current ? 'none' : 'transform 0.2s ease-out',
              }}
            />
          </div>
        </div>
      )}

      {/* Collected loot bar */}
      <AnimatePresence>
        {collected.length > 0 && !entering && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-44 left-1/2 -translate-x-1/2 z-30 flex gap-1.5"
          >
            {collected.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                className="w-9 h-9 rounded-lg bg-black/80 border flex items-center justify-center backdrop-blur-md"
                style={{ borderColor: RARITY_COLORS[item.rarity || 'common'] + '50', boxShadow: `0 0 10px ${RARITY_COLORS[item.rarity || 'common']}20` }}
              >
                <span className="text-sm">{item.icon}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit */}
      {!entering && (
        <button onClick={() => navigate(-1)}
          className="absolute bottom-3 right-3 z-40 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900/80 border border-stone-700/30 text-stone-500 text-[10px] font-bold backdrop-blur-md active:scale-90 transition-transform">
          <ArrowLeft className="w-3 h-3" />
          <span>خروج</span>
        </button>
      )}
    </div>
  );
};

export default Dungeon;
