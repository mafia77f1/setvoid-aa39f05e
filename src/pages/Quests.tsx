import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { useState } from 'react';
import { Dumbbell, Brain, Heart, Zap, Scroll, CheckCircle2, ShieldAlert } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Quests = () => {
  const { gameState, startSideQuest, claimSideQuest } = useGameState();
  const [activeTab, setActiveTab] = useState<'all' | 'strength' | 'mind' | 'spirit' | 'agility'>('all');
  
  // --- Modal Logic Enhanced with Framer Motion ---
  const [selectedQuest, setSelectedQuest] = useState<any>(null);

  const handleOpenDetails = (quest: any) => {
    setSelectedQuest(quest);
  };

  const handleCloseModal = () => {
    setSelectedQuest(null);
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
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      {/* --- High Performance Animated Modal --- */}
      <AnimatePresence>
        {selectedQuest && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/80"
          >
            <motion.div 
              initial={{ scaleY: 0, opacity: 0, shadow: "0 0 0px rgba(59,130,246,0)" }}
              animate={{ scaleY: 1, opacity: 1, shadow: "0 0 50px rgba(59,130,246,0.2)" }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 1, 0.2, 1] }}
              className="relative max-w-sm w-full bg-[#050b18] border-x border-blue-500/40 origin-center overflow-hidden"
            >
              {/* التوهج العلوي والسفلي مع أنيميشن سلس */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute top-0 left-0 right-0 h-[1px] bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)]" 
              />
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)]" 
              />

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="p-6 space-y-5"
              >
                <div className="text-center">
                  <span className="text-[10px] font-black tracking-[0.4em] text-blue-500/60 uppercase">Mission Briefing</span>
                </div>

                <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative">
                  <div className="absolute top-0 right-0 p-1"><ShieldAlert className="w-4 h-4 text-blue-500/40" /></div>
                  <div className="mb-3 border-b border-blue-500/20 pb-2">
                    <span className="text-[9px] text-blue-400 block mb-1 uppercase font-bold">Designation:</span>
                    <span className="text-sm font-bold text-white tracking-widest uppercase italic">{selectedQuest.title}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-blue-400 block mb-1">TYPE:</span>
                      <span className="text-xs font-bold text-white">{selectedQuest.category.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-blue-400 block mb-1">LIMIT:</span>
                      <span className="text-xs font-bold text-blue-300">{selectedQuest.duration}M</span>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 border border-blue-900/30 p-3 italic text-[10px] text-slate-300 leading-relaxed">
                  {selectedQuest.description}
                </div>

                <div className="border-l-2 border-yellow-500 bg-yellow-500/5 p-3 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-yellow-500 uppercase">Rewards:</span>
                  <span className="text-xs font-bold text-white tracking-widest">{selectedQuest.rewardGold} GOLD</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={handleCloseModal} className="py-3 border border-slate-700 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-red-400 hover:border-red-400/50 transition-all active:scale-95">
                    Abort
                  </button>
                  <button onClick={handleConfirmStart} className="py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 transition-all">
                    Initialize
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main UI Content (Unchanged) --- */}
      <header className="relative z-10 flex flex-col items-center mb-6 border-b border-blue-500/30 pb-4">
        <h1 className="text-xl font-bold tracking-[0.2em] uppercase italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Side Quests</h1>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-blue-400 uppercase mt-2">
          <CheckCircle2 className="w-3 h-3" />
          <span>Progress: {sideQuests.filter(q => q.completed).length} / {sideQuests.length}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-8">
        <div className="flex gap-1 p-1 bg-black/40 border border-slate-800 rounded-lg overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-md transition-all whitespace-nowrap", activeTab === tab.id ? "bg-white/10 text-white border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]" : "text-slate-500")}>
              <tab.icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {getFilteredQuests().map((quest) => (
            <div key={quest.id} className="relative group">
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90">
                    <h2 className="text-[10px] font-bold tracking-widest text-white uppercase italic">QUEST: {quest.title}</h2>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 border border-slate-500/50 flex items-center justify-center bg-black/40">
                      <div className="text-3xl grayscale brightness-200 opacity-80 drop-shadow-[0_0_10px_white]">
                        {quest.category === 'strength' ? <Dumbbell /> : <Zap />}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <span className="text-[9px] text-slate-400 uppercase font-bold">Reward:</span>
                        <span className="text-xs font-bold text-yellow-400">+{quest.goldReward || 10} G</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <span className="text-[9px] text-slate-400 uppercase font-bold">Status:</span>
                        <span className={cn("text-[9px] font-bold uppercase", quest.active ? "text-blue-400 animate-pulse" : quest.completed ? "text-green-400" : "text-slate-500")}>
                          {quest.active ? 'In Progress' : quest.completed && !quest.claimed ? 'Ready' : quest.claimed ? 'Claimed' : 'Available'}
                        </span>
                      </div>
                      {quest.active && quest.requiredTime && (
                        <div className="flex justify-between items-center border-b border-white/10 pb-1">
                          <span className="text-[9px] text-slate-400 uppercase font-bold">Progress:</span>
                          <span className="text-[9px] font-bold text-blue-300">
                            {Math.floor((quest.timeProgress || 0) / 60)}m / {quest.requiredTime}m
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => quest.completed && !quest.claimed ? claimSideQuest(quest.id) : handleOpenDetails(quest)}
                    disabled={quest.active}
                    className={cn(
                      "w-full py-2 text-[10px] font-bold tracking-[0.2em] uppercase border transition-all",
                      quest.active ? "bg-slate-900 border-blue-500/20 text-blue-900" : 
                      quest.completed && !quest.claimed ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-400 animate-pulse" :
                      "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20"
                    )}
                  >
                    {quest.active ? 'Processing...' : quest.completed && !quest.claimed ? 'Claim Reward' : 'Initialize Quest'}
                  </button>
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
