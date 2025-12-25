import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Coins, ShoppingBag, Package, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Market = () => {
  const { gameState, purchaseItem, useItem } = useGameState();
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

  return (
    <div className="min-h-screen bg-[#020817] text-white p-4 font-sans selection:bg-blue-500/30">
      {/* خلفية تقنية مع تأثير الضباب الأزرق */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        {/* تأثير الخطوط الرقمية (HUD Lines) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-8 border-b border-blue-500/30 pb-4">
        <h1 className="text-2xl font-bold tracking-[0.2em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
          System Store
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-4 py-1 flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="font-mono font-bold text-blue-100">{gameState.gold.toLocaleString()}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto space-y-8">
        {SOLO_ITEMS.map((item) => (
          <div key={item.id} className="relative group">
            {/* إطار النافذة مثل الصورة تماماً */}
            <div className="absolute -inset-1 bg-blue-500/20 blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative bg-black/60 border-2 border-slate-200/90 p-6 shadow-[0_0_20px_rgba(30,58,138,0.5)]">
              {/* ترويسة العنصر */}
              <div className="flex justify-center mb-6">
                <div className="border border-slate-400/50 px-8 py-1 bg-slate-900/80">
                  <h2 className="text-xl font-bold tracking-wider text-white">
                    ITEM: <span className="text-blue-100">{item.name}</span>
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* الجزء الأيسر: أيقونة العنصر داخل مربع */}
                <div className="flex justify-center items-center">
                  <div className="w-32 h-32 border border-slate-500/50 flex items-center justify-center bg-black/40 relative">
                    <span className="text-6xl filter grayscale brightness-200 opacity-80">{item.icon}</span>
                    {/* زوايا المربع الصغيرة */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white" />
                  </div>
                </div>

                {/* الجزء الأيمن: المعلومات */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Acquisition Difficulty:</p>
                      <p className="text-lg font-bold text-white uppercase italic">{item.difficulty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Category:</p>
                      <p className="text-lg font-bold text-white uppercase italic">{item.category}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700/50">
                    <p className="text-2xl font-bold text-center text-blue-50 font-mono tracking-tighter">
                      Gold: {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* الوصف السفلي */}
              <div className="mt-8 text-center px-4 py-2 border-t border-slate-800/50">
                <p className="text-sm text-slate-300 italic font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* زر الشراء مدمج أسفل النافذة */}
              <button
                onClick={() => handlePurchase(item.id, item.price, item.name)}
                disabled={gameState.gold < item.price}
                className="w-full mt-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-20"
              >
                Purchase Item
              </button>
            </div>
          </div>
        ))}
      </main>

      <div className="h-32" /> {/* مساحة للسكرول */}
      <BottomNav />
    </div>
  );
};

export default Market;
