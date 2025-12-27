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
  { key: 'quran', label: 'Agi', icon: BookOpen, color: 'text-blue-100' },
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
      {/* الكارد الخارجي (بنفسجي عميق مع حواف بنفسجية) */}
      <div className="p-4 bg-[#1a0b2e] border-2 border-purple-600/50 shadow-[0_0_40px_rgba(88,28,135,0.4)] relative">
        
        {/* الكارد الداخلي (شفاف بستايل الماركت) */}
        <div className="relative bg-[#020817]/80 backdrop-blur-sm p-6 border border-blue-500/20">
          
          {/* كلمة STATUS مع حدود بيضاء متكسرة */}
          <div className="flex justify-center mb-8">
            <div className="relative border border-white px-10 py-1 bg-slate-900/90 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {/* زوايا متكسرة للعنوان */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#020817] border-b border-r border-white" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#020817] border-t border-l border-white" />
              
              <h2 className="text-sm font-black tracking-[0.4em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase">
                STATUS
              </h2>
            </div>
          </div>

          {/* Level and Info Section */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 text-center md:text-left relative">
            <div className="relative">
              <div className="text-6xl font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] leading-none">
                {totalLevel}
              </div>
              <div className="text-[10px] text-blue-400 font-bold tracking-widest mt-1 uppercase">Level</div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3 justify-center md:justify-start border-b border-white/10 pb-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Job:</span>
                <span className="text-sm font-bold text-white uppercase italic">{totalLevel >= 100 ? gameState.playerJob : 'UNKNOWN'}</span>
              </div>
              <div className="flex items-center gap-3 justify-center md:justify-start border-b border-white/10 pb-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Name:</span>
                <span className="text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] uppercase">{gameState.playerName}</span>
              </div>
            </div>

            <button onClick={() => setShowEditModal(true)} className="absolute top-0 right-0 p-2 text-white/40 hover:text-white transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </div>

          {/* مربع الدم والطاقة بحدود بيضاء متكسرة */}
          <div className="relative p-4 border border-white mb-8 bg-black/40 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]">
             {/* تأثير التكسر في الزوايا */}
             <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#1a0b2e] rotate-45 border-b border-white" />
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#1a0b2e] rotate-45 border-t border-white" />
             
            <div className="space-y-4">
              <div className="relative">
                <div className="flex justify-between items-end mb-1 px-1">
                  <span className="text-[10px] font-black text-red-500 italic drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">HP</span>
                  <span className="text-xs font-mono text-white">{Math.round(gameState.hp)} / {gameState.maxHp}</span>
                </div>
                <div className="h-2 bg-red-950/40 border border-red-500/20">
                  <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all" style={{ width: `${hpPercentage}%` }} />
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between items-end mb-1 px-1">
                  <span className="text-[10px] font-black text-blue-500 italic drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">MP</span>
                  <span className="text-xs font-mono text-white">{Math.round(gameState.energy)} / {gameState.maxEnergy}</span>
                </div>
                <div className="h-2 bg-blue-950/40 border border-blue-500/20">
                  <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all" style={{ width: `${energyPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* مربع الإحصائيات السفلية بحدود بيضاء متكسرة */}
          <div className="relative p-4 border border-white bg-black/40">
            {/* تأثير التكسر في الزوايا */}
            <div className="absolute top-0 right-0 w-4 h-px bg-[#1a0b2e] translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-4 h-px bg-[#1a0b2e] -translate-x-1/2" />

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                const level = gameState.levels[stat.key];
                const xp = gameState.stats[stat.key];
                const progress = getXpProgress(xp);

                return (
                  <div key={stat.key} className="relative">
                    <div className="flex items-center gap-3 mb-1">
                      <Icon className={cn('w-4 h-4', stat.color)} />
                      <div className="flex flex-1 justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</span>
                        <span className="text-sm font-black text-white">{level}</span>
                      </div>
                    </div>
                    <div className="h-1 bg-white/10">
                      <div 
                        className={cn('h-full shadow-[0_0_8px] transition-all duration-1000', stat.color.replace('text-', 'bg-'))} 
                        style={{ width: `${progress}%`, boxShadow: '0 0 8px currentColor' }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* سطر الذهب والمهمات داخل الإحصائيات */}
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Streak: {gameState.streakDays}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] uppercase">
                  Gold: {gameState.gold?.toLocaleString()}
                </span>
              </div>
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
