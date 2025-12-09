import { useState, useEffect, useCallback } from 'react';
import { GameState, Quest, Boss, StatType, Ability, Achievement, GrandQuest } from '@/types/game';

const XP_PER_LEVEL = 100;

const getInitialQuests = (): Quest[] => [
  // Strength quests
  { id: 's1', title: 'شرب 8 أكواب ماء', description: 'حافظ على ترطيب جسمك', category: 'strength', xpReward: 15, completed: false, dailyReset: true },
  { id: 's2', title: '10,000 خطوة', description: 'امشِ 10 آلاف خطوة اليوم', category: 'strength', xpReward: 20, completed: false, dailyReset: true },
  { id: 's3', title: 'تمارين رياضية', description: '30 دقيقة تمارين', category: 'strength', xpReward: 25, completed: false, dailyReset: true },
  { id: 's4', title: 'نوم صحي', description: 'نم 7-8 ساعات', category: 'strength', xpReward: 20, completed: false, dailyReset: true },
  
  // Mind quests
  { id: 'm1', title: 'قراءة 30 دقيقة', description: 'اقرأ كتاباً مفيداً', category: 'mind', xpReward: 20, completed: false, dailyReset: true },
  { id: 'm2', title: 'تعلم شيء جديد', description: 'تعلم مهارة أو معلومة', category: 'mind', xpReward: 25, completed: false, dailyReset: true },
  { id: 'm3', title: 'ترك السوشيال ميديا', description: 'لا تستخدم السوشيال اليوم', category: 'mind', xpReward: 30, completed: false, dailyReset: true },
  { id: 'm4', title: 'كتابة هدف', description: 'اكتب هدفاً واضحاً', category: 'mind', xpReward: 15, completed: false, dailyReset: true },
  
  // Spirit quests
  { id: 'sp1', title: 'الصلاة في وقتها', description: 'صلِّ الفروض في وقتها', category: 'spirit', xpReward: 30, completed: false, dailyReset: true },
  { id: 'sp2', title: 'أذكار الصباح والمساء', description: 'اقرأ الأذكار كاملة', category: 'spirit', xpReward: 20, completed: false, dailyReset: true },
  { id: 'sp3', title: 'استغفار 100 مرة', description: 'استغفر الله 100 مرة', category: 'spirit', xpReward: 15, completed: false, dailyReset: true },
  { id: 'sp4', title: 'صدقة', description: 'تصدق ولو بالقليل', category: 'spirit', xpReward: 25, completed: false, dailyReset: true },
  { id: 'sp5', title: 'خلق حسن', description: 'ابتسم وأحسن للناس', category: 'spirit', xpReward: 20, completed: false, dailyReset: true },
  
  // Quran quests
  { id: 'q1', title: 'ورد القرآن اليومي', description: 'اقرأ جزءاً أو حزباً', category: 'quran', xpReward: 35, completed: false, dailyReset: true },
];

const getInitialAbilities = (): Ability[] => [
  { id: 'a1', name: 'قدرة الانضباط', description: 'تزيد تركيزك على المهام', requiredLevel: 3, category: 'mind', unlocked: false, level: 0 },
  { id: 'a2', name: 'قدرة التركيز', description: 'تقلل التشتت الذهني', requiredLevel: 5, category: 'mind', unlocked: false, level: 0 },
  { id: 'a3', name: 'قدرة التغلب', description: 'تساعدك على هزيمة الزعماء', requiredLevel: 4, category: 'strength', unlocked: false, level: 0 },
  { id: 'a4', name: 'قدرة ضبط النفس', description: 'تزيد مقاومتك للإغراءات', requiredLevel: 6, category: 'spirit', unlocked: false, level: 0 },
  { id: 'a5', name: 'قدرة الحفظ', description: 'تسهل حفظ القرآن', requiredLevel: 5, category: 'quran', unlocked: false, level: 0 },
  { id: 'a6', name: 'قدرة الصبر', description: 'تزيد من تحملك', requiredLevel: 7, category: 'spirit', unlocked: false, level: 0 },
];

