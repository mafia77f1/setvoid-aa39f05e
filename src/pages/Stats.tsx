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
  X
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress, useItem, equipTitle, unequipTitle } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');
  // حالة جديدة للتحكم في نافذة كتاب الخبرة
  const [selectedExpBook, setSelectedExpBook] = useState<any>(null);

  const MAX_LEVEL = 100;

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
        <div className="flex items-center gap-3">
          <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-mono font-bold text-blue-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] text-sm">
              {gameState.gold.toLocaleString()}
            </span>
          </div>
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
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Modal لكتاب الخبرة */}
            {selectedExpBook && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="relative w-full max-w-xs bg-[#0a0f1d] border-2 border-blue-500/50 p-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                  <button 
                    onClick={() => setSelectedExpBook(null)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-blue-400 uppercase tracking-tighter italic">{selectedExpBook.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold">XP GAIN: +{selectedExpBook.xpValue || 500}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((s) => (
                      <div key={s.name} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-300">{s.name}</span>
                        </div>
                        <div className="h-1 bg-slate-800 w-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                            style={{ width: `${s.xpProgress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      useItem(selectedExpBook.id);
                      setSelectedExpBook(null);
                    }}
                    className="w-full mt-6 py-2 bg-blue-600/20 border border-blue-400 text-blue-100 text-[10px] font-bold uppercase tracking-[0.2em]"
                  >
                    CONFIRM USE
                  </button>
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
                <div key={`${item.id}-${index}`} className="relative group">
                  <div className="absolute -inset-0.5 bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                    <div className="flex justify-center mb-4 mt-[-1.5rem]">
                      <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        <h2 className="text-xs font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase italic">
                          ITEM: <span className="text-blue-400">{item.name}</span>
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0">
                          {/* تعديل أيقونة جهاز قياس الطاقة */}
                          {item.id === 'mana-meter' || item.name.includes('قياس الطاقة') ? (
                            <img src="/ManaDeviceIcon.png" alt="Mana Device" className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
                          ) : (
                            <span className="text-4xl filter grayscale brightness-200 opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                              {item.icon || '📦'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-center border-b border-white/10 pb-1">
                            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Category:</p>
                            <p className="text-xs font-bold text-white italic uppercase">{item.category || item.type}</p>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/10 pb-1">
                            <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Quantity:</p>
                            <p className="text-xs font-bold text-blue-400 italic">x{item.quantity}</p>
                          </div>
                          {item.equipped && (
                            <div className="flex justify-between items-center border-b border-yellow-500/30 pb-1">
                              <p className="text-[9px] text-yellow-400 uppercase font-bold tracking-tighter">Status:</p>
                              <p className="text-xs font-bold text-yellow-400 italic">EQUIPPED</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-blue-950/20 border border-blue-500/20 p-2 min-h-[40px]">
                        <p className="text-[10px] text-slate-300 italic text-center leading-tight">
                          {item.description}
                        </p>
                      </div>
                      {item.type === 'title' ? (
                        <button
                          onClick={() => item.equipped ? unequipTitle() : equipTitle(item.id)}
                          className={cn(
                            "w-full mt-2 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.95] border drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]",
                            item.equipped 
                              ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-300" 
                              : "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20"
                          )}
                        >
                          {item.equipped ? 'Unequip Title' : 'Equip Title'}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            // إذا كان العنصر هو كتاب خبرة، يظهر الكارد
                            if (item.id.includes('exp-book')) {
                              setSelectedExpBook(item);
                            } else {
                              useItem(item.id);
                            }
                          }}
                          className="w-full mt-2 py-2 bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-500/20 transition-all active:scale-[0.95] drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]"
                        >
                          Use Item
                        </button>
                      )}
                    </div>
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
