import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { StatType } from '@/types/game';
import { Flag, Check, Calendar, Target, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const categoryLabels: Record<StatType, string> = {
  strength: 'PHYSICAL BODY',
  mind: 'MENTAL GROWTH',
  spirit: 'SPIRITUALITY',
  agility: 'AGILITY & FITNESS',
};

const suggestedTasks: Record<StatType, string[]> = {
  strength: ['30 Min Workout', '8 Cups of Water', '7 Hours Sleep', '5000 Steps'],
  mind: ['Read 30 Pages', 'Learn New Skill', 'No Social Media', 'Journaling'],
  spirit: ['Fajr on Time', 'Morning Athkar', 'Daily Charity', '100x Istighfar'],
  agility: ['20 Min Run', 'Stretching', 'Speed Drills', 'Jump Rope'],
};

const GrandQuest = () => {
  const { gameState, startGrandQuest, completeGrandQuestDay } = useGameState();
  const [selectedCategory, setSelectedCategory] = useState<StatType>('strength');
  const [questTitle, setQuestTitle] = useState('');

  const handleStart = () => {
    if (!questTitle.trim()) {
      toast({ title: 'SYSTEM: ERROR', description: 'Enter Quest Title', variant: 'destructive' });
      return;
    }
    startGrandQuest(selectedCategory, questTitle, suggestedTasks[selectedCategory]);
    toast({ title: '🎯 QUEST STARTED', description: '30-Day Challenge Initialized' });
  };

  const handleCompleteDay = () => {
    completeGrandQuestDay();
    toast({ title: '✓ PROGRESS SAVED', description: `Day ${gameState.grandQuest?.completedDays || 0 + 1} Complete` });
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      {/* Background Tech Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <header className="relative z-10 flex justify-center items-center mb-8 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.2em] uppercase italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          Grand Quest
        </h1>
      </header>

      <main className="relative z-10 max-w-md mx-auto">
        {gameState.grandQuest?.active ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Active Quest Window */}
            <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
              <div className="flex justify-center mb-6 mt-[-2.5rem]">
                <div className="border border-slate-400/50 px-4 py-1 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  <h2 className="text-[10px] font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase">
                    ACTIVE MISSION
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-black italic tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] uppercase">
                    {gameState.grandQuest.title}
                  </h3>
                  <p className="text-[9px] text-blue-400 font-bold tracking-[0.3em] mt-1 uppercase">
                    Category: {categoryLabels[gameState.grandQuest.category]}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold tracking-widest text-white/70">
                    <span>PROGRESS</span>
                    <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                      {gameState.grandQuest.completedDays} / 30 DAYS
                    </span>
                  </div>
                  <div className="h-2 bg-slate-900 border border-white/10 rounded-none overflow-hidden p-[1px]">
                    <div
                      className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-all duration-1000"
                      style={{ width: `${(gameState.grandQuest.completedDays / 30) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Daily Tasks List */}
                <div className="bg-black/40 border border-white/10 p-4 space-y-3">
                  <p className="text-[9px] font-bold text-blue-400 tracking-widest uppercase mb-2">Daily Requirements:</p>
                  {gameState.grandQuest.dailyTasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-3 text-xs text-slate-300 italic">
                      <div className="w-1 h-1 bg-white shadow-[0_0_5px_white]" />
                      {task}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleCompleteDay} 
                  className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-white/40 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
                >
                  Complete Today's Tasks
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Create New Quest View */
          <div className="space-y-8 animate-in zoom-in-95 duration-300">
            <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
              <div className="flex justify-center mb-6 mt-[-2.5rem]">
                <div className="border border-slate-400/50 px-4 py-1 bg-slate-900/90">
                  <h2 className="text-[10px] font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase">
                    Initialize New Quest
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-blue-400 tracking-widest uppercase ml-1">Mission Title</label>
                  <input
                    placeholder="Enter mission name..."
                    value={questTitle}
                    onChange={(e) => setQuestTitle(e.target.value)}
                    className="w-full bg-black/50 border border-slate-700 p-3 text-sm focus:border-white outline-none transition-all italic text-white"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-blue-400 tracking-widest uppercase ml-1">Select Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(Object.entries(categoryLabels) as [StatType, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={cn(
                          "flex justify-between items-center p-3 border transition-all text-[10px] font-bold tracking-widest uppercase",
                          selectedCategory === key 
                            ? "bg-white/10 border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                            : "bg-black/20 border-slate-800 text-slate-500 hover:border-slate-600"
                        )}
                      >
                        {label}
                        {selectedCategory === key && <ChevronRight className="w-3 h-3 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suggested Tasks Preview */}
                <div className="p-4 bg-blue-950/20 border border-blue-500/20">
                   <p className="text-[9px] font-bold text-blue-400 tracking-widest uppercase mb-2 italic underline">System Suggestions:</p>
                   <ul className="grid grid-cols-2 gap-2">
                    {suggestedTasks[selectedCategory].map((task, index) => (
                      <li key={index} className="text-[9px] text-slate-400 uppercase italic">• {task}</li>
                    ))}
                   </ul>
                </div>

                <button 
                  onClick={handleStart} 
                  className="w-full py-4 bg-white text-black font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
                >
                  Accept Mission
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default GrandQuest;
