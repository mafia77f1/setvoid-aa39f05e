import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, ShieldAlert, X, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // حالة الخروج الجديدة
  const [isVisible, setIsVisible] = useState(false); // حالة الظهور التدريجي
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');
  const [activeItem, setActiveItem] = useState(null);

  const RARITY_CONFIG = {
    S: { border: 'border-gray-900', text: 'text-gray-400', locked: true },
    A: { border: 'border-purple-500', text: 'text-purple-400', locked: true },
    B: { border: 'border-blue-500', text: 'text-blue-400', locked: false },
    C: { border: 'border-white/50', text: 'text-white', locked: false },
    E: { border: 'border-gray-600', text: 'text-gray-400', locked: false },
  };

  const SOLO_ITEMS = [
    { id: 'hp_potion', name: 'Blood Elixir', arabicName: 'إكسير الدم', category: 'Elixir', difficulty: 'E', price: 500, icon: '🧪', description: 'يستعيد 50% من الصحة القصوى', rankLevel: 0, isBasic: true },
    { id: 'mp_potion', name: 'Energy Elixir', arabicName: 'إكسير الطاقة', category: 'Elixir', difficulty: 'E', price: 500, icon: '⚡', description: 'يستعيد 50% من الطاقة القصوى', rankLevel: 0, isBasic: true },
    { id: 'mana_meter', name: 'Mana Gauge', arabicName: 'مقياس المانا', category: 'Tool', difficulty: 'C', price: 2000, icon: '📊', description: 'جهاز قياس طاقة البوابات والعناصر', rankLevel: 0, isBasic: true },
    { id: 'awakened_title', name: 'Awakened One', arabicName: 'المستيقظ الواعي', category: 'Title', difficulty: 'C', price: 3000, icon: '👑', description: 'لقب يُظهر أنك من المستيقظين - يزيد XP بنسبة 5%', rankLevel: 0, isBasic: true },
    { id: 'power_eye_title', name: 'Eye of Power', arabicName: 'عين القوة', category: 'Title', difficulty: 'B', price: 10000, icon: '👁️', description: 'لقب نادر يكشف قوة الأعداء ويظهر إحصائياتهم', rankLevel: 2, isBasic: false },
    { id: 'storm_hand_title', name: 'Hand of Storm', arabicName: 'يد العاصفة', category: 'Title', difficulty: 'B', price: 15000, icon: '🌩️', description: 'لقب نادر يزيد ضرر الهجمات بنسبة 10%', rankLevel: 2, isBasic: false },
    { id: 'return_key', name: 'Return Key', arabicName: 'مفتاح العودة', category: 'Key', difficulty: 'B', price: 8000, icon: '🔑', description: 'يتيح الخروج من البوابة دون إكمالها بشكل آمن', rankLevel: 2, isBasic: false },
    { id: 'shadow_elixir', name: 'Shadow Monarch Elixir', arabicName: 'إكسير ملك الظلال', category: 'Ancient Grade', difficulty: 'A', price: 150000, icon: '🧪', description: 'إكسير أسطوري مخفي في أرشيف النظام', rankLevel: 5, isBasic: false },
    { id: 'demon_blood', name: 'Demon King Blood', arabicName: 'دم ملك الشياطين', category: 'Divine Item', difficulty: 'S', price: 5000000, icon: '💀', description: 'جوهر ملك شيطاني رفيع المستوى', rankLevel: 8, isBasic: false },
  ];

  const canSeeItem = (item) => {
    if (item.isBasic) return true;
    const playerRankLevel = Math.floor((gameState.totalLevel || 1) / 10); 
    return playerRankLevel >= item.rankLevel;
  };

  const startSystemScan = (item) => {
    setActiveItem(item);
    setIsScanning(true);
    setIsExiting(false);
    setScanResult('searching');
    
    // أنيميشن الظهور
    setTimeout(() => setIsVisible(true), 50);

    setTimeout(() => {
      setScanResult('failed');
    }, 3000);
  };

  const closeScanModal = () => {
    setIsExiting(true);
    // الانتظار حتى انتهاء أنيميشن الخروج (800ms كما في الكود المرجعي)
    setTimeout(() => {
      setIsScanning(false);
      setIsExiting(false);
      setIsVisible(false);
      setScanResult('idle');
      setActiveItem(null);
    }, 800);
  };

  const handlePurchase = (item) => {
    const isLocked = !canSeeItem(item);
    if (isLocked) {
      startSystemScan(item);
      return;
    }
    if (gameState.gold >= item.price) {
      purchaseItem(item.id);
      playPurchase();
      toast({ title: 'System: SUCCESS', description: `Acquired ${item.name}` });
    } else {
      toast({ title: 'System: WARNING', description: 'Insufficient Gold', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24 selection:bg-blue-500/30">
      {/* Background Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      {/* System Modal (Scanner) with New Animation Logic */}
      {isScanning && (
        <div className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]",
          isVisible && !isExiting ? "bg-black/90" : "bg-black/0 pointer-events-none"
        )}>
          <div className={cn(
            "relative bg-[#050b18] border-x-2 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.4)] max-w-sm w-full font-mono overflow-hidden transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
            isVisible && !isExiting 
              ? "opacity-100 scale-y-100 duration-[1000ms]" 
              : "opacity-0 scale-y-0 duration-[800ms]"
          )}>
            
            {/* Glow Lines (Top/Bottom) */}
            <div className={cn(
              "absolute top-0 left-0 right-0 h-[2px] bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)] transition-all duration-[1000ms] delay-300",
              isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            )} />
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-[2px] bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)] transition-all duration-[1000ms] delay-300",
              isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            )} />

            <div className={cn(
              "p-6 text-center space-y-4 transition-all duration-700 delay-500",
              isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <h2 className="text-blue-400 text-lg font-bold tracking-[0.2em] uppercase italic">
                {scanResult === 'searching' ? 'Analyzing Data...' : '[Access Denied]'}
              </h2>
              
              {scanResult === 'searching' ? (
                <div className="py-10 flex flex-col items-center gap-4">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                  <p className="text-[10px] text-blue-200 animate-pulse tracking-[0.3em] uppercase">Bypassing Encryption...</p>
                </div>
              ) : (
                <div className="py-2 flex flex-col items-start gap-4 w-full">
                  {(() => {
                    const playerLevel = gameState.totalLevel || 1;
                    const requiredLevel = (activeItem?.rankLevel || 0) * 10;
                    const levelDiff = requiredLevel - playerLevel;
                    const revealText = (text, diff) => {
                      if (diff <= 5) return text;
                      if (diff <= 15) return text.substring(0, 3) + ".".repeat(text.length - 3);
                      return "UNKNOWN DATA";
                    };
                    const powerLevels = { 'S': '80%', 'A': '70%', 'B': '50%', 'C': '30%' };
                    const itemPower = powerLevels[activeItem?.difficulty] || '20%';

                    return (
                      <div className="w-full space-y-4 text-left">
                        <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative">
                          <div className="absolute top-0 right-0 p-1"><ShieldAlert className="w-4 h-4 text-red-500/50" /></div>
                          <div className="mb-3 border-b border-blue-500/30 pb-2">
                            <span className="text-[9px] text-blue-400 block mb-1">DATA_STREAM_NAME:</span>
                            <span className="text-sm font-bold text-white tracking-wider">{revealText(activeItem?.name || "???", levelDiff)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-[9px] text-blue-400 block mb-1">DIFFICULTY:</span><span className="text-xs font-bold text-red-400">{levelDiff <= 15 ? activeItem?.difficulty : '??'}</span></div>
                            <div><span className="text-[9px] text-blue-400 block mb-1">CATEGORY:</span><span className="text-xs font-bold text-white uppercase">{revealText(activeItem?.category || "???", levelDiff)}</span></div>
                          </div>
                        </div>
                        <div className="text-left bg-red-950/20 border border-red-900/50 p-3">
                          <p className="text-[10px] text-red-400 leading-relaxed font-bold uppercase tracking-tighter">
                            Warning: Player level [{playerLevel}] is insufficient. Min required: {requiredLevel}.
                          </p>
                        </div>
                        <button onClick={closeScanModal} className="w-full py-3 bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-500/20 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                          <X className="w-3 h-3 inline-block mr-2" /> Terminate Connection
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">System Store</h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {SOLO_ITEMS.map((item) => {
          const isLocked = !canSeeItem(item);
          const rarityKey = item.difficulty;
          const rarity = RARITY_CONFIG[rarityKey] || RARITY_CONFIG.E;
          
          return (
            <div key={item.id} className="relative group">
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)] transition-all active:scale-[0.98]">
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    <h2 className="text-xs font-bold tracking-widest text-white uppercase">
                      ITEM: <span className="text-blue-100">{isLocked ? '???' : (item.arabicName || item.name)}</span>
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0">
                      <span className={cn("text-4xl", isLocked ? "filter grayscale brightness-50" : "filter grayscale brightness-200 opacity-90")}>
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Rank:</p>
                        <p className="text-xs font-bold text-white italic uppercase">{isLocked ? '?' : item.difficulty}</p>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Type:</p>
                        <p className="text-xs font-bold text-white italic uppercase">{isLocked ? '???' : item.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 border-t border-slate-700/50 text-center">
                    <p className="text-lg font-bold text-blue-50 font-mono tracking-tighter">Gold: {isLocked ? '???,???' : item.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={rarity.locked}
                    className={cn(
                      "w-full mt-2 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all border",
                      rarity.locked ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed" :
                      isLocked ? "bg-slate-900/50 border-slate-700 text-slate-500" :
                      gameState.gold >= item.price ? "bg-blue-500/10 border-blue-500/40 text-blue-300" : "bg-red-900/20 border-red-500/30 text-red-400"
                    )}
                  >
                    {rarity.locked ? 'Locked in Alpha' : isLocked ? 'Not Found' : 'Purchase Item'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </main>
      <BottomNav />
    </div>
  );
};

export default Market;
