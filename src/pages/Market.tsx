import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { RadarChart } from '@/components/RadarChart';
import { cn } from '@/lib/utils';
import { 
  Dumbbell, 
  Brain, 
  Heart, 
  Zap,
  Target,
  Coins,
  Package,
  X,
  Loader2,
  ShieldAlert
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress, useItem, equipTitle, unequipTitle } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');
  
  // States for the new Scan-style Modal
  const [selectedXpItem, setSelectedXpItem] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const MAX_LEVEL = 100;

  const stats = [
    { category: 'strength', level: gameState.levels.strength, xpProgress: getXpProgress(gameState.stats.strength), name: 'STRENGTH', icon: <Dumbbell className="w-5 h-5" /> },
    { category: 'mind', level: gameState.levels.mind, xpProgress: getXpProgress(gameState.stats.mind), name: 'MIND', icon: <Brain className="w-5 h-5" /> },
    { category: 'spirit', level: gameState.levels.spirit, xpProgress: getXpProgress(gameState.stats.spirit), name: 'SPIRIT', icon: <Heart className="w-5 h-5" /> },
    { category: 'agility', level: gameState.levels.agility || 0, xpProgress: getXpProgress(gameState.stats.agility || 0), name: 'AGILITY', icon: <Zap className="w-5 h-5" /> },
  ];

  const radarStats = {
    strength: Math.min((gameState.levels.strength / MAX_LEVEL) * 100, 100),
    mind: Math.min((gameState.levels.mind / MAX_LEVEL) * 100, 100),
    spirit: Math.min((gameState.levels.spirit / MAX_LEVEL) * 100, 100),
    agility: Math.min(((gameState.levels.agility || 0) / MAX_LEVEL) * 100, 100),
  };

  // Function to handle the Market-style Modal Open
  const openXpModal = (item: any) => {
    setSelectedXpItem(item);
    setIsScanning(true);
    setIsExiting(false);
    setTimeout(() => setIsVisible(true), 50);
  };

  // Function to handle the Market-style Modal Close
  const closeXpModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsExiting(false);
      setIsVisible(false);
      setSelectedXpItem(null);
    }, 800);
  };

  const totalLevel = gameState.totalLevel;
  const levelConfig = totalLevel >= 40 ? { color: '#c084fc', tier: 'S-RANK' } : totalLevel >= 20 ? { color: '#60a5fa', tier: 'B-RANK' } : { color: '#ffffff', tier: 'E-RANK' };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      {/* Background Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">Player Status</h1>
        <div className="flex items-center gap-3">
          <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-mono font-bold text-blue-100 text-sm">{gameState.gold.toLocaleString()}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-6">
        <div className="flex gap-2 mb-6">
          {['stats', 'equipment'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "flex-1 py-2 border text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2",
                activeTab === tab ? "bg-blue-500/20 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-black/40 border-slate-700 text-slate-500"
              )}
            >
              {tab === 'stats' ? <><Target className="w-3 h-3" /> Abilities</> : <><Package className="w-3 h-3" /> Inventory</>}
            </button>
          ))}
        </div>

        {/* --- STATS TAB --- */}
        {activeTab === 'stats' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
              <div className="flex justify-center mb-6 mt-[-2.5rem]">
                <div className="border border-slate-400/50 px-6 py-1 bg-slate-900/90">
                  <h2 className="text-xs font-bold tracking-widest text-white uppercase italic">
                    Class: <span className="text-blue-400">Shadow Monarch</span>
                  </h2>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl font-black italic text-white">LV. {totalLevel}</div>
                <div className="text-[10px] font-bold tracking-[0.4em] uppercase py-1 px-4 border-y border-white/20" style={{ color: levelConfig.color }}>{levelConfig.tier}</div>
              </div>
            </div>
            <div className="bg-black/40 border border-blue-500/30 p-4">
              <div className="flex justify-center py-2"><RadarChart stats={radarStats} size={240} /></div>
            </div>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.category} className="bg-black/60 border border-slate-700/50 p-3">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400 opacity-80">{stat.icon}</div>
                      <span className="text-xs font-bold text-slate-300 uppercase">{stat.name}</span>
                    </div>
                    <span className="text-lg font-black italic text-white">{stat.level}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${stat.xpProgress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- EQUIPMENT TAB (Inventory) --- */}
        {activeTab === 'equipment' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* ITEM ANALYSIS MODAL (MARKET STYLE) */}
            {isScanning && selectedXpItem && (
              <div className={cn(
                "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]",
                isVisible && !isExiting ? "bg-black/90" : "bg-black/0 pointer-events-none"
              )}>
                <div className={cn(
                  "relative bg-[#050b18] border-x border-white/40 shadow-[0_0_50px_rgba(59,130,246,0.4)] max-w-sm w-full font-mono overflow-hidden transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
                  isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1000ms]" : "opacity-0 scale-y-0 duration-[800ms]"
                )}>
                  {/* Glowing Lines */}
                  <div className={cn("absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1500ms] delay-500", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
                  <div className={cn("absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1500ms] delay-500", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
                  
                  <div className={cn("p-6 space-y-6 transition-all duration-1000 delay-700", isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
                    <div className="text-center">
                      <h2 className="text-blue-400 text-lg font-bold tracking-[0.2em] uppercase italic">Item Analysis</h2>
                      <div className="mt-1 text-[10px] text-blue-300 animate-pulse">XP SOURCE: {selectedXpItem.name}</div>
                    </div>

                    <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative space-y-4">
                      <div className="absolute top-0 right-0 p-1"><ShieldAlert className="w-4 h-4 text-blue-500/50" /></div>
                      
                      {/* Stats Distribution Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { l: 'القوة', k: 'strength' },
                          { l: 'العقل', k: 'mind' },
                          { l: 'الروح', k: 'spirit' },
                          { l: 'اللياقة', k: 'agility' }
                        ].map((s) => (
                          <div key={s.k} className="space-y-1">
                            <span className="text-[9px] text-blue-400 block uppercase font-bold">{s.l}</span>
                            <div className="h-1 bg-slate-900 w-full rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" style={{ width: '50%' }} />
                            </div>
                            <span className="text-[8px] text-blue-300/60 block text-right font-mono">+{selectedXpItem.xpAmount || 500} XP</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button 
                        onClick={() => { useItem(selectedXpItem.id); closeXpModal(); }}
                        className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all"
                      >
                        Consume Item
                      </button>
                      <button onClick={closeXpModal} className="w-full py-2 text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                        Cancel Sequence
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {gameState.inventory.filter(i => i.quantity > 0).length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-800 opacity-50">
                <Package className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase">Inventory Empty</p>
              </div>
            ) : (
              gameState.inventory.filter(i => i.quantity > 0).map((item, index) => (
                <div key={`${item.id}-${index}`} className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                  <div className="flex justify-center mb-4 mt-[-1.5rem]">
                    <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90">
                      <h2 className="text-xs font-bold tracking-widest text-white uppercase italic">ITEM: <span className="text-blue-400">{item.name}</span></h2>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0 overflow-hidden">
                        {item.name === "Mana Gauge" ? (
                          <img src="/ManaDeviceIcon.png" alt="Mana Gauge" className="w-[160%] h-[160%] object-contain scale-125 filter drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                        ) : (
                          <span className="text-4xl filter grayscale brightness-200 opacity-90">{item.icon || '📦'}</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center border-b border-white/10 pb-1">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Category:</p>
                          <p className="text-xs font-bold text-white italic uppercase">{item.category || item.type}</p>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-1">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Quantity:</p>
                          <p className="text-xs font-bold text-blue-400 italic">x{item.quantity}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-950/20 border border-blue-500/20 p-2 min-h-[40px]">
                      <p className="text-[10px] text-slate-300 italic text-center leading-tight">{item.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (item.id === 'xp_book' || item.type === 'experience') {
                          openXpModal(item);
                        } else if (item.type === 'title') {
                          item.equipped ? unequipTitle() : equipTitle(item.id);
                        } else {
                          useItem(item.id);
                        }
                      }}
                      className="w-full mt-2 py-3 bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.95]"
                    >
                      {item.type === 'title' ? (item.equipped ? 'Unequip Title' : 'Equip Title') : 'Use Item'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Stats;
