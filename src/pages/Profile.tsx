import { useState, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { User, Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, Fingerprint, Activity, Star, Search, ScanLine, UserPlus, MessageSquare, Sword, ShieldCheck, Camera, ChevronRight, Settings, History, Users, Scan, QrCode } from 'lucide-react';
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
          
          <div className="flex justify-between items-start mb-4 z-10">
            <div className="p-1 bg-white rounded-xl shadow-lg">
              {profile && <PlayerQRCode playerId={profile.player_id} playerName={profile.player_name} size={50} />}
            </div>
            <div className={cn("w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center backdrop-blur-md", rank.border)}>
              <span className="text-[6px] font-black text-blue-500 tracking-widest uppercase">Rank</span>
              <span className={cn("text-2xl font-black italic leading-none", rank.color)}>{rank.name}</span>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 mb-4 z-10">
            <div className="flex-1 space-y-2">
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-500 tracking-widest uppercase italic">Identity</p>
                <h2 className="text-xl font-black text-white uppercase leading-tight truncate">{gameState.playerName}</h2>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-500 tracking-widest uppercase italic">Level</p>
                <span className="text-3xl font-black text-blue-500 leading-none">{gameState.totalLevel}</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-24 h-24 rounded-[2rem] border-2 border-blue-500/40 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-slate-900">
                <img src={profile?.avatar_url || "/setvoid.png"} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 rounded-lg border-2 border-[#050505]">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          <div className="mb-4 z-10">
            <p className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1 mb-1"><Fingerprint className="w-3 h-3 text-blue-500" /> System ID</p>
            <div className="flex items-center gap-2" onClick={() => {navigator.clipboard.writeText(profile?.player_id); toast({title: "تم النسخ"});}}>
              <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/5 px-2 py-1 rounded-lg border border-blue-500/10 italic truncate">
                {profile?.player_id}
              </span>
            </div>
          </div>

          {/* STATS SECTION */}
          <div className="flex-1 z-10 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3 h-3 text-blue-500" />
              <p className="text-[8px] font-black text-slate-500 tracking-widest uppercase">System Params</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {statsIcons.map((stat) => (
                <div key={stat.key} className="bg-slate-900/40 border border-white/5 p-2 rounded-xl flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <div className={cn("p-1 rounded-md", stat.bgColor)}><stat.icon className={cn("w-3 h-3", stat.color)} /></div>
                    <span className="text-base font-black text-white">{gameState.levels[stat.key]}</span>
                  </div>
                  <div className="w-full h-[2px] bg-black/40 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: `${gameState.levels[stat.key]}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* BUTTONS GRID 2x2 */}
            <div className="grid grid-cols-2 gap-2">
              <Dialog onOpenChange={(open) => !open && (setSearchMode('main'), setShowResult(false))}>
                <DialogTrigger asChild>
                  <Button className="h-14 bg-blue-600 hover:bg-blue-500 rounded-2xl border-b-4 border-blue-800 transition-all flex items-center gap-2">
                    <Scan className="w-5 h-5" /><span className="text-[10px] font-black uppercase">Scan</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] bg-[#050505] border-blue-500/40 rounded-[2.5rem] p-6 overflow-hidden text-white">
                  {searchMode === 'main' && (
                    <div className="space-y-4 py-4">
                      <h2 className="text-center font-black text-blue-500 italic text-xl mb-6">SEARCH TERMINAL</h2>
                      <div className="grid grid-cols-1 gap-4">
                        <Button onClick={() => setSearchMode('id')} className="h-24 bg-gradient-to-r from-slate-900 to-slate-800 border border-blue-500/30 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 group hover:border-blue-500 transition-all">
                          <span className="text-2xl font-black flex items-center gap-2">ID 🆔</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">البحث بواسطة المعرف</span>
                        </Button>
                        <Button onClick={() => setSearchMode('qr')} className="h-24 bg-gradient-to-r from-slate-900 to-slate-800 border border-blue-500/30 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 group hover:border-blue-500 transition-all">
                          <span className="text-2xl font-black flex items-center gap-2">QR 🤳</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">البحث بواسطة الباركود</span>
                        </Button>
                      </div>
                    </div>
                  )}
                  {(searchMode === 'id' || searchMode === 'qr') && !showResult && (
                    <div className="space-y-6 text-center py-4">
                      <h3 className="font-black text-blue-500 text-lg uppercase tracking-widest">{searchMode === 'id' ? 'ID Identity' : 'QR Scan'}</h3>
                      {searchMode === 'id' ? (
                        <Input placeholder="أدخل المعرف (ID)..." className="h-14 bg-slate-900 border-blue-500/40 rounded-xl text-center font-mono text-blue-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      ) : (
                        <div className="aspect-square w-full bg-slate-900/50 rounded-2xl border-2 border-dashed border-blue-500/30 flex items-center justify-center">
                          <QrCode className="w-16 h-16 text-blue-500 animate-pulse" />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button variant="ghost" className="flex-1 rounded-xl h-12" onClick={() => setSearchMode('main')}>إلغاء</Button>
                        <Button className="flex-[2] bg-blue-600 rounded-xl h-12 font-black" onClick={() => setShowResult(true)}>تأكيد البحث</Button>
                      </div>
                    </div>
                  )}
                  {showResult && (
                    <div className="py-4">
                       <div className="border border-blue-500/40 bg-slate-900/50 rounded-[2rem] p-5 shadow-inner">
                          <div className="flex justify-between items-center mb-6">
                             <div>
                               <h3 className="text-2xl font-black text-white italic">HUNTER_FOUND</h3>
                               <p className="text-[10px] font-mono text-blue-500">ID: {searchQuery || 'AX-772'}</p>
                             </div>
                             <div className="w-16 h-16 rounded-2xl bg-white/5 border border-blue-500/20 overflow-hidden"><img src="/setvoid.png" className="w-full h-full object-cover" /></div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                             <Button className="h-12 bg-blue-600 rounded-xl"><UserPlus className="w-5 h-5"/></Button>
                             <Button className="h-12 bg-slate-800 rounded-xl"><MessageSquare className="w-5 h-5"/></Button>
                             <Button className="h-12 bg-black border border-red-600 rounded-xl text-red-600"><Sword className="w-5 h-5"/></Button>
                          </div>
                       </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Button className="h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-400" /><span className="text-[10px] font-black uppercase text-slate-500">Account</span>
              </Button>
              <Button className="h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" /><span className="text-[10px] font-black uppercase text-slate-500">History</span>
              </Button>
              <Button className="h-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" /><span className="text-[10px] font-black uppercase text-slate-500">Friends</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center z-10">
            <div className="flex flex-col"><span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">Encryption</span><span className={cn("text-[9px] font-bold uppercase", encryption.color)}>{encryption.label}</span></div>
            <div className="text-right flex flex-col"><span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">System Ver</span><span className="text-[9px] font-bold text-blue-500/80 uppercase tracking-tighter italic">0.1-DARK</span></div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
