import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { RadarChart } from '@/components/RadarChart';
import { cn } from '@/lib/utils';
import { 
  Dumbbell, Brain, Heart, Zap, Target, Coins, Package, X, ShieldAlert, Info, MapPin, Image as ImageIcon, TrendingUp
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Stats = () => {
  const { gameState, getXpProgress, useItem, equipTitle, unequipTitle } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');

  // Modals States
  const [analysisItem, setAnalysisItem] = useState<any>(null);
  const [usageItem, setUsageItem] = useState<any>(null);
  const [xpAmount, setXpAmount] = useState(1);
  const [selectedTarget, setSelectedTarget] = useState<string>('strength');

  const MAX_LEVEL = 100;

  // Function to handle Analysis (Consumes Mana Gauge)
  const handleOpenAnalysis = (item: any) => {
    const manaGauge = gameState.inventory.find(i => (i.id === 'mana_meter' || i.name === 'Mana Gauge') && i.quantity > 0);
    
    if (!manaGauge) {
      toast({ title: "System Error", description: "Requires 1x Mana Gauge to analyze items.", variant: "destructive" });
      return;
    }

    useItem(manaGauge.id); // Consume the gauge
    setAnalysisItem(item);
    toast({ title: "Analysis Active", description: "Mana Gauge consumed for scanning." });
  };

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

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24">
      {/* Background Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1d4ed8,transparent_70%)]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-widest text-blue-400 italic">Player Status</h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      {/* --- USAGE MODAL (EXPERIENCE BOOK LOGIC) --- */}
      {usageItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-mono">
          <div className="bg-[#050b18] border-x border-white/40 w-full max-w-sm p-6 space-y-6">
            <div className="text-center border-b border-blue-500/30 pb-4">
              <h2 className="text-blue-400 font-bold uppercase italic">System Usage: {usageItem.name}</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 p-3 border border-white/10 rounded">
                <p className="text-[10px] text-slate-400 uppercase mb-2">Set Quantity to consume:</p>
                <input 
                  type="range" min="1" max={usageItem.quantity} value={xpAmount}
                  onChange={(e) => setXpAmount(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <p className="text-right text-xs text-blue-400 font-bold mt-1">QTY: {xpAmount}</p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase">Select Target Stat:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['strength', 'mind', 'spirit', 'agility'].map(stat => (
                    <button 
                      key={stat} onClick={() => setSelectedTarget(stat)}
                      className={cn("py-2 text-[10px] border uppercase font-bold", selectedTarget === stat ? "bg-blue-600 border-white" : "bg-black/40 border-slate-700")}
                    >
                      {stat} <TrendingUp className="w-3 h-3 inline ml-1 text-green-400" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 p-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>EXP GAIN:</span>
                  <span className="text-green-400">+{xpAmount * 500} XP 📈</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setUsageItem(null)} className="flex-1 py-3 text-xs uppercase border border-slate-700">Cancel</button>
              <button 
                onClick={() => { useItem(usageItem.id); setUsageItem(null); }}
                className="flex-1 py-3 bg-white text-black font-black text-xs uppercase shadow-[0_0_15px_white]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ANALYSIS MODAL (OLD STYLE AS REQUESTED) --- */}
      {analysisItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-[#050b18] border-x border-blue-500/40 w-full max-w-sm p-6 space-y-6 overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center border-b border-blue-500/30 pb-2">
                <ShieldAlert className="w-5 h-5 text-blue-400" />
                <h2 className="text-blue-400 text-sm font-bold uppercase italic">Analysis Sequence</h2>
                <X className="w-5 h-5 text-slate-500" onClick={() => setAnalysisItem(null)} />
              </div>
              <div className="bg-black/40 border border-slate-700/50 p-4 text-[11px] space-y-2">
                <p className="text-blue-400 uppercase font-bold border-l-2 border-blue-500 pl-2 mb-2 italic text-[10px]">Properties</p>
                <div className="flex justify-between"><span>Name:</span> <span className="text-white">{analysisItem.name}</span></div>
                <div className="flex justify-between"><span>Class:</span> <span className="text-blue-400">{analysisItem.type}</span></div>
                <p className="border-t border-white/5 pt-2 italic text-slate-300">{analysisItem.description}</p>
              </div>
              <div className="bg-black/40 border border-slate-700/50 p-4">
                 <p className="text-yellow-500 uppercase font-bold border-l-2 border-yellow-500 pl-2 mb-3 italic text-[10px]">Route</p>
                 <div className="space-y-1 text-[10px] italic text-slate-400">
                    <p>• Store Marketplace [Online]</p>
                    <p>• Gate Clear Rewards [Chance]</p>
                 </div>
              </div>
              <div className="aspect-square bg-slate-900 border border-white/10 flex items-center justify-center">
                 {analysisItem.id === 'mana_meter' ? <img src="/ManaDeviceIcon.png" className="w-[120%] h-[120%] object-contain" /> : <span className="text-7xl grayscale brightness-150">{analysisItem.icon}</span>}
              </div>
              <button onClick={() => setAnalysisItem(null)} className="w-full py-4 bg-white text-black font-black text-xs uppercase">Close Analysis</button>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-md mx-auto space-y-6">
        <div className="flex gap-2 mb-6 font-bold">
          {['stats', 'equipment'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={cn("flex-1 py-2 border text-[10px] uppercase tracking-widest transition-all", activeTab === tab ? "bg-blue-500/20 border-blue-400 text-blue-100 shadow-[0_0_10px_blue]" : "bg-black/40 border-slate-700 text-slate-500")}>
              {tab === 'stats' ? 'Abilities' : 'Inventory'}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="relative bg-black/60 border-2 border-slate-200 p-6 text-center">
                <div className="text-4xl font-black italic">LV. {totalLevel}</div>
             </div>
             <div className="bg-black/40 border border-blue-500/30 p-4 flex justify-center"><RadarChart stats={radarStats} size={240} /></div>
             <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.category} className="bg-black/60 border border-slate-700/50 p-3">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-300">{stat.name}</span>
                    <span className="text-lg font-black italic">{stat.level}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${stat.xpProgress}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-12">
            {gameState.inventory.filter(i => i.quantity > 0).map((item, index) => (
              <div key={`${item.id}-${index}`} className="relative bg-black/60 border-2 border-slate-200/90 p-4">
                {/* Silver Analysis Button (?) */}
                <button 
                  onClick={() => handleOpenAnalysis(item)}
                  className="absolute -top-3 -left-3 z-20 bg-[#C0C0C0] text-[#050b18] w-10 h-10 rounded-none border-2 border-[#050b18] font-black text-xl flex items-center justify-center shadow-[0_0_10px_rgba(192,192,192,0.5)] active:scale-90 transition-transform"
                >
                  ?
                </button>

                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90">
                    <h2 className="text-xs font-bold text-white uppercase italic">ITEM: <span className="text-blue-400">{item.name}</span></h2>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 border border-slate-500/50 flex items-center justify-center bg-black/40 overflow-hidden">
                      {item.id === 'mana_meter' ? (
                        <img src="/ManaDeviceIcon.png" className="w-[140%] h-[140%] scale-125 object-contain" />
                      ) : (
                        <span className="text-4xl filter grayscale brightness-150">{item.icon || '📦'}</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 text-[10px]">
                       <div className="flex justify-between border-b border-white/10 pb-1"><span className="text-slate-500 uppercase">Class:</span> <span className="text-white italic">{item.type}</span></div>
                       <div className="flex justify-between border-b border-white/10 pb-1"><span className="text-slate-500 uppercase">Qty:</span> <span className="text-blue-400 font-bold">x{item.quantity}</span></div>
                    </div>
                  </div>
                  <div className="bg-blue-950/20 border border-blue-500/20 p-2"><p className="text-[10px] text-slate-300 italic text-center italic">{item.description}</p></div>
                  <button
                    onClick={() => {
                      if (item.type === 'experience') setUsageItem(item);
                      else useItem(item.id);
                    }}
                    className="w-full mt-2 py-3 bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase tracking-widest active:scale-[0.95]"
                  >
                    Use Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Stats;
