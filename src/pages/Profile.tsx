import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerSearchModal } from '@/components/PlayerSearchModal';
import { cn } from '@/lib/utils';
import { User, ShoppingBag, Menu, Search, LogOut, Settings, Shield, QrCode } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { gameState } = useGameState();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const menuItems = [
    { key: 'profile', label: 'البروفايل', labelEn: 'Profile', icon: User, color: 'text-white', borderColor: 'border-white/40', bgColor: 'bg-white/10', path: null },
    { key: 'market', label: 'السوق', labelEn: 'Market', icon: ShoppingBag, color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10', path: '/market' },
  ];

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({ title: 'خطأ', description: 'فشل تسجيل الخروج', variant: 'destructive' });
      return;
    }
    navigate('/');
  };

  return (
    // prevent-scroll ensures the page doesn't move
    <div className="h-screen w-full bg-[#020b18] text-white font-sans overflow-hidden fixed inset-0 flex flex-col">
      
      {/* Background Tech Grid (Same as the image) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af_1px,transparent_1px),linear-gradient(to_bottom,#1e40af_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-radial-gradient from-blue-900/20 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm border-b border-blue-500/30">
        <h1 className="text-xl font-black tracking-[0.2em] uppercase italic text-blue-400 drop-shadow-[0_0_10px_#3b82f6]">
          System Player ID
        </h1>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setSearchModalOpen(true)} className="p-2 bg-blue-500/10 border border-blue-500/40 rounded-sm hover:bg-blue-500/30">
            <Search className="w-5 h-5 text-blue-400" />
          </button>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-2 bg-blue-500/10 border border-blue-500/40 rounded-sm">
                <Menu className="w-5 h-5 text-blue-400" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#051125]/95 border-l border-blue-500/30 text-white">
              <SheetHeader className="mb-6 border-b border-blue-500/20 pb-4">
                <SheetTitle className="text-blue-400 uppercase tracking-widest text-right">System Menu</SheetTitle>
              </SheetHeader>
              <nav className="space-y-4">
                {menuItems.map((item) => (
                  <Link key={item.key} to={item.path || '#'} onClick={() => setSheetOpen(false)} className={cn("flex items-center justify-end gap-3 p-4 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/20 transition-all")}>
                    <div className="text-right">
                      <p className="font-bold text-sm">{item.label}</p>
                      <p className="text-[10px] opacity-50">{item.labelEn}</p>
                    </div>
                    <item.icon className="w-5 h-5" />
                  </Link>
                ))}
                <button onClick={handleLogout} className="w-full flex items-center justify-end gap-3 p-4 border border-red-500/30 bg-red-500/5 text-red-400">
                  <span>تسجيل الخروج</span>
                  <LogOut className="w-5 h-5" />
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Hunter Card Area (Fixed Center) */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[900px] aspect-[16/9] bg-[#0a1a35]/80 border-2 border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.2)] relative overflow-hidden backdrop-blur-md flex">
          
          {/* Card Decorative Elements (Scanning lines) */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-400/50 animate-[scan_3s_linear_infinite]" />
          
          {/* Left Side: Avatar Box (Same as Image) */}
          <div className="w-[40%] p-8 flex flex-col items-center justify-center border-r border-blue-500/20">
            <div className="w-full aspect-square border-2 border-blue-400/60 p-1 relative group">
              {/* Inner glowing corners */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white" />
              
              <div className="w-full h-full bg-blue-900/40 overflow-hidden relative">
                 {/* This represents the S-Rank Dagger/Avatar from your image */}
                 <img 
                   src="/api/placeholder/400/400" 
                   alt="Hunter Avatar" 
                   className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a35] to-transparent opacity-60" />
              </div>
            </div>
            
            <div className="mt-6 w-full">
               <p className="text-xs text-blue-400 font-bold uppercase tracking-[0.2em] mb-1 text-left">Class:</p>
               <p className="text-5xl font-black text-white italic drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">S</p>
            </div>
          </div>

          {/* Right Side: Data Fields (Matching the image layout) */}
          <div className="flex-1 p-10 flex flex-col justify-center space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            
            <div className="space-y-1 text-left border-l-2 border-blue-500/30 pl-4">
              <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">First Name</p>
              <p className="text-3xl font-black uppercase tracking-wider">{gameState.playerName || 'SE DARK'}</p>
            </div>

            <div className="space-y-1 text-left border-l-2 border-blue-500/30 pl-4">
              <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Family Name</p>
              <p className="text-2xl font-bold opacity-80">—</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1 text-left border-l-2 border-blue-500/30 pl-4">
                    <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Status:</p>
                    <p className="text-xl font-bold text-green-400 uppercase tracking-tighter shadow-green-500/20">Awakened</p>
                </div>
                <div className="space-y-1 text-left border-l-2 border-blue-500/30 pl-4">
                    <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Level:</p>
                    <p className="text-xl font-bold text-white uppercase">{gameState.totalLevel}</p>
                </div>
            </div>

            <div className="space-y-1 text-left border-l-2 border-blue-500/30 pl-4">
              <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Nationality:</p>
              <p className="text-lg font-bold opacity-60 italic">Shadow Realm</p>
            </div>

            {/* Subtle Tech Decor at the bottom right */}
            <div className="absolute bottom-4 right-4 flex gap-1 opacity-30">
                <div className="w-1 h-4 bg-blue-500" />
                <div className="w-1 h-4 bg-blue-400" />
                <div className="w-1 h-4 bg-blue-300" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <BottomNav />
      <PlayerSearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />

      {/* Style for the scan animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(500px); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default Profile;
