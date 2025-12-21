import { useGameState } from '@/hooks/useGameState';
import { QuestCardNew } from '@/components/QuestCardNew';
import { BottomNav } from '@/components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Brain, Heart, BookOpen, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Quests = () => {
  const { gameState, completeQuest } = useGameState();

  const handleComplete = (questId: string) => {
    completeQuest(questId);
    toast({
      title: 'مهمة مكتملة!',
      description: 'أحسنت! استمر في التقدم',
    });
  };

  const strengthQuests = gameState.quests.filter(q => q.category === 'strength');
  const mindQuests = gameState.quests.filter(q => q.category === 'mind');
  const spiritQuests = gameState.quests.filter(q => q.category === 'spirit');
  const quranQuests = gameState.quests.filter(q => q.category === 'quran');

  const completedCount = gameState.quests.filter(q => q.completed).length;
  const totalCount = gameState.quests.length;

  return (
    <div className="min-h-screen pb-24">
      <header className="relative px-4 py-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/40">
          <Target className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-primary">المهمات اليومية</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {completedCount} / {totalCount} مهمات مكتملة اليوم
        </p>
      </header>

      <main className="container mx-auto px-4 py-2">
        <Tabs defaultValue="strength" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4 bg-card/50 border border-primary/20 p-1 h-auto">
            <TabsTrigger 
              value="strength" 
              className="flex flex-col gap-1 py-3 data-[state=active]:bg-strength/20 data-[state=active]:text-strength"
            >
              <Dumbbell className="h-4 w-4" />
              <span className="text-[10px]">الجسد</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mind" 
              className="flex flex-col gap-1 py-3 data-[state=active]:bg-mind/20 data-[state=active]:text-mind"
            >
              <Brain className="h-4 w-4" />
              <span className="text-[10px]">العقل</span>
            </TabsTrigger>
            <TabsTrigger 
              value="spirit" 
              className="flex flex-col gap-1 py-3 data-[state=active]:bg-spirit/20 data-[state=active]:text-spirit"
            >
              <Heart className="h-4 w-4" />
              <span className="text-[10px]">الروح</span>
            </TabsTrigger>
            <TabsTrigger 
              value="quran" 
              className="flex flex-col gap-1 py-3 data-[state=active]:bg-quran/20 data-[state=active]:text-quran"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-[10px]">القرآن</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="strength" className="space-y-3">
            {strengthQuests.map(quest => (
              <QuestCardNew key={quest.id} quest={quest} onComplete={handleComplete} />
            ))}
          </TabsContent>

          <TabsContent value="mind" className="space-y-3">
            {mindQuests.map(quest => (
              <QuestCardNew key={quest.id} quest={quest} onComplete={handleComplete} />
            ))}
          </TabsContent>

          <TabsContent value="spirit" className="space-y-3">
            {spiritQuests.map(quest => (
              <QuestCardNew key={quest.id} quest={quest} onComplete={handleComplete} />
            ))}
          </TabsContent>

          <TabsContent value="quran" className="space-y-3">
            {quranQuests.map(quest => (
              <QuestCardNew key={quest.id} quest={quest} onComplete={handleComplete} />
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Quests;