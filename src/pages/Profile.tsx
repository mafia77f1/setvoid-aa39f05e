import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { User, Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { gameState } = useGameState();
  const { signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const stats = [
    { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-red-600', bgColor: 'bg-red-500/10' },
    { key: 'mind', label: 'INT', icon: Brain, color: 'text-blue-600', bgColor: 'bg-blue-500/10' },
    { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-emerald-600', bgColor: 'bg-emerald-500/10' },
    { key: 'agility', label: 'AGI', icon: Zap, color: 'text-amber-600', bgColor: 'bg-amber-500/10' },
  ];

  const getRankInfo = (level) => {
    if (level >= 50) return { name: 'S', color: 'text-orange-500', border: 'border-orange-500/50', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]' };
    if (level >= 40) return { name: 'A', color: 'text-purple-500', border: 'border-purple-500/50', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' };
    if (level >= 30) return { name: 'B', color: 'text-blue-500', border: 'border-blue-500/50', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]' };
    if (level >= 20) return { name: 'C', color: 'text-green-500', border: 'border-green-500/50', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]' };
    return { name: 'E', color: 'text-slate-400', border: 'border-slate-300', glow: '' };
  };

  const rank = getRankInfo(gameState.totalLevel);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await signOut();
    if (error) {
      toast({ title: 'خطأ', description: 'فشل تسجيل الخروج', variant: 'destructive' });
      setIsLoggingOut(false);
      return;
    }
    navigate('/');
  };

  return (
    <div className="h-screen w-full bg-[#f8f9fa] overflow-hidden flex flex-col font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.03),transparent_50%)]" />
      </div>

      <header className="relative z-20 flex justify-between items-center p-4">
        <h1 className="text-lg font-black italic text-slate-800 tracking-tighter uppercase">Hunter License</h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm"><Menu className="w-5 h-5 text-slate-700" /></button>
          </SheetTrigger>
          <SheetContent className="bg-white/95 border-l border-slate-200">
            <SheetHeader><SheetTitle>الإعدادات</SheetTitle></SheetHeader>
            <div className="mt-10 space-y-4">
               <Button variant="destructive" className="w-full flex gap-2" onClick={handleLogout} disabled={isLoggingOut}>
                 <LogOut className="w-4 h-4" /> تسجيل الخروج
               </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        {/* Main Card: White & Silver Edition */}
        <div className={cn(
          "relative w-full max-w-md aspect-[1/1.6] bg-[linear-gradient(135deg,#ffffff_0%,#e2e8f0_100%)] border-[3px] border-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden transition-all duration-500",
          rank.glow
        )}>
          
          {/* Subtle Silver Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

          {/* Header Section */}
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div className="p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
              {profile && (
                <PlayerQRCode 
                  playerId={profile.player_id} 
                  playerName={profile.player_name}
                  size={90}
                />
              )}
            </div>
            
            <div className={cn(
              "w-24 h-24 rounded-[2rem] bg-white/80 backdrop-blur-md border-2 flex flex-col items-center justify-center shadow-inner",
              rank.border
            )}>
              <span className="text-[9px] font-black text-slate-400 absolute top-3 tracking-[0.2em]">RANK</span>
              <span className={cn("text-5xl font-black italic mt-2", rank.color)}>{rank.name}</span>
            </div>
          </div>

          {/* User Info Section */}
          <div className="mb-8 relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-[2px] bg-slate-800" />
              <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Verified Hunter</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter truncate leading-none mb-3">
              {gameState.playerName}
            </h2>
            
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200"
              onClick={() => {
                navigator.clipboard.writeText(profile?.player_id);
                toast({ title: "تم نسخ المعرف" });
              }}
            >
              <Fingerprint className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-mono text-slate-200 tracking-widest uppercase">
                ID: {profile?.player_id?.slice(0, 12)}
              </span>
            </div>
          </div>

          {/* Stats Section: 2x2 Jabar Cards */}
          <div className="flex-1 relative z-10">
            <div className="grid grid-cols-2 gap-4 h-full max-h-[280px]">
              {stats.map((stat) => (
                <div key={stat.key} className="relative group overflow-hidden bg-white border border-slate-200 p-5 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-slate-200 transition-colors" />
                  
                  <div className={cn("p-3 rounded-2xl mb-2 shadow-sm border border-white", stat.bgColor)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                  
                  <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase mb-1">{stat.label}</span>
                  <span className="text-2xl font-black text-slate-800 tracking-tight">{gameState.levels[stat.key]}</span>
                  
                  {/* Miniature Progress Line */}
                  <div className="w-12 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={cn("h-full", stat.color.replace('text', 'bg'))}
                      style={{ width: `${(gameState.levels[stat.key] / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Decorative */}
          <div className="mt-6 pt-4 border-t border-slate-200/60 flex justify-between items-end opacity-60 relative z-10">
             <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 bg-slate-400 rounded-full" />)}
                </div>
                <span className="text-[8px] font-mono text-slate-500 uppercase">Secure Access Terminal</span>
             </div>
             <div className="text-[8px] font-black text-slate-400 tracking-widest">© HUNTER ASSOCIATION</div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
