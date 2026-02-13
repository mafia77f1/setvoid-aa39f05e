import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, AlertTriangle, ShieldAlert, X, Zap, Box, ShoppingCart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [isExiting, setIsExiting] = useState(false); 
  const [isVisible, setIsVisible] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');
  const [activeItem, setActiveItem] = useState(null);

  const RARITY_CONFIG = {
    S: { border: 'border-slate-100', text: 'text-white', glow: 'shadow-[0_0_20px_rgba(255,255,255,0.4)]' },
    A: { border: 'border-slate-300', text: 'text-slate-200', glow: 'shadow-[0_0_15px_rgba(200,200,200,0.3)]' },
    B: { border: 'border-blue-400', text: 'text-blue-300', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]' },
    C: { border: 'border-slate-500', text: 'text-slate-400', glow: '' },
    E: { border: 'border-slate-700', text: 'text-slate-500', glow: '' },
  };

  const SOLO_ITEMS = [
    { id: 'xp_book', name: 'Experience Book', arabicName: 'كتاب الخبرة', category: 'Element', difficulty: 'E', price: 250, icon: '📚', description: 'يزيد خبرة اللاعب 500 XP موزعة على جميع الإحصائيات', rankLevel: 0 },
    { id: 'hp_potion', name: 'Blood Elixir', arabicName: 'إكسير الدم', category: 'Elixir', difficulty: 'E', price: 500, icon: '🧪', description: 'يستعيد 50% من الصحة القصوى', rankLevel: 0 },
    { id: 'mp_potion', name: 'Energy Elixir', arabicName: 'إكسير الطاقة', category: 'Elixir', difficulty: 'E', price: 500, icon: '⚡', description: 'يستعيد 50% من الطاقة القصوى', rankLevel: 0 },
    { id: 'xp_reset', name: 'Redistribution Stone', arabicName: 'حجر إعادة التوزيع', category: 'Special', difficulty: 'C', price: 5000, icon: '🔄', description: 'يعيد جميع نقاط XP ويسمح لك بإعادة توزيعها', rankLevel: 2 },
    { id: 'mana_meter', name: 'Mana Gauge', arabicName: 'مقياس المانا', category: 'Tool', difficulty: 'D', price: 2000, icon: '/ManaDeviceIcon.png', description: 'جهاز قياس طاقة البوابات والعناصر', rankLevel: 1 },
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
  
  const visibleItems = SOLO_ITEMS;

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
    if (gameState.gold >= item.price) {
      purchaseItem(item.id);
      playPurchase();
      toast({ title: 'System: SUCCESS', description: `Acquired ${item.name}` });
    } else {
      toast({ title: 'System: WARNING', description: 'Insufficient Gold', variant: 'destructive' });
    }
  };

  const handleMaxPurchase = (item) => {
    const isLocked = !canSeeItem(item);
    if (isLocked) {
      startSystemScan(item);
      return;
    }
    const maxAffordable = Math.floor(gameState.gold / item.price);
    if (maxAffordable > 0) {
      for (let i = 0; i < maxAffordable; i++) {
        purchaseItem(item.id);
      }
      playPurchase();
      toast({ title: 'System: MAX ACQUIRED', description: `Acquired x${maxAffordable} ${item.name}` });
    } else {
      toast({ title: 'System: WARNING', description: 'Insufficient Gold', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 font-sans selection:bg-white/30 pb-28 relative overflow-x-hidden">
      {/* Solo Leveling Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-black" />
      </div>

      {/* Access Denied Modal - System Style */}
      {isScanning && (
        <div className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-700",
          isVisible && !isExiting ? "bg-black/80 opacity-100" : "bg-black/0 opacity-0 pointer-events-none"
        )}>
          <div className="relative bg-black border border-white/20 p-8 max-w-sm w-full shadow-[0_0_50px_rgba(255,255,255,0.1)]">
             <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
             <h2 className="text-center text-white font-black tracking-[0.3em] uppercase mb-6 drop-shadow-lg">
                {scanResult === 'searching' ? 'Authenticating...' : 'Access Denied'}
             </h2>
             {scanResult === 'searching' ? (
                <div className="flex justify-center py-10"><Loader2 className="w-12 h-12 text-white animate-spin" /></div>
             ) : (
                <div className="space-y-6">
                   <div className="p-4 bg-white/5 border border-white/10 text-[10px] text-slate-300 leading-relaxed font-mono uppercase tracking-widest">
                      Your current rank [{playerRank}] is insufficient to unlock this item. Please increase your level to gain system clearance.
                   </div>
                   <button onClick={closeScanModal} className="w-full py-3 bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-colors">
                      Back to Store
                   </button>
                </div>
             )}
          </div>
        </div>
      )}

      {/* Header - Silver Theme */}
      <header className="relative z-10 flex justify-between items-end mb-10 border-b border-white/10 pb-4 px-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase">Inventory Management</span>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Store <span className="text-slate-500">System</span>
          </h1>
        </div>
        <div className="bg-white/5 border border-white/20 px-4 py-2 flex items-center gap-3 backdrop-blur-md">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_#facc15]" />
          <span className="font-mono font-bold text-white text-lg leading-none">
            {gameState.gold.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 font-bold uppercase">Gold</span>
        </div>
      </header>

      {/* Grid of Hunter-Style Item Cards */}
      <main className="relative z-10 grid grid-cols-1 gap-12 max-w-md mx-auto">
        {visibleItems.map((item) => {
          const isAlphaLocked = item.difficulty === 'S' || item.difficulty === 'A';
          const rarity = RARITY_CONFIG[item.difficulty] || RARITY_CONFIG.E;
          const isRevealed = canSeeItem(item);
          
          return (
            <div key={item.id} className="relative group">
              {/* Card Decoration */}
              <div className="absolute -top-4 -left-2 text-[40px] font-black text-white/5 select-none pointer-events-none tracking-tighter">
                {item.difficulty} RANK
              </div>

              {/* Main Card Body */}
              <div className={cn(
                "relative bg-[#0a0c10] border-t-2 border-x border-b-4 p-6 transition-all duration-300",
                isRevealed ? "border-white/80" : "border-slate-800 opacity-60",
                rarity.glow
              )}>
                
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Item Classification</p>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">
                      {isRevealed ? (item.arabicName || item.name) : 'Locked Data'}
                    </h3>
                  </div>
                  <div className={cn("px-3 py-1 border-2 font-black text-sm italic", rarity.border, rarity.text)}>
                    {isRevealed ? item.difficulty : '?'}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex gap-6 mb-6">
                  <div className="w-24 h-24 bg-white/5 border border-white/10 flex items-center justify-center relative flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <div className="absolute inset-1 border border-white/5" />
                    {!isRevealed ? (
                      <ShieldAlert className="w-10 h-10 text-slate-700" />
                    ) : item.id === 'mana_meter' ? (
                      <img src={item.icon} alt="icon" className="w-16 h-16 object-contain brightness-125" />
                    ) : (
                      <span className="text-5xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                        {item.icon}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold uppercase border-b border-white/5 pb-1">
                          <span className="text-slate-500">Category</span>
                          <span className="text-white">{isRevealed ? item.category : 'Unknown'}</span>
                       </div>
                       <p className="text-[10px] text-slate-400 leading-tight italic line-clamp-3">
                        {isRevealed ? item.description : 'Decryption failed. Increase hunter rank to view item properties.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price & Action Section */}
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="flex-1">
                     <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1 tracking-tighter">Exchange Cost</span>
                     <div className="text-2xl font-black text-white font-mono tracking-tighter">
                        {isRevealed ? item.price.toLocaleString() : '???,???'}<span className="text-xs ml-1 text-slate-500">G</span>
                     </div>
                  </div>

                  <div className="flex gap-2">
                    {isRevealed && !isAlphaLocked && (
                      <button
                        onClick={() => handleMaxPurchase(item)}
                        className="px-3 py-3 border border-white/20 hover:bg-white text-white hover:text-black transition-all text-[10px] font-black uppercase"
                      >
                        MAX
                      </button>
                    )}
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={isAlphaLocked && isRevealed}
                      className={cn(
                        "px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95",
                        !isRevealed 
                          ? "bg-white text-black hover:bg-slate-200"
                          : isAlphaLocked
                            ? "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
                            : gameState.gold >= item.price
                              ? "bg-white text-black hover:bg-slate-200 shadow-white/10"
                              : "bg-red-900/20 text-red-500 border border-red-500/30"
                      )}
                    >
                      {!isRevealed ? 'Analyze' : isAlphaLocked ? 'Locked' : 'Acquire'}
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
