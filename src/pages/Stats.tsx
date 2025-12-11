import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Target, Calendar, Award, Dumbbell, Brain, Heart, BookOpen, User, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const Stats = () => {
  const { gameState, getXpProgress } = useGameState();

  const completedQuests = gameState.quests.filter(q => q.completed).length;
  const totalQuests = gameState.quests.length;
  const completionRate = Math.round((completedQuests / totalQuests) * 100);
  const totalLevel = gameState.totalLevel;

  const last7Days = gameState.dailyStats.slice(-7);

  // Determine level tier for styling
  const getLevelTier = (level: number) => {
    if (level >= 50) return 'black';
    if (level >= 20) return 'purple';
    if (level >= 10) return 'blue';
    return 'white';
  };

  const tier = getLevelTier(totalLevel);

  const tierStyles = {
    white: {
      cardClass: 'card-level-white',
      glowClass: '',
      textColor: 'text-foreground/80',
      borderColor: 'border-foreground/30',
    },
    blue: {
      cardClass: 'card-level-blue',
      glowClass: 'glow-blue',
      textColor: 'text-[hsl(210_100%_70%)]',
      borderColor: 'border-[hsl(210_100%_60%/0.5)]',
    },
    purple: {
      cardClass: 'card-level-purple',
      glowClass: 'glow-purple',
      textColor: 'text-primary',
      borderColor: 'border-primary/50',
    },
    black: {
      cardClass: 'card-level-black',
      glowClass: 'glow-black',
      textColor: 'text-primary',
      borderColor: 'border-primary/80',
    },
  };

  const currentTier = tierStyles[tier];

  const statItems = [
    { key: 'strength', label: 'STR', fullLabel: 'قوة', icon: Dumbbell, color: 'text-strength', bgColor: 'bg-strength' },
    { key: 'mind', label: 'INT', fullLabel: 'ذكاء', icon: Brain, color: 'text-mind', bgColor: 'bg-mind' },
    { key: 'spirit', label: 'VIT', fullLabel: 'حيوية', icon: Heart, color: 'text-spirit', bgColor: 'bg-spirit' },
    { key: 'quran', label: 'PER', fullLabel: 'إدراك', icon: BookOpen, color: 'text-quran', bgColor: 'bg-quran' },
  ] as const;

  return (
    <div className="min-h-screen pb-24">
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Main Status Panel with Body Silhouette */}
        <div className={cn("profile-card", currentTier.cardClass)}>
          {/* Corner Decorations */}
          <div className="corner-decoration corner-tl" />
          <div className="corner-decoration corner-tr" />
          <div className="corner-decoration corner-bl" />
          <div className="corner-decoration corner-br" />
          
          {/* Scan Line Effect */}
          <div className="scan-line" />

          {/* Aura Effect based on level */}
          {tier !== 'white' && (
            <div className={cn(
              "absolute inset-0 pointer-events-none",
              tier === 'blue' && "bg-[radial-gradient(ellipse_at_center,hsl(210_100%_50%/0.1),transparent_70%)]",
              tier === 'purple' && "bg-[radial-gradient(ellipse_at_center,hsl(270_100%_60%/0.15),transparent_70%)]",
              tier === 'black' && "bg-[radial-gradient(ellipse_at_center,hsl(270_100%_40%/0.2),transparent_60%)]"
            )} />
          )}

          {/* Status Header */}
          <div className="status-header">
            <h2>STATUS</h2>
          </div>

          <div className="p-6 relative">
            <div className="flex gap-6">
              {/* Body Silhouette with Stats */}
              <div className="relative flex-shrink-0 w-[180px]">
                {/* Silhouette Container */}
                <div className="relative h-[280px] flex items-center justify-center">
                  {/* Aura behind silhouette */}
                  {tier !== 'white' && (
                    <div className={cn(
                      "absolute inset-0 rounded-full blur-3xl animate-aura-pulse",
                      tier === 'blue' && "bg-[hsl(210_100%_50%/0.2)]",
                      tier === 'purple' && "bg-[hsl(270_100%_60%/0.25)]",
                      tier === 'black' && "bg-[hsl(270_100%_30%/0.3)]"
                    )} />
                  )}
                  
                  {/* SVG Body Silhouette */}
                  <svg viewBox="0 0 100 200" className={cn("w-32 h-64 relative z-10", currentTier.textColor)} fill="currentColor">
                    {/* Head */}
                    <circle cx="50" cy="20" r="15" opacity="0.9" />
                    {/* Body */}
                    <path d="M35 38 L65 38 L70 90 L55 90 L55 150 L65 150 L65 195 L55 195 L55 160 L45 160 L45 195 L35 195 L35 150 L45 150 L45 90 L30 90 Z" opacity="0.8" />
                    {/* Arms */}
                    <path d="M30 40 L15 80 L20 82 L33 50" opacity="0.7" />
                    <path d="M70 40 L85 80 L80 82 L67 50" opacity="0.7" />
                  </svg>

                  {/* Stat Points around body */}
                  <div className="absolute top-[20%] -right-4">
                    <div className={cn("text-xs font-bold px-2 py-0.5 rounded", currentTier.borderColor, "border bg-background/80")}>
                      <span className="text-strength">STR</span>
                    </div>
                  </div>
                  <div className="absolute top-[35%] -left-4">
                    <div className={cn("text-xs font-bold px-2 py-0.5 rounded", currentTier.borderColor, "border bg-background/80")}>
                      <span className="text-mind">INT</span>
                    </div>
                  </div>
                  <div className="absolute top-[55%] -right-4">
                    <div className={cn("text-xs font-bold px-2 py-0.5 rounded", currentTier.borderColor, "border bg-background/80")}>
                      <span className="text-spirit">VIT</span>
                    </div>
                  </div>
                  <div className="absolute top-[75%] -left-4">
                    <div className={cn("text-xs font-bold px-2 py-0.5 rounded", currentTier.borderColor, "border bg-background/80")}>
                      <span className="text-quran">PER</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Info */}
              <div className="flex-1 space-y-4">
                {/* Level & Name */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">LEVEL</div>
                    <div className={cn("text-5xl font-bold", currentTier.textColor, tier !== 'white' && "glow-text")}>
                      {totalLevel}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground mb-1">JOB</div>
                    <div className="text-sm font-semibold">{gameState.playerJob}</div>
                    <div className="text-xs text-primary mt-1">{gameState.playerName}</div>
                  </div>
                </div>

                {/* Divider */}
                <div className={cn("h-px", currentTier.borderColor, "bg-current opacity-30")} />

                {/* Stats Breakdown */}
                <div className="space-y-3">
                  {statItems.map((stat) => {
                    const level = gameState.levels[stat.key];
                    const xp = gameState.stats[stat.key];

                    return (
                      <div key={stat.key} className="flex items-center gap-3">
                        <span className={cn("w-8 text-xs font-bold", stat.color)}>{stat.label}</span>
                        <div className="flex-1 stats-bar h-2">
                          <div 
                            className={cn("stats-bar-fill", stat.bgColor)}
                            style={{ width: `${getXpProgress(xp)}%` }}
                          />
                        </div>
                        <span className={cn("text-sm font-bold w-8 text-left", currentTier.textColor)}>{level}</span>
                      </div>
                    );
                  })}
                </div>

                {/* HP & Energy */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-destructive" />
                    <div className="flex-1 stats-bar h-2">
                      <div className="stats-bar-fill hp-bar" style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }} />
                    </div>
                    <span className="text-xs text-destructive">{gameState.hp}/{gameState.maxHp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[hsl(200_100%_60%)]" />
                    <div className="flex-1 stats-bar h-2">
                      <div className="stats-bar-fill energy-bar" style={{ width: `${(gameState.energy / gameState.maxEnergy) * 100}%` }} />
                    </div>
                    <span className="text-xs text-[hsl(200_100%_60%)]">{gameState.energy}/{gameState.maxEnergy}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-around mt-6 py-3 rounded-lg bg-card/50 border border-primary/20">
              <div className="text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold">{gameState.totalQuestsCompleted}</div>
                <div className="text-[10px] text-muted-foreground">QUESTS</div>
              </div>
              <div className="w-px h-10 bg-primary/30" />
              <div className="text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <div className="text-lg font-bold">{gameState.streakDays}</div>
                <div className="text-[10px] text-muted-foreground">STREAK</div>
              </div>
              <div className="w-px h-10 bg-primary/30" />
              <div className="text-center">
                <Award className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <div className="text-lg font-bold">{gameState.achievements.filter(a => a.unlocked).length}</div>
                <div className="text-[10px] text-muted-foreground">BADGES</div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="system-panel p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            إحصائيات اليوم
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-card/50 border border-primary/20 text-center">
              <div className="text-3xl font-bold text-primary">{completedQuests}</div>
              <div className="text-xs text-muted-foreground">مهمات مكتملة</div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-primary/20 text-center">
              <div className="text-3xl font-bold text-secondary">{completionRate}%</div>
              <div className="text-xs text-muted-foreground">معدل الإنجاز</div>
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        {last7Days.length > 0 && (
          <div className="system-panel p-4">
            <h3 className="font-bold mb-4">تقدم الأسبوع</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(260 15% 55%)', fontSize: 10 }}
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                  />
                  <YAxis tick={{ fill: 'hsl(260 15% 55%)', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(260 30% 10%)',
                      border: '1px solid hsl(270 50% 30%)',
                      borderRadius: '8px',
                      direction: 'rtl',
                    }}
                  />
                  <Bar dataKey="questsCompleted" fill="hsl(270 100% 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Stats;
