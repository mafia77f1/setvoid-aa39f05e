import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  // حالة التحكم في ظهور رسائل النظام
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [errorItem, setErrorItem] = useState<boolean>(false);

  const BASIC_ITEMS = [
    { 
      id: 'b1', 
      name: 'HP Potion (50%)', 
      category: 'Consumable', 
      difficulty: 'E', 
      price: 1000, 
      icon: '🧪',
      description: 'Restores 50% of your maximum Health Points.',
      isLocked: false 
    },
    { 
      id: 'b2', 
      name: 'MP Potion (50%)', 
      category: 'Consumable', 
      difficulty: 'E', 
      price: 1000, 
      icon: '💎',
      description: 'Restores 50% of your maximum Mana Points.',
      isLocked: false 
    }
  ];

  const LOCKED_ITEMS = Array.from({ length: 5 }).map((_, i) => ({
    id: `locked-${i}`,
    name: 'NOT FOUND',
    category: '?',
    difficulty: '?',
    price: 0,
    icon: '?',
    description: '????????????????????????????????',
    isLocked: true
  }));

  const ALL_ITEMS = [...BASIC_ITEMS, ...LOCKED_ITEMS];

  const handleLockedClick = (id: string) => {
    setScanningId(id);
    setErrorItem(false);

    // محاكاة عملية البحث في النظام لمدة 5 ثوانٍ
    setTimeout(() => {
      setErrorItem(true);
    }, 5000);
  };

  const handlePurchase = (itemId: string, price: number, name: string) => {
    if (gameState.gold >= price) {
      purchaseItem(itemId);
      playPurchase();
      toast({
        title: 'System: SUCCESS',
        description: `Acquired ${name}`,
      });
    } else {
      toast({
        title: 'System: WARNING',
        description: 'Insufficient Gold',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      {/* خلفية تقنية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
          System Store
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] text-sm">
            {gameState.gold.toLocaleString()}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {ALL_ITEMS.map((item) => (
          <div key={item.id} className="relative group">
            <div className="absolute -inset-0.5 bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
              <div className="flex justify-center mb-4 mt-[-1.5rem]">
                <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  <h2 className="text-xs font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase">
                    ITEM: <span className="text-blue-100">{item.name}</span>
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0">
                    <span className="text-4xl filter grayscale brightness-200 opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                      {item.icon}
                    </span>
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center border-b border-white/10 pb-1">
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Diff:</p>
                      <p className="text-xs font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic uppercase">{item.difficulty}</p>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-1">
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Cat:</p>
                      <p className="text-xs font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic uppercase">{item.category}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2 border-t border-slate-700/50">
                  <p className="text-lg font-bold text-center text-blue-50 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    {item.isLocked ? 'Gold: ???' : `Gold: ${item.price.toLocaleString()}`}
                  </p>
                </div>

                <div className="text-center px-1">
                  <p className="text-[10px] text-slate-300 italic leading-tight">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => item.isLocked ? handleLockedClick(item.id) : handlePurchase(item.id, item.price, item.name)}
                  className="w-full mt-2 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-bold tracking-[0.2em] uppercase transition-all active:scale-[0.98] drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]"
                >
                  {item.isLocked ? 'Access Denied' : 'Purchase Item'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Overlay System Message (البحث والخطأ) */}
      {scanningId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-black border-2 border-blue-500 p-6 shadow-[0_0_30px_rgba(59,130,246,0.5)] animate-in zoom-in-95 duration-300">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-1 text-[10px] font-bold tracking-widest uppercase">
              System Notification
            </div>
            
            {!errorItem ? (
              <div className="flex flex-col items-center gap-6 py-4">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                <div className="text-center space-y-2">
                  <p className="text-blue-400 font-mono text-sm animate-pulse">SCANNING DATABASE...</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Attempting to decode hidden item data</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AlertTriangle className="w-12 h-12 text-red-500" />
                <div className="text-center space-y-3">
                  <p className="text-red-500 font-bold text-lg tracking-widest uppercase italic">ACCESS DENIED</p>
                  <div className="h-px w-full bg-red-900/50" />
                  <p className="text-xs text-white leading-relaxed italic">
                    "Searching failed. The current user's mana capacity is too low to reveal this tier of items."
                  </p>
                </div>
                <button 
                  onClick={() => { setScanningId(null); setErrorItem(false); }}
                  className="mt-4 px-8 py-2 border border-red-500/50 bg-red-500/10 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-colors"
                >
                  CLOSE
                </button>
              </div>
            )}
            
            {/* زخارف الزوايا */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Market;
