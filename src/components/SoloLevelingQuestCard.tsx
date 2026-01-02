import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  AlertTriangle, Dumbbell, Brain, Heart, Zap, Clock, 
  ChevronDown, ChevronUp, Sparkles, Skull, Play, X, 
  CheckCircle, Timer 
} from 'lucide-react';
import { StatType, Quest } from '@/types/game';

interface SoloLevelingQuestCardProps {
  onTaskComplete: (taskId: string) => void;
  onStartQuest: (questId: string) => void;
  timeRemaining?: string;
  // أضفنا quests هنا للتوافق مع بنية اللعبة الأصلية
  quests: Quest[];
}

const categoryConfig = {
  strength: { icon: Dumbbell, name: 'القوة', englishName: 'STRENGTH', color: 'hsl(0 70% 55%)' },
  mind: { icon: Brain, name: 'العقل', englishName: 'MIND', color: 'hsl(210 80% 55%)' },
  spirit: { icon: Heart, name: 'الروح', englishName: 'SPIRIT', color: 'hsl(270 70% 60%)' },
  agility: { icon: Zap, name: 'الرشاقة', englishName: 'AGILITY', color: 'hsl(150 60% 45%)' },
};

export const SoloLevelingQuestCard = ({ 
  onTaskComplete, 
  onStartQuest, 
  timeRemaining,
  quests 
}: SoloLevelingQuestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentDayQuests, setCurrentDayQuests] = useState<any[]>([]);

  // منطق توليد المهام بناءً على جدولك الأسبوعي
  useEffect(() => {
    const day = new Date().getDay(); // 0 (الأحد) - 6 (السبت)
    
    const strengthSchedule = ['أرجل', 'صدر', 'كتف', 'تراي', 'باي', 'ظهر', 'بطن'];
    const mindSchedule = [
      { t: 'مراجعة أسبوع وتقييم التقدم', d: 'تقييم الذات' },
      { t: 'لغز منطقي', d: 'تحسين المنطق' },
      { t: 'قراءة 25 دقيقة + تلخيص', d: 'فهم وتحليل' },
      { t: 'ألعاب الذاكرة', d: 'رفع قوة الذاكرة' },
      { t: 'تعلم كلمة جديدة', d: 'تحسين اللغة' },
      { t: 'تمرين يد غير مسيطرة', d: 'تحفيز الدماغ' },
      { t: 'تأمل + مراجعة', d: 'تركيز واسترخاء' }
    ];
    const spiritSchedule = [
      { t: '1000 سبحان الله + 1000 الحمد لله', d: 'تنقية الروح' },
      { t: 'صوم الاثنين أو ذكر الله 25 مرة', d: 'تزكية' },
      { t: 'شكر 5 نعم', d: 'امتنان' },
      { t: 'ترك ذنب واحد اليوم', d: 'جهاد النفس' },
      { t: 'صوم الخميس أو قراءة صفحة قرآن', d: 'تقوى' },
      { t: 'صلاة الجمعة + صلاة على النبي 100', d: 'نور' },
      { t: 'تسبيح وذكر الله 1000 مرة', d: 'ذكر' }
    ];

    // بناء المهام لليوم الحالي
    const generated = [
      {
        id: 'str-daily',
        category: 'strength',
        title: `تمرين ${strengthSchedule[day]}`,
        description: '100 ضغط على مدى 5 مجاميع',
        xpReward: 100,
        difficulty: 'medium'
      },
      {
        id: 'mind-daily',
        category: 'mind',
        title: mindSchedule[day].t,
        description: mindSchedule[day].d,
        xpReward: 80,
        difficulty: 'easy'
      },
      {
        id: 'agi-daily',
        category: 'agility',
        title: 'الركض 15 دقيقة',
        description: '5 مجاميع كل مجموعة 50 قفزة',
        xpReward: 90,
        difficulty: 'medium'
      },
      {
        id: 'spr-daily',
        category: 'spirit',
        title: spiritSchedule[day].t,
        description: spiritSchedule[day].d,
        xpReward: 120,
        difficulty: 'hard'
      }
    ];

    // دمج حالة الإكمال من الـ props (quests) إذا كانت موجودة
    const finalQuests = generated.map(g => {
      const existing = quests.find(q => q.id === g.id || q.category === g.category);
      return { ...g, completed: existing?.completed || false, startedAt: existing?.startedAt };
    });

    setCurrentDayQuests(finalQuests);
  }, [quests]);

  return (
    <div className={cn(
      "relative rounded-2xl overflow-hidden border-2 border-blue-500/30 bg-black/90 shadow-[0_0_40px_rgba(0,149,255,0.1)] text-right"
    )} dir="rtl">
      
      {/* Header */}
      <div className="p-5 border-b border-blue-500/20 bg-blue-900/10 flex items-center justify-between cursor-pointer"
           onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-blue-400 animate-pulse" />
          <div>
            <span className="text-xs font-black text-blue-400 tracking-[0.2em] block uppercase">DAILY QUEST</span>
            <span className="text-[10px] text-gray-500 font-bold">إشعار المهمة اليومية</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {timeRemaining && (
            <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              {timeRemaining}
            </div>
          )}
          {isExpanded ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-4">
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-sm text-blue-100 italic">
            "سيؤدي الفشل في إكمال المهمة اليومية إلى عقوبة مناسبة."
          </div>

          <div className="space-y-3">
            {currentDayQuests.map((quest) => {
              const config = categoryConfig[quest.category as keyof typeof categoryConfig];
              return (
                <div key={quest.id} className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                  quest.completed ? "bg-green-500/10 border-green-500/30 opacity-60" : "bg-white/5 border-white/10"
                )}>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                       style={{ background: `${config.color}20`, border: `1px solid ${config.color}40` }}>
                    <config.icon className="w-6 h-6" style={{ color: config.color }} />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className={cn("text-sm font-bold", quest.completed ? "line-through text-gray-500" : "text-white")}>
                      {quest.title}
                    </h3>
                    <p className="text-[10px] text-gray-400">{quest.description}</p>
                    <div className="mt-1 flex gap-3 items-center">
                      <span className="text-xs font-bold" style={{ color: config.color }}>+{quest.xpReward} XP</span>
                      <span className="text-[9px] px-1 bg-white/5 text-gray-500">{config.englishName}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <button 
                    onClick={() => quest.completed ? null : onTaskComplete(quest.id)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      quest.completed ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400 hover:scale-110"
                    )}
                  >
                    {quest.completed ? <CheckCircle className="w-6 h-6" /> : <Play className="w-5 h-5" />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Penalty Link */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-red-950/30 border border-red-500/20">
            <div className="flex items-center gap-2">
              <Skull className="w-4 h-4 text-red-500" />
              <span className="text-[10px] text-red-200">التحذير: العقوبة مفعلة</span>
            </div>
            <button className="text-[10px] font-bold text-red-400 underline uppercase">Penalty Info</button>
          </div>
        </div>
      )}
    </div>
  );
};
