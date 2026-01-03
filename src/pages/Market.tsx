import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, ShieldAlert, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');

  // مستوى اللاعب الحالي من الـ GameState
  const playerLevel = gameState.level || 1;

  const SOLO_ITEMS = [
    { 
      id: '1', 
      name: 'HP Recovery Potion', 
      category: 'Elixir', 
      difficulty: 'C', 
      price: 500, 
      icon: '🧪', 
      description: 'Restores 50% HP.',
      rankLevel: 5 
    },
    { 
      id: '2', 
      name: "Kasaka's Venom", 
      category: 'Elixir', 
      difficulty: 'A', 
      price: 50000, 
      icon: '🧪', 
      description: 'Permanent defense buff.',
      rankLevel: 25 
    },
    { 
      id: '3', 
      name: 'Demon King Sword', 
      category: 'Weapon', 
      difficulty: 'S', 
      price: 1500000, 
      icon: '⚔️', 
      description: 'A powerful cursed blade.',
      rankLevel: 50 
    }
  ];

  // دالة إظهار الاسم أو الأحرف بناءً على فرق المستوى
  const getVisibleText = (text, itemRank) => {
    const diff = playerLevel - itemRank;
    if (diff >= 0) return text; // مستوى كافي: يظهر بالكامل
    if (diff >= -5) { // مستوى قريب: يظهر مشوه (أحرف وعلامات استفهام)
      return text.split('').map((char, i) => (i % 2 === 0 ? char : '?')).join('');
    }
    return '???'; // مستوى ضعيف جداً
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
    }, 3500);
  };

  const handlePurchase = (item) => {
    if (playerLevel < item.rankLevel - 5) {
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
      {/* الخلفية التقنية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      {/* نافذة تحليل المانا */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative bg-[#050b18] border-y-2 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.3)] p-8 max-w-sm w-full font-mono animate-[unfoldVertical_0.8s_ease-out_forwards]">
            <div className="text-center space-y-6">
              <h2 className="text-blue-400 text-sm font-black tracking-[0.3em] uppercase underline decoration-blue-500/50 underline-offset-8">Mana Analysis</h2>
              
              {scanResult === 'searching' ? (
                <div className="py-6 flex flex-col items-center gap-4">
                  <Activity className="w-12 h-12 text-blue-500 animate-pulse" />
                  <p className="text-[10px] text-blue-200 animate-pulse tracking-widest uppercase">Analyzing Item Power Level...</p>
                  <div className="w-full bg-blue-900/40 h-1 mt-2 overflow-hidden">
                    <div className="h-full bg-blue-400 animate-[loading_3.5s_linear]" />
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center gap-4 animate-in zoom-in duration-500">
                  <ShieldAlert className="w-12 h-12 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                  <p className="text-sm text-red-500 font-black uppercase">[ Access Denied ]</p>
                  <p className="text-[9px] text-slate-400 leading-relaxed uppercase tracking-wider">Your level is insufficient to analyze this object.</p>
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
          <span className="font-mono font-bold text-blue-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-16">
        {SOLO_ITEMS.map((item) => {
          const isTooLow = playerLevel < item.rankLevel - 5;
          return (
            <div key={item.id} className="relative group transition-all active:scale-[0.98]">
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 shadow-[0_0_20px_rgba(30,58,138,0.3)] flex flex-col items-center text-center">
                
                {/* أيقونة العنصر */}
                <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 mb-6 relative">
                  <span className="text-4xl filter grayscale brightness-200 opacity-90">{item.icon}</span>
                </div>

                {/* الترتيب العمودي المطلوب */}
                <div className="space-y-3 mb-6">
                  {/* Name */}
                  <h2 className="text-sm font-black text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase tracking-[0.15em]">
                    {getVisibleText(item.name, item.rankLevel)}
                  </h2>
                  
                  {/* Difficulty Under Name */}
                  <div className="text-[10px] font-bold tracking-widest uppercase">
                    <span className="text-slate-500">Diff: </span>
                    <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic">
                      {getVisibleText(item.difficulty, item.rankLevel)}
                    </span>
                  </div>

                  {/* Category Under Diff */}
                  <div className="text-[10px] font-bold tracking-widest uppercase">
                    <span className="text-slate-500">Cat: </span>
                    <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic">
                      {getVisibleText(item.category, item.rankLevel)}
                    </span>
                  </div>
                </div>

                {/* السعر */}
                <div className="w-full py-2 border-t border-slate-700/50">
                  <p className="text-lg font-bold text-blue-50 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                    GOLD: {isTooLow ? '???,???' : item.price.toLocaleString()}
                  </p>
                </div>

                {/* زر الشراء أو التحليل */}
                <button
                  onClick={() => handlePurchase(item)}
                  className={cn(
                    "w-full mt-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all border drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]",
                    isTooLow 
                      ? "bg-slate-900/50 border-slate-700 text-slate-500" 
                      : "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20"
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
