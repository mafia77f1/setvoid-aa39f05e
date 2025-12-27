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

// ألوان الخصائص مستوحاة من درجات الأزرق والبرق في نظام سولو
const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-blue-400' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-blue-300' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-blue-200' },
  { key: 'quran', label: 'QRN', icon: BookOpen, color: 'text-white' },
] as const;

const getRankColor = (totalLevel: number) => {
  // تدرجات تعتمد على توهج الأبيض والأزرق كما في الماركت
  if (totalLevel >= 50) return { border: 'border-slate-200', bg: 'bg-slate-200/10', glow: 'shadow-white/50', text: 'text-white' };
  return { border: 'border-slate-400/50', bg: 'bg-slate-900/90', glow: 'shadow-blue-500/30', text: 'text-blue-100' };
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
      {/* البطاقة الرئيسية بنفس ستايل الماركت: خلفية سوداء وحدود فاتحة */}
      <div className={cn("relative bg-black/60 border-2 border-slate-200/90 shadow-[0_0_20px_rgba(30,58,138,0.3)]", totalLevel >= 50 && "shadow-white/20")}>
        
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white z-20" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white z-20" />
        
        {/* Scan Line Effect من الماركت */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none" />

        {/* Status Header - تم تغيير اللون للأبيض المتوهج وحذف الخط الفاصل الأسفل منه */}
        <div className="flex justify-center mt-[-0.75rem] relative z-10">
          <div className="border border-slate-400/50 px-6 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            <h2 className="text-sm font-bold tracking-[0.2em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase">
              STATUS
            </h2>
          </div>
        </div>

        <div className="p-6 pt-8">
          {/* Level and Name Section */}
          <div className="flex items-start gap-6 mb-6">
            <div className="text-center">
              <div className={cn("text-5xl font-bold italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] text-white")}>
                {totalLevel}
              </div>
              <div className="text-[10px] text-blue-400 font-black tracking-widest opacity-80">LEVEL</div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Job:</span>
                <span className="text-xs font-bold text-white italic drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] uppercase">
                  {totalLevel >= 100 ? gameState.playerJob : 'UNKNOWN'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Name:</span>
                <span className="text-xs font-bold text-blue-100">{gameState.playerName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Title:</span>
                <span className="text-xs font-bold text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.4)] uppercase italic">
                  {gameState.playerTitle}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-1.5 border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 transition-all shadow-[0_0_5px_rgba(96,165,250,0.3)]"
            >
              <Edit className="w-3.5 h-3.5 text-blue-300" />
            </button>
          </div>

          {/* HP and Energy Bars - ستايل تقني */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-blue-400 tracking-tighter">HP</span>
                <span className="text-[10px] font-mono text-white">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="h-2 bg-black/40 border border-slate-700/50 relative overflow-hidden">
                <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-yellow-400 tracking-tighter">MP</span>
                <span className="text-[10px] font-mono text-white">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="h-2 bg-black/40 border border-slate-700/50 relative overflow-hidden">
                <div className="h-full bg-blue-300 shadow-[0_0_10px_rgba(147,197,253,0.5)] transition-all duration-500" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Quick Stats Row - تم حذف الخط العلوي الفاصل واستبداله بخلفية داكنة */}
          <div className="flex items-center justify-around mb-6 py-3 bg-blue-950/20 border border-blue-500/20 shadow-inner">
            <div className="text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-blue-400" />
              <div className="text-sm font-bold text-white font-mono">{gameState.streakDays}</div>
              <div className="text-[8px] text-slate-400 uppercase font-bold">Streak</div>
            </div>
            <div className="w-px h-8 bg-blue-500/20" />
            <div className="text-center">
              <div className="text-sm font-bold text-white font-mono">{todayQuests}/{totalQuests}</div>
              <div className="text-[8px] text-slate-400 uppercase font-bold">Quests</div>
            </div>
            <div className="w-px h-8 bg-blue-500/20" />
            <div className="text-center">
              <div className="text-sm font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] font-mono">{gameState.gold || 0}</div>
              <div className="text-[8px] text-slate-400 uppercase font-bold">Gold</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="relative group">
                  <div className="p-3 bg-black/40 border border-slate-500/30 group-hover:border-blue-500/50 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={cn('w-3.5 h-3.5', stat.color, 'drop-shadow-[0_0_5px_currentColor]')} />
                        <span className={cn('text-[10px] font-black tracking-widest uppercase', stat.color)}>{stat.label}</span>
                      </div>
                      <span className="text-xs font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] font-mono">{level}</span>
                    </div>
                    <div className="h-1 bg-slate-800/50 relative overflow-hidden">
                      <div 
                        className={cn('h-full shadow-[0_0_8px_currentColor] transition-all duration-700', stat.color.replace('text-', 'bg-'))} 
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
