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
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');

  // --- قائمة العناصر المنظمة بأسلوب النظام ---
  const SOLO_ITEMS = [
    { 
      id: 'hp_potion', 
      name: 'جرعة استعادة الحياة 50%', 
      category: 'Elixir', 
      difficulty: 'C', 
      price: 500, 
      description: 'تعيد 50% من نقاط الصحة الحالية للمستخدم.',
      rankLevel: 0,
      isBasic: true 
    },
    { 
      id: 'mp_potion', 
      name: 'جرعة استعادة الطاقة 50%', 
      category: 'Elixir', 
      difficulty: 'C', 
      price: 500, 
      description: 'تعيد 50% من نقاط المانا الحالية للمستخدم.',
      rankLevel: 0,
      isBasic: true 
    },
    // عناصر مخفية (Hidden Items)
    { id: 'hidden_1', name: '???', category: '???', difficulty: '?', price: 1500000, description: 'بيانات غير معروفة.', rankLevel: 99 },
    { id: 'hidden_2', name: '???', category: '???', difficulty: '?', price: 5000000, description: 'بيانات غير معروفة.', rankLevel: 99 },
    { id: 'hidden_3', name: '???', category: '???', difficulty: '?', price: 9999999, description: 'بيانات غير معروفة.', rankLevel: 99 },
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
      }, 4000);
    }, 5000);
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
      toast({ title: 'SUCCESS', description: `Acquired ${item.name}` });
    } else {
      toast({ title: 'WARNING', description: 'Insufficient Gold', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 font-sans selection:bg-blue-900 pb-24">
      {/* Background Effect */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,#1e293b_0%,#020617_80%)] pointer-events-none" />

      {/* System Scan Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="border border-blue-500/50 bg-[#0a0f1d] p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(30,144,255,0.2)]">
            <h2 className="text-blue-400 font-mono font-bold mb-6 tracking-widest">SYSTEM ANALYSIS</h2>
            {scanResult === 'searching' ? (
              <div className="space-y-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                <p className="text-xs text-blue-300/70 animate-pulse">DECRYPTING ITEM DATA...</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in zoom-in">
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
                <p className="text-red-400 font-bold">ACCESS DENIED</p>
                <p className="text-[10px] text-slate-400 uppercase leading-relaxed">
                  Your current level is insufficient to perceive this entity.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-10 border-b border-blue-900/50 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            STORE
          </h1>
          <p className="text-[10px] text-blue-500/70 font-mono tracking-widest">GATE_MARKET_INTERFACE</p>
        </div>
        <div className="bg-blue-950/30 border border-blue-500/30 px-4 py-2 flex items-center gap-3">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span className="font-mono font-bold text-blue-50">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      {/* Items List */}
      <main className="relative z-10 grid gap-8 max-w-lg mx-auto">
        {SOLO_ITEMS.map((item) => {
          const isLocked = !canSeeItem(item);

          return (
            <div key={item.id} className="group relative">
              {/* Card Container */}
              <div className={cn(
                "relative transition-all duration-500 border-l-4 p-5 bg-gradient-to-br from-slate-900/80 to-black/90",
                isLocked ? "border-slate-800 opacity-60" : "border-blue-600 hover:border-blue-400"
              )}>
                {/* Item Rank/Type Tag */}
                <div className="absolute -top-3 left-4 bg-slate-900 border border-slate-700 px-3 py-0.5">
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    {isLocked ? 'Rank: ?' : `Rank: ${item.difficulty}`}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className={cn(
                      "text-sm font-bold tracking-tight",
                      isLocked ? "text-slate-500" : "text-blue-100"
                    )}>
                      {item.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono italic">
                      {isLocked ? '???' : item.category}
                    </span>
                  </div>

                  {/* Stats Divider */}
                  <div className="h-px bg-gradient-to-r from-slate-800 via-slate-700 to-transparent" />

                  <p className="text-[11px] text-slate-400 leading-relaxed min-h-[2rem]">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Cost</span>
                      <span className="font-mono text-sm text-blue-400">
                        {isLocked ? '???,???' : `${item.price.toLocaleString()} G`}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePurchase(item)}
                      className={cn(
                        "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                        isLocked 
                          ? "bg-slate-800/50 text-slate-600 cursor-not-allowed" 
                          : "bg-blue-600/10 border border-blue-500/50 text-blue-400 hover:bg-blue-600 hover:text-white"
                      )}
                    >
                      {isLocked ? 'LOCKED' : 'PURCHASE'}
                    </button>
                  </div>
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
