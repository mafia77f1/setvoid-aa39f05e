import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Coins, ShoppingBag, Package, Sparkles, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem, useItem } = useGameState();
  const { playPurchase } = useSoundEffects();

  const handlePurchase = (itemId: string, price: number, name: string) => {
    if (gameState.gold >= price) {
      purchaseItem(itemId);
      playPurchase();
      toast({
        title: 'تم الشراء!',
        description: `اشتريت ${name}`,
      });
    } else {
      toast({
        title: 'ذهب غير كافٍ!',
        description: 'أكمل المزيد من المهمات لكسب الذهب',
        variant: 'destructive',
      });
    }
  };

  const handleUseItem = (itemId: string, name: string) => {
    useItem(itemId);
    toast({
      title: 'تم الاستخدام!',
      description: `استخدمت ${name}`,
    });
  };

  const handleGoldRecharge = () => {
    window.open('https://r-shadows.github.io/Highest/', '_blank');
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="relative px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-secondary" />
            <h1 className="text-xl font-bold">المتجر</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/20 border border-secondary/40">
            <Coins className="w-5 h-5 text-secondary" />
            <span className="font-bold text-secondary">{gameState.gold}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Gold Recharge Section */}
        <section className="relative overflow-hidden rounded-2xl p-6 border-2"
          style={{
            background: 'linear-gradient(135deg, hsl(45 100% 8%) 0%, hsl(45 80% 5%) 50%, hsl(45 90% 3%) 100%)',
            borderColor: 'hsl(45 100% 50%)'
          }}
        >
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 text-center space-y-4">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 border-2 border-yellow-500/50 mb-2">
              <Coins className="w-10 h-10 text-yellow-500 animate-bounce" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              شحن الذهب
              <Sparkles className="w-6 h-6" />
            </h2>

            {/* Description */}
            <p className="text-sm text-yellow-200/80 max-w-sm mx-auto">
              احصل على المزيد من الذهب لشراء العناصر القوية وتطوير شخصيتك!
            </p>

            {/* Recharge Button */}
            <button
              onClick={handleGoldRecharge}
              className={cn(
                "relative group w-full max-w-xs mx-auto py-4 px-6 rounded-xl font-bold text-lg",
                "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600",
                "border-2 border-yellow-400",
                "text-black",
                "hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500",
                "active:scale-95",
                "transition-all duration-300",
                "flex items-center justify-center gap-3",
                "overflow-hidden"
              )}
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <Coins className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="relative z-10">اشحن الآن</span>
              <ExternalLink className="w-5 h-5" />
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-yellow-500/30">
              <div className="text-center">
                <div className="text-2xl mb-1">⚡</div>
                <p className="text-xs text-yellow-200/70">سريع وآمن</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">💎</div>
                <p className="text-xs text-yellow-200/70">أفضل الأسعار</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🎁</div>
                <p className="text-xs text-yellow-200/70">مكافآت إضافية</p>
              </div>
            </div>
          </div>
        </section>

        {/* Items for Sale */}
        <section className="system-panel p-4">
          <h3 className="font-bold mb-4 text-primary">العناصر المتاحة</h3>
          
          <div className="space-y-3">
            {gameState.inventory.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl",
                  "bg-gradient-to-r from-card/80 to-card/40",
                  "border border-primary/20"
                )}
              >
                <div className="text-4xl">{item.icon}</div>
                
                <div className="flex-1">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Coins className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-bold text-secondary">{item.price}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => handlePurchase(item.id, item.price, item.name)}
                    disabled={gameState.gold < item.price}
                    className="gap-1"
                  >
                    شراء
                  </Button>
                  {item.quantity > 0 && (
                    <span className="text-xs text-center text-muted-foreground">
                      لديك: {item.quantity}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Inventory */}
        <section className="system-panel p-4">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-bold">المخزون</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {gameState.inventory.filter(i => i.quantity > 0).map((item) => (
              <button
                key={item.id}
                onClick={() => handleUseItem(item.id, item.name)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl",
                  "bg-gradient-to-b from-primary/10 to-primary/5",
                  "border border-primary/30",
                  "hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10",
                  "transition-all active:scale-95"
                )}
              >
                <div className="text-3xl">{item.icon}</div>
                <span className="text-sm font-semibold">{item.name}</span>
                <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                <span className="text-xs text-primary">اضغط للاستخدام</span>
              </button>
            ))}
            
            {gameState.inventory.filter(i => i.quantity > 0).length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">المخزون فارغ</p>
                <p className="text-xs">اشترِ عناصر من المتجر</p>
              </div>
            )}
          </div>
        </section>

        {/* Info */}
        <div className="system-panel p-4 text-center">
          <p className="text-sm text-muted-foreground">
            أكمل المهمات اليومية لكسب الذهب وشراء العناصر المفيدة!
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Market;
