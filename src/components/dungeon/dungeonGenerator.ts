import { DungeonRoom, MonsterData, TreasureData, TrapData, StaminaTask, RoomType } from './DungeonTypes';

const GRID_SIZE = 8;

const MONSTERS_BY_RANK: Record<string, MonsterData[]> = {
  E: [
    { name: 'وحش الكسل', icon: '🐀', hp: 30, maxHp: 30, damage: 5, xpReward: 10, goldReward: 5, defeated: false, task: 'قم بـ 10 تمارين ضغط', taskDuration: 2 },
    { name: 'خفاش التشتت', icon: '🦇', hp: 25, maxHp: 25, damage: 3, xpReward: 8, goldReward: 3, defeated: false, task: 'اقرأ صفحة من كتاب', taskDuration: 3 },
  ],
  D: [
    { name: 'عنكبوت التسويف', icon: '🕷️', hp: 50, maxHp: 50, damage: 8, xpReward: 20, goldReward: 10, defeated: false, task: 'ادرس لمدة 15 دقيقة', taskDuration: 15 },
    { name: 'هيكل الإهمال', icon: '💀', hp: 60, maxHp: 60, damage: 10, xpReward: 25, goldReward: 12, defeated: false, task: 'رتب مكتبك أو غرفتك', taskDuration: 10 },
  ],
  C: [
    { name: 'غول الظلام', icon: '👹', hp: 100, maxHp: 100, damage: 15, xpReward: 40, goldReward: 20, defeated: false, task: 'أكمل 25 دقيقة دراسة مركزة', taskDuration: 25 },
    { name: 'فارس الخمول', icon: '⚔️', hp: 120, maxHp: 120, damage: 18, xpReward: 50, goldReward: 25, defeated: false, task: 'مارس الرياضة لمدة 20 دقيقة', taskDuration: 20 },
  ],
  B: [
    { name: 'تنين الإدمان', icon: '🐲', hp: 180, maxHp: 180, damage: 25, xpReward: 80, goldReward: 40, defeated: false, task: 'ابتعد عن الهاتف لمدة 30 دقيقة', taskDuration: 30 },
    { name: 'شيطان الشك', icon: '😈', hp: 160, maxHp: 160, damage: 22, xpReward: 70, goldReward: 35, defeated: false, task: 'اكتب 3 أشياء ممتنّ لها', taskDuration: 5 },
  ],
  A: [
    { name: 'حارس اليأس', icon: '🗿', hp: 300, maxHp: 300, damage: 35, xpReward: 150, goldReward: 80, defeated: false, task: 'أكمل مهمة كنت تؤجلها', taskDuration: 45 },
    { name: 'وحش الهاوية', icon: '👾', hp: 280, maxHp: 280, damage: 30, xpReward: 120, goldReward: 60, defeated: false, task: 'تمرن بجدية لمدة 30 دقيقة', taskDuration: 30 },
  ],
  S: [
    { name: 'لورد الظلام', icon: '🌑', hp: 500, maxHp: 500, damage: 50, xpReward: 300, goldReward: 150, defeated: false, task: 'أنجز تحدياً كبيراً اليوم', taskDuration: 60 },
  ],
};

