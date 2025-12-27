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
      {/* البطاقة الرئيسية: خلفية سوداء عميقة مع حدود فضية حادة */}
      <div className="relative bg-[#020617] border-[1.5px] border-slate-400 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-visible">
        
        {/* زوايا النظام الشهيرة - فضي متوهج */}
        <div className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2 border-white z-20 shadow-[0_0_10px_white]" />
        <div className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-2 border-r-2 border-white z-20 shadow-[0_0_10px_white]" />
        
        {/* Status Header: تصميم بارز يشبه واجهة Sung Jin-Woo */}
        <div className="flex justify-center mt-[-12px] relative z-30">
          <div className="bg-[#0f172a] border border-slate-300 px-8 py-1 shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
            <h2 className="text-sm font-black tracking-[0.3em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,1)] italic">
              STATUS
            </h2>
          </div>
        </div>

        <div className="p-6 pt-10">
          {/* قسم المستوى والمعلومات الأساسية */}
          <div className="flex items-center gap-8 mb-8">
            <div className="relative">
              <div className="text-6xl font-black italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                {totalLevel}
              </div>
              <div className="absolute -bottom-2 left-0 right-0 text-[10px] text-center font-bold text-blue-400 tracking-[0.2em] uppercase">Level</div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Name</span>
                <span className="text-sm font-bold text-white drop-shadow-[0_0_8px_white]">{gameState.playerName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Job</span>
                <span className="text-sm font-bold text-white drop-shadow-[0_0_8px_white] italic">{totalLevel >= 100 ? gameState.playerJob : 'NONE'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Title</span>
                <span className="text-sm font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)] italic uppercase">{gameState.playerTitle}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowEditModal(true)}
              className="p-2 border border-slate-500 bg-slate-800/50 hover:bg-white hover:text-black transition-all"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>

          {/* أشرطة الحالة (HP/MP) بجودة عالية */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-red-500 tracking-tighter italic">HP [HEALTH POINT]</span>
                <span className="text-white drop-shadow-[0_0_5px_white]">{Math.round(gameState.hp)} / {gameState.maxHp}</span>
              </div>
              <div className="h-2.5 bg-slate-900 border border-slate-800 p-[1px]">
                <div className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all duration-500" style={{ width: `${hpPercentage}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-blue-400 tracking-tighter italic">MP [MANA POINT]</span>
                <span className="text-white drop-shadow-[0_0_5px_white]">{Math.round(gameState.energy)} / {gameState.maxEnergy}</span>
              </div>
              <div className="h-2.5 bg-slate-900 border border-slate-800 p-[1px]">
                <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-500" style={{ width: `${energyPercentage}%` }} />
              </div>
            </div>
          </div>

          {/* الإحصائيات السريعة والذهب (البنفسجي) */}
          <div className="flex items-center justify-between mb-8 px-4 py-4 bg-slate-900/40 border-y border-white/5">
            <div className="text-center">
              <div className="text-lg font-bold text-white drop-shadow-[0_0_8px_white]">{gameState.streakDays}</div>
              <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Streak</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-lg font-bold text-white drop-shadow-[0_0_8px_white]">{todayQuests}/{totalQuests}</div>
              <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Tasks</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]">
                {gameState.gold?.toLocaleString() || 0}
              </div>
              <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Gold</div>
            </div>
          </div>

          {/* شبكة الخصائص الأساسية - خط تقدم أبيض ناصع */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const level = gameState.levels[stat.key];
              const xp = gameState.stats[stat.key];
              const progress = getXpProgress(xp);

              return (
                <div key={stat.key} className="relative group">
                  <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 hover:border-white/30 transition-all">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-black text-white drop-shadow-[0_0_5px_white] italic">{stat.label}</span>
                      </div>
                      <span className="text-sm font-bold text-white font-mono">{level}</span>
                    </div>
                    {/* شريط التقدم الأبيض المتوهج */}
                    <div className="h-1 bg-black overflow-hidden">
                      <div 
                        className="h-full bg-white shadow-[0_0_10px_white] transition-all duration-1000" 
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
