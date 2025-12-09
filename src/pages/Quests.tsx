import { useGameState } from '@/hooks/useGameState';
import { QuestCard } from '@/components/QuestCard';
import { BottomNav } from '@/components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Brain, Heart, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Quests = () => {
  const { gameState, completeQuest } = useGameState();

  const handleComplete = (questId: string) => {
    completeQuest(questId);
    toast({
      title: '✓ مهمة مكتملة!',
      description: 'أحسنت! استمر في التقدم',
    });
  };

  const strengthQuests = gameState.quests.filter(q => q.category === 'strength');
  const mindQuests = gameState.quests.filter(q => q.category === 'mind');
  const spiritQuests = gameState.quests.filter(q => q.category === 'spirit');
  const quranQuests = gameState.quests.filter(q => q.category === 'quran');

  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-border bg-card/50 px-4 py-6">
        <h1 className="text-2xl font-bold">المهمات اليومية</h1>
        <p className="text-muted-foreground">أكمل المهمات لتكسب XP وتطور نفسك</p>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="strength" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="strength" className="flex flex-col gap-1 py-3">
              <Dumbbell className="h-4 w-4" />
              <span className="text-xs">الجسد</span>
            </TabsTrigger>
            <TabsTrigger value="mind" className="flex flex-col gap-1 py-3">
              <Brain className="h-4 w-4" />
              <span className="text-xs">العقل</span>
            </TabsTrigger>
            <TabsTrigger value="spirit" className="flex flex-col gap-1 py-3">
              <Heart className="h-4 w-4" />
              <span className="text-xs">الروح</span>
            </TabsTrigger>
            <TabsTrigger value="quran" className="flex flex-col gap-1 py-3">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">القرآن</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="strength" className="space-y-3">
            {strengthQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />
            ))}
          </TabsContent>

          <TabsContent value="mind" className="space-y-3">
            {mindQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />
            ))}
          </TabsContent>

          <TabsContent value="spirit" className="space-y-3">
            {spiritQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />
            ))}
          </TabsContent>

          <TabsContent value="quran" className="space-y-3">
            {quranQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Quests;
