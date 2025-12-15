import { cn } from '@/lib/utils';
import { StatType } from '@/types/game';

interface ProgressBarProps {
  value: number;
  max?: number;
  category: StatType;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar = ({ 
  value, 
  max = 100, 
  category, 
  showLabel = false,
  size = 'md' 
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      <div className={cn('progress-bar', sizeClasses[size])}>
        <div
          className={cn('progress-fill', `progress-${category}`)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>{Math.floor(value)} XP</span>
          <span>{Math.floor(percentage)}%</span>
        </div>
      )}
    </div>
  );
};
