import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { RadarChart } from '@/components/RadarChart';
import { ShadowSoldiersPanel } from '@/components/ShadowSoldiersPanel';
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
  Footprints,
  Ghost,
  Sparkles,
  Zap,
  Target,
  Clock
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress, summonShadowSoldier } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment' | 'shadows'>('stats');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const stats = [
    { 
      category: 'strength' as const, 
      level: gameState.levels.strength, 
      xp: gameState.stats.strength, 
      xpProgress: getXpProgress(gameState.stats.strength),
      name: 'القوة',
      icon: <Dumbbell className="w-6 h-6" />,
      color: 'hsl(0 70% 55%)'
    },
    { 
      category: 'mind' as const, 
      level: gameState.levels.mind, 
      xp: gameState.stats.mind, 
      xpProgress: getXpProgress(gameState.stats.mind),
      name: 'العقل',
      icon: <Brain className="w-6 h-6" />,
      color: 'hsl(210 80% 55%)'
    },
    { 
      category: 'spirit' as const, 
      level: gameState.levels.spirit, 
      xp: gameState.stats.spirit, 
      xpProgress: getXpProgress(gameState.stats.spirit),
      name: 'الروح',
      icon: <Heart className="w-6 h-6" />,
      color: 'hsl(270 70% 60%)'
    },
    { 
      category: 'quran' as const, 
      level: gameState.levels.quran, 
      xp: gameState.stats.quran, 
      xpProgress: getXpProgress(gameState.stats.quran),
      name: 'القرآن',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'hsl(150 60% 45%)'
    },
  ];

  const totalLevel = gameState.totalLevel;
  
  // Level-based character color
  const getLevelConfig = () => {
    if (totalLevel >= 40) return { 
      color: 'hsl(270 100% 60%)', 
      glow: 'hsl(270 100% 60% / 0.6)',
      tier: 'بنفسجي',
      bodyColor: '#9b59b6'
    };
    if (totalLevel >= 20) return { 
      color: 'hsl(200 100% 60%)', 
      glow: 'hsl(200 100% 60% / 0.6)',
      tier: 'أزرق',
      bodyColor: '#3498db'
    };
    return { 
      color: 'hsl(200 100% 70%)', 
      glow: 'hsl(200 100% 70% / 0.4)',
      tier: 'أبيض',
      bodyColor: '#ecf0f1'
    };
  };

  const levelConfig = getLevelConfig();

  const equipmentSlots = [
    { id: 'head', nameAr: 'الرأس', icon: <CircleUser className="w-5 h-5" />, equipped: null, y: 15 },
    { id: 'chest', nameAr: 'الصدر', icon: <Shield className="w-5 h-5" />, equipped: null, y: 40 },
    { id: 'weapon', nameAr: 'السلاح', icon: <Sword className="w-5 h-5" />, equipped: null, y: 55 },
    { id: 'legs', nameAr: 'الأرجل', icon: <Footprints className="w-5 h-5" />, equipped: null, y: 80 },
  ];

  const getStatLevelColor = (level: number) => {
    if (level >= 20) return 'hsl(270 100% 60%)';
    if (level >= 10) return 'hsl(210 100% 60%)';
    return 'hsl(200 80% 70%)';
  };

  // Convert stats to radar format
  const radarStats = {
    strength: Math.min(gameState.stats.strength, 100),
    mind: Math.min(gameState.stats.mind, 100),
    spirit: Math.min(gameState.stats.spirit, 100),
    quran: Math.min(gameState.stats.quran, 100),
  };

  return (
    <div className="min-h-screen pb-24">
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-card/50 border border-primary/20">
          <button
            onClick={() => setActiveTab('stats')}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all",
              activeTab === 'stats' 
                ? "bg-primary/20 text-primary border border-primary/40" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              الإحصائيات
            </div>
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all",
              activeTab === 'equipment' 
                ? "bg-primary/20 text-primary border border-primary/40" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center justify-center gap-1">
              <Shield className="w-4 h-4" />
              المعدات
            </div>
          </button>
          <button
            onClick={() => setActiveTab('shadows')}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all",
              activeTab === 'shadows' 
                ? "bg-primary/20 text-primary border border-primary/40" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center justify-center gap-1">
              <Ghost className="w-4 h-4" />
              الظلال
            </div>
          </button>
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
            {/* Level Header */}
            <div 
              className="p-4 rounded-2xl border-2"
              style={{ 
                background: 'linear-gradient(180deg, hsl(210 50% 6%), hsl(210 60% 3%))',
                borderColor: levelConfig.color,
                boxShadow: `0 0 40px ${levelConfig.glow}`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6" style={{ color: levelConfig.color }} />
                  <span className="font-bold text-lg">المستوى الكلي</span>
                </div>
                <div 
                  className="px-4 py-2 rounded-lg font-bold text-xl"
                  style={{ 
                    backgroundColor: `${levelConfig.color}20`,
                    border: `2px solid ${levelConfig.color}`,
                    color: levelConfig.color,
                    textShadow: `0 0 15px ${levelConfig.glow}`
                  }}
                >
                  LV. {totalLevel}
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                الرتبة: <span style={{ color: levelConfig.color }}>{levelConfig.tier}</span>
              </div>
            </div>

            {/* Radar Chart */}
            <div 
              className="p-4 rounded-2xl border"
              style={{ 
                background: 'linear-gradient(180deg, hsl(210 50% 5%), hsl(210 60% 3%))',
                borderColor: 'hsl(200 100% 50% / 0.3)'
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-bold">تحليل القوى</h3>
              </div>
              <RadarChart stats={radarStats} size={280} />
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={stat.category}
                  className="relative overflow-hidden rounded-xl transition-all hover:scale-[1.02] animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    background: `linear-gradient(135deg, hsl(210 50% 8%), hsl(210 60% 4%))`,
                    border: `2px solid ${getStatLevelColor(stat.level)}40`,
                    boxShadow: `0 0 30px ${getStatLevelColor(stat.level)}15`
                  }}
                >
                  {/* Aura effect */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      background: `radial-gradient(ellipse at center, ${stat.color}40, transparent 70%)`
                    }}
                  />
                  
                  <div className="relative z-10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${stat.color}30, ${stat.color}10)`,
                            border: `1px solid ${stat.color}50`,
                            boxShadow: `0 0 20px ${stat.color}30`
                          }}
                        >
                          <div style={{ color: stat.color }}>{stat.icon}</div>
                        </div>
                        <div>
                          <h3 className="font-bold">{stat.name}</h3>
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
                    
                    <div className="h-3 rounded-full bg-black/50 border border-primary/20 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stat.xpProgress}%`,
                          background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                          boxShadow: `0 0 10px ${stat.color}`
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

            {/* Resources */}
            <div 
              className="p-4 rounded-xl border grid grid-cols-2 gap-4"
              style={{ 
                background: 'linear-gradient(135deg, hsl(45 50% 8%), hsl(45 60% 4%))',
                borderColor: 'hsl(45 100% 50% / 0.3)'
              }}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🪙</div>
                <div className="text-lg font-bold text-yellow-500">{gameState.gold}</div>
                <div className="text-xs text-muted-foreground">ذهب</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="text-lg font-bold text-primary">{gameState.shadowPoints || 0}</div>
                <div className="text-xs text-muted-foreground">نقاط الظل</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="animate-fade-in flex items-center justify-center min-h-[400px]">
            <div 
              className="text-center p-8 rounded-2xl border-2"
              style={{
                background: 'linear-gradient(180deg, hsl(210 50% 6%), hsl(210 60% 3%))',
                border: `2px solid ${levelConfig.color}`,
                boxShadow: `0 0 50px ${levelConfig.glow}`
              }}
            >
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: levelConfig.color }} />
              <h3 className="text-2xl font-bold mb-2" style={{ color: levelConfig.color }}>قريباً</h3>
              <p className="text-muted-foreground mb-2">ميزة المعدات قيد التطوير</p>
              <p className="text-xs text-muted-foreground">سيتم إضافتها في التحديث القادم</p>
            </div>
          </div>
        )}

        {activeTab === 'shadows' && (
          <div className="animate-fade-in flex items-center justify-center min-h-[400px]">
            <div 
              className="text-center p-8 rounded-2xl border-2"
              style={{
                background: 'linear-gradient(180deg, hsl(210 50% 6%), hsl(210 60% 3%))',
                border: `2px solid ${levelConfig.color}`,
                boxShadow: `0 0 50px ${levelConfig.glow}`
              }}
            >
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: levelConfig.color }} />
              <h3 className="text-2xl font-bold mb-2" style={{ color: levelConfig.color }}>قريباً</h3>
              <p className="text-muted-foreground mb-2">نظام الجنود الظلليين قيد التطوير</p>
              <p className="text-xs text-muted-foreground">سيتم تفعيلها في التحديث القادم</p>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Stats;
