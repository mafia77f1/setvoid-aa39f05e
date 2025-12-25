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
      toast({ title: 'تم الشراء', description: `حصلت على ${name}` });
    } else {
      toast({ title: 'فشل', description: 'الذهب غير كافٍ', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-28">
      {/* الخلفية التقنية */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
        <h1 className="text-lg font-bold tracking-tighter uppercase italic text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">
          System Store
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono text-sm font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
            {gameState.gold.toLocaleString()}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-10">
        {SOLO_ITEMS.map((item) => (
          <div key={item.id} className="relative group">
            {/* إطار النافذة - تم تصغير البادينج للجوال */}
            <div className="relative bg-black/70 border-[1.5px] border-slate-200 p-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              
              {/* ترويسة العنصر - نص متوهج قوي جداً */}
              <div className="flex justify-center mb-5 mt-[-1.7rem]">
                <div className="border border-slate-200 px-4 py-0.5 bg-black">
                  <h2 className="text-sm font-black tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,1)] uppercase italic">
                    ITEM: {item.name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* الجزء العلوي: الأيقونة والمعلومات الأساسية */}
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 border border-slate-500/50 flex items-center justify-center bg-black/40 relative flex-shrink-0">
                    <span className="text-4xl filter brightness-150 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      {item.icon}
                    </span>
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Difficulty:</span>
                      <span className="text-[10px] font-black text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)] uppercase">{item.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Category:</span>
                      <span className="text-[10px] font-black text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.7)] uppercase">{item.category}</span>
                    </div>
                  </div>
                </div>

                {/* السعر - توهج أبيض مركزي */}
                <div className="py-2 border-y border-slate-800/50">
                  <p className="text-xl font-black text-center text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] font-mono">
                    Gold: {item.price.toLocaleString()}
                  </p>
                </div>

                {/* الوصف */}
                <p className="text-[11px] text-center text-slate-300 italic px-2">
                  {item.description}
                </p>

                {/* زر الشراء */}
                <button
                  onClick={() => handlePurchase(item.id, item.price, item.name)}
                  disabled={gameState.gold < item.price}
                  className="w-full mt-2 py-2 bg-white/5 hover:bg-white/10 border border-white/30 text-xs font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-20"
                >
                  Purchase Item
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Market;
