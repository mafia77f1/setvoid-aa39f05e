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
        await updateProfile({ avatar_url: reader.result });
        toast({ title: "تم تحديث الصورة الشخصية" });
      };
      reader.readAsDataURL(file);
    }
  };

  const encryption = { label: profile?.encryption || 'Active', color: profile?.encryption === 'Failed' ? 'text-red-500' : 'text-blue-400' };
  
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
            <button className="p-2 bg-slate-900/50 border border-blue-500/20 rounded-lg backdrop-blur-sm transition-all active:scale-95"><Menu className="w-5 h-5 text-blue-400" /></button>
          </SheetTrigger>
          <SheetContent className="bg-[#050505] border-l border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
            <Button variant="destructive" className="w-full mt-10 rounded-2xl" onClick={signOut}>تسجيل الخروج</Button>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 flex items-center justify-center p-3 relative z-10">
        <div className={cn("relative w-full max-w-sm h-[85vh] bg-[#0a0a0c] border border-white/5 rounded-[3rem] p-6 shadow-2xl flex flex-col overflow-hidden", rank.glow)}>
          
          {/* Top Info */}
          <div className="flex justify-between items-start mb-6">
            <div className="p-1.5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xl">
              {profile && <PlayerQRCode playerId={profile.player_id} playerName={profile.player_name} size={45} />}
            </div>
            <div className={cn("w-14 h-14 rounded-2xl border flex flex-col items-center justify-center bg-white/5", rank.border)}>
              <span className="text-[6px] font-bold text-blue-400 uppercase tracking-widest">Rank</span>
              <span className={cn("text-2xl font-black italic", rank.color)}>{rank.name}</span>
            </div>
          </div>

          {/* Identity Section */}
          <div className="flex justify-between items-center gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Identity Card</p>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{gameState.playerName}</h2>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Current Level</p>
                <span className="text-4xl font-black text-blue-500 tabular-nums leading-none drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{gameState.totalLevel}</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-24 h-24 rounded-[2.5rem] border-2 border-blue-500/30 overflow-hidden bg-slate-900 shadow-xl">
                <img src={profile?.avatar_url || "/setvoid.png"} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-2 bg-blue-600 rounded-xl shadow-lg border-2 border-[#0a0a0c] active:scale-90 transition-transform">
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          <div className="mb-6 bg-white/5 p-3 rounded-2xl border border-white/5">
            <p className="text-[8px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1"><Fingerprint className="w-3 h-3 text-blue-500" /> System ID</p>
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => {navigator.clipboard.writeText(profile?.player_id); toast({title: "Copied"});}}>
              <span className="text-[9px] font-mono font-bold text-blue-400 italic truncate pr-2">{profile?.player_id}</span>
              <Copy className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {statsIcons.map((stat) => (
                <div key={stat.key} className="bg-white/5 border border-white/5 p-3 rounded-2xl group transition-all hover:bg-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                    <span className="text-lg font-black">{gameState.levels[stat.key]}</span>
                  </div>
                  <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: `${gameState.levels[stat.key]}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Modern Jabar Buttons 2x2 */}
            <div className="grid grid-cols-2 gap-3 pb-2">
              <Dialog onOpenChange={(open) => !open && (setSearchMode('main'), setShowResult(false))}>
                <DialogTrigger asChild>
                  <Button className="h-16 bg-gradient-to-br from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 rounded-[1.5rem] border-none shadow-[0_8px_20px_rgba(59,130,246,0.3)] transition-all active:scale-95 flex items-center gap-2 group">
                    <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform"><Scan className="w-5 h-5 text-white" /></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">Scan</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] bg-[#08080a] border-white/10 rounded-[3rem] p-0 overflow-hidden text-white shadow-[0_0_100px_rgba(59,130,246,0.15)]">
                  {searchMode === 'main' && (
                    <div className="p-8 space-y-6">
                      <div className="space-y-1 text-center">
                        <h2 className="text-2xl font-black italic tracking-tighter text-blue-500">SEARCH CORE</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Select Access Protocol</p>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <button onClick={() => setSearchMode('id')} className="relative group overflow-hidden h-28 bg-white/5 border border-white/10 rounded-[2rem] transition-all hover:border-blue-500/50 hover:bg-white/10 flex flex-col items-center justify-center">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><Fingerprint size={60}/></div>
                          <span className="text-3xl mb-1">🆔</span>
                          <span className="text-xs font-black tracking-[0.2em] text-white">IDENTITY SEARCH</span>
                        </button>
                        <button onClick={() => setSearchMode('qr')} className="relative group overflow-hidden h-28 bg-white/5 border border-white/10 rounded-[2rem] transition-all hover:border-blue-500/50 hover:bg-white/10 flex flex-col items-center justify-center">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity"><QrCode size={60}/></div>
                          <span className="text-3xl mb-1">🤳</span>
                          <span className="text-xs font-black tracking-[0.2em] text-white">QR SCAN PROTOCOL</span>
                        </button>
                      </div>
                    </div>
                  )}
                  {(searchMode === 'id' || searchMode === 'qr') && !showResult && (
                    <div className="p-10 space-y-8 text-center animate-in fade-in zoom-in duration-300">
                      <div className="inline-flex p-4 bg-blue-500/10 rounded-3xl mb-2 text-blue-500"><Sparkles className="animate-pulse" /></div>
                      {searchMode === 'id' ? (
                        <div className="space-y-4">
                          <h3 className="text-xl font-black text-white italic tracking-tighter">ENTERING ID...</h3>
                          <Input placeholder="TARGET ID" className="h-16 bg-white/5 border-white/10 rounded-2xl text-center font-mono text-xl text-blue-400 placeholder:text-slate-800 focus:border-blue-500/50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-xl font-black text-white italic tracking-tighter">WAITING FOR SCAN...</h3>
                          <div className="aspect-square w-48 mx-auto bg-white/5 rounded-[2.5rem] border-2 border-dashed border-blue-500/20 flex items-center justify-center group overflow-hidden">
                             <div className="absolute w-full h-1 bg-blue-500/50 shadow-[0_0_15px_blue] animate-scan-line top-0 pointer-events-none" />
                             <QrCode className="w-16 h-16 text-blue-500/40" />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col gap-3 pt-4">
                        <Button className="w-full h-14 bg-blue-600 rounded-2xl font-black text-lg shadow-lg" onClick={() => setShowResult(true)}>EXECUTE SEARCH</Button>
                        <Button variant="ghost" className="text-slate-500 font-bold" onClick={() => setSearchMode('main')}>ABORT SYSTEM</Button>
                      </div>
                    </div>
                  )}
                  {showResult && (
                    <div className="p-6 animate-in slide-in-from-bottom-10 duration-500">
                       <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldCheck size={100}/></div>
                          <div className="flex items-center gap-5 mb-8">
                             <div className="w-20 h-20 rounded-[1.8rem] border-2 border-blue-500/30 overflow-hidden shadow-2xl"><img src="/setvoid.png" className="w-full h-full object-cover" /></div>
                             <div className="space-y-1">
                                <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Target Found</span>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">SHADOW_ID</h3>
                                <p className="text-[9px] font-mono text-slate-500">ID: AX-9921-00</p>
                             </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                             <Button className="h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex-col gap-1 transition-all hover:bg-blue-600/40 active:scale-95"><UserPlus className="w-5 h-5 text-blue-400"/><span className="text-[8px] font-black uppercase">Add</span></Button>
                             <Button className="h-16 bg-white/5 border border-white/10 rounded-2xl flex-col gap-1 transition-all hover:bg-white/10 active:scale-95"><MessageSquare className="w-5 h-5 text-white"/><span className="text-[8px] font-black uppercase">Chat</span></Button>
                             <Button className="h-16 bg-red-600/10 border border-red-500/20 rounded-2xl flex-col gap-1 transition-all hover:bg-red-500/20 active:scale-95"><Sword className="w-5 h-5 text-red-500"/><span className="text-[8px] font-black uppercase">Duel</span></Button>
                          </div>
                       </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Button className="h-16 bg-white/5 border border-white/10 rounded-[1.5rem] shadow-sm flex items-center gap-2 transition-all active:scale-95 hover:bg-white/10">
                <div className="p-2 bg-slate-800 rounded-xl"><Settings className="w-5 h-5 text-slate-400" /></div>
                <span className="text-[10px] font-black uppercase text-slate-300">Account</span>
              </Button>
              <Button className="h-16 bg-white/5 border border-white/10 rounded-[1.5rem] shadow-sm flex items-center gap-2 transition-all active:scale-95 hover:bg-white/10">
                <div className="p-2 bg-slate-800 rounded-xl"><History className="w-5 h-5 text-slate-400" /></div>
                <span className="text-[10px] font-black uppercase text-slate-300">History</span>
              </Button>
              <Button className="h-16 bg-white/5 border border-white/10 rounded-[1.5rem] shadow-sm flex items-center gap-2 transition-all active:scale-95 hover:bg-white/10">
                <div className="p-2 bg-slate-800 rounded-xl"><Users className="w-5 h-5 text-slate-400" /></div>
                <span className="text-[10px] font-black uppercase text-slate-300">Friends</span>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center z-10">
            <div className="flex flex-col"><span className="text-[7px] text-slate-600 font-black uppercase tracking-widest italic">Encryption</span><span className={cn("text-[10px] font-bold uppercase", encryption.color)}>{encryption.label}</span></div>
            <div className="text-right flex flex-col"><span className="text-[7px] text-slate-600 font-black uppercase tracking-widest italic">System v0.1</span><span className="text-[10px] font-bold text-blue-500/80 uppercase">Secured</span></div>
          </div>
        </div>
      </main>
      <BottomNav />

      <style jsx global>{`
        @keyframes scan-line {
          0% { top: 0% }
          100% { top: 100% }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Profile;
