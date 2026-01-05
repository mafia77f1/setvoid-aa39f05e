import { useState, useEffect, useCallback } from 'react';
import { GameState, Quest, Boss, StatType, Ability, Achievement, GrandQuest, InventoryItem, PrayerQuest, ShadowSoldier, Equipment, Gate } from '@/types/game';

const MAX_LEVEL = 50; // الحد الأقصى للمستوى في نسخة Alpha
const BASE_XP_PER_LEVEL = 100;

// Get day of week: 0=Sunday, 1=Monday... 6=Saturday
const getDayOfWeek = () => new Date().getDay();

// Daily rotating quests based on day of week - with requiredTime for time-based progress
const getRotatingQuests = (): Quest[] => {
  const day = getDayOfWeek();
  
  // STR - rotating muscle groups with requiredTime
  const strQuests: Record<number, Quest> = {
    0: { id: 'str_daily', title: 'تمرين صدر', description: '100 ضغط على 5 مجاميع', category: 'strength', xpReward: 50, completed: false, dailyReset: true, difficulty: 'hard', sets: 5, repsPerSet: 20, dayOfWeek: 0, requiredTime: 25, isMainQuest: true },
    1: { id: 'str_daily', title: 'تمرين كتف', description: '60 تمرين كتف على 5 مجاميع', category: 'strength', xpReward: 45, completed: false, dailyReset: true, difficulty: 'medium', sets: 5, repsPerSet: 12, dayOfWeek: 1, requiredTime: 20, isMainQuest: true },
    2: { id: 'str_daily', title: 'تمرين تراي', description: '60 تمرين تراي على 5 مجاميع', category: 'strength', xpReward: 45, completed: false, dailyReset: true, difficulty: 'medium', sets: 5, repsPerSet: 12, dayOfWeek: 2, requiredTime: 20, isMainQuest: true },
    3: { id: 'str_daily', title: 'تمرين باي', description: '60 تمرين باي على 5 مجاميع', category: 'strength', xpReward: 45, completed: false, dailyReset: true, difficulty: 'medium', sets: 5, repsPerSet: 12, dayOfWeek: 3, requiredTime: 20, isMainQuest: true },
    4: { id: 'str_daily', title: 'تمرين ظهر', description: '60 تمرين ظهر على 5 مجاميع', category: 'strength', xpReward: 50, completed: false, dailyReset: true, difficulty: 'hard', sets: 5, repsPerSet: 12, dayOfWeek: 4, requiredTime: 25, isMainQuest: true },
    5: { id: 'str_daily', title: 'تمرين بطن', description: '100 تمرين بطن على 5 مجاميع', category: 'strength', xpReward: 45, completed: false, dailyReset: true, difficulty: 'medium', sets: 5, repsPerSet: 20, dayOfWeek: 5, requiredTime: 20, isMainQuest: true },
    6: { id: 'str_daily', title: 'تمرين رجل', description: '100 سكوات على 5 مجاميع', category: 'strength', xpReward: 50, completed: false, dailyReset: true, difficulty: 'hard', sets: 5, repsPerSet: 20, dayOfWeek: 6, requiredTime: 25, isMainQuest: true },
  };

  // INT - rotating mental quests with requiredTime
  const intQuests: Record<number, Quest> = {
    0: { id: 'int_daily', title: 'مراجعة أسبوع', description: 'راجع ما تعلمته هذا الأسبوع', category: 'mind', xpReward: 35, completed: false, dailyReset: true, difficulty: 'medium', dayOfWeek: 0, requiredTime: 15, isMainQuest: true },
    1: { id: 'int_daily', title: 'لغز منطقي', description: 'حل لغز لتحسين المنطق', category: 'mind', xpReward: 40, completed: false, dailyReset: true, difficulty: 'hard', dayOfWeek: 1, requiredTime: 20, isMainQuest: true },
    2: { id: 'int_daily', title: 'قراءة + تلخيص', description: '25 دقيقة قراءة مع تلخيص', category: 'mind', xpReward: 45, completed: false, dailyReset: true, difficulty: 'hard', timeLimit: 25, dayOfWeek: 2, requiredTime: 25, isMainQuest: true },
    3: { id: 'int_daily', title: 'ألعاب الذاكرة', description: 'تمارين لرفع قوة الذاكرة', category: 'mind', xpReward: 35, completed: false, dailyReset: true, difficulty: 'medium', dayOfWeek: 3, requiredTime: 15, isMainQuest: true },
    4: { id: 'int_daily', title: 'كلمة جديدة', description: 'تعلم كلمة جديدة وحفظها', category: 'mind', xpReward: 30, completed: false, dailyReset: true, difficulty: 'easy', dayOfWeek: 4, requiredTime: 10, isMainQuest: true },
    5: { id: 'int_daily', title: 'تمرين اليد غير المسيطرة', description: 'استخدم يدك الأخرى لتحفيز الدماغ', category: 'mind', xpReward: 40, completed: false, dailyReset: true, difficulty: 'hard', dayOfWeek: 5, requiredTime: 20, isMainQuest: true },
    6: { id: 'int_daily', title: 'تأمل + مراجعة', description: '15 دقيقة تأمل وتركيز', category: 'mind', xpReward: 35, completed: false, dailyReset: true, difficulty: 'medium', timeLimit: 15, dayOfWeek: 6, requiredTime: 15, isMainQuest: true },
  };

  // SPR - rotating spiritual quests with requiredTime
  const sprQuests: Record<number, Quest> = {
    0: { id: 'spr_daily', title: 'تسبيح 2000 مرة', description: '1000 سبحان الله + 1000 الحمد لله', category: 'spirit', xpReward: 60, completed: false, dailyReset: true, difficulty: 'legendary', dayOfWeek: 0, requiredTime: 30, isMainQuest: true },
    1: { id: 'spr_daily', title: 'صيام الاثنين', description: 'صم يوم الاثنين أو سبح 25 مرة', category: 'spirit', xpReward: 70, completed: false, dailyReset: true, difficulty: 'legendary', dayOfWeek: 1, requiredTime: 60, isMainQuest: true },
    2: { id: 'spr_daily', title: 'شكر 5 نعم', description: 'اكتب أو تفكر في 5 نعم', category: 'spirit', xpReward: 30, completed: false, dailyReset: true, difficulty: 'easy', dayOfWeek: 2, requiredTime: 10, isMainQuest: true },
    3: { id: 'spr_daily', title: 'ترك ذنب واحد', description: 'امتنع عن ذنب واحد اليوم', category: 'spirit', xpReward: 50, completed: false, dailyReset: true, difficulty: 'hard', dayOfWeek: 3, requiredTime: 30, isMainQuest: true },
    4: { id: 'spr_daily', title: 'صيام الخميس', description: 'صم أو اقرأ صفحة قرآن بتدبر', category: 'spirit', xpReward: 70, completed: false, dailyReset: true, difficulty: 'legendary', dayOfWeek: 4, requiredTime: 60, isMainQuest: true },
    5: { id: 'spr_daily', title: 'صلاة الجمعة', description: 'صلاة الجمعة + 100 صلاة على النبي', category: 'spirit', xpReward: 80, completed: false, dailyReset: true, difficulty: 'legendary', dayOfWeek: 5, requiredTime: 45, isMainQuest: true },
    6: { id: 'spr_daily', title: 'ذكر 1000 مرة', description: 'سبحان الله وبحمده 1000 مرة', category: 'spirit', xpReward: 55, completed: false, dailyReset: true, difficulty: 'hard', dayOfWeek: 6, requiredTime: 25, isMainQuest: true },
  };

  // AGI - rotating agility quests with requiredTime
  const agiQuests: Record<number, Quest[]> = {
    0: [
      { id: 'agi_run', title: 'الركض 20 دقيقة', description: 'اركض لمدة 20 دقيقة متواصلة', category: 'agility', xpReward: 50, completed: false, dailyReset: true, difficulty: 'hard', timeLimit: 20, dayOfWeek: 0, requiredTime: 20, isMainQuest: true },
    ],
    1: [
      { id: 'agi_run', title: 'الركض 15 دقيقة', description: 'اركض لمدة 15 دقيقة متواصلة', category: 'agility', xpReward: 40, completed: false, dailyReset: true, difficulty: 'medium', timeLimit: 15, dayOfWeek: 1, requiredTime: 15, isMainQuest: true },
    ],
    2: [
      { id: 'agi_sprint', title: 'سباق السرعة', description: '10 جولات سباق 100 متر', category: 'agility', xpReward: 55, completed: false, dailyReset: true, difficulty: 'hard', sets: 10, dayOfWeek: 2, requiredTime: 25, isMainQuest: true },
    ],
    3: [
      { id: 'agi_jump', title: 'القفز 300 مرة', description: '6 مجاميع × 50 قفزة', category: 'agility', xpReward: 50, completed: false, dailyReset: true, difficulty: 'hard', sets: 6, repsPerSet: 50, dayOfWeek: 3, requiredTime: 20, isMainQuest: true },
    ],
    4: [
      { id: 'agi_run', title: 'الركض 25 دقيقة', description: 'اركض لمدة 25 دقيقة', category: 'agility', xpReward: 55, completed: false, dailyReset: true, difficulty: 'hard', timeLimit: 25, dayOfWeek: 4, requiredTime: 25, isMainQuest: true },
    ],
    5: [
      { id: 'agi_hiit', title: 'تمرين HIIT', description: '20 دقيقة تمرين عالي الكثافة', category: 'agility', xpReward: 65, completed: false, dailyReset: true, difficulty: 'legendary', timeLimit: 20, dayOfWeek: 5, requiredTime: 20, isMainQuest: true },
    ],
    6: [
      { id: 'agi_walk', title: 'المشي السريع', description: '30 دقيقة مشي سريع', category: 'agility', xpReward: 35, completed: false, dailyReset: true, difficulty: 'easy', timeLimit: 30, dayOfWeek: 6, requiredTime: 30, isMainQuest: true },
    ],
  };

  // Main quests (one per category)
  const mainQuests = [
    strQuests[day],
    intQuests[day],
    sprQuests[day],
    agiQuests[day][0],
  ];

  return mainQuests;
};

