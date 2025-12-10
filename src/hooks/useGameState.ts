import { useState, useEffect, useCallback } from 'react';
import { GameState, Quest, Boss, StatType, Ability, Achievement, GrandQuest, InventoryItem, PrayerQuest, QuestDifficulty } from '@/types/game';

const XP_PER_LEVEL = 100;

const getInitialQuests = (): Quest[] => [
  // Strength quests
  { id: 's1', title: 'شرب 8 أكواب ماء', description: 'حافظ على ترطيب جسمك', category: 'strength', xpReward: 15, completed: false, dailyReset: true, difficulty: 'easy', timeLimit: 720 },
  { id: 's2', title: '10,000 خطوة', description: 'امشِ 10 آلاف خطوة اليوم', category: 'strength', xpReward: 25, completed: false, dailyReset: true, difficulty: 'medium', timeLimit: 720 },
  { id: 's3', title: 'تمارين رياضية', description: '30 دقيقة تمارين', category: 'strength', xpReward: 30, completed: false, dailyReset: true, difficulty: 'medium', timeLimit: 60 },
  { id: 's4', title: 'نوم صحي', description: 'نم 7-8 ساعات', category: 'strength', xpReward: 20, completed: false, dailyReset: true, difficulty: 'easy' },
  { id: 's5', title: '100 تمرين ضغط', description: 'أكمل 100 تمرين ضغط', category: 'strength', xpReward: 50, completed: false, dailyReset: true, difficulty: 'hard', timeLimit: 120 },
  { id: 's6', title: '100 تمرين قرفصاء', description: 'أكمل 100 تمرين قرفصاء', category: 'strength', xpReward: 50, completed: false, dailyReset: true, difficulty: 'hard', timeLimit: 120 },
  { id: 's7', title: 'صيام متقطع', description: 'صم 16 ساعة', category: 'strength', xpReward: 40, completed: false, dailyReset: true, difficulty: 'hard' },
  
  // Mind quests
  { id: 'm1', title: 'قراءة 30 دقيقة', description: 'اقرأ كتاباً مفيداً', category: 'mind', xpReward: 25, completed: false, dailyReset: true, difficulty: 'medium', timeLimit: 30 },
  { id: 'm2', title: 'تعلم شيء جديد', description: 'تعلم مهارة أو معلومة', category: 'mind', xpReward: 30, completed: false, dailyReset: true, difficulty: 'medium' },
  { id: 'm3', title: 'ترك السوشيال ميديا', description: 'لا تستخدم السوشيال اليوم', category: 'mind', xpReward: 40, completed: false, dailyReset: true, difficulty: 'hard' },
  { id: 'm4', title: 'كتابة هدف', description: 'اكتب هدفاً واضحاً', category: 'mind', xpReward: 15, completed: false, dailyReset: true, difficulty: 'easy', timeLimit: 15 },
  { id: 'm5', title: 'حفظ 10 كلمات إنجليزية', description: 'احفظ 10 كلمات جديدة', category: 'mind', xpReward: 35, completed: false, dailyReset: true, difficulty: 'medium' },
  { id: 'm6', title: 'حل مسألة رياضية', description: 'حل مسألة تحدي ذهني', category: 'mind', xpReward: 45, completed: false, dailyReset: true, difficulty: 'hard' },
  { id: 'm7', title: 'تأمل 15 دقيقة', description: 'تأمل وتركيز ذهني', category: 'mind', xpReward: 20, completed: false, dailyReset: true, difficulty: 'easy', timeLimit: 15 },
  
  // Spirit quests
  { id: 'sp1', title: 'أذكار الصباح والمساء', description: 'اقرأ الأذكار كاملة', category: 'spirit', xpReward: 25, completed: false, dailyReset: true, difficulty: 'medium' },
  { id: 'sp2', title: 'استغفار 100 مرة', description: 'استغفر الله 100 مرة', category: 'spirit', xpReward: 20, completed: false, dailyReset: true, difficulty: 'easy' },
  { id: 'sp3', title: 'صدقة', description: 'تصدق ولو بالقليل', category: 'spirit', xpReward: 30, completed: false, dailyReset: true, difficulty: 'medium' },
  { id: 'sp4', title: 'خلق حسن', description: 'ابتسم وأحسن للناس', category: 'spirit', xpReward: 20, completed: false, dailyReset: true, difficulty: 'easy' },
  { id: 'sp5', title: 'صلة الرحم', description: 'تواصل مع أقاربك', category: 'spirit', xpReward: 35, completed: false, dailyReset: true, difficulty: 'medium' },
  { id: 'sp6', title: 'قيام الليل', description: 'صلِّ ركعتين في الليل', category: 'spirit', xpReward: 50, completed: false, dailyReset: true, difficulty: 'hard' },
  { id: 'sp7', title: 'الدعاء', description: 'ادعُ الله بصدق', category: 'spirit', xpReward: 15, completed: false, dailyReset: true, difficulty: 'easy' },
  
  // Quran quests
  { id: 'q1', title: 'ورد القرآن اليومي', description: 'اقرأ جزءاً أو حزباً', category: 'quran', xpReward: 40, completed: false, dailyReset: true, difficulty: 'medium' },
  { id: 'q2', title: 'حفظ آية', description: 'احفظ آية جديدة', category: 'quran', xpReward: 50, completed: false, dailyReset: true, difficulty: 'hard' },
  { id: 'q3', title: 'تفسير آية', description: 'اقرأ تفسير آية', category: 'quran', xpReward: 35, completed: false, dailyReset: true, difficulty: 'medium' },
  { id: 'q4', title: 'سورة الملك', description: 'اقرأ سورة الملك', category: 'quran', xpReward: 30, completed: false, dailyReset: true, difficulty: 'medium' },
];

