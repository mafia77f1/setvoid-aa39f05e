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
  Coins,
  Package,
  X,
  Search
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress, useItem } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const MAX_LEVEL = 100;

  // التحقق من وجود عنصر مقياس المانا في الحقيبة
  const hasManaMeter = gameState.inventory.some(item => 
    item.name.toLowerCase().includes('mana meter') || item.id === 'mana_meter'
  );

  const stats = [
    { 
      category: 'strength' as const, 
      level: gameState.levels.strength, 
      xp: gameState.stats.strength, 
      xpProgress: getXpProgress(gameState.stats.strength),
      name: 'STRENGTH',
      icon: <Dumbbell className="w-5 h-5" />,
      color: '#60a5fa' 
    },
    { 
      category: 'mind' as const, 
      level: gameState.levels.mind, 
      xp: gameState.stats.mind, 
      xpProgress: getXpProgress(gameState.stats.mind),
      name: 'MIND',
      icon: <Brain className="w-5 h-5" />,
      color: '#60a5fa'
    },
    { 
      category: 'spirit' as const, 
      level: gameState.levels.spirit, 
      xp: gameState.stats.spirit, 
      xpProgress: getXpProgress(gameState.stats.spirit),
      name: 'SPIRIT',
      icon: <Heart className="w-5 h-5" />,
      color: '#60a5fa'
    },
    { 
      category: 'agility' as const, 
      level: gameState.levels.agility || 0, 
      xp: gameState.stats.agility || 0, 
      xpProgress: getXpProgress(gameState.stats.agility || 0),
      name: 'AGILITY',
      icon: <Zap className="w-5 h-5" />,
      color: '#60a5fa'
    },
  ];

  const radarStats = {
    strength: Math.min((gameState.levels.strength / MAX_LEVEL) * 100, 100),
    mind: Math.min((gameState.levels.mind / MAX_LEVEL) * 100, 100),
    spirit: Math.min((gameState.levels.spirit / MAX_LEVEL) * 100, 100),
    agility: Math.min(((gameState.levels.agility || 0) / MAX_LEVEL) * 100, 100),
  };

  const totalLevel = gameState.totalLevel;
  
  const getLevelConfig = () => {
    if (totalLevel >= 40) return { color: '#c084fc', tier: 'S-RANK' };
    if (totalLevel >= 20) return { color: '#60a5fa', tier: 'B-RANK' };
    return { color: '#ffffff', tier: 'E-RANK' };
  };

  const levelConfig = getLevelConfig();

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      {/* Background Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
          Player Status
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 drop-shadow-[0_0:10px_rgba(255,255,255,0.7)] text-sm">
            {gameState.gold.toLocaleString()}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {['stats', 'equipment'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "flex-1 py-2 border text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2",
                activeTab === tab 
                  ? "bg-blue-500/20 border-blue-400 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                  : "bg-black/40 border-slate-700 text-slate-500"
              )}
            >
              {tab === 'stats' ? (
                <><Target className="w-3 h-3" /> Abilities</>
              ) : (
                <><Package className="w-3 h-3" /> Inventory</>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Level Window */}
            <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
              <div className="flex justify-center mb-6 mt-[-2.5rem]">
                <div className="border border-slate-400/50 px-6 py-1 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  <h2 className="text-xs font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase italic">
                    Class: <span className="text-blue-400">Shadow Monarch</span>
                  </h2>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl font-black italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                  LV. {totalLevel}
                </div>
                <div 
                  className="text-[10px] font-bold tracking-[0.4em] uppercase py-1 px-4 border-y border-white/20"
                  style={{ color: levelConfig.color }}
                >
                  {levelConfig.tier}
                </div>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-black/40 border border-blue-500/30 p-4 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 border-l-2 border-blue-400 pl-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-bold tracking-widest text-blue-100">ABILITY ANALYSIS</span>
                </div>
                <div className="flex justify-center py-2">
                   <RadarChart stats={radarStats} size={240} />
                </div>
              </div>

              {/* Individual Stats */}
              <div className="space-y-3">
                {stats.map((stat) => (
                  <div key={stat.category} className="bg-black/60 border border-slate-700/50 p-3 hover:border-blue-500/50 transition-colors">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-blue-400 opacity-80">{stat.icon}</div>
                        <span className="text-xs font-bold tracking-tighter text-slate-300 uppercase">{stat.name}</span>
                      </div>
                      <span className="text-lg font-black italic text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                        {stat.level}
                      </span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all duration-1000"
                        style={{ width: `${stat.xpProgress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
            {gameState.inventory.length === 0 ? (
              <div className="col-span-2 text-center py-20 border-2 border-dashed border-slate-800 opacity-50">
                <Package className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase">Inventory Empty</p>
              </div>
            ) : (
              gameState.inventory.map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => setSelectedItem(item)}
                  className="relative group bg-black/60 border border-slate-700/50 p-4 flex flex-col items-center gap-2 hover:border-blue-400 transition-all active:scale-95"
                >
                  <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    {item.icon || '📦'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter truncate w-full text-center">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-blue-400 font-mono">x{item.quantity || 1}</span>
                </button>
              ))
            )}
          </div>
        )}
      </main>

      {/* Item Info Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm bg-[#020817] border-2 border-slate-200/90 p-6 shadow-[0_0_30px_rgba(30,58,138,0.5)]">
            
            {/* Modal Header Title */}
            <div className="flex justify-center mb-6 mt-[-2.5rem]">
              <div className="border border-slate-400/50 px-4 py-1 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                <h2 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase italic">
                  Item <span className="text-blue-400">Analysis</span>
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border border-slate-500/50 flex items-center justify-center bg-black/40 shadow-inner">
                  <span className="text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                    {selectedItem.icon || '📦'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black italic text-blue-400 uppercase tracking-tight">
                    {selectedItem.name}
                  </h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                    Rank: <span className="text-slate-200">Common</span>
                  </p>
                </div>
              </div>

              <div className="bg-blue-950/20 border border-blue-500/20 p-3 min-h-[60px]">
                <p className="text-[11px] text-slate-300 italic leading-relaxed">
                  {selectedItem.description || 'System log: No further information available for this object.'}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    useItem(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="w-full py-2.5 bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-500/20 transition-all active:scale-[0.95]"
                >
                  Use Item
                </button>

                {hasManaMeter && (
                  <button className="w-full py-2.5 bg-purple-500/10 border border-purple-500/40 text-purple-300 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2">
                    <Search className="w-3 h-3" /> Analyze Potential
                  </button>
                )}

                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full py-2 border border-slate-700 text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-3 h-3" /> Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Stats;
