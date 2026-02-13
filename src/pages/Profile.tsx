import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { User, Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, Fingerprint, Activity, Star, Search, ScanLine, Smartphone } from 'lucide-react';
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
  const [searchId, setSearchId] = useState('');

  const stats = [
    { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-red-600', bgColor: 'bg-red-500/10' },
    { key: 'mind', label: 'INT', icon: Brain, color: 'text-blue-600', bgColor: 'bg-blue-500/10' },
    { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-emerald-600', bgColor: 'bg-emerald-500/10' },
    { key: 'agility', label: 'AGI', icon: Zap, color: 'text-amber-600', bgColor: 'bg-amber-500/10' },
  ];

  const getEncryptionStatus = () => {
    if (!profile?.last_active) return { label: 'Active', color: 'text-emerald-500' };
    const lastActive = new Date(profile.last_active);
    const now = new Date();
    const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return { label: 'Active', color: 'text-emerald-500' };
    if (diffDays < 14) return { label: 'Progress', color: 'text-amber-500' };
    return { label: 'Failed', color: 'text-red-500' };
  };

  const encryption = getEncryptionStatus();
  const rank = ((level) => {
    if (level >= 50) return { name: 'S', color: 'text-orange-500', border: 'border-orange-500/50', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]' };
    if (level >= 40) return { name: 'A', color: 'text-purple-500', border: 'border-purple-500/50', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' };
    if (level >= 30) return { name: 'B', color: 'text-blue-500', border: 'border-blue-500/50', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]' };
    if (level >= 20) return { name: 'C', color: 'text-green-500', border: 'border-green-500/50', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]' };
    return { name: 'E', color: 'text-slate-400', border: 'border-slate-300', glow: '' };
  })(gameState.totalLevel);

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
    <div className="h-screen w-full bg-[#f0f2f5] overflow-hidden flex flex-col font-sans">
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
        <div className={cn(
          "relative w-full max-w-md aspect-[1/1.6] bg-[linear-gradient(135deg,#ffffff 0%,#eef2f7 100%)] border-[1px] border-white rounded-[2.5rem] p-6 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden",
          rank.glow
        )}>
          
          {/* TOP SECTION: QR & RANK & SEARCH */}
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex flex-col gap-2">
              <div className="p-1 bg-white rounded-xl shadow-sm border border-slate-100">
                {profile && <PlayerQRCode playerId={profile.player_id} playerName={profile.player_name} size={65} />}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-[9px] font-bold uppercase gap-1 bg-white/50 backdrop-blur-sm border-slate-200">
                    <Search className="w-3 h-3" /> البحث عن لاعب
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white/95 border-slate-200">
                  <DialogHeader><DialogTitle className="text-center font-black italic">HUNTER SEARCH</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">البحث بواسطة ID</p>
                      <div className="flex gap-2">
                        <Input placeholder="Enter Player ID..." className="h-10 font-mono text-xs" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
                        <Button className="bg-slate-900"><Search className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    <div className="relative py-2"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div><div className="relative flex justify-center text-[8px] uppercase font-bold"><span className="bg-white px-2 text-slate-400">OR</span></div></div>
                    <Button variant="outline" className="w-full h-12 gap-3 border-2 border-dashed border-slate-300 hover:border-primary group transition-all" onClick={() => window.open('camera://')}>
                      <ScanLine className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-black italic text-sm">فتح ماسح الباركود</span>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className={cn("w-20 h-20 rounded-2xl bg-white shadow-inner border-2 flex flex-col items-center justify-center", rank.border)}>
              <span className="text-[8px] font-black text-slate-400 tracking-widest">RANK</span>
              <span className={cn("text-4xl font-black italic", rank.color)}>{rank.name}</span>
            </div>
          </div>

          {/* USER INFO SECTION */}
          <div className="space-y-3 mb-5 relative z-10">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">Name :</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter truncate leading-none uppercase">{gameState.playerName}</h2>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">Level :</p>
              <span className="text-3xl font-black text-slate-800 tabular-nums leading-none">{gameState.totalLevel}</span>
            </div>
          </div>

          {/* LEVEL STATS: JABAR COMPACT CARDS */}
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-3 h-3 text-slate-400" />
              <p className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">Level Stats :</p>
              <div className="h-[1px] flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {stats.map((stat) => (
                <div key={stat.key} className="bg-white/60 backdrop-blur-sm border border-slate-100 p-3 rounded-[1.2rem] shadow-sm flex flex-col gap-1.5 transition-all hover:border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-1.5 rounded-lg", stat.bgColor)}><stat.icon className={cn("w-4 h-4", stat.color)} /></div>
                    <span className="text-sm font-black text-slate-800">{gameState.levels[stat.key]}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 tracking-widest uppercase">{stat.label}</span>
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden border border-slate-50">
                      <div className={cn("h-full rounded-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: `${(gameState.levels[stat.key] / 100) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center relative z-10">
            <div className="flex flex-col"><span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">التشفير</span><span className={cn("text-[9px] font-bold uppercase", encryption.color)}>{encryption.label}</span></div>
            <div className="text-right flex flex-col"><span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">اصدار الرخصة</span><span className="text-[9px] font-bold text-slate-600">v0.1</span></div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
