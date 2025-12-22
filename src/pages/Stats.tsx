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
      category: 'agility' as const, 
      level: gameState.levels.agility || 0, 
      xp: gameState.stats.agility || 0, 
      xpProgress: getXpProgress(gameState.stats.agility || 0),
      name: 'الرشاقة',
      icon: <Zap className="w-6 h-6" />,
      color: 'hsl(45 100% 50%)'
    },
  ];

  const totalLevel = gameState.totalLevel;
  
  const getLevelConfig = () => {
    if (totalLevel >= 40) return { color: 'hsl(270 100% 60%)', glow: 'hsl(270 100% 60% / 0.6)', tier: 'بنفسجي', bodyColor: '#9b59b6' };
    if (totalLevel >= 20) return { color: 'hsl(200 100% 60%)', glow: 'hsl(200 100% 60% / 0.6)', tier: 'أزرق', bodyColor: '#3498db' };
    return { color: 'hsl(200 100% 70%)', glow: 'hsl(200 100% 70% / 0.4)', tier: 'أبيض', bodyColor: '#ecf0f1' };
  };

  const levelConfig = getLevelConfig();

  // تعديل الرادار ليعتمد على المستوى (Lv. 100 للاكتمال) بدلاً من الـ XP
  const radarStats = {
    strength: Math.min(gameState.levels.strength, 100),
    mind: Math.min(gameState.levels.mind, 100),
    spirit: Math.min(gameState.levels.spirit, 100),
    agility: Math.min(gameState.levels.agility || 0, 100), // تم تغييرها من قرآن لرشاقة
  };

  const getStatLevelColor = (level: number) => {
    if (level >= 20) return 'hsl(270 100% 60%)';
    if (level >= 10) return 'hsl(210 100% 60%)';
    return 'hsl(200 80% 70%)';
  };

  return (
    <div className="min-h-screen pb-24">
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-card/50 border border-primary/20">
          <button onClick={() => setActiveTab('stats')} className={cn("flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all", activeTab === 'stats' ? "bg-primary/20 text-primary border border-primary/40" : "text-muted-foreground hover:text-foreground")}>
            <div className="flex items-center justify-center gap-1"><TrendingUp className="w-4 h-4" />الإحصائيات</div>
          </button>
          <button onClick={() => setActiveTab('equipment')} className={cn("flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all", activeTab === 'equipment' ? "bg-primary/20 text-primary border border-primary/40" : "text-muted-foreground hover:text-foreground")}>
            <div className="flex items-center justify-center gap-1"><Shield className="w-4 h-4" />المعدات</div>
          </button>
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
            {/* Level Header */}
            <div className="p-4 rounded-2xl border-2" style={{ background: 'linear-gradient(180deg, hsl(210 50% 6%), hsl(210 60% 3%))', borderColor: levelConfig.color, boxShadow: `0 0 40px ${levelConfig.glow}` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><Crown className="w-6 h-6" style={{ color: levelConfig.color }} /><span className="font-bold text-lg">المستوى الكلي</span></div>
                <div className="px-4 py-2 rounded-lg font-bold text-xl" style={{ backgroundColor: `${levelConfig.color}20`, border: `2px solid ${levelConfig.color}`, color: levelConfig.color, textShadow: `0 0 15px ${levelConfig.glow}` }}>LV. {totalLevel}</div>
              </div>
              <div className="text-center text-sm text-muted-foreground">الرتبة: <span style={{ color: levelConfig.color }}>{levelConfig.tier}</span></div>
            </div>

            {/* Radar Chart */}
            <div className="p-4 rounded-2xl border" style={{ background: 'linear-gradient(180deg, hsl(210 50% 5%), hsl(210 60% 3%))', borderColor: 'hsl(200 100% 50% / 0.3)' }}>
              <div className="flex items-center gap-2 mb-4"><Target className="w-5 h-5 text-primary" /><h3 className="font-bold">تحليل القوى</h3></div>
              {/* الرادار الآن يعرض الرشاقة بدلاً من القرآن */}
              <RadarChart stats={radarStats} size={280} />
              <p className="text-[10px] text-center text-muted-foreground mt-2 italic">يصل التحليل لأقصى حد عند مستوى 100 لكل مهارة</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4">
              {stats.map((stat, index) => (
                <div key={stat.category} className="relative overflow-hidden rounded-xl bg-card/10 border border-primary/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}20`, color: stat.color }}>{stat.icon}</div>
                      <h3 className="font-bold">{stat.name}</h3>
                    </div>
                    <div className="text-xl font-bold" style={{ color: getStatLevelColor(stat.level) }}>Lv.{stat.level}</div>
                  </div>
                  <div className="h-2 rounded-full bg-black/50 overflow-hidden">
                    <div className="h-full transition-all duration-500" style={{ width: `${stat.xpProgress}%`, backgroundColor: stat.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Resources - حذف نقاط الظل وإضافة شحن الذهب */}
            <div className="p-4 rounded-xl border flex flex-col items-center justify-center space-y-3" style={{ background: 'linear-gradient(135deg, hsl(45 50% 8%), hsl(45 60% 4%))', borderColor: 'hsl(45 100% 50% / 0.3)' }}>
              <div className="text-center">
                <div className="text-2xl mb-1">🪙</div>
                <div className="text-lg font-bold text-yellow-500">{gameState.gold} ذهب</div>
              </div>
              <button className="w-full py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                شحن الذهب
              </button>
            </div>
          </div>
        )}

        {/* ... قسم المعدات مع الـ Coming Soon كما في الكود السابق ... */}
      </main>
      <BottomNav />
    </div>
  );
};

export default Stats;
