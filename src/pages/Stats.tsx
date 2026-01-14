Import { useState } from 'react';
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
  ShieldAlert,
  Info,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress, useItem, equipTitle, unequipTitle } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');

  const [activeItem, setActiveItem] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const MAX_LEVEL = 100;

  const stats = [
    { category: 'strength' as const, level: gameState.levels.strength, xp: gameState.stats.strength, xpProgress: getXpProgress(gameState.stats.strength), name: 'STRENGTH', icon: <Dumbbell className="w-5 h-5" />, color: '#60a5fa' },
    { category: 'mind' as const, level: gameState.levels.mind, xp: gameState.stats.mind, xpProgress: getXpProgress(gameState.stats.mind), name: 'MIND', icon: <Brain className="w-5 h-5" />, color: '#60a5fa' },
    { category: 'spirit' as const, level: gameState.levels.spirit, xp: gameState.stats.spirit, xpProgress: getXpProgress(gameState.stats.spirit), name: 'SPIRIT', icon: <Heart className="w-5 h-5" />, color: '#60a5fa' },
    { category: 'agility' as const, level: gameState.levels.agility || 0, xp: gameState.stats.agility || 0, xpProgress: getXpProgress(gameState.stats.agility || 0), name: 'AGILITY', icon: <Zap className="w-5 h-5" />, color: '#60a5fa' },
  ];

  const radarStats = {
    strength: Math.min((gameState.levels.strength / MAX_LEVEL) * 100, 100),
    mind: Math.min((gameState.levels.mind / MAX_LEVEL) * 100, 100),
    spirit: Math.min((gameState.levels.spirit / MAX_LEVEL) * 100, 100),
    agility: Math.min(((gameState.levels.agility || 0) / MAX_LEVEL) * 100, 100),
  };

  const openAnalysis = (item: any) => {
    setActiveItem(item);
    setIsScanning(true);
    setIsExiting(false);
    setTimeout(() => setIsVisible(true), 50);
  };

  const closeAnalysis = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsExiting(false);
      setIsVisible(false);
      setActiveItem(null);
    }, 800);
  };

  const totalLevel = gameState.totalLevel;
  const levelConfig = totalLevel >= 40 ? { color: '#c084fc', tier: 'S-RANK' } : totalLevel >= 20 ? { color: '#60a5fa', tier: 'B-RANK' } : { color: '#ffffff', tier: 'E-RANK' };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">Player Status</h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      {/* ANALYSIS MODAL */}
      {isScanning && activeItem && (
        <div className={cn(
          "fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-[1000ms]",
          isVisible && !isExiting ? "bg-black/95" : "bg-black/0 pointer-events-none"
        )}>
          <div className={cn(
            "relative bg-[#050b18] border-x border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-sm w-full font-mono overflow-y-auto max-h-[90vh] transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
            isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1000ms]" : "opacity-0 scale-y-0 duration-[800ms]"
          )}>
            <div className={cn("absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1500ms] delay-500", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
            
            <div className={cn("p-6 space-y-6 transition-all duration-1000 delay-700", isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <div className="flex justify-between items-center border-b border-blue-500/30 pb-2">
                <ShieldAlert className="w-5 h-5 text-blue-400" />
                <h2 className="text-blue-400 text-sm font-bold tracking-[0.2em] uppercase italic">System Analysis</h2>
                <X className="w-5 h-5 text-slate-500 cursor-pointer" onClick={closeAnalysis} />
              </div>

              {/* 1. Information Card */}
              <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3 shadow-inner">
                <div className="flex items-center gap-2 mb-1 border-l-2 border-blue-500 pl-2">
                  <Info className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] font-bold text-blue-100 tracking-widest uppercase italic">Item Properties</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between"><span className="text-slate-500 uppercase">Identity:</span> <span className="text-white font-bold tracking-wider">{activeItem.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 uppercase">Classification:</span> <span className="text-blue-400 font-bold uppercase">{activeItem.category || activeItem.type}</span></div>
                  <div className="flex justify-between border-t border-white/5 pt-1"><span className="text-slate-500 uppercase">Integrity:</span> <span className="text-white italic">{activeItem.description}</span></div>
                </div>
              </div>

              {/* 2. Acquisition Card */}
              <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1 border-l-2 border-yellow-500 pl-2">
                  <MapPin className="w-3 h-3 text-yellow-500" />
                  <span className="text-[10px] font-bold text-yellow-100 tracking-widest uppercase italic">Acquisition Route</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-[10px]">
                  <div className="bg-white/5 p-2 border border-white/10 rounded flex justify-between items-center italic">
                    <span>Store Purchase</span>
                    <span className="text-green-400 font-bold tracking-tighter">AVAILABLE</span>
                  </div>
                  <div className="bg-white/5 p-2 border border-white/10 rounded flex justify-between items-center italic opacity-60">
                    <span>Gate Dungeon Drop</span>
                    <span className="text-blue-400 font-bold tracking-tighter">CHANCE</span>
                  </div>
                  <div className="bg-white/5 p-2 border border-white/10 rounded flex justify-between items-center italic opacity-60">
                    <span>Secret Mission Rewards</span>
                    <span className="text-purple-400 font-bold tracking-tighter">EVENT</span>
                  </div>
                </div>
              </div>

              {/* 3. Visual Reference Card */}
              <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3 border-l-2 border-green-500 pl-2">
                  <ImageIcon className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] font-bold text-green-100 tracking-widest uppercase italic">Visual Reference</span>
                </div>
                <div className="aspect-square bg-slate-900/80 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  {activeItem.id === 'mana_meter' || activeItem.name === 'Mana Gauge' ? (
                    <img src="/ManaDeviceIcon.png" className="w-[150%] h-[150%] scale-110 object-contain drop-shadow-[0_0_10px_#3b82f6]" />
                  ) : (
                    <span className="text-7xl filter grayscale brightness-150 opacity-90">{activeItem.icon || '📦'}</span>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => { useItem(activeItem.id); closeAnalysis(); }}
                  className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:brightness-90 active:scale-95 transition-all"
                >
                  Initiate Consumption
                </button>
              </div>
            </div>
            <div className={cn("absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1500ms] delay-500", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
          </div>
        </div>
      )}

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

        {activeTab === 'stats' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 shadow-[0_0_20px_rgba(30,58,138,0.3)] text-center">
              <div className="flex justify-center mb-6 mt-[-2.5rem]">
                <div className="border border-slate-400/50 px-6 py-1 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  <h2 className="text-xs font-bold tracking-widest text-white uppercase italic">Class: <span className="text-blue-400">Shadow Monarch</span></h2>
                </div>
              </div>
              <div className="text-4xl font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">LV. {totalLevel}</div>
              <div className="text-[10px] font-bold tracking-[0.4em] uppercase py-1 px-4 border-y border-white/20 mt-2 inline-block" style={{ color: levelConfig.color }}>{levelConfig.tier}</div>
            </div>
            <div className="bg-black/40 border border-blue-500/30 p-4"><div className="flex justify-center py-2"><RadarChart stats={radarStats} size={240} /></div></div>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.category} className="bg-black/60 border border-slate-700/50 p-3">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3"><div className="text-blue-400 opacity-80">{stat.icon}</div><span className="text-xs font-bold tracking-tighter text-slate-300 uppercase">{stat.name}</span></div>
                    <span className="text-lg font-black italic text-white">{stat.level}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${stat.xpProgress}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {gameState.inventory.filter(i => i.quantity > 0).length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-800 opacity-50"><Package className="w-12 h-12 mx-auto mb-4 text-slate-600" /><p className="text-[10px] font-bold tracking-[0.3em] uppercase">Inventory Empty</p></div>
            ) : (
              gameState.inventory.filter(i => i.quantity > 0).map((item, index) => (
                <div key={`${item.id}-${index}`} className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)] transition-all active:scale-[0.98]">
                  <div className="flex justify-center mb-4 mt-[-1.5rem]">
                    <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      <h2 className="text-xs font-bold tracking-widest text-white uppercase italic">ITEM: <span className="text-blue-400">{item.name}</span></h2>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0">
                        {item.id === 'mana_meter' || item.name === 'Mana Gauge' ? (
                          <img src="/ManaDeviceIcon.png" alt="Mana Gauge" className="w-[150%] h-[150%] scale-125 object-contain filter brightness-110 drop-shadow-[0_0_10px_#3b82f6]" />
                        ) : (
                          <span className="text-4xl filter grayscale brightness-200 opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{item.icon || '📦'}</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center border-b border-white/10 pb-1"><p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Category:</p><p className="text-xs font-bold text-white italic uppercase">{item.category || item.type}</p></div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-1"><p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Quantity:</p><p className="text-xs font-bold text-blue-400 italic">x{item.quantity}</p></div>
                      </div>
                    </div>
                    <div className="bg-blue-950/20 border border-blue-500/20 p-2 min-h-[40px]"><p className="text-[10px] text-slate-300 italic text-center leading-tight">{item.description}</p></div>
                    <button
                      onClick={() => openAnalysis(item)}
                      className="w-full mt-2 py-3 bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em] active:scale-[0.95] drop-shadow-[0_0_5px_rgba(96,165,250,0.3)] hover:bg-blue-500/20 transition-all"
                    >
                      Use Item
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
