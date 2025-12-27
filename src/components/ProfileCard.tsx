import { useState } from 'react';
import { Dumbbell, Brain, Heart, BookOpen, Flame, Edit, Shield, Zap } from 'lucide-react';
import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';
import { EditProfileModal } from './EditProfileModal';

interface ProfileCardProps {
  gameState: GameState;
  getXpProgress: (xp: number) => number;
  onUpdateProfile?: (name: string, title: string) => void;
}

const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-blue-400' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-blue-300' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-blue-200' },
  { key: 'quran', label: 'QRN', icon: BookOpen, color: 'text-blue-100' },
] as const;

const getRankColor = (totalLevel: number) => {
  // ألوان تعتمد على نظام Solo Leveling (توهج أزرق ورمادي ملكي)
  if (totalLevel >= 50) return { border: 'border-blue-400', bg: 'bg-blue-900/20', glow: 'shadow-[0_0_20px_rgba(96,165,250,0.5)]', text: 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' };
  if (totalLevel >= 20) return { border: 'border-blue-500/50', bg: 'bg-blue-950/20', glow: 'shadow-blue-500/30', text: 'text-blue-100' };
  return { border: 'border-slate-500/50', bg: 'bg-slate-900/20', glow: 'shadow-none', text: 'text-slate-100' };
};

export const ProfileCard = ({ gameState, getXpProgress, onUpdateProfile }: ProfileCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const totalLevel = gameState.totalLevel || (gameState.levels.strength + gameState.levels.mind + gameState.levels.spirit + gameState.levels.quran);
  const todayQuests = gameState.quests.filter(q => q.completed).length;
  const totalQuests = gameState.quests.length;
  const rankColor = getRankColor(totalLevel);
  const hpPercentage = (gameState.hp / gameState.maxHp) * 100;
  const energyPercentage = (gameState.energy / gameState.maxEnergy) * 100;

  return (
    <>
      <div className={cn(
        "profile-card relative bg-black/80 border-2 transition-all duration-500", 
        rankColor.border, 
        rankColor.glow
      )}>
        {/* Corner Decorations - White/Blue accents */}
        <div className="corner-decoration corner-tl border-blue-400" />
        <div className="corner-decoration corner-tr border-blue-400" />
        <div className="corner-decoration corner-bl border-blue-400" />
        <div className="corner-decoration corner-br border-blue-400" />
        
        {/* Scan Line Effect */}
        <div className="scan-line opacity-20" />

        {/* Status Header - Match Market Style */}
        <div className="status-header bg-slate-900/90 border-b border-blue-500/30">
          <h2 className="text-blue-400 tracking-[0.2em] font-bold drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]">STATUS</h2>
        </div>

        <div className="p-6 relative z-10">
          {/* Level and Name Section */}
          <div className="flex items-start gap-6 mb-4">
            <div className="text-center">
              <div className={cn("text-5xl font-black italic tracking-tighter", rankColor.text)}>
                {totalLevel}
              </div>
              <div className="text-[10px] text-blue-400/70 tracking-[0.2em] font-bold">LEVEL</div>
            </div>

            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-slate-500 font-bold">JOB:</span>
                <span className="text-sm font-bold text-white uppercase italic">{totalLevel >= 100 ? gameState.playerJob : 'UNKNOWN'}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-slate-500 font-bold">NAME:</span>
                <span className="text-sm font-bold text-blue-50 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{gameState.playerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold">TITLE:</span>
                <span className="text-xs font-bold text-blue-400 italic uppercase">{gameState.playerTitle}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-none bg-blue-500/10 border border-blue-500/40 hover:bg-blue-500/20 transition-all"
            >
              <Edit className="w-4 h-4 text-blue-400" />
            </button>
          </div>

          {/* HP and Energy Bars - High Contrast */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-red-500" />
                  <span className="text-[10px] font-bold text-slate-400">HP</span>
                </div>
                <span className="text-[10px] font-mono text-red-400">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="h-1.5 bg-red-950/30 border border-red-900/20">
                <div className="h-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)] transition-all" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] font-bold text-slate-400">MP</span>
                </div>
                <span className="text-[10px] font-mono text-blue-400">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="h-1.5 bg-blue-950/30 border border-blue-900/20">
                <div className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-4" />

          {/* Quick Stats Row - Market Theme */}
          <div className="flex items-center justify-around mb-4 py-3 bg-blue-950/20 border border-blue-500/20">
            <div className="text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-orange-500 filter drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
              <div className="text-lg font-black text-white">{gameState.streakDays}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase">Streak</div>
            </div>
            <div className="w-px h-8 bg-blue-500/20" />
            <div className="text-center">
              <div className="text-lg font-black text-white">{todayQuests}/{totalQuests}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase">Quests</div>
            </div>
            <div className="w-px h-8 bg-blue-500/20" />
            <div className="text-center">
              <div className="text-lg font-black text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">{gameState.gold?.toLocaleString() || 0}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase">Gold</div>
            </div>
          </div>

          {/* Stats Grid - Using Cyan/Blue System Colors */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="relative group p-3 bg-black/40 border border-slate-700/50 hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4', stat.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn('text-[10px] font-black tracking-tighter', stat.color)}>{stat.label}</span>
                        <span className="text-xs font-bold text-white">{level}</span>
                      </div>
                      <div className="h-1 bg-slate-800">
                        <div 
                          className={cn('h-full shadow-[0_0_5px_rgba(96,165,250,0.3)] transition-all', stat.color.replace('text-', 'bg-'))} 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
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
