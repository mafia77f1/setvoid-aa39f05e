import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Trophy, Lock, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Achievement } from '@/types/game';

const rarityConfig = {
  common: { color: 'hsl(0 0% 70%)', glow: 'hsl(0 0% 70% / 0.3)', name: 'عادي', bg: 'from-gray-500/20' },
  rare: { color: 'hsl(210 100% 60%)', glow: 'hsl(210 100% 60% / 0.4)', name: 'نادر', bg: 'from-blue-500/20' },
  epic: { color: 'hsl(270 100% 60%)', glow: 'hsl(270 100% 60% / 0.5)', name: 'ملحمي', bg: 'from-purple-500/20' },
  legendary: { color: 'hsl(45 100% 50%)', glow: 'hsl(45 100% 50% / 0.5)', name: 'أسطوري', bg: 'from-yellow-500/20' },
};

const EpicAchievements = () => {
  const { gameState } = useGameState();
  
  const unlockedAchievements = gameState.achievements.filter(a => a.unlocked);
  const lockedAchievements = gameState.achievements.filter(a => !a.unlocked);

  const AchievementCard = ({ achievement, index }: { achievement: Achievement; index: number }) => {
    const rarity = rarityConfig[achievement.rarity || 'common'];
    const progress = Math.min((achievement.progress / achievement.requirement) * 100, 100);

    return (
      <div
        className={cn(
          "relative p-4 rounded-xl transition-all duration-300 overflow-hidden",
          "border-2 animate-fade-in",
          achievement.unlocked ? "hover:scale-[1.02]" : "opacity-60"
        )}
        style={{ 
          animationDelay: `${index * 0.1}s`,
          background: `linear-gradient(135deg, ${achievement.unlocked ? `${rarity.color}15` : 'hsl(0 0% 10%)'}, transparent)`,
          borderColor: achievement.unlocked ? `${rarity.color}50` : 'hsl(0 0% 20%)',
          boxShadow: achievement.unlocked ? `0 0 30px ${rarity.glow}` : 'none',
        }}
      >
        {/* Unlocked glow effect */}
        {achievement.unlocked && (
          <div 
            className="absolute inset-0 pointer-events-none animate-pulse"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${rarity.glow}, transparent 70%)`,
              opacity: 0.3,
            }}
          />
        )}

        <div className="relative z-10 flex items-center gap-4">
          {/* Icon */}
          <div 
            className={cn(
              "w-16 h-16 rounded-xl flex items-center justify-center shrink-0 text-3xl",
              !achievement.unlocked && "grayscale opacity-50"
            )}
            style={{ 
              background: achievement.unlocked 
                ? `linear-gradient(135deg, ${rarity.color}30, ${rarity.color}10)` 
                : 'hsl(0 0% 15%)',
              border: `2px solid ${achievement.unlocked ? `${rarity.color}50` : 'hsl(0 0% 25%)'}`,
              boxShadow: achievement.unlocked ? `0 0 20px ${rarity.glow}` : 'none',
            }}
          >
            {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-500" />}
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                "font-bold truncate",
                achievement.unlocked ? "text-white" : "text-gray-500"
              )}>
                {achievement.name}
              </span>
              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded"
                style={{ 
                  background: `${rarity.color}30`,
                  color: achievement.unlocked ? rarity.color : 'gray',
                }}
              >
                {rarity.name}
              </span>
            </div>
            
            <p className="text-xs text-gray-500 mb-2 line-clamp-1">{achievement.description}</p>
            
            {/* Progress bar */}
            <div className="relative h-2 rounded-full overflow-hidden bg-black/40">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progress}%`,
                  background: achievement.unlocked 
                    ? `linear-gradient(90deg, ${rarity.color}, ${rarity.color}80)`
                    : 'hsl(0 0% 40%)',
                  boxShadow: achievement.unlocked ? `0 0 10px ${rarity.glow}` : 'none',
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-500">{achievement.progress}/{achievement.requirement}</span>
              <span className="text-[10px]" style={{ color: achievement.unlocked ? rarity.color : 'gray' }}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020203] text-white pb-40 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(234,179,8,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.06),transparent_40%)]" />
      </div>

      {/* Header */}
      <header className="relative z-20 pt-12 pb-8 px-6 text-center border-b border-yellow-500/20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-2">
          <Trophy className="w-5 h-5 text-yellow-400 animate-float" />
          <span className="text-xs font-black tracking-[0.3em] text-yellow-400">ACHIEVEMENTS</span>
        </div>
        <h1 className="text-3xl font-black text-white mt-2">الإنجازات</h1>
        <p className="text-sm text-gray-500 mt-1">
          {unlockedAchievements.length} من {gameState.achievements.length} إنجاز محقق
        </p>
      </header>

      {/* Progress summary */}
      <div className="relative z-10 px-6 py-6">
        <div 
          className="p-4 rounded-xl text-center"
          style={{
            background: 'linear-gradient(135deg, hsl(45 100% 50% / 0.1), transparent)',
            border: '1px solid hsl(45 100% 50% / 0.3)',
          }}
        >
          <div className="flex items-center justify-center gap-8">
            <div>
              <div className="text-3xl font-black text-yellow-400">{unlockedAchievements.length}</div>
              <div className="text-xs text-gray-500">محقق</div>
            </div>
            <div className="w-px h-10 bg-yellow-500/30" />
            <div>
              <div className="text-3xl font-black text-gray-500">{lockedAchievements.length}</div>
              <div className="text-xs text-gray-500">متبقي</div>
            </div>
            <div className="w-px h-10 bg-yellow-500/30" />
            <div>
              <div className="text-3xl font-black text-purple-400">
                {Math.round((unlockedAchievements.length / gameState.achievements.length) * 100)}%
              </div>
              <div className="text-xs text-gray-500">مكتمل</div>
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 px-6 py-4 space-y-8">
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="font-bold text-white">الإنجازات المحققة</h2>
                <p className="text-xs text-gray-500">{unlockedAchievements.length} إنجاز</p>
              </div>
            </div>
            <div className="space-y-3">
              {unlockedAchievements.map((achievement, i) => (
                <AchievementCard key={achievement.id} achievement={achievement} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Locked Achievements */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gray-500/20 border border-gray-500/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h2 className="font-bold text-white">الإنجازات القادمة</h2>
              <p className="text-xs text-gray-500">{lockedAchievements.length} إنجاز للفتح</p>
            </div>
          </div>
          <div className="space-y-3">
            {lockedAchievements.map((achievement, i) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={i} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default EpicAchievements;