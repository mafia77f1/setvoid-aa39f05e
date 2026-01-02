import { useState } from 'react';
import { Dumbbell, Brain, Heart, Zap, Edit, Star, Flame } from 'lucide-react';
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
  const base = { textColor: 'text-blue-100', glow: '0 0 15px rgba(255,255,255,0.2)' };
  if (totalLevel >= 100) return { ...base, rank: 'S' };
  if (totalLevel >= 50) return { ...base, rank: 'A' };
  if (totalLevel >= 20) return { ...base, rank: 'B' };
  if (totalLevel >= 10) return { ...base, rank: 'C' };
  return { ...base, rank: 'E' };
};

export const ProfileCard = ({ gameState, getXpProgress, onUpdateProfile }: ProfileCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  
  const totalLevel = gameState.totalLevel || 100; // مثال كما في الصورة
  const rankInfo = getRankInfo(totalLevel);
  const hpPercentage = Math.min(100, Math.max(0, ((gameState.hp || 0) / (gameState.maxHp || 100)) * 100));
  const energyPercentage = Math.min(100, Math.max(0, ((gameState.energy || 0) / (gameState.maxEnergy || 100)) * 100));

  return (
    <>
      <div className="relative rounded-xl overflow-hidden border border-blue-500/30 bg-black/40 p-1 shadow-2xl">
        {/* Background with Blur */}
        <div 
          className="absolute inset-0 z-0 opacity-40 blur-sm"
          style={{ 
            backgroundImage: `url('/SystemBackground.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Header: STATUS */}
        <div className="relative z-10 border-b border-blue-500/40 py-2 mb-6">
          <h2 className="text-center text-xl font-bold tracking-[0.5em] text-blue-100 drop-shadow-md">STATUS</h2>
        </div>

        <div className="relative z-10 px-6 pb-6">
          {/* Top Section: Level, Name, Title */}
          <div className="flex items-center gap-8 mb-8">
            {/* Big Level */}
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {totalLevel}
              </span>
              <span className="text-xs font-bold text-blue-200 tracking-widest mt-1">LEVEL</span>
            </div>

            {/* Job (Name) & Title */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-[10px] font-bold uppercase">NAME:</span>
                <span className="text-white font-bold text-lg flex items-center gap-2">
                  {gameState.playerName || 'Shadow Monarch'}
                  <button onClick={() => setShowEditModal(true)} className="opacity-50 hover:opacity-100 transition-opacity">
                    <Edit className="w-3 h-3" />
                  </button>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-[10px] font-bold uppercase">TITLE:</span>
                <span className="text-white text-xs font-medium tracking-wide">
                  {gameState.playerTitle || 'The One Who Overcame Adversity'}
                </span>
              </div>
            </div>
          </div>

          {/* Status Bar Container (HP, MP, Rank) */}
          <div className="border border-blue-500/30 bg-blue-900/20 p-4 rounded-sm flex items-end justify-between gap-4">
            <div className="flex-1 space-y-4">
              {/* HP Bar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-white w-4">HP</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full border border-blue-400/20 overflow-hidden">
                  <div className="h-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" style={{ width: `${hpPercentage}%` }} />
                </div>
                <span className="text-[9px] font-mono text-blue-100">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              {/* MP Bar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-white w-4">MP</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full border border-blue-400/20 overflow-hidden">
                  <div className="h-full bg-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.4)]" style={{ width: `${energyPercentage}%` }} />
                </div>
                <span className="text-[9px] font-mono text-blue-100">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
            </div>

            {/* Rank - Positioned like the Circle in image */}
            <div className="flex flex-col items-center justify-center border-l border-blue-500/30 pl-4">
              <div className="text-[10px] text-blue-300 font-bold mb-1 uppercase">Rank</div>
              <div className="w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center text-xl font-black text-white bg-blue-500/20">
                {rankInfo.rank}
              </div>
            </div>
          </div>

          {/* Stats Grid - Same as before but styled to match */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {stats.map((stat) => (
              <div key={stat.key} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-sm">
                <stat.icon className={cn("w-3 h-3", stat.color)} />
                <div className="flex-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-300 mb-1">
                    <span>{stat.label}</span>
                    <span>{gameState.levels?.[stat.key] || 1}</span>
                  </div>
                  <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all", stat.bgColor)} style={{ width: `${getXpProgress(gameState.stats?.[stat.key] || 0)}%` }} />
                  </div>
                </div>
              </div>
            ))}
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
