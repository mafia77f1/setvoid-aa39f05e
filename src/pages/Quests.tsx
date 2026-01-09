import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { useState, useEffect } from 'react';
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
      toast({
        title: 'SYSTEM: QUEST INITIALIZED',
        description: 'تم تفعيل بروتوكول المهمة بنجاح.',
      });
      handleCloseModal();
    }
  };

  const sideQuests = gameState.quests.filter(q => q.isMainQuest === false);
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      {/* --- Modal Details (Unchanged) --- */}
      {selectedQuest && (
        <div className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]",
          isVisible && !isExiting ? "bg-black/80" : "bg-black/0 pointer-events-none"
        )}>
          <div className={cn(
            "relative max-w-sm w-full bg-[#050b18] border-x border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-all ease-[cubic-bezier(0.2,1,0.2,1)]",
            isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1200ms]" : "opacity-0 scale-y-0 duration-[800ms]",
            "origin-center"
          )}>
            <div className={cn("absolute top-0 left-0 right-0 h-[1px] bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] transition-all duration-[1200ms] delay-300", isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0")} />
            <div className={cn("absolute bottom-0 left-0 right-0 h-[1px] bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] transition-all duration-[1200ms] delay-300", isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0")} />
            <div className={cn("p-6 space-y-5 transition-all duration-1000 delay-500", isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <div className="text-center"><span className="text-[10px] font-black tracking-[0.4em] text-blue-500/60 uppercase">Mission Briefing</span></div>
              <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative">
                <div className="mb-3 border-b border-blue-500/20 pb-2">
                  <span className="text-[9px] text-blue-400 block mb-1 font-bold">Designation:</span>
                  <span className="text-sm font-bold text-white tracking-widest uppercase italic">{selectedQuest.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-[9px] text-blue-400 block mb-1 uppercase">Type:</span><span className="text-xs font-bold text-white uppercase">{selectedQuest.category}</span></div>
                  <div><span className="text-[9px] text-blue-400 block mb-1 uppercase">Limit:</span><span className="text-xs font-bold text-blue-300">{selectedQuest.duration}M</span></div>
                </div>
              </div>
              <div className="bg-black/40 border border-blue-900/30 p-3 italic text-[10px] text-slate-300 leading-relaxed">{selectedQuest.description}</div>
              <div className="border-l-2 border-yellow-500 bg-yellow-500/5 p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-yellow-500 uppercase">Rewards:</span>
                <span className="text-xs font-bold text-white">+{selectedQuest.rewardGold} GOLD</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleCloseModal} className="py-3 border border-slate-700 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-red-400 transition-all">Abort</button>
                <button onClick={handleConfirmStart} className="py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">Initialize</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="relative z-10 flex flex-col items-center mb-8 border-b border-blue-500/30 pb-4">
        <h1 className="text-xl font-bold tracking-[0.2em] uppercase italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Side Quests</h1>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-blue-400 uppercase mt-2">
          <CheckCircle2 className="w-3 h-3" />
          <span>Progress: {sideQuests.filter(q => q.completed).length} / {sideQuests.length}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-6">
        {/* Tabs - Unchanged style */}
        <div className="flex gap-1 p-1 bg-black/40 border border-slate-800 rounded-lg overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-md transition-all whitespace-nowrap", activeTab === tab.id ? "bg-white/10 text-white border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]" : "text-slate-500")}>
              <tab.icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* --- Market-style Quests List --- */}
        <div className="space-y-4 mt-6">
          {getFilteredQuests().map((quest) => (
            <div key={quest.id} className="relative group overflow-hidden">
              {/* Card Container - Balanced Dimensions like Market Page */}
              <div className="relative bg-black/60 border border-slate-800 hover:border-blue-500/50 p-4 transition-all duration-300">
                
                <div className="flex gap-4">
                  {/* Icon Box - Standardized Size */}
                  <div className="w-20 h-20 border border-slate-700 bg-slate-900/50 flex items-center justify-center shrink-0 relative">
                    <div className="text-3xl grayscale brightness-150 opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_10px_white] transition-all">
                      {quest.category === 'strength' ? <Dumbbell /> : <Zap />}
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start">
                        <h2 className="text-xs font-bold tracking-wider text-white uppercase italic truncate pr-2">
                          {quest.title}
                        </h2>
                        <span className={cn(
                          "text-[8px] px-1.5 py-0.5 border font-black uppercase tracking-tighter",
                          quest.active ? "border-blue-500 text-blue-400 bg-blue-500/10 animate-pulse" : "border-slate-700 text-slate-500"
                        )}>
                          {quest.active ? 'Active' : 'Standby'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 italic">
                        {quest.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-yellow-500" />
                          <span className="text-[10px] font-bold text-yellow-400">+{quest.rewardGold}G</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-400/70">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-bold">{quest.duration}M</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => quest.completed && !quest.claimed ? claimSideQuest(quest.id) : handleOpenDetails(quest)}
                        disabled={quest.active}
                        className={cn(
                          "px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all",
                          quest.active ? "bg-slate-800 text-slate-600" : 
                          quest.completed && !quest.claimed ? "bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.4)]" :
                          "bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white"
                        )}
                      >
                        {quest.active ? <Loader2 className="w-3 h-3 animate-spin" /> : quest.completed && !quest.claimed ? 'Claim' : 'Initialize'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Progress Bar (Only when active) */}
                {quest.active && (
                  <div className="absolute bottom-0 left-0 h-[1px] bg-blue-500 shadow-[0_0_5px_#3b82f6] transition-all animate-[shimmer_2s_infinite]" style={{width: '100%'}} />
                )}
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