// Side quests - different from main quests, with time-based completion
const getSideQuests = (): Quest[] => {
  const day = getDayOfWeek();
  
  const sideQuests: Quest[] = [
    { id: 'side_read', title: 'قراءة 30 دقيقة', description: 'اقرأ كتاباً لمدة 30 دقيقة متواصلة', category: 'mind', xpReward: 40, completed: false, dailyReset: true, difficulty: 'medium', isMainQuest: false, requiredTime: 30, goldReward: 20 },
    { id: 'side_walk', title: 'المشي 20 دقيقة', description: 'امش لمدة 20 دقيقة', category: 'agility', xpReward: 30, completed: false, dailyReset: true, difficulty: 'easy', isMainQuest: false, requiredTime: 20, goldReward: 15 },
    { id: 'side_meditate', title: 'التأمل 15 دقيقة', description: 'تأمل واسترخ لمدة 15 دقيقة', category: 'spirit', xpReward: 35, completed: false, dailyReset: true, difficulty: 'medium', isMainQuest: false, requiredTime: 15, goldReward: 20 },
    { id: 'side_stretch', title: 'تمارين إطالة', description: 'قم بتمارين إطالة لمدة 10 دقائق', category: 'strength', xpReward: 25, completed: false, dailyReset: true, difficulty: 'easy', isMainQuest: false, requiredTime: 10, goldReward: 10 },
    { id: 'side_water', title: 'شرب 8 أكواب ماء', description: 'اشرب 8 أكواب ماء على مدار اليوم', category: 'spirit', xpReward: 20, completed: false, dailyReset: true, difficulty: 'easy', isMainQuest: false, requiredTime: 60, goldReward: 15 },
  ];

  // Rotate side quests based on day
  const startIndex = day % sideQuests.length;
  return [
    sideQuests[startIndex],
    sideQuests[(startIndex + 1) % sideQuests.length],
    sideQuests[(startIndex + 2) % sideQuests.length],
  ];
};

