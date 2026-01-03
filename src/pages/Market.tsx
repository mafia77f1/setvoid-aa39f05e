import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, AlertTriangle, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed' | 'partial' | 'success'>('idle');
  const [activeItem, setActiveItem] = useState<any>(null);

  const SOLO_ITEMS = [
    { id: 'hp_potion', name: 'HP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', description: 'Restores 50% of the user\'s current health.', rankLevel: 0, isBasic: true },
    { id: 'mp_potion', name: 'MP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', description: 'Restores 50% of the user\'s current mana.', rankLevel: 0, isBasic: true },
    { id: 'hidden_1', name: 'Life Elixir', category: 'Divine', difficulty: 'S', price: 1500000, icon: '🧪', description: 'A legendary potion that grants temporary immortality.', rankLevel: 5, isBasic: false },
    { id: 'hidden_2', name: 'Demon Blood', category: 'Cursed', difficulty: 'SS', price: 5000000, icon: '🧪', description: 'Massive strength boost with high risk.', rankLevel: 8, isBasic: false },
    { id: 'hidden_3', name: 'God Slayer Essence', category: 'Mythic', difficulty: 'EX', price: 99999999, icon: '🧪', description: 'Transcends human limits.', rankLevel: 10, isBasic: false },
  ];

  const canSeeItem = (item) => {
    if (item.isBasic) return true;
    const playerRankLevel = Math.floor((gameState.level || 1) / 10); 
    return playerRankLevel >= item.rankLevel;
  };

  // دالة تحليل النصوص بناءً على الفرق في المستوى
  const revealText = (fullText, itemRank) => {
    const playerRank = Math.floor((gameState.level || 1) / 10);
    const diff = itemRank - playerRank;
    
    if (diff <= 1) return fullText; // قريب جداً: يظهر بالكامل
    if (diff <= 3) return fullText.substring(0, 3) + "..."; // قريب نوعاً ما: تظهر أول أحرف
    return "???"; // بعيد جداً
  };

  const startSystemScan = (item) => {
    setActiveItem(item);
    setIsScanning(true);
    setScanResult('searching');

    const playerRank = Math.floor((gameState.level || 1) / 10);
    const diff = item.rankLevel - playerRank;

    setTimeout(() => {
      if (diff > 5) {
        setScanResult('failed');
      } else if (diff > 2) {
        setScanResult('partial');
      } else {
        setScanResult('success');
      }
      
      setTimeout(() => {
        if (diff > 5) { // إذا كان الفرق هائل، نغلق النافذة تلقائياً بعد الفشل
           setIsScanning(false);
           setScanResult('idle');
        }
      }, 4000);
    }, 2500);
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
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      {/* System Modal Improved */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative bg-[#050b18] border-2 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.4)] p-1 max-w-sm w-full font-mono animate-[unfoldVertical_0.3s_ease-out]">
            
            {/* Scan Header */}
            <div className="bg-blue-600 px-4 py-1 text-[10px] font-bold flex justify-between items-center">
              <span>SYSTEM ANALYSIS</span>
              <button onClick={() => setIsScanning(false)} className="hover:text-red-200">X</button>
            </div>

            <div className="p-6">
              {scanResult === 'searching' ? (
                <div className="py-12 flex flex-col items-center gap-6">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-300 animate-pulse" />
                  </div>
                  <p className="text-sm text-blue-200 animate-pulse tracking-widest uppercase">Analyzing Mana Frequency...</p>
                </div>
              ) : scanResult === 'failed' ? (
                <div className="py-8 flex flex-col items-center gap-4 text-center">
                  <AlertTriangle className="w-16 h-16 text-red-600 animate-bounce" />
                  <h3 className="text-red-500 font-bold text-xl uppercase">Access Denied</h3>
                  <p className="text-xs text-slate-400">Your level is too low to even perceive this item's existence.</p>
                </div>
              ) : (
                /* Card Style Result */
                <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                  <div className="border border-blue-500/50 p-4 bg-blue-950/20">
                    <div className="text-center mb-4">
                        <span className="text-[10px] text-blue-400 block mb-1 uppercase">Item Identified</span>
                        <h2 className="text-lg font-bold text-white border-y border-blue-500/30 py-1">
                          {revealText(activeItem.name, activeItem.rankLevel)}
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-900/30 p-2 border border-blue-800">
                            <p className="text-[9px] text-blue-400 uppercase">Difficulty</p>
                            <p className="font-bold text-blue-100">{revealText(activeItem.difficulty, activeItem.rankLevel)}</p>
                        </div>
                        <div className="bg-blue-900/30 p-2 border border-blue-800">
                            <p className="text-[9px] text-blue-400 uppercase">Category</p>
                            <p className="font-bold text-blue-100">{revealText(activeItem.category, activeItem.rankLevel)}</p>
                        </div>
                    </div>

                    <div className="mt-4 text-[10px] text-center text-slate-400 italic">
                        {scanResult === 'partial' 
                          ? "[Warning: Data corrupted due to low resonance level]" 
                          : "[Analysis Complete: All data retrieved]"}
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsScanning(false)}
                    className="w-full py-2 bg-blue-600 text-white text-xs font-bold uppercase hover:bg-blue-700 transition-colors"
                  >
                    Close System
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header & Main List (Same as your original code) */}
      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
          System Store
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">
            {gameState.gold.toLocaleString()}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {SOLO_ITEMS.map((item) => {
          const isLocked = !canSeeItem(item);
          return (
            <div key={item.id} className="relative group">
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 transition-all active:scale-[0.98]">
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
                      <span className={cn("text-4xl filter grayscale brightness-200 opacity-90", isLocked && "blur-sm")}>
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Diff:</p>
                        <p className="text-xs font-bold text-white uppercase">{isLocked ? '?' : item.difficulty}</p>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Cat:</p>
                        <p className="text-xs font-bold text-white uppercase">{isLocked ? '???' : item.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 border-t border-slate-700/50 text-center">
                    <p className="text-lg font-bold text-blue-50 font-mono tracking-tighter">
                      Gold: {isLocked ? '???,???' : item.price.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    className={cn(
                      "w-full mt-2 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all border",
                      isLocked 
                        ? "bg-red-900/10 border-red-900/40 text-red-500 animate-pulse" 
                        : "bg-blue-500/10 border-blue-500/40 text-blue-300"
                    )}
                  >
                    {isLocked ? 'not found (Scan)' : 'Purchase Item'}
                  </button>
                </div>
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
      `}</style>
    </div>
  );
};

export default Market;
