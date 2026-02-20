import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, AlertTriangle, ShieldAlert, X, Zap, CreditCard, Bitcoin, Smartphone, ChevronRight, Upload, CheckCircle2, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [isExiting, setIsExiting] = useState(false); 
  const [isVisible, setIsVisible] = useState(false);
  const [scanResult, setScanResult] = useState('idle'); // تم إصلاح النوع هنا
  const [activeItem, setActiveItem] = useState(null);

  // حالات متجر الذهب المطور
  const [showGoldShop, setShowGoldShop] = useState(false);
  const [shopStep, setShopStep] = useState('offers'); 
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const GOLD_OFFERS = [
    { id: 'g1', amount: 1000, price: 0.5, tag: 'Starter' },
    { id: 'g2', amount: 5000, price: 2.5, tag: 'Popular' },
    { id: 'g3', amount: 10000, price: 5.0, tag: 'Best Value' },
    { id: 'g4', amount: 20000, price: 10.0, tag: 'Warrior' },
    { id: 'g5', amount: 100000, price: 50.0, tag: 'Monarch' },
  ];

  const PAYMENT_DETAILS = {
    bank: { name: 'التحويل البنكي', icon: <CreditCard className="w-5 h-5" />, info: 'Account: 0000-1111-2222-3333 | Name: Admin' },
    crypto: { name: 'العملات الرقمية', icon: <Bitcoin className="w-5 h-5" />, info: 'Wallet: 0x71C765... (Network: TRC20)' },
    mobile: { name: 'زين كاش / آسيا حوالة', icon: <Smartphone className="w-5 h-5" />, info: 'Phone: +964 780 000 0000' }
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
    { id: 'mana_meter', name: 'Mana Gauge', arabicName: 'مقياس المانا', category: 'Tool', difficulty: 'D', price: 2000, icon: '📏', description: 'جهاز قياس طاقة البوابات والعناصر', rankLevel: 1 },
    { id: 'awakened_title', name: 'Awakened One', arabicName: 'المستيقظ الواعي', category: 'Title', difficulty: 'C', price: 3000, icon: '👑', description: 'لقب يُظهر أنك من المستيقظين - يزيد XP بنسبة 5%', rankLevel: 2 },
    { id: 'power_eye_title', name: 'Eye of Power', arabicName: 'عين القوة', category: 'Title', difficulty: 'B', price: 10000, icon: '👁️', description: 'لقب نادر يكشف قوة الأعداء ويظهر إحصائياتهم', rankLevel: 3 },
    { id: 'storm_hand_title', name: 'Hand of Storm', arabicName: 'يد العاصفة', category: 'Title', difficulty: 'B', price: 15000, icon: '🌩️', description: 'لقب نادر يزيد ضرر الهجمات بنسبة 10%', rankLevel: 3 },
    { id: 'return_key', name: 'Return Key', arabicName: 'مفتاح العودة', category: 'Key', difficulty: 'B', price: 8000, icon: '🔑', description: 'يتيح الخروج من البوابة دون إكمالها بشكل آمن', rankLevel: 3 },
    { id: 'shadow_elixir', name: 'Shadow Monarch Elixir', arabicName: 'إكسير ملك الظلال', category: 'Ancient Grade', difficulty: 'A', price: 150000, icon: '🧪', description: 'إكسير أسطوري مخفي في أرشيف النظام', rankLevel: 4 },
    { id: 'demon_blood', name: 'Demon King Blood', arabicName: 'دم ملك الشياطين', category: 'Divine Item', difficulty: 'S', price: 5000000, icon: '💀', description: 'جوهر ملك شيطاني رفيع المستوى', rankLevel: 5 },
  ];

  const getPlayerRank = () => {
    const level = gameState?.totalLevel || 1;
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
    if ((gameState?.gold || 0) >= item.price) {
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
    const maxAffordable = Math.floor((gameState?.gold || 0) / item.price);
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

  const handleConfirmPayment = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowGoldShop(false);
      setShopStep('offers');
      toast({ title: 'System: PENDING', description: 'Your request is being reviewed by the Monarch.' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-blue-500/30 pb-24">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      {showGoldShop && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="relative bg-[#050b18] border border-blue-500/30 w-full max-w-md overflow-hidden rounded-lg shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            <div className="bg-blue-600/10 p-4 border-b border-blue-500/30 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-blue-400 italic tracking-[0.2em]">GOLD MONARCH</h2>
                <p className="text-[8px] text-blue-300/60 uppercase tracking-widest">System Currency Exchange</p>
              </div>
              <button onClick={() => {setShowGoldShop(false); setShopStep('offers');}} className="p-1 hover:bg-white/10 rounded-full transition-colors text-blue-400"><X /></button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {shopStep === 'offers' && (
                <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-500">
                  <div className="grid grid-cols-1 gap-3">
                    {GOLD_OFFERS.map((offer) => (
                      <div key={offer.id} onClick={() => {setSelectedOffer(offer); setShopStep('checkout');}} className="group relative bg-gradient-to-r from-blue-950/40 to-black border border-white/5 p-4 cursor-pointer hover:border-blue-500/50 transition-all">
                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-blue-600 text-[8px] font-bold uppercase">{offer.tag}</div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                              <Coins className="text-yellow-500 w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-lg font-bold text-white font-mono">{offer.amount.toLocaleString()} <span className="text-blue-400 text-xs">GOLD</span></div>
                              <div className="text-[10px] text-slate-400">Rate: 1000g = $0.5</div>
                            </div>
                          </div>
                          <div className="text-xl font-black text-blue-300 font-mono">${offer.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {shopStep === 'checkout' && (
                <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
                  <div className="relative p-6 bg-gradient-to-br from-blue-900/20 via-[#050b18] to-blue-900/20 border border-blue-500/40 rounded-xl overflow-hidden shadow-2xl">
                    <div className="relative space-y-4">
                      <div className="flex justify-between items-center border-b border-blue-500/20 pb-4 text-blue-400">
                        <span className="text-[10px] font-bold uppercase tracking-widest italic">Invoice Details</span>
                        <div className="px-3 py-1 bg-blue-500/20 rounded-full text-[10px] font-bold">#TRX-{Math.floor(Math.random() * 90000)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4">
                        <div><p className="text-[8px] text-slate-500 uppercase">Player</p><p className="text-xs font-bold truncate">{gameState?.playerName || 'SOLO_LEVELER'}</p></div>
                        <div><p className="text-[8px] text-slate-500 uppercase">ID</p><p className="text-xs font-bold text-blue-300">#{gameState?.userId || 'N/A'}</p></div>
                        <div><p className="text-[8px] text-slate-500 uppercase">Amount</p><p className="text-sm font-black text-yellow-500">{selectedOffer?.amount.toLocaleString()}</p></div>
                        <div><p className="text-[8px] text-slate-500 uppercase">Total</p><p className="text-lg font-black text-white">${selectedOffer?.price}</p></div>
                      </div>
                      <div className="pt-4 space-y-3">
                        <p className="text-[9px] text-blue-400 font-bold uppercase text-center">Select Gateway</p>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(PAYMENT_DETAILS).map(([key, data]) => (
                            <button key={key} onClick={() => setPaymentMethod(key)} className={cn("flex flex-col items-center gap-2 p-3 border transition-all", paymentMethod === key ? "bg-blue-600/20 border-blue-400" : "bg-black/40 border-white/5 opacity-60")}>
                              {data.icon}<span className="text-[7px] font-bold uppercase text-center">{data.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {paymentMethod && (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                       <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-lg">
                          <p className="text-[9px] text-red-400 font-bold mb-2 uppercase">Copy Details:</p>
                          <div className="flex items-center justify-between bg-black/40 p-2 border border-white/5 rounded">
                            <code className="text-[10px] text-blue-100 font-mono break-all">{PAYMENT_DETAILS[paymentMethod].info}</code>
                          </div>
                       </div>
                       <button onClick={() => setShopStep('verify')} className="w-full py-4 bg-blue-600 text-white font-black text-xs tracking-[0.3em] uppercase">Next: Verify Transfer</button>
                    </div>
                  )}
                </div>
              )}

              {shopStep === 'verify' && (
                <div className="space-y-6 animate-in slide-in-from-right-5 duration-500 py-4">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/30">
                      <Upload className="text-blue-400 w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold tracking-widest italic">VERIFICATION</h3>
                  </div>
                  <div className="border-2 border-dashed border-blue-500/30 bg-blue-900/5 rounded-xl p-8 flex flex-col items-center justify-center gap-3">
                    <CheckCircle2 className="text-slate-600 w-6 h-6" />
                    <span className="text-[10px] text-blue-300 font-bold uppercase">Click to browse files</span>
                  </div>
                  <button onClick={handleConfirmPayment} disabled={isUploading} className="w-full py-4 bg-blue-600 text-white font-black text-xs tracking-[0.3em] uppercase">
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Submission'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isScanning && (
        <div className={cn("fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]", isVisible && !isExiting ? "bg-black/90" : "bg-black/0 pointer-events-none")}>
          <div className={cn("relative bg-[#050b18] border-x border-white/40 shadow-[0_0_50px_rgba(59,130,246,0.4)] max-w-sm w-full font-mono transition-all origin-center", isVisible && !isExiting ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0")}>
            <div className="p-6 text-center space-y-4">
              <h2 className="text-blue-400 text-lg font-bold tracking-[0.2em] uppercase italic">{scanResult === 'searching' ? 'Analyzing...' : '[Denied]'}</h2>
              <div className="py-10 flex flex-col items-center gap-4">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
              </div>
              <button onClick={closeScanModal} className="w-full py-4 bg-white text-black font-black text-[11px] uppercase tracking-[0.5em]">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400">System Store</h1>
        <button onClick={() => setShowGoldShop(true)} className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2 active:scale-95 transition-all">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100 text-sm">{(gameState?.gold || 0).toLocaleString()}</span>
          <div className="ml-1 bg-blue-500 rounded-full w-3 h-3 flex items-center justify-center text-[8px] text-white font-bold">+</div>
        </button>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {SOLO_ITEMS.map((item) => {
          const isAlphaLocked = item.difficulty === 'S' || item.difficulty === 'A';
          const rarity = RARITY_CONFIG[item.difficulty] || RARITY_CONFIG.E;
          const isRevealed = canSeeItem(item);
          return (
            <div key={item.id} className="relative group">
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90">
                    <h2 className="text-xs font-bold tracking-widest text-white uppercase">ITEM: <span className="text-blue-100">{isRevealed ? (item.arabicName || item.name) : 'NOT FOUND'}</span></h2>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border border-slate-500/50 flex items-center justify-center bg-black/40">
                      <span className="text-4xl">{isRevealed ? item.icon : '❓'}</span>
                    </div>
                    <div className="flex-1 space-y-2 text-right">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase">Rank:</p>
                        <p className={cn("text-xs font-bold italic", rarity.text)}>{isRevealed ? item.difficulty : '??'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 border-t border-slate-700/50 text-center text-lg font-bold font-mono tracking-tighter">Gold: {isRevealed ? item.price.toLocaleString() : '????'}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handlePurchase(item)} className={cn("flex-1 py-2 text-[10px] font-bold tracking-[0.2em] uppercase border transition-all", !isRevealed ? "bg-blue-900/40 border-blue-500/50 text-blue-400" : (gameState?.gold || 0) >= item.price ? "bg-blue-500/10 border-blue-500/40 text-blue-300" : "bg-red-900/20 border-red-500/30 text-red-400")}>
                      {!isRevealed ? 'Analyze' : 'Purchase'}
                    </button>
                    {isRevealed && !isAlphaLocked && ( <button onClick={() => handleMaxPurchase(item)} className="px-4 py-2 bg-yellow-600/20 border border-yellow-500/50 text-yellow-500 text-[10px] font-bold uppercase">MAX</button> )}
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
