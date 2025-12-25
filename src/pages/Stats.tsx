import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { RadarChart } from '@/components/RadarChart';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  Dumbbell, 
  Brain, 
  Heart, 
  Shield,
  Sword,
  Crown,
  Plus,
  CircleUser,
  Footprints,
  Zap,
  Target,
  Lock
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');

  const MAX_LEVEL = 100;

  // تم تغيير جميع ألوان الإحصائيات إلى تدرجات الأزرق والأبيض
  const stats = [
    { 
      category: 'strength' as const, 
      level: gameState.levels.strength, 
      xp: gameState.stats.strength, 
      xpProgress: getXpProgress(gameState.stats.strength),
      name: 'القوة',
      icon: <Dumbbell className="w-6 h-6" />,
      color: 'hsl(200 100% 60%)' // أزرق ساطع
    },
    { 
      category: 'mind' as const, 
      level: gameState.levels.mind, 
      xp: gameState.stats.mind, 
      xpProgress: getXpProgress(gameState.stats.mind),
      name: 'العقل',
      icon: <Brain className="w-6 h-6" />,
      color: 'hsl(190 100% 50%)' // أزرق سماوي
    },
    { 
      category: 'spirit' as const, 
      level: gameState.levels.spirit, 
      xp: gameState.stats.spirit, 
      xpProgress: getXpProgress(gameState.stats.spirit),
      name: 'الروح',
      icon: <Heart className="w-6 h-6" />,
      color: 'hsl(210 100% 70%)' // أزرق فاتح جداً
    },
    { 
      category: 'agility' as const, 
      level: gameState.levels.agility || 0, 
      xp: gameState.stats.agility || 0, 
      xpProgress: getXpProgress(gameState.stats.agility || 0),
      name: 'الرشاقة',
      icon: <Zap className="w-6 h-6" />,
      color: 'hsl(185 100% 45%)' // أزرق مخضر
    },
  ];

  const radarStats = {
    strength: Math.min((gameState.levels.strength / MAX_LEVEL) * 100, 100),
    mind: Math.min((gameState.levels.mind / MAX_LEVEL) * 100, 100),
    spirit: Math.min((gameState.levels.spirit / MAX_LEVEL) * 100, 100),
    agility: Math.min(((gameState.levels.agility || 0) / MAX_LEVEL) * 100, 100),
  };

  const totalLevel = gameState.totalLevel;
  
  const getLevelConfig = () => {
    if (totalLevel >= 40) return { 
      color: 'hsl(200 100% 60%)', // أزرق ساطع للفل العالي
      glow: 'hsl(200 100% 60% / 0.6)',
      tier: 'أزرق ملكي'
    };
    if (totalLevel >= 20) return { 
      color: 'hsl(190 100% 70%)', 
      glow: 'hsl(190 100% 70% / 0.6)',
      tier: 'أزرق فاتح'
    };
    return { 
      color: '#ffffff', // أبيض للفل الابتدائي
      glow: 'rgba(255, 255, 255, 0.4)',
      tier: 'أبيض'
    };
  };

  const levelConfig = getLevelConfig();

  const equipmentSlots = [
    { id: 'head', y: 15 },
    { id: 'chest', y: 40 },
    { id: 'weapon', y: 55 },
    { id: 'legs', y: 80 },
  ];

  const getStatLevelColor = (level: number) => {
    if (level >= 20) return 'hsl(200 100% 60%)';
    if (level >= 10) return 'hsl(190 100% 70%)';
    return '#ffffff';
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
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/40" 
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
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/40" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex items-center justify-center gap-1">
              <Shield className="w-4 h-4" />
              المعدات
            </div>
          </button>
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
            {/* Level Header */}
            <div 
              className="p-4 rounded-2xl border-2"
              style={{ 
                background: 'linear-gradient(180deg, #020617, #000000)',
                borderColor: levelConfig.color,
                boxShadow: `0 0 40px ${levelConfig.glow}`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6" style={{ color: levelConfig.color }} />
                  <span className="font-bold text-lg text-white">المستوى الكلي</span>
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
                background: 'linear-gradient(180deg, #020617, #000000)',
                borderColor: 'rgba(59, 130, 246, 0.3)'
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">تحليل القوى</h3>
              </div>
              <div className="flex justify-center">
                <RadarChart stats={radarStats} size={280} />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={stat.category}
                  className="relative overflow-hidden rounded-xl transition-all hover:scale-[1.02] animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    background: `linear-gradient(135deg, #0f172a, #020617)`,
                    border: `2px solid ${getStatLevelColor(stat.level)}40`,
                    boxShadow: `0 0 30px ${getStatLevelColor(stat.level)}15`
                  }}
                >
                  <div className="relative z-10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${stat.color}30, ${stat.color}10)`,
                            border: `1px solid ${stat.color}50`,
                          }}
                        >
                          <div style={{ color: stat.color }}>{stat.icon}</div>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{stat.name}</h3>
                          <p className="text-xs text-blue-300/60">+{stat.xp} XP</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: getStatLevelColor(stat.level) }}>
                        Lv.{stat.level}
                      </div>
                    </div>
                    
                    <div className="h-3 rounded-full bg-black/50 border border-blue-500/20 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stat.xpProgress}%`,
                          background: `linear-gradient(90deg, ${stat.color}, #ffffff)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resources */}
            <div 
              className="p-4 rounded-xl border flex flex-col items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, #020617, #000000)',
                borderColor: 'rgba(59, 130, 246, 0.3)'
              }}
            >
              <div className="text-center w-full">
                <div className="text-sm text-blue-300/60 mb-1 uppercase tracking-widest">الرصيد الذهبي</div>
                <div className="text-3xl font-bold text-white mb-3">{gameState.gold}</div>
                <button className="w-full max-w-[200px] text-xs bg-blue-600/20 text-blue-400 border border-blue-400/40 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-black uppercase tracking-tighter">
                  شحن رصيد +
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="animate-fade-in relative">
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-2xl">
              <Lock className="w-10 h-10 text-blue-500 mb-2 opacity-80" />
              <span className="text-2xl font-black text-blue-400 tracking-tighter italic">COMING SOON</span>
              <p className="text-white/50 text-xs font-bold">سيتم فتح قسم المعدات في التحديث القادم</p>
            </div>

            <div 
              className="relative rounded-2xl overflow-hidden p-6 opacity-40 grayscale"
              style={{
                background: 'linear-gradient(180deg, #020617, #000000)',
                border: `2px solid ${levelConfig.color}`,
              }}
            >
              <div className="relative h-[400px] flex items-center justify-center">
                 <CircleUser className="w-32 h-32 text-blue-900/20" />
                 {equipmentSlots.map((slot, index) => (
                  <div key={slot.id} className="absolute flex items-center gap-2" style={{ top: `${slot.y}%`, [index % 2 === 0 ? 'left' : 'right']: '10px' }}>
                    <div className="w-12 h-12 rounded-lg border-2 border-white/10 bg-black/60 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-blue-900/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Stats;
