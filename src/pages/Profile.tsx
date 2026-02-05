import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { HolographicProfile } from '@/components/HolographicProfile';
import { cn } from '@/lib/utils';
import { User, ShoppingBag, ChevronRight, X, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

const Profile = () => {
  const { gameState } = useGameState();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<'profile' | 'market'>('profile');

  const menuItems = [
    { key: 'profile', label: 'البروفايل', labelEn: 'Profile', icon: User, color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
    { key: 'market', label: 'السوق', labelEn: 'Market', icon: ShoppingBag, color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white font-sans pb-24">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed right-0 top-0 h-full z-50 transition-all duration-300 ease-in-out",
            sidebarOpen ? "w-64" : "w-0"
          )}
        >
          {/* Sidebar Content */}
          <div className={cn(
            "h-full bg-black/90 border-l border-blue-500/30 flex flex-col transition-opacity duration-300",
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            {/* Header */}
            <div className="p-4 border-b border-blue-500/20 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-blue-400">القائمة</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Menu Items */}
            <ScrollArea className="flex-1 p-3">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.key;
                  
                  if (item.key === 'market') {
                    return (
                      <Link
                        key={item.key}
                        to="/market"
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
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key as any)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border transition-all",
                        isActive 
                          ? `${item.borderColor} ${item.bgColor} shadow-[0_0_15px_rgba(59,130,246,0.2)]`
                          : "border-slate-700/50 bg-black/40 hover:border-slate-600"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg border flex items-center justify-center",
                        isActive ? `${item.borderColor} ${item.bgColor}` : "border-slate-700 bg-slate-800/50"
                      )}>
                        <Icon className={cn("w-5 h-5", isActive ? item.color : "text-slate-500")} />
                      </div>
                      <div className="flex-1 text-right">
                        <p className={cn("font-bold text-sm", isActive ? item.color : "text-slate-400")}>{item.label}</p>
                        <p className="text-[10px] text-slate-500">{item.labelEn}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Player Info Mini */}
            <div className="p-3 border-t border-blue-500/20">
              <div className="bg-blue-950/30 border border-blue-500/20 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400">المستوى الكلي</p>
                <p className="text-2xl font-black text-blue-400">{gameState.totalLevel}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar Toggle Button (when closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed right-4 top-4 z-50 p-3 bg-blue-500/20 border border-blue-500/40 rounded-lg hover:bg-blue-500/30 transition-all"
          >
            <Menu className="w-5 h-5 text-blue-400" />
          </button>
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 p-4 transition-all duration-300",
          sidebarOpen ? "mr-64" : "mr-0"
        )}>
          {/* Header */}
          <header className="flex justify-between items-center mb-6 border-b border-blue-500/30 pb-3">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-blue-400" />
                </button>
              )}
              <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
                {activeSection === 'profile' ? 'Player Profile' : 'Market'}
              </h1>
            </div>
          </header>

          {/* Content */}
          <div className="max-w-lg mx-auto">
            {activeSection === 'profile' && (
              <HolographicProfile gameState={gameState} />
            )}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
