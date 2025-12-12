import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Target, Calendar, Award, Dumbbell, Brain, Heart, BookOpen, User, Zap, Shield, Swords, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Stats = () => {
  const { gameState, getXpProgress } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');

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
      auraColor: 'transparent',
      shadowClass: '',
    },
    blue: {
      cardClass: 'card-level-blue',
      glowClass: 'glow-blue',
      textColor: 'text-[hsl(210_100%_70%)]',
      borderColor: 'border-[hsl(210_100%_60%/0.5)]',
      auraColor: 'hsl(210 100% 50% / 0.15)',
      shadowClass: 'shadow-[0_0_60px_hsl(210_100%_50%/0.3)]',
    },
    purple: {
      cardClass: 'card-level-purple',
      glowClass: 'glow-purple',
      textColor: 'text-primary',
      borderColor: 'border-primary/50',
      auraColor: 'hsl(270 100% 60% / 0.2)',
      shadowClass: 'shadow-[0_0_80px_hsl(270_100%_60%/0.4)]',
    },
    black: {
      cardClass: 'card-level-black',
      glowClass: 'glow-black',
      textColor: 'text-primary',
      borderColor: 'border-primary/80',
      auraColor: 'hsl(270 100% 30% / 0.3)',
      shadowClass: 'shadow-[0_0_100px_hsl(270_100%_40%/0.6)]',
    },
  };

  const currentTier = tierStyles[tier];

  const statItems = [
    { key: 'strength', label: 'STR', fullLabel: 'قوة', icon: Dumbbell, color: 'text-strength', bgColor: 'bg-strength', value: gameState.levels.strength },
    { key: 'mind', label: 'INT', fullLabel: 'ذكاء', icon: Brain, color: 'text-mind', bgColor: 'bg-mind', value: gameState.levels.mind },
    { key: 'spirit', label: 'VIT', fullLabel: 'حيوية', icon: Heart, color: 'text-spirit', bgColor: 'bg-spirit', value: gameState.levels.spirit },
    { key: 'quran', label: 'PER', fullLabel: 'إدراك', icon: BookOpen, color: 'text-quran', bgColor: 'bg-quran', value: gameState.levels.quran },
  ] as const;

  const equipmentSlots = [
    { id: 'helmet', name: 'الخوذة', position: 'top-[5%] right-[15%]', stat: '+10 INT', unlocked: totalLevel >= 10 },
    { id: 'armor', name: 'الدرع', position: 'top-[25%] right-[8%]', stat: '+15 VIT', unlocked: totalLevel >= 15 },
    { id: 'weapon', name: 'السلاح', position: 'top-[45%] left-[5%]', stat: '+20 STR', unlocked: totalLevel >= 20 },
    { id: 'gloves', name: 'القفازات', position: 'top-[35%] left-[8%]', stat: '+8 STR', unlocked: totalLevel >= 8 },
    { id: 'boots', name: 'الحذاء', position: 'bottom-[15%] right-[15%]', stat: '+5 AGI', unlocked: totalLevel >= 5 },
    { id: 'ring', name: 'الخاتم', position: 'bottom-[25%] left-[10%]', stat: '+12 PER', unlocked: totalLevel >= 12 },
    { id: 'necklace', name: 'العقد', position: 'top-[15%] left-[15%]', stat: '+10 VIT', unlocked: totalLevel >= 10 },
    { id: 'shield', name: 'الدرع', position: 'top-[55%] right-[5%]', stat: '+25 DEF', unlocked: totalLevel >= 25 },
  ];

  return (
    <div className="min-h-screen pb-24">
      <main className="container mx-auto px-4 py-6 space-y-6">
        
        {/* Tab Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all",
              activeTab === 'stats' 
                ? "bg-primary text-primary-foreground" 
                : "bg-card/50 text-muted-foreground border border-primary/20"
            )}
          >
            الإحصائيات
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all",
              activeTab === 'equipment' 
                ? "bg-primary text-primary-foreground" 
                : "bg-card/50 text-muted-foreground border border-primary/20"
            )}
          >
            المعدات
          </button>
        </div>

        {activeTab === 'stats' ? (
          <>
            {/* Main Stats Card */}
            <div className={cn(
              "relative rounded-xl overflow-hidden transition-all duration-500",
              currentTier.cardClass,
              currentTier.shadowClass,
              "border-2",
              currentTier.borderColor
            )}>
              {/* Aura/Fog Effect */}
              <div 
                className={cn(
                  "absolute inset-0 pointer-events-none transition-all duration-1000",
                  tier !== 'white' && "animate-aura-pulse"
                )}
                style={{ 
                  background: tier === 'black' 
                    ? 'radial-gradient(ellipse at center, hsl(270 100% 20% / 0.4), transparent 60%)'
                    : tier === 'purple'
                    ? 'radial-gradient(ellipse at center, hsl(270 100% 50% / 0.25), transparent 70%)'
                    : tier === 'blue'
                    ? 'radial-gradient(ellipse at center, hsl(210 100% 50% / 0.2), transparent 70%)'
                    : 'none'
                }}
              />
              
              {/* Floating Particles for higher tiers */}
              {tier !== 'white' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(tier === 'black' ? 20 : tier === 'purple' ? 12 : 6)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute w-1 h-1 rounded-full animate-float",
                        tier === 'black' ? "bg-primary/60" : tier === 'purple' ? "bg-primary/40" : "bg-blue-400/30"
                      )}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${3 + Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Header */}
              <div className={cn(
                "px-4 py-3 border-b flex items-center justify-between",
                currentTier.borderColor
              )}>
                <div className="flex items-center gap-2">
                  <Crown className={cn("w-5 h-5", currentTier.textColor)} />
                  <span className={cn("text-sm font-bold tracking-wider", currentTier.textColor)}>
                    STATUS
                  </span>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold",
                  tier === 'black' ? "bg-primary/30 text-primary border border-primary/50" :
                  tier === 'purple' ? "bg-primary/20 text-primary border border-primary/40" :
                  tier === 'blue' ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" :
                  "bg-foreground/10 text-foreground/70 border border-foreground/20"
                )}>
                  {tier.toUpperCase()} TIER
                </div>
              </div>

              <div className="p-6 relative">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left: Level & Info */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">LEVEL</div>
                      <div className={cn(
                        "text-6xl font-black",
                        currentTier.textColor,
                        tier !== 'white' && "animate-glow-pulse"
                      )}>
                        {totalLevel}
                      </div>
                    </div>

                    <div className="space-y-1 text-center">
                      <div className="text-sm font-semibold">{gameState.playerName}</div>
                      <div className={cn("text-xs", currentTier.textColor)}>{gameState.playerJob}</div>
                    </div>

                    {/* HP & Energy */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-destructive" />
                        <div className="flex-1 h-3 rounded-full bg-muted/30 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-destructive to-red-400 transition-all"
                            style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-destructive w-12 text-right">{gameState.hp}/{gameState.maxHp}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <div className="flex-1 h-3 rounded-full bg-muted/30 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all"
                            style={{ width: `${(gameState.energy / gameState.maxEnergy) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-cyan-400 w-12 text-right">{gameState.energy}/{gameState.maxEnergy}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stats */}
                  <div className="space-y-3">
                    {statItems.map((stat) => (
                      <div key={stat.key} className="flex items-center gap-2">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          "bg-gradient-to-br from-card to-muted/50 border",
                          currentTier.borderColor
                        )}>
                          <stat.icon className={cn("w-5 h-5", stat.color)} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={cn("text-xs font-bold", stat.color)}>{stat.label}</span>
                            <span className={cn("text-sm font-black", currentTier.textColor)}>{stat.value}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                            <div 
                              className={cn("h-full transition-all", stat.bgColor)}
                              style={{ width: `${getXpProgress(gameState.stats[stat.key])}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="flex items-center justify-around mt-6 py-3 rounded-lg bg-card/30 border border-primary/10">
                  <div className="text-center">
                    <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-lg font-bold">{gameState.totalQuestsCompleted}</div>
                    <div className="text-[10px] text-muted-foreground">QUESTS</div>
                  </div>
                  <div className="w-px h-10 bg-primary/20" />
                  <div className="text-center">
                    <Calendar className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                    <div className="text-lg font-bold">{gameState.streakDays}</div>
                    <div className="text-[10px] text-muted-foreground">STREAK</div>
                  </div>
                  <div className="w-px h-10 bg-primary/20" />
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
          </>
        ) : (
          /* Equipment Tab */
          <div className={cn(
            "relative rounded-xl overflow-hidden min-h-[500px]",
            "bg-gradient-to-b from-[hsl(200_80%_15%)] to-[hsl(210_60%_8%)]",
            "border-2 border-[hsl(200_100%_40%/0.3)]",
            currentTier.shadowClass
          )}>
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-xl pointer-events-none">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent opacity-50" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[hsl(200_100%_60%)] to-transparent opacity-50" />
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-[hsl(200_100%_60%)] to-transparent opacity-50" />
              <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-[hsl(200_100%_60%)] to-transparent opacity-50" />
            </div>

            {/* Header */}
            <div className="px-4 py-3 border-b border-[hsl(200_100%_50%/0.2)]">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-[hsl(200_100%_70%)]" />
                <span className="text-sm font-bold text-[hsl(200_100%_70%)] tracking-wider underline underline-offset-4">
                  EQUIPMENT
                </span>
              </div>
            </div>

            <div className="relative h-[450px] p-4">
              {/* Body Silhouette Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Aura behind silhouette */}
                  <div className={cn(
                    "absolute inset-0 rounded-full blur-3xl",
                    tier === 'black' ? "bg-primary/30 animate-aura-pulse" :
                    tier === 'purple' ? "bg-primary/20 animate-aura-pulse" :
                    tier === 'blue' ? "bg-blue-500/15 animate-pulse-slow" :
                    "bg-foreground/5"
                  )} style={{ transform: 'scale(1.5)' }} />
                  
                  {/* SVG Body */}
                  <svg viewBox="0 0 120 280" className="w-40 h-72 relative z-10 drop-shadow-2xl">
                    <defs>
                      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(200 50% 40%)" />
                        <stop offset="50%" stopColor="hsl(200 30% 25%)" />
                        <stop offset="100%" stopColor="hsl(200 50% 35%)" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Head */}
                    <circle cx="60" cy="30" r="22" fill="url(#bodyGradient)" filter="url(#glow)" />
                    <circle cx="55" cy="25" r="2" fill="hsl(200 100% 70%)" opacity="0.8" />
                    <circle cx="65" cy="25" r="2" fill="hsl(200 100% 70%)" opacity="0.8" />
                    {/* Neck */}
                    <rect x="52" y="52" width="16" height="15" fill="url(#bodyGradient)" />
                    {/* Body/Torso */}
                    <path d="M35 67 L85 67 L90 140 L75 140 L75 180 L45 180 L45 140 L30 140 Z" fill="url(#bodyGradient)" filter="url(#glow)" />
                    {/* Arms */}
                    <path d="M30 70 L10 130 L18 135 L35 85" fill="url(#bodyGradient)" />
                    <path d="M90 70 L110 130 L102 135 L85 85" fill="url(#bodyGradient)" />
                    {/* Hands */}
                    <circle cx="12" cy="138" r="8" fill="url(#bodyGradient)" />
                    <circle cx="108" cy="138" r="8" fill="url(#bodyGradient)" />
                    {/* Legs */}
                    <path d="M45 180 L40 270 L55 270 L58 190 L62 190 L65 270 L80 270 L75 180 Z" fill="url(#bodyGradient)" filter="url(#glow)" />
                  </svg>
                </div>
              </div>

              {/* Equipment Slots */}
              {equipmentSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={cn(
                    "absolute w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all",
                    slot.position,
                    slot.unlocked
                      ? "bg-[hsl(200_30%_20%/0.8)] border-[hsl(200_100%_50%/0.5)] hover:border-[hsl(200_100%_60%)]"
                      : "bg-[hsl(200_20%_15%/0.6)] border-[hsl(200_50%_30%/0.3)] opacity-50"
                  )}
                >
                  {slot.unlocked ? (
                    <>
                      <Swords className="w-5 h-5 text-[hsl(200_100%_60%)] mb-1" />
                      <span className="text-[8px] text-[hsl(150_60%_50%)]">{slot.stat}</span>
                    </>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">[None]</span>
                  )}
                </div>
              ))}

              {/* Connection Lines (decorative) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <line x1="50%" y1="15%" x2="75%" y2="10%" stroke="hsl(200 100% 50% / 0.2)" strokeWidth="1" />
                <line x1="50%" y1="30%" x2="80%" y2="30%" stroke="hsl(200 100% 50% / 0.2)" strokeWidth="1" />
                <line x1="50%" y1="50%" x2="20%" y2="55%" stroke="hsl(200 100% 50% / 0.2)" strokeWidth="1" />
                <line x1="50%" y1="70%" x2="25%" y2="80%" stroke="hsl(200 100% 50% / 0.2)" strokeWidth="1" />
              </svg>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Stats;