const BOSS_BY_RANK: Record<string, MonsterData> = {
  E: { name: 'ملك الجرذان', icon: '👑🐀', hp: 100, maxHp: 100, damage: 12, xpReward: 50, goldReward: 30, defeated: false, task: 'أكمل 30 تمرين ضغط بدون توقف', taskDuration: 5 },
  D: { name: 'سيد العناكب', icon: '🕸️', hp: 200, maxHp: 200, damage: 20, xpReward: 100, goldReward: 50, defeated: false, task: 'ادرس لمدة 30 دقيقة متواصلة', taskDuration: 30 },
  C: { name: 'جنرال الظلام', icon: '⚔️👹', hp: 350, maxHp: 350, damage: 30, xpReward: 200, goldReward: 100, defeated: false, task: 'أكمل ساعة كاملة من العمل المركز', taskDuration: 60 },
  B: { name: 'إمبراطور النار', icon: '🔥👿', hp: 500, maxHp: 500, damage: 40, xpReward: 400, goldReward: 200, defeated: false, task: 'حقق 3 أهداف اليوم', taskDuration: 90 },
  A: { name: 'التنين القديم', icon: '🐉', hp: 800, maxHp: 800, damage: 55, xpReward: 600, goldReward: 300, defeated: false, task: 'أنجز تحدياً استثنائياً', taskDuration: 120 },
  S: { name: 'ملك الظلام المطلق', icon: '💀👑', hp: 1500, maxHp: 1500, damage: 80, xpReward: 1000, goldReward: 500, defeated: false, task: 'اهزم كل مخاوفك اليوم', taskDuration: 180 },
};

const TREASURES: TreasureData[] = [
  { name: 'صندوق ذهب', icon: '💰', type: 'gold', amount: 20, collected: false, task: 'اشرب كوب ماء' },
  { name: 'حجر القوة', icon: '💪', type: 'stat', amount: 2, statType: 'STR', collected: false, task: 'قم بـ 5 تمارين سكوات' },
  { name: 'كتاب الحكمة', icon: '📖', type: 'stat', amount: 2, statType: 'INT', collected: false, task: 'اقرأ آية واحدة بتدبر' },
  { name: 'ريشة السرعة', icon: '🪶', type: 'stat', amount: 2, statType: 'AGI', collected: false, task: 'قف وامشِ لدقيقة' },
  { name: 'جوهرة الروح', icon: '🔮', type: 'stat', amount: 2, statType: 'SPI', collected: false, task: 'استغفر الله 10 مرات' },
  { name: 'كنز نادر', icon: '👑', type: 'gold', amount: 50, collected: false, task: 'رتب شيئاً في غرفتك' },
];

const EMPTY_DESCRIPTIONS = [
  'الهواء بارد هنا... لا شيء سوى الصمت.',
  'غرفة مظلمة... أثر خطوات قديمة على الأرض.',
  'صدى أنفاسك يتردد في الظلام...',
  'جدران حجرية قديمة... رائحة رطوبة.',
  'ممر ضيق... ضوء خافت يتسرب من الشقوق.',
  'غرفة فارغة... لكن شيئاً ما يراقبك.',
  'بقايا معسكر قديم... من كان هنا؟',
  'نقوش غريبة على الجدران...',
];

const TRAP_DATA: TrapData[] = [
  { name: 'فخ أرضي', damage: 10, description: 'لقد وقعت في فخ! خسرت HP!' },
  { name: 'سهام مخفية', damage: 15, description: 'أُطلقت سهام من الجدار!' },
  { name: 'غاز سام', damage: 8, description: 'غاز سام يملأ الغرفة!' },
];

export const STAMINA_TASKS: StaminaTask[] = [
  { id: 'water', text: 'اشرب كوب ماء 💧', icon: '💧', staminaReward: 3, completed: false },
  { id: 'standup', text: 'قف لمدة دقيقة 🧍', icon: '🧍', staminaReward: 2, completed: false },
  { id: 'breathe', text: 'تنفس عميق 5 مرات 🌬️', icon: '🌬️', staminaReward: 2, completed: false },
  { id: 'stretch', text: 'تمدد لمدة 30 ثانية 🤸', icon: '🤸', staminaReward: 3, completed: false },
  { id: 'dhikr', text: 'سبحان الله 10 مرات 📿', icon: '📿', staminaReward: 4, completed: false },
  { id: 'walk', text: 'امشِ 20 خطوة 🚶', icon: '🚶', staminaReward: 3, completed: false },
];

