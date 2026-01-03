import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');

  const SOLO_ITEMS = [
    { id: 'hp_potion', name: 'HP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', description: 'Restores 50% of the user\'s current health.', rankLevel: 0, isBasic: true },
    { id: 'mp_potion', name: 'MP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', description: 'Restores 50% of the user\'s current mana.', rankLevel: 0, isBasic: true },
    { id: 'hidden_1', name: '???', category: '???', difficulty: '?', price: 1500000, icon: '🧪', description: '???', rankLevel: 99, isBasic: false },
    { id: 'hidden_2', name: '???', category: '???', difficulty: '?', price: 5000000, icon: '🧪', description: '???', rankLevel: 99, isBasic: false },
    { id: 'hidden_3', name: '???', category: '???', difficulty: '?', price: 99999999, icon: '🧪', description: '???', rankLevel: 99, isBasic: false },
  ];

  const canSeeItem = (item) => {
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
    }, 4500);
  };

  const handlePurchase = (item) => {
    const isLocked = !canSeeItem(item);
    if (isLocked) {
      startSystemScan();
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
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      {/* SOLO LEVELING STYLE SYSTEM MODAL */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl transition-all duration-500">
          <div className="relative bg-gradient-to-b from-[#0a1229] to-[#040814] border-t border-b border-blue-500/50 shadow-[0_0_60px_rgba(59,130,246,0.3)] w-full max-w-sm overflow-hidden animate-[unfoldVertical_1.2s_cubic-bezier(0.19,1,0.22,1)_forwards]">
            
            {/* Aesthetic Borders */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
            <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
            <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />

            <div className="p-8 relative">
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-blue-500/50" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-blue-500/50" />

              <div className="space-y-6">
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-blue-400 text-xs font-black tracking-[0.4em] uppercase opacity-70">Information</h2>
                  <div className="h-[2px] w-12 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
                </div>

                {scanResult === 'searching' ? (
                  <div className="space-y-6 py-4">
                    <div className="flex justify-center relative">
                       <Cpu className="w-12 h-12 text-blue-500 animate-pulse drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                       <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
                    </div>
                    <div className="space-y-3 font-mono">
                      <div className="flex justify-between text-[10px] text-blue-300/60 uppercase tracking-tighter">
                        <span>Mana Density Analysis</span>
                        <span className="animate-pulse">Analyzing...</span>
                      </div>
                      <div className="w-full bg-blue-950/50 h-1.5 rounded-full overflow-hidden border border-blue-900/50 p-[1px]">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-blue-300 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-[loading_4.5s_linear_forwards]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-blue-200 uppercase tracking-widest animate-pulse">Calculating Item Power Level...</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 py-4 animate-in fade-in zoom-in duration-1000">
                    <div className="flex justify-center">
                       <div className="relative p-4 border border-red-500/30 bg-red-500/5 rounded-sm">
                         <ShieldAlert className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]" />
                         <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 animate-ping rounded-full" />
                       </div>
                    </div>
                    <div className="text-center space-y-2 font-mono">
                      <p className="text-xl font-black text-red-500 tracking-tighter drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] uppercase">[ ERROR ]</p>
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                      <p className="text-[10px] text-white leading-relaxed uppercase tracking-widest px-4 font-bold">
                        Analysis Failed: User is currently too weak to comprehend this information.
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsScanning(false)}
                      className="w-full py-1 text-[9px] border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-colors uppercase tracking-[0.2em]"
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header and Main items remain exactly the same as requested */}
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
            <div key={item.id} className="relative group transition-all active:scale-[0.98]">
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    <h2 className="text-xs font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase">
                      ITEM: <span className="text-blue-100">{isLocked ? '???' : item.name}</span>
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0">
                      <span className="text-4xl filter grayscale brightness-200 opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Diff:</p>
                        <p className="text-xs font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic uppercase">{isLocked ? '?' : item.difficulty}</p>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Cat:</p>
                        <p className="text-xs font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic uppercase">{isLocked ? '???' : item.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 border-t border-slate-700/50 text-center">
                    <p className="text-lg font-bold text-blue-50 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                      Gold: {isLocked ? '???,???' : item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center px-1">
                    <p className="text-[10px] text-slate-300 italic leading-tight">{isLocked ? '?' : item.description}</p>
                  </div>
                  <button onClick={() => handlePurchase(item)} className={cn("w-full mt-2 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all border drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]", isLocked ? "bg-slate-900/50 border-slate-700 text-slate-500" : "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20")}>
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
        @keyframes unfoldVertical {
          0% { transform: scaleY(0.005) scaleX(1); opacity: 0; }
          30% { transform: scaleY(0.005) scaleX(1); opacity: 1; }
          100% { transform: scaleY(1) scaleX(1); opacity: 1; }
        }
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Market;
