import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');

  const SOLO_ITEMS = [
    { 
      id: 'hp_potion', 
      name: 'HP Potion 50%', 
      category: 'General', 
      difficulty: 'E', 
      price: 1000, 
      icon: '🧪', 
      description: 'Restores 50% of the user\'s maximum HP.',
      rankLevel: 0,
      isBasic: true 
    },
    { 
      id: 'mp_potion', 
      name: 'MP Potion 50%', 
      category: 'General', 
      difficulty: 'E', 
      price: 1000, 
      icon: '🧪', 
      description: 'Restores 50% of the user\'s maximum MP.',
      rankLevel: 0,
      isBasic: true 
    },
    { id: '1', name: 'Leather Pouch', category: 'Misc', difficulty: 'None', price: 1500000, icon: '💰', description: 'A pouch for carrying money.', rankLevel: 2 },
    { id: '2', name: "Kasaka's Venom", category: 'Elixir', difficulty: 'A', price: 50000, icon: '🧪', description: 'Grants permanent defense buff.', rankLevel: 4 },
    { id: '3', name: "Knight Killer", category: 'Dagger', difficulty: 'B', price: 250000, icon: '🗡️', description: 'Effective against knights.', rankLevel: 3 },
    { id: '7', name: "Kamish's Wrath", category: 'Dagger', difficulty: 'SS', price: 99000000, icon: '🐲', description: 'The ultimate weapon.', rankLevel: 7 },
  ];

  const canSeeItem = (item: any) => {
    if (item.isBasic) return true;
    const playerRankLevel = Math.floor((gameState.level || 1) / 10); 
    return playerRankLevel >= item.rankLevel;
  };

  const startSystemScan = () => {
    setIsScanning(true);
    setScanResult('searching');

    setTimeout(() => {
      setScanResult('failed');
      setTimeout(() => {
        setIsScanning(false);
        setScanResult('idle');
      }, 5000);
    }, 5000);
  };

  const handlePurchase = (item: any) => {
    if (!canSeeItem(item)) {
      startSystemScan();
      return;
    }

    if (gameState.gold >= item.price) {
      purchaseItem(item.id);
      playPurchase();
      toast({ title: 'SUCCESS', description: `Acquired ${item.name}` });
    } else {
      toast({ title: 'WARNING', description: 'Insufficient Gold', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      {/* System Scan Modal - Styled like the cards */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="relative bg-black border-2 border-slate-200 p-6 max-w-sm w-full shadow-[0_0_40px_rgba(59,130,246,0.3)]">
            {/* Design Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white" />
            
            <div className="flex justify-center mb-6 mt-[-2.5rem]">
              <div className="border border-slate-400 px-6 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                <h2 className="text-xs font-black tracking-[0.2em] text-white drop-shadow-[0_0_10px_#fff] uppercase">
                  SYSTEM ANALYZER
                </h2>
              </div>
            </div>

            {scanResult === 'searching' ? (
              <div className="space-y-6 text-center py-4">
                <div className="relative flex justify-center">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border border-white/30 rounded-full animate-ping" />
                  </div>
                </div>
                <p className="text-[10px] font-mono text-blue-300 animate-pulse tracking-widest uppercase">
                  Decoding Item Mana Signature...
                </p>
                <div className="w-full bg-blue-950 h-1.5 border border-blue-900 overflow-hidden">
                  <div className="h-full bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-[progress_5s_linear]" />
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center py-4 animate-in zoom-in duration-300">
                <div className="flex justify-center">
                  <ShieldAlert className="w-16 h-16 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                </div>
                <h3 className="text-xl font-black text-red-500 italic drop-shadow-[0_0_10px_#ef4444]">ACCESS DENIED</h3>
                <p className="text-[10px] text-slate-300 font-bold leading-relaxed uppercase italic">
                  Analysis Failed. Your current mana waves are too weak to decrypt this item's data.
                </p>
                <button onClick={() => setIsScanning(false)} className="w-full py-2 border border-slate-700 bg-slate-900 text-[10px] uppercase hover:bg-slate-800 transition-colors tracking-widest">
                  Close Dialog
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
        {SOLO_ITEMS.map((item) => {
          const isLocked = !canSeeItem(item);

          return (
            <div key={item.id} className="relative group">
              <div className="absolute -inset-0.5 bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
              
              <div className={cn(
                "relative bg-black/60 border-2 p-4 transition-all duration-500",
                isLocked ? "border-slate-800" : "border-slate-200/90 shadow-[0_0_20px_rgba(30,58,138,0.3)]"
              )}>
                {/* Item Label with Intense White Glow */}
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className={cn(
                    "border px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]",
                    isLocked ? "border-slate-700" : "border-slate-400/50"
                  )}>
                    <h2 className="text-xs font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase">
                      ITEM: <span className="text-blue-100">{isLocked ? '???' : item.name}</span>
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    {/* Item Icon */}
                    <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0">
                      <span className={cn(
                        "text-4xl transition-all duration-700",
                        isLocked ? "grayscale brightness-50 blur-sm opacity-20" : "filter brightness-200 opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                      )}>
                        {item.icon}
                      </span>
                      {isLocked && <span className="absolute text-xl font-bold text-slate-700">?</span>}
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white" />
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white" />
                    </div>

                    {/* Stats */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Diff:</p>
                        <p className="text-xs font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic uppercase">
                          {isLocked ? '?' : item.difficulty}
                        </p>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Cat:</p>
                        <p className="text-xs font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic uppercase">
                          {isLocked ? '???' : item.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price with Central Glow */}
                  <div className="py-2 border-t border-slate-700/50">
                    <p className="text-lg font-bold text-center text-blue-50 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                      Gold: {isLocked ? '???,???' : item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="text-center px-1">
                    <p className="text-[10px] text-slate-300 italic uppercase tracking-tighter leading-tight">
                      {isLocked ? '?' : item.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handlePurchase(item)}
                    className={cn(
                      "w-full mt-2 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all active:scale-[0.98] border drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]",
                      isLocked 
                        ? "bg-slate-900 border-slate-800 text-slate-600" 
                        : "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/40 text-blue-300"
                    )}
                  >
                    {isLocked ? 'not found' : 'Purchase Item'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav />

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Market;
