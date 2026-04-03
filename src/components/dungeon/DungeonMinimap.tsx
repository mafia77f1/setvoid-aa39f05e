import { motion } from 'framer-motion';
import { DungeonRoom, Position } from './DungeonTypes';

interface MinimapProps {
  grid: DungeonRoom[][];
  playerPos: Position;
  themeColor: string;
}

const CELL = 6;

export const DungeonMinimap = ({ grid, playerPos, themeColor }: MinimapProps) => {
  const size = grid.length;

  return (
    <div
      className="rounded-xl border p-2 backdrop-blur-xl"
      style={{
        background: 'rgba(0,0,0,0.85)',
        borderColor: `${themeColor}30`,
        boxShadow: `0 0 20px ${themeColor}15, inset 0 0 15px rgba(0,0,0,0.5)`,
      }}
    >
      <div className="text-[7px] tracking-[0.3em] uppercase font-mono mb-1.5 text-center" style={{ color: `${themeColor}80` }}>
        MAP
      </div>
      <div
        className="relative rounded-lg overflow-hidden"
        style={{ width: size * CELL, height: size * CELL, border: `1px solid ${themeColor}20` }}
      >
        {grid.map((row, y) =>
          row.map((room, x) => (
            <div
              key={`${x}-${y}`}
              className="absolute"
              style={{
                left: x * CELL,
                top: y * CELL,
                width: CELL,
                height: CELL,
                background: !room.revealed
                  ? '#0a0a0f'
                  : room.type === 'boss' && !room.cleared
                  ? 'rgba(239,68,68,0.6)'
                  : room.type === 'monster' && !room.cleared
                  ? 'rgba(239,68,68,0.3)'
                  : room.type === 'treasure' && !room.cleared
                  ? 'rgba(245,158,11,0.4)'
                  : room.visited
                  ? 'rgba(100,120,140,0.15)'
                  : 'rgba(60,70,80,0.1)',
                borderRight: x < size - 1 ? '1px solid rgba(255,255,255,0.03)' : undefined,
                borderBottom: y < size - 1 ? '1px solid rgba(255,255,255,0.03)' : undefined,
              }}
            />
          ))
        )}
        {/* Player dot */}
        <motion.div
          className="absolute rounded-full z-10"
          animate={{
            boxShadow: [
              `0 0 4px ${themeColor}`,
              `0 0 8px ${themeColor}`,
              `0 0 4px ${themeColor}`,
            ],
          }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            left: playerPos.x * CELL + 1,
            top: playerPos.y * CELL + 1,
            width: CELL - 2,
            height: CELL - 2,
            background: themeColor,
            transition: 'left 0.15s, top 0.15s',
          }}
        />
      </div>
    </div>
  );
};
