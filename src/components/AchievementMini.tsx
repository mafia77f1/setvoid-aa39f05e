import { Achievement } from '@/types/game';
import { cn } from '@/lib/utils';

interface AchievementMiniProps {
  achievement: Achievement;
}

export const AchievementMini = ({ achievement }: AchievementMiniProps) => {
  const progress = Math.min((achievement.progress / achievement.requirement) * 100, 100);

  return (
    <div
      className={cn(
        'relative p-3 rounded-lg border transition-all duration-300',
        achievement.unlocked 
          ? 'border-secondary/50 bg-secondary/10'
          : 'border-muted/30 bg-muted/10'
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-lg',
            achievement.unlocked ? '' : 'grayscale opacity-50'
          )}
        >
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold truncate">{achievement.name}</h4>
          {!achievement.unlocked && (
            <div className="mt-1">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-secondary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};