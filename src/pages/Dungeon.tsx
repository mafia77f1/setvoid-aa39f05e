import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Position {
  x: number;
  y: number;
}

interface CaveItem {
  id: string;
  pos: Position;
  type: 'loot' | 'portal';
  name: string;
  icon: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  collected?: boolean;
}

const RARITY_COLORS: Record<string, string> = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

const CAVE_WIDTH = 12;
const CAVE_HEIGHT = 16;
const TILE_SIZE = 48;

// 1 = wall, 0 = floor
const generateCaveMap = (): number[][] => {
  const map: number[][] = [];
  for (let y = 0; y < CAVE_HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < CAVE_WIDTH; x++) {
      if (x === 0 || x === CAVE_WIDTH - 1 || y === 0 || y === CAVE_HEIGHT - 1) {
        row.push(1);
      } else if (
        (x === 3 && y >= 3 && y <= 5) ||
        (x === 8 && y >= 7 && y <= 10) ||
        (x === 5 && y === 4) ||
        (x === 6 && y === 4) ||
        (x >= 2 && x <= 4 && y === 8) ||
        (x === 9 && y >= 3 && y <= 4) ||
        (x >= 7 && x <= 9 && y === 12)
      ) {
        row.push(1);
      } else {
        row.push(0);
      }
    }
    map.push(row);
  }
  return map;
};

const CAVE_MAP = generateCaveMap();

const LOOT_BY_RANK: Record<string, Omit<CaveItem, 'id' | 'pos' | 'type'>[]> = {
  E: [
    { name: 'حجر طاقة صغير', icon: '💎', rarity: 'common' },
    { name: 'عشبة شفاء', icon: '🌿', rarity: 'common' },
  ],
  D: [
    { name: 'حجر طاقة', icon: '💎', rarity: 'common' },
    { name: 'درع خفيف', icon: '🛡️', rarity: 'rare' },
    { name: 'جرعة مانا', icon: '🧪', rarity: 'common' },
  ],
  C: [
    { name: 'حجر طاقة نادر', icon: '💠', rarity: 'rare' },
    { name: 'سيف قديم', icon: '⚔️', rarity: 'rare' },
    { name: 'تعويذة حماية', icon: '📜', rarity: 'rare' },
  ],
  B: [
    { name: 'حجر طاقة ملحمي', icon: '🔮', rarity: 'epic' },
    { name: 'خوذة الظلام', icon: '⛑️', rarity: 'epic' },
    { name: 'خاتم القوة', icon: '💍', rarity: 'rare' },
  ],
  A: [
    { name: 'حجر طاقة أسطوري', icon: '✨', rarity: 'legendary' },
    { name: 'درع التنين', icon: '🐉', rarity: 'epic' },
    { name: 'سهم ناري', icon: '🏹', rarity: 'epic' },
  ],
  S: [
    { name: 'جوهرة الظلام', icon: '🌑', rarity: 'legendary' },
    { name: 'تاج الإمبراطور', icon: '👑', rarity: 'legendary' },
    { name: 'روح الظلام', icon: '💀', rarity: 'legendary' },
  ],
};

const LOOT_POSITIONS: Position[] = [
  { x: 2, y: 2 }, { x: 6, y: 2 }, { x: 10, y: 3 },
  { x: 1, y: 6 }, { x: 5, y: 7 }, { x: 10, y: 9 },
  { x: 2, y: 11 }, { x: 6, y: 13 }, { x: 10, y: 13 },
];

const PORTAL_POS: Position = { x: 6, y: 1 };

