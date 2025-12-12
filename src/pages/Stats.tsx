import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { StatCard } from '@/components/StatCard';
import { EquipmentCard } from '@/components/EquipmentCard';
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
  Crown
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress } = useGameState();

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

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
  
  // Determine stat card color based on level
  const getStatCardClass = (level: number) => {
    if (level >= 40) return 'card-level-purple';
    if (level >= 20) return 'card-level-blue';
    return 'card-level-white';
  };

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

  return (
    <div className="min-h-screen pb-24">
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="system-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">الإحصائيات</h1>
            </div>
            <div className="level-badge-system">
              <Crown className="w-4 h-4 ml-1" />
              المستوى الكلي: {totalLevel}
            </div>
          </div>
          
          {/* Total stats summary */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {stats.map(stat => (
              <div 
                key={stat.category}
                className="p-2 rounded-lg bg-card/50 border border-primary/20"
              >
                <div 
                  className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-1"
                  style={{ 
                    backgroundColor: `${getCategoryColor(stat.category)}20`,
                    color: getCategoryColor(stat.category)
                  }}
                >
                  {getCategoryIcon(stat.category)}
                </div>
                <div className="text-lg font-bold">{stat.level}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Card with Character */}
        <EquipmentCard totalLevel={totalLevel} />

        {/* Stats Cards with Level-based styling */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sword className="w-5 h-5 text-primary" />
            قوى المهارات
          </h2>
          
          <div className="grid gap-4">
            {stats.map(stat => (
              <div 
                key={stat.category}
                className={cn(
                  "stat-card relative overflow-hidden",
                  getStatCardClass(stat.level)
                )}
              >
                {/* Aura effect based on level */}
                {stat.level >= 20 && (
                  <div 
                    className="absolute inset-0 pointer-events-none animate-aura-pulse"
                    style={{
                      background: stat.level >= 40 
                        ? 'radial-gradient(ellipse at center, hsl(270 100% 60% / 0.15), transparent 70%)'
                        : 'radial-gradient(ellipse at center, hsl(210 100% 60% / 0.1), transparent 70%)'
                    }}
                  />
                )}
                
                <StatCard {...stat} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Stats;