import { useState } from 'react';
import { Dumbbell, Brain, Heart, Zap, Edit, Shield, Flame, Crown, Sword, Star } from 'lucide-react';
import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';
import { EditProfileModal } from './EditProfileModal';

interface ProfileCardProps {
  gameState: GameState;
  getXpProgress: (xp: number) => number;
  onUpdateProfile?: (name: string, title: string) => void;
}

const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-strength', bgColor: 'bg-strength' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-mind', bgColor: 'bg-mind' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-spirit', bgColor: 'bg-spirit' },
  { key: 'agility', label: 'AGI', icon: Zap, color: 'text-quran', bgColor: 'bg-quran' },
] as const;

const getRankInfo = (totalLevel: number) => {
  if (totalLevel >= 100) return { rank: 'S', color: 'from-red-500 to-orange-500', border: 'border-red-500', glow: '0 0 60px rgba(239, 68, 68, 0.6)', textColor: 'text-red-400' };
  if (totalLevel >= 50) return { rank: 'A', color: 'from-purple-500 to-pink-500', border: 'border-purple-500', glow: '0 0 50px rgba(168, 85, 247, 0.5)', textColor: 'text-purple-400' };
  if (totalLevel >= 20) return { rank: 'B', color: 'from-blue-500 to-cyan-500', border: 'border-blue-500', glow: '0 0 40px rgba(59, 130, 246, 0.4)', textColor: 'text-blue-400' };
  if (totalLevel >= 10) return { rank: 'C', color: 'from-green-500 to-emerald-500', border: 'border-green-500', glow: '0 0 30px rgba(34, 197, 94, 0.3)', textColor: 'text-green-400' };
  if (totalLevel >= 5) return { rank: 'D', color: 'from-yellow-500 to-amber-500', border: 'border-yellow-500', glow: '0 0 25px rgba(234, 179, 8, 0.3)', textColor: 'text-yellow-400' };
  return { rank: 'E', color: 'from-gray-400 to-gray-500', border: 'border-gray-400', glow: '0 0 20px rgba(156, 163, 175, 0.2)', textColor: 'text-gray-400' };
};

export const ProfileCard = ({ gameState, getXpProgress, onUpdateProfile }: ProfileCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Calculate total level safely
  const totalLevel = gameState.totalLevel || 
    ((gameState.levels?.strength || 1) + (gameState.levels?.mind || 1) + (gameState.levels?.spirit || 1) + (gameState.levels?.agility || 1));
  
  const todayQuests = gameState.quests?.filter(q => q.completed).length || 0;
  const totalQuests = gameState.quests?.length || 0;
  const rankInfo = getRankInfo(totalLevel);
  const hpPercentage = Math.min(100, Math.max(0, ((gameState.hp || 0) / (gameState.maxHp || 100)) * 100));
  const energyPercentage = Math.min(100, Math.max(0, ((gameState.energy || 0) / (gameState.maxEnergy || 100)) * 100));

  return (
    <>
      <div 
        className={cn("relative rounded-2xl overflow-hidden", rankInfo.border)}
        style={{ 
          background: 'linear-gradient(180deg, hsl(260 35% 10% / 0.95), hsl(260 40% 5% / 0.95))',
          borderWidth: '2px',
          boxShadow: rankInfo.glow
        }}
      >
        {/* Animated Background Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/60" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/60" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/60" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/60" />
        
        {/* Scan Line Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-[scan_3s_linear_infinite]" 
               style={{ animation: 'scan 3s linear infinite' }} />
        </div>

        {/* Status Header - Solo Leveling Style */}
        <div className="relative py-4 px-6 text-center border-b border-primary/30 bg-gradient-to-b from-primary/15 to-transparent">
          <div className="flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-primary animate-pulse" />
            <h2 className="text-xl font-bold tracking-[0.3em] text-primary glow-text">STATUS</h2>
            <Star className="w-4 h-4 text-primary animate-pulse" />
          </div>
        </div>

        <div className="relative z-10 p-5">
          {/* Top Section - Level & Rank */}
          <div className="flex items-center justify-between mb-4">
            {/* Level Display */}
            <div className="text-center">
              <div className={cn("text-5xl font-black glow-text", rankInfo.textColor)}>
                {totalLevel}
              </div>
              <div className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase mt-1">LEVEL</div>
            </div>

            {/* Rank Badge */}
            <div 
              className={cn(
                "w-20 h-20 rounded-xl flex items-center justify-center text-3xl font-black bg-gradient-to-br",
                rankInfo.color
              )}
              style={{ boxShadow: rankInfo.glow }}
            >
              {rankInfo.rank}
            </div>

            {/* Edit Button */}
            <button 
              onClick={() => setShowEditModal(true)}
              className="p-3 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all hover:scale-105"
            >
              <Edit className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Player Info */}
          <div className="mb-4 p-3 rounded-xl bg-card/50 border border-primary/20">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-secondary" />
                <span className="text-muted-foreground text-xs">NAME:</span>
              </div>
              <div className="font-bold text-right">{gameState.playerName || 'المحارب'}</div>
              
              <div className="flex items-center gap-2">
                <Sword className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground text-xs">TITLE:</span>
              </div>
              <div className="text-primary text-right text-xs">{gameState.playerTitle || 'محارب'}</div>
            </div>
          </div>

          {/* HP and Energy Bars */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-destructive" />
                  <span className="text-xs font-bold">HP</span>
                </div>
                <span className="text-xs font-mono">{Math.round(gameState.hp || 0)}/{gameState.maxHp || 100}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden bg-muted/30 border border-destructive/30">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                  style={{ width: `${hpPercentage}%`, boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }} 
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-bold">MP</span>
                </div>
                <span className="text-xs font-mono">{Math.round(gameState.energy || 0)}/{gameState.maxEnergy || 100}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden bg-muted/30 border border-secondary/30">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
                  style={{ width: `${energyPercentage}%`, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }} 
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-4" />

          {/* Quick Stats Row */}
          <div className="flex items-center justify-around mb-4 py-3 rounded-xl bg-card/30 border border-primary/20">
            <div className="text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
              <div className="text-lg font-bold">{gameState.streakDays || 0}</div>
              <div className="text-[9px] text-muted-foreground">أيام متتالية</div>
            </div>
            <div className="w-px h-10 bg-primary/30" />
            <div className="text-center">
              <div className="text-lg font-bold">{todayQuests}/{totalQuests}</div>
              <div className="text-[9px] text-muted-foreground">مهمات اليوم</div>
            </div>
            <div className="w-px h-10 bg-primary/30" />
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">{gameState.gold || 0}</div>
              <div className="text-[9px] text-muted-foreground">ذهب</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels?.[stat.key] || 1;
              const xp = gameState.stats?.[stat.key] || 0;
              const progress = getXpProgress(xp);

              return (
                <div 
                  key={stat.key} 
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-card/30 border border-primary/10 hover:border-primary/30 transition-all"
                >
                  <div className={cn("p-1.5 rounded-lg", stat.bgColor + '/20')}>
                    <Icon className={cn('w-4 h-4', stat.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-xs font-bold', stat.color)}>{stat.label}</span>
                      <span className="text-sm font-bold">{level}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden bg-muted/30">
                      <div 
                        className={cn('h-full rounded-full transition-all duration-500', stat.bgColor)} 
                        style={{ width: `${progress}%`, boxShadow: '0 0 8px currentColor' }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {onUpdateProfile && (
        <EditProfileModal
          show={showEditModal}
          currentName={gameState.playerName}
          currentTitle={gameState.playerTitle}
          onSave={onUpdateProfile}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};
