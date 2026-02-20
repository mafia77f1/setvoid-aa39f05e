import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, AlertTriangle, ShieldAlert, X, Zap, CreditCard, Wallet, Image as ImageIcon, CheckCircle2, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState(); // نفترض أن gameState يحتوي على user.id و user.name من supabase
  const { playPurchase } = useSoundEffects();
  
  const [isScanning, setIsScanning] = useState(false);
  const [isExiting, setIsExiting] = useState(false); 
  const [isVisible, setIsVisible] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'searching' | 'failed'>('idle');
  const [activeItem, setActiveItem] = useState(null);

  // حالات متجر الذهب الجديد
  const [showGoldShop, setShowGoldShop] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [paymentStep, setPaymentStep] = useState('offers'); // offers, details, confirm
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const GOLD_OFFERS = [
    { id: 'g1', gold: 1000, price: 0.5 },
    { id: 'g2', gold: 5000, price: 2.0 },
    { id: 'g3', gold: 15000, price: 5.0 },
    { id: 'g4', gold: 50000, price: 15.0 },
  ];

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

  // وظيفة إرسال الطلب النهائي
  const submitPurchaseRequest = () => {
    if (!transactionId) {
        toast({ title: "System Error", description: "Please enter transaction ID", variant: "destructive" });
        return;
    }
    toast({ title: "Request Sent", description: "The System is verifying your payment..." });
    setShowGoldShop(false);
    setPaymentStep('offers');
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-[#050b18] border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.2)] overflow-hidden">
            <div className="bg-blue-600/10 border-b border-blue-500/30 p-4 flex justify-between items-center">
              <h2 className="text-blue-400 font-bold tracking-tighter italic uppercase flex items-center gap-2">
                <Coins className="w-5 h-5" /> Gold Recharge System
              </h2>
              <button onClick={() => { setShowGoldShop(false); setPaymentStep('offers'); }} className="text-slate-500 hover:text-white"><X /></button>
            </div>

            <div className="p-6">
              {paymentStep === 'offers' && (
                <div className="space-y-3">
                  <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-4">Select Gold Package:</p>
                  {GOLD_OFFERS.map(offer => (
                    <button 
                      key={offer.id}
                      onClick={() => { setSelectedOffer(offer); setPaymentStep('details'); }}
                      className="w-full group flex items-center justify-between p-4 bg-blue-950/20 border border-blue-900/40 hover:border-blue-400/50 transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-full group-hover:bg-yellow-500/20 transition-colors">
                           <Coins className="w-5 h-5 text-yellow-500" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">{offer.gold.toLocaleString()} Gold</span>
                      </div>
                      <span className="text-blue-400 font-mono font-bold">${offer.price}</span>
                    </button>
                  ))}
                </div>
              )}

              {paymentStep === 'details' && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  <div className="bg-white/5 border border-white/10 p-4 space-y-2 font-mono text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">Account Name:</span>
                      <span className="text-blue-300">{gameState.user?.name || "Player_Admin"}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">Account ID:</span>
                      <span className="text-blue-300">#{gameState.user?.id?.substring(0,8) || "8827110"}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-1">
                      <span className="text-slate-400 font-sans">Total Gold:</span>
                      <span className="text-yellow-500 font-bold">{selectedOffer?.gold.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-blue-400 uppercase tracking-widest">Select Payment Method:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'bank', name: 'Bank Transfer', icon: <CreditCard className="w-4 h-4"/>, info: 'IBAN: IQ12 0000 0000 1234 5678' },
                      { id: 'crypto', name: 'Crypto (USDT)', icon: <Wallet className="w-4 h-4"/>, info: 'Wallet: 0x71C...3f4e (Network: TRC20)' },
                      { id: 'local', name: 'Zain Cash / AsiaPay', icon: <Zap className="w-4 h-4"/>, info: 'Phone: +964 770 000 0000' }
                    ].map(method => (
                      <div key={method.id} className="space-y-2">
                         <button 
                            onClick={() => setPaymentMethod(method.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 border transition-all",
                                paymentMethod === method.id ? "bg-blue-500 border-blue-400 text-white" : "bg-black/40 border-white/10 text-slate-400 hover:border-white/30"
                            )}
                         >
                            {method.icon} {method.name}
                         </button>
                         {paymentMethod === method.id && (
                             <div className="p-3 bg-blue-950/40 border border-blue-500/30 text-[11px] font-mono text-blue-200 break-all">
                                {method.info}
                             </div>
                         )}
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    disabled={!paymentMethod}
                    onClick={() => setPaymentStep('confirm')}
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs disabled:opacity-30"
                  >
                    Proceed to Confirmation
                  </button>
                </div>
              )}

              {paymentStep === 'confirm' && (
                <div className="space-y-5 animate-in zoom-in-95 duration-300">
                  <div className="text-center">
                    <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto mb-2 opacity-50" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Final Step: Verification</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase">Transaction ID / Bill Number</label>
                        <input 
                            type="text" 
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full bg-black border border-white/20 p-3 text-sm focus:border-blue-500 outline-none font-mono"
                            placeholder="e.g. 55029118"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase">Upload Receipt Image</label>
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 hover:border-blue-500/50 cursor-pointer transition-colors bg-blue-950/10">
                            <ImageIcon className="w-8 h-8 text-slate-600 mb-2" />
                            <span className="text-[10px] text-slate-500 uppercase">Click to browse</span>
                            <input type="file" className="hidden" accept="image/*" />
                        </label>
                    </div>

                    <button 
                        onClick={submitPurchaseRequest}
                        className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    >
                        Confirm & Send to System
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Item Analysis Scanning Modal (Original) */}
      {isScanning && (
        <div className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]",
          isVisible && !isExiting ? "bg-black/90" : "bg-black/0 pointer-events-none"
        )}>
           {/* ... محتوى كود المسح الخاص بك (لا تغيير هنا) ... */}
           <div className={cn(
            "relative bg-[#050b18] border-x border-white/40 shadow-[0_0_50px_rgba(59,130,246,0.4)] max-w-sm w-full font-mono overflow-hidden transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
            isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1000ms]" : "opacity-0 scale-y-0 duration-[800ms]"
          )}>
            <div className={cn(
              "absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-[1500ms] delay-500",
              isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            )} />
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-[1500ms] delay-500",
              isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            )} />
            
            <div className={cn(
              "p-6 text-center space-y-4 transition-all duration-1000 delay-700",
              isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
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
                            <span className="text-sm font-bold text-white tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
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
                              <span className="text-xs font-bold text-white uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{revealText(activeItem?.category || "???", levelDiff)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left bg-red-950/20 border border-red-900/50 p-3">
                          <p className="text-[10px] text-red-400 leading-relaxed font-bold uppercase tracking-tighter">
                            Warning: Player level [{playerLevel}] is insufficient to decrypt this entry. 
                            Min required: {requiredLevel}.
                          </p>
                        </div>
                        <button onClick={closeScanModal} className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                          Confirm & Terminate
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
          System Store
        </h1>
        {/* زر الذهب القابل للضغط */}
        <button 
          onClick={() => setShowGoldShop(true)}
          className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2 hover:bg-blue-900/60 transition-colors active:scale-95 group"
        >
          <Coins className="w-3.5 h-3.5 text-yellow-400 group-hover:rotate-12 transition-transform" />
          <span className="font-mono font-bold text-blue-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] text-sm">
            {gameState.gold.toLocaleString()}
          </span>
          <div className="ml-1 px-1 bg-blue-500/20 rounded-sm">
            <span className="text-[10px] text-blue-400 font-bold">+</span>
          </div>
        </button>
      </header>

      {/* Main Content (Items List - No Changes) */}
      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {visibleItems.map((item) => {
          const isAlphaLocked = item.difficulty === 'S' || item.difficulty === 'A';
          const rarityKey = item.difficulty;
          const rarity = RARITY_CONFIG[rarityKey] || RARITY_CONFIG.E;
          const isRevealed = canSeeItem(item);
          
          return (
            <div key={item.id} className="relative group">
              <div className="absolute -inset-0.5 bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-black/60 border-2 border-slate-200/90 p-4 shadow-[0_0_20px_rgba(30,58,138,0.3)] transition-all active:scale-[0.98]">
                <div className="flex justify-center mb-4 mt-[-1.5rem]">
                  <div className="border border-slate-400/50 px-4 py-0.5 bg-slate-900/90 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    <h2 className="text-xs font-bold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase">
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
                        <span className="text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] filter grayscale brightness-200 opacity-90">
                          {item.icon}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Rank:</p>
                        <p className={cn("text-xs font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic uppercase", rarity.text)}>
                          {isRevealed ? item.difficulty : '??'}
                        </p>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Type:</p>
                        <p className="text-xs font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] italic uppercase">
                          {isRevealed ? item.category : 'NOT FOUND'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 border-t border-slate-700/50">
                    <p className="text-lg font-bold text-center text-blue-50 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                      Gold: {isRevealed ? item.price.toLocaleString() : '????'}
                    </p>
                  </div>

                  <div className="text-center px-1">
                    <p className="text-[10px] text-slate-300 italic leading-tight">
                      {isRevealed ? item.description : 'System analysis failed: Unauthorized access to item description.'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={isAlphaLocked && isRevealed}
                      className={cn(
                        "flex-1 mt-2 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all active:scale-[0.95] border drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]",
                        !isRevealed 
                          ? "bg-blue-900/40 border-blue-500/50 text-blue-400 hover:bg-blue-800/60"
                          : isAlphaLocked
                            ? "bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed"
                            : gameState.gold >= item.price
                              ? "bg-blue-500/10 border-blue-500/40 text-blue-300 hover:bg-blue-500/20"
                              : "bg-red-900/20 border-red-500/30 text-red-400"
                      )}
                    >
                      {!isRevealed ? 'Analyze' : isAlphaLocked ? 'Locked' : 'Purchase'}
                    </button>

                    {isRevealed && !isAlphaLocked && (
                      <button
                        onClick={() => handleMaxPurchase(item)}
                        className="mt-2 px-4 py-2 bg-yellow-600/20 border border-yellow-500/50 text-yellow-500 text-[10px] font-bold uppercase hover:bg-yellow-600/30 transition-all active:scale-[0.95]"
                      >
                        MAX
                      </button>
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
