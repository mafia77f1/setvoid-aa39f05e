import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Coins, ShoppingBag, Package, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const Market = () => {
  const { gameState, purchaseItem, useItem } = useGameState();
  const { playPurchase } = useSoundEffects();
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory'>('shop');

  const handlePurchase = (itemId: string, price: number, name: string) => {
    if (gameState.gold >= price) {
      purchaseItem(itemId);
      playPurchase();
      toast({
        title: 'تم الشراء بنجاح! 🎉',
        description: `استمتع بـ ${name} في مخزونك الآن.`,
      });
    } else {
      toast({
        title: 'الذهب غير كافٍ!',
        description: 'تحتاج للمزيد من العملات الذهبية لشراء هذا العنصر.',
        variant: 'destructive',
      });
    }
  };

  const handleUseItem = (itemId: string, name: string) => {
    useItem(itemId);
    toast({
      title: 'تم التفعيل! ✨',
      description: `استخدمت ${name} بنجاح.`,
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-purple-900/20 to-slate-900 pb-28 text-white">
      {/* Header المطور */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 bg-slate-900/60 px-6 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-black tracking-tight italic">السوق الملكي</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 shadow-[0_0_15px_rgba(251,191,36,0.3)] border border-yellow-300/50">
            <Coins className="w-5 h-5 text-yellow-900" />
            <span className="font-black text-yellow-950">{gameState.gold}</span>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 pt-8 space-y-8">
        
        {/* نظام التبويبات (Tabs) */}
        <div className="flex p-1 bg-slate-800/50 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('shop')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold",
              activeTab === 'shop' ? "bg-primary shadow-lg text-white" : "text-slate-400 hover:text-white"
            )}
          >
            <Sparkles className="w-4 h-4" /> المتجر
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold",
              activeTab === 'inventory' ? "bg-primary shadow-lg text-white" : "text-slate-400 hover:text-white"
            )}
          >
            <Package className="w-4 h-4" /> مخزوني
          </button>
        </div>

        {activeTab === 'shop' ? (
          /* واجهة المتجر - بطاقات حديثة */
          <div className="grid gap-4">
            {gameState.inventory.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-800/40 p-1 transition-all hover:border-primary/50"
              >
                <div className="flex items-center gap-5 p-4 rounded-[22px] bg-slate-900/40 backdrop-blur-sm">
                  <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center text-5xl bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl border border-white/5 shadow-inner">
                    {item.icon}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{item.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-1.5 pt-2">
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-sm font-bold text-amber-500">{item.price}</span>
                      </div>
                      {item.quantity > 0 && (
                        <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-md text-slate-300">
                          تملك: {item.quantity}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => handlePurchase(item.id, item.price, item.name)}
                    disabled={gameState.gold < item.price}
                    className={cn(
                      "rounded-2xl h-12 w-12 p-0 shadow-lg transition-transform active:scale-90",
                      gameState.gold >= item.price ? "bg-primary hover:bg-primary/80" : "bg-slate-700 opacity-50"
                    )}
                  >
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* واجهة المخزون - شبكة أيقونات */
          <div className="grid grid-cols-2 gap-4">
            {gameState.inventory.filter(i => i.quantity > 0).map((item) => (
              <button
                key={item.id}
                onClick={() => handleUseItem(item.id, item.name)}
                className="relative group overflow-hidden rounded-3xl border border-white/10 bg-slate-800/40 p-6 transition-all hover:scale-[1.02] active:scale-95 hover:border-primary/50"
              >
                <div className="absolute top-2 right-3 font-black text-primary/50">x{item.quantity}</div>
                <div className="text-5xl mb-4 transform group-hover:bounce-subtle">{item.icon}</div>
                <h3 className="font-bold text-sm mb-1">{item.name}</h3>
                <div className="text-[10px] uppercase tracking-widest text-primary font-black opacity-0 group-hover:opacity-100 transition-opacity">
                  استخدام الآن
                </div>
              </button>
            ))}
            
            {gameState.inventory.filter(i => i.quantity > 0).length === 0 && (
              <div className="col-span-2 py-20 text-center space-y-4 bg-slate-800/20 rounded-3xl border-2 border-dashed border-white/5">
                <Package className="w-16 h-16 mx-auto opacity-10" />
                <div className="space-y-1">
                  <p className="text-slate-400 font-medium">مخزنك فارغ حالياً</p>
                  <button onClick={() => setActiveTab('shop')} className="text-primary text-sm font-bold hover:underline">
                    اذهب للتسوق
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* تلميحة أسفل الصفحة */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-transparent p-4 border-l-4 border-primary/50">
          <p className="text-xs text-slate-300 italic flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-primary" />
            نصيحة: بعض العناصر تمنحك نقاط خبرة مضاعفة عند تفعيلها!
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Market;
