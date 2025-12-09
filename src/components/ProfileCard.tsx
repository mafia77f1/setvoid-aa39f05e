import { Dumbbell, Brain, Heart, BookOpen, Flame, User } from 'lucide-react';
import { GameState } from '@/types/game';

interface ProfileCardProps {
  gameState: GameState;
  getXpProgress: (xp: number) => number;
}

const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-strength' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-mind' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-spirit' },
  { key: 'quran', label: 'QRN', icon: BookOpen, color: 'text-quran' },
] as const;

export const ProfileCard = ({ gameState, getXpProgress }: ProfileCardProps) => {
  const totalLevel = gameState.levels.strength + gameState.levels.mind + gameState.levels.spirit + gameState.levels.quran;
  const todayQuests = gameState.quests.filter(q => q.completed).length;
  const totalQuests = gameState.quests.length;

  return (
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
        {/* Level and Name Section */}
        <div className="flex items-start gap-6 mb-6">
          {/* Level Display */}
          <div className="text-center">
            <div className="text-5xl font-bold text-primary glow-text">{totalLevel}</div>
            <div className="text-xs text-muted-foreground tracking-widest">LEVEL</div>
          </div>

          {/* Name and Title */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-primary/70">JOB:</span>
              <span className="font-semibold">{gameState.playerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary/70">TITLE:</span>
              <span className="text-sm text-primary">محارب التطوير الذاتي</span>
            </div>
          </div>

          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-lg border-2 border-primary/50 bg-primary/10 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-6" />

        {/* Quick Stats Row */}
        <div className="flex items-center justify-around mb-6 py-3 rounded-lg bg-card/50 border border-primary/20">
          <div className="text-center">
            <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
            <div className="text-lg font-bold">{gameState.streakDays}</div>
            <div className="text-[10px] text-muted-foreground">أيام متتالية</div>
          </div>
          <div className="w-px h-10 bg-primary/30" />
          <div className="text-center">
            <div className="text-lg font-bold">{todayQuests}/{totalQuests}</div>
            <div className="text-[10px] text-muted-foreground">مهمات اليوم</div>
          </div>
          <div className="w-px h-10 bg-primary/30" />
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">{gameState.totalQuestsCompleted}</div>
            <div className="text-[10px] text-muted-foreground">مهمة مكتملة</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const level = gameState.levels[stat.key];
            const xp = gameState.stats[stat.key];
            const progress = getXpProgress(xp);

            return (
              <div
                key={stat.key}
                className="flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-primary/10"
              >
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${stat.color}`}>{stat.label}</span>
                    <span className="stat-value text-sm">{level}</span>
                  </div>
                  <div className="stats-bar h-2">
                    <div 
                      className={`stats-bar-fill ${stat.color.replace('text-', 'bg-')}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};