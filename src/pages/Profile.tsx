import { useState, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { User, Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, Fingerprint, Activity, Star, Search, ScanLine, UserPlus, MessageSquare, Sword, ShieldCheck, Camera, ChevronRight } from 'lucide-react';
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
  const [searchMode, setSearchMode] = useState('main'); // 'main', 'id', 'qr'

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
        // هنا يتم استدعاء دالة التحديث من الـ hook الخاص بك
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
    if (level >= 50) return { name: 'S', color: 'text-blue-500', border: 'border-blue-500/50', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' };
    if (level >= 40) return { name: 'A', color: 'text-blue-400', border: 'border-blue-400/50', glow: 'shadow-[0_0_20px_rgba(96,165,250,0.2)]' };
    return { name: 'E', color: 'text-slate-500', border: 'border-slate-500/50', glow: '' };
  })(gameState.totalLevel);

  return (
    <div className="h-screen w-full bg-[#050505] overflow-hidden flex flex-col font-sans text-white">
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

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={cn("relative w-full max-w-md aspect-[1/1.6] bg-gradient-to-br from-[#0f172a] via-[#050505] to-black border border-blue-500/20 rounded-[2.5rem] p-6 shadow-2xl flex flex-col overflow-hidden", rank.glow)}>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex flex-col gap-2">
              <div className="p-1 bg-white rounded-xl shadow-lg">
                {profile && <PlayerQRCode playerId={profile.player_id} playerName={profile.player_name} size={60} />}
              </div>
              <Dialog onOpenChange={(open) => !open && (setSearchMode('main'), setShowResult(false))}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-7 px-3 text-[8px] font-black uppercase bg-blue-600/10 border-blue-500/30 text-blue-400 rounded-full">
                    <Search className="w-3 h-3 mr-1" /> بحث
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] bg-[#050505] border-blue-500/40 rounded-[2.5rem] p-0 overflow-hidden text-white">
                  {searchMode === 'main' && (
                    <div className="p-8 space-y-4">
                      <h2 className="text-center font-black text-blue-500 italic mb-6">CHOOSE SEARCH METHOD</h2>
                      <Button onClick={() => setSearchMode('id')} className="w-full h-16 justify-between bg-slate-900 border border-blue-500/20 rounded-2xl group hover:border-blue-500">
                        <div className="flex items-center gap-3"><Fingerprint className="text-blue-500" /><span>البحث بواسطة ID</span></div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </Button>
                      <Button onClick={() => setSearchMode('qr')} className="w-full h-16 justify-between bg-slate-900 border border-blue-500/20 rounded-2xl group hover:border-blue-500">
                        <div className="flex items-center gap-3"><ScanLine className="text-blue-500" /><span>البحث بواسطة QR</span></div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </Button>
                    </div>
                  )}
                  {(searchMode === 'id' || searchMode === 'qr') && !showResult && (
                    <div className="p-8 space-y-6 text-center">
                      <h3 className="font-black text-blue-500 uppercase">{searchMode === 'id' ? 'ID Search' : 'QR Scanner'}</h3>
                      {searchMode === 'id' ? (
                        <Input placeholder="أدخل المعرف هنا..." className="h-12 bg-slate-900 border-blue-500/20" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      ) : (
                        <div className="aspect-square w-full bg-slate-900 rounded-2xl border-2 border-dashed border-blue-500/30 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-blue-500/50 animate-pulse" />
                        </div>
                      )}
                      <Button className="w-full bg-blue-600 h-12 rounded-xl" onClick={() => setShowResult(true)}>تأكيد</Button>
                      <Button variant="ghost" onClick={() => setSearchMode('main')}>رجوع</Button>
                    </div>
                  )}
                  {showResult && (
                    <div className="p-5 flex flex-col items-center">
                       <div className="w-full border border-blue-500/30 bg-black/60 rounded-[2.5rem] p-6 mb-4">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                              <h3 className="text-2xl font-black text-white">{profile?.encryption === 'Active' ? gameState.playerName : "???"}</h3>
                              <p className="text-[10px] font-mono text-blue-500/60">ID: {profile?.player_id}</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl border border-blue-500/30 bg-white/5 overflow-hidden">
                              <img src={profile?.avatar_url || "/setvoid.png"} className="w-full h-full object-cover" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {statsIcons.map(s => (
                              <div key={s.key} className="bg-white/5 p-2.5 rounded-xl flex justify-between items-center border border-white/5">
                                <span className="text-[8px] text-slate-500 uppercase">{s.label}</span>
                                <span className="font-black text-blue-400">{profile?.encryption === 'Active' ? gameState.levels[s.key] : "?"}</span>
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <Button className="h-12 bg-blue-600 rounded-xl"><UserPlus className="w-4 h-4"/></Button>
                            <Button className="h-12 bg-slate-800 rounded-xl"><MessageSquare className="w-4 h-4"/></Button>
                            <Button className="h-12 bg-black border border-blue-500/50 rounded-xl text-red-500"><Sword className="w-4 h-4"/></Button>
                          </div>
                       </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            <div className={cn("w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center backdrop-blur-md", rank.border)}>
              <span className="text-[7px] font-black text-blue-500 tracking-widest uppercase">Rank</span>
              <span className={cn("text-3xl font-black italic", rank.color)}>{rank.name}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 relative z-10">
            <div className="space-y-3 flex-1">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase italic">Identity</p>
                <h2 className="text-2xl font-black text-white uppercase leading-none">{gameState.playerName}</h2>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase italic">Combat Level</p>
                <span className="text-4xl font-black text-blue-500 leading-none">{gameState.totalLevel}</span>
              </div>
            </div>
            <div className="relative group">
              <div className="w-24 h-24 rounded-[2rem] border-2 border-blue-500/30 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.2)] bg-slate-900">
                <img src={profile?.avatar_url || "/setvoid.png"} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-2 bg-blue-600 rounded-xl border-2 border-[#050505] group-hover:scale-110 transition-transform">
                <Camera className="w-3 h-3 text-white" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          <div className="space-y-1 mb-5 relative z-10">
            <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase flex items-center gap-1"><Fingerprint className="w-3 h-3 text-blue-500" /> System ID</p>
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => {navigator.clipboard.writeText(profile?.player_id); toast({title: "تم نسخ المعرف"});}}>
              <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10 italic">{profile?.player_id}</span>
              <Copy className="w-3 h-3 text-slate-500 group-hover:text-blue-400" />
            </div>
          </div>

          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-3 h-3 text-blue-500" />
              <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase">System Params</p>
              <div className="h-[0.5px] flex-1 bg-blue-500/20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {statsIcons.map((stat) => (
                <div key={stat.key} className="bg-slate-900/40 border border-white/5 p-2 rounded-[1rem] flex flex-col gap-1 transition-all hover:border-blue-500/20">
                  <div className="flex justify-between items-center">
                    <div className={cn("p-1.5 rounded-lg", stat.bgColor)}><stat.icon className={cn("w-3 h-3", stat.color)} /></div>
                    <span className="text-lg font-black text-white">{gameState.levels[stat.key]}</span>
                  </div>
                  <div className="w-full h-[2px] bg-black/40 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: `${gameState.levels[stat.key]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

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
