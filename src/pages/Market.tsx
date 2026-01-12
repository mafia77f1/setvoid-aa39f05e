import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, AlertTriangle, ShieldAlert, X, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [isExiting, setIsExiting] = useState(false); 
  const [isVisible, setIsVisible] = useState(false);
  const [scanResult, setScanResult] = useState('idle');
  const [activeItem, setActiveItem] = useState(null);

  const RARITY_CONFIG = {
    S: { border: 'border-gray-900', text: 'text-gray-400', locked: true },
    A: { border: 'border-purple-500', text: 'text-purple-400', locked: true },
    B: { border: 'border-blue-500', text: 'text-blue-400', locked: false },
    C: { border: 'border-white/50', text: 'text-white', locked: false },
    E: { border: 'border-gray-600', text: 'text-gray-400', locked: false },
  };

  const SOLO_ITEMS = [
    { id: 'hp_potion', name: 'Blood Elixir', arabicName: 'إكسير الدم', category: 'Elixir', difficulty: 'E', price: 500, icon: '🧪', description: 'يستعيد 50% من الصحة القصوى', rankLevel: 0 },
    { id: 'mp_potion', name: 'Energy Elixir', arabicName: 'إكسير الطاقة', category: 'Elixir', difficulty: 'E', price: 500, icon: '⚡', description: 'يستعيد 50% من الطاقة القصوى', rankLevel: 0 },
    // العنصر الجديد المطلوب - تم ضبط المعرف والرتبة ليعمل الشراء فوراً
    { id: 'exp_book', name: 'Experience Book', arabicName: 'كتاب الخبرة', category: 'Element', difficulty: 'E', price: 1000, icon: '📖', description: 'يزيد خبرة 500 لكل نوع', rankLevel: 0 },
    { id: 'mana_meter', name: 'Mana Gauge', arabicName: 'مقياس المانا', category: 'Tool', difficulty: 'D', price: 2000, icon: '📊', description: 'جهاز قياس طاقة البوابات والعناصر', rankLevel: 1 },
    { id: 'awakened_title', name: 'Awakened One', arabicName: 'المستيقظ الواعي', category: 'Title', difficulty: 'C', price: 3000, icon: '👑', description: 'لقب يُظهر أنك من المستيقظين - يزيد XP بنسبة 5%', rankLevel: 2 },
    { id: 'power_eye_title', name: 'Eye of Power', arabicName: 'عين القوة', category: 'Title', difficulty: 'B', price: 10000, icon: '👁️', description: 'لقب نادر يكشف قوة الأعداء ويظهر إحصائياتهم', rankLevel: 3 },
    { id: 'storm_hand_title', name: 'Hand of Storm', arabicName: 'يد العاصفة', category: 'Title', difficulty: 'B', price: 15000, icon: '🌩️', description: 'لقب نادر يزيد ضرر الهجمات بنسبة 10%', rankLevel: 3 },
    { id: 'return_key', name: 'Return Key', arabicName: 'مفتاح العودة', category: 'Key', difficulty: 'B', price: 8000, icon: '🔑', description: 'يتيح الخروج من البوابة دون إكمالها بشكل آمن', rankLevel: 3 },
    { id: 'shadow_elixir', name: 'Shadow Monarch Elixir', arabicName: 'إكسير ملك الظلال', category: 'Ancient Grade', difficulty: 'A', price: 150000, icon: '🧪', description: 'إكسير أسطوري مخفي في أرشيف النظام', rankLevel: 4 },
    { id: 'demon_blood', name: 'Demon King Blood', arabicName: 'دم ملك الشياطين', category: 'Divine Item', difficulty: 'S', price: 5000000, icon: '💀', description: 'جوهر ملك شيطاني رفيع المستوى', rankLevel: 5 },
  ];

  const getPlayerRank = () => {
    const level = gameState.totalLevel || 1;
    if (level >= 50) return 'S';
    if (level >= 40) return 'A';
    if (level >= 25) return 'B';
    if (level >= 15) return 'C';
    if (level >= 5) return 'D';
    return 'E';
  };

  const rankOrder = { 'E': 0, 'D': 1, 'C': 2, 'B': 3, 'A': 4, 'S': 5 };
  const playerRank = getPlayerRank();

  const canSeeItem = (item) => {
    const itemRank = item.difficulty;
    return rankOrder[playerRank] >= rankOrder[itemRank];
  };
  
  const visibleItems = SOLO_ITEMS.filter(item => canSeeItem(item));

  const startSystemScan = (item) => {
    setActiveItem(item);
    setIsScanning(true);
    setIsExiting(false);
    setScanResult('searching');
    setTimeout(() => setIsVisible(true), 50);
    setTimeout(() => {
      setScanResult('failed');
    }, 3000);
  };

  const closeScanModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsExiting(false);
      setIsVisible(false);
      setScanResult('idle');
      setActiveItem(null);
    }, 800);
  };

  const handlePurchase = (item) => {
    const isLocked = !canSeeItem(item);
    if (isLocked) {
      startSystemScan(item);
      return;
    }
    
    // تنفيذ الشراء الفعلي ونقص الذهب
    if (gameState.gold >= item.price) {
      purchaseItem(item.id);
      playPurchase();
      toast({ title: 'System: SUCCESS', description: `Acquired ${item.arabicName || item.name}` });
    } else {
      toast({ title: 'System: WARNING', description: 'Insufficient Gold', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      {isScanning && (
        <div className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]",
          isVisible && !isExiting ? "bg-black/90" : "bg-black/0 pointer-events-none"
        )}>
           {/* Scan Modal Content (Keep original code inside) */}
           <div className={cn(
            "relative bg-[#050b18] border-x border-white/40 shadow-[0_0_50px_rgba(59,130,246,0.4)] max-w-sm w-full font-mono overflow-hidden transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
            isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1000ms]" : "opacity-0 scale-y-0 duration-[800ms]"
          )}>
            <div className="p-6 text-center space-y-4">
               {scanResult === 'searching' ? <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" /> : <button onClick={closeScanModal} className="w-full py-4 bg-white text-black font-black uppercase">Confirm & Terminate</button>}
            </div>
          </div>
        </div>
      )}

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400">System Store</h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {visibleItems.map((item) => {
          const isAlphaLocked = item.difficulty === 'S' || item.difficulty === 'A';
          const rarity = RARITY_CONFIG[item.difficulty] || RARITY_CONFIG.E;
          
          return (
            <div key={item.id} className="relative group">
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90">
                    <h2 className="text-xs font-bold text-white uppercase">ITEM: {item.arabicName}</h2>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40">
                      <span className="text-4xl">{item.icon}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase">Rank:</p>
                        <p className={cn("text-xs font-bold", rarity.text)}>{item.difficulty}</p>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase">Type:</p>
                        <p className="text-xs font-bold text-white uppercase">{item.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 border-t border-slate-700/50 text-center">
                    <p className="text-lg font-bold text-blue-50 font-mono">Gold: {item.price.toLocaleString()}</p>
                  </div>

                  <div className="text-center px-1">
                    <p className="text-[10px] text-slate-300 italic">{item.description}</p>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={isAlphaLocked}
                    className={cn(
                      "w-full mt-2 py-2 text-[10px] font-bold uppercase border transition-all active:scale-[0.95]",
                      gameState.gold >= item.price ? "bg-blue-500/10 border-blue-500/40 text-blue-300" : "bg-red-900/20 border-red-500/30 text-red-400"
                    )}
                  >
                    {isAlphaLocked ? 'Locked' : 'Purchase Item'}
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
