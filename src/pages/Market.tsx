import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();

  // مصفوفة العناصر مع روابط الصور من الرابط الذي ارسلته
  const SOLO_ITEMS = [
    { 
      id: '1', 
      name: "Kasaka's Venom Fang", 
      category: 'Dagger', 
      difficulty: 'C', 
      price: 50000, 
      image: "https://i.ibb.co/Lz7S8yV/dagger.png", // مثال لرابط مباشر
      description: 'A dagger made from the fang of the Great Serpent Kasaka. It has a chance to cause paralysis.' 
    },
    { 
      id: '2', 
      name: "Cartenon Temple Key", 
      category: 'Key', 
      difficulty: 'S', 
      price: 2000000, 
      image: "https://i.ibb.co/V9X5S5Y/key.png", // مثال لرابط مباشر
      description: 'A key that grants access to the Double Dungeon. Use it with caution.' 
    },
    { 
      id: '3', 
      name: 'High-Grade HP Potion', 
      category: 'Consumable', 
      difficulty: 'None', 
      price: 1500, 
      image: "https://i.ibb.co/V9X5S5Y/potion.png", // مثال لرابط مباشر
      description: 'A potion that instantly restores 100% of your HP.' 
    }
  ];

  const handlePurchase = (itemId: string, price: number, name: string) => {
    if (gameState.gold >= price) {
      purchaseItem(itemId);
      playPurchase();
      toast({ title: 'System: SUCCESS', description: `Acquired ${name}` });
    } else {
      toast({ title: 'System: WARNING', description: 'Insufficient Gold', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24 relative">
      {/* خلفية ضبابية زرقاء */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.1),transparent_80%)] pointer-events-none" />

      <header className="relative z-10 flex justify-between items-center mb-10 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-black tracking-tighter uppercase italic text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
          System Store
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-400 shadow-yellow-500" />
          <span className="font-mono font-bold text-white drop-shadow-[0_0_12px_rgba(255,255,255,1)]">
            {gameState.gold.toLocaleString()}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-16">
        {SOLO_ITEMS.map((item) => (
          <div key={item.id} className="relative">
            <div className="relative bg-black/80 border-2 border-slate-200 p-4 shadow-[0_0_25px_rgba(255,255,255,0.05)] backdrop-blur-md">
              
              {/* ترويسة الاسم مع توهج ابيض خارق */}
              <div className="flex justify-center mb-6 mt-[-1.8rem]">
                <div className="border border-slate-200 px-6 py-1 bg-black">
                  <h2 className="text-[13px] font-black tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] uppercase italic">
                    ITEM: {item.name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex gap-4 items-center">
                  {/* حاوية الصور من الرابط */}
                  <div className="w-24 h-24 border border-white/30 flex items-center justify-center bg-blue-900/10 relative flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain p-1 brightness-110 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                    />
                    {/* زوايا النظام الحادة */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-center border-b border-white/10 pb-1">
                      <span className="text-[9px] text-blue-300 font-bold uppercase tracking-tighter">Difficulty</span>
                      <span className="text-sm font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,1)] italic">{item.difficulty}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-1">
                      <span className="text-[9px] text-blue-300 font-bold uppercase tracking-tighter">Category</span>
                      <span className="text-[10px] font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] uppercase">{item.category}</span>
                    </div>
                  </div>
                </div>

                {/* سعر الذهب - توهج ابيض نقي */}
                <div className="py-2 border-y border-white/20">
                  <p className="text-2xl font-black text-center text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)] font-mono italic">
                    GOLD: {item.price.toLocaleString()}
                  </p>
                </div>

                <p className="text-[11px] text-center text-slate-400 italic px-2 leading-[1.4]">
                   "{item.description}"
                </p>

                <button
                  onClick={() => handlePurchase(item.id, item.price, item.name)}
                  disabled={gameState.gold < item.price}
                  className="w-full mt-2 py-3 bg-white/5 hover:bg-white text-blue-300 hover:text-black border border-white/30 text-[10px] font-black uppercase tracking-[0.4em] transition-all active:scale-95 disabled:opacity-20"
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
