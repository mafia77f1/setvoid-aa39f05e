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

// تم جعل الأيقونات بلمسة فضية/زرقاء باردة
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

  return (
    <>
      {/* الخلفية زرقاء داكنة (System Blue) مع حدود فضية بارزة */}
      <div className="relative bg-[#0a1224] border-2 border-slate-300 shadow-[0_0_25px_rgba(30,58,138,0.5)]">
        
        {/* Corner Decorations - فضي */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white z-20" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white z-20" />
        
        {/* Scan Line Effect - أزرق تقني */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(29,78,216,0.1)_50%,transparent_50%)] bg-[size:100%_4px] pointer-events-none" />

        {/* Status Header - أبيض متوهج خلفية فضية داكنة */}
        <div className="flex justify-center mt-[-0.75rem] relative z-10">
          <div className="border border-slate-300 px-6 py-0.5 bg-[#1e293b] shadow-[0_0_15px_rgba(255,255,255,0.4)]">
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
              <div className="text-[10px] text-blue-400 font-black tracking-widest uppercase">Level</div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between border-b border-slate-500/30 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Job:</span>
                <span className="text-xs font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase italic">
                  {totalLevel >= 100 ? gameState.playerJob : 'UNKNOWN'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-500/30 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Name:</span>
                <span className="text-xs font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase">
                  {gameState.playerName}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-500/30 pb-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Title:</span>
                <span className="text-xs font-bold text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.6)] uppercase italic">
                  {gameState.playerTitle}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-1.5 border border-slate-300 bg-white/5 hover:bg-white/10 transition-all shadow-[0_0_5px_rgba(255,255,255,0.2)]"
            >
              <Edit className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* HP and Energy Bars */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] tracking-tighter italic">HP</span>
                <span className="text-[10px] font-mono text-white/80">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="h-2 bg-slate-900 border border-slate-700 relative overflow-hidden">
                <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] tracking-tighter italic">MP</span>
                <span className="text-[10px] font-mono text-white/80">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="h-2 bg-slate-900 border border-slate-700 relative overflow-hidden">
                <div className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)] transition-all" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Quick Stats Row - الذهب بنفسجي متوهج كما طلبت سابقاً */}
          <div className="flex items-center justify-around mb-6 py-3 bg-[#1e293b]/50 border border-slate-500/30">
            <div className="text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-slate-300" />
              <div className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] font-mono">{gameState.streakDays}</div>
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">Streak</div>
            </div>
            <div className="w-px h-8 bg-slate-500/20" />
            <div className="text-center">
              <div className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] font-mono">{todayQuests}/{totalQuests}</div>
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">Quests</div>
            </div>
            <div className="w-px h-8 bg-slate-500/20" />
            <div className="text-center">
              <div className="text-sm font-bold text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] font-mono">
                {gameState.gold?.toLocaleString() || 0}
              </div>
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">Gold</div>
            </div>
          </div>

          {/* Stats Grid - أشرطة التقدم باللون الأبيض المتوهج */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="p-3 bg-[#1e293b]/40 border border-slate-300/20 hover:border-white/40 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-white/70" />
                      <span className="text-[10px] font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] uppercase tracking-widest">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white font-mono">{level}</span>
                  </div>
                  {/* شريط التقدم باللون الأبيض */}
                  <div className="h-1.5 bg-black/40 border border-slate-700/50 overflow-hidden">
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