const getInitialAbilities = (): Ability[] => [
  { id: 'a1', name: 'قدرة الانضباط', description: 'تزيد تركيزك على المهام', requiredLevel: 3, category: 'mind', unlocked: false, level: 0, cooldownDays: 7, effect: 'مضاعفة XP للمهمة القادمة' },
  { id: 'a2', name: 'قدرة التركيز', description: 'تقلل التشتت الذهني', requiredLevel: 5, category: 'mind', unlocked: false, level: 0, cooldownDays: 7, effect: 'إكمال مهمة تلقائياً' },
  { id: 'a3', name: 'قدرة التغلب', description: 'تساعدك على هزيمة الزعماء', requiredLevel: 4, category: 'strength', unlocked: false, level: 0, cooldownDays: 7, effect: 'ضرر مضاعف للزعيم' },
  { id: 'a4', name: 'قدرة ضبط النفس', description: 'تزيد مقاومتك للإغراءات', requiredLevel: 6, category: 'spirit', unlocked: false, level: 0, cooldownDays: 7, effect: 'حماية من خسارة HP' },
  { id: 'a5', name: 'قدرة الحفظ', description: 'تسهل حفظ القرآن', requiredLevel: 5, category: 'quran', unlocked: false, level: 0, cooldownDays: 7, effect: 'مضاعفة XP القرآن' },
  { id: 'a6', name: 'قدرة الصبر', description: 'تزيد من تحملك', requiredLevel: 7, category: 'spirit', unlocked: false, level: 0, cooldownDays: 7, effect: 'تمديد وقت المهمات' },
  { id: 'a7', name: 'تلاوة القرآن', description: 'استمع للقرآن الكريم', requiredLevel: 2, category: 'quran', unlocked: false, level: 0, cooldownDays: 0, effect: 'استماع للقرآن' },
  { id: 'a8', name: 'قدرة القوة', description: 'تزيد قوتك الجسدية', requiredLevel: 8, category: 'strength', unlocked: false, level: 0, cooldownDays: 7, effect: 'استعادة 50% طاقة' },
];

