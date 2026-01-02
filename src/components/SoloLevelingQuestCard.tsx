import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Dumbbell, Brain, Heart, Zap, Clock, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { StatType, Quest } from '@/types/game';
import { QuestTaskModal } from './QuestTaskModal';

interface DailyQuestCardProps {
  category: StatType;
  onTaskComplete: (taskId: string) => void;
  timeRemaining?: string;
  xpReward: number;
}

// إعدادات التصنيف مع استبدال QRN بـ AGI
const categoryConfig = {
  strength: { icon: Dumbbell, name: 'تدريب القوة', color: 'text-blue-400', label: 'STR' },
  mind: { icon: Brain, name: 'تدريب العقل', color: 'text-cyan-400', label: 'INT' },
  spirit: { icon: Heart, name: 'تدريب الروح', color: 'text-slate-300', label: 'SPR' },
  agility: { icon: Zap, name: 'تدريب الرشاقة', color: 'text-white', label: 'AGI' },
};

export const DailyQuestCard = ({ category, onTaskComplete, timeRemaining, xpReward }: DailyQuestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<any | null>(null);
  const [dailyQuests, setDailyQuests] = useState<any[]>([]);

  const config = categoryConfig[category];
  const dayIndex = new Date().getDay(); // 0 (الأحد) إلى 6 (السبت)

  // منطق اختيار المهام بناءً على اليوم
  useEffect(() => {
    const generateQuests = () => {
      const strengthRoutine = ['أرجل', 'صدر', 'كتف', 'تراي', 'باي', 'ظهر', 'بطن']; // يبدأ من الأحد
      const spiritRoutine = [
        { title: '1000 سبحان الله + 1000 الحمد لله', desc: 'تنقية الروح' },
        { title: 'صوم الاثنين أو (سبحان الله وبحمده) 25 مرة', desc: 'تزكية' },
        { title: 'شكر 5 نعم (كتابة أو تفكير)', desc: 'امتنان' },
        { title: 'ترك ذنب واحد اليوم', desc: 'جهاد النفس' },
        { title: 'صوم الخميس أو قراءة صفحة قرآن بتدبّر', desc: 'تقوى' },
        { title: 'صلاة الجمعة + الصلاة على النبي 100 مرة', desc: 'نور' },
        { title: 'تأمل ومراجعة الروح', desc: 'هدوء' }
      ];
      const mindRoutine = [
        { title: 'مراجعة أسبوع وتقييم التقدم', desc: 'تطوير' }, // الأحد
        { title: 'لغز منطقي لرفع الذكاء', desc: 'تحسين المنطق' },
        { title: 'قراءة 25 دقيقة + تلخيص', desc: 'فهم وتحليل' },
        { title: 'ألعاب ذاكرة', desc: 'رفع قوة الذاكرة' },
        { title: 'تعلم كلمة جديدة بلغة مختلفة', desc: 'تحسين اللغة' },
        { title: 'تمرين اليد غير المسيطرة', desc: 'تحفيز الدماغ' },
        { title: 'تأمل + مراجعة تركيز', desc: 'استرخاء' }
      ];

      let tasks = [];
      if (category === 'strength') {
        tasks = [{ id: 'str-1', title: `تمرين ${strengthRoutine[dayIndex]}`, goal: '100 تكرار (5 مجاميع)', completed: false }];
      } else if (category === 'agility') {
        tasks = [
          { id: 'agi-1', title: 'الركض المستمر', goal: '15 دقيقة', completed: false },
          { id: 'agi-2', title: 'قفز الحبل/مكان', goal: '5 مجاميع × 50 قفزة', completed: false }
        ];
      } else if (category === 'mind') {
        tasks = [{ id: 'mid-1', title: mindRoutine[dayIndex].title, goal: mindRoutine[dayIndex].desc, completed: false }];
      } else if (category === 'spirit') {
        tasks = [{ id: 'spr-1', title: spiritRoutine[dayIndex].title, goal: spiritRoutine[dayIndex].desc, completed: false }];
      }
      setDailyQuests(tasks);
    };

    generateQuests();
  }, [category, dayIndex]);

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
              <Clock className="h-3 w-3" />
              {timeRemaining}
            </div>
          )}
          {isExpanded ? <ChevronUp className="text-blue-400" /> : <ChevronDown className="text-blue-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="relative p-5 animate-in fade-in slide-in-from-top-2 duration-500">
          {/* Main Quest Content */}
          <div className="mb-6 space-y-2 text-right">
            <p className="text-blue-200 text-xs font-bold leading-relaxed">
              [لقد وصلت مهمة يومية جديدة]
            </p>
            <h2 className="text-2xl font-black text-white tracking-tighter drop-shadow-sm">
              مهمة الاستعداد: <span className={config.color}>{config.name}</span>
            </h2>
          </div>

          {/* Goal Box */}
          <div className="mb-6 rounded-sm border border-blue-500/20 bg-blue-900/10 p-4 relative">
             <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-400" />
             <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-400" />
            
            <h3 className="mb-3 text-center text-xs font-bold text-blue-300 tracking-[0.3em] uppercase underline decoration-blue-500/50 underline-offset-8">
              الأهداف المطلوبة
            </h3>
            
            <div className="space-y-3">
              {dailyQuests.map((quest) => (
                <div 
                  key={quest.id}
                  className="group flex items-center justify-between rounded border border-white/5 bg-white/5 p-3 transition-all hover:bg-blue-500/10"
                >
                   <button 
                    onClick={() => onTaskComplete(quest.id)}
                    className="h-5 w-5 rounded-sm border border-blue-400 flex items-center justify-center text-blue-400 hover:bg-blue-400 hover:text-black transition-colors"
                  >
                    {quest.completed ? "✓" : ""}
                  </button>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{quest.title}</p>
                    <p className="text-[10px] text-blue-300/70">{quest.goal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Section */}
          <div className="mb-4 flex items-center gap-3 rounded border border-red-900/30 bg-red-950/20 p-3">
            <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-[10px] leading-tight text-red-200/70 text-right">
              تحذير: سيؤدي عدم إكمال المهمة اليومية إلى فرض <span className="text-red-500 font-bold underline">عقوبة (Penalty)</span> فور انتهاء الوقت.
            </p>
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-between rounded-sm border border-white/10 bg-white/5 px-4 py-2">
             <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Rewards</p>
              <p className="text-sm font-black text-blue-400">+{xpReward} XP</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
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
