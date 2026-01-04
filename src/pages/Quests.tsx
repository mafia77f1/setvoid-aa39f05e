import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { SideQuestCard } from '@/components/SideQuestCard';
import { useState } from 'react';
import { Dumbbell, Brain, Heart, Zap, Target, CheckCircle2, Clock, Scroll } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Quests = () => {
  const { gameState, startSideQuest, claimSideQuest, closeSideQuest } = useGameState();
  const [activeTab, setActiveTab] = useState<'all' | 'strength' | 'mind' | 'spirit' | 'agility'>('all');

  // Filter only side quests (isMainQuest === false)
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

  const handleClose = (questId: string) => {
    closeSideQuest(questId);
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
        <p className="text-[10px] text-slate-400 mb-2">المهمات الجانبية - تعتمد على الوقت</p>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
          <CheckCircle2 className="w-3 h-3" />
          <span>Progress:</span>
          <span className="text-white drop-shadow-[0_0_5px_white]">{completedCount} / {totalCount}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-6">
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

        {/* Info Banner */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-blue-400">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold">المهمات الجانبية تعتمد على الوقت</span>
          </div>
          <p className="text-[10px] text-blue-300 mt-1">
            ابدأ المهمة وانتظر حتى ينتهي الوقت المحدد، ثم اطالب بالمكافآت!
          </p>
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          {getFilteredQuests().length > 0 ? (
            getFilteredQuests().map(quest => (
              <SideQuestCard
                key={quest.id}
                quest={quest}
                onStart={handleStart}
                onClaim={handleClaim}
                onClose={handleClose}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 opacity-30 italic">
              <Target className="w-8 h-8 mb-2" />
              <p className="text-[10px] tracking-widest uppercase">No Quests Found</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Quests;
