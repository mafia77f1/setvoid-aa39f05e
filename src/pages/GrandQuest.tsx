import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { StatType } from '@/types/game';
import { Flag, Check, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const categoryLabels: Record<StatType, string> = {
  strength: 'صحي (الجسد)',
  mind: 'عقلي (التعلم)',
  spirit: 'روحي (العبادات)',
  quran: 'قرآني (الحفظ والقراءة)',
};

const suggestedTasks: Record<StatType, string[]> = {
  strength: ['تمارين 30 دقيقة', 'شرب 8 أكواب ماء', 'نوم 7 ساعات', 'مشي 5000 خطوة'],
  mind: ['قراءة 30 صفحة', 'تعلم مهارة جديدة', 'ترك السوشيال ميديا', 'تدوين الأفكار'],
  spirit: ['صلاة الفجر في وقتها', 'أذكار الصباح والمساء', 'صدقة يومية', 'استغفار 100 مرة'],
  quran: ['قراءة جزء يومياً', 'حفظ 5 آيات', 'مراجعة المحفوظ', 'تدبر صفحة'],
};

const GrandQuest = () => {
  const { gameState, startGrandQuest, completeGrandQuestDay } = useGameState();
  const [selectedCategory, setSelectedCategory] = useState<StatType>('strength');
  const [questTitle, setQuestTitle] = useState('');

  const handleStart = () => {
    if (!questTitle.trim()) {
      toast({
        title: 'خطأ',
        description: 'الرجاء إدخال عنوان للهدف',
        variant: 'destructive',
      });
      return;
    }

    startGrandQuest(selectedCategory, questTitle, suggestedTasks[selectedCategory]);
    toast({
      title: '🎯 بدأ التحدي!',
      description: 'تحدي 30 يوم في انتظارك',
    });
  };

  const handleCompleteDay = () => {
    completeGrandQuestDay();
    toast({
      title: '✓ يوم مكتمل!',
      description: `أكملت ${(gameState.grandQuest?.completedDays || 0) + 1} من 30 يوم`,
    });
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-border bg-card/50 px-4 py-6">
        <h1 className="text-2xl font-bold">الهدف الكبير</h1>
        <p className="text-muted-foreground">تحدي 30 يوم لتحقيق هدف عظيم</p>
      </header>

      <main className="container mx-auto px-4 py-6">
        {gameState.grandQuest?.active ? (
          <div className="space-y-6">
            {/* Active Quest Card */}
            <div className="stat-card border-2 border-primary/30">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary/20 p-3">
                  <Flag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{gameState.grandQuest.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {categoryLabels[gameState.grandQuest.category]}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>التقدم</span>
                  <span className="font-bold text-primary">
                    {gameState.grandQuest.completedDays} / 30 يوم
                  </span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-primary to-primary-glow transition-all"
                    style={{ width: `${(gameState.grandQuest.completedDays / 30) * 100}%` }}
                  />
                </div>
              </div>

              {/* Daily Tasks */}
              <div className="mb-4">
                <h4 className="mb-2 font-semibold">المهام اليومية:</h4>
                <ul className="space-y-2">
                  {gameState.grandQuest.dailyTasks.map((task, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={handleCompleteDay} className="w-full gap-2" size="lg">
                <Check className="h-5 w-5" />
                إتمام مهام اليوم
              </Button>
            </div>

            {/* Days Counter */}
            <div className="flex items-center justify-center gap-2 rounded-xl bg-card p-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                متبقي {30 - gameState.grandQuest.completedDays} يوم
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="stat-card">
              <h3 className="mb-4 font-semibold">ابدأ تحدي جديد</h3>
              
              <div className="mb-6">
                <Label htmlFor="title" className="mb-2 block">
                  عنوان الهدف
                </Label>
                <Input
                  id="title"
                  placeholder="مثال: أصبح أقوى جسدياً"
                  value={questTitle}
                  onChange={(e) => setQuestTitle(e.target.value)}
                  className="text-right"
                />
              </div>

              <div className="mb-6">
                <Label className="mb-3 block">اختر نوع التحدي</Label>
                <RadioGroup
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as StatType)}
                  className="space-y-3"
                >
                  {(Object.entries(categoryLabels) as [StatType, string][]).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <RadioGroupItem value={key} id={key} />
                      <Label htmlFor={key} className="flex-1 cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="mb-6">
                <h4 className="mb-2 text-sm font-medium">المهام المقترحة:</h4>
                <ul className="space-y-1">
                  {suggestedTasks[selectedCategory].map((task, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {task}
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={handleStart} className="w-full gap-2" size="lg">
                <Flag className="h-5 w-5" />
                ابدأ التحدي
              </Button>
            </div>

            {/* Completed Grand Quest Message */}
            {gameState.grandQuest && !gameState.grandQuest.active && (
              <div className="rounded-xl border border-secondary/30 bg-secondary/10 p-4 text-center">
                <p className="font-medium text-secondary">
                  🎉 أكملت التحدي السابق! يمكنك بدء تحدٍ جديد
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default GrandQuest;
