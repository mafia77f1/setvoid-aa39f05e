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

// تعديل ألوان أيقونات الخصائص لتتناسب مع السمة البنفسجية والبيضاء
const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-purple-400' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-purple-400' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-purple-400' },
  { key: 'quran', label: 'QRN', icon: BookOpen, color: 'text-purple-400' },
] as const;

// تعديل الرتب لتعتمد تدرجات البنفسجي والأبيض
const getRankColor = (totalLevel: number) => {
  return { 
    border: 'border-purple-600', 
    bg: 'bg-black', 
    glow: 'shadow-purple-900/50', 
    text: 'text-white' 
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
      {/* الخلفية سوداء بالكامل مع حدود بنفسجية */}
      <div className={cn("profile-card bg-black text-white border-2", rankColor.border, "shadow-[0_0_20px_rgba(147,51,234,0.3)]")}>
        
        {/* Corner Decorations - تم تغييرها للبنفسجي */}
        <div className="corner-decoration corner-tl border-purple-500" />
        <div className="corner-decoration corner-tr border-purple-500" />
        <div className="corner-decoration corner-bl border-purple-500" />
        <div className="corner-decoration corner-br border-purple-500" />
        
        <div className="scan-line" />

        {/* Status Header - خلفية بنفسجية ونص أبيض */}
        <div className="status-header bg-purple-900/80 border-b border-purple-500">
          <h2 className="text-white tracking-[0.2em] font-bold">STATUS</h2>
        </div>

        <div className="p-6">
          {/* Level and Name Section */}
          <div className="flex items-start gap-6 mb-4">
            <div className="text-center">
              <div className={cn("text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]")}>{totalLevel}</div>
              <div className="text-xs text-purple-300 tracking-widest">LEVEL</div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-purple-400">JOB:</span>
                <span className="font-semibold text-white">{totalLevel >= 100 ? gameState.playerJob : 'غير معروف'}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-purple-400">NAME:</span>
                <span className="font-semibold text-white">{gameState.playerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-400">TITLE:</span>
                <span className="text-sm text-purple-300">{gameState.playerTitle}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-lg bg-purple-900/30 border border-purple-500/50 hover:bg-purple-800/40 transition-all"
            >
              <Edit className="w-4 h-4 text-purple-400" />
            </button>
          </div>

          {/* HP and Energy Bars - الحفاظ على ألوانها التقليدية مع لمسة Solo Leveling */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-white">HP</span>
                </div>
                <span className="text-xs font-bold text-white">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="stats-bar h-3 bg-gray-900 border border-purple-900/50">
                <div className="stats-bar-fill bg-red-600" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-white">ENERGY</span>
                </div>
                <span className="text-xs font-bold text-white">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="stats-bar h-3 bg-gray-900 border border-purple-900/50">
                <div className="stats-bar-fill bg-blue-500" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-4" />

          {/* Quick Stats Row - خلفية بنفسجية داكنة جداً */}
          <div className="flex items-center justify-around mb-4 py-3 rounded-lg bg-purple-950/20 border border-purple-500/30">
            <div className="text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-purple-400" />
              <div className="text-lg font-bold text-white">{gameState.streakDays}</div>
              <div className="text-[10px] text-purple-300">أيام متتالية</div>
            </div>
            <div className="w-px h-10 bg-purple-500/30" />
            <div className="text-center">
              <div className="text-lg font-bold text-white">{todayQuests}/{totalQuests}</div>
              <div className="text-[10px] text-purple-300">مهمات اليوم</div>
            </div>
            <div className="w-px h-10 bg-purple-500/30" />
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{gameState.gold || 0}</div>
              <div className="text-[10px] text-purple-300">ذهب</div>
            </div>
          </div>

          {/* Stats Grid - كروت فرعية بحدود بنفسجية ونصوص بيضاء */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="flex items-center gap-3 p-3 rounded-lg bg-purple-900/10 border border-purple-500/20">
                  <Icon className={cn('w-5 h-5', stat.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-sm font-bold', stat.color)}>{stat.label}</span>
                      <span className="stat-value text-sm text-white">{level}</span>
                    </div>
                    <div className="stats-bar h-2 bg-gray-900">
                      <div className={cn('stats-bar-fill bg-purple-600')} style={{ width: `${progress}%` }} />
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
