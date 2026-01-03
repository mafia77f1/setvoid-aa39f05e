import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, ShieldAlert, Cpu, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');

  const playerLevel = gameState.level || 1;

  const SOLO_ITEMS = [
    { id: '1', name: 'HP Elixir', category: 'Consume', difficulty: 'C', price: 500, icon: '🧪', rankLevel: 5 },
    { id: '2', name: "Kasaka's Venom", category: 'Elixir', difficulty: 'A', price: 50000, icon: '🧪', rankLevel: 25 },
    { id: '3', name: 'Demon King Sword', category: 'Weapon', difficulty: 'S', price: 1500000, icon: '⚔️', rankLevel: 60 },
    { id: '4', name: 'Kamish Wrath', category: 'Weapon', difficulty: 'EX', price: 99999999, icon: '🗡️', rankLevel: 100 },
  ];

  // دالة فك التشفير بناءً على المستوى
  const obfuscate = (text: string, itemLevel: number) => {
    const diff = playerLevel - itemLevel;
    if (diff >= 0) return text; // مستوى كافي
    if (diff > -5) { // قريب جداً - تظهر بعض الأحرف
        return text.split('').map((char, i) => (i % 2 === 0 ? char : '?')).join('');
    }
    return '???'; // مستوى ضعيف جداً
  };

  const startSystemScan = () => {
    setIsScanning(true);
    setScanResult('searching');
    setTimeout(() => {
      setScanResult('failed');
      setTimeout(() => { setIsScanning(false); setScanResult('idle'); }, 4000);
    }, 3500);
  };

  const handlePurchase = (item: any) => {
    if (playerLevel < item.rankLevel - 5) {
      startSystemScan();
      return;
    }
    if (gameState.gold >= item.price) {
      purchaseItem(item.id);
      playPurchase();
      toast({ title: 'System: SUCCESS', description: 'Item Acquired' });
    } else {
      toast({ title: 'System: WARNING', description: 'Insufficient Gold', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)] pointer-events-none" />

      {/* SYSTEM SCAN MODAL */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="relative bg-[#050b18] border-y border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.2)] w-full max-w-sm animate-[unfoldVertical_0.8s_ease-in-out_forwards]">
            <div className="p-8 text-center space-y-6">
              <h2 className="text-blue-400 text-xs font-black tracking-[0.4em] uppercase">Mana Analysis</h2>
              {scanResult === 'searching' ? (
                <div className="space-y-4">
                  <Activity className="w-12 h-12 text-blue-500 animate-pulse mx-auto" />
                  <p className="text-[10px] text-blue-200 animate-pulse tracking-widest uppercase font-mono">Comparing Player Pulse to Item Rank...</p>
                  <div className="w-full bg-blue-900/30 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 animate-[loading_3.5s_linear_forwards]" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in zoom-in duration-500">
                  <ShieldAlert className="w-12 h-12 text-red-600 mx-auto drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                  <p className="text-sm font-black text-red-500 uppercase tracking-tighter">[ LEVEL INSUFFICIENT ]</p>
                  <p className="text-[9px] text-slate-400 uppercase leading-relaxed font-bold tracking-widest">
                    Your current strength cannot bypass the mana concealment of this item.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="relative z-10 flex justify-between items-center mb-10 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] uppercase tracking-widest">System Store</h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-16">
        {SOLO_ITEMS.map((item) => {
          const isHidden = playerLevel < item.rankLevel - 5;
          return (
            <div key={item.id} className="relative transition-all active:scale-[0.98]">
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 shadow-[0_0_20px_rgba(30,58,138,0.2)]">
                
                {/* معلومات العنصر مرتبة عمودياً */}
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-20 h-20 border border-slate-500/50 flex items-center justify-center bg-black/40 mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    <span className="text-4xl filter grayscale brightness-200">{item.icon}</span>
                  </div>
                  
                  {/* Name */}
                  <h2 className="text-sm font-black text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase tracking-widest">
                    {obfuscate(item.name, item.rankLevel)}
                  </h2>
                  
                  {/* Difficulty (Under Name) */}
                  <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">DIFF:</span>
                    <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic">
                        {obfuscate(item.difficulty, item.rankLevel)}
                    </span>
                  </div>

                  {/* Category (Under Diff) */}
                  <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">CAT:</span>
                    <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic">
                        {obfuscate(item.category, item.rankLevel)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 py-2 border-t border-slate-700/50 text-center font-mono">
                  <p className="text-lg font-bold text-blue-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    GOLD: {isHidden ? '???,???' : item.price.toLocaleString()}
                  </p>
                </div>

                <button 
                  onClick={() => handlePurchase(item)}
                  className={cn(
                    "w-full mt-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all border",
                    isHidden ? "bg-slate-900/50 border-slate-700 text-slate-500" : "bg-blue-500/10 border-blue-500/40 text-blue-300"
                  )}
                >
                  {isHidden ? '[ ANALYZE ]' : 'PURCHASE'}
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
