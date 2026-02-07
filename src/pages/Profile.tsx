import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { HolographicProfile } from '@/components/HolographicProfile';
import { cn } from '@/lib/utils';
import { User, ShoppingBag, ChevronRight, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const Profile = () => {
  const { gameState } = useGameState();
  const [sheetOpen, setSheetOpen] = useState(false);

  const menuItems = [
    { key: 'profile', label: 'البروفايل', labelEn: 'Profile', icon: User, color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10', path: null },
    { key: 'market', label: 'السوق', labelEn: 'Market', icon: ShoppingBag, color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10', path: '/market' },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans pb-24">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header with Burger Menu */}
        <header className="flex justify-between items-center p-4 border-b border-blue-500/30">
          <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
            Player Profile
          </h1>
          
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-3 bg-blue-500/20 border border-blue-500/40 rounded-lg hover:bg-blue-500/30 transition-all">
                <Menu className="w-5 h-5 text-blue-400" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-black/95 border-l border-blue-500/30 p-0">
              <SheetHeader className="p-4 border-b border-blue-500/20">
                <SheetTitle className="text-sm font-bold tracking-[0.15em] uppercase text-blue-400 text-right">
                  القائمة
                </SheetTitle>
              </SheetHeader>
              
              <ScrollArea className="flex-1 p-3">
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    
                    if (item.path) {
                      return (
                        <Link
                          key={item.key}
                          to={item.path}
                          onClick={() => setSheetOpen(false)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border transition-all group",
                            item.borderColor,
                            item.bgColor,
                            "hover:scale-[1.02]"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg border flex items-center justify-center",
                            item.borderColor,
                            item.bgColor
                          )}>
                            <Icon className={cn("w-5 h-5", item.color)} />
                          </div>
                          <div className="flex-1 text-right">
                            <p className={cn("font-bold text-sm", item.color)}>{item.label}</p>
                            <p className="text-[10px] text-slate-500">{item.labelEn}</p>
                          </div>
                          <ChevronRight className={cn("w-4 h-4", item.color, "rotate-180")} />
                        </Link>
                      );
                    }
                    
                    return (
                      <div
                        key={item.key}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border",
                          item.borderColor,
                          item.bgColor,
                          "shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg border flex items-center justify-center",
                          item.borderColor,
                          item.bgColor
                        )}>
                          <Icon className={cn("w-5 h-5", item.color)} />
                        </div>
                        <div className="flex-1 text-right">
                          <p className={cn("font-bold text-sm", item.color)}>{item.label}</p>
                          <p className="text-[10px] text-slate-500">{item.labelEn}</p>
                        </div>
                      </div>
                    );
                  })}
                </nav>
              </ScrollArea>

              {/* Player Info Mini */}
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-blue-500/20 bg-black/90">
                <div className="bg-blue-950/30 border border-blue-500/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400">المستوى الكلي</p>
                  <p className="text-2xl font-black text-blue-400">{gameState.totalLevel}</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="p-4">
          <div className="max-w-lg mx-auto">
            <HolographicProfile gameState={gameState} />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
