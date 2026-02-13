import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { BottomNav } from '@/components/BottomNav';
import { HolographicProfile } from '@/components/HolographicProfile';
import { PlayerQRCode } from '@/components/PlayerQRCode';
import { PlayerSearchModal } from '@/components/PlayerSearchModal';
import { cn } from '@/lib/utils';
import { User, ShoppingBag, ChevronRight, Menu, Mail, Calendar, LogOut, Key, Settings, Shield, QrCode, Search, Copy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FriendsPanel } from '@/components/FriendsPanel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { gameState } = useGameState();
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const menuItems = [
    { key: 'profile', label: 'البروفايل', labelEn: 'Profile', icon: User, color: 'text-slate-100', borderColor: 'border-slate-200/40', bgColor: 'bg-slate-500/10', path: null },
    { key: 'market', label: 'السوق', labelEn: 'Market', icon: ShoppingBag, color: 'text-white', borderColor: 'border-white/40', bgColor: 'bg-white/10', path: '/market' },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تسجيل الخروج',
        variant: 'destructive',
      });
      setIsLoggingOut(false);
      return;
    }
    localStorage.removeItem('pendingPlayerName');
    localStorage.removeItem('needsPassword');
    navigate('/');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'غير متوفر';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const copyPlayerId = () => {
    if (profile?.player_id) {
      navigator.clipboard.writeText(profile.player_id);
      toast({ title: 'تم النسخ', description: 'تم نسخ معرف اللاعب' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 font-sans pb-24 overflow-x-hidden relative">
      {/* Solo Leveling Grid Background & Scanlines */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-black/80" />
        {/* Animated Scanline Effect */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(255,255,255,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02),rgba(255,255,255,0.06))] bg-[size:100%_4px,4px_100%]" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Cyber Header - Silver/White Style */}
        <header className="flex justify-between items-center p-6 border-b border-white/20 backdrop-blur-md bg-black/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-[0.2em] uppercase italic text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
              Status Window
            </h1>
            <span className="text-[10px] text-slate-400 tracking-[0.3em] -mt-1 uppercase">Leveling System v4.0</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSearchModalOpen(true)}
              className="p-2 bg-white/5 border border-white/20 rounded-sm hover:bg-white/20 transition-all group"
            >
              <Search className="w-5 h-5 text-slate-300 group-hover:text-white" />
            </button>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button className="p-2 bg-white/5 border border-white/20 rounded-sm hover:bg-white/20 transition-all">
                  <Menu className="w-6 h-6 text-white" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-[#0d1117]/95 border-l border-white/20 p-0 backdrop-blur-xl">
                <SheetHeader className="p-6 border-b border-white/10">
                  <SheetTitle className="text-sm font-bold tracking-[0.2em] uppercase text-white text-right">
                    Menu Console
                  </SheetTitle>
                </SheetHeader>
                
                <ScrollArea className="flex-1 p-4">
                  <nav className="space-y-3">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      
                      if (item.path) {
                        return (
                          <Link
                            key={item.key}
                            to={item.path}
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-none border-r-2 transition-all group",
                              "border-white/20 bg-white/5",
                              "hover:bg-white/10 hover:border-white shadow-inner"
                            )}
                          >
                            <Icon className="w-5 h-5 text-white" />
                            <div className="flex-1 text-right">
                              <p className="font-bold text-sm text-white">{item.label}</p>
                              <p className="text-[10px] text-slate-400">{item.labelEn}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white rotate-180" />
                          </Link>
                        );
                      }
                      
                      return (
                        <div
                          key={item.key}
                          className="flex items-center gap-4 p-4 border-r-2 border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        >
                          <Icon className="w-5 h-5 text-white" />
                          <div className="flex-1 text-right">
                            <p className="font-bold text-sm text-white">{item.label}</p>
                            <p className="text-[10px] text-slate-300">{item.labelEn}</p>
                          </div>
                        </div>
                      );
                    })}
                  </nav>
                </ScrollArea>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-black/40">
                  <div className="border border-white/20 p-4 text-center relative group overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <p className="text-[10px] text-slate-400 relative">TOTAL LEVEL</p>
                    <p className="text-3xl font-black text-white relative drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                      {gameState.totalLevel}
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 space-y-8 relative">
          <div className="max-w-lg mx-auto space-y-8">
            
            {/* Holographic Profile Card - Specialized Solo Leveling look */}
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
               <HolographicProfile gameState={gameState} />
            </div>

            {/* QR Code Section - Silver Tech Style */}
            <section className="bg-black/40 backdrop-blur-md border border-white/20 rounded-none p-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white" />
              
              <div className="flex items-center gap-3 mb-6">
                <QrCode className="w-5 h-5 text-white animate-pulse" />
                <h2 className="text-xs font-black tracking-[0.3em] uppercase text-white/80">Player Authentication</h2>
              </div>
              
              <div className="flex flex-col items-center gap-6">
                {profileLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  </div>
                ) : profile ? (
                  <>
                    <div className="p-2 bg-white rounded-sm shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                      <PlayerQRCode 
                        playerId={profile.player_id} 
                        playerName={profile.player_name}
                        size={160}
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={copyPlayerId}
                      className="w-full flex items-center justify-center gap-2 border-white/20 bg-white/5 hover:bg-white/10 hover:border-white text-white transition-all rounded-none uppercase text-xs tracking-widest"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Hunter ID
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-slate-400 text-[10px] tracking-widest">INITIALIZING DATA...</p>
                  </div>
                )}
              </div>
            </section>

            {/* Account Information - The "System" Table Style */}
            <section className="bg-black/40 backdrop-blur-md border border-white/10 rounded-none p-6 relative">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-2">
                <Shield className="w-5 h-5 text-white" />
                <h2 className="text-xs font-black tracking-[0.3em] uppercase text-white">System Info</h2>
              </div>
              
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email Address', value: user?.email || 'N/A', dir: 'ltr' },
                  { icon: Calendar, label: 'Creation Date', value: formatDate(user?.created_at), dir: 'rtl' },
                  { icon: User, label: 'Hunter Name', value: gameState.playerName, dir: 'rtl' }
                ].map((info, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 border-l-2 border-white/20 group hover:border-white transition-all">
                    <info.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    <div className="flex-1 text-right">
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{info.label}</p>
                      <p className={cn("text-sm font-bold text-slate-200", info.dir === 'ltr' && "font-mono")}>{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Account Settings - Sharp & Clean */}
            <section className="bg-black/60 border border-white/10 rounded-none p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-5 h-5 text-white" />
                <h2 className="text-xs font-black tracking-[0.3em] uppercase text-white">Security Console</h2>
              </div>
              
              <div className="space-y-3">
                <button 
                  className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-right group"
                  onClick={() => toast({ title: 'System Notice', description: 'This feature is currently locked.' })}
                >
                  <Key className="w-5 h-5 text-slate-400 group-hover:text-white" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white uppercase tracking-tight">Access Key</p>
                    <p className="text-[10px] text-slate-500">Update security credentials</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white rotate-180 transition-all" />
                </button>

                <button 
                  className="w-full flex items-center gap-4 p-4 bg-red-950/20 border border-red-900/40 hover:bg-red-900/30 transition-all text-right group"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="w-5 h-5 text-red-500 group-hover:animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-500 uppercase tracking-tight">Terminate Session</p>
                    <p className="text-[10px] text-red-900/70 text-slate-500">Logout from the system</p>
                  </div>
                </button>
              </div>
            </section>

            {/* Friends Panel */}
            <div className="friends-panel-silver shadow-[0_0_15px_rgba(255,255,255,0.05)]">
               <FriendsPanel />
            </div>

            {/* Game Stats Summary - High Contrast White/Silver */}
            <section className="bg-black/40 backdrop-blur-md border border-white/20 rounded-none p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-white shadow-[0_0_10px_white]" />
                <h2 className="text-xs font-black tracking-[0.3em] uppercase text-white">Attribute Stats</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Completed Quests', value: gameState.totalQuestsCompleted, color: 'text-white' },
                  { label: 'Active Streak', value: gameState.streakDays, color: 'text-slate-200' },
                  { label: 'Gold Balance', value: gameState.gold, color: 'text-yellow-200' },
                  { label: 'Shadow Energy', value: gameState.shadowPoints, color: 'text-purple-300' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 text-center group hover:bg-white/10 transition-colors">
                    <p className={cn("text-2xl font-black mb-1 drop-shadow-sm", stat.color)}>{stat.value}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <BottomNav />
      <PlayerSearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
    </div>
  );
};

export default Profile;
