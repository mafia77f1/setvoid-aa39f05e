import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Target, Calendar, Award, Dumbbell, Brain, Heart, BookOpen, User } from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress } = useGameState();

  const completedQuests = gameState.quests.filter(q => q.completed).length;
  const totalQuests = gameState.quests.length;
  const completionRate = Math.round((completedQuests / totalQuests) * 100);
  const totalLevel = gameState.levels.strength + gameState.levels.mind + gameState.levels.spirit + gameState.levels.quran;

  const last7Days = gameState.dailyStats.slice(-7);

  const statItems = [
    { key: 'strength', label: 'STR', fullLabel: 'قوة الجسد', icon: Dumbbell, color: 'text-strength', bgColor: 'bg-strength' },
    { key: 'mind', label: 'INT', fullLabel: 'قوة العقل', icon: Brain, color: 'text-mind', bgColor: 'bg-mind' },
    { key: 'spirit', label: 'SPR', fullLabel: 'قوة الروح', icon: Heart, color: 'text-spirit', bgColor: 'bg-spirit' },
    { key: 'quran', label: 'QRN', fullLabel: 'تقدم القرآن', icon: BookOpen, color: 'text-quran', bgColor: 'bg-quran' },
  ] as const;

  return (
    <div className="min-h-screen pb-24">
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Main Status Panel - Like Solo Leveling */}
        <div className="profile-card">
          {/* Corner Decorations */}
          <div className="corner-decoration corner-tl" />
          <div className="corner-decoration corner-tr" />
          <div className="corner-decoration corner-bl" />
          <div className="corner-decoration corner-br" />
          
          {/* Scan Line Effect */}
          <div className="scan-line" />

          {/* Status Header */}
          <div className="status-header">
            <h2>STATUS</h2>
          </div>

          <div className="p-6">
            {/* Level and Name */}
            <div className="flex items-start gap-6 mb-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary glow-text">{totalLevel}</div>
                <div className="text-xs text-muted-foreground tracking-widest mt-1">LEVEL</div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-primary/70">JOB:</span>
                  <span className="font-semibold">{gameState.playerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary/70">TITLE:</span>
                  <span className="text-sm text-primary">محارب التطوير الذاتي</span>
                </div>
              </div>

              <div className="w-16 h-16 rounded-lg border-2 border-primary/50 bg-primary/10 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-6" />

            {/* Quick Stats */}
            <div className="flex items-center justify-around mb-6 py-3 rounded-lg bg-card/50 border border-primary/20">
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

            {/* Stats Breakdown */}
            <div className="space-y-4">
              {statItems.map((stat) => {
                const Icon = stat.icon;
                const level = gameState.levels[stat.key];
                const xp = gameState.stats[stat.key];
                const progress = getXpProgress(xp);
                const nextLevelXp = 100 - (xp % 100);

                return (
                  <div key={stat.key} className="flex items-center gap-4">
                    <div className={`ability-icon ${stat.color.replace('text-', 'bg-')}/20`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${stat.color}`}>{stat.label}</span>
                          <span className="text-xs text-muted-foreground">{stat.fullLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="stat-value">{level}</span>
                          <span className="stat-bonus">+{xp} XP</span>
                        </div>
                      </div>
                      <div className="stats-bar h-3">
                        <div 
                          className={`stats-bar-fill ${stat.bgColor}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {nextLevelXp} XP للمستوى التالي
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    tick={{ fill: 'hsl(220 10% 55%)', fontSize: 10 }}
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                  />
                  <YAxis tick={{ fill: 'hsl(220 10% 55%)', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220 25% 10%)',
                      border: '1px solid hsl(200 50% 30%)',
                      borderRadius: '8px',
                      direction: 'rtl',
                    }}
                  />
                  <Bar dataKey="questsCompleted" fill="hsl(200 100% 50%)" radius={[4, 4, 0, 0]} />
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