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

// تم تعديل الألوان لتناسب نظام سولو (توهج أزرق/أبيض)
const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-blue-400' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-blue-300' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-blue-200' },
  { key: 'quran', label: 'Agi', icon: BookOpen, color: 'text-blue-100' },
] as const;

const getRankColor = (totalLevel: number) => {
  // استخدام درجات الأزرق والأبيض المتوهج كما في المتجر
  if (totalLevel >= 50) return { border: 'border-white', bg: 'bg-white/10', glow: 'shadow-white/50', text: 'text-white' };
  if (totalLevel >= 20) return { border: 'border-blue-400', bg: 'bg-blue-400/10', glow: 'shadow-blue-400/50', text: 'text-blue-400' };
  if (totalLevel >= 10) return { border: 'border-blue-600', bg: 'bg-blue-600/10', glow: 'shadow-blue-600/50', text: 'text-blue-600' };
  return { border: 'border-blue-900', bg: 'bg-blue-900/10', glow: 'shadow-blue-900/50', text: 'text-blue-900' };
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
      {/* تم تغيير الخلفية لتصبح داكنة مع حدود فاتحة كما في المتجر */}
      <div className={cn("profile-card bg-black/80 border-2", rankColor.border, "shadow-[0_0_20px_rgba(30,58,138,0.3)]")}>
        <div className="corner-decoration corner-tl border-blue-400" />
        <div className="corner-decoration corner-tr border-blue-400" />
        <div className="corner-decoration corner-bl border-blue-400" />
        <div className="corner-decoration corner-br border-blue-400" />
        
        <div className="scan-line opacity-20" />

        {/* ترويسة الحالة - أزرق متوهج */}
        <div className="status-header bg-slate-900/90 border-b border-blue-500/30">
          <h2 className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] italic tracking-widest">STATUS</h2>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-6 mb-4">
            <div className="text-center">
              <div className={cn("text-5xl font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]", rankColor.text)}>{totalLevel}</div>
              <div className="text-xs text-blue-300/60 tracking-widest font-bold">LEVEL</div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-blue-400/70 font-bold uppercase">Job:</span>
                <span className="font-semibold text-blue-50 uppercase tracking-tighter">{totalLevel >= 100 ? gameState.playerJob : 'UNKNOWN'}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-blue-400/70 font-bold uppercase">Name:</span>
                <span className="font-semibold text-blue-50">{gameState.playerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-400/70 font-bold uppercase">Title:</span>
                <span className="text-sm text-blue-300 italic drop-shadow-[0_0_5px_rgba(147,197,253,0.5)]">{gameState.playerTitle}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/40 hover:bg-blue-500/20 transition-all"
            >
              <Edit className="w-4 h-4 text-blue-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-bold text-slate-400">HP</span>
                </div>
                <span className="text-xs font-bold text-blue-50">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="stats-bar h-2 bg-blue-950/50 border border-blue-900/50">
                <div className="stats-bar-fill bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-[10px] font-bold text-slate-400">ENERGY</span>
                </div>
                <span className="text-xs font-bold text-blue-50">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="stats-bar h-2 bg-blue-950/50 border border-blue-900/50">
                <div className="stats-bar-fill bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-4" />

          <div className="flex items-center justify-around mb-4 py-3 rounded-lg bg-slate-900/60 border border-blue-500/20 shadow-inner">
            <div className="text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
              <div className="text-lg font-bold text-white">{gameState.streakDays}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Streak</div>
            </div>
            <div className="w-px h-10 bg-blue-500/20" />
            <div className="text-center">
              <div className="text-lg font-bold text-white">{todayQuests}/{totalQuests}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Quests</div>
            </div>
            <div className="w-px h-10 bg-blue-500/20" />
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">{gameState.gold || 0}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Gold</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-blue-500/20 hover:border-blue-400/40 transition-colors">
                  <Icon className={cn('w-5 h-5', stat.color, 'drop-shadow-[0_0_5px_currentColor]')} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-[10px] font-black tracking-widest', stat.color)}>{stat.label}</span>
                      <span className="stat-value text-sm font-mono text-white">{level}</span>
                    </div>
                    <div className="stats-bar h-1.5 bg-blue-950/30">
                      <div 
                        className={cn('stats-bar-fill shadow-[0_0_5px_currentColor]', stat.color.replace('text-', 'bg-'))} 
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
