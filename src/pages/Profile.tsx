import { useState, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { User, Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, Fingerprint, Activity, Star, Search, ScanLine, UserPlus, MessageSquare, Sword, ShieldCheck, Camera, ChevronRight, Settings, History, Users, Scan, QrCode, Sparkles } from 'lucide-react';
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
        await updateProfile({ avatar_url: reader.result as string as string });
        toast({ title: "تم تحديث الصورة الشخصية" });
      };
      reader.readAsDataURL(file);
    }
  };

  const encryption ='Active', color-red-500' : 'text-blue-400' };
  
  const rank = ((level) => {
    if (level >= 50) return { name: 'S', color: 'text-blue-500', border: 'border-blue-500/60', glow: 'shadow-[0_0_40px_rgba(59,130,246,0.25)]' };
    return { name: 'E', color: 'text-slate-500', border: 'border-slate-500/50', glow: '' };
  })(gameState.totalLevel);

  return (
    <div className="h-[100dvh] w-full bg-[#050505] overflow-hidden flex flex-col font-sans text-white">
      <header className="relative z-20 flex justify-between items-center p-4">
        <h1 className="text-lg font-black italic text-blue-500 tracking-tighter uppercase">Hunter License</h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 bg-white/5 rounded-xl backdrop-blur-md transition-all active:scale-90"><Menu className="w-5 h-5 text-blue-400" /></button>
          </SheetTrigger>
          <SheetContent className="bg-[#050505] border-l border-blue-500/30 shadow-2xl">
            <Button variant="destructive" className="w-full mt-10 rounded-2xl" onClick={signOut}>تسجيل الخروج</Button>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 flex items-center justify-center p-3 relative z-10">
        <div className={cn("relative w-full max-w-sm h-[88vh] bg-[#0a0a0c] border border-white/5 rounded-[3.5rem] p-7 shadow-2xl flex flex-col overflow-hidden", rank.glow)}>
          
          {/* Top Bar with LARGE RANK CARD */}
          <div className="flex justify-between items-start mb-6">
            <div className="p-2 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xl">
              {profile && <PlayerQRCode playerId={profile.player_id} playerName={profile.player_name} size={40} />}
            </div>
            {/* BIGGER RANK CARD */}
            <div className={cn("w-20 h-20 rounded-3xl border-2 flex flex-col items-center justify-center bg-white/[0.03] shadow-inner", rank.border)}>
              <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Rank</span>
              <span className={cn("text-4xl font-black italic tracking-tighter", rank.color)}>{rank.name}</span>
            </div>
          </div>

          {/* Identity Section with LARGE CIRCULAR IMAGE */}
          <div className="flex justify-between items-center gap-4 mb-8">
            <div className="flex-1 space-y-3">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Hunter Name</p>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight truncate">{gameState.playerName}</h2>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Combat Level</p>
                <span className="text-5xl font-black text-blue-500 tabular-nums leading-none drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">{gameState.totalLevel}</span>
              </div>
            </div>
            {/* LARGE CIRCULAR AVATAR - NO BORDER */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-900 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <img src={profile?.avatar_url || "/setvoid.png"} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 p-2.5 bg-blue-600 rounded-full shadow-xl border-2 border-[#0a0a0c] active:scale-90 transition-transform">
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          <div className="mb-6 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
            <p className="text-[8px] font-bold text-slate-600 uppercase flex items-center gap-1 mb-1 font-mono"><Fingerprint className="w-3 h-3 text-blue-500/50" /> System-ID</p>
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => {navigator.clipboard.writeText(profile?.player_id); toast({title: "Copied"});}}>
              <span className="text-[10px] font-mono font-bold text-blue-400/80 italic truncate pr-2">{profile?.player_id}</span>
              <Copy className="w-3 h-3 text-slate-700 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {statsIcons.map((stat) => (
                <div key={stat.key} className="bg-white/[0.03] p-3 rounded-3xl transition-all border border-transparent hover:border-white/5">
                  <div className="flex justify-between items-center mb-1.5">
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                    <span className="text-xl font-black">{gameState.levels[stat.key]}</span>
                  </div>
                  <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: `${gameState.levels[stat.key]}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* RELAXED MODERN BUTTONS GRID */}
            <div className="grid grid-cols-2 gap-4 pb-2">
              <Dialog onOpenChange={(open) => !open && (setSearchMode('main'), setShowResult(false))}>
                <DialogTrigger asChild>
                  <Button className="h-16 bg-blue-600 hover:bg-blue-500 rounded-[2rem] border-none shadow-[0_10px_25px_rgba(59,130,246,0.3)] transition-all active:scale-95 flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full"><Scan className="w-5 h-5 text-white" /></div>
                    <span className="text-xs font-black uppercase tracking-widest text-white">Scan</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] bg-[#08080a] border-white/10 rounded-[3rem] p-0 overflow-hidden text-white shadow-2xl">
                  {/* Search UI كما تمت برمجته مسبقاً */}
                  {searchMode === 'main' && (
                    <div className="p-8 space-y-6">
                      <h2 className="text-center font-black text-blue-500 italic text-2xl tracking-tighter">SEARCH HUB</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <button onClick={() => setSearchMode('id')} className="h-28 bg-white/[0.03] border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all">
                          <span className="text-3xl">🆔</span>
                          <span className="text-xs font-black tracking-widest uppercase">ID Entry</span>
                        </button>
                        <button onClick={() => setSearchMode('qr')} className="h-28 bg-white/[0.03] border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all">
                          <span className="text-3xl">🤳</span>
                          <span className="text-xs font-black tracking-widest uppercase">QR Scanner</span>
                        </button>
                      </div>
                    </div>
                  )}
                  {showResult && (
                    <div className="p-6">
                       <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 text-center">
                          <div className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-blue-500/30 overflow-hidden shadow-2xl">
                             <img src="/setvoid.png" className="w-full h-full object-cover" />
                          </div>
                          <h3 className="text-2xl font-black mb-6 uppercase italic">Shadow Hunter</h3>
                          <div className="grid grid-cols-3 gap-3">
                             <Button className="h-14 bg-blue-600 rounded-2xl"><UserPlus /></Button>
                             <Button className="h-14 bg-white/5 rounded-2xl"><MessageSquare /></Button>
                             <Button className="h-14 bg-red-600/20 rounded-2xl text-red-500"><Sword /></Button>
                          </div>
                       </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Button className="h-16 bg-white/[0.04] border border-white/5 rounded-[2rem] flex items-center gap-3 transition-all active:scale-95 hover:bg-white/10">
                <div className="p-2 bg-slate-800 rounded-full"><Settings className="w-5 h-5 text-slate-300" /></div>
                <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Account</span>
              </Button>
              <Button className="h-16 bg-white/[0.04] border border-white/5 rounded-[2rem] flex items-center gap-3 transition-all active:scale-95 hover:bg-white/10">
                <div className="p-2 bg-slate-800 rounded-full"><History className="w-5 h-5 text-slate-300" /></div>
                <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">History</span>
              </Button>
              <Button className="h-16 bg-white/[0.04] border border-white/5 rounded-[2rem] flex items-center gap-3 transition-all active:scale-95 hover:bg-white/10">
                <div className="p-2 bg-slate-800 rounded-full"><Users className="w-5 h-5 text-slate-300" /></div>
                <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">Friends</span>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center z-10 opacity-60">
            <div className="flex flex-col"><span className="text-[7px] text-slate-500 font-black uppercase">Encryption</span><span className={cn("text-[9px] font-bold uppercase", encryption.color)}>{encryption.label}</span></div>
            <div className="text-right flex flex-col"><span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Protocol</span><span className="text-[9px] font-bold text-blue-500/80 uppercase">0.1-DARK</span></div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
