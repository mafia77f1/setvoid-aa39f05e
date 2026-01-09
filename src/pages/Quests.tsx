import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { useState } from 'react';
import { Dumbbell, Brain, Heart, Zap, Target, CheckCircle2, Clock, Scroll, X, ShieldAlert, Loader2, Trophy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Quests = () => {
  const { gameState, startSideQuest, claimSideQuest, closeSideQuest } = useGameState();
  const [activeTab, setActiveTab] = useState<'all' | 'strength' | 'mind' | 'spirit' | 'agility'>('all');
  
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleOpenDetails = (quest: any) => {
    setSelectedQuest(quest);
    setTimeout(() => setIsVisible(true), 50);
  };

  const handleCloseModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      setSelectedQuest(null);
    }, 800);
  };

  const handleConfirmStart = () => {
    if (selectedQuest) {
      startSideQuest(selectedQuest.id);
      toast({ title: 'SYSTEM: QUEST INITIALIZED', description: 'تم تفعيل بروتوكول المهمة بنجاح.' });
      handleCloseModal();
    }
  };

  const sideQuests = gameState.quests.filter(q => !q.isMainQuest);
  const getFilteredQuests = () => activeTab === 'all' ? sideQuests : sideQuests.filter(q => q.category === activeTab);
  
  const tabs = [
    { id: 'all', label: 'الكل', icon: Scroll },
    { id: 'strength', label: 'STR', icon: Dumbbell },
    { id: 'mind', label: 'INT', icon: Brain },
    { id: 'spirit', label: 'SPR', icon: Heart },
    { id: 'agility', label: 'AGI', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-32">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(29,78,216,0.1),transparent_70%)]" />
      </div>

      {/* --- Modal (Keep same as before) --- */}
      {selectedQuest && (
        <div className={cn("fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]", isVisible && !isExiting ? "bg-black/80" : "bg-black/0 pointer-events-none")}>
          <div className={cn("relative max-w-sm w-full bg-[#050b18] border-x border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-all ease-[cubic-bezier(0.2,1,0.2,1)]", isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1200ms]" : "opacity-0 scale-y-0 duration-[800ms]", "origin-center")}>
            <div className={cn("absolute top-0 left-0 right-0 h-[1px] bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] transition-all duration-[1200ms] delay-300", isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0")} />
            <div className={cn("absolute bottom-0 left-0 right-0 h-[1px] bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] transition-all duration-[1200ms] delay-300", isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0")} />
            <div className={cn("p-6 space-y-5 transition-all duration-1000 delay-500", isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <div className="text-center"><span className="text-[10px] font-black tracking-[0.4em] text-blue-500/60 uppercase">Mission Briefing</span></div>
              <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative">
                <div className="mb-3 border-b border-blue-500/20 pb-2">
                  <span className="text-[9px] text-blue-400 block mb-1 font-bold">DESIGNATION:</span>
                  <span className="text-sm font-bold text-white tracking-widest uppercase italic">{selectedQuest.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase">
                  <div><span className="text-[8px] text-blue-400 block mb-0.5">TYPE</span>{selectedQuest.category}</div>
                  <div><span className="text-[8px] text-blue-400 block mb-0.5">TIME</span>{selectedQuest.duration}M</div>
                </div>
              </div>
              <div className="bg-black/40 border border-blue-900/30 p-3 italic text-[10px] text-slate-300 leading-relaxed">{selectedQuest.description}</div>
              <div className="border-l-2 border-yellow-500 bg-yellow-500/5 p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-yellow-500 uppercase">Rewards:</span>
                <span className="text-xs font-bold text-white">+{selectedQuest.rewardGold} GOLD</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleCloseModal} className="py-3 border border-slate-700 text-slate-500 text-[10px] font-bold uppercase tracking-widest">Abort</button>
                <button onClick={handleConfirmStart} className="py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest">Initialize</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center mb-8 border-b border-blue-500/20 pb-6">
        <h1 className="text-2xl font-black tracking-[0.3em] uppercase italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">Quests Log</h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="h-[1px] w-8 bg-blue-500/50" />
          <span className="text-[10px] font-bold text-blue-400 tracking-[0.2em]">{completedCount} / {totalCount} MISSIONS</span>
          <div className="h-[1px] w-8 bg-blue-500/50" />
        </div>
      </header>

      <main className="relative z-10 max-w-lg mx-auto space-y-10 px-2">
        {/* Filter Tabs */}
        <div className="flex gap-1.5 p-1.5 bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap border", activeTab === tab.id ? "bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "text-slate-500 border-transparent")}>
              <tab.icon className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Quests List - Bigger & Improved Cards */}
        <div className="space-y-16 pt-4">
          {getFilteredQuests().map((quest) => (
            <div key={quest.id} className="relative group">
              {/* Outer Glow Decor */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-[2px] h-2/3 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
              
              {/* MAIN CARD CONTAINER (Enlarged) */}
              <div className="relative bg-[#030712]/80 border-2 border-slate-400/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:border-white">
                
                {/* Decorative Corners */}
                <div className="absolute top-[-2px] left-[-2px] w-4 h-4 border-t-2 border-l-2 border-white" />
                <div className="absolute bottom-[-2px] right-[-2px] w-4 h-4 border-b-2 border-r-2 border-white" />

                {/* Floating Title Label */}
                <div className="absolute top-0 left-8 -translate-y-1/2 bg-slate-900 border border-slate-400 px-4 py-1 flex items-center gap-2 shadow-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <h2 className="text-[11px] font-black tracking-[0.15em] text-white uppercase italic drop-shadow-[0_0_8px_white]">
                    LVL: {quest.id.split('-')[1] || '01'} // {quest.title}
                  </h2>
                </div>

                <div className="flex flex-col gap-6 mt-2">
                  <div className="flex gap-6 items-start">
                    {/* Larger Icon Box */}
                    <div className="w-28 h-28 border border-slate-500/40 bg-gradient-to-br from-slate-900 to-black flex items-center justify-center relative flex-shrink-0 group-hover:border-blue-500/50 transition-colors">
                      <div className="absolute inset-1 border border-white/5" />
                      <div className="text-4xl text-white opacity-80 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {quest.category === 'strength' ? <Dumbbell className="w-10 h-10" /> : <Zap className="w-10 h-10" />}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 space-y-4 py-1">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-blue-400/80 tracking-widest uppercase">Objective</span>
                        <p className="text-xs text-slate-300 leading-snug line-clamp-2 italic font-medium">
                          {quest.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-slate-500 uppercase">Rewards</span>
                          <div className="flex items-center gap-1.5 text-yellow-400">
                            <Trophy className="w-3 h-3" />
                            <span className="text-xs font-black tracking-tighter">+{quest.rewardGold}G</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-black text-slate-500 uppercase">Time Limit</span>
                          <div className="flex items-center gap-1.5 text-blue-300">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span className="text-xs font-black tracking-tighter">{quest.duration}:00M</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Button */}
                  <div className="relative group/btn">
                    <button
                      onClick={() => quest.completed && !quest.claimed ? claimSideQuest(quest.id) : handleOpenDetails(quest)}
                      disabled={quest.active}
                      className={cn(
                        "w-full py-3.5 text-[11px] font-black tracking-[0.3em] uppercase transition-all duration-300 border relative overflow-hidden",
                        quest.active ? "bg-slate-900/50 border-blue-900/50 text-blue-900 cursor-wait" : 
                        quest.completed && !quest.claimed ? "bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-[1.01]" :
                        "bg-blue-600/10 border-blue-500/50 text-blue-400 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] active:scale-95"
                      )}
                    >
                      <span className="relative z-10">
                        {quest.active ? 'Mission Jurneying...' : quest.completed && !quest.claimed ? 'Claim Mission Rewards' : 'Start Initialization'}
                      </span>
                    </button>
                    {/* Button Accent */}
                    {!quest.active && (
                      <div className="absolute top-0 right-2 w-1 h-1 bg-white opacity-50 group-hover/btn:opacity-100" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Quests;
