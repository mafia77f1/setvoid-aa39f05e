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
    { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { key: 'mind', label: 'INT', icon: Brain, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { key: 'agility', label: 'AGI', icon: Zap, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  ];

  const getRankInfo = (level) => {
    if (level >= 50) return { name: 'S', color: 'text-orange-500', border: 'border-orange-500/50', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]' };
    if (level >= 40) return { name: 'A', color: 'text-purple-500', border: 'border-purple-500/50', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]' };
    if (level >= 30) return { name: 'B', color: 'text-blue-500', border: 'border-blue-500/50', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]' };
    if (level >= 20) return { name: 'C', color: 'text-green-500', border: 'border-green-500/50', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.2)]' };
    return { name: 'E', color: 'text-gray-400', border: 'border-gray-400/50', glow: '' };
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
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_70%)]" />
      </div>

      <header className="relative z-20 flex justify-between items-center p-4">
        <h1 className="text-lg font-black italic text-primary tracking-tighter uppercase">Hunter License</h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 bg-card border border-primary/20 rounded-lg"><Menu className="w-5 h-5" /></button>
          </SheetTrigger>
          <SheetContent className="bg-card/95 border-l border-primary/30">
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
        <div className={cn(
          "relative w-full max-w-md aspect-[1/1.6] bg-gradient-to-b from-card to-background border-2 rounded-[2.5rem] p-8 shadow-2xl flex flex-col overflow-hidden transition-all duration-500",
          rank.border,
          rank.glow
        )}>
          
          {/* Header Section: QR & Rank */}
          <div className="flex justify-between items-start mb-10">
            <div className="relative">
              <div className="bg-transparent p-0">
                {profile && (
                  <PlayerQRCode 
                    playerId={profile.player_id} 
                    playerName={profile.player_name}
                    size={90}
                  />
                )}
              </div>
            </div>
            
            <div className={cn(
              "w-24 h-24 rounded-3xl bg-black/20 backdrop-blur-xl border-2 flex flex-col items-center justify-center relative overflow-hidden",
              rank.border
            )}>
              <span className="text-[9px] font-black opacity-40 absolute top-2 tracking-[0.2em]">RANK</span>
              <span className={cn("text-5xl font-black italic mt-1", rank.color)}>{rank.name}</span>
            </div>
          </div>

          {/* User Info Section */}
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-black text-foreground tracking-tight truncate mb-2 uppercase">
              {gameState.playerName}
            </h2>
            
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl cursor-pointer hover:bg-white/[0.05] transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(profile?.player_id);
                toast({ title: "تم نسخ المعرف بنجاح" });
              }}
            >
              <Fingerprint className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                ID: {profile?.player_id?.slice(0, 10)}
              </span>
              <Copy className="w-3 h-3 text-primary/40 ml-1" />
            </div>
          </div>

          {/* Stats Section: Grid 2x2 Layout */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">Parameters</span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.key} className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center gap-2 hover:border-primary/30 transition-all group">
                  <div className={cn("p-2 rounded-xl mb-1", stat.bgColor)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">{stat.label}</span>
                    <span className="text-xl font-black">{gameState.levels[stat.key]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Decorative */}
          <div className="mt-6 pt-6 border-t border-primary/10 flex justify-between items-center opacity-30">
             <div className="text-[8px] font-mono tracking-widest uppercase">Encryption: Active</div>
             <div className="text-[8px] font-mono tracking-widest uppercase">Hunter License v2.0</div>
          </div>

          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] opacity-10" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
