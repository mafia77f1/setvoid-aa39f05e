import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { useState } from 'react';
import { Dumbbell, Brain, Heart, Zap, Target, CheckCircle2, Clock, Scroll, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Quests = () => {
  const { gameState, startSideQuest, claimSideQuest, closeSideQuest } = useGameState();
  const [activeTab, setActiveTab] = useState<'all' | 'strength' | 'mind' | 'spirit' | 'agility'>('all');

  // تصفية المهمات الجانبية فقط
  const sideQuests = gameState.quests.filter(q => q.isMainQuest === false);
  
  const handleStart = (questId: string) => {
    startSideQuest(questId);
    toast({
      title: 'SYSTEM: QUEST STARTED',
      description: 'المهمة بدأت! استمر حتى انتهاء الوقت.',
    });
  };

  const handleClaim = (questId: string) => {
    claimSideQuest(questId);
    toast({
      title: 'SYSTEM: SUCCESS',
      description: 'تم استلام المكافآت بنجاح!',
    });
  };

  const getFilteredQuests = () => {
    if (activeTab === 'all') return sideQuests;
    return sideQuests.filter(q => q.category === activeTab);
  };

  const completedCount = sideQuests.filter(q => q.completed).length;
  const totalCount = sideQuests.length;

  const tabs = [
    { id: 'all', label: 'الكل', icon: Scroll },
    { id: 'strength', label: 'STR', icon: Dumbbell },
    { id: 'mind', label: 'INT', icon: Brain },
    { id: 'spirit', label: 'SPR', icon: Heart },
    { id: 'agility', label: 'AGI', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24">
      {/* Background Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <header className="relative z-10 flex flex-col items-center mb-6 border-b border-blue-500/30 pb-4">
        <h1 className="text-xl font-bold tracking-[0.2em] uppercase italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mb-2">
          Side Quests
        </h1>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
          <CheckCircle2 className="w-3 h-3" />
          <span>Progress:</span>
          <span className="text-white drop-shadow-[0_0_5px_white]">{completedCount} / {totalCount}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-8">
        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-black/40 border border-slate-800 rounded-lg overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-white/10 border border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", activeTab === tab.id && "drop-shadow-[0_0_5px_white]")} />
                <span className="text-[10px] font-bold tracking-tight uppercase">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quests List */}
        <div className="space-y-12 mt-8">
          {getFilteredQuests().length > 0 ? (
            getFilteredQuests().map((quest) => (
              <div key={quest.id} className="relative group">
                {/* Blue Glow on hover */}
                <div className="absolute -inset-0.5 bg-blue-500/10 blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
                
                {/* Main Card Container */}
                <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                  
                  {/* Floating Header Title */}
                  <div className="flex justify-center mb-4 mt-[-1.5rem]">
                    <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      <h2 className="text-[10px] font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase">
                        QUEST: <span className="text-blue-100">{quest.title}</span>
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      {/* Icon Box */}
                      <div className="w-20 h-20 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0">
                        <div className="text-3xl filter grayscale brightness-200 opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                           {quest.category === 'strength' && <Dumbbell />}
                           {quest.category === 'mind' && <Brain />}
                           {quest.category === 'spirit' && <Heart />}
                           {quest.category === 'agility' && <Zap />}
                           {!['strength', 'mind', 'spirit', 'agility'].includes(quest.category) && <Target />}
                        </div>
                      </div>

                      {/* Stats / Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center border-b border-white/10 pb-1">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Reward:</p>
                          <p className="text-xs font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)] italic uppercase">
                            +{quest.rewardGold} GOLD
                          </p>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-1">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Duration:</p>
                          <div className="flex items-center gap-1 text-white">
                            <Clock className="w-3 h-3 text-blue-400" />
                            <p className="text-xs font-bold italic">{quest.duration}m</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="text-center px-1 border-t border-slate-700/50 pt-2">
                      <p className="text-[10px] text-slate-300 italic leading-tight">
                        {quest.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {quest.completed ? (
                         quest.claimed ? (
                          <button 
                            onClick={() => closeSideQuest(quest.id)}
                            className="w-full py-2 bg-slate-900/50 border border-slate-700 text-slate-500 text-[10px] font-bold uppercase tracking-widest"
                          >
                            <X className="w-3 h-3 inline mr-1" /> Remove from Log
                          </button>
                         ) : (
                          <button 
                            onClick={() => handleClaim(quest.id)}
                            className="w-full py-2 bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 text-[10px] font-bold uppercase tracking-widest animate-pulse"
                          >
                            Claim Rewards
                          </button>
                         )
                      ) : (
                        <button
                          onClick={() => handleStart(quest.id)}
                          disabled={quest.active}
                          className={cn(
                            "w-full py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all border",
                            quest.active 
                              ? "bg-blue-500/5 border-blue-500/20 text-blue-400/50 cursor-wait" 
                              : "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20 active:scale-95"
                          )}
                        >
                          {quest.active ? 'Quest in Progress...' : 'Initialize Quest'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 opacity-30 italic">
              <Target className="w-8 h-8 mb-2" />
              <p className="text-[10px] tracking-widest uppercase">No Active Side-Quests</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Quests;
