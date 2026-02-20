import React, { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins, Loader2, X, CreditCard, Bitcoin, Smartphone, Upload, CheckCircle2, Copy, ShieldCheck, Wallet } from 'lucide-react';
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

  // حالات متجر الذهب
  const [showGoldShop, setShowGoldShop] = useState(false);
  const [shopStep, setShopStep] = useState('offers'); 
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const GOLD_OFFERS = [
    { id: 'g1', amount: 1000, price: 0.5, tag: 'Starter Pack' },
    { id: 'g2', amount: 5000, price: 2.5, tag: 'Warrior Choice' },
    { id: 'g3', amount: 10000, price: 5.0, tag: 'Most Popular' },
    { id: 'g4', amount: 20000, price: 10.0, tag: 'Elite Vault' },
    { id: 'g5', amount: 100000, price: 50.0, tag: 'Monarch Wealth' },
  ];

  const PAYMENT_DETAILS = {
    bank: { name: 'التحويل البنكي', icon: <CreditCard className="w-6 h-6" />, info: 'Account: 0000-1111-2222-3333' },
    crypto: { name: 'العملات الرقمية', icon: <Bitcoin className="w-6 h-6" />, info: 'Wallet: 0x71C765... (TRC20)' },
    mobile: { name: 'زين كاش / آسيا', icon: <Smartphone className="w-6 h-6" />, info: 'Phone: +964 780 000 0000' }
  };

  const RARITY_CONFIG = {
    S: { border: 'border-gray-900', text: 'text-gray-400' },
    A: { border: 'border-purple-500', text: 'text-purple-400' },
    B: { border: 'border-blue-500', text: 'text-blue-400' },
    C: { border: 'border-white/50', text: 'text-white' },
    E: { border: 'border-gray-600', text: 'text-gray-400' },
  };

  // قائمة العناصر الأصلية
  const SOLO_ITEMS = [
    { id: 'xp_book', name: 'Experience Book', arabicName: 'كتاب الخبرة', category: 'Element', difficulty: 'E', price: 250, icon: '📚' },
    { id: 'hp_potion', name: 'Blood Elixir', arabicName: 'إكسير الدم', category: 'Elixir', difficulty: 'E', price: 500, icon: '🧪' },
    { id: 'mp_potion', name: 'Energy Elixir', arabicName: 'إكسير الطاقة', category: 'Elixir', difficulty: 'E', price: 500, icon: '⚡' },
    { id: 'xp_reset', name: 'Redistribution Stone', arabicName: 'حجر إعادة التوزيع', category: 'Special', difficulty: 'C', price: 5000, icon: '🔄' },
    { id: 'mana_meter', name: 'Mana Gauge', arabicName: 'مقياس المانا', category: 'Tool', difficulty: 'D', price: 2000, icon: '📏' },
    { id: 'shadow_elixir', name: 'Shadow Monarch Elixir', arabicName: 'إكسير ملك الظلال', category: 'Ancient Grade', difficulty: 'A', price: 150000, icon: '🧪' },
    { id: 'demon_blood', name: 'Demon King Blood', arabicName: 'دم ملك الشياطين', category: 'Divine Item', difficulty: 'S', price: 5000000, icon: '💀' },
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
  const canSeeItem = (item) => rankOrder[playerRank] >= rankOrder[item.difficulty];

  const handleConfirmPayment = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowGoldShop(false);
      setShopStep('offers');
      toast({ title: 'System', description: 'Request sent for verification.' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#01040a] text-white p-4 font-sans selection:bg-blue-500/30 pb-24">
      
      {/* --- نافذة شراء الذهب (الجبارة) --- */}
      {showGoldShop && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative bg-[#0d1117] border-2 border-blue-500/30 w-full max-w-lg rounded-2xl shadow-[0_0_60px_rgba(37,99,235,0.25)] overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-transparent flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-blue-400 tracking-tighter italic">SYSTEM CURRENCY</h2>
                <p className="text-[10px] text-blue-300/50 uppercase tracking-widest">Acquire Gold for your journey</p>
              </div>
              <button onClick={() => setShowGoldShop(false)} className="bg-white/5 p-2 rounded-lg hover:bg-red-500/20 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-8 max-h-[80vh] overflow-y-auto">
              {/* Step 1: العروض */}
              {shopStep === 'offers' && (
                <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-4">
                  {GOLD_OFFERS.map((offer) => (
                    <div 
                      key={offer.id} 
                      onClick={() => {setSelectedOffer(offer); setShopStep('checkout');}}
                      className="group relative bg-[#161b22] border border-white/5 p-6 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-900/5 transition-all"
                    >
                      <div className="absolute top-3 right-4 px-2 py-0.5 bg-blue-600 rounded text-[9px] font-bold">{offer.tag}</div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 transition-transform">
                            <Coins className="text-yellow-500 w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-2xl font-black font-mono">{offer.amount.toLocaleString()} <span className="text-blue-400 text-sm">GOLD</span></p>
                            <p className="text-xs text-slate-500">Rate: 1000g = $0.5</p>
                          </div>
                        </div>
                        <p className="text-2xl font-black text-white">${offer.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2: الكارد الجبار (Checkout) */}
              {shopStep === 'checkout' && (
                <div className="space-y-8 animate-in slide-in-from-right-8">
                  <div className="p-8 bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-2 border-blue-400/30 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12"><Coins className="w-40 h-40" /></div>
                    
                    <div className="relative space-y-6">
                      <div className="flex justify-between items-start">
                        <ShieldCheck className="text-blue-400 w-10 h-10" />
                        <div className="text-right">
                          <p className="text-[10px] text-blue-300/60 uppercase">Invoice Amount</p>
                          <p className="text-3xl font-black text-white">${selectedOffer?.price}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                        <div><p className="text-[10px] text-slate-400 uppercase">Receiver</p><p className="font-bold text-sm tracking-wide">SYSTEM_ADM_01</p></div>
                        <div><p className="text-[10px] text-slate-400 uppercase">Quantity</p><p className="font-bold text-sm text-yellow-500">{selectedOffer?.amount.toLocaleString()} GOLD</p></div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-bold text-blue-400 uppercase text-center tracking-widest">Select Payment Method</p>
                        <div className="grid grid-cols-3 gap-3">
                          {Object.entries(PAYMENT_DETAILS).map(([key, data]) => (
                            <button 
                              key={key} 
                              onClick={() => setPaymentMethod(key)}
                              className={cn(
                                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300",
                                paymentMethod === key ? "bg-blue-600/20 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-black/20 border-white/5 opacity-50"
                              )}
                            >
                              {data.icon}<span className="text-[8px] font-bold uppercase">{data.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {paymentMethod && (
                    <div className="space-y-4 animate-in fade-in zoom-in">
                      <div className="p-5 bg-black/40 border border-blue-500/20 rounded-xl flex justify-between items-center">
                        <div className="truncate pr-4">
                          <p className="text-[9px] text-blue-400 uppercase mb-1">Transfer to:</p>
                          <code className="text-xs font-mono text-white">{PAYMENT_DETAILS[paymentMethod].info}</code>
                        </div>
                        <button className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/40"><Copy className="w-4 h-4 text-blue-400" /></button>
                      </div>
                      <button 
                        onClick={() => setShopStep('verify')}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm tracking-[0.4em] uppercase rounded-xl transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
                      >
                        Proceed to Verify
                      </button>
                    </div>
                  )}
                  <button onClick={() => setShopStep('offers')} className="w-full text-xs text-slate-500 font-bold uppercase hover:text-white transition-colors">Go Back</button>
                </div>
              )}

              {/* Step 3: صفحة التحقق المنظمة (Verify) */}
              {shopStep === 'verify' && (
                <div className="space-y-8 animate-in slide-in-from-right-8 text-center py-4">
                  <div className="inline-flex p-4 bg-blue-500/10 rounded-full border border-blue-500/20 mb-2">
                    <Upload className="text-blue-400 w-10 h-10 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter">SUBMIT PROOF</h3>
                    <p className="text-sm text-slate-400 mt-2">Upload the transaction screenshot to receive your gold</p>
                  </div>

                  <div className="relative group">
                    <div className="border-2 border-dashed border-blue-500/40 bg-blue-900/5 rounded-3xl p-12 transition-all hover:bg-blue-900/10 hover:border-blue-400 cursor-pointer">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                          <CheckCircle2 className="text-slate-500 w-8 h-8" />
                        </div>
                        <p className="text-xs font-bold text-blue-300 uppercase tracking-widest">Select Image File</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 space-y-4">
                    <button 
                      onClick={handleConfirmPayment}
                      disabled={isUploading}
                      className="w-full py-5 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-black text-sm tracking-[0.4em] uppercase rounded-xl shadow-xl active:scale-95 transition-all"
                    >
                      {isUploading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Confirm Submission'}
                    </button>
                    <button onClick={() => setShopStep('checkout')} className="text-xs text-slate-500 font-bold uppercase">Back to Invoice</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-5">
        <h1 className="text-2xl font-black tracking-tighter italic text-blue-500">MARKETPLACE</h1>
        <button 
          onClick={() => setShowGoldShop(true)}
          className="bg-[#161b22] border border-blue-500/30 px-5 py-2 rounded-xl flex items-center gap-3 hover:bg-blue-900/20 transition-all active:scale-95"
        >
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-mono font-bold text-lg">{(gameState?.gold || 0).toLocaleString()}</span>
          <span className="bg-blue-600 rounded-lg px-2 py-0.5 text-[10px] font-black">+</span>
        </button>
      </header>

      {/* Elements Grid */}
      <main className="max-w-md mx-auto space-y-16">
        {SOLO_ITEMS.map((item) => {
          const isRevealed = canSeeItem(item);
          const rarity = RARITY_CONFIG[item.difficulty] || RARITY_CONFIG.E;
          
          return (
            <div key={item.id} className="relative group">
              <div className="relative bg-[#0d1117] border-2 border-white/10 p-6 rounded-2xl shadow-2xl transition-all group-hover:border-blue-500/50">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0d1117] border border-white/10 px-6 py-1 rounded-full">
                  <span className="text-[10px] font-black tracking-widest uppercase">{isRevealed ? (item.arabicName || item.name) : 'LOCKED'}</span>
                </div>

                <div className="flex items-center gap-6 mt-4">
                  <div className="w-28 h-28 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center text-5xl">
                    {isRevealed ? item.icon : '❓'}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-[10px] text-slate-500 uppercase">Rank</span>
                      <span className={cn("text-xs font-black uppercase", rarity.text)}>{isRevealed ? item.difficulty : '??'}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xl font-mono font-black text-white">Gold: {isRevealed ? item.price.toLocaleString() : '???'}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => isRevealed ? purchaseItem(item.id) : toast({title: 'Locked'})}
                  className={cn(
                    "w-full mt-6 py-3 rounded-xl font-black text-[10px] tracking-[0.3em] uppercase transition-all border",
                    !isRevealed ? "bg-white/5 border-white/10 text-slate-500" : "bg-blue-600/10 border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white"
                  )}
                >
                  {isRevealed ? 'Purchase Item' : 'Restricted Access'}
                </button>
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
