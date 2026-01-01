import { useMemo } from 'react';

interface RadarChartProps {
  stats: {
    strength: number;
    mind: number;
    spirit: number;
    agility: number;
  };
  maxValue?: number;
  size?: number;
}

export const RadarChart = ({ stats, maxValue = 100, size = 300 }: RadarChartProps) => {
  const center = size / 2;
  const radius = (size / 2) - 40;
  
  const labels = [
    { key: 'strength', label: 'STR', angle: -90 },
    { key: 'mind', label: 'INT', angle: 0 },
    { key: 'spirit', label: 'SPR', angle: 90 },
    { key: 'agility', label: 'AGI', angle: 180 },
  ];

  const getPoint = (angle: number, value: number, maxVal: number) => {
    const normalizedValue = Math.min(value, maxVal) / maxVal;
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + radius * normalizedValue * Math.cos(rad),
      y: center + radius * normalizedValue * Math.sin(rad),
    };
  };

  const getLabelPosition = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const labelRadius = radius + 25;
    return {
      x: center + labelRadius * Math.cos(rad),
      y: center + labelRadius * Math.sin(rad),
    };
  };

  const statPoints = useMemo(() => {
    return labels.map(({ key, angle }) => {
      const value = stats[key as keyof typeof stats] || 0;
      return getPoint(angle, value, maxValue);
    });
  }, [stats, maxValue]);

  const pathData = statPoints.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <svg width={size} height={size} className="mx-auto">
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(200 100% 50%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(200 100% 60%)" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {gridLevels.map((level, i) => {
        const gridPoints = labels.map(({ angle }) => 
          getPoint(angle, maxValue * level, maxValue)
        );
        const gridPath = gridPoints.map((point, j) => 
          `${j === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        ).join(' ') + ' Z';
        
        return (
          <path
            key={i}
            d={gridPath}
            fill="none"
            stroke="hsl(200 100% 50% / 0.2)"
            strokeWidth="1"
          />
        );
      })}

      {labels.map(({ angle }, i) => {
        const endPoint = getPoint(angle, maxValue, maxValue);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="hsl(200 100% 50% / 0.3)"
            strokeWidth="1"
          />
        );
      })}

      <path
        d={pathData}
        fill="url(#radarFill)"
        stroke="hsl(200 100% 60%)"
        strokeWidth="2"
        filter="url(#glow)"
        className="transition-all duration-500"
      />

      {statPoints.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="5"
          fill="hsl(200 100% 60%)"
          stroke="hsl(200 100% 80%)"
          strokeWidth="2"
          filter="url(#glow)"
        />
      ))}

      {labels.map(({ label, angle }, i) => {
        const pos = getLabelPosition(angle);
        return (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="hsl(200 100% 70%)"
            fontSize="12"
            fontWeight="bold"
            className="font-mono"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};