const getInitialAbilities = (): Ability[] => [
  { id: 'a1', name: 'قدرة الانضباط', description: 'تزيد تركيزك على المهام', requiredLevel: 3, category: 'mind', unlocked: false, level: 1, cooldownDays: 7, effect: 'مضاعفة XP للمهمة القادمة' },
  { id: 'a2', name: 'قدرة التركيز', description: 'تقلل التشتت الذهني', requiredLevel: 5, category: 'mind', unlocked: false, level: 1, cooldownDays: 7, effect: 'إكمال مهمة تلقائياً' },
  { id: 'a3', name: 'قدرة التغلب', description: 'تساعدك على هزيمة الزعماء', requiredLevel: 4, category: 'strength', unlocked: false, level: 1, cooldownDays: 7, effect: 'ضرر مضاعف للزعيم' },
  { id: 'a4', name: 'قدرة ضبط النفس', description: 'تزيد مقاومتك للإغراءات', requiredLevel: 6, category: 'spirit', unlocked: false, level: 1, cooldownDays: 7, effect: 'حماية من خسارة HP' },
  { id: 'a5', name: 'قدرة السرعة', description: 'تزيد رشاقتك وسرعتك', requiredLevel: 5, category: 'agility', unlocked: false, level: 1, cooldownDays: 7, effect: 'مضاعفة XP الرشاقة' },
  { id: 'a6', name: 'قدرة الصبر', description: 'تزيد من تحملك', requiredLevel: 7, category: 'spirit', unlocked: false, level: 1, cooldownDays: 7, effect: 'تمديد وقت المهمات' },
  { id: 'a7', name: 'كشف البوابات', description: 'تكشف البوابات المخفية', requiredLevel: 2, category: 'agility', unlocked: false, level: 1, cooldownDays: 0, effect: 'كشف بوابة إضافية' },
  { id: 'a8', name: 'قدرة القوة', description: 'تزيد قوتك الجسدية', requiredLevel: 8, category: 'strength', unlocked: false, level: 1, cooldownDays: 7, effect: 'استعادة 50% طاقة' },
];

