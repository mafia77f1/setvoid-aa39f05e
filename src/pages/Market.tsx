import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, AlertTriangle, ShieldAlert, X, Zap, Target, Flame } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // لحالة أنيميشن الإغلاق
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');
  const [activeItem, setActiveItem] = useState(null);

  const SOLO_ITEMS = [
    { id: 'hp_potion', name: 'HP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', description: 'Restores 50% of the user\'s current health.', rankLevel: 0, isBasic: true },
    { id: 'mp_potion', name: 'MP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', description: 'Restores 50% of the user\'s current mana.', rankLevel: 0, isBasic: true },
    { id: 'hidden_1', name: 'Shadow Monarch Elixir', category: 'Ancient Grade', difficulty: 'S', price: 1500000, icon: '🧪', description: 'A legendary elixir hidden within the system archives.', rankLevel: 5, isBasic: false },
    { id: 'hidden_2', name: 'Demon King Blood', category: 'Divine Item', difficulty: 'SS', price: 5000000, icon: '🧪', description: 'Essence of a high-ranking demon king.', rankLevel: 8, isBasic: false },
    { id: 'hidden_3', name: 'Absolute Power Source', category: 'Origin', difficulty: 'EX', price: 99999999, icon: '🧪', description: 'The core of the system itself.', rankLevel: 10, isBasic: false },
  ];

  const canSeeItem = (item) => {
    if (item.isBasic) return true;
    const playerRankLevel = Math.floor((gameState.level || 1) / 10); 
    return playerRankLevel >= item.rankLevel;
  };

  const startSystemScan = (item) => {
    setActiveItem(item);
    setIsScanning(true);
    setIsClosing(false);
    setScanResult('searching');
    setTimeout(() => {
      setScanResult('failed');
    }, 3000);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('idle');
      setActiveItem(null);
      setIsClosing(false);
    }, 4000); // مدة الأنيميشن ليكون مريحاً
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
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
          <div className={cn(
            "relative bg-[#050b18] border-2 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)] p-6 max-w-sm w-full font-mono overflow-hidden",
            isClosing ? "animate-[foldVertical_0.5s_ease-in_forwards]" : "animate-[unfoldVertical_0.4s_ease-out_forwards]"
          )}>
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
            
            <div className="text-center space-y-4">
              <h2 className="text-blue-400 text-lg font-bold tracking-[0.2em] uppercase italic border-b border-blue-500/20 pb-2">
                {scanResult === 'searching' ? 'Analyzing Data...' : '[Access Denied]'}
              </h2>
              
              {scanResult === 'searching' ? (
                <div className="py-10 flex flex-col items-center gap-4">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                  <p className="text-[10px] text-blue-200 animate-pulse tracking-[0.3em] uppercase italic">Decrypting...</p>
                </div>
              ) : (
                <div className="py-2 flex flex-col gap-4 animate-in fade-in duration-500 w-full">
                  {(() => {
                    const playerLevel = gameState.level || 1;
                    const requiredLevel = (activeItem?.rankLevel || 0) * 10;
                    const levelDiff = requiredLevel - playerLevel;
                    
                    // حساب القوة بناءً على الصعوبة
                    const powerMap = { 'S': 85, 'SS': 95, 'EX': 100 };
                    const currentPower = powerMap[activeItem?.difficulty] || 70;

                    return (
                      <div className="w-full space-y-4">
                        <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative">
                          <div className="mb-3 border-b border-blue-500/30 pb-2">
                            <span className="text-[9px] text-blue-400 block mb-1 uppercase italic">Identity Found:</span>
                            <span className="text-sm font-bold text-white tracking-wider uppercase italic">
                              {levelDiff <= 5 ? activeItem?.name : "REDACTED_DATA"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[9px] text-blue-400 block mb-1">RANK:</span>
                              <span className="text-xs font-bold text-red-400">{activeItem?.difficulty}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-blue-400 block mb-1">TYPE:</span>
                              <span className="text-xs font-bold text-white italic">Classified</span>
                            </div>
                          </div>
                        </div>

                        {/* Structural Analysis - Dynamic Power */}
                        <div className="w-full border border-red-500/40 p-3 bg-red-950/10 space-y-3">
                           <div className="flex items-center gap-2">
                              <Flame className="w-3 h-3 text-red-500 animate-pulse" />
                              <span className="text-[10px] font-bold text-red-500 uppercase">Structural Analysis</span>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="w-16 h-16 border border-red-500/20 bg-black flex items-center justify-center relative overflow-hidden">
                                 <span className="text-3xl filter blur-[4px] opacity-30">{activeItem?.icon}</span>
                                 <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent animate-pulse" />
                              </div>
                              <div className="flex-1 space-y-1">
                                 <div className="flex justify-between text-[8px] text-slate-400 uppercase">
                                    <span>Mana Density:</span>
                                    <span className="text-red-400 font-bold">{currentPower}%</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                    <div 
                                      className="h-full bg-red-600 transition-all duration-1000 shadow-[0_0_10px_red]" 
                                      style={{ width: `${currentPower}%` }} 
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>

                        <button 
                          onClick={handleClose}
                          className="w-full py-2 bg-blue-600/10 border border-blue-500/40 text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-blue-500/20 transition-all"
                        >
                          <X className="w-3 h-3 inline mr-2" /> Terminate Log
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

      {/* Main Store Content */}
      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">System Store</h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-12 pb-20">
        {SOLO_ITEMS.map((item) => {
          const isLocked = !canSeeItem(item);
          return (
            <div key={item.id} className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
               <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    <h2 className="text-xs font-bold tracking-widest text-white uppercase italic">
                      ITEM: <span className="text-blue-100">{isLocked ? '???' : item.name}</span>
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40">
                      <span className="text-4xl filter grayscale brightness-200 opacity-90">{item.icon}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Diff:</p>
                        <p className="text-xs font-bold text-white italic">{isLocked ? '?' : item.difficulty}</p>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Cat:</p>
                        <p className="text-xs font-bold text-white italic">{isLocked ? '???' : item.category}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePurchase(item)}
                    className={cn(
                      "w-full py-2 text-[10px] font-bold tracking-[0.2em] uppercase border transition-all",
                      isLocked ? "bg-slate-900/50 border-slate-700 text-slate-500" : "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20"
                    )}
                  >
                    {isLocked ? 'not found' : 'Purchase Item'}
                  </button>
                </div>
            </div>
          );
        })}
      </main>

      <BottomNav />

      <style jsx>{`
        @keyframes unfoldVertical {
          0% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
        @keyframes foldVertical {
          0% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Market;
