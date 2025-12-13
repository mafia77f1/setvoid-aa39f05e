import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { StatCard } from '@/components/StatCard';
import { BottomNav } from '@/components/BottomNav';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  Dumbbell, 
  Brain, 
  Heart, 
  BookOpen,
  Shield,
  Sword,
  Crown,
  Plus,
  CircleUser,
  Footprints
} from 'lucide-react';
import characterWhite from '@/assets/character-white.jpg';
import characterBlue from '@/assets/character-blue.jpg';
import characterPurple from '@/assets/character-purple.jpg';

interface EquipmentSlot {
  id: string;
  name: string;
  nameAr: string;
  icon: React.ReactNode;
  equipped: string | null;
  position: { top: string };
  side: 'left' | 'right';
}

const Stats = () => {
  const { gameState, getXpProgress } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const stats = [
    { 
      category: 'strength' as const, 
      level: gameState.levels.strength, 
      xp: gameState.stats.strength, 
      xpProgress: getXpProgress(gameState.stats.strength)
    },
    { 
      category: 'mind' as const, 
      level: gameState.levels.mind, 
      xp: gameState.stats.mind, 
      xpProgress: getXpProgress(gameState.stats.mind)
    },
    { 
      category: 'spirit' as const, 
      level: gameState.levels.spirit, 
      xp: gameState.stats.spirit, 
      xpProgress: getXpProgress(gameState.stats.spirit)
    },
    { 
      category: 'quran' as const, 
      level: gameState.levels.quran, 
      xp: gameState.stats.quran, 
      xpProgress: getXpProgress(gameState.stats.quran)
    },
  ];

  const totalLevel = gameState.totalLevel;
  
  // Determine character image and color based on level
  const getLevelConfig = () => {
    if (totalLevel >= 40) return { 
      image: characterPurple, 
      color: 'hsl(270 100% 60%)', 
      glow: 'hsl(270 100% 60% / 0.6)',
      shadow: '0 0 60px hsl(270 100% 60% / 0.4)',
      tier: 'بنفسجي'
    };
    if (totalLevel >= 20) return { 
      image: characterBlue, 
      color: 'hsl(200 100% 60%)', 
      glow: 'hsl(200 100% 60% / 0.6)',
      shadow: '0 0 60px hsl(200 100% 60% / 0.4)',
      tier: 'أزرق'
    };
    return { 
      image: characterWhite, 
      color: 'hsl(200 100% 70%)', 
      glow: 'hsl(200 100% 70% / 0.4)',
      shadow: '0 0 40px hsl(200 100% 70% / 0.3)',
      tier: 'أبيض'
    };
  };

  const levelConfig = getLevelConfig();

  const equipmentSlots: EquipmentSlot[] = [
    { id: 'head', name: 'Head', nameAr: 'الرأس', icon: <CircleUser className="w-5 h-5" />, equipped: null, position: { top: '8%' }, side: 'right' },
    { id: 'chest', name: 'Chest', nameAr: 'الصدر', icon: <Shield className="w-5 h-5" />, equipped: null, position: { top: '35%' }, side: 'left' },
    { id: 'weapon', name: 'Weapon', nameAr: 'السلاح', icon: <Sword className="w-5 h-5" />, equipped: null, position: { top: '55%' }, side: 'right' },
    { id: 'legs', name: 'Legs', nameAr: 'الأرجل', icon: <Footprints className="w-5 h-5" />, equipped: null, position: { top: '80%' }, side: 'left' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Dumbbell className="w-6 h-6" />;
      case 'mind': return <Brain className="w-6 h-6" />;
      case 'spirit': return <Heart className="w-6 h-6" />;
      case 'quran': return <BookOpen className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return 'hsl(0 70% 55%)';
      case 'mind': return 'hsl(210 80% 55%)';
      case 'spirit': return 'hsl(270 70% 60%)';
      case 'quran': return 'hsl(150 60% 45%)';
      default: return 'hsl(270 100% 60%)';
    }
  };

  const getStatLevelColor = (level: number) => {
    if (level >= 20) return 'hsl(270 100% 60%)';
    if (level >= 10) return 'hsl(210 100% 60%)';
    return 'hsl(0 0% 80%)';
  };

  return (
    <div className="min-h-screen pb-24">
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-card/50 border border-primary/20">
          <button
            onClick={() => setActiveTab('stats')}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all",
              activeTab === 'stats' 
                ? "bg-primary/20 text-primary border border-primary/40" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              الإحصائيات
            </div>
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all",
              activeTab === 'equipment' 
                ? "bg-primary/20 text-primary border border-primary/40" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              المعدات
            </div>
          </button>
        </div>

        {activeTab === 'stats' ? (
          <>
            {/* Header */}
            <div className="system-panel p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <h1 className="text-xl font-bold">الإحصائيات</h1>
                </div>
                <div 
                  className="level-badge-system"
                  style={{ 
                    borderColor: levelConfig.color,
                    boxShadow: `0 0 15px ${levelConfig.glow}`,
                    color: levelConfig.color
                  }}
                >
                  <Crown className="w-4 h-4 ml-1" />
                  المستوى الكلي: {totalLevel}
                </div>
              </div>
              
              {/* Total stats summary */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {stats.map(stat => (
                  <div 
                    key={stat.category}
                    className="p-3 rounded-lg relative overflow-hidden transition-all hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${getCategoryColor(stat.category)}15, transparent)`,
                      border: `1px solid ${getCategoryColor(stat.category)}40`,
                      boxShadow: `0 0 20px ${getCategoryColor(stat.category)}20`
                    }}
                  >
                    <div 
                      className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2"
                      style={{ 
                        backgroundColor: `${getCategoryColor(stat.category)}20`,
                        color: getCategoryColor(stat.category),
                        boxShadow: `0 0 15px ${getCategoryColor(stat.category)}40`
                      }}
                    >
                      {getCategoryIcon(stat.category)}
                    </div>
                    <div 
                      className="text-xl font-bold"
                      style={{ 
                        color: getStatLevelColor(stat.level),
                        textShadow: `0 0 10px ${getStatLevelColor(stat.level)}`
                      }}
                    >
                      {stat.level}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Lv.{stat.level}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Cards with Level-based styling */}
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sword className="w-5 h-5 text-primary" />
                قوى المهارات
              </h2>
              
              <div className="grid gap-4">
                {stats.map((stat, index) => (
                  <div 
                    key={stat.category}
                    className="relative overflow-hidden rounded-xl transition-all hover:scale-[1.02] animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      background: `linear-gradient(135deg, hsl(210 50% 8%), hsl(210 60% 4%))`,
                      border: `2px solid ${getStatLevelColor(stat.level)}40`,
                      boxShadow: `0 0 30px ${getStatLevelColor(stat.level)}20, inset 0 0 40px ${getStatLevelColor(stat.level)}10`
                    }}
                  >
                    {/* Aura fog effect */}
                    <div 
                      className="absolute inset-0 pointer-events-none animate-aura-pulse opacity-30"
                      style={{
                        background: `radial-gradient(ellipse at center, ${getStatLevelColor(stat.level)}40, transparent 70%)`
                      }}
                    />
                    
                    <div className="relative z-10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ 
                              background: `linear-gradient(135deg, ${getCategoryColor(stat.category)}30, ${getCategoryColor(stat.category)}10)`,
                              border: `1px solid ${getCategoryColor(stat.category)}50`,
                              boxShadow: `0 0 20px ${getCategoryColor(stat.category)}30`
                            }}
                          >
                            <div style={{ color: getCategoryColor(stat.category) }}>
                              {getCategoryIcon(stat.category)}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">
                              {stat.category === 'strength' ? 'القوة' : 
                               stat.category === 'mind' ? 'العقل' : 
                               stat.category === 'spirit' ? 'الروح' : 'القرآن'}
                            </h3>
                            <p className="text-xs text-muted-foreground">+{stat.xp} XP</p>
                          </div>
                        </div>
                        <div 
                          className="text-2xl font-bold"
                          style={{ 
                            color: getStatLevelColor(stat.level),
                            textShadow: `0 0 15px ${getStatLevelColor(stat.level)}`
                          }}
                        >
                          Lv.{stat.level}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="h-3 rounded-full bg-black/50 border border-primary/20 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${stat.xpProgress}%`,
                            background: `linear-gradient(90deg, ${getCategoryColor(stat.category)}, ${getCategoryColor(stat.category)}80)`,
                            boxShadow: `0 0 10px ${getCategoryColor(stat.category)}`
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 text-left">
                        {Math.round(stat.xpProgress)}% للمستوى التالي
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Equipment Tab */
          <div className="animate-fade-in">
            <div 
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, hsl(210 50% 6%), hsl(210 60% 3%))',
                border: `2px solid ${levelConfig.color}`,
                boxShadow: levelConfig.shadow
              }}
            >
              {/* Corner decorations */}
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: levelConfig.color }} />
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: levelConfig.color }} />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: levelConfig.color }} />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: levelConfig.color }} />
              
              {/* Dots decoration */}
              <div className="absolute top-4 right-14 flex gap-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: levelConfig.color, opacity: 0.7 }} />
                ))}
              </div>
              <div className="absolute bottom-4 left-14 flex gap-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: levelConfig.color, opacity: 0.7 }} />
                ))}
              </div>

              {/* Character Image */}
              <div className="relative h-[500px] flex items-center justify-center p-8">
                <img 
                  src={levelConfig.image} 
                  alt="Character"
                  className="h-full w-auto object-contain animate-float"
                  style={{
                    filter: `drop-shadow(0 0 30px ${levelConfig.glow})`,
                    maxWidth: '80%'
                  }}
                />
                
                {/* Equipment Slots */}
                {equipmentSlots.map((slot) => (
                  <div 
                    key={slot.id}
                    className="absolute flex items-center gap-2"
                    style={{ 
                      top: slot.position.top,
                      [slot.side]: '8px'
                    }}
                  >
                    {/* Line */}
                    <div 
                      className={cn(
                        "w-16 h-px",
                        slot.side === 'left' ? "order-2" : "order-1"
                      )}
                      style={{
                        background: `linear-gradient(${slot.side === 'left' ? '270deg' : '90deg'}, ${levelConfig.color}, transparent)`
                      }}
                    />
                    
                    {/* Slot button */}
                    <button
                      onClick={() => setSelectedSlot(slot.id)}
                      className={cn(
                        "w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300",
                        "border-2 bg-black/60 backdrop-blur-sm hover:scale-110",
                        slot.side === 'left' ? "order-1" : "order-2",
                        selectedSlot === slot.id && "ring-2 ring-offset-2 ring-offset-black"
                      )}
                      style={{
                        borderColor: slot.equipped ? levelConfig.color : 'hsl(0 0% 30%)',
                        boxShadow: selectedSlot === slot.id ? `0 0 25px ${levelConfig.glow}` : 'none',
                        ringColor: levelConfig.color
                      }}
                    >
                      {slot.equipped ? (
                        <span style={{ color: levelConfig.color }}>{slot.icon}</span>
                      ) : (
                        <Plus className="w-6 h-6 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Level and Tier indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <div 
                  className="px-6 py-2 rounded-lg text-lg font-bold"
                  style={{
                    backgroundColor: `${levelConfig.color}20`,
                    border: `2px solid ${levelConfig.color}`,
                    color: levelConfig.color,
                    textShadow: `0 0 15px ${levelConfig.glow}`,
                    boxShadow: `0 0 30px ${levelConfig.glow}`
                  }}
                >
                  LV. {totalLevel}
                </div>
                <span className="text-xs" style={{ color: levelConfig.color }}>
                  الرتبة: {levelConfig.tier}
                </span>
              </div>
            </div>

            {/* Equipment Modal */}
            {selectedSlot && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setSelectedSlot(null)}
              >
                <div 
                  className="notification-panel max-w-sm w-full p-6 animate-modal-appear"
                  onClick={e => e.stopPropagation()}
                >
                  <h3 className="text-lg font-bold text-primary mb-4 text-center">
                    {equipmentSlots.find(s => s.id === selectedSlot)?.nameAr}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    لا توجد معدات متاحة حالياً
                  </p>
                  <p className="text-xs text-center text-primary/60">
                    اقتل الزعماء للحصول على معدات!
                  </p>
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="w-full mt-4 py-2 rounded-lg bg-primary/20 border border-primary/40 text-primary font-bold hover:bg-primary/30 transition-all"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Stats;