import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, ShieldAlert, Activity, Cpu } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');

  // مستوى اللاعب
  const playerLevel = gameState.level || 1;

  const SOLO_ITEMS = [
    { id: 'hp_potion', name: 'HP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', rankLevel: 5, isBasic: true },
    { id: 'mp_potion', name: 'MP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', rankLevel: 5, isBasic: true },
    { id: 'hidden_1', name: 'Demon King Greatsword', category: 'Weapon', difficulty: 'S', price: 1500000, icon: '⚔️', rankLevel: 40, isBasic: false },
    { id: 'hidden_2', name: 'Orb of Avarice', category: 'Magic Tool', difficulty: 'A', price: 5000000, icon: '🔮', rankLevel: 60, isBasic: false },
    { id: 'hidden_3', name: 'Kamish Wrath', category: 'Weapon', difficulty: 'EX', price: 99999999, icon: '🗡️', rankLevel: 100, isBasic: false },
  ];

  const getVisibleText = (text, itemRank) => {
    const diff = playerLevel - itemRank;
    if (diff >= 0) return text;
    if (diff >= -5) return text.split('').map((char, i) => (i % 2 === 0 ? char : '?')).join('');
    return '???';
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
    }, 4000);
  };

  const handlePurchase = (item) => {
    const isLocked = playerLevel < item.rankLevel - 5;
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
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24">
      {/* Background Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      {/* SYSTEM MODAL (THE SEARCH CARD) */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="relative bg-[#050b18] border-y-2 border-blue-500 shadow-[0_0_60px_rgba(59,130,246,0.3)] w-full max-w-sm overflow-hidden animate-[unfoldVertical_1s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            
            {/* Modal Aesthetic Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-20" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
            
            <div className="p-8 relative z-10 space-y-6 text-center">
              <div className="space-y-1">
                <h2 className="text-blue-400 text-xs font-black tracking-[0.4em] uppercase opacity-70">Mana Analysis</h2>
                <div className="h-[2px] w-16 bg-blue-500 mx-auto shadow-[0_0_10px_rgba(59,130,246,1)]" />
              </div>

              {scanResult === 'searching' ? (
                <div className="py-6 space-y-6">
                  <Cpu className="w-14 h-14 text-blue-500 animate-pulse mx-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] text-blue-300 font-mono uppercase tracking-tighter">
                      <span>Analyzing Power Level...</span>
                      <span className="animate-pulse">Active</span>
                    </div>
                    <div className="w-full bg-blue-900/30 h-1.5 rounded-full overflow-hidden border border-blue-500/20">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-blue-300 animate-[loading_4s_linear_forwards]" />
                    </div>
                    <p className="text-[9px] text-blue-400/60 font-mono italic">Synchronizing with Player Mana Pulse...</p>
                  </div>
                </div>
              ) : (
                <div className="py-6 space-y-6 animate-in fade-in zoom-in duration-700">
                  <div className="relative inline-block">
                    <ShieldAlert className="w-16 h-16 text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]" />
                    <div className="absolute inset-0 bg-red-600/10 blur-xl rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-red-500 tracking-tighter uppercase">[ ACCESS DENIED ]</p>
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                    <p className="text-[10px] text-white leading-relaxed uppercase tracking-[0.1em] font-bold px-2">
                      Your current level is too low to perceive this item's true form.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="relative z-10 flex justify-between items-center mb-10 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] uppercase tracking-wider">System Store</h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-16">
        {SOLO_ITEMS.map((item) => {
          const isTooLow = playerLevel < item.rankLevel - 5;
          return (
            <div key={item.id} className="relative group transition-all active:scale-[0.98]">
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 shadow-[0_0_20px_rgba(30,58,138,0.3)] flex flex-col items-center text-center">
                
                {/* Item Icon */}
                <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  <span className="text-4xl filter grayscale brightness-200">{item.icon}</span>
                </div>

                {/* Vertical Info Layout */}
                <div className="space-y-2 mb-6 w-full">
                  <h2 className="text-sm font-black text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase tracking-widest">
                    {getVisibleText(item.name, item.rankLevel)}
                  </h2>
                  
                  <div className="text-[10px] font-bold uppercase tracking-widest flex justify-center gap-2">
                    <span className="text-slate-500">Diff:</span>
                    <span className="text-white italic">{getVisibleText(item.difficulty, item.rankLevel)}</span>
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-widest flex justify-center gap-2">
                    <span className="text-slate-500">Cat:</span>
                    <span className="text-white italic">{getVisibleText(item.category, item.rankLevel)}</span>
                  </div>
                </div>

                <div className="w-full py-2 border-t border-slate-700/50 font-mono">
                  <p className="text-lg font-bold text-blue-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    GOLD: {isTooLow ? '???,???' : item.price.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handlePurchase(item)}
                  className={cn(
                    "w-full mt-4 py-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all border",
                    isTooLow ? "bg-slate-900/50 border-slate-700 text-slate-500" : "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20"
                  )}
                >
                  {isTooLow ? '[ Analyze ]' : 'Purchase Item'}
                </button>
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav />

      <style jsx>{`
        @keyframes unfoldVertical {
          0% { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
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
