import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Coins } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Market = () => {
  const { gameState, purchaseItem } = useGameState();
  const { playPurchase } = useSoundEffects();

  // مصفوفة العناصر مع روابط الصور
  const SOLO_ITEMS = [
    { 
      id: '1', 
      name: 'Leather Pouch', 
      category: 'Miscellaneous', 
      difficulty: 'None', 
      price: 1500000, 
      // ضع رابط الصورة الحقيقية هنا (مثلاً: /images/pouch.png)
      image: "https://i.ibb.co/Lz7S8yV/leather-pouch.png", 
      description: 'A pouch for carrying money. If you open it, you will get gold.' 
    },
    { 
      id: '2', 
      name: "Kasaka's Venom", 
      category: 'Elixir', 
      difficulty: 'A', 
      price: 50000, 
      image: "https://i.ibb.co/V9X5S5Y/venom.png",
      description: 'A purified poison from the Great Serpent. Grants permanent defense buff.' 
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
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24 relative overflow-hidden">
      {/* تأثيرات الخلفية */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.1),transparent_70%)] pointer-events-none" />

      <header className="relative z-10 flex justify-between items-center mb-10 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-tighter uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]">
          System Store
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="font-mono font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,1)]">
            {gameState.gold.toLocaleString()}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-14">
        {SOLO_ITEMS.map((item) => (
          <div key={item.id} className="relative">
            {/* إطار العنصر بتصميم سولو ليفلينج */}
            <div className="relative bg-black/70 border-2 border-slate-200 p-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              
              {/* ترويسة الاسم مع توهج أبيض قوي جداً */}
              <div className="flex justify-center mb-6 mt-[-1.8rem]">
                <div className="border border-slate-200 px-5 py-1 bg-black shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  <h2 className="text-sm font-black tracking-[0.15em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] uppercase italic text-center">
                    ITEM: {item.name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex gap-4 items-center">
                  {/* حاوية الصورة الحقيقية */}
                  <div className="w-24 h-24 border border-white/20 flex items-center justify-center bg-black/40 relative flex-shrink-0 overflow-hidden shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain p-2 brightness-125 contrast-125 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                    />
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white" />
                  </div>

                  {/* البيانات الجانبية مع توهج أبيض */}
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-center border-b border-white/10 pb-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Diff:</span>
                      <span className="text-xs font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)] italic">{item.difficulty}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Category:</span>
                      <span className="text-[10px] font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)] italic">{item.category}</span>
                    </div>
                  </div>
                </div>

                {/* سعر الذهب بتوهج قوي */}
                <div className="py-2 border-y border-white/10 bg-white/5">
                  <p className="text-xl font-black text-center text-white drop-shadow-[0_0_18px_rgba(255,255,255,1)] font-mono tracking-tighter italic">
                    GOLD: {item.price.toLocaleString()}
                  </p>
                </div>

                {/* الوصف */}
                <p className="text-[11px] text-center text-slate-300 italic px-2 leading-tight opacity-80">
                   "{item.description}"
                </p>

                {/* زر الشراء */}
                <button
                  onClick={() => handlePurchase(item.id, item.price, item.name)}
                  disabled={gameState.gold < item.price}
                  className="w-full mt-2 py-2.5 bg-white/10 hover:bg-white/20 border border-white/40 text-[10px] font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] uppercase tracking-[0.3em] transition-all active:scale-95 disabled:opacity-20"
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
