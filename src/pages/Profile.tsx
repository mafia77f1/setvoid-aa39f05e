import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { User, Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut } from 'lucide-react';
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
    if (level >= 50) return { name: 'S', color: 'text-orange-500', border: 'border-orange-500/50' };
    if (level >= 40) return { name: 'A', color: 'text-purple-500', border: 'border-purple-500/50' };
    if (level >= 30) return { name: 'B', color: 'text-blue-500', border: 'border-blue-500/50' };
    if (level >= 20) return { name: 'C', color: 'text-green-500', border: 'border-green-500/50' };
    return { name: 'E', color: 'text-gray-400', border: 'border-gray-400/50' };
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
      </div>

      <header className="relative z-20 flex justify-between items-center p-4">
        <h1 className="text-lg font-black italic text-primary tracking-tighter">HUNTER LICENSE</h1>
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
          "relative w-full max-w-md aspect-[1/1.6] bg-card border-2 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden",
          rank.border
        )}>
          
          {/* QR Code at TOP CENTER */}
          <div className="flex flex-col items-center mb-6">
            <div className="p-2 bg-white rounded-xl shadow-lg border-4 border-gray-800">
               {profile && (
                 <PlayerQRCode 
                   playerId={profile.player_id} 
                   playerName={profile.player_name}
                   size={100}
                 />
               )}
            </div>
            <p className="text-[10px] font-mono mt-2 text-primary opacity-60 uppercase tracking-widest">Digital Auth Tag</p>
          </div>

          {/* Info Section: Rank & Name */}
          <div className="flex justify-between items-start mb-6">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Hunter Name</p>
              <h2 className="text-2xl font-black text-foreground leading-none">{gameState.playerName}</h2>
              <div className="flex items-center gap-1 mt-1" onClick={() => {
                navigator.clipboard.writeText(profile?.player_id);
                toast({ title: "تم نسخ المعرف" });
              }}>
                <span className="text-[10px] font-mono text-muted-foreground">ID: {profile?.player_id?.slice(0, 12)}...</span>
                <Copy className="w-3 h-3 text-muted-foreground cursor-pointer" />
              </div>
            </div>
            <div className={cn(
              "w-16 h-16 rounded-xl bg-gray-800/80 border-2 flex items-center justify-center",
              rank.border
            )}>
              <span className={cn("text-4xl font-black italic", rank.color)}>{rank.name}</span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Combat Parameters</span>
              <div className="flex-1 h-[1px] bg-primary/20" />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {stats.map((stat) => (
                <div key={stat.key} className="flex items-center gap-3 bg-muted/20 p-2.5 rounded-xl border border-white/5">
                  <div className={cn("p-1.5 rounded-lg", stat.bgColor)}>
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-muted-foreground">{stat.label}</span>
                      <span className="text-xs font-black">{gameState.levels[stat.key]}</span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", stat.color.replace('text', 'bg'))}
                        style={{ width: `${(gameState.levels[stat.key] / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Decorative */}
          <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-center opacity-40">
             <div className="text-[8px] font-mono uppercase">System Active // Hunter.OS</div>
             <div className="text-[8px] font-mono uppercase tracking-[0.2em]">Rank: {rank.name} Class</div>
          </div>

          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px]" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
