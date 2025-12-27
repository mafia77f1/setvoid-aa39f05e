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

// تم توحيد لون أشرطة التقدم (Progress Bars) إلى البنفسجي
const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-purple-500' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-purple-400' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-purple-300' },
  { key: 'quran', label: 'QRN', icon: BookOpen, color: 'text-purple-200' },
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
      <div className="relative bg-black/60 border-2 border-slate-200/90 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
        
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white z-20" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white z-20" />
        
        {/* Scan Line Effect */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none" />

        {/* Status Header - أبيض متوهج وبدون خط فاصل تحته */}
        <div className="flex justify-center mt-[-0.75rem] relative z-10">
          <div className="border border-slate-400/50 px-6 py-0.5 bg-slate-900/90 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <h2 className="text-sm font-bold tracking-[0.2em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,1)] uppercase">
              STATUS
            </h2>
          </div>
        </div>

        <div className="p-6 pt-8">
          {/* Level and Name Section */}
          <div className="flex items-start gap-6 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                {totalLevel}
              </div>
              <div className="text-[10px] text-purple-400 font-black tracking-widest uppercase">Level</div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Job:</span>
                <span className="text-xs font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase">
                  {totalLevel >= 100 ? gameState.playerJob : 'UNKNOWN'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Name:</span>
                <span className="text-xs font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{gameState.playerName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Title:</span>
                <span className="text-xs font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase italic">
                  {gameState.playerTitle}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-1.5 border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 transition-all"
            >
              <Edit className="w-3.5 h-3.5 text-purple-300" />
            </button>
          </div>

          {/* HP and Energy Bars */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">HP</span>
                <span className="text-[10px] font-mono text-white">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="h-2 bg-black/40 border border-slate-700/50">
                <div className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">MP</span>
                <span className="text-[10px] font-mono text-white">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="h-2 bg-black/40 border border-slate-700/50">
                <div className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Quick Stats Row - الذهب بنفسجي متوهج */}
          <div className="flex items-center justify-around mb-6 py-3 bg-purple-950/10 border border-purple-500/20">
            <div className="text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-purple-400" />
              <div className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] font-mono">{gameState.streakDays}</div>
              <div className="text-[8px] text-slate-400 uppercase font-bold">Streak</div>
            </div>
            <div className="w-px h-8 bg-purple-500/20" />
            <div className="text-center">
              <div className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] font-mono">{todayQuests}/{totalQuests}</div>
              <div className="text-[8px] text-slate-400 uppercase font-bold">Quests</div>
            </div>
            <div className="w-px h-8 bg-purple-500/20" />
            <div className="text-center">
              <div className="text-sm font-bold text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] font-mono">
                {gameState.gold?.toLocaleString() || 0}
              </div>
              <div className="text-[8px] text-slate-400 uppercase font-bold">Gold</div>
            </div>
          </div>

          {/* Stats Grid - الأشرطة والنصوص بتنسيق البنفسجي والأبيض المتوهج */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="p-3 bg-black/40 border border-slate-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[10px] font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] uppercase tracking-tighter">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white font-mono">{level}</span>
                  </div>
                  <div className="h-1 bg-slate-800/50 overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.7)] transition-all duration-700" 
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
