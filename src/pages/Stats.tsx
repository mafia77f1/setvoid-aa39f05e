import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';

const Stats = () => {
  const { gameState } = useGameState();

  const statData = [
    { name: 'الجسد', value: gameState.stats.strength, fill: 'hsl(0, 70%, 55%)' },
    { name: 'العقل', value: gameState.stats.mind, fill: 'hsl(210, 80%, 55%)' },
    { name: 'الروح', value: gameState.stats.spirit, fill: 'hsl(270, 70%, 60%)' },
    { name: 'القرآن', value: gameState.stats.quran, fill: 'hsl(150, 60%, 45%)' },
  ];

  const completedQuests = gameState.quests.filter(q => q.completed).length;
  const totalQuests = gameState.quests.length;
  const completionRate = Math.round((completedQuests / totalQuests) * 100);

  const last7Days = gameState.dailyStats.slice(-7);

  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-border bg-card/50 px-4 py-6">
        <h1 className="text-2xl font-bold">الإحصائيات</h1>
        <p className="text-muted-foreground">تتبع تقدمك وإنجازاتك</p>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card flex items-center gap-3">
            <div className="rounded-lg bg-primary/20 p-2">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{gameState.totalQuestsCompleted}</p>
              <p className="text-xs text-muted-foreground">مهمة مكتملة</p>
            </div>
          </div>
          
          <div className="stat-card flex items-center gap-3">
            <div className="rounded-lg bg-secondary/20 p-2">
              <Calendar className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{gameState.streakDays}</p>
              <p className="text-xs text-muted-foreground">أيام متتالية</p>
            </div>
          </div>

          <div className="stat-card flex items-center gap-3">
            <div className="rounded-lg bg-strength/20 p-2">
              <TrendingUp className="h-5 w-5 text-strength" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completionRate}%</p>
              <p className="text-xs text-muted-foreground">معدل الإنجاز اليوم</p>
            </div>
          </div>

          <div className="stat-card flex items-center gap-3">
            <div className="rounded-lg bg-quran/20 p-2">
              <Award className="h-5 w-5 text-quran" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {gameState.achievements.filter(a => a.unlocked).length}
              </p>
              <p className="text-xs text-muted-foreground">إنجاز محقق</p>
            </div>
          </div>
        </div>

        {/* XP Distribution */}
        <div className="stat-card">
          <h3 className="mb-4 font-semibold">توزيع نقاط الخبرة</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(240, 10%, 10%)',
                    border: '1px solid hsl(240, 10%, 20%)',
                    borderRadius: '8px',
                    direction: 'rtl',
                  }}
                  formatter={(value: number) => [`${value} XP`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {statData.map(stat => (
              <div key={stat.name} className="flex items-center gap-2 text-sm">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: stat.fill }}
                />
                <span className="text-muted-foreground">{stat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        {last7Days.length > 0 && (
          <div className="stat-card">
            <h3 className="mb-4 font-semibold">تقدم الأسبوع</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 10 }}
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                  />
                  <YAxis tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(240, 10%, 10%)',
                      border: '1px solid hsl(240, 10%, 20%)',
                      borderRadius: '8px',
                      direction: 'rtl',
                    }}
                  />
                  <Bar dataKey="questsCompleted" fill="hsl(270, 70%, 60%)" radius={[4, 4, 0, 0]} />
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
