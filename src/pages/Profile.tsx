import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, Fingerprint } from 'lucide-react';
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
    if (level >= 50) return { name: 'S', color: 'text-orange-500', border: 'border-orange-500' };
    if (level >= 40) return { name: 'A', color: 'text-purple-500', border: 'border-purple-500' };
    if (level >= 30) return { name: 'B', color: 'text-blue-500', border: 'border-blue-500' };
    return { name: 'E', color: 'text-gray-400', border: 'border-gray-500' };
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
      {/* Background Cyber Effect */}
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <header className="relative z-20 flex justify-between items-center p-6 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-primary animate-pulse" />
          <h1 className="text-xl font-black italic tracking-[0.2em] text-white">HUNTER.OS</h1>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 border border-white/20 bg-white/5 hover:bg-white/10 transition-all"><Menu className="w-6 h-6 text-white" /></button>
          </SheetTrigger>
          <SheetContent className="bg-black/95 border-l border-primary/50 text-white">
            <SheetHeader><SheetTitle className="text-primary font-black">SYSTEM MENU</SheetTitle></SheetHeader>
            <div className="mt-10 space-y-4">
               <Button variant="destructive" className="w-full rounded-none font-bold" onClick={handleLogout} disabled={isLoggingOut}>
                 <LogOut className="w-4 h-4 mr-2" /> DISCONNECT SESSION
               </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={cn(
          "relative w-full max-w-sm bg-[#0a0a0a] border-t-4 border-r-2 border-l-2 border-b-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 flex flex-col",
          rank.border
        )}>
          
          {/* Transparent QR Code TOP CENTER */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative p-1 border-2 border-dashed border-primary/30">
               <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary" />
               <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary" />
               {profile && (
                 <div className="mix-blend-lighten opacity-90">
                    <PlayerQRCode 
                      playerId={profile.player_id} 
                      playerName={profile.player_name}
                      size={120}
                    />
                 </div>
               )}
            </div>
          </div>

          {/* User Info Grid - JABBAR Arrangement */}
          <div className="flex items-stretch justify-between mb-10 border-y border-white/10 py-6">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Fingerprint className="w-3 h-3" />
                <span className="text-[9px] font-black tracking-[0.3em]">IDENTIFICATION</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{gameState.playerName}</h2>
              <div 
                className="group flex items-center gap-2 mt-2 cursor-pointer active:scale-95 transition-transform"
                onClick={() => {
                  navigator.clipboard.writeText(profile?.player_id);
                  toast({ title: "COPIED TO CLIPBOARD" });
                }}
              >
                <div className="px-2 py-0.5 bg-primary/10 border border-primary/30">
                  <span className="text-[10px] font-mono text-primary tracking-widest uppercase">
                    ID: {profile?.player_id?.slice(0, 14)}
                  </span>
                </div>
                <Copy className="w-3 h-3 text-primary/50 group-hover:text-primary" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center pl-6 border-l border-white/10">
              <span className="text-[10px] font-black text-muted-foreground mb-1 uppercase tracking-widest">RANK</span>
              <div className={cn("text-6xl font-black italic leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]", rank.color)}>
                {rank.name}
              </div>
            </div>
          </div>

          {/* Stats - Tech List */}
          <div className="flex-1 space-y-4">
             <div className="flex justify-between items-center text-[10px] font-black tracking-[0.2em] text-muted-foreground border-b border-white/5 pb-2">
                <span>PARAMETER</span>
                <span>LEVEL</span>
             </div>
             <div className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.key} className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                       <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
                       <span className="text-[11px] font-black text-white/80">{stat.label}</span>
                    </div>
                    <span className={cn("font-mono font-bold", stat.color)}>{gameState.levels[stat.key]}</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full">
                    <div 
                      className={cn("h-full transition-all duration-1000", stat.color.replace('text', 'bg'))}
                      style={{ width: `${(gameState.levels[stat.key] / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
             </div>
          </div>

          {/* Glitch Overlay */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 animate-scan" />
        </div>
      </main>

      <BottomNav />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}} />
    </div>
  );
};

export default Profile;