const getInitialAchievements = (): Achievement[] => [
  { id: 'ach1', name: 'البداية القوية', description: 'أكمل أول مهمة', requirement: 1, progress: 0, unlocked: false, icon: '🎯', rarity: 'common' },
  { id: 'ach2', name: '7 أيام التزام', description: 'التزم لمدة أسبوع', requirement: 7, progress: 0, unlocked: false, icon: '🔥', rarity: 'rare' },
  { id: 'ach3', name: '30 يوم قوة', description: 'التزم لمدة شهر', requirement: 30, progress: 0, unlocked: false, icon: '💪', rarity: 'epic' },
  { id: 'ach4', name: 'قاهر البوابة', description: 'أكمل أول بوابة', requirement: 1, progress: 0, unlocked: false, icon: '⚔️', rarity: 'rare' },
  { id: 'ach5', name: 'المنجز', description: 'أكمل 100 مهمة', requirement: 100, progress: 0, unlocked: false, icon: '🏆', rarity: 'epic' },
  { id: 'ach6', name: 'الهدف الكبير', description: 'أتم Grand Quest', requirement: 1, progress: 0, unlocked: false, icon: '👑', rarity: 'legendary' },
  { id: 'ach7', name: 'المستوى 10', description: 'وصلت للمستوى 10', requirement: 10, progress: 0, unlocked: false, icon: '⭐', rarity: 'common' },
  { id: 'ach8', name: 'المستوى 50', description: 'وصلت للمستوى 50', requirement: 50, progress: 0, unlocked: false, icon: '💎', rarity: 'epic' },
  { id: 'ach9', name: 'المستوى 100', description: 'وصلت للمستوى 100', requirement: 100, progress: 0, unlocked: false, icon: '🏅', rarity: 'legendary' },
];

const getInitialGates = (): Gate[] => [
  { id: 'gate_e', name: 'بوابة E', rank: 'E', requiredPower: 5, energyDensity: '1,200', danger: 'MINIMAL THREAT', color: 'gray', discovered: true, completed: false, rewards: { xp: 100, gold: 50, shadowPoints: 2 } },
  { id: 'gate_d', name: 'بوابة D', rank: 'D', requiredPower: 10, energyDensity: '5,400', danger: 'LOW THREAT', color: 'green', discovered: false, completed: false, rewards: { xp: 250, gold: 150, shadowPoints: 5 } },
  { id: 'gate_c', name: 'بوابة C', rank: 'C', requiredPower: 20, energyDensity: '12,000', danger: 'MODERATE DANGER', color: 'blue', discovered: false, completed: false, rewards: { xp: 500, gold: 300, shadowPoints: 10 } },
  { id: 'gate_b', name: 'بوابة B', rank: 'B', requiredPower: 35, energyDensity: '28,000', danger: 'HIGH DANGER', color: 'purple', discovered: false, completed: false, rewards: { xp: 1000, gold: 600, shadowPoints: 20 } },
  { id: 'gate_a', name: 'بوابة A', rank: 'A', requiredPower: 60, energyDensity: '65,000', danger: 'EXTREME PERIL', color: 'orange', discovered: false, completed: false, rewards: { xp: 2500, gold: 1500, shadowPoints: 50 } },
  { id: 'gate_s', name: 'بوابة S', rank: 'S', requiredPower: 100, energyDensity: 'UNMEASURABLE', danger: 'CATACLYSMIC', color: 'red', discovered: false, completed: false, rewards: { xp: 10000, gold: 5000, shadowPoints: 200 } },
];

