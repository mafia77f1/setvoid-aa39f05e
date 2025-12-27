import { useState } from 'react';
import { Dumbbell, Brain, Heart, BookOpen, Flame, Edit } from 'lucide-react';
import { GameState } from '@/types/game';
import { EditProfileModal } from './EditProfileModal';

interface ProfileCardProps {
  gameState: GameState;
  getXpProgress: (xp: number) => number;
  onUpdateProfile?: (name: string, title: string) => void;
}

const stats = [
  { key: 'strength', label: 'STR', icon: Dumbbell },
  { key: 'mind', label: 'INT', icon: Brain },
  { key: 'spirit', label: 'SPR', icon: Heart },
  { key: 'quran', label: 'QRN', icon: BookOpen },
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
      {/* الكارد: خلفية بنفسجية + حدود زرقاء */}
      <div className="relative bg-[#2e1065] border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
        
        {/* Status Header - نص أبيض وخلفية زرقاء داكنة للعنوان */}
        <div className="flex justify-center mt-[-0.75rem] relative z-10">
          <div className="border border-blue-400 px-6 py-0.5 bg-[#1e3a8a] shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase">
              STATUS
            </h2>
          </div>
        </div>

        <div className="p-6 pt-8">
          {/* Level and Name Section */}
          <div className="flex items-start gap-6 mb-6">
            <div className="text-center">
              <div className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                {totalLevel}
              </div>
              <div className="text-[10px] text-blue-300 font-black tracking-widest uppercase">Level</div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between border-b border-blue-500/30 pb-1">
                <span className="text-[9px] text-blue-200 font-bold uppercase">Job:</span>
                <span className="text-xs font-bold text-white uppercase italic">
                  {totalLevel >= 100 ? gameState.playerJob : 'UNKNOWN'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-blue-500/30 pb-1">
                <span className="text-[9px] text-blue-200 font-bold uppercase">Name:</span>
                <span className="text-xs font-bold text-white uppercase">
                  {gameState.playerName}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-blue-500/30 pb-1">
                <span className="text-[9px] text-blue-200 font-bold uppercase">Title:</span>
                <span className="text-xs font-bold text-white uppercase italic">
                  {gameState.playerTitle}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-1.5 border border-blue-400 bg-blue-900/30 hover:bg-blue-800/50 transition-all"
            >
              <Edit className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* HP and MP Bars - أصبحت بيضاء كما طلبت */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-white italic">HP</span>
                <span className="text-[10px] font-mono text-white">{Math.round(gameState.hp)}/{gameState.maxHp}</span>
              </div>
              <div className="h-2 bg-black/40 border border-blue-900/50 overflow-hidden">
                <div className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)] transition-all" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-white italic">MP</span>
                <span className="text-[10px] font-mono text-white">{Math.round(gameState.energy)}/{gameState.maxEnergy}</span>
              </div>
              <div className="h-2 bg-black/40 border border-blue-900/50 overflow-hidden">
                <div className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)] transition-all" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* Quick Stats Row - خلفية داكنة داخل البنفسجي */}
          <div className="flex items-center justify-around mb-6 py-3 bg-black/20 border border-blue-500/20">
            <div className="text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-white" />
              <div className="text-sm font-bold text-white font-mono">{gameState.streakDays}</div>
              <div className="text-[8px] text-blue-200 uppercase font-bold tracking-tighter">Streak</div>
            </div>
            <div className="w-px h-8 bg-blue-500/20" />
            <div className="text-center">
              <div className="text-sm font-bold text-white font-mono">{todayQuests}/{totalQuests}</div>
              <div className="text-[8px] text-blue-200 uppercase font-bold tracking-tighter">Quests</div>
            </div>
            <div className="w-px h-8 bg-blue-500/20" />
            <div className="text-center">
              <div className="text-sm font-bold text-white font-mono">
                {gameState.gold?.toLocaleString() || 0}
              </div>
              <div className="text-[8px] text-blue-200 uppercase font-bold tracking-tighter">Gold</div>
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
                <div key={stat.key} className="p-3 bg-black/10 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-white" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white font-mono">{level}</span>
                  </div>
                  {/* شريط التقدم باللون الأبيض المتوهج */}
                  <div className="h-1.5 bg-black/40 border border-blue-900/30 overflow-hidden">
                    <div 
                      className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-1000" 
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
