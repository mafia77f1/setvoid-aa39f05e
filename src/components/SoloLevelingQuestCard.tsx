import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Dumbbell, Brain, Heart, Zap, Clock, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { StatType } from '@/types/game';

interface DailyQuestCardProps {
  category: StatType;
  onTaskComplete: (taskId: string) => void;
  timeRemaining?: string;
  xpReward: number;
}

const categoryConfig = {
  strength: { icon: Dumbbell, name: 'تدريب القوة', color: 'text-blue-400', label: 'STR' },
  mind: { icon: Brain, name: 'تدريب العقل', color: 'text-cyan-400', label: 'INT' },
  spirit: { icon: Heart, name: 'تدريب الروح', color: 'text-slate-300', label: 'SPR' },
  agility: { icon: Zap, name: 'تدريب الرشاقة', color: 'text-white', label: 'AGI' },
};

export const DailyQuestCard = ({ category, onTaskComplete, timeRemaining, xpReward }: DailyQuestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dailyQuests, setDailyQuests] = useState<any[]>([]);

  // تأكد من وجود config لتجنب خطأ undefined
  const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.strength;
  const dayIndex = new Date().getDay(); 

  useEffect(() => {
    const generateQuests = () => {
      const strengthRoutine = ['أرجل', 'صدر', 'كتف', 'تراي', 'باي', 'ظهر', 'بطن'];
      
      const mindRoutine = [
        { title: 'مراجعة أسبوع وتقييم التقدم', desc: 'تقييم تقدمك' },
        { title: 'لغز منطقي', desc: 'تحسين المنطق' },
        { title: 'قراءة + تلخيص', desc: 'فهم + تحليل' },
        { title: 'ألعاب الذاكرة', desc: 'رفع قوة الذاكرة' },
        { title: 'تعلم كلمة جديدة', desc: 'تحسين اللغة' },
        { title: 'تمرين يد غير مسيطرة', desc: 'تحفيز الدماغ' },
        { title: 'تأمل + مراجعة', desc: 'تركيز + استرخاء' }
      ];

      const spiritRoutine = [
        { title: '1000 سبحان الله + 1000 الحمد لله', desc: 'تنقية الروح' },
        { title: 'صوم الاثنين أو (ذكر الله 25 مرة)', desc: 'تزكية' },
        { title: 'شكر 5 نعم (كتابة أو تفكير)', desc: 'امتنان' },
        { title: 'ترك ذنب واحد اليوم', desc: 'جهاد النفس' },
        { title: 'صوم الخميس أو قراءة صفحة قرآن', desc: 'تقوى' },
        { title: 'صلاة الجمعة + الصلاة على النبي 100 مرة', desc: 'نور' },
        { title: 'تسبيح أو ذكر الله 1000 مرة', desc: 'ذكر' }
      ];

      let tasks: any[] = [];

      // منطق اختيار المهام حسب التصنيف
      if (category === 'strength') {
        tasks = [{ id: `str-${dayIndex}`, title: `تمرين ${strengthRoutine[dayIndex]}`, goal: '100 ضغط (5 مجاميع)', completed: false }];
      } else if (category === 'agility' || (category as string) === 'quran') { // دعم التحويل من quran لـ agility
        tasks = [
          { id: `agi-1-${dayIndex}`, title: 'الركض المستمر', goal: '15 دقيقة', completed: false },
          { id: `agi-2-${dayIndex}`, title: 'قفز (5 مجاميع)', goal: '50 قفزة لكل مجموعة', completed: false }
        ];
      } else if (category === 'mind') {
        tasks = [{ id: `mid-${dayIndex}`, title: mindRoutine[dayIndex].title, goal: mindRoutine[dayIndex].desc, completed: false }];
      } else if (category === 'spirit') {
        tasks = [{ id: `spr-${dayIndex}`, title: spiritRoutine[dayIndex].title, goal: spiritRoutine[dayIndex].desc, completed: false }];
      }
      
      setDailyQuests(tasks);
    };

    generateQuests();
  }, [category, dayIndex]);

  return (
    <div className={cn(
      "relative mb-6 overflow-hidden rounded-lg border-2 border-blue-500/30 bg-black/90 shadow-[0_0_20px_rgba(0,149,255,0.2)]",
      !isExpanded && "h-16"
    )}>
      {/* Scanline Effect */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

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
        <div className="relative p-5 text-right" dir="rtl">
          <div className="mb-6 space-y-2">
            <p className="text-blue-200 text-xs font-bold leading-relaxed">[مهمة يومية جديدة]</p>
            <h2 className="text-2xl font-black text-white tracking-tighter">
              مهمة الاستعداد: <span className={config.color}>{config.name}</span>
            </h2>
          </div>

          <div className="mb-6 rounded-sm border border-blue-500/20 bg-blue-900/10 p-4 relative">
             <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-400" />
             <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-400" />
            
            <h3 className="mb-3 text-center text-xs font-bold text-blue-300 tracking-[0.3em] uppercase underline decoration-blue-500/50 underline-offset-8">الأهداف</h3>
            
            <div className="space-y-3">
              {dailyQuests.map((quest) => (
                <div key={quest.id} className="group flex items-center justify-between rounded border border-white/5 bg-white/5 p-3 hover:bg-blue-500/10">
                   <button 
                    onClick={() => onTaskComplete(quest.id)}
                    className="h-5 w-5 rounded-sm border border-blue-400 flex items-center justify-center text-blue-400 hover:bg-blue-400 transition-colors"
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

          <div className="mb-4 flex items-center gap-3 rounded border border-red-900/30 bg-red-950/20 p-3">
            <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-[10px] leading-tight text-red-200/70">
              تحذير: الفشل سيؤدي إلى <span className="text-red-500 font-bold underline">عقوبة</span> فورية.
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
