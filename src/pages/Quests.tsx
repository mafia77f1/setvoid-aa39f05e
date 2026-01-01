import { useGameState } from '@/hooks/useGameState';
import { QuestCardNew } from '@/components/QuestCardNew';
import { BottomNav } from '@/components/BottomNav';
import { useState } from 'react';
import { Dumbbell, Brain, Heart, Zap, Target, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Quests = () => {
  const { gameState, completeQuest } = useGameState();
  const [activeTab, setActiveTab] = useState('strength');

  const handleComplete = (questId: string) => {
    completeQuest(questId);
    toast({
      title: 'SYSTEM: SUCCESS',
      description: 'Quest Objective Cleared!',
    });
  };

  const strengthQuests = gameState.quests.filter(q => q.category === 'strength');
  const mindQuests = gameState.quests.filter(q => q.category === 'mind');
  const spiritQuests = gameState.quests.filter(q => q.category === 'spirit');
  const agilityQuests = gameState.quests.filter(q => q.category === 'agility');

  const completedCount = gameState.quests.filter(q => q.completed).length;
  const totalCount = gameState.quests.length;

  const tabs = [
    { id: 'strength', label: 'STR', icon: Dumbbell },
    { id: 'mind', label: 'INT', icon: Brain },
    { id: 'spirit', label: 'SPR', icon: Heart },
    { id: 'agility', label: 'AGI', icon: Zap },
  ];

  const getActiveQuests = () => {
    switch (activeTab) {
      case 'strength': return strengthQuests;
      case 'mind': return mindQuests;
      case 'spirit': return spiritQuests;
      case 'agility': return agilityQuests;
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24">
      {/* Background Overlay (Same as Market) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <header className="relative z-10 flex flex-col items-center mb-6 border-b border-blue-500/30 pb-4">
        <h1 className="text-xl font-bold tracking-[0.2em] uppercase italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mb-2">
          Daily Quests
        </h1>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-blue-400 uppercase">
          <CheckCircle2 className="w-3 h-3" />
          <span>Progress:</span>
          <span className="text-white drop-shadow-[0_0_5px_white]">{completedCount} / {totalCount}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-6">
        {/* System Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3 transition-all border",
                  activeTab === tab.id
                    ? "bg-white/10 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                )}
              >
                <Icon className={cn("w-4 h-4", activeTab === tab.id && "drop-shadow-[0_0_5px_white]")} />
                <span className="text-[8px] font-black tracking-tighter uppercase italic">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quests Container Window */}
        <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)] min-h-[400px]">
          <div className="flex justify-center mb-6 mt-[-2rem]">
            <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <h2 className="text-[9px] font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase italic">
                Mission List: <span className="text-blue-100">{activeTab}</span>
              </h2>
            </div>
          </div>

          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {getActiveQuests().length > 0 ? (
              getActiveQuests().map(quest => (
                <div key={quest.id} className="group relative">
                  {/* نحن هنا نفترض أن QuestCardNew سيأخذ ستايل النظام تلقائياً، 
                      أو يمكنك تغليفه بـ div لضمان التناسق */}
                  <QuestCardNew 
                    quest={quest} 
                    onComplete={handleComplete} 
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 opacity-30 italic">
                <Target className="w-8 h-8 mb-2" />
                <p className="text-[10px] tracking-widest uppercase">No Quests Found</p>
              </div>
            )}
          </div>

          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Quests;
