import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { User, Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, Fingerprint, Activity, Star, Search, ScanLine, UserPlus, MessageSquare, Sword } from 'lucide-react';
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
  const [showResult, setShowResult] = useState(false);

  // بيانات افتراضية للاعب المبحوث عنه للمعاينة
  const searchedPlayer = {
    name: "SHADOW_HUNTER",
    id: "AX-992837465512",
    totalLevel: 42,
    encryption: "Progress", // جرب تغييرها لـ Active لرؤية الفرق
    stats: { strength: 85, mind: 40, spirit: 60, agility: 75 }
  };

  const statsIcons = [
    { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-red-600', bgColor: 'bg-red-500/10' },
    { key: 'mind', label: 'INT', icon: Brain, color: 'text-blue-600', bgColor: 'bg-blue-500/10' },
    { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-emerald-600', bgColor: 'bg-emerald-500/10' },
    { key: 'agility', label: 'AGI', icon: Zap, color: 'text-amber-600', bgColor: 'bg-amber-500/10' },
  ];

  const getEncryptionStatus = (status) => {
    if (status === 'Active') return { label: 'Active', color: 'text-emerald-500' };
    if (status === 'Progress') return { label: 'Progress', color: 'text-amber-500' };
    return { label: 'Failed', color: 'text-red-500' };
  };

  const encryption = getEncryptionStatus(profile?.encryption || 'Active');

  const getRankInfo = (level) => {
    if (level >= 50) return { name: 'S', color: 'text-orange-500', border: 'border-orange-500/50', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]' };
    if (level >= 40) return { name: 'A', color: 'text-purple-500', border: 'border-purple-500/50', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]' };
    if (level >= 30) return { name: 'B', color: 'text-blue-500', border: 'border-blue-500/50', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]' };
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
                <DialogContent className="max-w-[90vw] bg-slate-50 border-none p-0 overflow-hidden rounded-[2.5rem]">
                  {!showResult ? (
                    <div className="p-8 space-y-6">
                      <DialogHeader><DialogTitle className="text-center font-black italic tracking-widest">HUNTER SEARCH</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input placeholder="Enter Player ID..." className="h-12 bg-white border-none shadow-inner font-mono text-xs" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
                          <Button className="h-12 w-12 bg-slate-900" onClick={() => setShowResult(true)}><Search className="w-5 h-5" /></Button>
                        </div>
                        <div className="relative py-2"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div><div className="relative flex justify-center text-[8px] uppercase font-bold"><span className="bg-slate-50 px-2 text-slate-400">OR</span></div></div>
                        <Button variant="outline" className="w-full h-16 gap-3 border-2 border-dashed border-slate-300 hover:border-primary bg-white transition-all">
                          <ScanLine className="w-6 h-6 text-primary" />
                          <span className="font-black italic text-base">بث الباركود</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-white flex flex-col items-center">
                      {/* بطاقة اللاعب المكتشف */}
                      <div className="w-full bg-slate-50 rounded-[2rem] p-5 border border-slate-200 shadow-sm relative overflow-hidden mb-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Hunter Name</p>
                             <h3 className="text-xl font-black text-slate-900">{searchedPlayer.encryption === 'Active' ? searchedPlayer.name : "????????"}</h3>
                             <p className="text-[10px] font-mono text-slate-500">ID: {searchedPlayer.id.slice(0, 8)}...</p>
                          </div>
                          <div className="w-12 h-12 rounded-xl border-2 border-primary/20 flex items-center justify-center bg-white">
                             <span className="text-xl font-black text-primary">{getRankInfo(searchedPlayer.totalLevel).name}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {statsIcons.map(s => (
                            <div key={s.key} className="bg-white p-2 rounded-xl border border-slate-100 flex flex-col items-center">
                               <span className="text-[8px] font-bold text-slate-400 uppercase">{s.label}</span>
                               <span className="text-sm font-black">{searchedPlayer.encryption === 'Active' ? searchedPlayer.stats[s.key] : "?"}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 opacity-60">
                           <span>LVL: {searchedPlayer.encryption === 'Active' ? searchedPlayer.totalLevel : "?"}</span>
                           <span>ENCRYPTION: {searchedPlayer.encryption}</span>
                        </div>
                      </div>

                      {/* ازرار التحكم الجبارة */}
                      <div className="grid grid-cols-3 gap-2 w-full">
                        <Button className="flex-col h-16 gap-1 bg-emerald-500 hover:bg-emerald-600 rounded-2xl border-b-4 border-emerald-700 active:border-b-0 transition-all">
                          <UserPlus className="w-5 h-5" /><span className="text-[9px] font-bold">إضافة</span>
                        </Button>
                        <Button className="flex-col h-16 gap-1 bg-blue-500 hover:bg-blue-600 rounded-2xl border-b-4 border-blue-700 active:border-b-0 transition-all">
                          <MessageSquare className="w-5 h-5" /><span className="text-[9px] font-bold">مراسلة</span>
                        </Button>
                        <Button className="flex-col h-16 gap-1 bg-red-600 hover:bg-red-700 rounded-2xl border-b-4 border-red-800 active:border-b-0 transition-all">
                          <Sword className="w-5 h-5" /><span className="text-[9px] font-bold tracking-tighter">1V1 Challenge</span>
                        </Button>
                      </div>
                      <Button variant="ghost" className="mt-4 text-[10px] text-slate-400" onClick={() => setShowResult(false)}>بحث جديد</Button>
                    </div>
                  )}
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
              {statsIcons.map((stat) => (
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
