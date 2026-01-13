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
  ShieldAlert,
  Info,
  MapPin,
  Image as ImageIcon,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Stats = () => {
  const { gameState, getXpProgress, useItem, equipTitle, unequipTitle } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');

  const [activeItem, setActiveItem] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isUsing, setIsUsing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // States للتفاعل مع العناصر
  const [itemQty, setItemQty] = useState(1);
  const [selectedStat, setSelectedStat] = useState('strength');

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

  // دالة التحليل واستهلاك المانا
  const openAnalysis = (item: any) => {
    const manaItem = gameState.inventory.find(i => (i.id === 'mana_meter' || i.name === 'Mana Gauge') && i.quantity > 0);
    if (!manaItem) {
      toast({ title: "System Error", description: "Mana Gauge is required for analysis.", variant: "destructive" });
      return;
    }
    useItem(manaItem.id); // يختفي الجهاز بعد الاستخدام
    setActiveItem(item);
    setIsScanning(true);
    setIsUsing(false);
    setIsExiting(false);
    setTimeout(() => setIsVisible(true), 50);
  };

  const closeModals = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsUsing(false);
      setIsExiting(false);
      setIsVisible(false);
      setActiveItem(null);
      setItemQty(1);
    }, 800);
  };

  const totalLevel = gameState.totalLevel;
  const levelConfig = totalLevel >= 40 ? { color: '#c084fc', tier: 'S-RANK' } : totalLevel >= 20 ? { color: '#60a5fa', tier: 'B-RANK' } : { color: '#ffffff', tier: 'E-RANK' };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      {/* Background Overlay */}
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

      {/* DYNAMIC USAGE & ANALYSIS MODAL */}
      {(isScanning || isUsing) && activeItem && (
        <div className={cn(
          "fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-[1000ms]",
          isVisible && !isExiting ? "bg-black/95" : "bg-black/0 pointer-events-none"
        )}>
          <div className={cn(
            "relative bg-[#050b18] border-x border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-sm w-full font-mono overflow-y-auto max-h-[90vh] transition-all origin-center",
            isVisible && !isExiting ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
          )}>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-blue-500/30 pb-2">
                <ShieldAlert className="w-5 h-5 text-blue-400" />
                <h2 className="text-blue-400 text-sm font-bold uppercase italic">{isUsing ? 'Item usage' : 'Analysis Results'}</h2>
                <X className="w-5 h-5 text-slate-500 cursor-pointer" onClick={closeModals} />
              </div>

              {/* المعلومات الأساسية */}
              <div className="bg-black/40 border border-slate-700/50 p-4 space-y-2">
                <div className="flex justify-between text-[11px]"><span className="text-slate-500 uppercase">Item:</span> <span className="text-white font-bold">{activeItem.name}</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-slate-500 uppercase">Class:</span> <span className="text-blue-400 uppercase">{activeItem.type}</span></div>
                <p className="text-[10px] text-slate-300 italic pt-2 border-t border-white/5">{activeItem.description}</p>
              </div>

              {/* لوحة كتب الخبرة / استعادة الطاقة */}
              {isUsing && (activeItem.type === 'experience' || activeItem.category === 'consumable') && (
                <div className="bg-black/40 border border-slate-700/50 p-4 space-y-4 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]">
                  <div className="space-y-2">
                    <p className="text-[9px] text-blue-400 uppercase font-bold tracking-widest text-center">Set Amount to Consume</p>
                    <div className="flex items-center gap-4 bg-blue-950/20 p-2 border border-blue-500/20">
                      <input 
                        type="range" min="1" max={activeItem.quantity} value={itemQty} 
                        onChange={(e) => setItemQty(parseInt(e.target.value))}
                        className="flex-1 accent-blue-500"
                      />
                      <span className="text-xs font-bold text-white">x{itemQty}</span>
                    </div>
                  </div>

                  {/* في حالة كتاب الخبرة: اختيار الفئة والزيادة المتوقعة */}
                  {activeItem.type === 'experience' && (
                    <div className="space-y-3">
                      <p className="text-[9px] text-slate-500 uppercase font-bold text-center">Select Targeted Attribute</p>
                      <div className="grid grid-cols-2 gap-2">
                        {stats.map(s => (
                          <button key={s.category} onClick={() => setSelectedStat(s.category)}
                            className={cn("p-2 border text-[9px] uppercase font-bold transition-all", 
                            selectedStat === s.category ? "bg-blue-600 border-white text-white" : "bg-slate-900/50 border-slate-800 text-slate-500")}>
                            {s.name} <span className="text-green-400 ml-1">▲+{itemQty * 5}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* في حالة استعادة الصحة أو المانا */}
                  {activeItem.category === 'consumable' && (
                    <div className="space-y-2">
                       <div className="flex justify-between text-[9px] uppercase font-bold"><span className="text-green-400">Recovery Preview</span> <Activity className="w-3 h-3" /></div>
                       <div className="h-1.5 bg-slate-900 border border-white/5 relative">
                          <div className="h-full bg-green-500/50 animate-pulse" style={{ width: `${Math.min(100, itemQty * 10)}%` }} />
                       </div>
                    </div>
                  )}
                </div>
              )}

              {/* لوحة الصور والتحليل */}
              {!isUsing && (
                 <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3">
                    <div className="flex items-center gap-2 border-l-2 border-yellow-500 pl-2">
                       <MapPin className="w-3 h-3 text-yellow-500" /><span className="text-[9px] font-bold text-yellow-100 uppercase">Locations</span>
                    </div>
                    <p className="text-[10px] italic text-slate-400 pl-5">• Available via Store Marketplace</p>
                    <p className="text-[10px] italic text-slate-400 pl-5">• Rare Dungeon Gate Drop</p>
                 </div>
              )}

              <div className="aspect-square bg-slate-900/80 border border-white/10 flex items-center justify-center relative group">
                {activeItem.id === 'mana_meter' || activeItem.name === 'Mana Gauge' ? (
                  <img src="/ManaDeviceIcon.png" className="w-[150%] h-[150%] scale-110 object-contain drop-shadow-[0_0_15px_#3b82f6]" />
                ) : (
                  <span className="text-7xl filter grayscale brightness-150">{activeItem.icon || '📦'}</span>
                )}
              </div>

              <button 
                onClick={() => { useItem(activeItem.id); closeModals(); }}
                className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase hover:bg-slate-200 transition-all"
              >
                Execute Action
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-md mx-auto space-y-6">
        <div className="flex gap-2 mb-6 font-bold">
          {['stats', 'equipment'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} 
              className={cn("flex-1 py-2 border text-[10px] uppercase transition-all", activeTab === tab ? "bg-blue-500/20 border-blue-400 text-blue-100" : "bg-black/40 border-slate-700 text-slate-500")}>
              {tab === 'stats' ? 'Abilities' : 'Inventory'}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 text-center">
              <div className="text-4xl font-black italic">LV. {totalLevel}</div>
              <div className="text-[10px] font-bold tracking-[0.4em] uppercase py-1 px-4 border-y border-white/20 mt-2 inline-block" style={{ color: levelConfig.color }}>{levelConfig.tier}</div>
            </div>
            <div className="bg-black/40 border border-blue-500/30 p-4 flex justify-center"><RadarChart stats={radarStats} size={240} /></div>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.category} className="bg-black/60 border border-slate-700/50 p-3">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase">{stat.name}</span>
                    <span className="text-lg font-black italic">{stat.level}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${stat.xpProgress}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {gameState.inventory.filter(i => i.quantity > 0).map((item, index) => (
                <div key={`${item.id}-${index}`} className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                  
                  {/* أيقونة ❓ فضية بدون خلفية في الأعلى يسار */}
                  <button 
                    onClick={() => openAnalysis(item)}
                    className="absolute top-2 left-2 z-20 text-slate-400 hover:text-white transition-colors p-1"
                  >
                    <span className="text-2xl font-black drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">❓</span>
                  </button>

                  <div className="flex justify-center mb-4 mt-[-1.5rem]">
                    <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90"><h2 className="text-xs font-bold text-white uppercase italic">ITEM: <span className="text-blue-400">{item.name}</span></h2></div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 border border-slate-500/50 flex items-center justify-center bg-black/40 overflow-hidden relative">
                        {item.id === 'mana_meter' || item.name === 'Mana Gauge' ? (
                          <img src="/ManaDeviceIcon.png" className="w-[150%] h-[150%] scale-125 object-contain filter brightness-110" />
                        ) : (
                          <span className="text-4xl grayscale brightness-150">{item.icon || '📦'}</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2 text-[10px]">
                        <div className="flex justify-between border-b border-white/10 pb-1"><span className="text-slate-500 uppercase">Category:</span> <span className="text-white font-bold">{item.type}</span></div>
                        <div className="flex justify-between border-b border-white/10 pb-1"><span className="text-slate-500 uppercase">Quantity:</span> <span className="text-blue-400 font-bold">x{item.quantity}</span></div>
                      </div>
                    </div>
                    <div className="bg-blue-950/20 border border-blue-500/20 p-2 min-h-[40px]"><p className="text-[10px] text-slate-300 italic text-center leading-tight">{item.description}</p></div>
                    
                    {/* زر الاستخدام المطور */}
                    <button
                      onClick={() => {
                        setActiveItem(item);
                        setIsUsing(true);
                        setIsScanning(false);
                        setIsExiting(false);
                        setTimeout(() => setIsVisible(true), 50);
                      }}
                      className="w-full mt-2 py-3 bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em] active:scale-[0.95]"
                    >
                      Use Item
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Stats;
