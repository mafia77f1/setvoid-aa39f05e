import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Shield, Sword, CircleUser, Footprints } from 'lucide-react';

interface EquipmentSlot {
  id: string;
  name: string;
  nameAr: string;
  icon: React.ReactNode;
  equipped: string | null;
  position: { top: string; left: string };
  lineDirection: 'left' | 'right';
}

interface EquipmentCardProps {
  totalLevel: number;
  onSlotClick?: (slotId: string) => void;
}

export const EquipmentCard = ({ totalLevel, onSlotClick }: EquipmentCardProps) => {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const equipmentSlots: EquipmentSlot[] = [
    { 
      id: 'head', 
      name: 'Head', 
      nameAr: 'الرأس', 
      icon: <CircleUser className="w-5 h-5" />,
      equipped: null,
      position: { top: '5%', left: '50%' },
      lineDirection: 'right'
    },
    { 
      id: 'chest', 
      name: 'Chest', 
      nameAr: 'الصدر', 
      icon: <Shield className="w-5 h-5" />,
      equipped: null,
      position: { top: '30%', left: '50%' },
      lineDirection: 'left'
    },
    { 
      id: 'weapon', 
      name: 'Weapon', 
      nameAr: 'السلاح', 
      icon: <Sword className="w-5 h-5" />,
      equipped: null,
      position: { top: '55%', left: '25%' },
      lineDirection: 'left'
    },
    { 
      id: 'legs', 
      name: 'Legs', 
      nameAr: 'الأرجل', 
      icon: <Footprints className="w-5 h-5" />,
      equipped: null,
      position: { top: '80%', left: '50%' },
      lineDirection: 'right'
    },
  ];

  // Determine color based on level
  const getLevelColor = () => {
    if (totalLevel >= 40) return { color: 'hsl(270 100% 60%)', glow: 'hsl(270 100% 60% / 0.5)', class: 'purple' };
    if (totalLevel >= 20) return { color: 'hsl(210 100% 60%)', glow: 'hsl(210 100% 60% / 0.5)', class: 'blue' };
    return { color: 'hsl(0 0% 80%)', glow: 'hsl(0 0% 80% / 0.3)', class: 'white' };
  };

  const levelColor = getLevelColor();

  return (
    <div className="system-panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-primary">المعدات</h3>
        <span className="text-xs text-muted-foreground">المستوى: {totalLevel}</span>
      </div>

      <div className="relative h-[400px] rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, hsl(210 50% 6%), hsl(210 60% 3%))',
          border: `2px solid ${levelColor.color}`,
          boxShadow: `0 0 40px ${levelColor.glow}, inset 0 0 60px ${levelColor.glow}`
        }}
      >
        {/* Corner decorations */}
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 opacity-70" style={{ borderColor: levelColor.color }} />
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 opacity-70" style={{ borderColor: levelColor.color }} />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 opacity-70" style={{ borderColor: levelColor.color }} />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 opacity-70" style={{ borderColor: levelColor.color }} />
        
        {/* Dots decoration */}
        <div className="absolute top-3 right-12 flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: levelColor.color, opacity: 0.6 }} />
          ))}
        </div>
        <div className="absolute bottom-3 left-12 flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: levelColor.color, opacity: 0.6 }} />
          ))}
        </div>

        {/* Character Silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            viewBox="0 0 120 200" 
            className="w-32 h-56"
            style={{
              filter: `drop-shadow(0 0 20px ${levelColor.glow}) drop-shadow(0 0 40px ${levelColor.glow})`
            }}
          >
            {/* Aura effect */}
            <ellipse 
              cx="60" cy="100" rx="45" ry="85" 
              fill="none" 
              stroke={levelColor.color}
              strokeWidth="0.5"
              opacity="0.3"
              className="animate-aura-pulse"
            />
            
            {/* Head */}
            <ellipse cx="60" cy="22" rx="18" ry="20" fill="none" stroke={levelColor.color} strokeWidth="1.5" />
            
            {/* Neck */}
            <line x1="60" y1="42" x2="60" y2="50" stroke={levelColor.color} strokeWidth="1.5" />
            
            {/* Shoulders */}
            <line x1="30" y1="55" x2="90" y2="55" stroke={levelColor.color} strokeWidth="1.5" />
            
            {/* Torso */}
            <path d="M35 55 L35 100 L45 120 L75 120 L85 100 L85 55" fill="none" stroke={levelColor.color} strokeWidth="1.5" />
            
            {/* Chest details */}
            <line x1="60" y1="55" x2="60" y2="90" stroke={levelColor.color} strokeWidth="0.8" opacity="0.6" />
            <path d="M45 65 Q60 75 75 65" fill="none" stroke={levelColor.color} strokeWidth="0.8" opacity="0.6" />
            <path d="M45 80 Q60 88 75 80" fill="none" stroke={levelColor.color} strokeWidth="0.8" opacity="0.6" />
            
            {/* Arms */}
            <path d="M30 55 L20 90 L25 125" fill="none" stroke={levelColor.color} strokeWidth="1.5" />
            <path d="M90 55 L100 90 L95 125" fill="none" stroke={levelColor.color} strokeWidth="1.5" />
            
            {/* Hands */}
            <circle cx="25" cy="128" r="5" fill="none" stroke={levelColor.color} strokeWidth="1.2" />
            <circle cx="95" cy="128" r="5" fill="none" stroke={levelColor.color} strokeWidth="1.2" />
            
            {/* Legs */}
            <line x1="50" y1="120" x2="40" y2="185" stroke={levelColor.color} strokeWidth="1.5" />
            <line x1="70" y1="120" x2="80" y2="185" stroke={levelColor.color} strokeWidth="1.5" />
            
            {/* Feet */}
            <ellipse cx="38" cy="190" rx="8" ry="5" fill="none" stroke={levelColor.color} strokeWidth="1.2" />
            <ellipse cx="82" cy="190" rx="8" ry="5" fill="none" stroke={levelColor.color} strokeWidth="1.2" />
            
            {/* Energy lines */}
            <line x1="60" y1="42" x2="60" y2="10" stroke={levelColor.color} strokeWidth="0.5" opacity="0.4" />
          </svg>
        </div>

        {/* Equipment Slots with Lines */}
        {equipmentSlots.map((slot) => {
          const isRight = slot.lineDirection === 'right';
          const slotX = isRight ? 'calc(100% - 50px)' : '10px';
          
          return (
            <div key={slot.id} className="absolute" style={{ top: slot.position.top, left: '50%', transform: 'translateX(-50%)' }}>
              {/* Connection line */}
              <div 
                className="absolute top-1/2 h-px w-20"
                style={{
                  [isRight ? 'left' : 'right']: '100%',
                  background: `linear-gradient(${isRight ? '90deg' : '270deg'}, ${levelColor.color}, transparent)`,
                  transform: 'translateY(-50%)'
                }}
              />
              
              {/* Slot button */}
              <button
                onClick={() => onSlotClick?.(slot.id)}
                onMouseEnter={() => setHoveredSlot(slot.id)}
                onMouseLeave={() => setHoveredSlot(null)}
                className={cn(
                  "absolute w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300",
                  "border-2 bg-black/50 backdrop-blur-sm",
                  hoveredSlot === slot.id && "scale-110"
                )}
                style={{
                  [isRight ? 'left' : 'right']: 'calc(100% + 80px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderColor: slot.equipped ? levelColor.color : 'hsl(0 0% 30%)',
                  boxShadow: hoveredSlot === slot.id ? `0 0 20px ${levelColor.glow}` : 'none'
                }}
              >
                {slot.equipped ? (
                  slot.icon
                ) : (
                  <Plus className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {/* Slot label */}
              {hoveredSlot === slot.id && (
                <div 
                  className="absolute whitespace-nowrap text-xs px-2 py-1 rounded bg-black/80 border animate-fade-in"
                  style={{
                    [isRight ? 'left' : 'right']: 'calc(100% + 140px)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderColor: levelColor.color
                  }}
                >
                  {slot.nameAr}
                </div>
              )}
            </div>
          );
        })}

        {/* Level indicator */}
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded text-sm font-bold"
          style={{
            backgroundColor: `${levelColor.color}20`,
            border: `1px solid ${levelColor.color}`,
            color: levelColor.color,
            textShadow: `0 0 10px ${levelColor.glow}`
          }}
        >
          LV. {totalLevel}
        </div>
      </div>
    </div>
  );
};
