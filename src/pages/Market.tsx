import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Coins, ShoppingBag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();

  const SOLO_ITEMS = [
    { 
      id: '1', 
      name: 'Leather Pouch', 
      category: 'Miscellaneous', 
      difficulty: 'None', 
      price: 1500000, 
      icon: '💰',
      description: 'A pouch for carrying money. If you open it, you will get gold.' 
    },
    { 
      id: '2', 
      name: "Kasaka's Venom", 
      category: 'Elixir', 
      difficulty: 'A', 
      price: 50000, 
      icon: '🧪',
      description: 'A purified poison from the Great Serpent. Grants permanent defense buff.' 
    }
  ];

  const handlePurchase = (itemId: string, price: number, name: string) => {
    if (gameState.gold >= price) {
      purchaseItem(itemId);
      playPurchase();
      toast({ title: 'System: SUCCESS', description: `Acquired ${name}.` });
    } else {
      toast({ title: 'System: WARNING', description: 'Insufficient Gold.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen relative bg-black text-white overflow-y-auto pb-32">
      
      {/* 1. الخلفية - يمكنك وضع رابط صورتك هنا */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0 opacity-40 brightness-[0.3]" 
        style={{ backgroundImage: "url('/path-to-your-background.jpg')" }} // ضع رابط صورتك هنا
      />
      
      {/* 2. طبقة الضباب الزرقاء (The Blur Overlay) */}
      <div className="fixed inset-0 backdrop-blur-md bg-blue-900/10 z-0" />

      <main className="relative z-10 container max-w-2xl mx-auto px-4 pt-12">
        
        {/* الذهب مع توهج قوي */}
        <div className="flex justify-end mb-12">
          <div className="border border-blue-400 bg-black/60 px-6 py-2 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
              <span className="text-2xl font-mono font-black text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
                {gameState.gold.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {SOLO_ITEMS.map((item) => (
            <div key={item.id} className="relative animate-in fade-in zoom-in duration-500">
              
              {/* الإطار الخارجي المتوهج ابيض */}
              <div className="relative border-[1.5px] border-white/90 bg-black/70 p-6 shadow-[0_0_35px_rgba(255,255,255,0.2)] backdrop-blur-xl">
                
                {/* العنوان ITEM: بنص متوهج قوي */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-white px-10 py-1">
                  <h2 className="text-xl font-black tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] uppercase italic">
                    ITEM: {item.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  {/* صندوق الأيقونة */}
                  <div className="flex justify-center">
                    <div className="w-40 h-40 border border-white/40 flex items-center justify-center bg-white/5 relative shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]">
                      <span className="text-7xl brightness-200 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] leading-none select-none">
                        {item.icon}
                      </span>
                      {/* زوايا الديكور */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white" />
                    </div>
                  </div>

                  {/* التفاصيل اليمين */}
                  <div className="flex flex-col justify-between py-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Acquisition Difficulty</p>
                        <p className="text-xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] uppercase italic tracking-tighter">
                          {item.difficulty}
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Category</p>
                        <p className="text-xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] uppercase italic">
                          {item.category}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-y border-white/20 py-4">
                      <p className="text-3xl font-black text-center text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)] font-mono tracking-tighter">
                        Gold: {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* الوصف السفلي */}
                <div className="mt-8 text-center px-6">
                  <p className="text-sm font-bold text-blue-100/80 leading-relaxed tracking-wide italic">
                    "{item.description}"
                  </p>
                </div>

                {/* زر الشراء بنمط تقني */}
                <button
                  onClick={() => handlePurchase(item.id, item.price, item.name)}
                  disabled={gameState.gold < item.price}
                  className={cn(
                    "w-full mt-8 py-3 bg-white text-black font-black uppercase italic tracking-[0.3em] transition-all",
                    "hover:bg-blue-400 hover:shadow-[0_0_30px_rgba(96,165,250,0.6)] active:scale-95",
                    "disabled:bg-white/10 disabled:text-white/20 disabled:border-white/10"
                  )}
                >
                  Confirm Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Market;
