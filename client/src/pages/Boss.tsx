import { useGameState } from '@/hooks/useGameState';
import { BossBattleCard } from '@/components/BossBattleCard';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { RefreshCw, Skull } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Boss = () => {
  const { gameState, resetBoss } = useGameState();
  const boss = gameState.currentBoss;

  const handleNewBoss = () => {
    resetBoss();
    toast({
      title: 'زعيم جديد!',
      description: 'تحدٍ جديد في انتظارك',
    });
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="relative px-4 py-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/20 border border-destructive/40">
          <Skull className="w-5 h-5 text-destructive" />
          <h1 className="text-xl font-bold text-destructive">معركة الزعيم</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">حارب عاداتك السيئة وتغلب عليها</p>
      </header>

      <main className="container mx-auto px-4 py-6">
        {boss && <BossBattleCard boss={boss} />}

        {boss?.defeated && (
          <Button 
            onClick={handleNewBoss} 
            className="mt-6 w-full gap-2"
            size="lg"
          >
            <RefreshCw className="h-5 w-5" />
            تحدي زعيم جديد
          </Button>
        )}

        {/* Boss Tips */}
        <div className="mt-6 system-panel p-4">
          <h3 className="font-bold mb-3 text-sm">نصائح للمعركة</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              أكمل المهمات المطلوبة لإلحاق الضرر بالزعيم
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              كل مهمة تقلل من صحة الزعيم
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              اهزم الزعيم لتثبت قوتك وتغلبك على العادة السيئة
            </li>
          </ul>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Boss;