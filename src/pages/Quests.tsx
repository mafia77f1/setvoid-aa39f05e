import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { useState } from 'react';
import { Dumbbell, Brain, Heart, Zap, Target, CheckCircle2, Clock, Scroll, X, ShieldAlert, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Quests = () => {
  const { gameState, startSideQuest, claimSideQuest, closeSideQuest } = useGameState();
  const [activeTab, setActiveTab] = useState<'all' | 'strength' | 'mind' | 'spirit' | 'agility'>('all');
  
  // State for Modal
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [isClosing, setIsClosing] = useState(false);

  const sideQuests = gameState.quests.filter(q => q.isMainQuest === false);
  
  const handleOpenDetails = (quest: any) => {
    setSelectedQuest(quest);
    setIsClosing(false);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedQuest(null);
      setIsClosing(false);
    }, 500);
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
      </div>

      {/* --- Quest Detail Modal --- */}
      {selectedQuest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className={cn(
            "relative bg-[#050b18] border-2 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.4)] p-6 max-w-sm w-full font-mono overflow-hidden",
            isClosing ? "animate-[foldVertical_0.5s_ease-in_forwards]" : "animate-[unfoldVertical_0.4s_ease-out_forwards]"
          )}>
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
            
            <div className="space-y-4">
              <h2 className="text-blue-400 text-center text-lg font-bold tracking-[0.2em] uppercase italic">
                Quest Briefing
              </h2>
              
              <div className="w-full space-y-4">
                {/* Data Box */}
                <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative">
                  <div className="absolute top-0 right-0 p-1"><ShieldAlert className="w-4 h-4 text-blue-500/50" /></div>
                  <div className="mb-3 border-b border-blue-500/30 pb-2">
                    <span className="text-[9px] text-blue-400 block mb-1">DESIGNATION:</span>
                    <span className="text-sm font-bold text-white tracking-wider">{selectedQuest.title}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-blue-400 block mb-1">CATEGORY:</span>
                      <span className="text-xs font-bold text-white uppercase">{selectedQuest.category}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-blue-400 block mb-1">DURATION:</span>
                      <span className="text-xs font-bold text-blue-300">{selectedQuest.duration} Minutes</span>
                    </div>
                  </div>
                </div>

                {/* Description Box */}
                <div className="bg-blue-950/10 border border-blue-900/40 p-3">
                  <p className="text-[10px] text-slate-300 leading-relaxed italic">
                    {selectedQuest.description}
                  </p>
                </div>

                {/* Reward Box */}
                <div className="border border-yellow-900/40 p-3 bg-yellow-950/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-yellow-500 shadow-[0_0_5px_yellow]" />
                    <span className="text-[9px] font-bold text-yellow-500 uppercase">Estimated Rewards:</span>
                  </div>
                  <span className="text-xs font-bold text-white">+{selectedQuest.rewardGold} GOLD</span>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={handleCloseModal}
                    className="py-2 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={handleConfirmStart}
                    className="py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-blue-500 transition-all"
                  >
                    Start Mission
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Main UI Header --- */}
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
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-black/40 border border-slate-800 rounded-lg overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md transition-all whitespace-nowrap",
                  activeTab === tab.id ? "bg-white/10 border border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]" : "text-slate-500 hover:text-slate-300"
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
          {getFilteredQuests().map((quest) => (
            <div key={quest.id} className="relative group">
              <div className="absolute -inset-0.5 bg-blue-500/10 blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                {/* Card Title Label */}
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
                        {quest.category === 'strength' ? <Dumbbell /> : <Zap />}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Reward:</p>
                        <p className="text-xs font-bold text-yellow-400 italic">+{quest.rewardGold} G</p>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Status:</p>
                        <p className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded",
                          quest.active ? "bg-blue-500/20 text-blue-400 animate-pulse" : "bg-slate-800 text-slate-400"
                        )}>
                          {quest.active ? 'IN PROGRESS' : quest.completed ? 'COMPLETED' : 'AVAILABLE'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {!quest.active && !quest.completed && (
                      <button
                        onClick={() => handleOpenDetails(quest)}
                        className="w-full py-2 bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-500/20 transition-all active:scale-95"
                      >
                        Initialize Quest
                      </button>
                    )}
                    
                    {quest.active && (
                      <div className="w-full py-2 bg-slate-900 border border-blue-500/30 flex items-center justify-center gap-3">
                         <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                         <span className="text-[10px] font-mono text-blue-400 tracking-widest">
                            TIME: {quest.duration}:00
                         </span>
                      </div>
                    )}

                    {quest.completed && !quest.claimed && (
                      <button 
                        onClick={() => claimSideQuest(quest.id)}
                        className="w-full py-2 bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 text-[10px] font-bold uppercase animate-pulse"
                      >
                        Claim Rewards
                      </button>
                    )}

                    {quest.claimed && (
                       <button 
                        onClick={() => closeSideQuest(quest.id)}
                        className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-500 text-[10px] font-bold uppercase"
                       >
                        Close Quest
                       </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />

      <style jsx>{`
        @keyframes unfoldVertical {
          0% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
        @keyframes foldVertical {
          0% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Quests;
