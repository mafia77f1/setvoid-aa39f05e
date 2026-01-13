import { useState, useMemo } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { RadarChart } from '@/components/RadarChart';
import { cn } from '@/lib/utils';
import { 
  Dumbbell, Brain, Heart, Zap, Target, Coins, Package, X, 
  ShieldAlert, Info, MapPin, Image as ImageIcon, ChevronUp, Minus, Plus
} from 'lucide-react';

const Stats = () => {
  const { gameState, getXpProgress, useItem } = useGameState();
  const [activeTab, setActiveTab] = useState<'stats' | 'equipment'>('stats');
  
  // States للتحليل والاستخدام
  const [activeItem, setActiveItem] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isUsing, setIsUsing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // States لنافذة الاستخدام (كمية وتوزيع XP)
  const [useAmount, setUseAmount] = useState(1);
  const [selectedStat, setSelectedStat] = useState<'strength' | 'mind' | 'spirit' | 'agility'>('strength');

  const MAX_LEVEL = 100;

  const statsConfig = [
    { id: 'strength', name: 'STRENGTH', icon: <Dumbbell className="w-4 h-4" />, color: '#60a5fa' },
    { id: 'mind', name: 'MIND', icon: <Brain className="w-4 h-4" />, color: '#60a5fa' },
    { id: 'spirit', name: 'SPIRIT', icon: <Heart className="w-4 h-4" />, color: '#60a5fa' },
    { id: 'agility', name: 'AGILITY', icon: <Zap className="w-4 h-4" />, color: '#60a5fa' },
  ];

  // دالة لفتح نافذة التحليل
  const openAnalysis = (item: any) => {
    setActiveItem(item);
    setIsScanning(true);
    setIsUsing(false);
    setTimeout(() => setIsVisible(true), 50);
  };

  // دالة لفتح نافذة الاستخدام
  const openUseMenu = (item: any) => {
    setActiveItem(item);
    setUseAmount(1);
    setIsUsing(true);
    setIsScanning(false);
    setTimeout(() => setIsVisible(true), 50);
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsScanning(false);
      setIsUsing(false);
      setActiveItem(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24">
      {/* Background FX (نفس التصميم الأصلي) */}
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

      <main className="relative z-10 max-w-md mx-auto space-y-6">
        {/* Tabs Switcher */}
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
          <div className="space-y-6 animate-in fade-in duration-500">
             {/* Player Level Card (نفس تصميمك) */}
             <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 text-center shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                <div className="text-4xl font-black italic text-white">LV. {gameState.totalLevel}</div>
                <div className="text-[10px] font-bold tracking-[0.4em] uppercase py-1 px-4 border-y border-white/20 mt-2 inline-block text-blue-400">S-RANK</div>
             </div>
             
             {/* Radar Chart */}
             <div className="bg-black/40 border border-blue-500/30 p-4 flex justify-center">
                <RadarChart 
                  stats={{
                    strength: (gameState.levels.strength / MAX_LEVEL) * 100,
                    mind: (gameState.levels.mind / MAX_LEVEL) * 100,
                    spirit: (gameState.levels.spirit / MAX_LEVEL) * 100,
                    agility: ((gameState.levels.agility || 0) / MAX_LEVEL) * 100,
                  }} 
                  size={240} 
                />
             </div>

             {/* Stats Bars */}
             <div className="space-y-3">
                {statsConfig.map((s) => (
                  <div key={s.id} className="bg-black/60 border border-slate-700/50 p-3">
                    <div className="flex justify-between items-end mb-1">
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">{s.icon} {s.name}</div>
                      <span className="text-lg font-black italic">{(gameState.levels as any)[s.id]}</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all" style={{ width: `${getXpProgress((gameState.stats as any)[s.id])}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {gameState.inventory.filter(i => i.quantity > 0).map((item) => (
              <div key={item.id} className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 border border-slate-500/50 flex items-center justify-center bg-black/40 text-3xl">
                    {item.icon || '📦'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-blue-400 italic uppercase">{item.name}</h3>
                    <p className="text-[10px] text-slate-400">QUANTITY: x{item.quantity}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => openAnalysis(item)}
                    className="py-2 bg-slate-800 border border-slate-600 text-[10px] font-bold uppercase tracking-widest"
                  >
                    Analysis
                  </button>
                  <button 
                    onClick={() => openUseMenu(item)}
                    className="py-2 bg-blue-600 border border-blue-400 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  >
                    Use Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- MODALS (التحليل والاستخدام) --- */}
      {(isScanning || isUsing) && activeItem && (
        <div className={cn(
          "fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-500",
          isVisible ? "bg-black/90 opacity-100" : "bg-transparent opacity-0 pointer-events-none"
        )}>
          <div className={cn(
            "relative bg-[#050b18] border-x border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-sm w-full font-mono overflow-y-auto max-h-[90vh] transition-all duration-500",
            isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-10"
          )}>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-blue-500/30 pb-2">
                <ShieldAlert className="w-5 h-5 text-blue-400" />
                <h2 className="text-blue-400 text-sm font-bold tracking-[0.2em] uppercase italic">
                  {isScanning ? "System Analysis" : "Item Consumption"}
                </h2>
                <X className="w-5 h-5 text-slate-500 cursor-pointer" onClick={closeModal} />
              </div>

              {/* المعلومات الأساسية */}
              <div className="bg-black/40 border border-slate-700/50 p-4 space-y-2">
                 <div className="flex justify-between text-[11px]">
                   <span className="text-slate-500">ITEM:</span>
                   <span className="text-white font-bold">{activeItem.name}</span>
                 </div>
                 <div className="flex justify-between text-[11px]">
                   <span className="text-slate-500">REMAINING:</span>
                   <span className="text-blue-400 font-bold">x{activeItem.quantity}</span>
                 </div>
              </div>

              {/* إذا كان "كتاب خبرة" أو نافذة استخدام */}
              {isUsing && (
                <div className="space-y-4">
                  {/* اختيار الفئة */}
                  <div className="grid grid-cols-2 gap-2">
                    {statsConfig.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStat(s.id as any)}
                        className={cn(
                          "p-2 border text-[9px] font-bold flex flex-col items-center gap-1 transition-all",
                          selectedStat === s.id ? "bg-blue-500/20 border-blue-400" : "bg-black border-slate-800 text-slate-500"
                        )}
                      >
                        {s.icon} {s.name}
                      </button>
                    ))}
                  </div>

                  {/* شريط التقدم الفعلي والمعاينة */}
                  <div className="bg-black/60 border border-blue-500/20 p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-blue-100 font-bold italic">TARGET PROGRESS</span>
                      <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold animate-pulse">
                        <ChevronUp className="w-3 h-3" />
                        +{(useAmount * 10).toLocaleString()} XP
                      </div>
                    </div>
                    
                    {/* عرض الـ XP للفئة المختارة */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] mb-1">
                         <span className="text-slate-400 uppercase">{selectedStat}</span>
                         <span className="text-white">LV. {(gameState.levels as any)[selectedStat]}</span>
                      </div>
                      <div className="h-2 bg-slate-900 border border-white/5 rounded-full overflow-hidden relative">
                        {/* الحالي */}
                        <div 
                          className="absolute h-full bg-blue-500/40 transition-all duration-500" 
                          style={{ width: `${getXpProgress((gameState.stats as any)[selectedStat])}%` }} 
                        />
                        {/* الزيادة المتوقعة (بشكل تقريبي للعرض) */}
                        <div 
                          className="absolute h-full bg-green-500 shadow-[0_0_10px_#22c55e] transition-all duration-300" 
                          style={{ 
                            left: `${getXpProgress((gameState.stats as any)[selectedStat])}%`,
                            width: `${Math.min(useAmount * 5, 100)}%` 
                          }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* التحكم بالكمية */}
                  <div className="flex items-center justify-between bg-white/5 p-2 border border-white/10">
                    <button 
                      onClick={() => setUseAmount(Math.max(1, useAmount - 1))}
                      className="p-2 hover:bg-white/10"><Minus className="w-4 h-4" /></button>
                    <div className="text-center">
                      <div className="text-[10px] text-slate-500">QUANTITY</div>
                      <div className="font-bold text-lg">{useAmount}</div>
                    </div>
                    <button 
                      onClick={() => setUseAmount(Math.min(activeItem.quantity, useAmount + 1))}
                      className="p-2 hover:bg-white/10"><Plus className="w-4 h-4" /></button>
                  </div>

                  <button 
                    onClick={() => { useItem(activeItem.id); closeModal(); }}
                    className="w-full py-4 bg-blue-600 text-white font-black text-[11px] tracking-[0.4em] uppercase shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  >
                    Confirm Consumption
                  </button>
                </div>
              )}

              {/* نافذة التحليل (نفس تصميمك السابق) */}
              {isScanning && (
                <div className="space-y-6">
                  <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3">
                    <div className="flex items-center gap-2 border-l-2 border-yellow-500 pl-2">
                      <MapPin className="w-3 h-3 text-yellow-500" />
                      <span className="text-[10px] font-bold tracking-widest uppercase italic text-yellow-100">Acquisition</span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic leading-relaxed">
                      This item is recognized by the System. Analysis indicates high-tier potential in increasing {selectedStat} properties.
                    </p>
                  </div>
                  
                  <div className="aspect-square bg-slate-900/80 border border-white/10 flex items-center justify-center text-6xl">
                    {activeItem.icon || '📦'}
                  </div>

                  <button 
                    onClick={closeModal}
                    className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase"
                  >
                    Close Analysis
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
