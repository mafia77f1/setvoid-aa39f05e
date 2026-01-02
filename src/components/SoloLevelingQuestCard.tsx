import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Dumbbell, Brain, Heart, Zap, Clock, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { StatType, Quest } from '@/types/game';

// تعريف الـ Props لتطابق ما يتوقعه ملف App.tsx أو Main.tsx
interface DailyQuestCardProps {
  category: StatType;
  quests: Quest[]; // ضروري لاستلام المهام من حالة اللعبة
  onTaskComplete: (taskId: string) => void;
  timeRemaining?: string;
  xpReward: number;
}

const categoryConfig = {
  strength: { icon: Dumbbell, name: 'تدريب القوة', color: 'text-blue-400', label: 'STR' },
  mind: { icon: Brain, name: 'تدريب العقل', color: 'text-cyan-400', label: 'INT' },
  spirit: { icon: Heart, name: 'تدريب الروح', color: 'text-slate-300', label: 'SPR' },
  agility: { icon: Zap, name: 'تدريب الرشاقة', color: 'text-white', label: 'AGI' },
  quran: { icon: Zap, name: 'تدريب الرشاقة', color: 'text-white', label: 'AGI' }, // توافق مع النظام القديم
};

export const DailyQuestCard = ({ category, quests, onTaskComplete, timeRemaining, xpReward }: DailyQuestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [displayQuests, setDisplayQuests] = useState<any[]>([]);

  const config = categoryConfig[category] || categoryConfig.strength;
  const dayIndex = new Date().getDay(); 

  useEffect(() => {
    const generateStaticTasks = () => {
      const strengthRoutine = ['أرجل', 'صدر', 'كتف', 'تراي', 'باي', 'ظهر', 'بطن'];
      const mindRoutine = [
        { t: 'مراجعة أسبوع وتقييم التقدم', d: 'تطوير' },
        { t: 'لغز منطقي لرفع الذكاء', d: 'تحسين المنطق' },
        { t: 'قراءة 25 دقيقة + تلخيص', d: 'فهم وتحليل' },
        { t: 'ألعاب ذاكرة', d: 'رفع قوة الذاكرة' },
        { t: 'تعلم كلمة جديدة بلغة مختلفة', d: 'تحسين اللغة' },
        { t: 'تمرين اليد غير المسيطرة', d: 'تحفيز الدماغ' },
        { t: 'تأمل + مراجعة تركيز', d: 'استرخاء' }
      ];
      const spiritRoutine = [
        { t: '1000 سبحان الله + 1000 الحمد لله', d: 'تنقية' },
        { t: 'صوم الاثنين أو ذكر الله 25 مرة', d: 'تزكية' },
        { t: 'شكر 5 نعم (كتابة أو تفكير)', d: 'امتنان' },
        { t: 'ترك ذنب واحد اليوم', d: 'جهاد' },
        { t: 'صوم الخميس أو قراءة صفحة قرآن', d: 'تقوى' },
        { t: 'صلاة الجمعة + صلاة على النبي 100', d: 'نور' },
        { t: 'تأمل ومراجعة الروح', d: 'هدوء' }
      ];

      let tasks: any[] = [];
      if (category === 'strength') {
        tasks = [{ id: 'str-1', title: `تمرين ${strengthRoutine[dayIndex]}`, goal: '100 ضغط (5 مجاميع)' }];
      } else if (category === 'agility' || category === 'quran') {
        tasks = [
          { id: 'agi-1', title: 'الركض المستمر', goal: '15 دقيقة' },
          { id: 'agi-2', title: 'قفز الحبل/مكان', goal: '5 مجاميع × 50 قفزة' }
        ];
      } else if (category === 'mind') {
        tasks = [{ id: 'mid-1', title: mindRoutine[dayIndex].t, goal: mindRoutine[dayIndex].d }];
      } else if (category === 'spirit') {
        tasks = [{ id: 'spr-1', title: spiritRoutine[dayIndex].t, goal: spiritRoutine[dayIndex].d }];
      }

      // دمج حالة الإكمال من المصفوفة القادمة من السيستم (quests)
      return tasks.map(t => ({
        ...t,
        completed: quests.find(q => q.id === t.id)?.completed || false
      }));
    };

    setDisplayQuests(generateStaticTasks());
  }, [category, quests, dayIndex]);

  return (
    <div className={cn(
      "relative mb-6 overflow-hidden rounded-lg border-2 border-blue-500/30 bg-black/80 shadow-[0_0_20px_rgba(0,149,255,0.2)]",
      !isExpanded && "h-16"
    )}>
      {/* Scanline Effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Header */}
      <div 
        className="relative flex cursor-pointer items-center justify-between border-b border-blue-500/40 bg-blue-900/20 px-4 py-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-blue-400 animate-pulse" />
          <span className="text-sm font-black tracking-[0.2em] text-blue-100 uppercase">Quest Notification</span>
        </div>
        <div className="flex items-center gap-4">
          {timeRemaining && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
              <Clock className="h-3 w-3" /> {timeRemaining}
            </div>
          )}
          {isExpanded ? <ChevronUp className="text-blue-400" /> : <ChevronDown className="text-blue-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="relative p-5 text-right animate-in fade-in duration-500" dir="rtl">
          <div className="mb-6 space-y-1">
            <p className="text-blue-200 text-xs font-bold leading-relaxed">[مهمة يومية جديدة]</p>
            <h2 className="text-2xl font-black text-white tracking-tighter">
              مهمة الاستعداد: <span className={config.color}>{config.name}</span>
            </h2>
          </div>

          <div className="mb-6 rounded-sm border border-blue-500/20 bg-blue-900/10 p-4 relative">
             <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-400" />
             <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-400" />
            
            <h3 className="mb-3 text-center text-[10px] font-bold text-blue-300 tracking-[0.3em] uppercase underline decoration-blue-500/50 underline-offset-8">
              الأهداف المطلوبة
            </h3>
            
            <div className="space-y-3">
              {displayQuests.map((quest) => (
                <div key={quest.id} className="group flex items-center justify-between rounded border border-white/5 bg-white/5 p-3 hover:bg-blue-500/10 transition-all">
                   <button 
                    onClick={() => onTaskComplete(quest.id)}
                    className={cn(
                      "h-5 w-5 rounded-sm border border-blue-400 flex items-center justify-center transition-colors",
                      quest.completed ? "bg-blue-400 text-black" : "text-blue-400"
                    )}
                  >
                    {quest.completed && "✓"}
                  </button>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", quest.completed ? "text-gray-500 line-through" : "text-white")}>
                      {quest.title}
                    </p>
                    <p className="text-[10px] text-blue-300/70">{quest.goal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3 rounded border border-red-900/30 bg-red-950/20 p-3">
            <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
            <p className="text-[10px] leading-tight text-red-200/70">
              تحذير: الفشل في الإكمال سيؤدي إلى <span className="text-red-500 font-bold underline">عقوبة</span>.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 px-4 py-2">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Rewards</p>
              <p className="text-sm font-black text-blue-400">+{xpReward} XP</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Category</p>
              <p className="text-sm font-black text-white">{config.label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
