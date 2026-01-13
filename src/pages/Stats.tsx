import { useState, useMemo } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { RadarChart } from '@/components/RadarChart';
import { cn } from '@/lib/utils';
import { 
  Dumbbell, Brain, Heart, Zap, Target, Coins, 
  Package, X, ShieldAlert, Info, MapPin, 
  Image as ImageIcon, ChevronUp, Sparkles
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress, useItem } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');
  
  // Modals State
  const [activeItem, setActiveItem] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'analysis' | 'use' | null>(null);
  const [selectedStat, setSelectedStat] = useState<'strength' | 'mind' | 'spirit' | 'agility'>('strength');
  const [useAmount, setUseAmount] = useState(1);

  const MAX_LEVEL = 100;

  const statsData = [
    { id: 'strength', name: 'STRENGTH', icon: <Dumbbell className="w-4 h-4" />, currentXp: gameState.stats.strength, level: gameState.levels.strength },
    { id: 'mind', name: 'MIND', icon: <Brain className="w-4 h-4" />, currentXp: gameState.stats.mind, level: gameState.levels.mind },
    { id: 'spirit', name: 'SPIRIT', icon: <Heart className="w-4 h-4" />, currentXp: gameState.stats.spirit, level: gameState.levels.spirit },
    { id: 'agility', name: 'AGILITY', icon: <Zap className="w-4 h-4" />, currentXp: gameState.stats.agility || 0, level: gameState.levels.agility || 0 },
  ];

  const openModal = (item: any, mode: 'analysis' | 'use') => {
    setActiveItem(item);
    setModalMode(mode);
    setUseAmount(1);
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveItem(null);
  };

  const handleUseItem = () => {
    // هنا يتم استدعاء وظيفة الاستخدام من الـ Hook الخاص بك
    // نمرر الكمية والفئة المختارة
    useItem(activeItem.id, useAmount, selectedStat);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24">
      {/* Background Effects (نفس التصميم القديم) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400">Player Status</h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          {['stats', 'equipment'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "flex-1 py-2 border text-[10px] font-bold tracking-[0.2em] uppercase transition-all",
                activeTab === tab ? "bg-blue-500/20 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-black/40 border-slate-700 text-slate-500"
              )}
            >
              {tab === 'stats' ? 'Abilities' : 'Inventory'}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 text-center">
              <div className="text-4xl font-black italic">LV. {gameState.totalLevel}</div>
              <div className="text-[10px] font-bold tracking-[0.4em] uppercase py-1 px-4 border-y border-white/20 mt-2 inline-block text-blue-400">S-RANK</div>
            </div>
            <div className="bg-black/40 border border-blue-500/30 p-4 flex justify-center">
              <RadarChart stats={{
                strength: (gameState.levels.strength/MAX_LEVEL)*100,
                mind: (gameState.levels.mind/MAX_LEVEL)*100,
                spirit: (gameState.levels.spirit/MAX_LEVEL)*100,
                agility: ((gameState.levels.agility||0)/MAX_LEVEL)*100,
              }} size={200} />
            </div>
            {statsData.map(s => (
                <div key={s.id} className="bg-black/60 border border-slate-700/50 p-3">
                    <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{s.name}</span>
                        <span className="text-sm font-bold italic">LV.{s.level}</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${getXpProgress(s.currentXp)}%` }} />
                    </div>
                </div>
            ))}
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {gameState.inventory.filter(i => i.quantity > 0).map((item) => (
              <div key={item.id} className="relative bg-black/60 border-2 border-slate-200/90 p-4">
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                    <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90">
                      <h2 className="text-xs font-bold tracking-widest text-white uppercase italic">{item.name}</h2>
                    </div>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 border border-slate-700 bg-black/40 flex items-center justify-center text-3xl">
                    {item.icon || '📦'}
                  </div>
                  <div className="flex-1 text-[11px] space-y-1">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-slate-500">QTY:</span>
                        <span className="text-blue-400 font-bold">x{item.quantity}</span>
                    </div>
                    <p className="text-slate-300 italic leading-tight">{item.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => openModal(item, 'analysis')}
                      className="py-2 bg-slate-800 border border-slate-600 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-700"
                    >
                      Analyze
                    </button>
                    <button 
                      onClick={() => openModal(item, 'use')}
                      className="py-2 bg-blue-600/20 border border-blue-500/50 text-blue-400 text-[9px] font-bold uppercase tracking-widest hover:bg-blue-600/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                    >
                      Use Item
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL SYSTEM */}
      {modalMode && activeItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md bg-black/80">
          <div className="bg-[#050b18] border-x border-blue-500/40 w-full max-w-sm font-mono animate-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-blue-500/30 flex justify-between items-center bg-blue-950/20">
              <div className="flex items-center gap-2">
                {modalMode === 'analysis' ? <ShieldAlert className="w-4 h-4 text-blue-400" /> : <Sparkles className="w-4 h-4 text-yellow-400" />}
                <span className="text-[10px] font-bold tracking-[0.2em] text-blue-100 uppercase italic">
                    {modalMode === 'analysis' ? 'System Analysis' : 'Item Consumption'}
                </span>
              </div>
              <X className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" onClick={closeModal} />
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Item Info Card (Shared) */}
              <div className="bg-black/40 border border-slate-700/50 p-4 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase">Item:</span>
                    <span className="text-xs font-bold text-white">{activeItem.name}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase">Current Stock:</span>
                    <span className="text-xs font-bold text-blue-400">x{activeItem.quantity}</span>
                </div>
              </div>

              {modalMode === 'analysis' ? (
                /* ANALYSIS CONTENT (نفس محتواك القديم) */
                <>
                  <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3">
                    <div className="flex items-center gap-2 border-l-2 border-yellow-500 pl-2">
                      <MapPin className="w-3 h-3 text-yellow-500" />
                      <span className="text-[10px] font-bold text-yellow-100 uppercase">Acquisition</span>
                    </div>
                    <div className="text-[10px] text-slate-400 italic">Available in Store & Dungeon Drops.</div>
                  </div>
                  <div className="aspect-square bg-slate-900/80 border border-white/10 flex items-center justify-center text-7xl">
                    {activeItem.icon || '📦'}
                  </div>
                </>
              ) : (
                /* USE ITEM CONTENT (الجديد) */
                <div className="space-y-6">
                  {/* Quantity Selector */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                        <span className="text-slate-400">Select Quantity:</span>
                        <span className="text-blue-400">{useAmount} / {activeItem.quantity}</span>
                    </div>
                    <input 
                        type="range" min="1" max={activeItem.quantity} value={useAmount}
                        onChange={(e) => setUseAmount(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-800 appearance-none rounded-full accent-blue-500"
                    />
                  </div>

                  {/* XP Distribution (Only for Experience items) */}
                  {(activeItem.id?.includes('exp') || activeItem.type === 'consumable') && (
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Target Attribute:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {statsData.map(s => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedStat(s.id as any)}
                            className={cn(
                                "p-2 border text-[10px] flex items-center gap-2 transition-all",
                                selectedStat === s.id ? "bg-blue-500/20 border-blue-400 text-white" : "bg-black border-slate-800 text-slate-500"
                            )}
                          >
                            {s.icon} {s.name}
                          </button>
                        ))}
                      </div>

                      {/* Preview Stats Progress */}
                      <div className="bg-blue-950/20 border border-blue-900/50 p-4 space-y-3">
                        <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400 italic uppercase">System Projection:</span>
                            <span className="text-green-400 font-bold flex items-center gap-1">
                                <ChevronUp className="w-3 h-3" /> +{useAmount * 5} XP 
                            </span>
                        </div>
                        {/* Progress Bar Preview */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-mono">
                                <span className="text-white uppercase">{selectedStat} Progress</span>
                                <span>{getXpProgress(gameState.stats[selectedStat])}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden relative">
                                {/* Current Progress */}
                                <div className="absolute h-full bg-blue-500 z-10" style={{ width: `${getXpProgress(gameState.stats[selectedStat])}%` }} />
                                {/* Preview Increase */}
                                <div 
                                    className="absolute h-full bg-green-400/50 animate-pulse z-0" 
                                    style={{ 
                                        width: `${Math.min(getXpProgress(gameState.stats[selectedStat]) + (useAmount * 10), 100)}%` 
                                    }} 
                                />
                            </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleUseItem}
                    className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-blue-100 transition-all"
                  >
                    CONFIRM USE
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Stats;
