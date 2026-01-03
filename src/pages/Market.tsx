import React, { useState, useEffect } from 'react';
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
  const [targetItemName, setTargetItemName] = useState('');

  const SOLO_ITEMS = [
    { 
      id: 'hp_potion', 
      name: 'جرعة استعادة الحياة 50%', 
      category: 'عام', 
      difficulty: 'E', 
      price: 500, 
      icon: '🧪', 
      description: 'تعيد 50% من نقاط الصحة الحالية للمستخدم.',
      rankLevel: 0,
      isBasic: true 
    },
    { 
      id: 'mp_potion', 
      name: 'جرعة استعادة الطاقة 50%', 
      category: 'عام', 
      difficulty: 'E', 
      price: 500, 
      icon: '🧪', 
      description: 'تعيد 50% من نقاط المانا الحالية للمستخدم.',
      rankLevel: 0,
      isBasic: true 
    },
    { id: '1', name: 'Leather Pouch', category: 'Miscellaneous', difficulty: 'None', price: 1500000, icon: '💰', description: 'A pouch for carrying money.', rankLevel: 2 },
    { id: '2', name: "Kasaka's Venom", category: 'Elixir', difficulty: 'A', price: 50000, icon: '🧪', description: 'Grants permanent defense buff.', rankLevel: 4 },
    { id: '3', name: "Knight Killer", category: 'Dagger', difficulty: 'B', price: 250000, icon: '🗡️', description: 'Effective against knights.', rankLevel: 3 },
    { id: '7', name: "Kamish's Wrath", category: 'Dagger', difficulty: 'SS', price: 99000000, icon: '🐲', description: 'Ultimate weapon.', rankLevel: 7 },
  ];

  const canSeeItem = (item: any) => {
    if (item.isBasic) return true;
    const playerRankLevel = Math.floor((gameState.level || 1) / 10); 
    return playerRankLevel >= item.rankLevel;
  };

  const startSystemScan = (name: string) => {
    setTargetItemName(name);
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

  const handlePurchase = (item: any) => {
    const isLocked = !canSeeItem(item);
    if (isLocked) {
      startSystemScan('???');
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
      {/* تأثيرات الخلفية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      {/* كارد البحث بالنظام (Solo Leveling Style) */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-[#050b18] border border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.2)] max-w-sm w-full font-mono overflow-hidden">
            {/* الزوايا النيونية */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500" />
            
            {/* شريط الحالة */}
            <div className="bg-blue-500/10 border-b border-blue-500/30 px-4 py-2 flex justify-between items-center">
              <span className="text-[10px] text-blue-400 font-bold tracking-widest animate-pulse uppercase">System_Scanning</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping" />
                <div className="w-1 h-1 bg-blue-500 rounded-full" />
              </div>
            </div>

            <div className="p-8 text-center space-y-6">
              {scanResult === 'searching' ? (
                <div className="space-y-6 py-4">
                  {/* تأثير المسح الضوئي (بديل الدائرة) */}
                  <div className="relative h-24 flex items-center justify-center border border-blue-500/20 rounded-sm">
                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                    <div className="w-full h-[2px] bg-blue-400 shadow-[0_0_15px_#3b82f6] absolute top-0 animate-[scan_2s_infinite]" />
                    <div className="text-3xl font-black opacity-20 tracking-[8px] text-blue-300 select-none">
                      ANALYZING
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] text-blue-400 font-bold tracking-tighter uppercase">
                      جاري محاولة فك تشفير بيانات الكيان...
                    </p>
                    <div className="flex justify-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-8 h-1 bg-blue-950 overflow-hidden border border-blue-500/20">
                          <div 
                            className="h-full bg-blue-400 animate-[loading-bar_1.5s_infinite]" 
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-4 animate-in zoom-in duration-300">
                  <div className="inline-block p-4 bg-red-500/10 border border-red-500/50 mb-2">
                    <AlertTriangle className="w-10 h-10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                  </div>
                  <h3 className="text-red-500 font-black text-xl tracking-tighter uppercase">ACCESS DENIED</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium uppercase px-2">
                    [تحذير: مستوى طاقة المستخدم الحالي منخفض جداً لإدراك كينونة هذا الغرض.]
                  </p>
                </div>
              )}
              
              <button 
                onClick={() => setIsScanning(false)}
                className="w-full py-2 bg-blue-950/50 border border-blue-500/40 text-blue-400 text-[10px] font-bold hover:bg-blue-500/20 transition-colors uppercase tracking-widest"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

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
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    <h2 className="text-xs font-bold tracking-widest text-white uppercase">
                      ITEM: <span className="text-blue-100">{isLocked ? '???' : item.name}</span>
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0">
                      <span className={cn(
                        "text-4xl transition-all duration-300",
                        isLocked ? "grayscale brightness-50 opacity-40" : "filter brightness-110"
                      )}>
                        {item.icon}
                      </span>
                    </div>

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

                  <div className="py-2 border-t border-slate-700/50">
                    <p className="text-lg font-bold text-center text-blue-50 font-mono tracking-tighter">
                      Gold: {isLocked ? '???,???' : item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-center px-1">
                    <p className="text-[10px] text-slate-300 italic leading-tight">
                      {isLocked ? '?' : item.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    className={cn(
                      "w-full mt-2 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all active:scale-[0.95] border",
                      isLocked 
                        ? "bg-slate-900/50 border-slate-700 text-slate-500 cursor-help" 
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
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Market;
