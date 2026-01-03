import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Trophy, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Achievements = () => {
  // قائمة الإنجازات الكاملة المستوحاة من سولو ليفلينج
  const achievementsData = [
    { id: 1, name: "The Monarch of Shadows", rarity: "S", description: "Inherit the power of Ashborn and rule the dead.", unlocked: true },
    { id: 2, name: "Ant King's End", rarity: "S", description: "Defeated the predator of Jeju Island, Beru.", unlocked: true },
    { id: 3, name: "Demon Hunter", rarity: "A", description: "Cleared all 100 floors of the Demon Castle.", unlocked: false },
    { id: 4, name: "Wolf Slayer", rarity: "B", description: "Title earned by slaughtering the steel-fanged wolves.", unlocked: true },
    { id: 5, name: "The One Who Survived", rarity: "B", description: "Escaped the Double Dungeon alive.", unlocked: true },
    { id: 6, name: "High Orc Crusher", rarity: "A", description: "Defeated the High Orc Shaman, Kargalgan.", unlocked: false },
    { id: 7, name: "Solo Raider", rarity: "C", description: "Cleared a C-Rank Gate without any party members.", unlocked: true },
    { id: 8, name: "Daily Quest Complete", rarity: "D", description: "Finished 100 push-ups, sit-ups, and squats.", unlocked: true },
    { id: 9, name: "E-Rank Weakest", rarity: "E", description: "The starting point of the world's weakest hunter.", unlocked: true },
  ];

  // دالة لتحديد "ستايل" الرتبة
  const getRankStyles = (rarity) => {
    switch (rarity) {
      case 'S':
        return {
          card: "border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-gradient-to-br from-yellow-500/10 to-purple-600/10",
          text: "text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]",
          badge: "bg-yellow-500 text-black",
          aura: "bg-yellow-500/20"
        };
      case 'A':
        return {
          card: "border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)] bg-red-950/20",
          text: "text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]",
          badge: "bg-red-600 text-white",
          aura: "bg-red-600/20"
        };
      case 'B':
        return {
          card: "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20",
          text: "text-purple-400",
          badge: "bg-purple-500 text-white",
          aura: "bg-purple-500/20"
        };
      case 'C':
        return {
          card: "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)] bg-blue-950/20",
          text: "text-blue-400",
          badge: "bg-blue-500 text-white",
          aura: "bg-blue-500/20"
        };
      default: // D and E
        return {
          card: "border-slate-700 bg-slate-900/40",
          text: "text-slate-400",
          badge: "bg-slate-700 text-slate-200",
          aura: "bg-transparent"
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans pb-24">
      {/* Background FX */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.1),transparent_70%)]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-10 border-b border-blue-500/30 pb-3">
        <h1 className="text-xl font-bold tracking-widest uppercase italic text-blue-400">
          Achievement System
        </h1>
        <div className="bg-blue-950/40 border border-blue-400/50 px-3 py-1 flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-mono font-bold text-sm">
            {achievementsData.filter(a => a.unlocked).length}/{achievementsData.length}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-12">
        {achievementsData.map((achievement) => {
          const styles = getRankStyles(achievement.rarity);
          
          return (
            <div key={achievement.id} className={cn(
              "relative group transition-all duration-700",
              !achievement.unlocked && "opacity-40 grayscale blur-[0.5px]"
            )}>
              {/* Card Container */}
              <div className={cn(
                "relative bg-black/80 border-2 p-5 transition-all duration-500",
                achievement.unlocked ? styles.card : "border-slate-800"
              )}>
                
                {/* الرتبة العلوية - Badge */}
                <div className="flex justify-center mb-6 mt-[-1.8rem]">
                  <div className={cn(
                    "border px-6 py-0.5 bg-slate-900/90 skew-x-[-10deg]",
                    achievement.unlocked ? styles.card : "border-slate-700"
                  )}>
                    <h2 className={cn(
                      "text-[10px] font-black tracking-[0.2em] uppercase italic",
                      achievement.unlocked ? styles.text : "text-slate-600"
                    )}>
                      {achievement.unlocked ? `Rank ${achievement.rarity}` : "Locked Entry"}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    {/* Achievement Icon Slot */}
                    <div className={cn(
                      "w-20 h-20 border-2 flex items-center justify-center bg-black/40 relative flex-shrink-0",
                      achievement.unlocked ? styles.card : "border-slate-800"
                    )}>
                      {achievement.unlocked ? (
                        <img src="/AchievementIcon.png" className="w-full h-full object-cover p-1" alt="Icon" />
                      ) : (
                        <Lock className="w-8 h-8 text-slate-800" />
                      )}
                      {/* UI Corners */}
                      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-current" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-current" />
                    </div>

                    {/* Information */}
                    <div className="flex-1">
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Achievement Name</p>
                      <h3 className={cn(
                        "text-sm font-black italic uppercase leading-tight transition-colors",
                        achievement.unlocked ? styles.text : "text-slate-700"
                      )}>
                        {achievement.unlocked ? achievement.name : "UNKNOWN MISSION"}
                      </h3>
                      
                      <div className={cn(
                        "h-[1px] w-full my-2 bg-gradient-to-r from-transparent via-current to-transparent opacity-30",
                        achievement.unlocked ? styles.text : "text-slate-800"
                      )} />

                      <p className="text-[10px] font-bold text-slate-400 italic">
                        {achievement.unlocked ? `REWARD: TITLE GRANTED` : "REWARD: RESTRICTED"}
                      </p>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="py-3 border-y border-slate-800/50 bg-white/[0.01] px-4 relative overflow-hidden">
                    {achievement.unlocked && <div className={cn("absolute inset-0 opacity-5", styles.aura)} />}
                    <p className="text-[11px] text-slate-300 italic leading-relaxed text-center relative z-10">
                      {achievement.unlocked 
                        ? achievement.description 
                        : "Required level or condition not met. Information hidden by the system."}
                    </p>
                  </div>

                  {/* Status Button */}
                  <div className={cn(
                    "w-full py-1 text-center text-[9px] font-black tracking-[0.3em] uppercase italic transition-all",
                    achievement.unlocked 
                      ? `${styles.badge} shadow-lg shadow-current/20` 
                      : "bg-slate-900 text-slate-700 border border-slate-800"
                  )}>
                    {achievement.unlocked ? "Claimed" : "Incomplete"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
};

export default Achievements;