export function generateDungeon(rank: string): DungeonRoom[][] {
  const grid: DungeonRoom[][] = [];
  const monsterPool = [...(MONSTERS_BY_RANK[rank] || MONSTERS_BY_RANK['E'])];
  const boss = { ...BOSS_BY_RANK[rank] || BOSS_BY_RANK['E'] };
  const treasurePool = [...TREASURES];

  // Pre-decide room types
  const roomTypes: RoomType[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill('empty')
  );

  // Start position
  roomTypes[GRID_SIZE - 1][0] = 'start';
  // Boss position
  roomTypes[0][GRID_SIZE - 1] = 'boss';

  // Place monsters (4-6 depending on rank)
  const monsterCount = rank === 'E' ? 3 : rank === 'D' ? 4 : rank === 'C' ? 5 : 6;
  let placed = 0;
  const usedPositions = new Set<string>();
  usedPositions.add(`${0},${GRID_SIZE - 1}`);
  usedPositions.add(`${GRID_SIZE - 1},${0}`);

  while (placed < monsterCount) {
    const rx = Math.floor(Math.random() * GRID_SIZE);
    const ry = Math.floor(Math.random() * GRID_SIZE);
    const key = `${ry},${rx}`;
    if (!usedPositions.has(key)) {
      roomTypes[ry][rx] = 'monster';
      usedPositions.add(key);
      placed++;
    }
  }

  // Place treasures (3-5)
  const treasureCount = rank === 'E' ? 3 : rank === 'D' ? 3 : 4;
  placed = 0;
  while (placed < treasureCount) {
    const rx = Math.floor(Math.random() * GRID_SIZE);
    const ry = Math.floor(Math.random() * GRID_SIZE);
    const key = `${ry},${rx}`;
    if (!usedPositions.has(key)) {
      roomTypes[ry][rx] = 'treasure';
      usedPositions.add(key);
      placed++;
    }
  }

  // Place traps (1-2)
  const trapCount = rank === 'E' ? 1 : 2;
  placed = 0;
  while (placed < trapCount) {
    const rx = Math.floor(Math.random() * GRID_SIZE);
    const ry = Math.floor(Math.random() * GRID_SIZE);
    const key = `${ry},${rx}`;
    if (!usedPositions.has(key)) {
      roomTypes[ry][rx] = 'trap';
      usedPositions.add(key);
      placed++;
    }
  }

  let monsterIdx = 0;
  let treasureIdx = 0;

  for (let y = 0; y < GRID_SIZE; y++) {
    const row: DungeonRoom[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const type = roomTypes[y][x];
      const room: DungeonRoom = {
        x, y, type,
        revealed: type === 'start',
        visited: type === 'start',
        description: EMPTY_DESCRIPTIONS[Math.floor(Math.random() * EMPTY_DESCRIPTIONS.length)],
        cleared: type === 'start',
      };

      if (type === 'monster') {
        const template = monsterPool[monsterIdx % monsterPool.length];
        room.monster = { ...template };
        monsterIdx++;
      } else if (type === 'boss') {
        room.monster = { ...boss };
      } else if (type === 'treasure') {
        room.treasure = { ...treasurePool[treasureIdx % treasurePool.length] };
        treasureIdx++;
      } else if (type === 'trap') {
        room.trap = { ...TRAP_DATA[Math.floor(Math.random() * TRAP_DATA.length)] };
      }

      row.push(room);
    }
    grid.push(row);
  }

  // Reveal adjacent to start
  const startY = GRID_SIZE - 1;
  const startX = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const ny = startY + dy;
      const nx = startX + dx;
      if (ny >= 0 && ny < GRID_SIZE && nx >= 0 && nx < GRID_SIZE) {
        grid[ny][nx].revealed = true;
      }
    }
  }

  return grid;
}

export function countRoomTypes(grid: DungeonRoom[][]) {
  let monsters = 0, treasures = 0, totalRooms = 0;
  for (const row of grid) {
    for (const room of row) {
      totalRooms++;
      if (room.type === 'monster') monsters++;
      if (room.type === 'treasure') treasures++;
    }
  }
  return { monsters, treasures, totalRooms };
}
