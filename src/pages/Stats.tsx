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
  Zap,
  Target,
  Lock
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');

  const MAX_LEVEL = 100;

  // ألوان Solo Leveling: الأزرق السماوي، الأزرق النيلي، والبنفسجي
  const stats = [
    { 
      category: 'strength' as const, 
      level: gameState.levels.strength, 
      xp: gameState.stats.strength, 
      xpProgress: getXpProgress(gameState.stats.strength),
      name: 'القوة',
      icon: <Dumbbell className="w-6 h-6" />,
      color: 'hsl(190 100% 50%)' // أزرق سماوي ساطع
    },
    { 
      category: 'mind' as const, 
      level: gameState.levels.mind, 
      xp: gameState.stats.mind, 
      xpProgress: getXpProgress(gameState.stats.mind),
      name: 'العقل',
      icon: <Brain className="w-6 h-6" />,
      color: 'hsl(210 100% 60%)' // أزرق نظام
    },
    { 
      category: 'spirit' as const, 
      level: gameState.levels.spirit, 
      xp: gameState.stats.spirit, 
      xpProgress: getXpProgress(gameState.stats.spirit),
      name: 'الروح',
      icon: <Heart className="w-6 h-6" />,
      color: 'hsl(280 100% 65%)' // بنفسجي "ظل"
    },
    { 
      category: 'agility' as const, 
      level: gameState.levels.agility || 0, 
      xp: gameState.stats.agility || 0, 
      xpProgress: getXpProgress(gameState.stats.agility || 0),
      name: 'الرشاقة',
      icon: <Zap className="w-6 h-6" />,
      color: 'hsl(180 100% 45%)' // أزرق مخضر (Cyan)
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
      color: 'hsl(280 100% 70%)', // بنفسجي ملكي
      glow: 'hsl(280 100% 60% / 0.8)',
      tier: 'رتبة S'
    };
    if (totalLevel >= 20) return { 
      color: 'hsl(200 100% 60%)', // أزرق ساطع
      glow: 'hsl(200 100% 60% / 0.6)',
      tier: 'رتبة B'
    };
    return { 
      color: 'hsl(0 0% 100%)', // أبيض نقي
      glow: 'hsl(0 0% 100% / 0.4)',
      tier: 'رتبة E'
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
    if (level >= 20) return 'hsl(280 100% 70%)';
    if (level >= 10) return 'hsl(200 100% 60%)';
    return '#ffffff';
  };

  return (
    <div className="min-h-screen pb-24 bg-[#05070a]" style={{ color: '#fff' }}>
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-blue-950/20 border border-blue-500/30">
          <button
            onClick={() => setActiveTab('stats')}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all",
              activeTab === 'stats' 
                ? "bg-blue-600/20 text-blue-400 border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                : "text-slate-500 hover:text-slate-300"
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
                ? "bg-blue-600/20 text-blue-400 border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                : "text-slate-500 hover:text-slate-300"
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
                background: 'linear-gradient(180deg, #0a0f18, #05070a)',
                borderColor: levelConfig.color,
                boxShadow: `0 0 30px ${levelConfig.glow}`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6" style={{ color: levelConfig.color }} />
                  <span className="font-bold text-lg tracking-tighter">الحالة الحالية</span>
                </div>
                <div 
                  className="px-4 py-1 rounded-sm font-black text-2xl italic"
                  style={{ 
                    borderLeft: `4px solid ${levelConfig.color}`,
                    color: levelConfig.color,
                    textShadow: `0 0 10px ${levelConfig.glow}`
                  }}
                >
                  LV. {totalLevel}
                </div>
              </div>
              <div className="text-center text-xs font-bold tracking-[0.2em] opacity-80">
                <span style={{ color: levelConfig.color }}>{levelConfig.tier}</span>
              </div>
            </div>

            {/* Radar Chart */}
            <div 
              className="p-4 rounded-2xl border bg-[#0a0f18]"
              style={{ 
                borderColor: 'rgba(59, 130, 246, 0.2)'
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-blue-100">تحليل القدرات</h3>
              </div>
              <div className="flex justify-center">
                {/* ملاحظة: تأكد ان RadarChart يستخدم الألوان الممرة له داخلياً */}
                <RadarChart stats={radarStats} size={280} />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={stat.category}
                  className="relative overflow-hidden rounded-lg transition-all border-l-4"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    background: `linear-gradient(90deg, #0f172a, #05070a)`,
                    borderColor: stat.color,
                    boxShadow: `0 4px 20px rgba(0,0,0,0.5)`
                  }}
                >
                  <div className="relative z-10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded flex items-center justify-center"
                          style={{ 
                            background: `${stat.color}15`,
                            border: `1px solid ${stat.color}30`,
                          }}
                        >
                          <div style={{ color: stat.color }}>{stat.icon}</div>
                        </div>
                        <div>
                          <h3 className="font-bold text-white/90">{stat.name}</h3>
                          <p className="text-[10px] text-blue-400/60 font-mono tracking-widest">{stat.xp} / NEXT LV</p>
                        </div>
                      </div>
                      <div className="text-xl font-black italic" style={{ color: stat.color }}>
                        {stat.level}
                      </div>
                    </div>
                    
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-700"
                        style={{ 
                          width: `${stat.xpProgress}%`,
                          background: `linear-gradient(90deg, transparent, ${stat.color}, #fff)`,
                          boxShadow: `0 0 10px ${stat.color}`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gold Resources */}
            <div 
              className="p-4 rounded-xl border border-blue-500/20 bg-[#0a0f18] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-3xl rounded-full" />
              <div className="text-center w-full relative z-10">
                <div className="text-[10px] text-blue-400/60 mb-1 font-bold tracking-[0.3em]">رصيد النقاط</div>
                <div className="text-3xl font-black text-white mb-3 tracking-tighter tabular-nums">
                  {gameState.gold.toLocaleString()}
                </div>
                <button className="w-full max-w-[200px] text-[10px] bg-white text-black py-2 rounded-sm hover:bg-blue-400 transition-all font-black tracking-widest uppercase">
                  استبدال النقاط +
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="animate-fade-in relative">
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-[4px] rounded-2xl">
              <Lock className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-xl font-black text-white tracking-widest italic">مغلق حالياً</span>
              <p className="text-blue-400/50 text-[10px] font-bold">المعدات تتطلب مستوى أعلى</p>
            </div>

            <div 
              className="relative rounded-2xl overflow-hidden p-6 opacity-20 grayscale"
              style={{
                background: '#0a101d',
                border: `1px solid ${levelConfig.color}40`,
              }}
            >
              <div className="relative h-[400px] flex items-center justify-center">
                 <CircleUser className="w-32 h-32 text-blue-900" />
                 {equipmentSlots.map((slot, index) => (
                  <div key={slot.id} className="absolute flex items-center gap-2" style={{ top: `${slot.y}%`, [index % 2 === 0 ? 'left' : 'right']: '10px' }}>
                    <div className="w-12 h-12 rounded border border-blue-500/20 bg-black flex items-center justify-center">
                      <Plus className="w-5 h-5 text-blue-900" />
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
