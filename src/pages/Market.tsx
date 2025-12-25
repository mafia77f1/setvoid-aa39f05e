import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Coins, ShoppingBag, Package, Sparkles, Zap, Flame, ShieldAlert } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem, useItem } = useGameState();
  const { playPurchase } = useSoundEffects();

  // مصفوفة العناصر بأسعار وأسماء الانمي
  const SOLO_ITEMS = [
    { id: '1', name: 'جرعة تجديد الصحة', price: 500, icon: <Flame className="w-7 h-7" />, desc: 'تستعيد نقاط الحياة بالكامل فوراً.' },
    { id: '2', name: 'مفتاح بوابة الرتبة S', price: 50000, icon: <Sparkles className="w-7 h-7" />, desc: 'يسمح لك بدخول زنزانة من الرتبة العليا.' },
    { id: '3', name: 'خنجر كاساكا السام', price: 15000, icon: <Zap className="w-7 h-7" />, desc: 'فرصة 50% لشل حركة العدو عند الهجوم.' },
    { id: '4', name: 'درع الفارس الأسود', price: 25000, icon: <ShieldAlert className="w-7 h-7" />, desc: 'يقلل الضرر الجسدي بنسبة 40%.' },
  ];

  const handlePurchase = (itemId: string, price: number, name: string) => {
    if (gameState.gold >= price) {
      purchaseItem(itemId);
      playPurchase();
      toast({ title: 'تمت العملية', description: `تم شراء ${name} بنجاح.` });
    } else {
      toast({ title: 'فشل العملية', description: 'الذهب المتاح غير كافٍ.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen relative bg-[#020617] text-cyan-50 overflow-hidden font-sans">
      
      {/* خلفية ضبابية (Aurora Effect) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 container max-w-xl mx-auto px-4 py-10">
        
        {/* رأس الصفحة - الذهب */}
        <div className="flex items-center justify-between mb-10 border-b border-cyan-500/30 pb-4 backdrop-blur-sm">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 uppercase">
              STORE / المتجر
            </h1>
            <p className="text-[10px] font-mono tracking-[0.2em] text-cyan-500/70">SYSTEM VERSION 2.0.4</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-black/40 border border-cyan-500/50 px-4 py-1 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-xl font-bold font-mono tracking-tighter tabular-nums">
                {gameState.gold.toLocaleString()}
              </span>
            </div>
            <span className="text-[9px] text-cyan-600 mt-1 uppercase tracking-widest font-bold text-left w-full">Current Gold</span>
          </div>
        </div>

        {/* قائمة العناصر */}
        <div className="space-y-4">
          {SOLO_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative"
            >
              {/* التوهج الخلفي عند التمرير */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-none opacity-0 group-hover:opacity-30 blur-sm transition duration-300"></div>
              
              <div className="relative flex items-center gap-4 bg-[#0a1120]/80 border border-cyan-900/50 p-4 backdrop-blur-xl transition-transform active:scale-[0.98]">
                
                {/* أيقونة العنصر */}
                <div className="w-16 h-16 flex items-center justify-center border-2 border-cyan-500/20 bg-black/50 text-cyan-400 group-hover:text-white transition-colors group-hover:border-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)]">
                  {item.icon}
                </div>

                {/* معلومات العنصر */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold tracking-tight text-cyan-100 uppercase italic">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mb-2">{item.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-600">COST:</span>
                    <span className="text-sm font-bold text-yellow-500">{item.price.toLocaleString()} G</span>
                  </div>
                </div>

                {/* زر الشراء */}
                <Button
                  onClick={() => handlePurchase(item.id, item.price, item.name)}
                  disabled={gameState.gold < item.price}
                  className={cn(
                    "h-12 px-5 bg-transparent border-l border-cyan-500/30 hover:bg-cyan-500/10 rounded-none transition-all",
                    "text-cyan-400 font-black italic tracking-widest hover:text-white",
                    "disabled:opacity-20 disabled:grayscale"
                  )}
                >
                  BUY
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* قسم المخزون - تصميم عائم */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-black uppercase tracking-widest italic text-purple-400">Inventory / المخزون</h3>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[...Array(8)].map((_, i) => {
              const item = gameState.inventory.filter(inv => inv.quantity > 0)[i];
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square border flex items-center justify-center relative",
                    item ? "border-cyan-500/50 bg-cyan-500/5" : "border-slate-800 bg-black/20"
                  )}
                >
                  {item ? (
                    <div 
                      className="cursor-pointer group flex flex-col items-center"
                      onClick={() => useItem(item.id)}
                    >
                      <div className="text-cyan-400 group-hover:scale-110 transition-transform">{item.icon}</div>
                      <span className="absolute bottom-0 right-1 text-[10px] font-mono text-cyan-300">x{item.quantity}</span>
                    </div>
                  ) : (
                    <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* شريط السفلي بنمط الزجاج */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-cyan-500/20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <BottomNav />
      </div>

    </div>
  );
};

export default Market;
