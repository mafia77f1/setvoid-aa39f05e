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

  // مصفوفة الأيقونات الموحدة
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
      {/* تأثيرات خلفية زرقاء وفضية */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-800/20 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-20 flex justify-between items-center p-4">
        <h1 className="text-lg font-black italic text-blue-500 tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]">Hunter License</h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 bg-slate-900/50 border border-blue-500/20 rounded-lg backdrop-blur-md hover:border-blue-500/50 transition-all">
              <Menu className="w-5 h-5 text-blue-400" />
            </button>
          </SheetTrigger>
          <SheetContent className="bg-[#050505]/95 border-l border-blue-500/30 text-white">
            <SheetHeader><SheetTitle className="text-blue-400 font-black">الإعدادات</SheetTitle></SheetHeader>
            <div className="mt-10 space-y-4">
               <Button variant="destructive" className="w-full flex gap-2 bg-red-950/20 border border-red-500/30 hover:bg-red-900/40" onClick={handleLogout} disabled={isLoggingOut}>
                 <LogOut className="w-4 h-4" /> تسجيل الخروج
               </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        {/* البطاقة الرئيسية بتصميم أسود/فضي/أزرق */}
        <div className={cn(
          "relative w-full max-w-md aspect-[1/1.6] bg-gradient-to-br from-[#0f172a] via-[#050505] to-[#000000] border border-blue-500/20 rounded-[2.5rem] p-7 shadow-2xl flex flex-col overflow-hidden",
          rank.glow
        )}>
          
          {/* انعكاس فضي علوي */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* TOP SECTION: QR & RANK & SEARCH */}
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex flex-col gap-3">
              <div className="p-1.5 bg-white rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                {profile && <PlayerQRCode playerId={profile.player_id} playerName={profile.player_name} size={65} />}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-9 px-4 text-[10px] font-black uppercase gap-2 bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-all rounded-full">
                    <Search className="w-3.5 h-3.5" /> البحث عن صياد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] bg-[#050505] border-blue-500/40 p-0 overflow-hidden rounded-[3rem] text-white">
                  {!showResult ? (
                    <div className="p-10 space-y-8">
                      <DialogHeader><DialogTitle className="text-center font-black italic tracking-[0.3em] text-blue-500">SYSTEM SEARCH</DialogTitle></DialogHeader>
                      <div className="space-y-6">
                        <div className="relative group">
                          <Input placeholder="أدخل اسم الصياد..." className="h-14 bg-slate-900/50 border-blue-500/20 text-blue-100 placeholder:text-slate-600 pl-12 rounded-2xl focus:border-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                          <User className="absolute left-4 top-4 text-blue-500/50" />
                          <Button className="absolute right-2 top-2 h-10 bg-blue-600 hover:bg-blue-500" onClick={() => setShowResult(true)}><Search className="w-4 h-4" /></Button>
                        </div>
                        <Button variant="outline" className="w-full h-16 gap-3 border-2 border-dashed border-slate-800 bg-slate-900/20 text-slate-400 hover:border-blue-500 transition-all rounded-2xl">
                          <ScanLine className="w-6 h-6 text-blue-500" />
                          <span className="font-black italic uppercase">Scan QR Code</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-gradient-to-b from-[#0f172a] to-black flex flex-col items-center">
                      {/* عرض بطاقة الصياد الكاملة الطولية */}
                      <div className="w-full border border-blue-500/40 bg-black/60 rounded-[2.5rem] p-6 relative overflow-hidden mb-6 shadow-inner">
                         <div className="flex justify-between items-start mb-8">
                            <div className="space-y-2">
                               <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"/><span className="text-[10px] font-black text-blue-500 tracking-widest uppercase italic">Hunter Verified</span></div>
                               <h3 className="text-3xl font-black text-white leading-none uppercase tracking-tighter">
                                 {profile?.encryption === 'Active' ? gameState.playerName : "???????????"}
                               </h3>
                               <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-blue-500"/> ID: {profile?.player_id?.slice(0, 16)}...</div>
                            </div>
                            <div className="w-20 h-20 rounded-2xl border-2 border-blue-500/50 bg-blue-500/5 flex flex-col items-center justify-center">
                               <span className="text-[8px] font-black text-blue-400 mb-1">RANK</span>
                               <span className="text-4xl font-black italic text-white">{rank.name}</span>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4 mb-8">
                            {statsIcons.map(s => (
                              <div key={s.key} className="bg-white/5 border border-white/5 p-4 rounded-3xl backdrop-blur-sm">
                                 <div className="flex justify-between items-center mb-1">
                                    <s.icon className={cn("w-4 h-4", s.color)} />
                                    <span className="text-xl font-black text-white">{profile?.encryption === 'Active' ? gameState.levels[s.key] : "?"}</span>
                                 </div>
                                 <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
                              </div>
                            ))}
                         </div>

                         <div className="flex justify-between items-end border-t border-white/5 pt-4">
                            <div className="flex flex-col"><span className="text-[8px] font-black text-slate-500 uppercase">Total Level</span><span className="text-3xl font-black text-blue-400">{profile?.encryption === 'Active' ? gameState.totalLevel : "?"}</span></div>
                            <div className="text-right flex flex-col items-end"><span className="text-[8px] font-black text-slate-500 uppercase">Encryption</span><span className={cn("text-[10px] font-bold", encryption.color)}>{encryption.label}</span></div>
                         </div>
                      </div>

                      {/* أزرار التحكم الجبارة */}
                      <div className="grid grid-cols-3 gap-3 w-full">
                        <Button className="flex-col h-20 bg-blue-600 hover:bg-blue-500 rounded-3xl border-b-4 border-blue-800 transition-all">
                          <UserPlus className="w-6 h-6 mb-1" /><span className="text-[10px] font-black">إضافة</span>
                        </Button>
                        <Button className="flex-col h-20 bg-slate-800 hover:bg-slate-700 rounded-3xl border-b-4 border-slate-950 transition-all">
                          <MessageSquare className="w-6 h-6 mb-1 text-blue-400" /><span className="text-[10px] font-black">مراسلة</span>
                        </Button>
                        <Button className="flex-col h-20 bg-black border border-blue-500/50 hover:bg-blue-950 rounded-3xl border-b-4 border-blue-900 transition-all">
                          <Sword className="w-6 h-6 mb-1 text-red-500" /><span className="text-[10px] font-black uppercase">1V1 Battle</span>
                        </Button>
                      </div>
                      <Button variant="ghost" className="mt-4 text-slate-500" onClick={() => setShowResult(false)}>رجوع</Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            
            <div className={cn("w-20 h-20 rounded-[2rem] bg-slate-900/50 border-2 flex flex-col items-center justify-center backdrop-blur-md", rank.border)}>
              <span className="text-[8px] font-black text-blue-500 tracking-[0.2em] mb-1">RANK</span>
              <span className={cn("text-4xl font-black italic", rank.color)}>{rank.name}</span>
            </div>
          </div>

          {/* USER INFO SECTION */}
          <div className="space-y-4 mb-6 relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase flex items-center gap-2">
                <User className="w-3 h-3 text-blue-500" /> Identity :
              </p>
              <h2 className="text-4xl font-black text-white tracking-tighter truncate uppercase leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                {gameState.playerName}
              </h2>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase flex items-center gap-2">
                <Star className="w-3 h-3 text-blue-400" /> Level :
              </p>
              <span className="text-5xl font-black text-blue-500 tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                {gameState.totalLevel}
              </span>
            </div>
          </div>

          {/* LEVEL STATS: JABAR COMPACT CARDS */}
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-3 h-3 text-blue-500" />
              <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Stats Params :</p>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {statsIcons.map((stat) => (
                <div key={stat.key} className="bg-slate-900/40 border border-white/5 p-4 rounded-[1.5rem] shadow-inner flex flex-col gap-2 transition-all hover:bg-slate-800/50 hover:border-blue-500/20 group">
                  <div className="flex justify-between items-center">
                    <div className={cn("p-2 rounded-xl", stat.bgColor)}><stat.icon className={cn("w-4 h-4 shadow-sm", stat.color)} /></div>
                    <span className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">{gameState.levels[stat.key]}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">{stat.label}</span>
                    <div className="w-full h-1 bg-black/60 rounded-full mt-1 overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: `${(gameState.levels[stat.key] / 100) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center relative z-10 text-[9px]">
            <div className="flex flex-col"><span className="text-slate-600 font-black uppercase tracking-widest">Encryption</span><span className={cn("font-bold uppercase", encryption.color)}>{encryption.label}</span></div>
            <div className="text-right flex flex-col"><span className="text-slate-600 font-black uppercase tracking-widest">License Ver</span><span className="font-bold text-blue-500/80 uppercase">v0.1-DARK</span></div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
