import { useState, useRef, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { 
  User, Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, 
  Fingerprint, Activity, Star, Search, ScanLine, UserPlus, MessageSquare, 
  Sword, ShieldCheck, Camera, ChevronRight, Settings, History, Users, 
  Scan, QrCode, Sparkles, Crown, Target, Flame, Award, Swords, Eye,
  ShieldAlert, ShieldOff, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Floating particle component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${3 + Math.random() * 4}s`,
    size: `${1 + Math.random() * 2}px`,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary animate-float"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

const getRankData = (level: number) => {
  if (level >= 50) return { name: 'S', title: 'Shadow Monarch', gradient: 'from-orange-600 via-amber-500 to-yellow-400', glow: 'shadow-[0_0_80px_rgba(245,158,11,0.5)]', textColor: 'text-amber-400', borderColor: 'border-amber-500/60', auraColor: 'rgba(245,158,11,0.2)' };
  if (level >= 40) return { name: 'A', title: 'S-Rank Hunter', gradient: 'from-purple-600 via-violet-500 to-fuchsia-400', glow: 'shadow-[0_0_60px_rgba(168,85,247,0.4)]', textColor: 'text-purple-400', borderColor: 'border-purple-500/60', auraColor: 'rgba(168,85,247,0.15)' };
  if (level >= 30) return { name: 'B', title: 'A-Rank Hunter', gradient: 'from-blue-600 via-cyan-500 to-blue-400', glow: 'shadow-[0_0_50px_rgba(59,130,246,0.35)]', textColor: 'text-blue-400', borderColor: 'border-blue-500/50', auraColor: 'rgba(59,130,246,0.12)' };
  if (level >= 20) return { name: 'C', title: 'B-Rank Hunter', gradient: 'from-emerald-600 via-green-500 to-teal-400', glow: 'shadow-[0_0_40px_rgba(16,185,129,0.3)]', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/50', auraColor: 'rgba(16,185,129,0.1)' };
  if (level >= 10) return { name: 'D', title: 'C-Rank Hunter', gradient: 'from-yellow-600 via-amber-500 to-orange-400', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.25)]', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/40', auraColor: 'rgba(234,179,8,0.08)' };
  return { name: 'E', title: 'E-Rank Hunter', gradient: 'from-slate-500 via-gray-400 to-slate-600', glow: '', textColor: 'text-slate-400', borderColor: 'border-slate-600/40', auraColor: 'rgba(148,163,184,0.05)' };
};

const Profile = () => {
  const { gameState } = useGameState();
  const { signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchMode, setSearchMode] = useState('main');
  const [showResult, setShowResult] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const rankData = getRankData(gameState.totalLevel);
  const isDiscordLinked = !!profile?.discord_id;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await updateProfile({ avatar_url: reader.result as string });
        toast({ title: "Profile Image Updated" });
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { key: 'strength', label: 'STR', icon: Dumbbell, value: gameState.levels.strength, textColor: 'text-red-400' },
    { key: 'mind', label: 'INT', icon: Brain, value: gameState.levels.mind, textColor: 'text-blue-400' },
    { key: 'spirit', label: 'SPR', icon: Heart, value: gameState.levels.spirit, textColor: 'text-violet-400' },
    { key: 'agility', label: 'AGI', icon: Zap, value: gameState.levels.agility || 0, textColor: 'text-emerald-400' },
  ];

  return (
    <div className="h-[100dvh] w-full bg-background overflow-hidden flex flex-col">
      <div className="fixed inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.2),transparent_70%)]" />
        <FloatingParticles />
      </div>

      <header className="relative z-20 flex justify-between items-center px-5 py-4">
        <div className="flex flex-col">
          <h1 className="text-[10px] font-black tracking-[0.3em] uppercase text-primary italic">Hunter_System_Protocol</h1>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2 bg-card/50 border border-white/10 rounded-xl backdrop-blur-md">
              <Menu className="w-5 h-5 text-white" />
            </button>
          </SheetTrigger>
          <SheetContent className="bg-black/95 border-white/10">
            <div className="mt-10 space-y-4">
              <Button variant="ghost" className="w-full justify-start gap-3 h-14" onClick={() => navigate('/stats')}>
                <Activity className="w-5 h-5 text-primary" /> الإحصائيات
              </Button>
              <Button variant="destructive" className="w-full h-12" onClick={signOut}>
                <LogOut className="w-4 h-4 ml-2" /> تسجيل الخروج
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 overflow-y-auto z-10 px-4 pb-24 space-y-6">

        {/* ═══════════════ THE HUNTER LICENSE ═══════════════ */}
        <div className={cn(
          "relative rounded-[2rem] overflow-hidden transition-all duration-1000",
          rankData.glow,
          animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          {/* Main Card Surface */}
          <div className={cn("relative bg-gradient-to-br from-zinc-900 to-black p-6 border-2", rankData.borderColor)}>
            
            {/* Mana encryption status */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
                {isDiscordLinked ? (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                        <span className="text-[7px] font-black text-emerald-500 uppercase tracking-tighter">Mana Encrypted</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded-full animate-pulse">
                        <ShieldOff className="w-2.5 h-2.5 text-red-500" />
                        <span className="text-[7px] font-black text-red-500 uppercase tracking-tighter">Mana Unstable</span>
                    </div>
                )}
            </div>

            <div className="flex items-start gap-5 mb-8">
                {/* Photo ID */}
                <div className="relative group">
                    <div className={cn("absolute -inset-1 rounded-xl bg-gradient-to-br opacity-50 blur-sm", rankData.gradient)} />
                    <div className="relative w-28 h-36 rounded-xl overflow-hidden border border-white/20 bg-black">
                        <img src={profile?.avatar_url || "/setvoid.png"} className="w-full h-full object-cover" alt="avatar" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                        <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 p-1.5 bg-primary/80 rounded-lg">
                           <Camera className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Identity Info */}
                <div className="flex-1 pt-2">
                    <div className="mb-4">
                        <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">Assigned Hunter</p>
                        <h2 className="text-xl font-black text-white uppercase italic truncate drop-shadow-md">{gameState.playerName}</h2>
                    </div>

                    <div className="flex gap-4">
                        <div>
                            <p className="text-[7px] font-black text-white/40 uppercase tracking-widest">Rank</p>
                            <span className={cn("text-3xl font-black italic leading-none drop-shadow-md", rankData.textColor)}>{rankData.name}</span>
                        </div>
                        <div className="h-10 w-px bg-white/10 mx-1" />
                        <div>
                            <p className="text-[7px] font-black text-white/40 uppercase tracking-widest">Combat LV</p>
                            <span className="text-2xl font-black text-white leading-none">{gameState.totalLevel}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overlay */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                {stats.map(s => (
                    <div key={s.key} className="bg-white/5 border border-white/5 rounded-lg p-2 flex items-center justify-between">
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{s.label}</span>
                        <span className={cn("text-xs font-black", s.textColor)}>{s.value}</span>
                    </div>
                ))}
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-end border-t border-white/10 pt-4">
                <div className="p-1 bg-white rounded-md">
                   {profile && <PlayerQRCode playerId={profile.player_id} playerName={profile.player_name} size={30} />}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-white/80 italic uppercase">{rankData.title}</p>
                    <p className="text-[6px] font-mono text-white/30 tracking-tighter">{profile?.player_id?.toUpperCase()}</p>
                </div>
            </div>

            {/* Scan animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-full h-px bg-primary/30 top-0 animate-scan-line" />
            </div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* ═══════════════ ACTIONS ═══════════════ */}
        <div className="grid grid-cols-2 gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-16 bg-primary rounded-[1.25rem] border-none shadow-lg flex items-center gap-3">
                <Scan className="w-5 h-5 text-primary-foreground" />
                <span className="text-xs font-black uppercase tracking-widest">Scan Hunter</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-white/10 rounded-[2rem]">
                <div className="p-4 space-y-4">
                    <h3 className="text-primary font-black italic text-center text-xl">System Search</h3>
                    <div className="grid gap-2">
                        <Button variant="secondary" onClick={() => setSearchMode('id')}>Search by ID</Button>
                        <Button variant="secondary" onClick={() => setSearchMode('qr')}>Camera Scan</Button>
                    </div>
                </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" onClick={() => { navigator.clipboard.writeText(profile?.player_id || ''); toast({ title: "ID Copied" }); }}
            className="h-16 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center gap-3">
            <Copy className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Copy ID</span>
          </Button>
        </div>

        {/* ═══════════════ DISCORD STATUS ═══════════════ */}
        {!isDiscordLinked && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-[1.25rem] p-4 flex items-center gap-4">
                <div className="p-2 bg-red-500/20 rounded-xl">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-tighter">تنبيه: تشفير المانا معطل</h4>
                    <p className="text-[9px] text-red-400/60 leading-tight">اربط حساب الديسكورد لتأمين بيانات الصياد وتفعيل بروتوكولات الحماية.</p>
                </div>
            </div>
        )}

      </main>

      <BottomNav />
      <style>{`
        @keyframes scan-line {
            0% { top: 0%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
            animation: scan-line 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Profile;
