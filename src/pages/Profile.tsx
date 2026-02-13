import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { cn } from '@/lib/utils';
import { User, Dumbbell, Brain, Heart, Zap, Shield, Menu, Copy, LogOut, Fingerprint, Activity, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { gameState } = useGameState();
  const { signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const stats = [
    { key: 'strength', label: 'STR', icon: Dumbbell, color: 'text-red-600', bgColor: 'bg-red-500/10' },
    { key: 'mind', label: 'INT', icon: Brain, color: 'text-blue-600', bgColor: 'bg-blue-500/10' },
    { key: 'spirit', label: 'SPR', icon: Heart, color: 'text-emerald-600', bgColor: 'bg-emerald-500/10' },
    { key: 'agility', label: 'AGI', icon: Zap, color: 'text-amber-600', bgColor: 'bg-amber-500/10' },
  ];

  // منطق حساب حالة التشفير بناءً على التفاعل
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

  const getRankInfo = (level) => {
    if (level >= 50) return { name: 'S', color: 'text-orange-500', border: 'border-orange-500/50', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]' };
    if (level >= 40) return { name: 'A', color: 'text-purple-500', border: 'border-purple-500/50', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' };
    if (level >= 30) return { name: 'B', color: 'text-blue-500', border: 'border-blue-500/50', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]' };
    if (level >= 20) return { name: 'C', color: 'text-green-500', border: 'border-green-500/50', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]' };
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
          "relative w-full max-w-md aspect-[1/1.6] bg-[linear-gradient(135deg,#ffffff 0%,#eef2f7 100%)] border-[1px] border-white rounded-[2.5rem] p-7 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden",
          rank.glow
        )}>
          
          {/* TOP SECTION: QR (Clean) & RANK */}
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex flex-col items-center">
              <div className="p-1.5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100">
                {profile && (
                  <PlayerQRCode 
                    playerId={profile.player_id} 
                    playerName={profile.player_name}
                    size={75}
                  />
                )}
              </div>
            </div>
            
            <div className={cn(
              "w-20 h-20 rounded-2xl bg-white shadow-inner border-2 flex flex-col items-center justify-center",
              rank.border
            )}>
              <span className="text-[8px] font-black text-slate-400 tracking-widest">RANK</span>
              <span className={cn("text-4xl font-black italic", rank.color)}>{rank.name}</span>
            </div>
          </div>

          {/* USER INFO SECTION */}
          <div className="space-y-4 mb-6 relative z-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2">
                <User className="w-3 h-3" /> Name :
              </p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter truncate leading-none">
                {gameState.playerName}
              </h2>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2">
                <Star className="w-3 h-3 text-amber-500" /> LEVEL :
              </p>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-slate-800 tabular-nums">
                  {gameState.totalLevel}
                </span>
                <div className="h-6 w-[2px] bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Total<br/>Experience</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2">
                <Fingerprint className="w-3 h-3" /> ID :
              </p>
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => {
                  navigator.clipboard.writeText(profile?.player_id);
                  toast({ title: "تم نسخ المعرف" });
                }}
              >
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {profile?.player_id?.slice(0, 16)}...
                </span>
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>

          {/* LEVEL STATS: GRID CARDS */}
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-3 h-3 text-slate-400" />
              <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Level Stats :</p>
              <div className="h-[1px] flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.key} className="bg-white border border-slate-100 p-4 rounded-[1.8rem] shadow-sm flex flex-col items-center justify-center text-center gap-1 transition-transform active:scale-95">
                  <div className={cn("p-2 rounded-xl mb-1", stat.bgColor)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{stat.label}</span>
                  <span className="text-xl font-black text-slate-800">{gameState.levels[stat.key]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER: VERSION & ENCRYPTION STATUS */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center relative z-10">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">التشفير</span>
              <span className={cn("text-[10px] font-bold uppercase", encryption.color)}>
                {encryption.label}
              </span>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">اصدار الرخصة</span>
              <span className="text-[10px] font-bold text-slate-600">v0.1</span>
            </div>
          </div>

          {/* GLASS REFLECTION EFFECT */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/40 blur-[50px] rounded-full pointer-events-none" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
