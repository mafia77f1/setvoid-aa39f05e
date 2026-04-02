import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Sparkles, ArrowLeft, Swords, Heart, Shield, Skull, Flame, Eye } from 'lucide-react';
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

const RARITY_GLOW: Record<string, string> = {
  common: 'rgba(156,163,175,0.3)',
  rare: 'rgba(59,130,246,0.4)',
  epic: 'rgba(168,85,247,0.5)',
  legendary: 'rgba(245,158,11,0.6)',
};

const CAVE_WIDTH = 20;
const CAVE_HEIGHT = 24;
const TILE_SIZE = 40;

const generateCaveMap = (): number[][] => {
  const map: number[][] = Array.from({ length: CAVE_HEIGHT }, () => Array(CAVE_WIDTH).fill(1));
  const rooms = [
    { x: 2, y: 20, w: 5, h: 3 },
    { x: 8, y: 18, w: 4, h: 4 },
    { x: 14, y: 19, w: 4, h: 3 },
    { x: 3, y: 14, w: 4, h: 3 },
    { x: 10, y: 13, w: 5, h: 4 },
    { x: 15, y: 12, w: 3, h: 3 },
    { x: 1, y: 8, w: 4, h: 4 },
    { x: 7, y: 7, w: 6, h: 4 },
    { x: 15, y: 6, w: 3, h: 4 },
    { x: 5, y: 2, w: 4, h: 3 },
    { x: 11, y: 1, w: 5, h: 3 },
  ];
  rooms.forEach(r => {
    for (let y = r.y; y < r.y + r.h && y < CAVE_HEIGHT; y++) {
      for (let x = r.x; x < r.x + r.w && x < CAVE_WIDTH; x++) {
        if (x > 0 && x < CAVE_WIDTH - 1 && y > 0 && y < CAVE_HEIGHT - 1) map[y][x] = 0;
      }
    }
  });
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
  E: [{ name: 'جرذ المغارة', icon: '🐀', hp: 20, damage: 3 }, { name: 'خفاش الظلام', icon: '🦇', hp: 15, damage: 2 }],
  D: [{ name: 'عنكبوت سام', icon: '🕷️', hp: 40, damage: 5 }, { name: 'هيكل عظمي', icon: '💀', hp: 50, damage: 6 }],
  C: [{ name: 'غول الظلام', icon: '👹', hp: 80, damage: 10 }, { name: 'فارس ميت', icon: '⚔️', hp: 100, damage: 12 }],
  B: [{ name: 'تنين صغير', icon: '🐲', hp: 150, damage: 18 }, { name: 'شيطان ناري', icon: '😈', hp: 130, damage: 20 }],
  A: [{ name: 'حارس الظلام', icon: '🗿', hp: 250, damage: 30 }, { name: 'وحش الهاوية', icon: '👾', hp: 300, damage: 35 }],
  S: [{ name: 'لورد الظلام', icon: '🌑', hp: 500, damage: 50 }, { name: 'إمبراطور الأشباح', icon: '👻', hp: 450, damage: 55 }],
};

const PORTAL_POS: Position = { x: 13, y: 2 };

const RANK_THEMES: Record<string, { primary: string; secondary: string; ambient: string; fog: string }> = {
  E: { primary: '#6b7280', secondary: '#4b5563', ambient: 'rgba(107,114,128,0.08)', fog: 'rgba(107,114,128,0.03)' },
  D: { primary: '#22c55e', secondary: '#16a34a', ambient: 'rgba(34,197,94,0.08)', fog: 'rgba(34,197,94,0.03)' },
  C: { primary: '#3b82f6', secondary: '#2563eb', ambient: 'rgba(59,130,246,0.1)', fog: 'rgba(59,130,246,0.04)' },
  B: { primary: '#a855f7', secondary: '#9333ea', ambient: 'rgba(168,85,247,0.12)', fog: 'rgba(168,85,247,0.05)' },
  A: { primary: '#f59e0b', secondary: '#d97706', ambient: 'rgba(245,158,11,0.12)', fog: 'rgba(245,158,11,0.05)' },
  S: { primary: '#ef4444', secondary: '#dc2626', ambient: 'rgba(239,68,68,0.15)', fog: 'rgba(239,68,68,0.06)' },
};

