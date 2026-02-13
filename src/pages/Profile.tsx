import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, Fingerprint, IDCard } from 'lucide-react';
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
    { key: 'strength', label: 'STRENGTH', icon: Dumbbell, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { key: 'mind', label: 'INTELLIGENCE', icon: Brain, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { key: 'spirit', label: 'SPIRIT', icon: Heart, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { key: 'agility', label: 'AGILITY', icon: Zap, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  ];

  const getRankInfo = (level) => {
    if (level >= 50) return { name: 'S', color: 'text-orange-500', border: 'border-orange-600' };
    if (level >= 40) return { name: 'A', color: 'text-purple-500', border: 'border-purple-600' };
    if (level >= 30) return { name: 'B', color: 'text-blue-500', border: 'border-blue-600' };
    return { name: 'E', color: 'text-gray-400', border: 'border-gray-600' };
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
    <div className="h-screen w-full bg-black overflow-hidden flex flex-col font-sans select-none">
      {/* Overlay Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1a1a_0%,transparent_70%)] pointer-events-none" />

      <header className="relative z-20 flex justify-between items-center p-6 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-primary shadow-[0_0_10px_#primary]" />
          <h1 className="text-xl font-black italic tracking-widest text-white uppercase">Hunter License</h1>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 border border-white/10 hover:bg-white/5 transition-colors"><Menu className="w-6 h-6 text-white" /></button>
          </SheetTrigger>
          <SheetContent className="bg-black/95 border-l border-primary/50 text-white">
            <SheetHeader><SheetTitle className="text-primary font-black">SYSTEM</SheetTitle></SheetHeader>
            <div className="mt-10">
               <Button variant="destructive" className="w-full rounded-none" onClick={handleLogout} disabled={isLoggingOut}>
                 <LogOut className="w-4 h-4 mr-2" /> DISCONNECT
               </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={cn(
          "relative w-full max-w-sm bg-[#0d0d0d] border-t-2 border-x border-b-[12px] shadow-2xl p-8 flex flex-col transition-all duration-500",
          rank.border
        )}>
          
          {/* 1. QR CODE: TOP CENTER - NO BACKGROUND */}
          <div className="flex justify-center mb-8">
            <div className="relative p-2 border border-white/10">
               <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary" />
               <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary" />
               <div className="mix-blend-lighten contrast-125 brightness-110">
                 {profile && (
                   <PlayerQRCode 
                     playerId={profile.player_id} 
                     playerName={profile.player_name}
                     size={110}
                   />
                 )}
               </div>
            </div>
          </div>

          {/* 2. USER INFO: JABBAR ARRANGEMENT */}
          <div className="grid grid-cols-12 gap-4 mb-8 items-center border-y border-white/5 py-6">
            <div className="col-span-8 space-y-2">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-3 h-3 text-primary opacity-70" />
                <span className="text-[9px] font-black text-primary tracking-[0.3em] uppercase">Identity Verified</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter leading-none uppercase">
                {gameState.playerName}
              </h2>
              <div 
                className="inline-flex items-center gap-2 cursor-pointer group hover:bg-white/5 p-1 transition-all"
                onClick={() => {
                  navigator.clipboard.writeText(profile?.player_id);
                  toast({ title: "ID COPIED" });
                }}
              >
                <IDCard className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-mono text-muted-foreground tracking-tighter">
                  USR_{profile?.player_id?.slice(0, 15).toUpperCase()}
                </span>
                <Copy className="w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="col-span-4 flex flex-col items-center justify-center border-l border-white/10 h-full">
              <span className="text-[9px] font-black text-muted-foreground mb-1">RANK</span>
              <span className={cn("text-6xl font-black italic leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]", rank.color)}>
                {rank.name}
              </span>
            </div>
          </div>

          {/* 3. STATS: ORGANIZED TECH LIST */}
          <div className="flex-1 space-y-4">
             <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground tracking-[0.2em] mb-2">
                <span>COMBAT PARAMETERS</span>
                <span>LVL</span>
             </div>
             <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.key} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
                       <span className="text-[10px] font-black text-white/90 uppercase">{stat.label}</span>
                    </div>
                    <span className={cn("font-mono font-black text-sm", stat.color)}>{gameState.levels[stat.key]}</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full relative overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", stat.color.replace('text', 'bg'))}
                      style={{ width: `${(gameState.levels[stat.key] / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
             </div>
          </div>

          {/* Glitch Effect Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20 animate-pulse" />
        </div>
      </main>

      <BottomNav />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .mix-blend-lighten img { filter: invert(1) hue-rotate(180deg) brightness(1.5); mix-blend-mode: lighten; }
      `}} />
    </div>
  );
};

export default Profile;
