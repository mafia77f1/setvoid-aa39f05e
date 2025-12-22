import { ProgressBar } from './ProgressBar';
import { StatType } from '@/types/game';
import { Dumbbell, Brain, Heart, BookOpen } from 'lucide-react';

interface StatCardProps {
  category: StatType;
  level: number;
  xp: number;
  xpProgress: number;
}

const statConfig = {
  strength: {
    label: 'قوة الجسد',
    icon: Dumbbell,
    colorClass: 'text-strength',
  },
  mind: {
    label: 'قوة العقل',
    icon: Brain,
    colorClass: 'text-mind',
  },
  spirit: {
    label: 'قوة الروح',
    icon: Heart,
    colorClass: 'text-spirit',
  },
  Agility: {
    label: 'قوة الرشاقة',
    icon: BookOpen,
    colorClass: 'text-quran',
  },
};

export const StatCard = ({ category, level, xp, xpProgress }: StatCardProps) => {
  const config = statConfig[category];
  const Icon = config.icon;

  return (
    <div className="stat-card animate-fade-in">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg bg-${category}/20 p-2`}>
            <Icon className={`h-5 w-5 ${config.colorClass}`} />
          </div>
          <div>
            <h3 className="font-semibold">{config.label}</h3>
            <p className="text-xs text-muted-foreground">{xp} XP إجمالي</p>
          </div>
        </div>
        <div className="level-badge">
          <span>المستوى {level}</span>
        </div>
      </div>
      <ProgressBar value={xpProgress} category={category} showLabel size="md" />
    </div>
  );
};
