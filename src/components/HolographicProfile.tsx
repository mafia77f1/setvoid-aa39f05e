import { User, Shield, Zap, Target, Flame, Crown, MapPin, Calendar, Award } from 'lucide-react';
import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';

interface HolographicProfileProps {
  gameState: GameState;
}

const getRankInfo = (totalLevel: number) => {
  if (totalLevel >= 50) return { rank: 'S', color: 'text-orange-400', border: 'border-orange-400/50', glow: 'shadow-orange-400/30' };
  if (totalLevel >= 40) return { rank: 'A', color: 'text-purple-400', border: 'border-purple-400/50', glow: 'shadow-purple-400/30' };
  if (totalLevel >= 30) return { rank: 'B', color: 'text-blue-400', border: 'border-blue-400/50', glow: 'shadow-blue-400/30' };
  if (totalLevel >= 20) return { rank: 'C', color: 'text-green-400', border: 'border-green-400/50', glow: 'shadow-green-400/30' };
  if (totalLevel >= 10) return { rank: 'D', color: 'text-yellow-400', border: 'border-yellow-400/50', glow: 'shadow-yellow-400/30' };
  return { rank: 'E', color: 'text-gray-400', border: 'border-gray-400/50', glow: 'shadow-gray-400/30' };
};

const getClassName = (totalLevel: number) => {
  if (totalLevel >= 50) return 'Shadow Monarch';
  if (totalLevel >= 40) return 'S-Rank Hunter';
  if (totalLevel >= 30) return 'A-Rank Hunter';
  if (totalLevel >= 20) return 'B-Rank Hunter';
  if (totalLevel >= 10) return 'C-Rank Hunter';
  return 'E-Rank Hunter';
};

export const HolographicProfile = ({ gameState }: HolographicProfileProps) => {
  const totalLevel = gameState.totalLevel;
  const rankInfo = getRankInfo(totalLevel);
  const className = getClassName(totalLevel);
  
  const completedGates = gameState.gates?.filter(g => g.completed).length || 0;
  const completedQuests = gameState.quests?.filter(q => q.completed).length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Main Profile Card - Holographic Style */}
      <div className="relative overflow-hidden">
        {/* Holographic Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/10 to-blue-900/20" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.1)_50%,transparent_75%)] bg-[length:200%_200%] animate-pulse" />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-blue-400/60" />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-blue-400/60" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-blue-400/60" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-blue-400/60" />

        <div className={cn(
          "relative border-2 bg-black/70 backdrop-blur-sm p-6",
          rankInfo.border,
          `shadow-[0_0_30px_${rankInfo.glow}]`
        )}>
          {/* Header Badge */}
          <div className="flex justify-center mb-6 mt-[-1.5rem]">
            <div className="border border-slate-400/50 px-6 py-1 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <h2 className="text-xs font-bold tracking-widest text-white uppercase italic">
                Hunter Profile
              </h2>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <div className={cn(
                "w-32 h-40 border-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 flex items-center justify-center relative overflow-hidden",
                rankInfo.border
              )}>
                {/* Grid inside avatar */}
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `
                    linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)
                  `,
                  backgroundSize: '10px 10px'
                }} />
                
                {/* Silhouette */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-slate-600/50 to-slate-700/50 flex items-center justify-center mb-2">
                    <User className="w-10 h-10 text-slate-400/70" />
                  </div>
                  <div className="w-20 h-8 bg-gradient-to-b from-slate-600/30 to-transparent rounded-t-full" />
                </div>

                {/* Scan Line Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse" 
                       style={{ top: '30%' }} />
                </div>
              </div>

              {/* Rank Badge */}
              <div className={cn(
                "absolute -bottom-2 -right-2 w-10 h-10 border-2 bg-black/90 flex items-center justify-center",
                rankInfo.border
              )}>
                <span className={cn("text-xl font-black italic", rankInfo.color)}>
                  {rankInfo.rank}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-3">
              {/* Name */}
              <div className="border-b border-blue-400/20 pb-2">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Hunter Name</p>
                <p className="text-lg font-bold text-white italic tracking-wide">
                  {gameState.playerName}
                </p>
              </div>

              {/* Class */}
              <div className="border-b border-blue-400/20 pb-2">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Class</p>
                <p className={cn("text-sm font-bold italic", rankInfo.color)}>
                  {className}
                </p>
              </div>

              {/* Title */}
              <div className="border-b border-blue-400/20 pb-2">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Title</p>
                <p className="text-sm font-bold text-blue-300 italic">
                  {gameState.equippedTitle || '-'}
                </p>
              </div>

              {/* Level */}
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Level</p>
                <p className="text-2xl font-black text-white italic drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  LV. {totalLevel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bars */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/60 border border-red-500/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HP</span>
            </div>
            <span className="text-xs font-bold text-white">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
              style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-black/60 border border-yellow-500/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Energy</span>
            </div>
            <span className="text-xs font-bold text-white">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-500"
              style={{ width: `${(gameState.energy / gameState.maxEnergy) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bg-black/60 border border-blue-500/30 p-4">
        <div className="flex justify-center mb-4 mt-[-1.5rem]">
          <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase">Statistics</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700/50">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold">Streak</p>
              <p className="text-lg font-bold text-white">{gameState.streakDays} <span className="text-[10px] text-slate-400">days</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700/50">
            <Target className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold">Gates Cleared</p>
              <p className="text-lg font-bold text-white">{completedGates}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700/50">
            <Award className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold">Quests Done</p>
              <p className="text-lg font-bold text-white">{completedQuests}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700/50">
            <Crown className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold">Gold</p>
              <p className="text-lg font-bold text-yellow-400">{gameState.gold.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Abilities Summary */}
      <div className="bg-black/60 border border-blue-500/30 p-4">
        <div className="flex justify-center mb-4 mt-[-1.5rem]">
          <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase">Power Levels</h3>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { name: 'STRENGTH', value: gameState.levels.strength, color: 'bg-red-500' },
            { name: 'MIND', value: gameState.levels.mind, color: 'bg-blue-500' },
            { name: 'SPIRIT', value: gameState.levels.spirit, color: 'bg-purple-500' },
            { name: 'AGILITY', value: gameState.levels.agility || 0, color: 'bg-green-500' },
          ].map((stat) => (
            <div key={stat.name} className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase w-20">{stat.name}</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-500", stat.color)}
                  style={{ width: `${Math.min((stat.value / 100) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-white w-8 text-right">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
