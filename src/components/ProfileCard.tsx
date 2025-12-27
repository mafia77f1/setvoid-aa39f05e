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

export const ProfileCard = ({ gameState, getXpProgress, onUpdateProfile }: ProfileCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const totalLevel = gameState.totalLevel || (gameState.levels.strength + gameState.levels.mind + gameState.levels.spirit + gameState.levels.quran);
  const todayQuests = gameState.quests.filter(q => q.completed).length;
  const totalQuests = gameState.quests.length;
  const hpPercentage = (gameState.hp / gameState.maxHp) * 100;
  const energyPercentage = (gameState.energy / gameState.maxEnergy) * 100;

  return (
    <>
      {/* الكارد الخارجي - بنفسجي خفيف وعميق */}
      <div className="relative p-[2px] bg-gradient-to-b from-purple-600/40 via-purple-900/20 to-purple-600/40 rounded-none border border-purple-500/30 shadow-[0_0_30px_rgba(88,28,135,0.3)]">
        
        {/* الكارد الداخلي - شفاف وألوان الماركت الزرقاء */}
        <div className="relative bg-[#020817]/90 backdrop-blur-xl p-6 border border-blue-500/20 overflow-hidden">
          
          {/* تأثير الخطوط التقنية الخلفية */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(59,130,246,0.1),rgba(147,51,234,0.1))] bg-[size:100%_2px,2px_100%]" />

          {/* الرأس - STATUS بدون خطوط فاصلة مشتتة */}
          <div className="flex justify-center mb-8">
            <div className="border border-blue-400/50 px-8 py-1 bg-blue-950/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <h2 className="text-sm font-black tracking-[0.4em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase">
                STATUS
              </h2>
            </div>
          </div>

          {/* Level and Info Section */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 text-center md:text-left">
            <div className="relative">
              <div className="text-6xl font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] leading-none">
                {totalLevel}
              </div>
              <div className="text-[10px] text-blue-400 font-bold tracking-widest mt-1">LEVEL</div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Job:</span>
                <span className="text-sm font-bold text-blue-100 italic">{totalLevel >= 100 ? gameState.playerJob : 'UNKNOWN'}</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Name:</span>
                <span className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">{gameState.playerName}</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Title:</span>
                <span className="text-xs font-bold text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.5)] uppercase italic">{gameState.playerTitle}</span>
              </div>
            </div>

            <button onClick={() => setShowEditModal(true)} className="absolute top-0 right-0 p-2 text-blue-400/50 hover:text-blue-400 transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </div>

          {/* HP & MP Bars - Solo Leveling Style */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <div className="flex justify-between items-end mb-1 px-1">
                <span className="text-[10px] font-black text-red-500 italic">HP</span>
                <span className="text-xs font-mono text-white">{Math.round(gameState.hp)} / {gameState.maxHp}</span>
              </div>
              <div className="h-2 bg-red-950/40 border border-red-500/20 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between items-end mb-1 px-1">
                <span className="text-[10px] font-black text-blue-500 italic">MP</span>
                <span className="text-xs font-mono text-white">{Math.round(gameState.energy)} / {gameState.maxEnergy}</span>
              </div>
              <div className="h-2 bg-blue-950/40 border border-blue-500/20 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Stats Grid - Transparent Boxes with Blue Accents */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="bg-blue-500/5 border border-blue-500/20 p-3 relative group">
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4 opacity-70', stat.color)} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</span>
                        <span className="text-sm font-black text-white">{level}</span>
                      </div>
                      <div className="h-1 bg-slate-800/50">
                        <div 
                          className={cn('h-full transition-all duration-700 shadow-[0_0_8px]', stat.color.replace('text-', 'bg-'))} 
                          style={{ width: `${progress}%`, boxShadow: '0 0 8px currentColor' }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Stats - Gold and Quests */}
          <div className="mt-8 pt-4 border-t border-blue-500/20 flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-300">{gameState.streakDays} DAYS</span>
            </div>
            <div className="bg-yellow-500/10 px-3 py-1 border border-yellow-500/20">
              <span className="text-xs font-mono font-bold text-yellow-400">GOLD: {gameState.gold?.toLocaleString()}</span>
            </div>
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
