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
    { key: 'profile', label: 'البروفايل', labelEn: 'Profile', icon: User, color: 'text-primary', borderColor: 'border-primary/40', bgColor: 'bg-primary/10', path: null },
    { key: 'market', label: 'السوق', labelEn: 'Market', icon: ShoppingBag, color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10', path: '/market' },
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
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header with Burger Menu */}
        <header className="flex justify-between items-center p-4 border-b border-primary/30">
          <h1 className="text-xl font-bold tracking-[0.1em] uppercase italic text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]">
            Player Profile
          </h1>
          
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button 
              onClick={() => setSearchModalOpen(true)}
              className="p-3 bg-primary/20 border border-primary/40 rounded-lg hover:bg-primary/30 transition-all"
            >
              <Search className="w-5 h-5 text-primary" />
            </button>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button className="p-3 bg-primary/20 border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">
                  <Menu className="w-5 h-5 text-primary" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-card/95 border-l border-primary/30 p-0">
                <SheetHeader className="p-4 border-b border-primary/20">
                  <SheetTitle className="text-sm font-bold tracking-[0.15em] uppercase text-primary text-right">
                    القائمة
                  </SheetTitle>
                </SheetHeader>
                
                <ScrollArea className="flex-1 p-3">
                  <nav className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      
                      if (item.path) {
                        return (
                          <Link
                            key={item.key}
                            to={item.path}
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border transition-all group",
                              item.borderColor,
                              item.bgColor,
                              "hover:scale-[1.02]"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-lg border flex items-center justify-center",
                              item.borderColor,
                              item.bgColor
                            )}>
                              <Icon className={cn("w-5 h-5", item.color)} />
                            </div>
                            <div className="flex-1 text-right">
                              <p className={cn("font-bold text-sm", item.color)}>{item.label}</p>
                              <p className="text-[10px] text-muted-foreground">{item.labelEn}</p>
                            </div>
                            <ChevronRight className={cn("w-4 h-4", item.color, "rotate-180")} />
                          </Link>
                        );
                      }
                      
                      return (
                        <div
                          key={item.key}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border",
                            item.borderColor,
                            item.bgColor,
                            "shadow-[0_0_15px_hsl(var(--primary)/0.2)]"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg border flex items-center justify-center",
                            item.borderColor,
                            item.bgColor
                          )}>
                            <Icon className={cn("w-5 h-5", item.color)} />
                          </div>
                          <div className="flex-1 text-right">
                            <p className={cn("font-bold text-sm", item.color)}>{item.label}</p>
                            <p className="text-[10px] text-muted-foreground">{item.labelEn}</p>
                          </div>
                        </div>
                      );
                    })}
                  </nav>
                </ScrollArea>

                {/* Player Info Mini */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-primary/20 bg-card/90">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">المستوى الكلي</p>
                    <p className="text-2xl font-black text-primary">{gameState.totalLevel}</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 space-y-6">
          <div className="max-w-lg mx-auto space-y-6">
            {/* Holographic Profile Card */}
            <HolographicProfile gameState={gameState} />

            {/* QR Code & Player ID */}
            <section className="bg-card/60 backdrop-blur-lg border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold tracking-wider uppercase text-primary">معرف اللاعب</h2>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                {!profileLoading && profile && (
                  <>
                    <PlayerQRCode 
                      playerId={profile.player_id} 
                      playerName={profile.player_name}
                      size={140}
                    />
                    
                    <Button
                      variant="outline"
                      onClick={copyPlayerId}
                      className="flex items-center gap-2 border-primary/30 hover:bg-primary/10"
                    >
                      <Copy className="w-4 h-4" />
                      نسخ المعرف
                    </Button>
                  </>
                )}
                
                {profileLoading && (
                  <div className="h-40 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </section>

            {/* Account Information */}
            <section className="bg-card/60 backdrop-blur-lg border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold tracking-wider uppercase text-primary">معلومات الحساب</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 text-right">
                    <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                    <p className="text-sm font-medium text-foreground" dir="ltr">{user?.email || 'غير متوفر'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 text-right">
                    <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(user?.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 text-right">
                    <p className="text-xs text-muted-foreground">اسم اللاعب</p>
                    <p className="text-sm font-medium text-foreground">{gameState.playerName}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Account Settings */}
            <section className="bg-card/60 backdrop-blur-lg border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold tracking-wider uppercase text-primary">إعدادات الحساب</h2>
              </div>
              
              <div className="space-y-2">
                <button 
                  className="w-full flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all text-right"
                  onClick={() => toast({ title: 'قريباً', description: 'هذه الميزة ستكون متاحة قريباً' })}
                >
                  <Key className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">تغيير كلمة المرور</p>
                    <p className="text-xs text-muted-foreground">تحديث كلمة المرور الخاصة بك</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground rotate-180" />
                </button>

                <button 
                  className="w-full flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg hover:bg-destructive/20 transition-all text-right"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="w-5 h-5 text-destructive" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">تسجيل الخروج</p>
                    <p className="text-xs text-destructive/70">الخروج من حسابك الحالي</p>
                  </div>
                </button>
              </div>
            </section>

            {/* Game Stats Summary */}
            <section className="bg-card/60 backdrop-blur-lg border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold tracking-wider uppercase text-primary">إحصائيات اللعب</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-primary">{gameState.totalQuestsCompleted}</p>
                  <p className="text-xs text-muted-foreground">المهام المكتملة</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-orange-400">{gameState.streakDays}</p>
                  <p className="text-xs text-muted-foreground">أيام متتالية</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-yellow-400">{gameState.gold}</p>
                  <p className="text-xs text-muted-foreground">الذهب</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-purple-400">{gameState.shadowPoints}</p>
                  <p className="text-xs text-muted-foreground">نقاط الظل</p>
                </div>
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
