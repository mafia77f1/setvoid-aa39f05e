import { useGameState } from '@/hooks/useGameState';
import { BossCard } from '@/components/BossCard';
import { QuestCard } from '@/components/QuestCard';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Boss = () => {
  const { gameState, completeQuest, resetBoss } = useGameState();
  const boss = gameState.currentBoss;

  const handleComplete = (questId: string) => {
    completeQuest(questId);
    
    const updatedBoss = gameState.currentBoss;
    if (updatedBoss && updatedBoss.currentHp <= 0) {
      toast({
        title: '🎉 انتصار!',
        description: 'لقد هزمت الزعيم! أحسنت',
      });
    } else {
      toast({
        title: '⚔️ ضربة ناجحة!',
        description: 'أضعفت الزعيم، استمر!',
      });
    }
  };

  const handleNewBoss = () => {
    resetBoss();
    toast({
      title: '🆕 زعيم جديد!',
      description: 'تحدٍ جديد في انتظارك',
    });
  };

  const bossQuests = boss 
    ? gameState.quests.filter(q => boss.requiredQuests.includes(q.id))
    : [];

  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-border bg-card/50 px-4 py-6">
        <h1 className="text-2xl font-bold">معركة الزعيم</h1>
        <p className="text-muted-foreground">حارب عاداتك السيئة وتغلب عليها</p>
      </header>

      <main className="container mx-auto px-4 py-6">
        {boss && <BossCard boss={boss} />}

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

        {boss && !boss.defeated && (
          <>
            <h3 className="mb-4 mt-8 text-lg font-semibold">المهمات المطلوبة لهزيمة الزعيم</h3>
            <div className="space-y-3">
              {bossQuests.map(quest => (
                <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Boss;
