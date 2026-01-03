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
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed' | 'success'>('idle');
  const [activeItem, setActiveItem] = useState(null);

  // مصفوفة العناصر (أضفت أسماء حقيقية للخلفية ليتمكن النظام من "تحليلها")
  const SOLO_ITEMS = [
    { id: 'hp_potion', name: 'HP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', description: 'Restores 50% of the user\'s current health.', rankLevel: 0, isBasic: true },
    { id: 'mp_potion', name: 'MP Recovery Potion 50%', category: 'Elixir', difficulty: 'C', price: 500, icon: '🧪', description: 'Restores 50% of the user\'s current mana.', rankLevel: 0, isBasic: true },
    { id: 'hidden_1', name: 'Kasaka\'s Venom', category: 'Boss Drop', difficulty: 'B', price: 1500000, icon: '🧪', description: 'Provides permanent physical damage reduction.', rankLevel: 25, isBasic: false },
    { id: 'hidden_2', name: 'Demon King Blood', category: 'Mythic', difficulty: 'S', price: 5000000, icon: '🧪', description: 'Used for advanced class evolution.', rankLevel: 50, isBasic: false },
    { id: 'hidden_3', name: 'Holy Water of Life', category: 'Divine', difficulty: 'EX', price: 99999999, icon: '🧪', description: 'Cures any status ailment or disease.', rankLevel: 80, isBasic: false },
  ];

  const canSeeItem = (item) => {
    if (item.isBasic) return true;
    return (gameState.level || 1) >= item.rankLevel;
  };

  // وظيفة تشفير النص بناءً على مستوى اللاعب
  const decryptText = (text, itemRank) => {
    const playerLevel = gameState.level || 1;
    const diff = itemRank - playerLevel;

    if (diff <= 0) return text; // المستوى كافي
    if (diff <= 5) return text.substring(0, Math.ceil(text.length / 2)) + "...."; // قريب جداً (نصف النص)
    if (diff <= 15) return text.charAt(0) + ".........."; // قريب قليلاً (أول حرف)
    return "???"; // المستوى منخفض جداً
  };

  const startSystemScan = (item) => {
    setActiveItem(item);
    setIsScanning(true);
    setScanResult('searching');
    
    const playerLevel = gameState.level || 1;
    const levelDiff = item.rankLevel - playerLevel;

    setTimeout(() => {
      // إذا كان الفرق أكثر من 20 مستوى، يفشل البحث تماماً
      if (levelDiff > 20) {
        setScanResult('failed');
      } else {
        setScanResult('success');
      }
    }, 3000);
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
      {/* Background Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      {/* --- System Scan Modal (Modified Only Here) --- */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative bg-[#050b18] border-2 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.5)] p-6 max-w-sm w-full font-mono animate-[unfoldVertical_0.3s_ease-out]">
            
            {scanResult === 'searching' ? (
              <div className="py-12 flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-sm text-blue-400 animate-pulse tracking-[0.2em] uppercase">Analysing Mana Waves...</p>
                <p className="text-[10px] text-slate-500">Player Lv. {gameState.level || 1}</p>
              </div>
            ) : scanResult === 'failed' ? (
              <div className="py-8 flex flex-col items-center gap-4 text-center">
                <AlertTriangle className="w-12 h-12 text-red-600" />
                <h2 className="text-red-500 font-bold uppercase tracking-tighter text-xl">[Access Denied]</h2>
                <p className="text-xs text-slate-400 leading-relaxed">YOUR LEVEL IS TOO LOW TO IDENTIFY THIS ITEM.</p>
                <button onClick={() => setIsScanning(false)} className="mt-4 px-6 py-2 border border-red-500 text-red-500 text-[10px] uppercase hover:bg-red-500/10">Exit</button>
              </div>
            ) : (
              /* Success/Partial Identity Card - Matches Item Card Style */
              <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-4 mt-[-2rem]">
                  <div className="border border-blue-500 px-4 py-0.5 bg-blue-950 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <h2 className="text-[10px] font-bold tracking-widest text-white uppercase">SYSTEM ANALYSIS</h2>
                  </div>
                </div>

                <div className="bg-black/40 border border-blue-500/30 p-4 space-y-4">
                   <div className="text-center">
                      <p className="text-[9px] text-blue-400 uppercase mb-1">Identified Name:</p>
                      <h3 className="text-sm font-bold text-white border-b border-blue-500/20 pb-2">
                        {decryptText(activeItem.name, activeItem.rankLevel)}
                      </h3>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="border-l-2 border-blue-500 pl-2">
                        <p className="text-[8px] text-slate-500 uppercase">Diff:</p>
                        <p className="text-xs font-bold text-blue-200 uppercase">
                          {decryptText(activeItem.difficulty, activeItem.rankLevel)}
                        </p>
                      </div>
                      <div className="border-l-2 border-blue-500 pl-2">
                        <p className="text-[8px] text-slate-500 uppercase">Cat:</p>
                        <p className="text-xs font-bold text-blue-200 uppercase">
                          {decryptText(activeItem.category, activeItem.rankLevel)}
                        </p>
                      </div>
                   </div>

                   <div className="pt-2">
                      <p className="text-[8px] text-slate-500 uppercase mb-1">Required Level:</p>
                      <p className="text-xs font-mono text-red-400">Lv. {activeItem.rankLevel}</p>
                   </div>
                </div>

                <button 
                  onClick={() => setIsScanning(false)}
                  className="w-full py-2 bg-blue-500/20 border border-blue-500 text-blue-400 text-[10px] font-bold uppercase hover:bg-blue-500/40 transition-all"
                >
                  Confirm Data
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Rest of the UI (Unchanged) --- */}
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
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)] transition-all active:scale-[0.98]">
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90">
                    <h2 className="text-xs font-bold tracking-widest text-white uppercase">
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
                    <p className="text-lg font-bold text-blue-50 font-mono">
                      Gold: {isLocked ? '???,???' : item.price.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    className={cn(
                      "w-full mt-2 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all border",
                      isLocked 
                        ? "bg-slate-900/50 border-slate-700 text-slate-500" 
                        : "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20"
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
        @keyframes unfoldVertical {
          0% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default Market;
