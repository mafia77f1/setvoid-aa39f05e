import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'; // تأكد من وجود هذا الملف في مشروعك

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  const [scanningId, setScanningId] = useState<string | null>(null);

  const SOLO_ITEMS = [
    { 
      id: 'hp_pot', 
      name: 'HP Potion 50%', 
      category: 'Consumable', 
      difficulty: 'None', 
      price: 10000, 
      icon: '🥤',
      description: 'Instantly restores 50% of your health.',
      rankLevel: 0,
      isBasic: true 
    },
    { 
      id: 'mp_pot', 
      name: 'Mana Potion 50%', 
      category: 'Consumable', 
      difficulty: 'None', 
      price: 10000, 
      icon: '🧪',
      description: 'Instantly restores 50% of your mana.',
      rankLevel: 0,
      isBasic: true 
    },
    { 
      id: '1', 
      name: 'Leather Pouch', 
      category: 'Miscellaneous', 
      difficulty: 'None', 
      price: 1500000, 
      icon: '💰', 
      description: 'A pouch for carrying money.', 
      rankLevel: 2, // يحتاج مستوى 20+
      isBasic: false 
    },
    { 
      id: '2', 
      name: "Kasaka's Venom", 
      category: 'Elixir', 
      difficulty: 'A', 
      price: 50000, 
      icon: '🧪', 
      description: 'Grants permanent defense buff.', 
      rankLevel: 4, // يحتاج مستوى 40+
      isBasic: false 
    },
    { 
      id: '3', 
      name: "Knight Killer", 
      category: 'Dagger', 
      difficulty: 'B', 
      price: 250000, 
      icon: '🗡️', 
      description: 'Effective against knights.', 
      rankLevel: 3, 
      isBasic: false 
    },
    { 
      id: '7', 
      name: "Kamish's Wrath", 
      category: 'Dagger', 
      difficulty: 'SS', 
      price: 99000000, 
      icon: '🐲', 
      description: 'Ultimate weapon crafted from a dragon.', 
      rankLevel: 6, 
      isBasic: false 
    },
  ];

  // دالة التحقق من الرؤية
  const canSeeItem = (item: any) => {
    if (item.isBasic) return true;
    const playerRankLevel = Math.floor((gameState.level || 1) / 10); 
    return playerRankLevel >= item.rankLevel;
  };

  const handlePurchase = (item: any) => {
    const isLocked = !canSeeItem(item);

    if (isLocked) {
      if (scanningId) return; // منع الضغط المتكرر أثناء البحث
      
      setScanningId(item.id);
      
      setTimeout(() => {
        setScanningId(null);
        toast({
          title: 'SYSTEM NOTICE',
          description: '[ACCESS DENIED] Your current mana waves are too weak to decrypt this item’s data. Grow stronger, Player.',
          variant: 'destructive',
        });
      }, 5000);
      return;
    }

    if (gameState.gold >= item.price) {
      purchaseItem(item.id);
      playPurchase();
      toast({
        title: 'System: SUCCESS',
        description: `Acquired ${item.name}`,
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
      {/* Background Effects */}
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
            {(gameState.gold || 0).toLocaleString()}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {SOLO_ITEMS.map((item) => {
          const isLocked = !canSeeItem(item);
          const isScanning = scanningId === item.id;

          return (
            <div key={item.id} className="relative group">
              {/* Card Container */}
              <div className={cn(
                "relative bg-black/60 border-2 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)] transition-all duration-700",
                isLocked ? "border-slate-800" : "border-slate-200/90",
                isScanning && "border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.6)] scale-[1.02]"
              )}>
                
                {/* Item Header */}
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className={cn(
                    "border px-4 py-0.5 bg-slate-900/90",
                    isLocked ? "border-slate-700" : "border-slate-400/50"
                  )}>
                    <h2 className="text-xs font-bold tracking-widest text-white uppercase">
                      ITEM: <span className="text-blue-100">{isLocked ? '???' : item.name}</span>
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    {/* Item Icon */}
                    <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0 overflow-hidden">
                      <span className={cn(
                        "text-4xl transition-all duration-1000",
                        isLocked ? "blur-md opacity-30 grayscale" : "filter brightness-125"
                      )}>
                        {item.icon}
                      </span>
                      
                      {isLocked && <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-500/50">?</span>}
                      
                      {isScanning && (
                        <div className="absolute inset-0 bg-blue-500/20 flex flex-col items-center justify-center">
                           <div className="w-full h-1 bg-blue-400 absolute top-0 animate-[bounce_2s_infinite]" />
                           <span className="text-[8px] font-mono animate-pulse">ANALYZING...</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Diff:</p>
                        <p className="text-xs font-bold text-white italic">{isLocked ? '?' : item.difficulty}</p>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Cat:</p>
                        <p className="text-xs font-bold text-white italic">{isLocked ? '???' : item.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="py-2 border-t border-slate-700/50">
                    <p className="text-lg font-bold text-center text-blue-50 font-mono tracking-tighter">
                      Gold: {isLocked ? '???,???' : item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="text-center px-1 min-h-[30px] flex items-center justify-center">
                    <p className={cn(
                      "text-[10px] italic leading-tight transition-all duration-500",
                      isLocked ? "text-slate-600" : "text-slate-300"
                    )}>
                      {isScanning ? (
                        <span className="text-blue-400 animate-pulse">System is searching for item data in the Great Library...</span>
                      ) : (
                        isLocked ? '?' : item.description
                      )}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={isScanning || (!isLocked && gameState.gold < item.price)}
                    className={cn(
                      "w-full mt-2 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all active:scale-[0.98] border",
                      isLocked 
                        ? "bg-red-500/5 border-red-900/30 text-red-900/60 hover:bg-red-500/10" 
                        : "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20",
                      isScanning && "opacity-100 border-blue-500 text-blue-400 animate-pulse"
                    )}
                  >
                    {isScanning ? 'Searching...' : (isLocked ? 'not found' : 'Purchase Item')}
                  </button>
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
