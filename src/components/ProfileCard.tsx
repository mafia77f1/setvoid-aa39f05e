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

const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-white' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-white' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-white' },
  { key: 'quran', label: 'QRN', icon: BookOpen, color: 'text-white' },
] as const;

export const ProfileCard = ({ gameState, getXpProgress, onUpdateProfile }: ProfileCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const totalLevel = gameState.totalLevel || (gameState.levels.strength + gameState.levels.mind + gameState.levels.spirit + gameState.levels.quran);
  const todayQuests = gameState.quests.filter(q => q.completed).length;
  const totalQuests = gameState.quests.length;
  
  // تنسيق البطاقة باللون الأزرق مع خلفية سوداء
  const cardStyle = "bg-black border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]";
  const glowText = "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]";

  const hpPercentage = (gameState.hp / gameState.maxHp) * 100;
  const energyPercentage = (gameState.energy / gameState.maxEnergy) * 100;

  return (
    <>
      <div className={cn("profile-card relative overflow-hidden", cardStyle)}>
        {/* Corner Decorations بلون أزرق */}
        <div className="corner-decoration corner-tl !border-blue-500" />
        <div className="corner-decoration corner-tr !border-blue-500" />
        <div className="corner-decoration corner-bl !border-blue-500" />
        <div className="corner-decoration corner-br !border-blue-500" />
        
        {/* تأثير خط المسح */}
        <div className="scan-line !bg-blue-500/10" />

        {/* الهيدر بخلفية زرقاء ونص أبيض متوهج */}
        <div className="status-header !bg-blue-600/20 border-b border-blue-500/50">
          <h2 className={cn("tracking-widest font-black uppercase", glowText)}>STATUS</h2>
        </div>

        <div className="p-6">
          {/* قسم المستوى والاسم */}
          <div className="flex items-start gap-6 mb-4">
            <div className="text-center">
              <div className={cn("text-5xl font-bold", glowText)}>{totalLevel}</div>
              <div className="text-[10px] text-blue-400 font-bold tracking-widest">LEVEL</div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-400 font-bold">JOB:</span>
                <span className={cn("font-semibold text-sm", glowText)}>{totalLevel >= 100 ? gameState.playerJob : 'UNKNOWN'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-400 font-bold">NAME:</span>
                <span className={cn("font-semibold text-sm uppercase", glowText)}>{gameState.playerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-400 font-bold">TITLE:</span>
                <span className={cn("text-xs font-bold", glowText)}>{gameState.playerTitle}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all"
            >
              <Edit className="w-4 h-4 text-blue-400" />
            </button>
          </div>

          {/* أشرطة الطاقة والحياة */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-blue-400 font-bold">HP</span>
                <span className={cn("text-[10px] font-bold", glowText)}>{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="h-2 bg-blue-900/20 border border-blue-500/30 rounded-full overflow-hidden">
                <div className="h-full bg-white shadow-[0_0_10px_white]" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-blue-400 font-bold">ENERGY</span>
                <span className={cn("text-[10px] font-bold", glowText)}>{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="h-2 bg-blue-900/20 border border-blue-500/30 rounded-full overflow-hidden">
                <div className="h-full bg-white shadow-[0_0_10px_white]" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mb-4" />

          {/* الإحصائيات السريعة */}
          <div className="flex items-center justify-around mb-4 py-3 rounded-lg bg-blue-950/20 border border-blue-500/20">
            <div className="text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-white drop-shadow-[0_0_5px_white]" />
              <div className={cn("text-lg font-bold", glowText)}>{gameState.streakDays}</div>
              <div className="text-[8px] text-blue-400 uppercase font-bold">Streak</div>
            </div>
            <div className="w-px h-8 bg-blue-500/20" />
            <div className="text-center">
              <div className={cn("text-lg font-bold", glowText)}>{todayQuests}/{totalQuests}</div>
              <div className="text-[8px] text-blue-400 uppercase font-bold">Quests</div>
            </div>
            <div className="w-px h-8 bg-blue-500/20" />
            <div className="text-center">
              <div className={cn("text-lg font-bold", glowText)}>{gameState.gold || 0}</div>
              <div className="text-[8px] text-blue-400 uppercase font-bold">Gold</div>
            </div>
          </div>

          {/* شبكة الصفات (Stats) */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="p-3 rounded-lg bg-black border border-blue-500/20 hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span className={cn("text-sm font-bold", glowText)}>{level}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] text-blue-400 font-bold tracking-tighter uppercase">{stat.label}</span>
                  </div>
                  <div className="h-1 bg-blue-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white shadow-[0_0_5px_white]" style={{ width: `${progress}%` }} />
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