const Dungeon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rank = (searchParams.get('rank') || 'E').toUpperCase();

  const [playerPos, setPlayerPos] = useState<Position>({ x: 6, y: 14 });
  const [items, setItems] = useState<CaveItem[]>([]);
  const [collected, setCollected] = useState<CaveItem[]>([]);
  const [showLoot, setShowLoot] = useState<CaveItem | null>(null);
  const [entering, setEntering] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [portalPulse, setPortalPulse] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<Position | null>(null);
  const moveInterval = useRef<NodeJS.Timeout | null>(null);

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
    setTimeout(() => setEntering(false), 1800);
  }, [rank]);

  // Portal pulse
  useEffect(() => {
    const iv = setInterval(() => setPortalPulse(p => !p), 1200);
    return () => clearInterval(iv);
  }, []);

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
    setPlayerPos(prev => {
      const nx = prev.x + dx;
      const ny = prev.y + dy;
      if (!canMove(nx, ny)) return prev;

      // Check item collision
      const hitItem = items.find(
        i => i.pos.x === nx && i.pos.y === ny && !i.collected
      );
      if (hitItem) {
        if (hitItem.type === 'loot') {
          setItems(prev => prev.map(i => i.id === hitItem.id ? { ...i, collected: true } : i));
          setCollected(prev => [...prev, hitItem]);
          setShowLoot(hitItem);
          setTimeout(() => setShowLoot(null), 1500);
        } else if (hitItem.type === 'portal') {
          navigate(`/battle?rank=${rank}`);
          return prev;
        }
      }

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

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || entering) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < 20) return;
    if (absDx > absDy) {
      movePlayer(dx > 0 ? 1 : -1, 0);
    } else {
      movePlayer(0, dy > 0 ? 1 : -1);
    }
    touchStart.current = null;
  };

  // D-pad handler with repeat
  const startMove = (dx: number, dy: number) => {
    if (entering) return;
    movePlayer(dx, dy);
    moveInterval.current = setInterval(() => movePlayer(dx, dy), 200);
  };
  const stopMove = () => {
    if (moveInterval.current) {
      clearInterval(moveInterval.current);
      moveInterval.current = null;
    }
  };

  const totalLoot = items.filter(i => i.type === 'loot').length;
  const collectedCount = collected.length;

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden select-none flex flex-col" dir="rtl">
      {/* Entering overlay */}
      {entering && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-4">
            <div className="text-4xl animate-pulse">🕳️</div>
            <h1 className="text-xl font-black tracking-[0.3em] text-amber-400/80">دخول المغارة...</h1>
            <p className="text-[10px] text-stone-500 tracking-widest">RANK {rank} DUNGEON</p>
            <div className="w-32 h-1 mx-auto bg-stone-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ animation: 'loading 1.8s linear forwards' }} />
            </div>
          </div>
        </div>
      )}

      {/* Mini-map */}
      {showMap && !entering && (
        <div className="absolute top-2 left-2 z-40 bg-black/80 border border-stone-700/50 rounded-lg p-1.5 backdrop-blur-sm">
          <div className="flex items-center gap-1 mb-1">
            <Map className="w-3 h-3 text-stone-400" />
            <span className="text-[8px] text-stone-400 tracking-wider">الخريطة</span>
          </div>
          <div className="relative" style={{ width: CAVE_WIDTH * 5, height: CAVE_HEIGHT * 5 }}>
            {CAVE_MAP.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className="absolute"
                  style={{
                    left: x * 5,
                    top: y * 5,
                    width: 5,
                    height: 5,
                    background: cell === 1 ? '#44403c' : '#1c1917',
                    borderRadius: cell === 1 ? 0 : 1,
                  }}
                />
              ))
            )}
            {/* Items on map */}
            {items.filter(i => !i.collected).map(item => (
              <div
                key={item.id}
                className="absolute rounded-full"
                style={{
                  left: item.pos.x * 5 + 1,
                  top: item.pos.y * 5 + 1,
                  width: 3,
                  height: 3,
                  background: item.type === 'portal' ? '#ef4444' : '#f59e0b',
                  boxShadow: item.type === 'portal' ? '0 0 4px #ef4444' : '0 0 3px #f59e0b',
                }}
              />
            ))}
            {/* Player on map */}
            <div
              className="absolute rounded-full"
              style={{
                left: playerPos.x * 5,
                top: playerPos.y * 5,
                width: 5,
                height: 5,
                background: '#22d3ee',
                boxShadow: '0 0 6px #22d3ee',
                transition: 'all 0.15s',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-0.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[6px] text-stone-500">أنت</span>
            </div>
            <div className="flex items-center gap-0.5">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[6px] text-stone-500">غنيمة</span>
            </div>
            <div className="flex items-center gap-0.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[6px] text-stone-500">بوابة</span>
            </div>
          </div>
        </div>
      )}

      {/* Toggle map */}
      {!entering && (
        <button
          onClick={() => setShowMap(p => !p)}
          className="absolute top-2 right-2 z-40 w-8 h-8 rounded-lg bg-stone-800/80 border border-stone-700/50 flex items-center justify-center backdrop-blur-sm"
        >
          <Map className="w-4 h-4 text-stone-400" />
        </button>
      )}

      {/* Loot counter */}
      {!entering && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-black/80 border border-amber-500/30 rounded-full px-3 py-1 flex items-center gap-2 backdrop-blur-sm">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] text-amber-300 font-bold">{collectedCount}/{totalLoot}</span>
        </div>
      )}

      {/* Loot popup */}
      {showLoot && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div
            className="bg-black/90 border rounded-xl px-6 py-4 text-center space-y-1 backdrop-blur-md"
            style={{ borderColor: RARITY_COLORS[showLoot.rarity || 'common'] + '60' }}
          >
            <span className="text-3xl block">{showLoot.icon}</span>
            <p className="text-sm font-bold" style={{ color: RARITY_COLORS[showLoot.rarity || 'common'] }}>
              {showLoot.name}
            </p>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: RARITY_COLORS[showLoot.rarity || 'common'] + '99' }}>
              {showLoot.rarity}
            </p>
          </div>
        </div>
      )}

      {/* Cave viewport */}
      <div
        ref={viewportRef}
        className="flex-1 overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative"
          style={{
            width: CAVE_WIDTH * TILE_SIZE,
            height: CAVE_HEIGHT * TILE_SIZE,
          }}
        >
          {/* Render tiles */}
          {CAVE_MAP.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`tile-${x}-${y}`}
                className="absolute"
                style={{
                  left: x * TILE_SIZE,
                  top: y * TILE_SIZE,
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  background: cell === 1
                    ? 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)'
                    : '#0c0a09',
                  borderRight: cell === 0 ? '1px solid #1c191708' : 'none',
                  borderBottom: cell === 0 ? '1px solid #1c191708' : 'none',
                  boxShadow: cell === 1 ? 'inset 0 0 8px rgba(0,0,0,0.5)' : 'none',
                }}
              >
                {cell === 1 && (
                  <>
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'radial-gradient(circle at 30% 40%, #44403c 1px, transparent 1px), radial-gradient(circle at 70% 60%, #44403c 1px, transparent 1px)',
                      backgroundSize: '12px 12px',
                    }} />
                  </>
                )}
              </div>
            ))
          )}

          {/* Render items */}
          {items.filter(i => !i.collected).map(item => (
            <div
              key={item.id}
              className="absolute flex items-center justify-center"
              style={{
                left: item.pos.x * TILE_SIZE,
                top: item.pos.y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
                transition: 'all 0.3s',
              }}
            >
              {item.type === 'portal' ? (
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)',
                      animation: 'pulse 2s ease-in-out infinite',
                      transform: portalPulse ? 'scale(1.3)' : 'scale(1)',
                      transition: 'transform 1.2s ease-in-out',
                    }}
                  />
                  <div
                    className="absolute inset-1 rounded-full border-2 border-red-500/60"
                    style={{
                      background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(0,0,0,0.8) 100%)',
                      boxShadow: '0 0 20px rgba(239,68,68,0.4), inset 0 0 10px rgba(239,68,68,0.2)',
                      animation: 'spin 8s linear infinite',
                    }}
                  />
                  <span className="text-xl relative z-10" style={{ animation: 'spin 4s linear infinite reverse' }}>🌀</span>
                </div>
              ) : (
                <div className="relative">
                  <div
                    className="absolute -inset-1 rounded-full opacity-50"
                    style={{
                      background: `radial-gradient(circle, ${RARITY_COLORS[item.rarity || 'common']}40 0%, transparent 70%)`,
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                  <span className="text-xl relative z-10 block" style={{ animation: 'float 2s ease-in-out infinite' }}>
                    {item.icon}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Player */}
          <div
            className="absolute z-20 flex items-center justify-center"
            style={{
              left: playerPos.x * TILE_SIZE,
              top: playerPos.y * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
              transition: 'left 0.15s ease-out, top 0.15s ease-out',
            }}
          >
            <div className="relative">
              <div
                className="absolute -inset-2 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)',
                }}
              />
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600 border-2 border-cyan-300/60 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-xs">⚔️</span>
              </div>
            </div>
          </div>

          {/* Ambient light around player */}
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: playerPos.x * TILE_SIZE - 100 + TILE_SIZE / 2,
              top: playerPos.y * TILE_SIZE - 100 + TILE_SIZE / 2,
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, rgba(255,200,100,0.06) 0%, transparent 70%)',
              transition: 'left 0.15s ease-out, top 0.15s ease-out',
            }}
          />
        </div>
      </div>

      {/* D-Pad controls */}
      {!entering && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="relative w-36 h-36">
            {/* Up */}
            <button
              onTouchStart={() => startMove(0, -1)}
              onTouchEnd={stopMove}
              onMouseDown={() => startMove(0, -1)}
              onMouseUp={stopMove}
              onMouseLeave={stopMove}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-stone-800/80 border border-stone-600/40 flex items-center justify-center active:bg-stone-700/80 backdrop-blur-sm"
            >
              <span className="text-stone-300 text-lg">▲</span>
            </button>
            {/* Down */}
            <button
              onTouchStart={() => startMove(0, 1)}
              onTouchEnd={stopMove}
              onMouseDown={() => startMove(0, 1)}
              onMouseUp={stopMove}
              onMouseLeave={stopMove}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-stone-800/80 border border-stone-600/40 flex items-center justify-center active:bg-stone-700/80 backdrop-blur-sm"
            >
              <span className="text-stone-300 text-lg">▼</span>
            </button>
            {/* Left */}
            <button
              onTouchStart={() => startMove(-1, 0)}
              onTouchEnd={stopMove}
              onMouseDown={() => startMove(-1, 0)}
              onMouseUp={stopMove}
              onMouseLeave={stopMove}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-stone-800/80 border border-stone-600/40 flex items-center justify-center active:bg-stone-700/80 backdrop-blur-sm"
            >
              <span className="text-stone-300 text-lg">◀</span>
            </button>
            {/* Right */}
            <button
              onTouchStart={() => startMove(1, 0)}
              onTouchEnd={stopMove}
              onMouseDown={() => startMove(1, 0)}
              onMouseUp={stopMove}
              onMouseLeave={stopMove}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-stone-800/80 border border-stone-600/40 flex items-center justify-center active:bg-stone-700/80 backdrop-blur-sm"
            >
              <span className="text-stone-300 text-lg">▶</span>
            </button>
          </div>
        </div>
      )}

      {/* Collected loot bar */}
      {collected.length > 0 && !entering && (
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 z-30 flex gap-1">
          {collected.map(item => (
            <div
              key={item.id}
              className="w-8 h-8 rounded-lg bg-black/70 border flex items-center justify-center backdrop-blur-sm"
              style={{ borderColor: RARITY_COLORS[item.rarity || 'common'] + '40' }}
            >
              <span className="text-sm">{item.icon}</span>
            </div>
          ))}
        </div>
      )}

      {/* Exit button */}
      {!entering && (
        <button
          onClick={() => navigate(-1)}
          className="absolute bottom-2 right-2 z-40 px-3 py-1.5 rounded-lg bg-stone-900/80 border border-stone-700/50 text-stone-500 text-[10px] font-bold backdrop-blur-sm"
        >
          خروج
        </button>
      )}

      <style>{`
        @keyframes loading { from { width: 0; } to { width: 100%; } }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dungeon;
