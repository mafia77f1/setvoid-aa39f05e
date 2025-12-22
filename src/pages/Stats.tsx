import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { RadarChart } from '@/components/RadarChart';
// تم إخفاء ShadowSoldiersPanel لأننا سنحذف التاب الخاص بها
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
  Sparkles,
  Zap,
  Target,
  Lock // أيقونة القفل للمعدات
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress } = useGameState();
  // حذفنا shadows من الـ Tabs
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
      // تم التغيير من قرآن إلى رشاقة
      category: 'agility' as const, 
      level: gameState.levels.agility || 0, 
      xp: gameState.stats.agility || 0, 
      xpProgress: getXpProgress(gameState.stats.agility || 0),
      name: 'الرشاقة',
      icon: <Zap className="w-6 h-6" />,
      color: 'hsl(45 100% 50%)' // لون ذهبي/أصفر للرشاقة
    },
  ];

  const levelConfig = { 
    color: 'hsl(200 100% 70%)', 
    glow: 'hsl(200 100% 70% / 0.4)',
    tier: 'مبتدئ',
    bodyColor: '#ecf0f1'
  };

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

  const radarStats = {
    strength: Math.min(gameState.stats.strength, 100),
    mind: Math.min(gameState.stats.mind, 100),
    spirit: Math.min(gameState.stats.spirit, 100),
    agility: Math.min(gameState.stats.agility || 0, 100),
  };

  return (
    <div className="min-h-screen pb-24">
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Tabs - تم حذف الظلال */}
        <div className="flex gap-2 p-1 rounded-xl bg-card/50 border border-primary/20">
          <button
            onClick={() => setActiveTab('stats')}
            className={cn(
              "flex-1 py-2 rounded-lg font-bold transition-all",
              activeTab === 'stats' ? "bg-primary text-black" : "text-muted-foreground"
            )}
          >
            الإحصائيات
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={cn(
              "flex-1 py-2 rounded-lg font-bold transition-all",
              activeTab === 'equipment' ? "bg-primary text-black" : "text-muted-foreground"
            )}
          >
            المعدات
          </button>
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
             {/* ليفل وكردار شارت (نفس الكود السابق) */}
             <div className="p-4 rounded-2xl border-2 border-primary/50 bg-black/40 text-center">
                <h2 className="text-xl font-bold">المستوى الكلي: {gameState.totalLevel}</h2>
             </div>

             <div className="grid gap-4">
              {stats.map((stat) => (
                <div key={stat.category} className="p-4 rounded-xl border bg-card/30 relative overflow-hidden">
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-3">
                      <div style={{ color: stat.color }}>{stat.icon}</div>
                      <span className="font-bold">{stat.name}</span>
                    </div>
                    <span className="font-mono font-bold">Lv.{stat.level}</span>
                  </div>
                  <div className="mt-3 h-2 bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500" 
                      style={{ width: `${stat.xpProgress}%`, backgroundColor: stat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* شحن الذهب */}
            <div className="p-4 rounded-xl border border-yellow-500/50 bg-yellow-500/10 flex justify-between items-center">
              <div>
                <p className="text-xs text-yellow-500 font-bold uppercase">الرصيد الحالي</p>
                <h3 className="text-2xl font-black text-yellow-500">🪙 {gameState.gold}</h3>
              </div>
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
                شحن الذهب
              </button>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="relative h-[500px] flex items-center justify-center bg-black/20 rounded-3xl border border-dashed border-primary/30">
            {/* Overlay قريبا */}
            <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
              <Lock className="w-12 h-12 text-primary mb-2 animate-bounce" />
              <h2 className="text-3xl font-black text-primary italic">COMING SOON</h2>
              <p className="text-muted-foreground font-bold">قسم المعدات متاح قريباً</p>
            </div>
            
            {/* الشخصية خلف الغطاء */}
            <div className="opacity-20 grayscale">
               <CircleUser className="w-32 h-32" />
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Stats;