const getInitialAchievements = (): Achievement[] => [
  { id: 'ach1', name: 'البداية القوية', description: 'أكمل أول مهمة', requirement: 1, progress: 0, unlocked: false, icon: '🎯' },
  { id: 'ach2', name: '7 أيام التزام', description: 'التزم لمدة أسبوع', requirement: 7, progress: 0, unlocked: false, icon: '🔥' },
  { id: 'ach3', name: '30 يوم قوة', description: 'التزم لمدة شهر', requirement: 30, progress: 0, unlocked: false, icon: '💪' },
  { id: 'ach4', name: 'قاهر الزعيم', description: 'اهزم أول زعيم', requirement: 1, progress: 0, unlocked: false, icon: '⚔️' },
  { id: 'ach5', name: 'المنجز', description: 'أكمل 100 مهمة', requirement: 100, progress: 0, unlocked: false, icon: '🏆' },
  { id: 'ach6', name: 'الهدف الكبير', description: 'أتم Grand Quest', requirement: 1, progress: 0, unlocked: false, icon: '👑' },
  { id: 'ach7', name: 'المستوى 10', description: 'وصلت للمستوى 10', requirement: 10, progress: 0, unlocked: false, icon: '⭐' },
  { id: 'ach8', name: 'المستوى 50', description: 'وصلت للمستوى 50', requirement: 50, progress: 0, unlocked: false, icon: '💎' },
  { id: 'ach9', name: 'المستوى 100', description: 'وصلت للمستوى 100', requirement: 100, progress: 0, unlocked: false, icon: '🏅' },
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

const getInitialInventory = (): InventoryItem[] => [
  { id: 'health_potion', name: 'زجاجة الدم', description: 'تزيد الدم بنسبة 25%', type: 'health', effect: 25, price: 100, quantity: 0, icon: '❤️' },
  { id: 'xp_book', name: 'كتاب الخبرة', description: 'يزيد خبرة اللاعب 500 XP', type: 'xp', effect: 500, price: 250, quantity: 0, icon: '📚' },
  { id: 'energy_drink', name: 'مشروب الطاقة', description: 'يستعيد 50% من الطاقة', type: 'energy', effect: 50, price: 150, quantity: 0, icon: '⚡' },
];

const getInitialPrayerQuests = (): PrayerQuest[] => [
  { id: 'fajr', name: 'Fajr', arabicName: 'صلاة الفجر', time: '05:00', completed: false, xpReward: 50 },
  { id: 'dhuhr', name: 'Dhuhr', arabicName: 'صلاة الظهر', time: '12:30', completed: false, xpReward: 40 },
  { id: 'asr', name: 'Asr', arabicName: 'صلاة العصر', time: '15:30', completed: false, xpReward: 40 },
  { id: 'maghrib', name: 'Maghrib', arabicName: 'صلاة المغرب', time: '18:00', completed: false, xpReward: 40 },
  { id: 'isha', name: 'Isha', arabicName: 'صلاة العشاء', time: '19:30', completed: false, xpReward: 45 },
];

const getDefaultState = (): GameState => ({
  playerName: 'المحارب',
  playerTitle: 'محارب التطوير الذاتي',
  playerJob: 'غير معروف',
  isOnboarded: false,
  
  hp: 100,
  maxHp: 100,
  energy: 100,
  maxEnergy: 100,
  gold: 0,
  
  stats: { strength: 0, mind: 0, spirit: 0, quran: 0 },
  levels: { strength: 1, mind: 1, spirit: 1, quran: 1 },
  totalLevel: 4,
  
  quests: getInitialQuests(),
  currentBoss: getInitialBoss(),
  abilities: getInitialAbilities(),
  achievements: getInitialAchievements(),
  grandQuest: null,
  inventory: getInitialInventory(),
  prayerQuests: getInitialPrayerQuests(),
  
  dailyStats: [],
  totalQuestsCompleted: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  
  punishmentEndTime: null,
  missedQuestsCount: 0,
  
  selectedReciter: 'محمد اللحيدان',
  soundEnabled: true,
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('levelUpLife');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all new fields exist
      const defaultState = getDefaultState();
      const mergedState = { ...defaultState, ...parsed };
      
      // Check if we need to reset daily quests
      const today = new Date().toISOString().split('T')[0];
      if (mergedState.lastActiveDate !== today) {
        mergedState.quests = mergedState.quests.map((q: Quest) => 
          q.dailyReset ? { ...q, completed: false } : q
        );
        mergedState.prayerQuests = mergedState.prayerQuests?.map((p: PrayerQuest) => 
          ({ ...p, completed: false })
        ) || getInitialPrayerQuests();
        
        // Update streak
        const lastDate = new Date(mergedState.lastActiveDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          mergedState.streakDays += 1;
        } else if (diffDays > 1) {
          mergedState.streakDays = 0;
          // Apply punishment for missing days
          mergedState.hp = Math.max(0, mergedState.hp - (diffDays * 10));
        }
        
        mergedState.lastActiveDate = today;
      }
      
      return mergedState;
    }
    return getDefaultState();
  });

  const [levelUpInfo, setLevelUpInfo] = useState<{ show: boolean; newLevel: number; category?: StatType } | null>(null);

  useEffect(() => {
    localStorage.setItem('levelUpLife', JSON.stringify(gameState));
  }, [gameState]);

  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
  };

  const getXpProgress = (xp: number): number => {
    return (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
  };

  const getTotalLevel = (levels: typeof gameState.levels): number => {
    return levels.strength + levels.mind + levels.spirit + levels.quran;
  };

  const getRank = (totalLevel: number): string => {
    if (totalLevel >= 100) return 'S';
    if (totalLevel >= 50) return 'A';
    if (totalLevel >= 20) return 'B';
    if (totalLevel >= 10) return 'C';
    if (totalLevel >= 5) return 'D';
    return 'E';
  };

  const completeQuest = useCallback((questId: string) => {
    setGameState(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest || quest.completed) return prev;

      const newStats = { ...prev.stats };
      newStats[quest.category] += quest.xpReward;

      const newLevels = { ...prev.levels };
      const oldLevel = newLevels[quest.category];
      newLevels[quest.category] = calculateLevel(newStats[quest.category]);
      const newTotalLevel = getTotalLevel(newLevels);

      // Check for level up
      if (newLevels[quest.category] > oldLevel) {
        setLevelUpInfo({ show: true, newLevel: newLevels[quest.category], category: quest.category });
      }

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

      // Update abilities based on total level
      const newAbilities = prev.abilities.map(ability => {
        const categoryLevel = newLevels[ability.category];
        if (!ability.unlocked && categoryLevel >= ability.requiredLevel) {
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
          return { ...ach, progress: newProgress, unlocked: newProgress >= ach.requirement };
        }
        if (ach.id === 'ach7') {
          return { ...ach, progress: newTotalLevel, unlocked: newTotalLevel >= 10 };
        }
        if (ach.id === 'ach8') {
          return { ...ach, progress: newTotalLevel, unlocked: newTotalLevel >= 50 };
        }
        if (ach.id === 'ach9') {
          return { ...ach, progress: newTotalLevel, unlocked: newTotalLevel >= 100 };
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

      // Gain gold
      const goldGain = quest.difficulty === 'legendary' ? 50 : 
                       quest.difficulty === 'hard' ? 30 : 
                       quest.difficulty === 'medium' ? 15 : 10;

      return {
        ...prev,
        stats: newStats,
        levels: newLevels,
        totalLevel: newTotalLevel,
        quests: newQuests,
        currentBoss: newBoss,
        abilities: newAbilities,
        achievements: newAchievements,
        dailyStats: newDailyStats.slice(-30),
        totalQuestsCompleted: prev.totalQuestsCompleted + 1,
        gold: prev.gold + goldGain,
        energy: Math.max(0, prev.energy - 5),
      };
    });
  }, []);

  const completePrayerQuest = useCallback((prayerId: string) => {
    setGameState(prev => {
      const prayer = prev.prayerQuests.find(p => p.id === prayerId);
      if (!prayer || prayer.completed) return prev;

      const newPrayerQuests = prev.prayerQuests.map(p =>
        p.id === prayerId ? { ...p, completed: true } : p
      );

      const newStats = { ...prev.stats };
      newStats.spirit += prayer.xpReward;
      const newLevels = { ...prev.levels };
      const oldLevel = newLevels.spirit;
      newLevels.spirit = calculateLevel(newStats.spirit);

      if (newLevels.spirit > oldLevel) {
        setLevelUpInfo({ show: true, newLevel: newLevels.spirit, category: 'spirit' });
      }

      return {
        ...prev,
        prayerQuests: newPrayerQuests,
        stats: newStats,
        levels: newLevels,
        totalLevel: getTotalLevel(newLevels),
        gold: prev.gold + 25,
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
      { id: 'boss2', name: 'زعيم السهر', description: 'عادة السهر المتأخر', maxHp: 120, currentHp: 120, requiredQuests: ['s4', 'm3', 'sp1'], defeated: false, weekStartDate: new Date().toISOString().split('T')[0] },
      { id: 'boss3', name: 'زعيم التسويف', description: 'عادة تأجيل المهام', maxHp: 150, currentHp: 150, requiredQuests: ['m1', 'm2', 'm4', 'sp1'], defeated: false, weekStartDate: new Date().toISOString().split('T')[0] },
      { id: 'boss4', name: 'زعيم الإدمان الرقمي', description: 'الإفراط في استخدام الهاتف', maxHp: 180, currentHp: 180, requiredQuests: ['m3', 'm7', 'sp4', 'sp7'], defeated: false, weekStartDate: new Date().toISOString().split('T')[0] },
      { id: 'boss5', name: 'زعيم الغفلة', description: 'البعد عن ذكر الله', maxHp: 200, currentHp: 200, requiredQuests: ['sp1', 'sp2', 'q1', 'q4'], defeated: false, weekStartDate: new Date().toISOString().split('T')[0] },
    ];
    
    const randomBoss = bosses[Math.floor(Math.random() * bosses.length)];
    setGameState(prev => ({ ...prev, currentBoss: randomBoss }));
  }, []);

  const setCustomBoss = useCallback((name: string, description: string) => {
    setGameState(prev => {
      if (!prev.currentBoss) return prev;
      return {
        ...prev,
        currentBoss: {
          ...prev.currentBoss,
          customName: name,
          description,
        }
      };
    });
  }, []);

  const updatePlayerInfo = useCallback((name: string, title: string) => {
    setGameState(prev => ({ ...prev, playerName: name, playerTitle: title }));
  }, []);

  const setPlayerJob = useCallback((job: string) => {
    setGameState(prev => ({ ...prev, playerJob: job }));
  }, []);

  const completeOnboarding = useCallback((name: string) => {
    setGameState(prev => ({ ...prev, isOnboarded: true, playerName: name }));
  }, []);

  const useAbility = useCallback((abilityId: string) => {
    setGameState(prev => {
      const ability = prev.abilities.find(a => a.id === abilityId);
      if (!ability || !ability.unlocked) return prev;
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check cooldown
      if (ability.lastUsed && ability.cooldownDays > 0) {
        const lastUsed = new Date(ability.lastUsed);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < ability.cooldownDays) return prev;
      }

      const newAbilities = prev.abilities.map(a =>
        a.id === abilityId ? { ...a, lastUsed: today, level: a.level + 0.1 } : a
      );

      return { ...prev, abilities: newAbilities };
    });
  }, []);

  const purchaseItem = useCallback((itemId: string) => {
    setGameState(prev => {
      const item = prev.inventory.find(i => i.id === itemId);
      if (!item || prev.gold < item.price) return prev;

      const newInventory = prev.inventory.map(i =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      );

      return {
        ...prev,
        inventory: newInventory,
        gold: prev.gold - item.price,
      };
    });
  }, []);

  const useItem = useCallback((itemId: string) => {
    setGameState(prev => {
      const item = prev.inventory.find(i => i.id === itemId);
      if (!item || item.quantity <= 0) return prev;

      let updates: Partial<GameState> = {};

      if (item.type === 'health') {
        updates.hp = Math.min(prev.maxHp, prev.hp + (prev.maxHp * item.effect / 100));
      } else if (item.type === 'energy') {
        updates.energy = Math.min(prev.maxEnergy, prev.energy + (prev.maxEnergy * item.effect / 100));
      } else if (item.type === 'xp') {
        // Add XP evenly across all stats
        const xpPerStat = Math.floor(item.effect / 4);
        updates.stats = {
          strength: prev.stats.strength + xpPerStat,
          mind: prev.stats.mind + xpPerStat,
          spirit: prev.stats.spirit + xpPerStat,
          quran: prev.stats.quran + xpPerStat,
        };
      }

      const newInventory = prev.inventory.map(i =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );

      return { ...prev, ...updates, inventory: newInventory };
    });
  }, []);

  const takeDamage = useCallback((damage: number) => {
    setGameState(prev => ({
      ...prev,
      hp: Math.max(0, prev.hp - damage),
    }));
  }, []);

  const applyPunishment = useCallback(() => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 4);
    
    setGameState(prev => ({
      ...prev,
      punishmentEndTime: endTime.toISOString(),
      hp: Math.max(0, prev.hp - 30),
    }));
  }, []);

  const clearPunishment = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      punishmentEndTime: null,
      missedQuestsCount: 0,
    }));
  }, []);

  const setSelectedReciter = useCallback((reciter: string) => {
    setGameState(prev => ({ ...prev, selectedReciter: reciter }));
  }, []);

  const toggleSound = useCallback(() => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem('levelUpLife');
    setGameState(getDefaultState());
  }, []);

  const dismissLevelUp = useCallback(() => {
    setLevelUpInfo(null);
  }, []);

  return {
    gameState,
    levelUpInfo,
    completeQuest,
    completePrayerQuest,
    startGrandQuest,
    completeGrandQuestDay,
    resetBoss,
    setCustomBoss,
    updatePlayerInfo,
    setPlayerJob,
    completeOnboarding,
    useAbility,
    purchaseItem,
    useItem,
    takeDamage,
    applyPunishment,
    clearPunishment,
    setSelectedReciter,
    toggleSound,
    resetGame,
    dismissLevelUp,
    getXpProgress,
    calculateLevel,
    getTotalLevel,
    getRank,
  };
};
