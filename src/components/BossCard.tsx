import { Boss } from '@/types/game';
import { Skull, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BossCardProps {
  boss: Boss;
}

export const BossCard = ({ boss }: BossCardProps) => {
  const hpPercentage = (boss.currentHp / boss.maxHp) * 100;

  return (
    <div className={cn('boss-card', boss.defeated && 'opacity-50')}>
      {/* Decorative elements */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-destructive/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-destructive/5 blur-3xl" />
      
      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
              {boss.defeated ? (
                <Skull className="h-8 w-8 text-muted-foreground" />
              ) : (
                <Swords className="h-8 w-8 text-destructive animate-pulse-slow" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{boss.name}</h2>
              <p className="text-muted-foreground">{boss.description}</p>
            </div>
          </div>
        </div>

        {boss.defeated ? (
          <div className="rounded-xl bg-secondary/20 p-6 text-center">
            <h3 className="mb-2 text-xl font-bold text-secondary glow-text">
              ✓ تم القضاء على العادة السيئة!
            </h3>
            <p className="text-muted-foreground">أحسنت! استمر في تطوير نفسك</p>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">نقاط الحياة</span>
              <span className="font-bold text-destructive">
                {boss.currentHp} / {boss.maxHp}
              </span>
            </div>
            <div className="h-6 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-l from-destructive to-orange-500 transition-all duration-500"
                style={{ width: `${hpPercentage}%` }}
              />
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              أكمل المهمات المحددة لإضعاف الزعيم
            </p>
          </>
        )}
      </div>
    </div>
  );
};
