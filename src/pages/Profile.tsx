import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerSearchModal } from '@/components/PlayerSearchModal';
import { cn } from '@/lib/utils';
import { User, ShoppingBag, Menu, Search, LogOut, Shield, Copy, Fingerprint } from 'lucide-react';
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

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({ title: 'خطأ', description: 'فشل تسجيل الخروج', variant: 'destructive' });
      return;
    }
    navigate('/');
  };

  const copyPlayerId = () => {
    if (profile?.player_id) {
      navigator.clipboard.writeText(profile.player_id);
      toast({ title: 'System', description: 'ID Copied to Clipboard' });
    }
  };

  return (
    <div className="h-screen w-full bg-[#020b18] text-white font-sans overflow-hidden fixed inset-0 flex flex-col">
      {/* Background Tech Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af0a_1px,transparent_1px),linear-gradient(to_bottom,#1e40af0a_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e40af20,transparent_70%)]" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 flex justify-between items-center p-5 bg-black/40 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
            <Fingerprint className="text-blue-500 w-5 h-5 animate-pulse" />
            <h1 className="text-lg font-black tracking-[0.2em] uppercase italic text-white shadow-blue-500/50">
              Hunter License <span className="text-blue-500 text-xs">v2.0</span>
            </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setSearchModalOpen(true)} className="p-2 border border-white/10 bg-white/5 rounded hover:bg-white/20 transition-all">
            <Search className="w-5 h-5 text-slate-300" />
          </button>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-2 border border-white/10 bg-white/5 rounded">
                <Menu className="w-5 h-5 text-slate-300" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#051125] border-l border-blue-500/30 text-white">
              <SheetHeader className="mb-6 border-b border-blue-500/20 pb-4">
                <SheetTitle className="text-white uppercase tracking-widest text-right">System Console</SheetTitle>
              </SheetHeader>
              <nav className="space-y-3">
                <Link to="/market" className="flex items-center justify-end gap-3 p-4 border border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/20">
                    <div className="text-right"><p className="font-bold text-sm text-blue-400">السوق</p></div>
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center justify-end gap-3 p-4 border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10">
                  <span className="font-bold">تسجيل الخروج</span>
                  <LogOut className="w-5 h-5" />
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* The License Card - Designed to match sedark.png */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-4xl bg-[#0a1a35]/90 border border-white/20 shadow-[0_0_60px_rgba(0,0,0,1)] relative flex flex-col md:flex-row overflow-hidden backdrop-blur-xl">
          
          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-600/50" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-600/50" />

          {/* Side A: Avatar & Rank */}
          <div className="w-full md:w-[350px] p-8 bg-gradient-to-b from-blue-900/20 to-transparent border-r border-white/5 flex flex-col items-center justify-center">
            <div className="w-full aspect-square border border-white/20 p-2 bg-black/40 shadow-inner relative group">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-transparent transition-all" />
              <img src="/api/placeholder/400/400" alt="Avatar" className="w-full h-full object-cover opacity-80" />
              
              {/* Animated Scan Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_15px_#3b82f6] animate-[scan_4s_ease-in-out_infinite]" />
            </div>
            
            <div className="mt-8 text-center w-full">
               <span className="text-[10px] text-blue-400 font-black tracking-[0.4em] uppercase">Player Rank</span>
               <div className="text-7xl font-black italic text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">S</div>
            </div>
          </div>

          {/* Side B: Comprehensive Data (Strength, Int, Agility, ID) */}
          <div className="flex-1 p-8 md:p-12 space-y-8 relative">
            
            {/* Identity Header */}
            <div className="space-y-4">
               <div className="flex justify-between items-end border-b border-white/10 pb-2">
                  <div className="text-left">
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Identification Name</p>
                    <h2 className="text-3xl font-black tracking-tight text-white uppercase">{gameState.playerName || 'SEDARK'}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Clearance</p>
                    <p className="text-xs font-bold text-green-400">ACTIVE</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3 bg-white/5 p-3 border border-white/10 cursor-pointer hover:bg-white/10 transition-all" onClick={copyPlayerId}>
                  <div className="flex-1">
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Hunter UUID</p>
                    <p className="text-xs font-mono text-slate-300 truncate">{profile?.player_id || 'Generating ID...'}</p>
                  </div>
                  <Copy className="w-4 h-4 text-slate-500" />
               </div>
            </div>

            {/* Attributes Grid (The Stats you requested) */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-10">
                <div className="border-l-2 border-blue-600 pl-4 py-1">
                    <p className="text-[9px] text-blue-400 uppercase font-black">Strength (القوة)</p>
                    <p className="text-xl font-bold tracking-widest text-white">{gameState.stats?.strength || 99}</p>
                </div>
                <div className="border-l-2 border-blue-600 pl-4 py-1">
                    <p className="text-[9px] text-blue-400 uppercase font-black">Intelligence (الذكاء)</p>
                    <p className="text-xl font-bold tracking-widest text-white">{gameState.stats?.intelligence || 99}</p>
                </div>
                <div className="border-l-2 border-blue-600 pl-4 py-1">
                    <p className="text-[9px] text-blue-400 uppercase font-black">Agility (الرشاقة)</p>
                    <p className="text-xl font-bold tracking-widest text-white">{gameState.stats?.agility || 99}</p>
                </div>
                <div className="border-l-2 border-blue-600 pl-4 py-1">
                    <p className="text-[9px] text-blue-400 uppercase font-black">Sense (الحس)</p>
                    <p className="text-xl font-bold tracking-widest text-white">{gameState.stats?.sense || 99}</p>
                </div>
            </div>

            {/* Status Footer */}
            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                <div className="flex gap-2">
                    <div className="w-8 h-1 bg-blue-600" />
                    <div className="w-4 h-1 bg-white/20" />
                    <div className="w-2 h-1 bg-white/10" />
                </div>
                <p className="text-[9px] text-slate-500 font-mono italic">AUTHENTICATED BY THE SYSTEM ARCHITECT</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <BottomNav />
      <PlayerSearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0%, 100% { top: 0; opacity: 0; }
          50% { top: 100%; opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default Profile;
