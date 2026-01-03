import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, ShieldAlert, X, Zap, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');
  const [activeItem, setActiveItem] = useState(null);

  const SOLO_ITEMS = [
    { id: 'hp_potion', name: 'HP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', description: 'Restores 50% of the user\'s current health.', rankLevel: 0, isBasic: true },
    { id: 'mp_potion', name: 'MP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', description: 'Restores 50% of the user\'s current mana.', rankLevel: 0, isBasic: true },
    { id: 'hidden_1', name: 'Shadow Monarch Elixir', category: 'Ancient Grade', difficulty: 'S', price: 1500000, icon: '🧪', description: 'A legendary elixir hidden within the system archives.', rankLevel: 5, isBasic: false },
    { id: 'hidden_2', name: 'Demon King Blood', category: 'Divine Item', difficulty: 'SS', price: 5000000, icon: '🧪', description: 'Essence of a high-ranking demon king.', rankLevel: 8, isBasic: false },
    { id: 'hidden_3', name: 'Absolute Power Source', category: 'Origin', difficulty: 'EX', price: 99999999, icon: '🧪', description: 'The core of the system itself.', rankLevel: 10, isBasic: false },
  ];

  // دالة لتحديد لون العنصر بناءً على قوته
  const getRankColor = (difficulty) => {
    switch (difficulty) {
      case 'S': return 'text-yellow-400 border-yellow-500 shadow-yellow-500/20';
      case 'SS': return 'text-purple-400 border-purple-500 shadow-purple-500/20';
      case 'EX': return 'text-red-500 border-red-600 shadow-red-600/40 animate-pulse';
      default: return 'text-blue-400 border-blue-500 shadow-blue-500/20';
    }
  };

  const canSeeItem = (item) => {
    if (item.isBasic) return true;
    const playerRankLevel = Math.floor((gameState.level || 1) / 10); 
    return playerRankLevel >= item.rankLevel;
  };

  const handleOpenConfirm = (item) => {
    if (!canSeeItem(item)) {
      setActiveItem(item);
      setIsScanning(true);
      setScanResult('searching');
      setTimeout(() => setScanResult('failed'), 2000);
      return;
    }
    setActiveItem(item);
    setShowConfirm(true);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowConfirm(false);
      setIsClosing(false);
      setActiveItem(null);
      setScanResult('idle');
    }, 400);
  };

  const executePurchase = () => {
    if (gameState.gold >= activeItem.price) {
      purchaseItem(activeItem.id);
      playPurchase();
      toast({ title: 'System: SUCCESS', description: `Acquired ${activeItem.name}` });
      closeModal();
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

      {/* Confirmation & Scan Modals */}
      {(isScanning || showConfirm) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className={cn(
            "relative bg-[#050b18] border-2 p-6 max-w-sm w-full font-mono overflow-hidden",
            activeItem ? getRankColor(activeItem.difficulty) : "border-blue-500",
            isClosing ? "animate-[foldVertical_0.4s_ease-in_forwards]" : "animate-[unfoldVertical_0.4s_ease-out_forwards]"
          )}>
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />

            {showConfirm ? (
              <div className="space-y-6">
                <div className="text-center border-b border-white/10 pb-2">
                  <h2 className="text-lg font-bold tracking-widest uppercase italic">Confirm Purchase</h2>
                </div>

                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="w-24 h-24 border border-white/20 bg-white/5 flex items-center justify-center relative">
                    <span className="text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{activeItem.icon}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-tight">{activeItem.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 italic leading-relaxed">{activeItem.description}</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Price:</span>
                  <div className="flex items-center gap-1 text-yellow-400 font-bold">
                    <Coins className="w-3 h-3" />
                    <span>{activeItem.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={closeModal} className="py-2 border border-white/20 text-[10px] uppercase font-bold hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                  <button onClick={executePurchase} className="py-2 bg-blue-600 border border-blue-400 text-[10px] uppercase font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    <CheckCircle2 className="w-3 h-3" /> Confirm
                  </button>
                </div>
              </div>
            ) : (
              /* Scanning/Denied View (Original Style) */
              <div className="text-center space-y-4">
                 <h2 className="text-blue-400 text-lg font-bold tracking-[0.2em] uppercase italic">
                    {scanResult === 'searching' ? 'Analyzing Data...' : '[Access Denied]'}
                 </h2>
                 {scanResult === 'searching' ? (
                   <div className="py-10 flex flex-col items-center gap-4">
                     <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                     <p className="text-[10px] text-blue-200 animate-pulse tracking-[0.3em] uppercase">Bypassing Encryption...</p>
                   </div>
                 ) : (
                   <div className="py-2 flex flex-col items-center gap-6 w-full">
                      <div className="w-full border border-red-900/40 p-3 bg-red-950/10 text-left">
                        <p className="text-[10px] text-red-400 leading-relaxed font-bold uppercase">
                           Level Insufficient. Required: {activeItem.rankLevel * 10}
                        </p>
                      </div>
                      <button onClick={closeModal} className="w-full py-2 bg-blue-500/10 border border-blue-500/40 text-blue-300 text-[10px] font-bold uppercase tracking-widest">
                        <X className="w-3 h-3 inline-block mr-1" /> Terminate Connection
                      </button>
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
          System Store
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      {/* Main List */}
      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {SOLO_ITEMS.map((item) => {
          const isLocked = !canSeeItem(item);
          return (
            <div key={item.id} className="relative group">
              <div className={cn(
                "relative bg-black/60 border-2 p-4 shadow-lg transition-all active:scale-[0.98]",
                isLocked ? "border-slate-700 opacity-70" : getRankColor(item.difficulty)
              )}>
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90">
                    <h2 className="text-xs font-bold tracking-widest text-white uppercase">
                      ITEM: <span className="text-blue-100">{isLocked ? '???' : item.name}</span>
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 border border-slate-500/30 flex items-center justify-center bg-black/40 relative">
                      <span className={cn("text-3xl", isLocked && "filter blur-md grayscale")}>
                        {item.icon}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 font-mono">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1">
                        <span className="text-[8px] text-slate-500 uppercase">Rank</span>
                        <span className="text-xs font-bold italic">{isLocked ? '?' : item.difficulty}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-1">
                        <span className="text-[8px] text-slate-500 uppercase">Cost</span>
                        <span className="text-xs font-bold text-yellow-400">
                          {isLocked ? '???' : item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenConfirm(item)}
                    className={cn(
                      "w-full py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all border",
                      isLocked 
                        ? "bg-slate-900/50 border-slate-700 text-slate-500 cursor-not-allowed" 
                        : "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/30"
                    )}
                  >
                    {isLocked ? 'Access Locked' : 'Purchase Item'}
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
        @keyframes foldVertical {
          0% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Market;
