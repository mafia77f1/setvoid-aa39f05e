import { useState } from 'react';
import { Dumbbell, Brain, Heart, BookOpen, Flame, Edit } from 'lucide-react';
import { GameState } from '@/types/game';
import { cn } from '@/lib/utils';
import { EditProfileModal } from './EditProfileModal';

interface ProfileCardProps {
  gameState: GameState;
  getXpProgress: (xp: number) => number;
  onUpdateProfile?: (name: string, title: string) => void;
}

const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-slate-200' },
  { key: 'mind', label: 'INT', icon: Brain, color: 'text-slate-300' },
  { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-slate-400' },
  { key: 'quran', label: 'QRN', icon: BookOpen, color: 'text-white' },
] as const;

export const ProfileCard = ({ gameState, getXpProgress, onUpdateProfile }: ProfileCardProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const totalLevel = gameState.totalLevel || (gameState.levels.strength + gameState.levels.mind + gameState.levels.spirit + gameState.levels.quran);
  const todayQuests = gameState.quests.filter(q => q.completed).length;
  const totalQuests = gameState.quests.length;
  const hpPercentage = (gameState.hp / gameState.maxHp) * 100;
  const energyPercentage = (gameState.energy / gameState.maxEnergy) * 100;

  // ستايل الحدود المتكسرة المشترك
  const brokenBorderStyle = {
    clipPath: "polygon(0% 15%, 5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 50%)",
  };

  return (
    <>
      {/* الخلفية تحولت للبنفسجي الغامق وإزالة تأثير الخطوط */}
      <div className="relative bg-[#1a0b2e] border-2 border-slate-300 shadow-[0_0_25px_rgba(139,92,246,0.3)]">
        
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white z-20" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white z-20" />

        {/* Status Header - حدود متكسرة بيضاء */}
        <div className="flex justify-center mt-[-0.75rem] relative z-10">
          <div 
            className="px-8 py-1 bg-[#2d1b4d] border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            style={{ clipPath: "polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0% 50%)" }}
          >
            <h2 className="text-sm font-bold tracking-[0.2em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,1)] uppercase">
              STATUS
            </h2>
          </div>
        </div>

        <div className="p-6 pt-8">
          {/* Level and Name Section */}
          <div className="flex items-start gap-6 mb-6">
            <div className="text-center">
              <div className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                {totalLevel}
              </div>
              <div className="text-[10px] text-purple-400 font-black tracking-widest uppercase">Level</div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between border-b border-white/20 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Job:</span>
                <span className="text-xs font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase italic">
                  {totalLevel >= 100 ? gameState.playerJob : 'UNKNOWN'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/20 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Name:</span>
                <span className="text-xs font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase">
                  {gameState.playerName}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/20 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Title:</span>
                <span className="text-xs font-bold text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.6)] uppercase italic">
                  {gameState.playerTitle}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-1.5 border border-white bg-white/5 hover:bg-white/10 transition-all"
            >
              <Edit className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* HP and Energy Bars - داخل مربعات بحدود بيضاء متكسرة */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-2 border-2 border-white bg-black/20" style={brokenBorderStyle}>
              <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] font-black text-white italic">HP</span>
                <span className="text-[10px] font-mono text-white/80">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="h-1.5 bg-slate-900 overflow-hidden">
                <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>

            <div className="p-2 border-2 border-white bg-black/20" style={brokenBorderStyle}>
              <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] font-black text-white italic">MP</span>
                <span className="text-[10px] font-mono text-white/80">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="h-1.5 bg-slate-900 overflow-hidden">
                <div className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)] transition-all" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="flex items-center justify-around mb-6 py-3 bg-[#2d1b4d]/50 border border-white/30">
            <div className="text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-slate-300" />
              <div className="text-sm font-bold text-white font-mono">{gameState.streakDays}</div>
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">Streak</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-sm font-bold text-white font-mono">{todayQuests}/{totalQuests}</div>
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">Quests</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-sm font-bold text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] font-mono">
                {gameState.gold?.toLocaleString() || 0}
              </div>
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">Gold</div>
            </div>
          </div>

          {/* Stats Grid - بحدود بيضاء متكسرة */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div 
                  key={stat.key} 
                  className="p-3 bg-[#2d1b4d]/40 border-2 border-white transition-all"
                  style={brokenBorderStyle}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-white/70" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white font-mono">{level}</span>
                  </div>
                  <div className="h-1 bg-black/40 overflow-hidden">
                    <div 
                      className="h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] transition-all duration-1000" 
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
