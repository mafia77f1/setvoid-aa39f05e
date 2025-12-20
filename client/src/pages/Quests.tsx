// ============================================
// نظام المستويات المحدث - كل 10 مهمات = 1 لفل
// ============================================
// 
// يجب دمج هذا الكود في ملف useGameState Hook الخاص بك

// 1. أضف هذه الحالات إلى GameState interface:
interface GameState {
  // ... باقي الحالات
  completedQuestsCount: number;      // عداد المهمات المكتملة الكلي
  questsUntilLevelUp: number;        // المهمات المتبقية للفل القادم
  categoryQuestCounts: {             // عداد لكل فئة
    strength: number;
    mind: number;
    spirit: number;
    quran: number;
  };
}

// 2. القيم الابتدائية:
const initialGameState = {
  // ... باقي القيم
  completedQuestsCount: 0,
  questsUntilLevelUp: 10,
  categoryQuestCounts: {
    strength: 0,
    mind: 0,
    spirit: 0,
    quran: 0,
  },
};

// 3. دالة completeQuest المحدثة:
const completeQuest = useCallback((questId: string) => {
  setGameState(prev => {
    // البحث عن المهمة
    const quest = prev.quests.find(q => q.id === questId);
    
    // إذا كانت المهمة مكتملة مسبقاً أو غير موجودة، لا تفعل شيء
    if (!quest || quest.completed) return prev;

    // تحديث المهمة كمكتملة
    const updatedQuests = prev.quests.map(q =>
      q.id === questId ? { ...q, completed: true } : q
    );

    // زيادة عداد المهمات الكلي
    const newCompletedCount = prev.completedQuestsCount + 1;
    
    // زيادة عداد الفئة المحددة
    const newCategoryCount = prev.categoryQuestCounts[quest.category] + 1;
    const updatedCategoryCounts = {
      ...prev.categoryQuestCounts,
      [quest.category]: newCategoryCount
    };
    
    // التحقق إذا وصلنا 10 مهمات لهذه الفئة
    const shouldLevelUp = newCategoryCount % 10 === 0;
    
    // حساب المهمات المتبقية للفل القادم
    const questsRemaining = 10 - (newCategoryCount % 10);

    // إضافة XP للفئة المناسبة
    const newStats = {
      ...prev.stats,
      [quest.category]: prev.stats[quest.category] + quest.xpReward
    };

    // حساب المستويات الجديدة
    const newLevels = { ...prev.levels };
    
    // إذا وصلنا 10 مهمات، نزيد المستوى للفئة
    if (shouldLevelUp) {
      newLevels[quest.category] = prev.levels[quest.category] + 1;
      
      console.log(`🎉 Level Up! ${quest.category} is now level ${newLevels[quest.category]}`);
      console.log(`📊 Completed ${newCategoryCount} quests in ${quest.category}`);
    }

    // حساب المستوى الكلي
    const newTotalLevel = Object.values(newLevels).reduce((sum, level) => sum + level, 0);

    // إضافة ذهب
    const goldReward = Math.floor(quest.xpReward / 2);
    const newGold = prev.gold + goldReward;

    // إظهار رسالة Level Up إذا لزم الأمر
    let newLevelUpInfo = prev.levelUpInfo;
    if (shouldLevelUp) {
      newLevelUpInfo = {
        show: true,
        newLevel: newLevels[quest.category],
        category: quest.category
      };
    }

    return {
      ...prev,
      quests: updatedQuests,
      stats: newStats,
      levels: newLevels,
      totalLevel: newTotalLevel,
      gold: newGold,
      completedQuestsCount: newCompletedCount,
      questsUntilLevelUp: questsRemaining === 10 ? 0 : questsRemaining,
      categoryQuestCounts: updatedCategoryCounts,
      levelUpInfo: newLevelUpInfo
    };
  });
}, []);

// 4. عرض عداد المهمات في الواجهة (مثال):
// في صفحة Quests.tsx أو أي مكان تريد عرضه:

const QuestsProgressDisplay = ({ gameState }: { gameState: GameState }) => {
  return (
    <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-primary">التقدم للمستوى القادم</span>
        <span className="text-xs text-muted-foreground">
          {gameState.completedQuestsCount} مهمة كلية
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-3">
        {Object.entries(gameState.categoryQuestCounts).map(([category, count]) => {
          const remaining = 10 - (count % 10);
          const progress = ((count % 10) / 10) * 100;
          
          return (
            <div key={category} className="p-2 rounded-lg bg-card/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium capitalize">{category}</span>
                <span className="text-xs text-muted-foreground">
                  {count % 10}/10
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                {remaining === 10 ? 'جاهز للفل!' : `${remaining} متبقية`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 5. حفظ البيانات في localStorage (اختياري):
useEffect(() => {
  // حفظ البيانات
  localStorage.setItem('sedark_quest_counts', JSON.stringify({
    completedQuestsCount: gameState.completedQuestsCount,
    categoryQuestCounts: gameState.categoryQuestCounts,
    questsUntilLevelUp: gameState.questsUntilLevelUp
  }));
}, [gameState.completedQuestsCount, gameState.categoryQuestCounts]);

// استرجاع البيانات عند التحميل:
useEffect(() => {
  const saved = localStorage.getItem('sedark_quest_counts');
  if (saved) {
    const data = JSON.parse(saved);
    setGameState(prev => ({
      ...prev,
      ...data
    }));
  }
}, []);

// ============================================
// ملاحظات مهمة:
// ============================================
// 
// 1. كل 10 مهمات من نفس الفئة = +1 لفل لتلك الفئة
// 2. العداد مستقل لكل فئة (strength, mind, spirit, quran)
// 3. يمكنك عرض التقدم في أي مكان بالواجهة
// 4. البيانات تُحفظ تلقائياً في localStorage
// 5. عند الوصول للهدف، يظهر Modal التهنئة بالـ Level Up
//
// ============================================
