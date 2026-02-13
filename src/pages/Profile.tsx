import { useState, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { User, Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, Fingerprint, Activity, Star, Search, ScanLine, UserPlus, MessageSquare, Sword, ShieldCheck, Camera, ChevronRight, Settings, History, Users, Scan } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const { gameState } = useGameState();
  const { signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [searchMode, setSearchMode] = useState('main');

  const statsIcons = [
    { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { key: 'mind', label: 'INT', icon: Brain, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
    { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-slate-300', bgColor: 'bg-slate-300/10' },
    { key: 'agility', label: 'AGI', icon: Zap, color: 'text-blue-300', bgColor: 'bg-blue-300/10' },
  ];

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await updateProfile({ avatar_url: reader.result });
        toast({ title: "تم تحديث الصورة الشخصية" });
      };
      reader.readAsDataURL(file);
    }
  };

  const getEncryptionStatus = (status) => {
    if (status === 'Active') return { label: 'Active', color: 'text-blue-400' };
    if (status === 'Progress') return { label: 'Progress', color: 'text-slate-400' };
    return { label: 'Failed', color: 'text-red-500' };
  };

  const encryption = getEncryptionStatus(profile?.encryption || 'Active');
  const rank = ((level) => {
    if (level >= 50) return { name: 'S', color: 'text-blue-500', border: 'border-blue-500/50', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]' };
    return { name: 'E', color: 'text-slate-500', border: 'border-slate-500/50', glow: '' };
  })(gameState.totalLevel);

  return (
    <div className="h-[100dvh] w-full bg-[#050505] overflow-hidden flex flex-col font-sans text-white">
      <header className="relative z-20 flex justify-between items-center p-4">
        <h1 className="text-lg font-black italic text-blue-500 tracking-tighter uppercase">Hunter License</h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 bg-slate-900/50 border border-blue-500/20 rounded-lg"><Menu className="w-5 h-5 text-blue-400" /></button>
          </SheetTrigger>
          <SheetContent className="bg-[#050505] border-l border-blue-500/30">
            <Button variant="destructive" className="w-full" onClick={signOut}>تسجيل الخروج</Button>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 flex items-center justify-center p-3 relative z-10">
        <div className={cn("relative w-full max-w-sm h-[85vh] bg-gradient-to-br from-[#0f172a] via-[#050505] to-black border border-blue-500/20 rounded-[2.5rem] p-5 shadow-2xl flex flex-col overflow-hidden", rank.glow)}>
          
          {/* TOP BAR: QR & RANK */}
          <div className="flex justify-between items-start mb-6 z-10">
            <div className="p-1 bg-white rounded-xl shadow-lg">
              {profile && <PlayerQRCode playerId={profile.player_id} playerName={profile.player_name} size={55} />}
            </div>
            <div className={cn("w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center backdrop-blur-md", rank.border)}>
              <span className="text-[7px] font-black text-blue-500 tracking-widest uppercase">Rank</span>
              <span className={cn("text-3xl font-black italic leading-none", rank.color)}>{rank.name}</span>
            </div>
          </div>

          {/* IDENTITY SECTION: BIG IMAGE & TEXT */}
          <div className="flex justify-between items-center gap-4 mb-6 z-10">
            <div className="flex-1 space-y-3">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase italic">Identity</p>
                <h2 className="text-2xl font-black text-white uppercase leading-tight truncate">{gameState.playerName}</h2>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase italic">Combat Level</p>
                <span className="text-4xl font-black text-blue-500 leading-none">{gameState.totalLevel}</span>
              </div>
            </div>
            {/* BIG PROFILE IMAGE */}
            <div className="relative">
              <div className="w-28 h-28 rounded-[2.5rem] border-2 border-blue-500/40 overflow-hidden shadow-[0_0_25px_rgba(59,130,246,0.3)] bg-slate-900">
                <img src={profile?.avatar_url || "/setvoid.png"} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-2 bg-blue-600 rounded-xl border-2 border-[#050505]">
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          {/* SYSTEM ID */}
          <div className="mb-6 z-10">
            <p className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1 mb-1"><Fingerprint className="w-3 h-3 text-blue-500" /> System ID</p>
            <div className="flex items-center gap-2" onClick={() => {navigator.clipboard.writeText(profile?.player_id); toast({title: "تم النسخ"});}}>
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 italic truncate">
                {profile?.player_id}
              </span>
            </div>
          </div>

          {/* STATS SECTION */}
          <div className="flex-1 z-10">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-3 h-3 text-blue-500" />
              <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase">System Params</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {statsIcons.map((stat) => (
                <div key={stat.key} className="bg-slate-900/40 border border-white/5 p-2.5 rounded-2xl flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <div className={cn("p-1 rounded-lg", stat.bgColor)}><stat.icon className={cn("w-3.5 h-3.5", stat.color)} /></div>
                    <span className="text-lg font-black text-white">{gameState.levels[stat.key]}</span>
                  </div>
                  <div className="w-full h-[3px] bg-black/40 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: `${gameState.levels[stat.key]}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* JABAR BUTTONS GRID - SCAN & SYSTEM OPTIONS */}
            <div className="grid grid-cols-4 gap-2">
              <Dialog onOpenChange={(open) => !open && (setSearchMode('main'), setShowResult(false))}>
                <DialogTrigger asChild>
                  <Button className="flex-col h-16 bg-blue-600 hover:bg-blue-500 rounded-2xl border-b-4 border-blue-800 transition-all">
                    <Scan className="w-6 h-6 mb-1" />
                    <span className="text-[7px] font-black">SCAN</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] bg-[#050505] border-blue-500/40 rounded-[2.5rem] p-0 overflow-hidden text-white">
                   {/* محتوى البحث (ID / QR) كما هو مبرمج سابقاً */}
                   {searchMode === 'main' && (
                    <div className="p-8 space-y-4">
                      <Button onClick={() => setSearchMode('id')} className="w-full h-14 bg-slate-900 rounded-xl">ID SEARCH</Button>
                      <Button onClick={() => setSearchMode('qr')} className="w-full h-14 bg-slate-900 rounded-xl uppercase">QR SCAN</Button>
                    </div>
                  )}
                  {showResult && (
                    <div className="p-5">
                      <div className="bg-black/60 border border-blue-500/30 rounded-[2rem] p-5">
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="text-xl font-black uppercase tracking-tighter">Hunter Detected</h3>
                           <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden border border-blue-500/20">
                              <img src="/setvoid.png" className="w-full h-full object-cover" />
                           </div>
                        </div>
                        <Button className="w-full bg-blue-600 mb-2 rounded-xl h-12"><UserPlus className="mr-2 w-4 h-4"/> ADD HUNTER</Button>
                        <div className="grid grid-cols-2 gap-2">
                           <Button className="bg-slate-800 rounded-xl h-12 uppercase text-[10px] font-black italic">Message</Button>
                           <Button className="bg-black border border-red-500/50 text-red-500 rounded-xl h-12 uppercase text-[10px] font-black italic">1V1 Match</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Button className="flex-col h-16 bg-slate-900 border border-white/5 rounded-2xl transition-all">
                <Settings className="w-5 h-5 mb-1 text-slate-400" />
                <span className="text-[7px] font-black text-slate-500">ACCOUNT</span>
              </Button>
              <Button className="flex-col h-16 bg-slate-900 border border-white/5 rounded-2xl transition-all">
                <History className="w-5 h-5 mb-1 text-slate-400" />
                <span className="text-[7px] font-black text-slate-500">HISTORY</span>
              </Button>
              <Button className="flex-col h-16 bg-slate-900 border border-white/5 rounded-2xl transition-all">
                <Users className="w-5 h-5 mb-1 text-slate-400" />
                <span className="text-[7px] font-black text-slate-500">FRIENDS</span>
              </Button>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center z-10">
            <div className="flex flex-col"><span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">Encryption</span><span className={cn("text-[9px] font-bold uppercase", encryption.color)}>{encryption.label}</span></div>
            <div className="text-right flex flex-col"><span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">System Ver</span><span className="text-[9px] font-bold text-blue-500/80">0.1-DARK</span></div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
