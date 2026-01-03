import { useState } from 'react';
import { Dumbbell, Brain, Heart, Flame, Edit, Shield, Zap } from 'lucide-react';
import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';
import { EditProfileModal } from './EditProfileModal';

interface ProfileCardProps {
  gameState: GameState;
  getXpProgress: (xp: number) => number;
  onUpdateProfile?: (name: string, title: string) => void;
}

const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-strength' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-mind' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-spirit' },
  { key: 'agility', label: 'AGI', icon: Zap, color: 'text-agility' },
] as const;

const getRankColor = (totalLevel: number) => {
  if (totalLevel >= 50) return { border: 'border-foreground', bg: 'bg-foreground/10', glow: 'shadow-foreground/50', text: 'text-foreground', rankName: 'S' };
  if (totalLevel >= 20) return { border: 'border-spirit', bg: 'bg-spirit/10', glow: 'shadow-spirit/50', text: 'text-spirit', rankName: 'A' };
  if (totalLevel >= 10) return { border: 'border-mind', bg: 'bg-mind/10', glow: 'shadow-mind/50', text: 'text-mind', rankName: 'B' };
  return { border: 'border-primary', bg: 'bg-primary/10', glow: 'shadow-primary/50', text: 'text-primary', rankName: 'C' };
};

export const ProfileCard = ({ gameState, getXpProgress, onUpdateProfile }: ProfileCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const totalLevel = gameState.totalLevel || (gameState.levels.strength + gameState.levels.mind + gameState.levels.spirit + gameState.levels.agility);
  const todayQuests = gameState.quests.filter(q => q.completed).length;
  const totalQuests = gameState.quests.length;
  const rankColor = getRankColor(totalLevel);
  const hpPercentage = (gameState.hp / gameState.maxHp) * 100;
  const energyPercentage = (gameState.energy / gameState.maxEnergy) * 100;

  return (
    <>
      <div className={cn("profile-card", rankColor.border, totalLevel >= 50 && "shadow-2xl")}>
        <div className="corner-decoration corner-tl" />
        <div className="corner-decoration corner-tr" />
        <div className="corner-decoration corner-bl" />
        <div className="corner-decoration corner-br" />
        
        <div className="scan-line" />

        <div className="status-header">
          <h2>STATUS</h2>
        </div>

        <div className="p-6">
          {/* تم تعديل هذا القسم لنقل اللفل لليسار وترتيب العناصر عمودياً */}
          <div className="flex items-center gap-6 mb-4">
            {/* اللفل على اليسار */}
            <div className="text-center">
              <div className={cn("text-5xl font-bold glow-text", rankColor.text)}>{totalLevel}</div>
              <div className="text-xs text-muted-foreground tracking-widest">LEVEL</div>
            </div>

            {/* الاسم، الرتبة، واللقب مرتبة تحت بعضها */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary/70">NAME:</span>
                <span className="font-semibold">{gameState.playerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary/70">RANK:</span>
                <span className={cn("font-bold", rankColor.text)}>{rankColor.rankName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary/70">TITLE:</span>
                <span className="text-sm text-primary">{gameState.playerTitle}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all"
            >
              <Edit className="w-4 h-4 text-primary" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-destructive" />
                  <span className="text-xs">HP</span>
                </div>
                <span className="text-xs font-bold">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="stats-bar h-3">
                <div className="stats-bar-fill bg-destructive" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-secondary" />
                  <span className="text-xs">ENERGY</span>
                </div>
                <span className="text-xs font-bold">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="stats-bar h-3">
                <div className="stats-bar-fill bg-secondary" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-4" />

          <div className="flex items-center justify-around mb-4 py-3 rounded-lg bg-card/50 border border-primary/20">
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
              <div className="text-lg font-bold text-secondary">{gameState.gold || 0}</div>
              <div className="text-[10px] text-muted-foreground">ذهب</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-primary/10">
                  <Icon className={cn('w-5 h-5', stat.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-sm font-bold', stat.color)}>{stat.label}</span>
                      <span className="stat-value text-sm">{level}</span>
                    </div>
                    <div className="stats-bar h-2">
                      <div className={cn('stats-bar-fill', stat.color.replace('text-', 'bg-'))} style={{ width: `${progress}%` }} />
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
