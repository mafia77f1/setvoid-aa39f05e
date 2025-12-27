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

// تعديل الألوان هنا لتناسب نظام سولو ليفلينج (أزرق نيوني، بنفسجي غامق)
const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-[hsl(200,100%,60%)]' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-[hsl(190,100%,50%)]' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-[hsl(280,80%,60%)]' },
  { key: 'quran', label: 'QRN', icon: BookOpen, color: 'text-[hsl(170,100%,45%)]' },
] as const;

const getRankColor = (totalLevel: number) => {
  // ألوان الرتب (S, A, B...) بناءً على اللون الأزرق المتوهج الشهير
  if (totalLevel >= 50) return { border: 'border-[hsl(190,100%,50%)]', bg: 'bg-[hsl(190,100%,50%)]/10', glow: 'shadow-[hsl(190,100%,50%)]/50', text: 'text-[hsl(190,100%,50%)]' };
  if (totalLevel >= 20) return { border: 'border-[hsl(210,100%,40%)]', bg: 'bg-[hsl(210,100%,40%)]/10', glow: 'shadow-[hsl(210,100%,40%)]/50', text: 'text-[hsl(210,100%,40%)]' };
  return { border: 'border-[hsl(200,100%,30%)]', bg: 'bg-[hsl(200,100%,20%)]/10', glow: 'shadow-[hsl(200,100%,30%)]/50', text: 'text-[hsl(200,100%,60%)]' };
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
      {/* تم تغيير خلفية البطاقة لتصبح داكنة جداً مع توهج أزرق */}
      <div className={cn(
        "profile-card border-2 bg-[hsl(225,50%,4%)] shadow-[0_0_30px_rgba(0,162,255,0.1)]", 
        rankColor.border, 
        "relative overflow-hidden"
      )}>
        {/* Corner Decorations - جعلناها زرقاء متوهجة */}
        <div className="corner-decoration corner-tl border-[hsl(190,100%,50%)]" />
        <div className="corner-decoration corner-tr border-[hsl(190,100%,50%)]" />
        <div className="corner-decoration corner-bl border-[hsl(190,100%,50%)]" />
        <div className="corner-decoration corner-br border-[hsl(190,100%,50%)]" />
        
        <div className="scan-line opacity-20" />

        {/* Status Header - أزرق كهربائي */}
        <div className="status-header bg-gradient-to-r from-transparent via-[hsl(190,100%,40%)] to-transparent">
          <h2 className="text-[hsl(190,100%,70%)] tracking-[0.3em] font-black italic">STATUS</h2>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-6 mb-4">
            <div className="text-center">
              {/* الليفل أصبح متوهجاً بشكل أقوى */}
              <div className={cn("text-6xl font-black italic drop-shadow-[0_0_10px_rgba(0,195,255,0.8)]", rankColor.text)}>
                {totalLevel}
              </div>
              <div className="text-[10px] text-[hsl(190,100%,50%)] tracking-[0.2em] font-bold">LEVEL</div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[hsl(190,100%,50%)] font-bold">JOB:</span>
                <span className="font-bold text-white tracking-wide">{totalLevel >= 100 ? gameState.playerJob : 'NONE'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[hsl(190,100%,50%)] font-bold">NAME:</span>
                <span className="font-bold text-white tracking-wide uppercase">{gameState.playerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[hsl(190,100%,50%)] font-bold">TITLE:</span>
                <span className="text-xs font-bold text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
                  {gameState.playerTitle}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-md bg-[hsl(190,100%,50%)]/10 border border-[hsl(190,100%,50%)]/30 hover:bg-[hsl(190,100%,50%)]/20 transition-all"
            >
              <Edit className="w-4 h-4 text-[hsl(190,100%,60%)]" />
            </button>
          </div>

          {/* HP and Energy - الألوان الرسمية للنظام (أحمر للدم، أزرق للطاقة) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-red-500">HP</span>
                <span className="text-white">{Math.round(gameState.hp)} / {gameState.maxHp}</span>
              </div>
              <div className="h-2 bg-red-950/50 rounded-full border border-red-500/20 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_red]" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-blue-400">MP</span>
                <span className="text-white">{Math.round(gameState.energy)} / {gameState.maxEnergy}</span>
              </div>
              <div className="h-2 bg-blue-950/50 rounded-full border border-blue-500/20 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_#0080ff]" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gradient-to-r from-transparent via-[hsl(190,100%,50%)]/50 to-transparent mb-6" />

          {/* Quick Stats Row - خلفية داكنة وحواف متوهجة */}
          <div className="flex items-center justify-around mb-6 py-4 rounded-xl bg-black/40 border border-[hsl(190,100%,50%)]/20 shadow-inner">
            <div className="text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500 drop-shadow-[0_0_8px_orange]" />
              <div className="text-xl font-black text-white">{gameState.streakDays}</div>
              <div className="text-[8px] text-gray-500 uppercase font-bold">Streak</div>
            </div>
            <div className="w-[1px] h-8 bg-[hsl(190,100%,50%)]/20" />
            <div className="text-center">
              <div className="text-xl font-black text-white">{todayQuests}</div>
              <div className="text-[8px] text-gray-500 uppercase font-bold">Today</div>
            </div>
            <div className="w-[1px] h-8 bg-[hsl(190,100%,50%)]/20" />
            <div className="text-center">
              <div className="text-xl font-black text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">{gameState.gold || 0}</div>
              <div className="text-[8px] text-gray-500 uppercase font-bold">Gold</div>
            </div>
          </div>

          {/* Stats Grid - أيقونات نيون */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="group p-3 rounded-lg bg-[hsl(225,50%,6%)] border border-[hsl(190,100%,50%)]/10 hover:border-[hsl(190,100%,50%)]/40 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={cn('w-4 h-4 drop-shadow-[0_0_5px_currentColor]', stat.color)} />
                    <div className="flex-1 flex justify-between items-end">
                      <span className={cn('text-[10px] font-black tracking-tighter', stat.color)}>{stat.label}</span>
                      <span className="text-sm font-black text-white">{level}</span>
                    </div>
                  </div>
                  <div className="h-1 bg-black rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={cn('h-full transition-all duration-1000', stat.color.replace('text-', 'bg-'), 'shadow-[0_0_8px_currentColor]')} 
                      style={{ width: `${progress}%` }} 
                    />
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
