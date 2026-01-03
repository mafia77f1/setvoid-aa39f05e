import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
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
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24 selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.1),transparent_80%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[size:20px_20px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
      </div>

      {/* Epic Scanning Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative w-full max-w-sm overflow-hidden border-2 border-blue-500/50 bg-[#020617] shadow-[0_0_50px_rgba(59,130,246,0.3)]">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white shadow-[0_0_10px_#fff]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white shadow-[0_0_10px_#fff]" />
            
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-blue-500/30 pb-2">
                <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase animate-pulse">System Analyzer v1.0</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-blue-500 animate-bounce" />
                  <div className="w-1 h-1 bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>

              {scanResult === 'searching' ? (
                <div className="space-y-6 text-center">
                  <h2 className="text-xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">SCANNING SYSTEM DATA</h2>
                  <div className="relative h-20 flex items-center justify-center">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin opacity-50 absolute" />
                    <div className="w-12 h-12 border-2 border-white rounded-full animate-ping shadow-[0_0_20px_#fff]" />
                  </div>
                  <p className="text-[10px] font-mono text-blue-300 uppercase tracking-widest">Deciphering item mana signature...</p>
                  <div className="w-full bg-blue-950/50 h-1 border border-blue-900/50 overflow-hidden">
                    <div className="h-full bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-[progress_5s_linear]" />
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-center animate-in zoom-in duration-300">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-red-500/10 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                      <ShieldAlert className="w-12 h-12 text-red-500" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-red-500 italic drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]">ACCESS DENIED</h2>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-200 uppercase leading-relaxed font-bold">Analysis Failed</p>
                    <p className="text-[10px] text-slate-400 italic font-mono uppercase">
                      User mana resonance is insufficient to perceive this artifact's existence.
                    </p>
                  </div>
                  <button onClick={() => setIsScanning(false)} className="w-full py-2 border border-slate-700 bg-slate-900 text-[10px] uppercase hover:bg-slate-800 transition-colors">Close Dialog</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-8 border-b border-blue-500/30 pb-4">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
          System Store
        </h1>
        <div className="bg-blue-950/30 border border-blue-500/50 px-4 py-1.5 flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="font-mono font-bold text-white drop-shadow-[0_0_8px_#fff]">
            {gameState.gold.toLocaleString()}
          </span>
        </div>
      </header>

      {/* Items List */}
      <main className="relative z-10 max-w-md mx-auto space-y-16">
        {SOLO_ITEMS.map((item) => {
          const isLocked = !canSeeItem(item);

          return (
            <div key={item.id} className="relative group">
              <div className={cn(
                "relative bg-black/70 border-2 p-4 transition-all duration-500",
                isLocked ? "border-slate-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]" : "border-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              )}>
                
                {/* Item Label with White Glow */}
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className={cn(
                    "border px-6 py-0.5 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.2)]",
                    isLocked ? "border-slate-800" : "border-slate-300"
                  )}>
                    <h2 className="text-[11px] font-black tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] uppercase">
                      ITEM: {isLocked ? '???' : item.name}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-5">
                    {/* Icon Area */}
                    <div className="w-24 h-24 border border-slate-700 flex items-center justify-center bg-black relative flex-shrink-0">
                      <span className={cn(
                        "text-4xl transition-all duration-700",
                        isLocked ? "grayscale brightness-50 blur-sm opacity-20" : "filter brightness-150 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      )}>
                        {item.icon}
                      </span>
                      {isLocked && <span className="absolute text-xl font-bold text-slate-700">?</span>}
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/50" />
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/50" />
                    </div>

                    {/* Stats */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Difficulty</span>
                        <span className="text-xs font-bold text-white drop-shadow-[0_0_5px_#fff]">{isLocked ? '?' : item.difficulty}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Category</span>
                        <span className="text-xs font-bold text-white drop-shadow-[0_0_5px_#fff]">{isLocked ? '???' : item.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price with Intense White Glow */}
                  <div className="py-2 border-t border-slate-800">
                    <p className="text-xl font-black text-center text-white font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,1)]">
                      GOLD: {isLocked ? '???,???' : item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="text-center min-h-[20px]">
                    <p className="text-[10px] text-slate-400 italic uppercase tracking-tighter leading-tight">
                      {isLocked ? '?' : item.description}
                    </p>
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={() => handlePurchase(item)}
                    className={cn(
                      "w-full py-2.5 text-[11px] font-black tracking-[0.3em] uppercase transition-all active:scale-[0.96] border shadow-lg",
                      isLocked 
                        ? "bg-slate-900 border-slate-800 text-slate-600 cursor-help" 
                        : "bg-white/5 border-white/40 text-white hover:bg-white/10 hover:border-white shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
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
