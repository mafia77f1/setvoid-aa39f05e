import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Coins, ShoppingBag, Package, Zap, Shield, FlaskConical, Sword } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// بيانات العناصر المستوحاة من سولو ليفلينج
const SOLO_ITEMS = [
  { id: '1', name: 'جرعة الشفاء (Life Potion)', price: 500, icon: <FlaskConical className="w-8 h-8 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />, description: 'تستعيد 50% من نقاط الصحة المفقودة.', category: 'CONSUMABLE' },
  { id: '2', name: 'خنجر كاساكا (Kasaka\'s Venom)', price: 15000, icon: <Sword className="w-8 h-8 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />, description: 'خنجر مصنوع من سم أفعى كاسكا. يسبب الشلل.', category: 'WEAPON' },
  { id: '3', name: 'رداء المتخفي (Stealth Cloak)', price: 25000, icon: <Shield className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />, description: 'يخفي وجودك تماماً عن الوحوش من الرتبة C وأقل.', category: 'ARMOR' },
  { id: '4', name: 'قلب التنين (Dragon\'s Heart)', price: 100000, icon: <Zap className="w-8 h-8 text-blue-600 drop-shadow-[0_0_12px_rgba(37,99,235,1)]" />, description: 'يزيد من مخزون المانا بشكل دائم.', category: 'LEGENDARY' },
];

const Market = () => {
  const { gameState, purchaseItem, useItem } = useGameState();
  const { playPurchase } = useSoundEffects();

  const handlePurchase = (itemId: string, price: number, name: string) => {
    if (gameState.gold >= price) {
      purchaseItem(itemId);
      playPurchase();
      toast({
        title: 'نظام: تم إتمام الشراء',
        description: `تمت إضافة ${name} إلى مخزونك.`,
      });
    } else {
      toast({
        title: 'نظام: ذهب غير كافٍ',
        description: 'تحذير! لا تملك ما يكفي من العملات الذهبية.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 pb-24 font-sans selection:bg-cyan-500/30">
      {/* خلفية بتأثير شبكي (Grid Overlay) تشبه النظام */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <header className="relative px-6 py-8 border-b border-cyan-900/50 bg-black/40 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-cyan-400 animate-pulse" />
              <h1 className="text-2xl font-black tracking-widest uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                متجر النظام
              </h1>
            </div>
            <p className="text-[10px] text-cyan-700 font-mono mt-1">SYSTEM STORE - LEVEL: S</p>
          </div>
          
          <div className="flex items-center gap-3 px-5 py-2 rounded-sm bg-cyan-950/30 border-r-2 border-l-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="font-mono text-xl font-bold text-cyan-100 tabular-nums">
              {gameState.gold.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-8 space-y-10 relative">
        
        {/* المتجر (Items for Sale) */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]"></div>
            <h3 className="text-lg font-bold tracking-tighter uppercase italic">العناصر المتاحة</h3>
          </div>
          
          <div className="grid gap-4">
            {SOLO_ITEMS.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group relative overflow-hidden transition-all duration-300",
                  "bg-gradient-to-r from-[#0a0a0c] to-[#121218]",
                  "border border-slate-800 hover:border-cyan-500/50",
                  "p-4 rounded-none skew-x-[-1deg]"
                )}
              >
                <div className="flex items-center gap-5 relative z-10">
                  {/* حاوية الأيقونة (تصميم جبار) */}
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-black border border-cyan-900 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)] group-hover:shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]">
                    {item.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-md font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-mono text-cyan-600">PRICE:</span>
                      <span className="text-sm font-bold text-yellow-500/90">{item.price.toLocaleString()} G</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handlePurchase(item.id, item.price, item.name)}
                    disabled={gameState.gold < item.price}
                    className={cn(
                      "h-10 px-6 rounded-none font-bold uppercase italic skew-x-[10deg]",
                      "bg-cyan-600 hover:bg-cyan-400 text-black transition-all",
                      "disabled:bg-slate-800 disabled:text-slate-500"
                    )}
                  >
                    شراء
                  </Button>
                </div>
                {/* تأثير ضوئي عند التمرير */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </section>

        {/* المخزون (Inventory) */}
        <section className="bg-[#0a0a0c]/80 border border-slate-800 p-6 rounded-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/5 blur-[60px]"></div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold italic tracking-widest uppercase">المخزون الشخصي</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Capacity: ∞</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gameState.inventory.filter(i => i.quantity > 0).map((item) => (
              <button
                key={item.id}
                onClick={() => useItem(item.id)}
                className="group relative flex flex-col items-center p-4 bg-black/40 border border-slate-800 hover:border-purple-500/50 transition-all"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                <span className="text-xs font-bold text-slate-300">{item.name}</span>
                <span className="absolute top-1 right-2 text-[10px] font-mono text-cyan-500 italic">x{item.quantity}</span>
                <div className="mt-2 text-[8px] text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-tighter">
                  استخدام الآن
                </div>
              </button>
            ))}
            
            {gameState.inventory.filter(i => i.quantity > 0).length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center opacity-20">
                <Package className="w-16 h-16 mb-2" />
                <p className="text-xs uppercase tracking-[0.3em]">المخزون فارغ حالياً</p>
              </div>
            )}
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
};

export default Market;
