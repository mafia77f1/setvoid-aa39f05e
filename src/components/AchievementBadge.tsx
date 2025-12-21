import { Achievement } from '@/types/game';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export const AchievementBadge = ({ achievement }: AchievementBadgeProps) => {
  const progress = Math.min((achievement.progress / achievement.requirement) * 100, 100);

  return (
    <div
      className={cn(
        'achievement-badge',
        achievement.unlocked && 'unlocked'
      )}
    >
      <div
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full text-3xl',
          achievement.unlocked ? 'bg-secondary/20' : 'bg-muted grayscale'
        )}
      >
        {achievement.icon}
      </div>
      <h4 className="font-semibold">{achievement.name}</h4>
      <p className="text-xs text-muted-foreground">{achievement.description}</p>
      {!achievement.unlocked && (
        <div className="mt-2 w-full">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-secondary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {achievement.progress} / {achievement.requirement}
          </p>
        </div>
      )}
    </div>
  );
};
