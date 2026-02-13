import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { User, Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, Fingerprint, Activity, Star, Search, ScanLine, UserPlus, MessageSquare, Sword, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const { gameState } = useGameState();
  const { signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResult, setShowResult] = useState(false);

  const statsIcons = [
    { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { key: 'mind', label: 'INT', icon: Brain, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
    { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-slate-300', bgColor: 'bg-slate-300/10' },
    { key: 'agility', label: 'AGI', icon: Zap, color: 'text-blue-300', bgColor: 'bg-blue-300/10' },
  ];

  const getEncryptionStatus = (status) => {
    if (status === 'Active') return { label: 'Active', color: 'text-blue-400' };
    if (status === 'Progress') return { label: 'Progress', color: 'text-slate-400' };
    return { label: 'Failed', color: 'text-red-500' };
  };

  const encryption = getEncryptionStatus(profile?.encryption || 'Active');

  const getRankInfo = (level) => {
    if (level >= 50) return { name: 'S', color: 'text-blue-500', border: 'border-blue-500/50', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' };
    if (level >= 40) return { name: 'A', color: 'text-blue-400', border: 'border-blue-400/50', glow: 'shadow-[0_0_20px_rgba(96,165,250,0.2)]' };
    return { name: 'E', color: 'text-slate-500', border: 'border-slate-500/50', glow: '' };
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
    <div className="h-screen w-full bg-[#050505] overflow-hidden flex flex-col font-sans text-white">
      <header className="relative z-20 flex justify-between items-center p-4">
        <h1 className="text-lg font-black italic text-blue-500 tracking-tighter uppercase">Hunter License</h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 bg-slate-900/50 border border-blue-500/20 rounded-lg backdrop-blur-md"><Menu className="w-5 h-5 text-blue-400" /></button>
          </SheetTrigger>
          <SheetContent className="bg-[#050505]/95 border-l border-blue-500/30 text-white">
            <SheetHeader><SheetTitle className="text-blue-400 font-black">الإعدادات</SheetTitle></SheetHeader>
            <div className="mt-10 space-y-4">
               <Button variant="destructive" className="w-full bg-red-950/20 border border-red-500/30" onClick={handleLogout} disabled={isLoggingOut}>
                 <LogOut className="w-4 h-4" /> تسجيل الخروج
               </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={cn(
          "relative w-full max-w-md aspect-[1/1.6] bg-gradient-to-br from-[#0f172a] via-[#050505] to-black border border-blue-500/20 rounded-[2.5rem] p-6 shadow-2xl flex flex-col overflow-hidden",
          rank.glow
        )}>
          
          {/* TOP SECTION: QR, RANK, SEARCH */}
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex flex-col gap-2">
              <div className="p-1 bg-white rounded-xl shadow-lg">
                {profile && <PlayerQRCode playerId={profile.player_id} playerName={profile.player_name} size={60} />}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-7 px-3 text-[8px] font-black uppercase bg-blue-600/10 border-blue-500/30 text-blue-400 rounded-full">
                    <Search className="w-3 h-3 mr-1" /> بحث
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] bg-[#050505] border-blue-500/40 rounded-[2.5rem] text-white p-0 overflow-hidden">
                  {!showResult ? (
                    <div className="p-8 space-y-6">
                      <Input placeholder="اسم الصياد..." className="h-12 bg-slate-900 border-blue-500/20" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      <Button className="w-full bg-blue-600" onClick={() => setShowResult(true)}>ابدأ البحث</Button>
                    </div>
                  ) : (
                    <div className="p-5 flex flex-col items-center">
                      <div className="w-full border border-blue-500/30 bg-black/60 rounded-[2rem] p-5 mb-4">
                        <h3 className="text-2xl font-black text-white">{profile?.encryption === 'Active' ? gameState.playerName : "???"}</h3>
                        <p className="text-[10px] font-mono text-blue-500/60 mb-4">ID: {profile?.player_id}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {statsIcons.map(s => (
                            <div key={s.key} className="bg-white/5 p-2 rounded-xl border border-white/5 flex justify-between items-center">
                               <span className="text-[9px] text-slate-500">{s.label}</span>
                               <span className="font-black text-blue-400">{profile?.encryption === 'Active' ? gameState.levels[s.key] : "?"}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 w-full">
                        <Button className="h-14 bg-blue-600 rounded-2xl"><UserPlus className="w-5 h-5"/></Button>
                        <Button className="h-14 bg-slate-800 rounded-2xl"><MessageSquare className="w-5 h-5"/></Button>
                        <Button className="h-14 bg-black border border-blue-500/50 rounded-2xl text-red-500"><Sword className="w-5 h-5"/></Button>
                      </div>
                      <Button variant="ghost" className="mt-2 text-xs" onClick={() => setShowResult(false)}>رجوع</Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            <div className={cn("w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center backdrop-blur-md", rank.border)}>
              <span className="text-[7px] font-black text-blue-500 tracking-widest">RANK</span>
              <span className={cn("text-3xl font-black italic", rank.color)}>{rank.name}</span>
            </div>
          </div>

          {/* USER INFO */}
          <div className="space-y-3 mb-5 relative z-10">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Identity :</p>
              <h2 className="text-2xl font-black text-white uppercase truncate">{gameState.playerName}</h2>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Level :</p>
              <span className="text-4xl font-black text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{gameState.totalLevel}</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase flex items-center gap-1">
                <Fingerprint className="w-3 h-3 text-blue-500" /> ID :
              </p>
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => {
                  navigator.clipboard.writeText(profile?.player_id);
                  toast({ title: "تم نسخ المعرف" });
                }}
              >
                <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10 transition-colors group-hover:bg-blue-500/20">
                  {profile?.player_id}
                </span>
                <Copy className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
              </div>
            </div>
          </div>

          {/* COMPACT STATS CARDS */}
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-3 h-3 text-blue-500" />
              <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Params :</p>
              <div className="h-[0.5px] flex-1 bg-blue-500/20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {statsIcons.map((stat) => (
                <div key={stat.key} className="bg-slate-900/40 border border-white/5 p-2.5 rounded-[1.2rem] flex flex-col gap-1.5 transition-all hover:border-blue-500/20 group">
                  <div className="flex justify-between items-center">
                    <div className={cn("p-1.5 rounded-lg", stat.bgColor)}><stat.icon className={cn("w-3.5 h-3.5", stat.color)} /></div>
                    <span className="text-lg font-black text-white">{gameState.levels[stat.key]}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase">{stat.label}</span>
                    <div className="w-full h-[3px] bg-black/40 rounded-full mt-0.5 overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: `${gameState.levels[stat.key]}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center relative z-10">
            <div className="flex flex-col"><span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">Encryption</span><span className={cn("text-[9px] font-bold uppercase", encryption.color)}>{encryption.label}</span></div>
            <div className="text-right flex flex-col"><span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">License Ver</span><span className="text-[9px] font-bold text-blue-500/80">v0.1-DARK</span></div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
