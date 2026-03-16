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
  ShieldAlert, ShieldOff, Download, Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import html2canvas from 'html2canvas';

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
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchMode, setSearchMode] = useState('main');
  const [showResult, setShowResult] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const rankData = getRankData(gameState.totalLevel);
  const completedGates = gameState.gates?.filter((g: any) => g.completed).length || 0;
  const completedQuests = gameState.quests?.filter((q: any) => q.completed).length || 0;
  const isDiscordLinked = !!profile?.discord_id;

  const handleDownloadCard = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        logging: false,
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = `hunter-license-${gameState.playerName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: "تم تحميل الرخصة بنجاح!" });
    }
  };

  const stats = [
    { key: 'strength', label: 'STR', icon: Dumbbell, value: gameState.levels.strength, color: 'from-red-600 to-red-400', textColor: 'text-red-400' },
    { key: 'mind', label: 'INT', icon: Brain, value: gameState.levels.mind, color: 'from-blue-600 to-blue-400', textColor: 'text-blue-400' },
    { key: 'spirit', label: 'SPR', icon: Heart, value: gameState.levels.spirit, color: 'from-violet-600 to-violet-400', textColor: 'text-violet-400' },
    { key: 'agility', label: 'AGI', icon: Zap, value: gameState.levels.agility || 0, color: 'from-emerald-600 to-emerald-400', textColor: 'text-emerald-400' },
  ];

  return (
    <div className="h-[100dvh] w-full bg-background overflow-hidden flex flex-col">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--secondary)/0.1),transparent_60%)]" />
        <FloatingParticles />
      </div>

      <header className={cn(
        "relative z-20 flex justify-between items-center px-5 py-4 transition-all duration-700",
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", rankData.textColor.replace('text-', 'bg-'))} />
            <h1 className="text-xs font-black tracking-[0.3em] uppercase text-foreground/80 italic">System.Access_License</h1>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleDownloadCard} className="rounded-xl bg-card/40 border border-border/50">
                <Download className="w-4 h-4 text-primary" />
            </Button>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                    <button className="p-2.5 bg-card/50 border border-border/50 rounded-xl backdrop-blur-md transition-all active:scale-90 hover:border-primary/50">
                    <Menu className="w-5 h-5 text-muted-foreground" />
                    </button>
                </SheetTrigger>
                <SheetContent className="bg-background/95 backdrop-blur-xl border-l border-border">
                    <div className="mt-10 space-y-4">
                    <Button variant="ghost" className="w-full justify-start gap-3 h-14 rounded-2xl" onClick={() => navigate('/stats')}>
                        <Activity className="w-5 h-5 text-primary" /> <span>الإحصائيات</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-14 rounded-2xl">
                        <Users className="w-5 h-5 text-muted-foreground" /> <span>الأصدقاء</span>
                    </Button>
                    <div className="pt-4 border-t border-border/50">
                        <Button variant="destructive" className="w-full rounded-2xl h-12" onClick={signOut}>
                        <LogOut className="w-4 h-4 ml-2" /> تسجيل الخروج
                        </Button>
                    </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto z-10 px-4 pb-24 space-y-6">

        {/* ═══════════════ THE ULTIMATE HUNTER LICENSE CARD ═══════════════ */}
        <div 
          ref={cardRef}
          className={cn(
            "relative rounded-[2.5rem] overflow-hidden transition-all duration-1000 p-1",
            rankData.glow,
            animateIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          {/* Card Border / Glow Layer */}
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40", rankData.gradient)} />
          
          <div className="relative bg-[#050505] rounded-[2.4rem] p-6 border border-white/10 overflow-hidden group">
            {/* Background Texture & Effects */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            {/* Mana Encryption Indicator (Inside Card) */}
            <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
                {!isDiscordLinked ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/40 rounded-full animate-pulse">
                        <ShieldOff className="w-3 h-3 text-red-500" />
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Unprotected</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/40 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Encrypted</span>
                    </div>
                )}
            </div>

            {/* Header: Title & Serial */}
            <div className="relative z-10 mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-6 h-1 rounded-full bg-gradient-to-r", rankData.gradient)} />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Hunter Association</span>
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                    Official License <Sparkles className="w-4 h-4 text-primary" />
                </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                {/* Profile Section */}
                <div className="flex gap-6 items-center">
                    <div className="relative group/avatar">
                        <div className={cn("absolute -inset-1.5 rounded-2xl bg-gradient-to-br opacity-50 blur-md group-hover/avatar:opacity-100 transition-opacity animate-glow-pulse", rankData.gradient)} />
                        <div className="relative w-32 h-40 rounded-2xl overflow-hidden border-2 border-white/20 bg-black">
                            <img src={profile?.avatar_url || "/setvoid.png"} className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-500 scale-105" alt="hunter" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                            <button 
                                onClick={() => fileInputRef.current?.click()} 
                                className="absolute bottom-2 right-2 p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 active:scale-90 transition-transform"
                            >
                                <Camera className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-primary uppercase tracking-widest opacity-70">Identity Name</p>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none drop-shadow-lg">
                                {gameState.playerName}
                            </h2>
                        </div>
                        
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-bold text-primary uppercase tracking-widest opacity-70">Assigned Rank</p>
                            <div className={cn("text-lg font-black italic uppercase leading-none drop-shadow-[0_0_10px_currentColor]", rankData.textColor)}>
                                {rankData.title}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex items-center gap-3 w-fit">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-black border border-white/10", rankData.borderColor)}>
                                <span className={cn("text-2xl font-black italic", rankData.textColor)}>{rankData.name}</span>
                            </div>
                            <div>
                                <p className="text-[7px] font-black text-white/40 uppercase">Level</p>
                                <p className="text-xl font-black text-white leading-none">{gameState.totalLevel}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Divider Line */}
                <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                {/* Stats Grid Inside Card */}
                <div className="flex-1 grid grid-cols-2 gap-3">
                    {stats.map((stat) => (
                        <div key={stat.key} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                            <stat.icon className={cn("w-4 h-4", stat.textColor)} />
                            <div>
                                <p className="text-[8px] font-black text-white/30 uppercase leading-none">{stat.label}</p>
                                <p className="text-sm font-black text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                    <div className="col-span-2 bg-primary/10 border border-primary/20 rounded-xl p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-amber-400" />
                            <span className="text-[10px] font-black text-white/80 uppercase italic">{gameState.equippedTitle || "No Title"}</span>
                        </div>
                        <div className="p-1 bg-white rounded-md">
                            {profile && <PlayerQRCode playerId={profile.player_id} playerName={profile.player_name} size={28} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom ID Bar */}
            <div className="relative z-10 mt-8 flex justify-between items-center border-t border-white/10 pt-4">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Verification ID</span>
                        <span className="text-[10px] font-mono font-bold text-white/60">{profile?.player_id?.substring(0, 16).toUpperCase()}</span>
                    </div>
                </div>
                <div className="flex gap-2 text-white/20">
                   <Fingerprint className="w-5 h-5" />
                   <ShieldCheck className="w-5 h-5" />
                </div>
            </div>

            {/* Scan Line Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute w-full h-1/2 bg-gradient-to-b from-primary/20 to-transparent -top-1/2 animate-scan-slow" />
            </div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* ═══════════════ ACTION CENTER ═══════════════ */}
        <div className={cn(
          "grid grid-cols-2 gap-3 transition-all duration-700 delay-300",
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Dialog onOpenChange={(open) => !open && (setSearchMode('main'), setShowResult(false))}>
            <DialogTrigger asChild>
              <Button className="h-20 bg-primary hover:bg-primary/90 rounded-[1.5rem] border-none shadow-[0_8px_30px_hsl(var(--primary)/0.3)] transition-all active:scale-95 flex flex-col items-center justify-center gap-1 group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 -skew-x-12" />
                <Scan className="w-6 h-6 text-primary-foreground relative z-10" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary-foreground relative z-10">Scan Hunter</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] bg-black border-white/10 rounded-[2.5rem] p-8 text-foreground shadow-2xl">
                <h2 className="text-center font-black text-primary italic text-3xl tracking-tighter mb-8">GLOBAL SEARCH</h2>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setSearchMode('id')} className="h-32 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-primary/10 hover:border-primary/50 transition-all group">
                        <Fingerprint className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-white/60">Search by ID</span>
                    </button>
                    <button onClick={() => setSearchMode('qr')} className="h-32 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-primary/10 hover:border-primary/50 transition-all group">
                        <QrCode className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-white/60">Scan QR</span>
                    </button>
                </div>
            </DialogContent>
          </Dialog>

          <div className="grid grid-rows-2 gap-3">
            <Button 
                variant="ghost" 
                className="h-full bg-card/40 border border-border/30 rounded-2xl flex items-center gap-3 hover:bg-card active:scale-95"
                onClick={() => navigate('/history')}
            >
                <History className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Log History</span>
            </Button>
            <Button 
                variant="ghost" 
                className="h-full bg-card/40 border border-border/30 rounded-2xl flex items-center gap-3 hover:bg-card active:scale-95"
                onClick={() => { navigator.clipboard.writeText(profile?.player_id || ''); toast({ title: "Copied ID!" }); }}
            >
                <Copy className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Copy Code</span>
            </Button>
          </div>
        </div>

        {/* System Warnings */}
        {!isDiscordLinked && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in zoom-in duration-500">
                <div className="bg-red-500/20 p-2 rounded-xl">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                    <h4 className="text-xs font-black text-red-500 uppercase tracking-tighter">System Alert: Mana Unstable</h4>
                    <p className="text-[10px] text-red-400/80 font-bold">يرجى ربط حساب الديسكورد لتأمين بيانات الصياد وتفعيل تشفير المانا.</p>
                </div>
            </div>
        )}

      </main>

      <BottomNav />
      <style>{`
        @keyframes scan-slow {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(200%); }
        }
        .animate-scan-slow {
            animation: scan-slow 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Profile;