const getInitialAchievements = (): Achievement[] => [
  { id: 'ach1', name: 'البداية القوية', description: 'أكمل أول مهمة', requirement: 1, progress: 0, unlocked: false, icon: '🎯' },
  { id: 'ach2', name: '7 أيام التزام', description: 'التزم لمدة أسبوع', requirement: 7, progress: 0, unlocked: false, icon: '🔥' },
  { id: 'ach3', name: '30 يوم قوة', description: 'التزم لمدة شهر', requirement: 30, progress: 0, unlocked: false, icon: '💪' },
  { id: 'ach4', name: 'قاهر الزعيم', description: 'اهزم أول زعيم', requirement: 1, progress: 0, unlocked: false, icon: '⚔️' },
  { id: 'ach5', name: 'المنجز', description: 'أكمل 100 مهمة', requirement: 100, progress: 0, unlocked: false, icon: '🏆' },
  { id: 'ach6', name: 'الهدف الكبير', description: 'أتم Grand Quest', requirement: 1, progress: 0, unlocked: false, icon: '👑' },
];

const getInitialBoss = (): Boss => ({
  id: 'boss1',
  name: 'زعيم الكسل',
  description: 'عادة التكاسل عن الواجبات والمهام',
  maxHp: 100,
  currentHp: 100,
  requiredQuests: ['s2', 's3', 'm1', 'sp1'],
  defeated: false,
  weekStartDate: new Date().toISOString().split('T')[0],
});

