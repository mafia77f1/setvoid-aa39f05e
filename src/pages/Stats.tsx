import { useState } from 'react';
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
  Package, 
  Coins,
  ShieldAlert,
  Loader2,
  X
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress, useItem } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');
  
  // States للنظام الجديد
  const [isScanning, setIsScanning] = useState(false);
  const [isClosing, setIsClosing] = useState(false); 
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');
  const [activeItem, setActiveItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);

  const MAX_LEVEL = 100;

  // التحقق من وجود مقياس المانا في حقيبة اللاعب
  const hasManaMeter = gameState.inventory.some(item => item.id === 'mana_meter');

  // دالة تحديد الرتبة (مثل الماركت)
  const canSeeItem = (item) => {
    if (item.isBasic) return true;
    const playerRankLevel = Math.floor((gameState.totalLevel || 1) / 10); 
    return playerRankLevel >= (item.rankLevel || 0);
  };

  const startSystemScan = (item) => {
    setActiveItem(item);
    setIsScanning(true);
    setIsClosing(false);
    setScanResult('searching');
    setTimeout(() => {
      setScanResult('failed');
    }, 2000);
  };

  const closeScanModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsClosing(false);
      setScanResult('idle');
    }, 500);
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
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      {/* Background Overlays */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      {/* مودال الفحص (Scanner) */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className={cn(
            "relative bg-[#050b18] border-2 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.4)] p-6 max-w-sm w-full font-mono overflow-hidden",
            isClosing ? "animate-[foldVertical_0.5s_ease-in_forwards]" : "animate-[unfoldVertical_0.4s_ease-out_forwards]"
          )}>
            <div className="text-center space-y-4">
              <h2 className="text-blue-400 text-lg font-bold tracking-[0.2em] uppercase italic">
                {scanResult === 'searching' ? 'Analyzing Item...' : '[Access Denied]'}
              </h2>
              {scanResult === 'searching' ? (
                <div className="py-10 flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  <p className="text-[10px] text-blue-200 animate-pulse tracking-[0.3em]">READING MANA SIGNATURE...</p>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="border border-red-900/40 p-3 bg-red-950/10 text-left">
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-tighter">
                      Critical Error: Player level [{gameState.totalLevel}] is insufficient to activate this {activeItem?.category}.
                      Required Rank Level: {activeItem?.rankLevel * 10}.
                    </p>
                  </div>
                  <button onClick={closeScanModal} className="w-full py-2 bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase tracking-widest">
                    <X className="w-3 h-3 inline-block mr-1" /> Terminate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* مودال تفاصيل العنصر (Item Card) */}
      {showItemDetails && activeItem && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative bg-black/90 border-2 border-slate-200 p-5 max-w-sm w-full shadow-[0_0_30px_rgba(59,130,246,0.2)]">
             <div className="flex justify-center mb-6 mt-[-2rem]">
                <div className="border border-slate-400/50 px-4 py-1 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  <h2 className="text-[10px] font-bold tracking-widest text-white uppercase italic">
                    {activeItem.name}
                  </h2>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 border border-slate-700 bg-black/50 flex items-center justify-center text-3xl">
                  {activeItem.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-[9px] text-blue-400 uppercase">Rank: <span className="text-white">{activeItem.difficulty || 'E'}</span></p>
                  <p className="text-[9px] text-blue-400 uppercase">Type: <span className="text-white">{activeItem.category}</span></p>
                  <p className="text-[10px] text-slate-300 italic mt-2">{activeItem.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    useItem(activeItem.id);
                    setShowItemDetails(false);
                  }}
                  className="py-2 bg-blue-500/20 border border-blue-500/50 text-blue-100 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/40"
                >
                  Confirm Use
                </button>
                <button 
                  onClick={() => setShowItemDetails(false)}
                  className="py-2 bg-slate-900 border border-slate-700 text-slate-400 text-[10px] font-bold uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
          </div>
        </div>
      )}

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
          Player Status
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-6">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('stats')} className={cn("flex-1 py-2 border text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2", activeTab === 'stats' ? "bg-blue-500/20 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-black/40 border-slate-700 text-slate-500")}>
            <Target className="w-3 h-3" /> Abilities
          </button>
          <button onClick={() => setActiveTab('equipment')} className={cn("flex-1 py-2 border text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2", activeTab === 'equipment' ? "bg-blue-500/20 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-black/40 border-slate-700 text-slate-500")}>
            <Package className="w-3 h-3" /> Inventory
          </button>
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
              <div className="flex justify-center mb-6 mt-[-2.5rem]">
                <div className="border border-slate-400/50 px-6 py-1 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  <h2 className="text-xs font-bold tracking-widest text-white uppercase italic">Class: <span className="text-blue-400">Shadow Monarch</span></h2>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 text-4xl font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                LV. {gameState.totalLevel}
              </div>
            </div>
            
            <div className="bg-black/40 border border-blue-500/30 p-4">
              <RadarChart stats={radarStats} size={240} />
            </div>

            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.category} className="bg-black/60 border border-slate-700/50 p-3">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-400">{stat.icon}</span>
                      <span className="text-xs font-bold text-slate-300 uppercase">{stat.name}</span>
                    </div>
                    <span className="text-lg font-black italic text-white">{stat.level}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ width: `${stat.xpProgress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {gameState.inventory.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-800 text-slate-600 uppercase text-[10px] tracking-[0.3em]">Hollow Inventory</div>
            ) : (
              gameState.inventory.map((item, index) => {
                const isLocked = !canSeeItem(item);
                
                return (
                  <div key={`${item.id}-${index}`} className="relative group">
                    <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                      <div className="flex justify-center mb-4 mt-[-1.5rem]">
                        <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                          <h2 className="text-xs font-bold tracking-widest text-white uppercase">
                            ITEM: <span className="text-blue-100">{isLocked ? '???' : item.name}</span>
                          </h2>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 relative">
                            <span className={cn("text-4xl", isLocked && "filter grayscale brightness-50 blur-[2px]")}>
                              {item.icon || '📦'}
                            </span>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center border-b border-white/10 pb-1">
                              <p className="text-[9px] text-slate-400 uppercase font-bold">Category:</p>
                              <p className="text-xs font-bold text-white italic">{isLocked ? '???' : item.category}</p>
                            </div>
                            {/* زر Analyze يظهر فقط إذا كان يملك مقياس المانا وكان العنصر مخفياً */}
                            {isLocked && hasManaMeter && (
                              <button 
                                onClick={() => startSystemScan(item)}
                                className="w-full py-1 bg-red-500/20 border border-red-500/40 text-red-400 text-[8px] font-bold uppercase animate-pulse"
                              >
                                <Zap className="w-2 h-2 inline-block mr-1" /> Analyze Mana Output
                              </button>
                            )}
                          </div>
                        </div>

                        <button
                          disabled={isLocked}
                          onClick={() => {
                            setActiveItem(item);
                            setShowItemDetails(true);
                          }}
                          className={cn(
                            "w-full mt-2 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all active:scale-[0.95] border",
                            isLocked 
                              ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed" 
                              : "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20"
                          )}
                        >
                          {isLocked ? '[Locked by Rank]' : 'Inspect / Use'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      <BottomNav />

      <style jsx>{`
        @keyframes unfoldVertical { 0% { transform: scaleY(0); } 100% { transform: scaleY(1); } }
        @keyframes foldVertical { 0% { transform: scaleY(1); opacity: 1; } 100% { transform: scaleY(0); opacity: 0; } }
      `}</style>
    </div>
  );
};

export default Stats;
