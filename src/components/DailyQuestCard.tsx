import { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Check } from 'lucide-react';
import { Quest } from '@/types/game';

interface DailyQuestCardProps {
  quests: Quest[]; // سنعتمد على أن المهمات هي (Push-ups, Sit-ups, etc.)
  xpReward: number;
}

export const DailyQuestCard = ({ quests }: DailyQuestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-slate-900">
      {/* Container الرئيسي - الشاشة الزجاجية */}
      <div className={cn(
        "relative w-full max-w-[400px] transition-all duration-700",
        "bg-[#0a1926]/80 backdrop-blur-md", // لون الخلفية الأزرق الغامق الشفاف
        "border-[1px] border-[#3eb4ff]/30 shadow-[0_0_20px_rgba(62,180,255,0.15)]", // توهج خفيف
        "p-6 font-sans text-slate-200 uppercase tracking-tight"
      )}>
        
        {/* الزوايا التقنية (Corners) */}
        <div className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2 border-[#3eb4ff]" />
        <div className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-2 border-r-2 border-[#3eb4ff]" />

        {/* Header: Quest Info */}
        <div className="flex items-center justify-center gap-3 mb-8 border-b border-[#3eb4ff]/20 pb-4">
          <div className="w-8 h-8 rounded-full border border-[#3eb4ff] flex items-center justify-center">
            <span className="text-[#3eb4ff] font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold tracking-[0.2em] text-[#e2f3ff]">Quest Info</h2>
        </div>

        {/* System Message */}
        <div className="text-center mb-10">
          <p className="text-[13px] text-[#3eb4ff]/80 lowercase mb-6">
            [Daily Quest: Strength Training has arrived.]
          </p>
          <h3 className="text-lg font-bold border-b border-[#3eb4ff]/40 inline-block px-4 pb-1">
            GOAL
          </h3>
        </div>

        {/* Tasks List - قائمة المهام */}
        <div className="space-y-6 mb-12 px-4">
          {quests.map((quest) => (
            <div key={quest.id} className="flex items-center justify-between group">
              <span className="text-[15px] font-medium text-slate-300">
                {quest.title}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[15px] text-[#3eb4ff]">
                  [{quest.currentProgress}/{quest.targetAmount}]
                </span>
                <div className={cn(
                  "w-5 h-5 border border-[#3eb4ff]/50 flex items-center justify-center transition-all",
                  quest.completed ? "bg-[#3eb4ff]/20 border-[#3eb4ff]" : ""
                )}>
                  {quest.completed && <Check className="w-4 h-4 text-[#3eb4ff]" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning Section */}
        <div className="text-center space-y-2 mb-10 px-6">
          <p className="text-[12px] leading-relaxed">
            <span className="text-white font-bold tracking-widest">WARNING:</span> Failure to complete 
            the daily quest will result in 
            an appropriate <span className="text-[#ff3e3e] font-bold">penalty.</span>
          </p>
        </div>

        {/* Complete Button Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 border-2 border-[#3eb4ff] flex items-center justify-center cursor-pointer hover:bg-[#3eb4ff]/10 transition-colors">
            <Check className="w-8 h-8 text-[#5fffa3]" strokeWidth={3} />
          </div>
        </div>

        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
          <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(#3eb4ff 1px, transparent 1px), linear-gradient(90deg, #3eb4ff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
      </div>
    </div>
  );
};