const getDefaultState = (): GameState => ({
  playerName: 'المحارب',
  stats: { strength: 0, mind: 0, spirit: 0, quran: 0 },
  levels: { strength: 1, mind: 1, spirit: 1, quran: 1 },
  quests: getInitialQuests(),
  currentBoss: getInitialBoss(),
  abilities: getInitialAbilities(),
  achievements: getInitialAchievements(),
  grandQuest: null,
  dailyStats: [],
  totalQuestsCompleted: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('levelUpLife');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if we need to reset daily quests
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastActiveDate !== today) {
        parsed.quests = parsed.quests.map((q: Quest) => 
          q.dailyReset ? { ...q, completed: false } : q
        );
        parsed.lastActiveDate = today;
        
        // Update streak
        const lastDate = new Date(parsed.lastActiveDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          parsed.streakDays += 1;
        } else if (diffDays > 1) {
          parsed.streakDays = 0;
        }
      }
      return parsed;
    }
    return getDefaultState();
  });

  useEffect(() => {
    localStorage.setItem('levelUpLife', JSON.stringify(gameState));
  }, [gameState]);

  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
  };

  const getXpProgress = (xp: number): number => {
    return (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
  };

  const completeQuest = useCallback((questId: string) => {
    setGameState(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest || quest.completed) return prev;

      const newStats = { ...prev.stats };
      newStats[quest.category] += quest.xpReward;

      const newLevels = { ...prev.levels };
      newLevels[quest.category] = calculateLevel(newStats[quest.category]);

      const newQuests = prev.quests.map(q =>
        q.id === questId ? { ...q, completed: true } : q
      );

      // Update boss HP if quest is required
      let newBoss = prev.currentBoss;
      if (newBoss && newBoss.requiredQuests.includes(questId)) {
        const damage = Math.floor(newBoss.maxHp / newBoss.requiredQuests.length);
        newBoss = {
          ...newBoss,
          currentHp: Math.max(0, newBoss.currentHp - damage),
          defeated: newBoss.currentHp - damage <= 0,
        };
      }

      // Update abilities
      const newAbilities = prev.abilities.map(ability => {
        if (!ability.unlocked && newLevels[ability.category] >= ability.requiredLevel) {
          return { ...ability, unlocked: true, level: 1 };
        }
        return ability;
      });

      // Update achievements
      const newAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach1' && !ach.unlocked) {
          return { ...ach, progress: 1, unlocked: true };
        }
        if (ach.id === 'ach5') {
          const newProgress = prev.totalQuestsCompleted + 1;
          return { 
            ...ach, 
            progress: newProgress, 
            unlocked: newProgress >= ach.requirement 
          };
        }
        return ach;
      });

      // Update daily stats
      const today = new Date().toISOString().split('T')[0];
      const todayStatIndex = prev.dailyStats.findIndex(s => s.date === today);
      let newDailyStats = [...prev.dailyStats];
      
      if (todayStatIndex >= 0) {
        newDailyStats[todayStatIndex] = {
          ...newDailyStats[todayStatIndex],
          [quest.category]: newDailyStats[todayStatIndex][quest.category] + quest.xpReward,
          questsCompleted: newDailyStats[todayStatIndex].questsCompleted + 1,
        };
      } else {
        newDailyStats.push({
          date: today,
          strength: quest.category === 'strength' ? quest.xpReward : 0,
          mind: quest.category === 'mind' ? quest.xpReward : 0,
          spirit: quest.category === 'spirit' ? quest.xpReward : 0,
          quran: quest.category === 'quran' ? quest.xpReward : 0,
          questsCompleted: 1,
        });
      }

      return {
        ...prev,
        stats: newStats,
        levels: newLevels,
        quests: newQuests,
        currentBoss: newBoss,
        abilities: newAbilities,
        achievements: newAchievements,
        dailyStats: newDailyStats.slice(-30), // Keep last 30 days
        totalQuestsCompleted: prev.totalQuestsCompleted + 1,
      };
    });
  }, []);

  const startGrandQuest = useCallback((category: StatType, title: string, tasks: string[]) => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    const grandQuest: GrandQuest = {
      id: `gq_${Date.now()}`,
      title,
      description: `تحدي 30 يوم في ${category}`,
      category,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      dailyTasks: tasks,
      completedDays: 0,
      active: true,
    };

    setGameState(prev => ({ ...prev, grandQuest }));
  }, []);

  const completeGrandQuestDay = useCallback(() => {
    setGameState(prev => {
      if (!prev.grandQuest) return prev;
      
      const newCompletedDays = prev.grandQuest.completedDays + 1;
      const isCompleted = newCompletedDays >= 30;

      const newAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach6' && isCompleted && !ach.unlocked) {
          return { ...ach, progress: 1, unlocked: true };
        }
        return ach;
      });

      return {
        ...prev,
        grandQuest: {
          ...prev.grandQuest,
          completedDays: newCompletedDays,
          active: !isCompleted,
        },
        achievements: newAchievements,
      };
    });
  }, []);

  const resetBoss = useCallback(() => {
    const bosses: Boss[] = [
      { id: 'boss1', name: 'زعيم الكسل', description: 'عادة التكاسل', maxHp: 100, currentHp: 100, requiredQuests: ['s2', 's3', 'm1', 'sp1'], defeated: false, weekStartDate: new Date().toISOString().split('T')[0] },
      { id: 'boss2', name: 'زعيم السهر', description: 'عادة السهر المتأخر', maxHp: 120, currentHp: 120, requiredQuests: ['s4', 'm3', 'sp2'], defeated: false, weekStartDate: new Date().toISOString().split('T')[0] },
      { id: 'boss3', name: 'زعيم التسويف', description: 'عادة تأجيل المهام', maxHp: 150, currentHp: 150, requiredQuests: ['m1', 'm2', 'm4', 'sp1'], defeated: false, weekStartDate: new Date().toISOString().split('T')[0] },
    ];
    
    const randomBoss = bosses[Math.floor(Math.random() * bosses.length)];
    setGameState(prev => ({ ...prev, currentBoss: randomBoss }));
  }, []);

  const updatePlayerName = useCallback((name: string) => {
    setGameState(prev => ({ ...prev, playerName: name }));
  }, []);

  const updateStreak = useCallback(() => {
    setGameState(prev => {
      const newAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach2') {
          return { 
            ...ach, 
            progress: prev.streakDays, 
            unlocked: prev.streakDays >= 7 
          };
        }
        if (ach.id === 'ach3') {
          return { 
            ...ach, 
            progress: prev.streakDays, 
            unlocked: prev.streakDays >= 30 
          };
        }
        return ach;
      });

      return { ...prev, achievements: newAchievements };
    });
  }, []);

  return {
    gameState,
    completeQuest,
    startGrandQuest,
    completeGrandQuestDay,
    resetBoss,
    updatePlayerName,
    updateStreak,
    getXpProgress,
    calculateLevel,
  };
};
