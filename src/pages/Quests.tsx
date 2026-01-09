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

      {/* --- Modal Details --- */}
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
                   <span className="text-[9px] text-blue-400 block mb-1 uppercase">Designation:</span>
                   <span className="text-sm font-bold text-white tracking-widest uppercase italic">{selectedQuest.title}</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div><span className="text-[8px] text-blue-400 block mb-1">TYPE:</span><span className="text-xs font-bold text-white">{selectedQuest.category.toUpperCase()}</span></div>
                   <div><span className="text-[8px] text-blue-400 block mb-1">LIMIT:</span><span className="text-xs font-bold text-blue-300">{selectedQuest.duration}M</span></div>
                 </div>
               </div>
               <div className="bg-black/40 border border-blue-900/30 p-3 italic text-[10px] text-slate-300 leading-relaxed">{selectedQuest.description}</div>
               <div className="border-l-2 border-yellow-500 bg-yellow-500/5 p-3 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-yellow-500 uppercase">Rewards:</span>
                 <span className="text-xs font-bold text-white">{selectedQuest.rewardGold} GOLD</span>
               </div>
               <div className="grid grid-cols-2 gap-3 pt-2">
                 <button onClick={handleCloseModal} className="py-3 border border-slate-700 text-slate-500 text-[10px] font-bold uppercase tracking-widest">Abort</button>
                 <button onClick={handleConfirmStart} className="py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest">Initialize</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Content --- */}
      <header className="relative z-10 flex flex-col items-center mb-8 border-b border-blue-500/30 pb-4">
        <h1 className="text-xl font-bold tracking-[0.2em] uppercase italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Side Quests</h1>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-blue-400 uppercase mt-2">
          <CheckCircle2 className="w-3 h-3" />
          <span>Progress: {sideQuests.filter(q => q.completed).length} / {sideQuests.length}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-sm mx-auto space-y-12">
        <div className="flex gap-1 p-1 bg-black/40 border border-slate-800 rounded-lg overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-md transition-all whitespace-nowrap", activeTab === tab.id ? "bg-white/10 text-white border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]" : "text-slate-500")}>
              <tab.icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Quest Grid - Cards are now taller than wider */}
        <div className="grid grid-cols-1 gap-16 justify-items-center">
          {getFilteredQuests().map((quest) => (
            <div key={quest.id} className="relative group w-72"> {/* تحديد عرض ثابت لجعل الطول يبرز */}
              <div className="relative bg-[#050b18]/80 border-2 border-slate-400/80 p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-center text-center min-h-[380px] justify-between transition-all hover:border-white">
                
                {/* Floating Title Container */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5">
                  <div className="border border-slate-400/50 px-3 py-1 bg-slate-900 shadow-xl">
                    <h2 className="text-[10px] font-bold tracking-widest text-white uppercase italic truncate">
                      {quest.title}
                    </h2>
                  </div>
                </div>

                {/* Content Section (Vertical Layout) */}
                <div className="flex flex-col items-center gap-6 w-full pt-4">
                  {/* Icon Box */}
                  <div className="w-32 h-32 border border-slate-500/50 flex items-center justify-center bg-black/40 relative shadow-inner group-hover:border-blue-500/40 transition-colors">
                    <div className="text-5xl grayscale brightness-200 opacity-80 drop-shadow-[0_0_15px_white]">
                      {quest.category === 'strength' ? <Dumbbell className="w-12 h-12" /> : <Zap className="w-12 h-12" />}
                    </div>
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 p-1"><ShieldAlert className="w-3 h-3 text-blue-500/30" /></div>
                  </div>

                  {/* Info Labels */}
                  <div className="w-full space-y-3 px-2">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Reward</span>
                      <span className="text-sm font-black text-yellow-400 tracking-wider">+{quest.rewardGold} G</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Limit</span>
                      <span className="text-xs font-bold text-blue-300">{quest.duration}:00 M</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Status</span>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", quest.active ? "text-blue-500 animate-pulse" : "text-slate-400")}>
                        {quest.active ? 'Active' : quest.completed ? 'Success' : 'Ready'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  onClick={() => quest.completed && !quest.claimed ? claimSideQuest(quest.id) : handleOpenDetails(quest)}
                  disabled={quest.active}
                  className={cn(
                    "w-full mt-6 py-3.5 text-[10px] font-black tracking-[0.3em] uppercase border transition-all duration-300 relative overflow-hidden",
                    quest.active ? "bg-slate-900 border-blue-900/30 text-blue-900" : 
                    quest.completed && !quest.claimed ? "bg-yellow-500 text-black border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]" :
                    "bg-blue-600/10 border-blue-500/50 text-blue-400 hover:bg-blue-600 hover:text-white"
                  )}
                >
                  {quest.active ? 'Running...' : quest.completed && !quest.claimed ? 'Claim Reward' : 'Initialize'}
                </button>
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