const getInitialBoss = (): Boss => ({
  id: 'boss1',
  name: 'زعيم الكسل',
  description: 'هذا الزعيم يجعلك تتصفح الإنترنت بلا هدف لمدة 3 ساعات ويمنعك من القيام بمهامك!',
  maxHp: 100,
  currentHp: 100,
  requiredQuests: ['str_daily', 'int_daily', 'spr_daily', 'agi_run'],
  defeated: false,
  weekStartDate: new Date().toISOString().split('T')[0],
  level: 1,
  attackPower: 10,
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

const getInitialShadowSoldiers = (): ShadowSoldier[] => [
  { id: 'deris', name: 'Deris', arabicName: 'ديريس', type: 'mind', level: 1, power: 50, unlocked: false, cost: 10 },
  { id: 'balfo', name: 'Balfo', arabicName: 'بالفو', type: 'strength', level: 1, power: 60, unlocked: false, cost: 15 },
  { id: 'qaboos', name: 'Qaboos', arabicName: 'قابوس', type: 'spirit', level: 1, power: 55, unlocked: false, cost: 12 },
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
  shadowPoints: 0,
  
  stats: { strength: 0, mind: 0, spirit: 0, agility: 0 },
  levels: { strength: 1, mind: 1, spirit: 1, agility: 1 },
  totalLevel: 1, // يبدأ المستخدم بمستوى 1
  
  quests: [...getRotatingQuests(), ...getSideQuests()],
  currentBoss: getInitialBoss(),
  abilities: getInitialAbilities(),
  achievements: getInitialAchievements(),
  grandQuest: null,
  inventory: getInitialInventory(),
  prayerQuests: getInitialPrayerQuests(),
  shadowSoldiers: getInitialShadowSoldiers(),
  equipment: [],
  gates: getInitialGates(),
  
  dailyStats: [],
  totalQuestsCompleted: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  
  punishmentEndTime: null,
  missedQuestsCount: 0,
  punishment: {
    active: false,
    endTime: null,
    monstersDefeated: 0,
    currentWave: 1,
    playerHpInPenalty: 100,
    maxHpInPenalty: 100,
  },
  
  selectedReciter: 'محمد اللحيدان',
  soundEnabled: true,
  lastBossAttackTime: null,
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('levelUpLife');
    if (saved) {
      const parsed = JSON.parse(saved);
      const defaultState = getDefaultState();
      const mergedState = { ...defaultState, ...parsed };
      
      // Check if we need to reset daily quests
      const today = new Date().toISOString().split('T')[0];
      if (mergedState.lastActiveDate !== today) {
        // Get new rotating quests for today (main + side)
        mergedState.quests = [...getRotatingQuests(), ...getSideQuests()];
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
          mergedState.hp = Math.max(0, mergedState.hp - (diffDays * 10));
        }
        
        mergedState.lastActiveDate = today;
      }
      
      // Ensure gates exist
      if (!mergedState.gates) {
        mergedState.gates = getInitialGates();
      }
      
      return mergedState;
    }
    return getDefaultState();
  });

  const [levelUpInfo, setLevelUpInfo] = useState<{ show: boolean; newLevel: number; category?: StatType } | null>(null);

  useEffect(() => {
    localStorage.setItem('levelUpLife', JSON.stringify(gameState));
  }, [gameState]);

  // حساب XP المطلوب للمستوى التالي (يزداد بشكل كبير مع المستوى - صعب جداً 20-50)
  const getXpRequiredForLevel = (level: number): number => {
    if (level < 5) return BASE_XP_PER_LEVEL; // 100
    if (level < 10) return BASE_XP_PER_LEVEL * 1.5; // 150
    if (level < 15) return BASE_XP_PER_LEVEL * 2; // 200
    if (level < 20) return BASE_XP_PER_LEVEL * 3; // 300
    if (level < 30) return BASE_XP_PER_LEVEL * 5; // 500 - صعب
    if (level < 40) return BASE_XP_PER_LEVEL * 8; // 800 - صعب جداً
    return BASE_XP_PER_LEVEL * 12; // 1200 - صعب جداً جداً (40-50)
  };

  const calculateLevel = (xp: number): number => {
    let level = 1;
    let totalXpRequired = 0;
    
    while (level < MAX_LEVEL) {
      const xpForThisLevel = getXpRequiredForLevel(level);
      if (xp < totalXpRequired + xpForThisLevel) break;
      totalXpRequired += xpForThisLevel;
      level++;
    }
    
    return Math.min(level, MAX_LEVEL);
  };

  const getXpProgress = (xp: number): number => {
    let level = 1;
    let totalXpRequired = 0;
    
    while (level < MAX_LEVEL) {
      const xpForThisLevel = getXpRequiredForLevel(level);
      if (xp < totalXpRequired + xpForThisLevel) {
        const xpInCurrentLevel = xp - totalXpRequired;
        return (xpInCurrentLevel / xpForThisLevel) * 100;
      }
      totalXpRequired += xpForThisLevel;
      level++;
    }
    
    return 100; // Max level reached
  };

  // حساب المستوى الكلي - متوسط جميع المستويات الأربعة
  // كل قسم له حد أقصى 50، المجموع يكون متوسط (str + int + spr + agi) / 4 * (50/50) = المتوسط
  const getTotalLevel = (levels: typeof gameState.levels): number => {
    const sum = levels.strength + levels.mind + levels.spirit + levels.agility;
    // المتوسط: مجموع الأربعة / 4، الحد الأقصى 50
    const average = sum / 4;
    return Math.min(Math.floor(average), MAX_LEVEL);
  };

  // نظام الرتب: E, D, C, B, A (S مقفولة)
  const getRank = (totalLevel: number): string => {
    if (totalLevel >= 50) return 'A'; // S مقفولة في هذا الإصدار
    if (totalLevel >= 35) return 'B';
    if (totalLevel >= 20) return 'C';
    if (totalLevel >= 10) return 'D';
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
        setTimeout(() => {
          setLevelUpInfo({ show: true, newLevel: newLevels[quest.category], category: quest.category });
        }, 100);
      }

      const newQuests = prev.quests.map(q =>
        q.id === questId ? { ...q, completed: true } : q
      );

      // Update boss HP if quest is required
      let newBoss = prev.currentBoss;
      if (newBoss && newBoss.requiredQuests.includes(questId)) {
        const baseDamage = Math.floor(newBoss.maxHp / newBoss.requiredQuests.length);
        const levelBonus = Math.floor(newTotalLevel * 0.5);
        const totalDamage = baseDamage + levelBonus;
        newBoss = {
          ...newBoss,
          currentHp: Math.max(0, newBoss.currentHp - totalDamage),
          defeated: newBoss.currentHp - totalDamage <= 0,
        };
      }

      // Update abilities based on category level
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
          agility: quest.category === 'agility' ? quest.xpReward : 0,
          questsCompleted: 1,
        });
      }

      // Update gates discovery based on power level
      const newGates = prev.gates.map(gate => {
        if (!gate.discovered && newTotalLevel >= gate.requiredPower * 0.5) {
          return { ...gate, discovered: true };
        }
        return gate;
      });

      // Gain gold and shadow points
      const goldGain = quest.difficulty === 'legendary' ? 50 : 
                       quest.difficulty === 'hard' ? 30 : 
                       quest.difficulty === 'medium' ? 15 : 10;
      const shadowGain = quest.difficulty === 'legendary' ? 5 : 
                         quest.difficulty === 'hard' ? 3 : 
                         quest.difficulty === 'medium' ? 2 : 1;

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
        shadowPoints: (prev.shadowPoints || 0) + shadowGain,
        energy: Math.max(0, prev.energy - 5),
        gates: newGates,
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
        setTimeout(() => {
          setLevelUpInfo({ show: true, newLevel: newLevels.spirit, category: 'spirit' });
        }, 100);
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
      { id: 'boss1', name: 'زعيم الكسل', description: 'هذا الزعيم يجعلك تتصفح الإنترنت بلا هدف!', maxHp: 100, currentHp: 100, requiredQuests: ['str_daily', 'int_daily', 'spr_daily', 'agi_run'], defeated: false, weekStartDate: new Date().toISOString().split('T')[0], level: 1, attackPower: 10 },
      { id: 'boss2', name: 'زعيم السهر', description: 'يجبرك على السهر حتى الفجر بلا سبب!', maxHp: 120, currentHp: 120, requiredQuests: ['str_daily', 'int_daily', 'spr_daily'], defeated: false, weekStartDate: new Date().toISOString().split('T')[0], level: 2, attackPower: 15 },
      { id: 'boss3', name: 'زعيم التسويف', description: 'هل حقاً تظن أنك ستنهي هذا؟', maxHp: 150, currentHp: 150, requiredQuests: ['int_daily', 'spr_daily', 'agi_run', 'agi_jump'], defeated: false, weekStartDate: new Date().toISOString().split('T')[0], level: 3, attackPower: 20 },
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

  const summonShadowSoldier = useCallback((soldierId: string) => {
    setGameState(prev => {
      const soldier = prev.shadowSoldiers?.find(s => s.id === soldierId);
      if (!soldier || soldier.unlocked) return prev;
      if ((prev.shadowPoints || 0) < soldier.cost) return prev;

      const newSoldiers = prev.shadowSoldiers.map(s =>
        s.id === soldierId ? { ...s, unlocked: true } : s
      );

      return {
        ...prev,
        shadowSoldiers: newSoldiers,
        shadowPoints: (prev.shadowPoints || 0) - soldier.cost,
      };
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
        const xpPerStat = Math.floor(item.effect / 4);
        updates.stats = {
          strength: prev.stats.strength + xpPerStat,
          mind: prev.stats.mind + xpPerStat,
          spirit: prev.stats.spirit + xpPerStat,
          agility: prev.stats.agility + xpPerStat,
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

  // Start a side quest timer
  const startSideQuest = useCallback((questId: string) => {
    setGameState(prev => {
      const newQuests = prev.quests.map(q => {
        if (q.id === questId && !q.startedAt) {
          return { ...q, startedAt: new Date().toISOString(), timeProgress: 0 };
        }
        return q;
      });
      return { ...prev, quests: newQuests };
    });
  }, []);

  // Update time progress for side quests (called periodically)
  const updateSideQuestProgress = useCallback((questId: string, progress: number) => {
    setGameState(prev => {
      const newQuests = prev.quests.map(q => {
        if (q.id === questId) {
          return { ...q, timeProgress: progress };
        }
        return q;
      });
      return { ...prev, quests: newQuests };
    });
  }, []);

  // Claim completed side quest
  const claimSideQuest = useCallback((questId: string) => {
    setGameState(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest || quest.completed) return prev;

      const newStats = { ...prev.stats };
      newStats[quest.category] += quest.xpReward;

      const newLevels = { ...prev.levels };
      const oldLevel = newLevels[quest.category];
      newLevels[quest.category] = Math.min(calculateLevel(newStats[quest.category]), MAX_LEVEL);
      const newTotalLevel = Math.min(getTotalLevel(newLevels), MAX_LEVEL * 4);

      // Check for level up (only if not at max)
      if (newLevels[quest.category] > oldLevel && newLevels[quest.category] < MAX_LEVEL) {
        setTimeout(() => {
          setLevelUpInfo({ show: true, newLevel: newLevels[quest.category], category: quest.category });
        }, 100);
      }

      const newQuests = prev.quests.map(q =>
        q.id === questId ? { ...q, completed: true } : q
      );

      return {
        ...prev,
        stats: newStats,
        levels: newLevels,
        totalLevel: newTotalLevel,
        quests: newQuests,
        gold: prev.gold + (quest.goldReward || 10),
        totalQuestsCompleted: prev.totalQuestsCompleted + 1,
      };
    });
  }, []);

  // Close/dismiss side quest without claiming
  const closeSideQuest = useCallback((questId: string) => {
    setGameState(prev => {
      const newQuests = prev.quests.map(q => {
        if (q.id === questId) {
          return { ...q, startedAt: undefined, timeProgress: 0 };
        }
        return q;
      });
      return { ...prev, quests: newQuests };
    });
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
    summonShadowSoldier,
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
    startSideQuest,
    updateSideQuestProgress,
    claimSideQuest,
    closeSideQuest,
  };
};
