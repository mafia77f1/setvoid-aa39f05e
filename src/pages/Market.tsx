import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, AlertTriangle, ShieldAlert, X, Zap, CreditCard, Bitcoin, Smartphone, ChevronRight } from 'lucide-react';
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

  // حالات متجر الذهب الجديد
  const [showGoldShop, setShowGoldShop] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  const GOLD_OFFERS = [
    { id: 'g1', amount: 1000, price: 0.5, bonus: '0%' },
    { id: 'g2', amount: 5000, price: 2.5, bonus: '5%' },
    { id: 'g3', amount: 10000, price: 4.9, bonus: '10%' },
    { id: 'g4', amount: 50000, price: 20, bonus: '25%' },
  ];

  const PAYMENT_DETAILS = {
    bank: { name: 'Bank Transfer', info: 'Account: 0000-1111-2222-3333 | Name: System Admin' },
    crypto: { name: 'Crypto (USDT)', info: 'Wallet: 0x71C765... (Network: TRC20)' },
    mobile: { name: 'Zain Cash / AsiaPay', info: 'Phone: +964 780 000 0000' }
  };

  const RARITY_CONFIG = {
    S: { border: 'border-gray-900', text: 'text-gray-400', locked: true },
    A: { border: 'border-purple-500', text: 'text-purple-400', locked: true },
    B: { border: 'border-blue-500', text: 'text-blue-400', locked: false },
    C: { border: 'border-white/50', text: 'text-white', locked: false },
    E: { border: 'border-gray-600', text: 'text-gray-400', locked: false },
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
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      {/* Gold Shop Overlay */}
      {showGoldShop && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-[#050b18] border border-blue-500/50 w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
            <button onClick={() => {setShowGoldShop(false); setSelectedOffer(null); setPaymentMethod('');}} className="absolute top-4 right-4 text-blue-400"><X /></button>
            
            <h2 className="text-xl font-bold text-blue-400 mb-6 italic tracking-widest border-b border-blue-500/30 pb-2">GOLD EXCHANGE</h2>
            
            {!selectedOffer ? (
              <div className="grid grid-cols-1 gap-4">
                {GOLD_OFFERS.map((offer) => (
                  <div key={offer.id} 
                    onClick={() => setSelectedOffer(offer)}
                    className="group flex items-center justify-between p-4 border border-white/10 bg-white/5 hover:border-blue-500/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Coins className="text-yellow-400 w-6 h-6" />
                      <div>
                        <div className="font-bold text-lg">{offer.amount.toLocaleString()} <span className="text-[10px] text-blue-400">GOLD</span></div>
                        <div className="text-[10px] text-green-400">Bonus: {offer.bonus}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-200 font-mono font-bold">${offer.price}</span>
                      <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <div className="bg-blue-900/20 border border-blue-500/30 p-4 space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-blue-400">ACCOUNT NAME:</span> <span>{gameState.playerName || 'PLAYER_01'}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-blue-400">ACCOUNT ID:</span> <span className="font-mono">#{gameState.userId || 'N/A'}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-blue-400">GOLD AMOUNT:</span> <span className="text-yellow-400 font-bold">{selectedOffer.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs border-t border-white/10 pt-2"><span className="text-blue-400">TOTAL PRICE:</span> <span className="text-xl font-bold">${selectedOffer.price}</span></div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-blue-300 uppercase font-bold">Select Payment Method:</p>
                  <div className="grid grid-cols-1 gap-2">
                    <button onClick={() => setPaymentMethod('bank')} className={cn("flex items-center gap-3 p-3 border text-xs transition-all", paymentMethod === 'bank' ? "border-blue-500 bg-blue-500/20" : "border-white/10")}>
                      <CreditCard className="w-4 h-4" /> Bank Transfer
                    </button>
                    <button onClick={() => setPaymentMethod('crypto')} className={cn("flex items-center gap-3 p-3 border text-xs transition-all", paymentMethod === 'crypto' ? "border-blue-500 bg-blue-500/20" : "border-white/10")}>
                      <Bitcoin className="w-4 h-4" /> Cryptocurrency (USDT)
                    </button>
                    <button onClick={() => setPaymentMethod('mobile')} className={cn("flex items-center gap-3 p-3 border text-xs transition-all", paymentMethod === 'mobile' ? "border-blue-500 bg-blue-500/20" : "border-white/10")}>
                      <Smartphone className="w-4 h-4" /> Zain Cash / AsiaPay
                    </button>
                  </div>
                </div>

                {paymentMethod && (
                  <div className="bg-red-950/20 border border-red-900/50 p-3 animate-in fade-in zoom-in duration-300">
                    <p className="text-[9px] text-red-400 font-bold uppercase mb-1">Payment Instructions:</p>
                    <p className="text-[11px] text-white font-mono break-all">{PAYMENT_DETAILS[paymentMethod].info}</p>
                    <p className="text-[8px] text-slate-400 mt-2 italic">* Send screenshot of receipt to admin to confirm.</p>
                  </div>
                )}
                
                <button 
                  onClick={() => setSelectedOffer(null)} 
                  className="w-full py-2 text-[10px] border border-white/10 text-slate-400 uppercase"
                >
                  Back to Offers
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Scan Modal (No Changes) */}
      {isScanning && (
        <div className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]",
          isVisible && !isExiting ? "bg-black/90" : "bg-black/0 pointer-events-none"
        )}>
          <div className={cn(
            "relative bg-[#050b18] border-x border-white/40 shadow-[0_0_50px_rgba(59,130,246,0.4)] max-w-sm w-full font-mono overflow-hidden transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
            isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1000ms]" : "opacity-0 scale-y-0 duration-[800ms]"
          )}>
            <div className={cn("absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-[1500ms] delay-500", isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0")} />
            <div className={cn("absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-[1500ms] delay-500", isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0")} />
            
            <div className={cn("p-6 text-center space-y-4 transition-all duration-1000 delay-700", isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
              <h2 className="text-blue-400 text-lg font-bold tracking-[0.2em] uppercase italic drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                {scanResult === 'searching' ? 'Analyzing Data...' : '[Access Denied]'}
              </h2>
              {scanResult === 'searching' ? (
                <div className="py-10 flex flex-col items-center gap-4">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-[8px] animate-pulse text-blue-300">SCN</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-blue-200 animate-pulse tracking-[0.3em] uppercase">Bypassing Encryption...</p>
                </div>
              ) : (
                <div className="py-2 flex flex-col items-start gap-4 w-full">
                  {(() => {
                    const playerLevel = gameState.totalLevel || 1;
                    const requiredLevel = (activeItem?.rankLevel || 0) * 10;
                    const levelDiff = requiredLevel - playerLevel;
                    const revealText = (text, diff) => {
                      if (diff <= 5) return text;
                      if (diff <= 15) return text.substring(0, 3) + ".".repeat(text.length - 3);
                      if (diff <= 30) return text[0] + "?".repeat(text.length - 1);
                      return "UNKNOWN DATA";
                    };
                    const powerLevels = { 'S': '80%', 'A': '70%', 'B': '50%', 'C': '30%' };
                    const itemPower = powerLevels[activeItem?.difficulty] || '20%';

                    return (
                      <div className="w-full space-y-4">
                        <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative">
                          <div className="absolute top-0 right-0 p-1"><ShieldAlert className="w-4 h-4 text-red-500/50" /></div>
                          <div className="mb-3 border-b border-blue-500/30 pb-2">
                            <span className="text-[9px] text-blue-400 block mb-1">DATA_STREAM_NAME:</span>
                            <span className="text-sm font-bold text-white tracking-wider">
                              {revealText(activeItem?.name || "???", levelDiff)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[9px] text-blue-400 block mb-1">DIFFICULTY:</span>
                              <span className="text-xs font-bold text-red-400">{levelDiff <= 15 ? activeItem?.difficulty : '??'}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-blue-400 block mb-1">CATEGORY:</span>
                              <span className="text-xs font-bold text-white uppercase">{revealText(activeItem?.category || "???", levelDiff)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left bg-red-950/20 border border-red-900/50 p-3 font-bold uppercase tracking-tighter">
                          <p className="text-[10px] text-red-400">Warning: Level [{playerLevel}] insufficient. Min required: {requiredLevel}.</p>
                        </div>
                        <button onClick={closeScanModal} className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase">Confirm & Terminate</button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header with Clickable Gold */}
      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
          System Store
        </h1>
        <button 
          onClick={() => setShowGoldShop(true)}
          className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2 hover:bg-blue-800/40 transition-colors active:scale-95"
        >
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">
            {gameState.gold.toLocaleString()}
          </span>
          <div className="ml-1 bg-blue-500 rounded-full w-3 h-3 flex items-center justify-center text-[8px] text-white font-bold">+</div>
        </button>
      </header>

      {/* Main Items Grid (No Changes) */}
      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {visibleItems.map((item) => {
          const isAlphaLocked = item.difficulty === 'S' || item.difficulty === 'A';
          const rarity = RARITY_CONFIG[item.difficulty] || RARITY_CONFIG.E;
          const isRevealed = canSeeItem(item);
          
          return (
            <div key={item.id} className="relative group">
              <div className="absolute -inset-0.5 bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)] transition-all active:scale-[0.98]">
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90">
                    <h2 className="text-xs font-bold tracking-widest text-white uppercase">
                      ITEM: <span className="text-blue-100">{isRevealed ? (item.arabicName || item.name) : 'NOT FOUND'}</span>
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0">
                      {!isRevealed ? (
                        <span className="text-4xl opacity-20 grayscale">❓</span>
                      ) : (
                        <span className="text-4xl filter grayscale brightness-200 opacity-90">{item.icon}</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Rank:</p>
                        <p className={cn("text-xs font-bold italic uppercase", rarity.text)}>{isRevealed ? item.difficulty : '??'}</p>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Type:</p>
                        <p className="text-xs font-bold text-white italic uppercase">{isRevealed ? item.category : 'NOT FOUND'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 border-t border-slate-700/50">
                    <p className="text-lg font-bold text-center text-blue-50 font-mono tracking-tighter">Gold: {isRevealed ? item.price.toLocaleString() : '????'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handlePurchase(item)} disabled={isAlphaLocked && isRevealed} className={cn("flex-1 mt-2 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all border", !isRevealed ? "bg-blue-900/40 border-blue-500/50 text-blue-400 hover:bg-blue-800/60" : isAlphaLocked ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed" : gameState.gold >= item.price ? "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20" : "bg-red-900/20 border-red-500/30 text-red-400")}>
                      {!isRevealed ? 'Analyze' : isAlphaLocked ? 'Locked' : 'Purchase'}
                    </button>
                    {isRevealed && !isAlphaLocked && (
                      <button onClick={() => handleMaxPurchase(item)} className="mt-2 px-4 py-2 bg-yellow-600/20 border border-yellow-500/50 text-yellow-500 text-[10px] font-bold uppercase hover:bg-yellow-600/30">MAX</button>
                    )}
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
