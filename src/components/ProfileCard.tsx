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
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-blue-400', bgColor: 'bg-blue-500' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-blue-300', bgColor: 'bg-blue-400' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-slate-200', bgColor: 'bg-slate-300' },
  { key: 'agility', label: 'AGI', icon: Zap, color: 'text-blue-200', bgColor: 'bg-blue-300' },
] as const;

const getRankInfo = (totalLevel: number) => {
  // تم توحيد الألوان لتناسب اللون الأزرق والفضي
  const baseStyle = { border: 'border-blue-200/50', glow: '0 0 20px rgba(191, 219, 254, 0.3)', textColor: 'text-white' };
  if (totalLevel >= 100) return { ...baseStyle, rank: 'S', color: 'from-blue-600 to-slate-100' };
  if (totalLevel >= 50) return { ...baseStyle, rank: 'A', color: 'from-blue-500 to-slate-200' };
  if (totalLevel >= 20) return { ...baseStyle, rank: 'B', color: 'from-blue-400 to-slate-300' };
  if (totalLevel >= 10) return { ...baseStyle, rank: 'C', color: 'from-blue-300 to-slate-400' };
  if (totalLevel >= 5) return { ...baseStyle, rank: 'D', color: 'from-blue-200 to-slate-500' };
  return { ...baseStyle, rank: 'E', color: 'from-slate-400 to-slate-600' };
};

export const ProfileCard = ({ gameState, getXpProgress, onUpdateProfile }: ProfileCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  
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
        className={cn("relative rounded-2xl overflow-hidden border-2", rankInfo.border)}
        style={{ 
          backgroundImage: `url('/SystemBackground.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: rankInfo.glow
        }}
      >
        {/* Overlay to ensure readability with the blue/silver theme */}
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />

        {/* Scan Line Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-[scan_3s_linear_infinite]" />
        </div>

        {/* Status Header */}
        <div className="relative py-3 px-6 text-center border-b border-white/20 bg-blue-900/40">
          <div className="flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-blue-200 animate-pulse" />
            <h2 className="text-lg font-bold tracking-[0.3em] text-white">STATUS</h2>
            <Star className="w-4 h-4 text-blue-200 animate-pulse" />
          </div>
        </div>

        <div className="relative z-10 p-5">
          {/* Top Section - Reordered as requested */}
          <div className="flex items-start gap-6 mb-6">
            {/* Level on the Left */}
            <div className="text-center">
              <div className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {totalLevel}
              </div>
              <div className="text-[10px] text-blue-200 tracking-[0.2em] uppercase">LEVEL</div>
            </div>

            {/* Info in the Middle/Right */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
                  {gameState.playerName || 'المحارب'}
                </h3>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="p-1.5 rounded-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Edit className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              
              {/* Rank directly under name */}
              <div className={cn(
                "mt-1 text-xl font-black bg-gradient-to-r bg-clip-text text-transparent w-fit",
                rankInfo.color
              )}>
                RANK: {rankInfo.rank}
              </div>

              {/* Title under Rank */}
              <div className="flex items-center gap-2 mt-1 text-slate-300">
                <Sword className="w-3 h-3" />
                <span className="text-xs font-medium uppercase tracking-widest">
                  {gameState.playerTitle || 'محارب'}
                </span>
              </div>
            </div>
          </div>

          {/* HP and Energy Bars - Blue/Silver themed */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">HP</span>
                <span className="text-xs font-mono text-white">{Math.round(gameState.hp || 0)}/{gameState.maxHp || 100}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-slate-800 border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-white transition-all duration-500"
                  style={{ width: `${hpPercentage}%` }} 
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">MP</span>
                <span className="text-xs font-mono text-white">{Math.round(gameState.energy || 0)}/{gameState.maxEnergy || 100}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-slate-800 border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-slate-400 to-blue-200 transition-all duration-500"
                  style={{ width: `${energyPercentage}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="flex items-center justify-around mb-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-blue-300" />
              <div className="text-lg font-bold text-white">{gameState.streakDays || 0}</div>
              <div className="text-[9px] text-slate-300">أيام متتالية</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-lg font-bold text-white">{todayQuests}/{totalQuests}</div>
              <div className="text-[9px] text-slate-300">مهمات اليوم</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-lg font-bold text-blue-200">{gameState.gold || 0}</div>
              <div className="text-[9px] text-slate-300">ذهب</div>
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
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-blue-400/30 transition-all"
                >
                  <div className={cn("p-1.5 rounded-lg bg-white/10")}>
                    <Icon className={cn('w-4 h-4', stat.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-300">{stat.label}</span>
                      <span className="text-xs font-bold text-white">{level}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden bg-slate-800">
                      <div 
                        className={cn('h-full transition-all duration-500', stat.bgColor)} 
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