const Dungeon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rank = (searchParams.get('rank') || 'E').toUpperCase();
  const theme = RANK_THEMES[rank] || RANK_THEMES['E'];

  const [playerPos, setPlayerPos] = useState<Position>({ x: 4, y: 21 });
  const [playerDir, setPlayerDir] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [items, setItems] = useState<CaveItem[]>([]);
  const [collected, setCollected] = useState<CaveItem[]>([]);
  const [showLoot, setShowLoot] = useState<CaveItem | null>(null);
  const [entering, setEntering] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  const [playerHp, setPlayerHp] = useState(100);
  const [combatEnemy, setCombatEnemy] = useState<CaveItem | null>(null);
  const [combatDamageNumbers, setCombatDamageNumbers] = useState<{ id: number; value: number; x: number; y: number; isPlayer?: boolean }[]>([]);
  const [combatShake, setCombatShake] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const damageCounter = useRef(0);

  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickCenter = useRef<Position>({ x: 0, y: 0 });
  const joystickActive = useRef(false);
  const [joystickPos, setJoystickPos] = useState<Position>({ x: 0, y: 0 });
  const moveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMoveDir = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const [torchFlicker, setTorchFlicker] = useState(1);
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTorchFlicker(0.82 + Math.random() * 0.36), 120);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const lootData = LOOT_BY_RANK[rank] || LOOT_BY_RANK['E'];
    const caveItems: CaveItem[] = lootData.map((l, i) => ({
      ...l, id: `loot-${i}`, pos: LOOT_POSITIONS[i % LOOT_POSITIONS.length], type: 'loot' as const,
    }));
    const enemyData = ENEMIES_BY_RANK[rank] || ENEMIES_BY_RANK['E'];
    const numEnemies = Math.min(ENEMY_POSITIONS.length, rank === 'E' ? 2 : rank === 'D' ? 3 : rank === 'C' ? 4 : 5);
    for (let i = 0; i < numEnemies; i++) {
      const template = enemyData[i % enemyData.length];
      caveItems.push({ id: `enemy-${i}`, pos: ENEMY_POSITIONS[i], type: 'enemy', name: template.name, icon: template.icon, hp: template.hp, maxHp: template.hp, damage: template.damage, defeated: false });
    }
    caveItems.push({ id: 'portal', pos: PORTAL_POS, type: 'portal', name: 'بوابة الزعيم', icon: '🌀' });
    setItems(caveItems);
    setTimeout(() => setEntering(false), 3000);
  }, [rank]);

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
    if (combatEnemy) return;
    if (dx > 0) setPlayerDir('right');
    else if (dx < 0) setPlayerDir('left');
    else if (dy < 0) setPlayerDir('up');
    else if (dy > 0) setPlayerDir('down');

    setPlayerPos(prev => {
      const nx = prev.x + dx;
      const ny = prev.y + dy;
      if (!canMove(nx, ny)) return prev;

      const hitItem = items.find(i => i.pos.x === nx && i.pos.y === ny && !i.collected && !i.defeated);
      if (hitItem) {
        if (hitItem.type === 'loot') {
          setTimeout(() => {
            setItems(p => p.map(i => i.id === hitItem.id ? { ...i, collected: true } : i));
            setCollected(p => [...p, hitItem]);
            setShowLoot(hitItem);
            setTimeout(() => setShowLoot(null), 2500);
          }, 0);
        } else if (hitItem.type === 'portal') {
          setTimeout(() => navigate(`/battle?rank=${rank}`), 0);
          return prev;
        } else if (hitItem.type === 'enemy') {
          setTimeout(() => setCombatEnemy(hitItem), 0);
          return prev;
        }
      }
      setStepCount(p => p + 1);
      setTimeout(() => { setIsMoving(true); setTimeout(() => setIsMoving(false), 150); }, 0);
      return { x: nx, y: ny };
    });
  }, [canMove, items, navigate, rank, combatEnemy]);

  const attackEnemy = useCallback(() => {
    if (!combatEnemy) return;
    const dmg = 10 + Math.floor(Math.random() * 15);
    const newHp = Math.max(0, (combatEnemy.hp || 0) - dmg);
    damageCounter.current++;
    setCombatDamageNumbers(prev => [...prev, { id: damageCounter.current, value: dmg, x: 50 + Math.random() * 20 - 10, y: 30 }]);
    const currentId = damageCounter.current;
    setTimeout(() => setCombatDamageNumbers(prev => prev.filter(d => d.id !== currentId)), 1000);
    setCombatShake(true);
    setTimeout(() => setCombatShake(false), 200);
    if (newHp <= 0) {
      setItems(p => p.map(i => i.id === combatEnemy.id ? { ...i, defeated: true, collected: true } : i));
      setCollected(p => [...p, { ...combatEnemy, name: `هزمت: ${combatEnemy.name}`, icon: '⚔️', rarity: 'rare' }]);
      setCombatEnemy(null);
    } else {
      setCombatEnemy(prev => prev ? { ...prev, hp: newHp } : null);
      setTimeout(() => {
        const enemyDmg = combatEnemy.damage || 5;
        setPlayerHp(prev => Math.max(0, prev - enemyDmg));
        damageCounter.current++;
        setCombatDamageNumbers(prev => [...prev, { id: damageCounter.current, value: enemyDmg, x: 50, y: 70, isPlayer: true }]);
      }, 500);
    }
  }, [combatEnemy]);

  const fleeFromCombat = useCallback(() => {
    setCombatEnemy(null);
    setPlayerPos(prev => {
      const dirs = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }];
      for (const d of dirs) { if (canMove(prev.x + d.x, prev.y + d.y)) return { x: prev.x + d.x, y: prev.y + d.y }; }
      return prev;
    });
  }, [canMove]);

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
  const enemiesDefeated = items.filter(i => i.type === 'enemy' && i.defeated).length;
  const totalEnemies = items.filter(i => i.type === 'enemy').length;

  const getWallStyle = (x: number, y: number): React.CSSProperties => {
    const seed = (x * 7 + y * 13) % 5;
    const bases = ['#12100d', '#141210', '#100e0b', '#15130f', '#0f0d0a'];
    return {
      background: `linear-gradient(135deg, ${bases[seed]} 0%, ${bases[(seed + 1) % 5]} 100%)`,
      boxShadow: `inset 0 0 15px rgba(0,0,0,0.9), inset 0 1px 2px ${theme.fog}`,
    };
  };

  const getFloorStyle = (x: number, y: number): React.CSSProperties => {
    const seed = (x * 3 + y * 7) % 4;
    const shades = ['#0a0908', '#0b0a09', '#090807', '#0c0b09'];
    return { background: shades[seed] };
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden select-none flex flex-col" dir="rtl">
      
      {/* ═══ ENTERING CINEMATIC ═══ */}
      <AnimatePresence>
        {entering && (
          <motion.div
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Particle burst */}
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
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            >
              {/* Rank emblem */}
              <motion.div
                className="relative mx-auto w-28 h-28 flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute inset-0 rounded-full border-2 opacity-30" style={{ borderColor: theme.primary }} />
                <div className="absolute inset-2 rounded-full border opacity-20" style={{ borderColor: theme.secondary }} />
                <motion.span
                  className="text-5xl relative z-10"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >🕳️</motion.span>
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
                  className="text-[10px] tracking-[0.6em] uppercase mt-3 font-bold"
                  style={{ color: theme.secondary }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1 }}
                >
                  RANK {rank} DUNGEON
                </motion.p>
              </div>

              <motion.div
                className="w-56 h-1 mx-auto rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)` }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                />
              </motion.div>

              <motion.p
                className="text-[9px] tracking-[0.3em] uppercase"
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

      {/* ═══ HUD - TOP BAR ═══ */}
      {!entering && (
        <div className="absolute top-0 left-0 right-0 z-40 p-3 flex items-start justify-between">
          {/* Minimap */}
          {showMap && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/90 border rounded-xl p-2.5 backdrop-blur-xl"
              style={{ borderColor: `${theme.primary}20` }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Map className="w-3 h-3" style={{ color: theme.primary }} />
                <span className="text-[7px] tracking-[0.3em] uppercase font-bold" style={{ color: `${theme.primary}80` }}>الخريطة</span>
              </div>
              <div className="relative rounded-lg overflow-hidden" style={{ width: CAVE_WIDTH * 4, height: CAVE_HEIGHT * 4 }}>
                {CAVE_MAP.map((row, y) =>
                  row.map((cell, x) => (
                    <div key={`m-${x}-${y}`} className="absolute" style={{
                      left: x * 4, top: y * 4, width: 4, height: 4,
                      background: cell === 1 ? '#1a1510' : '#080706',
                    }} />
                  ))
                )}
                {items.filter(i => !i.collected && !i.defeated).map(item => (
                  <motion.div key={item.id} className="absolute rounded-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      left: item.pos.x * 4 + 0.5, top: item.pos.y * 4 + 0.5, width: 3, height: 3,
                      background: item.type === 'portal' ? '#ef4444' : item.type === 'enemy' ? '#ff6b6b' : '#f59e0b',
                      boxShadow: item.type === 'portal' ? '0 0 6px #ef4444' : '0 0 4px #f59e0b',
                    }}
                  />
                ))}
                <motion.div className="absolute rounded-full"
                  animate={{ boxShadow: [`0 0 4px ${theme.primary}`, `0 0 8px ${theme.primary}`, `0 0 4px ${theme.primary}`] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ left: playerPos.x * 4 - 0.5, top: playerPos.y * 4 - 0.5, width: 5, height: 5, background: theme.primary, transition: 'left 0.15s, top 0.15s' }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 px-0.5 gap-2">
                <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-full" style={{ background: theme.primary }} /><span className="text-[5px] text-stone-600">أنت</span></div>
                <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[5px] text-stone-600">غنيمة</span></div>
                <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-[5px] text-stone-600">عدو</span></div>
              </div>
            </motion.div>
          )}

          {/* Right side HUD */}
          <div className="flex flex-col gap-2 items-end">
            {/* Map toggle */}
            <button onClick={() => setShowMap(p => !p)}
              className="w-10 h-10 rounded-xl bg-black/80 border flex items-center justify-center backdrop-blur-xl active:scale-90 transition-transform"
              style={{ borderColor: `${theme.primary}30` }}>
              <Map className="w-4 h-4" style={{ color: `${theme.primary}80` }} />
            </button>

            {/* Player HP */}
            <div className="bg-black/80 border rounded-xl px-3 py-2.5 backdrop-blur-xl min-w-[100px]" style={{ borderColor: `${theme.primary}20` }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Heart className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] font-bold text-red-400">{playerHp}/100</span>
              </div>
              <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-red-500/20">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
                  animate={{ width: `${playerHp}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="bg-black/80 border rounded-xl px-3 py-2 backdrop-blur-xl text-[9px] space-y-1" style={{ borderColor: `${theme.primary}20` }}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 font-bold">{collectedCount}/{totalLoot}</span>
              </div>
              <div className="flex items-center gap-2">
                <Skull className="w-3 h-3 text-red-400" />
                <span className="text-red-300 font-bold">{enemiesDefeated}/{totalEnemies}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3" style={{ color: theme.primary }} />
                <span className="font-bold" style={{ color: theme.primary }}>{stepCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ LOOT POPUP ═══ */}
      <AnimatePresence>
        {showLoot && (
          <motion.div
            className="absolute top-1/4 left-1/2 z-50 pointer-events-none"
            initial={{ x: '-50%', scale: 0, opacity: 0 }}
            animate={{ x: '-50%', scale: 1, opacity: 1 }}
            exit={{ x: '-50%', scale: 0.5, opacity: 0, y: -40 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          >
            <div className="relative bg-black/95 border-2 rounded-2xl px-10 py-6 text-center space-y-3 backdrop-blur-xl"
              style={{ borderColor: RARITY_COLORS[showLoot.rarity || 'common'] + '60', boxShadow: `0 0 60px ${RARITY_GLOW[showLoot.rarity || 'common']}, inset 0 0 30px ${RARITY_GLOW[showLoot.rarity || 'common']}` }}>
              {/* Sparkle particles */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div key={i} className="absolute w-1 h-1 rounded-full"
                  style={{ background: RARITY_COLORS[showLoot.rarity || 'common'], left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                  transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                />
              ))}
              <motion.span className="text-5xl block" animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 0.8 }}>
                {showLoot.icon}
              </motion.span>
              <p className="text-sm font-black tracking-wide" style={{ color: RARITY_COLORS[showLoot.rarity || 'common'] }}>
                {showLoot.name}
              </p>
              <p className="text-[8px] uppercase tracking-[0.4em] font-bold" style={{ color: RARITY_COLORS[showLoot.rarity || 'common'] + '80' }}>
                {showLoot.rarity}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ CAVE VIEWPORT ═══ */}
      <div ref={viewportRef} className="flex-1 overflow-hidden relative">
        {/* Torch light effect */}
        <div className="absolute inset-0 z-30 pointer-events-none" style={{
          background: `radial-gradient(ellipse 200px 220px at ${playerPos.x * TILE_SIZE + TILE_SIZE / 2}px ${playerPos.y * TILE_SIZE + TILE_SIZE / 2}px, 
            transparent 0%, 
            rgba(0,0,0,0.2) 30%,
            rgba(0,0,0,0.6) 50%, 
            rgba(0,0,0,0.88) 70%, 
            rgba(0,0,0,0.97) 100%)`,
          opacity: torchFlicker,
          transition: 'opacity 0.1s',
        }} />

        {/* Ambient rank fog */}
        <div className="absolute inset-0 z-25 pointer-events-none" style={{
          background: `radial-gradient(ellipse 300px 300px at ${playerPos.x * TILE_SIZE + TILE_SIZE / 2}px ${playerPos.y * TILE_SIZE + TILE_SIZE / 2}px, ${theme.fog}, transparent 80%)`,
          transition: 'all 0.3s',
        }} />

        <div className="relative" style={{ width: CAVE_WIDTH * TILE_SIZE, height: CAVE_HEIGHT * TILE_SIZE }}>
          {/* Tiles */}
          {CAVE_MAP.map((row, y) =>
            row.map((cell, x) => (
              <div key={`t-${x}-${y}`} className="absolute" style={{
                left: x * TILE_SIZE, top: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE,
                ...(cell === 1 ? getWallStyle(x, y) : getFloorStyle(x, y)),
              }}>
                {cell === 1 && (
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `radial-gradient(circle at ${30 + (x * 17) % 40}% ${20 + (y * 13) % 60}%, rgba(80,60,30,0.1) 1px, transparent 1px)`,
                    backgroundSize: '10px 10px',
                  }} />
                )}
              </div>
            ))
          )}

          {/* Items & Enemies */}
          {items.filter(i => !i.collected && !i.defeated).map(item => (
            <div key={item.id} className="absolute flex items-center justify-center z-10" style={{
              left: item.pos.x * TILE_SIZE, top: item.pos.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE,
            }}>
              {item.type === 'portal' ? (
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <motion.div className="absolute inset-0 rounded-full"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)' }}
                  />
                  <motion.div className="absolute inset-0.5 rounded-full border-2 border-red-500/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, rgba(0,0,0,0.8) 100%)', boxShadow: '0 0 30px rgba(239,68,68,0.5)' }}
                  />
                  <motion.span className="text-xl relative z-10" animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>🌀</motion.span>
                </div>
              ) : item.type === 'enemy' ? (
                <div className="relative">
                  <motion.div className="absolute -inset-4 rounded-full"
                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.85, 1.2, 0.85] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)' }}
                  />
                  <motion.span className="text-xl relative z-10 block"
                    animate={{ y: [0, -4, 0], x: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >{item.icon}</motion.span>
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-black/90 rounded-full overflow-hidden border border-red-500/30">
                    <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all" style={{ width: `${((item.hp || 0) / (item.maxHp || 1)) * 100}%` }} />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <motion.div className="absolute -inset-3 rounded-full"
                    animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.85, 1.15, 0.85] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ background: `radial-gradient(circle, ${RARITY_COLORS[item.rarity || 'common']}40 0%, transparent 70%)` }}
                  />
                  <motion.span className="text-lg relative z-10 block"
                    animate={{ y: [0, -7, 0] }}
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
              <motion.div className="absolute -inset-8 rounded-full"
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{ background: `radial-gradient(circle, rgba(255,180,80,${0.12 * torchFlicker}) 0%, rgba(255,120,40,0.03) 50%, transparent 70%)` }}
              />
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center border-2 shadow-lg",
                isMoving && "scale-105"
              )} style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                borderColor: `${theme.primary}60`,
                boxShadow: `0 0 20px ${theme.primary}40, inset 0 1px 3px rgba(255,255,255,0.15)`,
                transition: 'transform 0.1s',
              }}>
                <span className="text-xs" style={{
                  transform: playerDir === 'left' ? 'scaleX(-1)' : playerDir === 'right' ? 'scaleX(1)' : 'none',
                  filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
                }}>⚔️</span>
              </div>
            </div>
          </div>

          {/* Ambient torch */}
          <div className="absolute z-5 pointer-events-none" style={{
            left: playerPos.x * TILE_SIZE - 100 + TILE_SIZE / 2,
            top: playerPos.y * TILE_SIZE - 100 + TILE_SIZE / 2,
            width: 200, height: 200,
            background: `radial-gradient(circle, rgba(255,160,60,${0.05 * torchFlicker}) 0%, transparent 70%)`,
            transition: 'left 0.13s ease-out, top 0.13s ease-out',
          }} />
        </div>
      </div>

      {/* ═══ COMBAT OVERLAY ═══ */}
      <AnimatePresence>
        {combatEnemy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6"
            style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.1), rgba(0,0,0,0.92) 70%)' }}
          >
            {/* Enemy */}
            <motion.div
              animate={combatShake ? { x: [-8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.2 }}
              className="text-center mb-10"
            >
              <motion.div
                className="relative inline-block mb-4"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div className="absolute -inset-8 rounded-full"
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)' }}
                />
                <span className="text-7xl block relative z-10">{combatEnemy.icon}</span>
              </motion.div>
              <h3 className="text-xl font-black text-red-400 tracking-wider mb-3">{combatEnemy.name}</h3>
              <div className="w-52 h-3 bg-black rounded-full overflow-hidden mx-auto border border-red-500/40" style={{ boxShadow: '0 0 15px rgba(239,68,68,0.2)' }}>
                <motion.div
                  className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 rounded-full"
                  style={{ width: `${((combatEnemy.hp || 0) / (combatEnemy.maxHp || 1)) * 100}%` }}
                  layout
                />
              </div>
              <p className="text-[10px] text-red-400/60 mt-1.5 font-mono tracking-wider">{combatEnemy.hp}/{combatEnemy.maxHp} HP</p>
            </motion.div>

            {/* Damage Numbers */}
            <AnimatePresence>
              {combatDamageNumbers.map(d => (
                <motion.div
                  key={d.id}
                  className={cn("absolute text-3xl font-black", d.isPlayer ? "text-red-500" : "text-yellow-400")}
                  style={{ left: `${d.x}%`, top: `${d.y}%`, textShadow: d.isPlayer ? '0 0 20px rgba(239,68,68,0.8)' : '0 0 20px rgba(245,158,11,0.8)' }}
                  initial={{ opacity: 1, y: 0, scale: 1.5 }}
                  animate={{ opacity: 0, y: -80, scale: 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  -{d.value}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Player HP */}
            <div className="mb-8 text-center">
              <div className="flex items-center gap-2 mb-1.5 justify-center">
                <Shield className="w-4 h-4" style={{ color: theme.primary }} />
                <span className="text-xs font-bold" style={{ color: theme.primary }}>HP: {playerHp}/100</span>
              </div>
              <div className="w-44 h-2.5 bg-black rounded-full overflow-hidden border" style={{ borderColor: `${theme.primary}40` }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${playerHp}%`, background: `linear-gradient(90deg, ${theme.secondary}, ${theme.primary})` }} />
              </div>
            </div>

            {/* Combat buttons */}
            <div className="flex gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={attackEnemy}
                className="flex items-center gap-3 px-10 py-5 text-white font-black text-base tracking-wider rounded-2xl border-2 border-red-500/40"
                style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.3), rgba(185,28,28,0.5))', boxShadow: '0 0 30px rgba(239,68,68,0.3), inset 0 1px 2px rgba(255,255,255,0.05)' }}
              >
                <Swords className="w-6 h-6" />
                هجوم
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={fleeFromCombat}
                className="flex items-center gap-3 px-8 py-5 text-stone-300 font-bold text-base tracking-wider rounded-2xl border border-stone-600/40 bg-stone-900/50 backdrop-blur-md"
              >
                هروب
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ JOYSTICK ═══ */}
      {!entering && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
          <div
            ref={joystickRef}
            className="relative w-32 h-32 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)`,
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
            {/* Direction indicators */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[8px]" style={{ color: `${theme.primary}40` }}>▲</div>
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[8px]" style={{ color: `${theme.primary}40` }}>▼</div>
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[8px]" style={{ color: `${theme.primary}40` }}>◀</div>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px]" style={{ color: `${theme.primary}40` }}>▶</div>

            <motion.div
              className="w-14 h-14 rounded-full border-2"
              style={{
                background: `linear-gradient(135deg, ${theme.secondary}90, ${theme.primary}60)`,
                borderColor: `${theme.primary}40`,
                transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 15px ${theme.primary}20, inset 0 1px 3px rgba(255,255,255,0.1)`,
                transition: joystickActive.current ? 'none' : 'transform 0.2s ease-out',
              }}
            />
          </div>
        </div>
      )}

      {/* ═══ COLLECTED LOOT BAR ═══ */}
      <AnimatePresence>
        {collected.length > 0 && !entering && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-44 left-1/2 -translate-x-1/2 z-30 flex gap-2"
          >
            {collected.slice(-6).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.08, type: 'spring', damping: 12 }}
                className="w-10 h-10 rounded-xl bg-black/90 border flex items-center justify-center backdrop-blur-xl"
                style={{ borderColor: RARITY_COLORS[item.rarity || 'common'] + '40', boxShadow: `0 0 12px ${RARITY_GLOW[item.rarity || 'common']}` }}
              >
                <span className="text-sm">{item.icon}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ EXIT BUTTON ═══ */}
      {!entering && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate(-1)}
          className="absolute bottom-3 right-3 z-40 flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-xl active:scale-90 transition-transform"
          style={{
            background: 'rgba(0,0,0,0.7)',
            border: `1px solid ${theme.primary}20`,
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5" style={{ color: `${theme.primary}80` }} />
          <span className="text-[10px] font-bold tracking-wider" style={{ color: `${theme.primary}80` }}>خروج</span>
        </motion.button>
      )}
    </div>
  );
};

export default Dungeon;
