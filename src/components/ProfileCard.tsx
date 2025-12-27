import { useState } from 'react';
import { Dumbbell, Brain, Heart, BookOpen, Flame, User, Edit, Shield, Zap } from 'lucide-react';
import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';
import { EditProfileModal } from './EditProfileModal';

interface ProfileCardProps {
  gameState: GameState;
  getXpProgress: (xp: number) => number;
  onUpdateProfile?: (name: string, title: string) => void;
}

// تعديل الألوان لتكون بيضاء بالكامل
const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-white' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-white' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-white' },
  { key: 'quran', label: 'QRN', icon: BookOpen, color: 'text-white' },
] as const;

const getRankColor = (totalLevel: number) => {
  // توحيد الألوان لتكون بيضاء متوهجة
  return { 
    border: 'border-white', 
    bg: 'bg-white/5', 
    glow: 'shadow-[0_0_15px_rgba(255,255,255,0.5)]', 
    text: 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
  };
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
      <div className={cn("profile-card bg-black border-2", rankColor.border, rankColor.glow)}>
        {/* Corner Decorations */}
        <div className="corner-decoration corner-tl !border-white" />
        <div className="corner-decoration corner-tr !border-white" />
        <div className="corner-decoration corner-bl !border-white" />
        <div className="corner-decoration corner-br !border-white" />
        
        <div className="scan-line !bg-white/10" />

        <div className="status-header !bg-white/10">
          <h2 className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">STATUS</h2>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-6 mb-4">
            <div className="text-center">
              <div className={cn("text-5xl font-bold", rankColor.text)}>{totalLevel}</div>
              <div className="text-xs text-white/50 tracking-widest uppercase">Level</div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-white/40">JOB:</span>
                <span className="font-semibold text-white drop-shadow-[0_0_5px_white]">{totalLevel >= 100 ? gameState.playerJob : 'UNKNOWN'}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-white/40">NAME:</span>
                <span className="font-semibold text-white drop-shadow-[0_0_5px_white]">{gameState.playerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">TITLE:</span>
                <span className="text-sm text-white drop-shadow-[0_0_5px_white]">{gameState.playerTitle}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition-all"
            >
              <Edit className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 text-white">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold">HP</span>
                </div>
                <span className="text-xs font-bold drop-shadow-[0_0_3px_white]">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="stats-bar h-3 bg-white/10 border border-white/20">
                <div className="stats-bar-fill bg-white shadow-[0_0_10px_white]" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold">ENERGY</span>
                </div>
                <span className="text-xs font-bold drop-shadow-[0_0_3px_white]">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="stats-bar h-3 bg-white/10 border border-white/20">
                <div className="stats-bar-fill bg-white shadow-[0_0_10px_white]" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent mb-4" />

          <div className="flex items-center justify-around mb-4 py-3 rounded-lg bg-white/5 border border-white/20">
            <div className="text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-white drop-shadow-[0_0_5px_white]" />
              <div className="text-lg font-bold text-white">{gameState.streakDays}</div>
              <div className="text-[10px] text-white/40">أيام متتالية</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center text-white">
              <div className="text-lg font-bold drop-shadow-[0_0_5px_white]">{todayQuests}/{totalQuests}</div>
              <div className="text-[10px] text-white/40">مهمات اليوم</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-lg font-bold text-white drop-shadow-[0_0_5px_white]">{gameState.gold || 0}</div>
              <div className="text-[10px] text-white/40">ذهب</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <Icon className="w-5 h-5 text-white drop-shadow-[0_0_3px_white]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">{stat.label}</span>
                      <span className="stat-value text-sm text-white drop-shadow-[0_0_3px_white]">{level}</span>
                    </div>
                    <div className="stats-bar h-2 bg-white/10 border border-white/20">
                      <div className="stats-bar-fill bg-white" style={{ width: `${progress}%` }} />
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
