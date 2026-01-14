import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { RadarChart } from '@/components/RadarChart';
import { ItemAnalysisModal } from '@/components/ItemAnalysisModal'; // تأكد من المسار
import { ItemUseModal } from '@/components/ItemUseModal'; // تأكد من المسار
import { cn } from '@/lib/utils';
import { 
  Dumbbell, 
  Brain, 
  Heart, 
  Zap,
  Target,
  Coins,
  Package,
  Search, // أيقونة التحليل
  PlayCircle // أيقونة الاستخدام
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress, useItem, equipTitle } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');

  // حالات المودالات الجديدة
  const [analyzingItem, setAnalyzingItem] = useState<any>(null);
  const [usingItem, setUsingItem] = useState<any>(null);

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

  const totalLevel = gameState.totalLevel;
  const levelConfig = totalLevel >= 40 ? { color: '#c084fc', tier: 'S-RANK' } : totalLevel >= 20 ? { color: '#60a5fa', tier: 'B-RANK' } : { color: '#ffffff', tier: 'E-RANK' };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">Player Status</h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      {/* Modals Implementation */}
      {analyzingItem && (
        <ItemAnalysisModal 
          item={analyzingItem} 
          onClose={() => setAnalyzingItem(null)} 
        />
      )}
      
      {usingItem && (
        <ItemUseModal 
          item={usingItem} 
          gameState={gameState}
          onClose={() => setUsingItem(null)}
          onUseItem={useItem}
          onEquipTitle={equipTitle}
          onAnalyze={() => {
            const item = usingItem;
            setUsingItem(null);
            setAnalyzingItem(item);
          }}
        />
      )}

      <main className="relative z-10 max-w-md mx-auto space-y-6">
        {/* Tabs */}
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
              <div className="text-4xl font-black italic text-white">LV. {totalLevel}</div>
              <div className="text-[10px] font-bold tracking-[0.4em] uppercase py-1 px-4 border-y border-white/20 mt-2 inline-block" style={{ color: levelConfig.color }}>{levelConfig.tier}</div>
            </div>
            <div className="bg-black/40 border border-blue-500/30 p-4">
              <div className="flex justify-center py-2"><RadarChart stats={radarStats} size={240} /></div>
            </div>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.category} className="bg-black/60 border border-slate-700/50 p-3">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3"><span className="text-xs font-bold text-slate-300 uppercase">{stat.name}</span></div>
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

        {activeTab === 'equipment' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {gameState.inventory.filter(i => i.quantity > 0).length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-800 opacity-50">
                <Package className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase">Inventory Empty</p>
              </div>
            ) : (
              gameState.inventory.filter(i => i.quantity > 0).map((item, index) => (
                <div key={`${item.id}-${index}`} className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                  <div className="flex justify-center mb-4 mt-[-1.5rem]">
                    <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      <h2 className="text-xs font-bold tracking-widest text-white uppercase italic">ITEM: <span className="text-blue-400">{item.name}</span></h2>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 border border-slate-500/50 flex items-center justify-center bg-black/40 relative">
                        <span className="text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{item.icon || '📦'}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center border-b border-white/10 pb-1">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Quantity:</p>
                          <p className="text-xs font-bold text-blue-400">x{item.quantity}</p>
                        </div>
                        <p className="text-[10px] text-slate-300 italic leading-tight">{item.description}</p>
                      </div>
                    </div>

                    {/* الأزرار الجديدة تحت كل عنصر */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => setAnalyzingItem(item)}
                        className="flex items-center justify-center gap-2 py-3 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-cyan-500/20 transition-all active:scale-95"
                      >
                        <Search className="w-3.5 h-3.5" /> Analysis
                      </button>
                      
                      <button
                        onClick={() => setUsingItem(item)}
                        className="flex items-center justify-center gap-2 py-3 bg-green-500/10 border border-green-500/40 text-green-400 text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-green-500/20 transition-all active:scale-95"
                      >
                        <PlayCircle className="w-3.5 h-3.5" /> Use Item
                      </button>
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
