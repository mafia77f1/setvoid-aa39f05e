import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Skull, Gift, ArrowRight, Sparkles, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DungeonLoot {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const DUNGEON_LOOT_BY_RANK: Record<string, DungeonLoot[]> = {
  E: [
    { id: '1', name: 'حجر طاقة صغير', icon: '💎', rarity: 'common' },
    { id: '2', name: 'عشبة شفاء', icon: '🌿', rarity: 'common' },
  ],
  D: [
    { id: '1', name: 'حجر طاقة', icon: '💎', rarity: 'common' },
    { id: '2', name: 'درع خفيف', icon: '🛡️', rarity: 'rare' },
    { id: '3', name: 'جرعة مانا', icon: '🧪', rarity: 'common' },
  ],
  C: [
    { id: '1', name: 'حجر طاقة نادر', icon: '💠', rarity: 'rare' },
    { id: '2', name: 'سيف قديم', icon: '⚔️', rarity: 'rare' },
    { id: '3', name: 'تعويذة حماية', icon: '📜', rarity: 'rare' },
  ],
  B: [
    { id: '1', name: 'حجر طاقة ملحمي', icon: '🔮', rarity: 'epic' },
    { id: '2', name: 'خوذة الظلام', icon: '⛑️', rarity: 'epic' },
    { id: '3', name: 'خاتم القوة', icon: '💍', rarity: 'rare' },
  ],
  A: [
    { id: '1', name: 'حجر طاقة أسطوري', icon: '✨', rarity: 'legendary' },
    { id: '2', name: 'درع التنين', icon: '🐉', rarity: 'epic' },
  ],
  S: [
    { id: '1', name: 'جوهرة الظلام', icon: '🌑', rarity: 'legendary' },
    { id: '2', name: 'تاج الإمبراطور', icon: '👑', rarity: 'legendary' },
  ],
};

const RARITY_COLORS: Record<string, string> = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

const Dungeon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rank = (searchParams.get('rank') || 'E').toUpperCase();
  
  const [phase, setPhase] = useState<'entering' | 'cave' | 'loot' | 'portal'>('entering');
  const [collectedLoot, setCollectedLoot] = useState<DungeonLoot[]>([]);
  const [showPortal, setShowPortal] = useState(false);

  const loot = DUNGEON_LOOT_BY_RANK[rank] || DUNGEON_LOOT_BY_RANK['E'];

  useEffect(() => {
    // Entrance animation
    const t = setTimeout(() => setPhase('cave'), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 'cave') {
      // Show loot after exploring
      const t = setTimeout(() => setPhase('loot'), 1500);
      return () => clearTimeout(t);
    }
    if (phase === 'loot') {
      // Collect loot automatically
      loot.forEach((item, i) => {
        setTimeout(() => {
          setCollectedLoot(prev => [...prev, item]);
        }, (i + 1) * 600);
      });
      // Show portal after all loot collected
      const t = setTimeout(() => {
        setShowPortal(true);
        setPhase('portal');
      }, (loot.length + 1) * 600 + 500);
      return () => clearTimeout(t);
    }
  }, [phase, loot]);

  const handleEnterBossPortal = () => {
    navigate(`/battle?rank=${rank}`);
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden select-none" dir="rtl">
      {/* Cave background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(30,15,5,1)_0%,rgba(5,5,5,1)_70%)]" />
        {/* Stalactites effect */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-stone-900/80 to-transparent" />
        {/* Floor glow */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-950/20 to-transparent" />
        
        {/* Floating dust particles */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: 'rgba(255,200,100,0.3)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Torch lights */}
        <div className="absolute top-1/4 left-8 w-20 h-20 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-8 w-16 h-16 bg-orange-600/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Entering phase */}
      {phase === 'entering' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center animate-fade-in">
          <div className="text-center space-y-4">
            <Skull className="w-16 h-16 mx-auto text-amber-500/60 animate-pulse" />
            <h1 className="text-2xl font-black tracking-[0.3em] text-amber-400/80 uppercase">
              دخول المغارة...
            </h1>
            <p className="text-xs text-stone-500 tracking-widest">RANK {rank} DUNGEON</p>
            <div className="w-32 h-1 mx-auto bg-stone-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 animate-[loading_2s_linear]" />
            </div>
          </div>
        </div>
      )}

      {/* Cave exploration */}
      {(phase === 'cave' || phase === 'loot' || phase === 'portal') && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 animate-fade-in">
          
          {/* Cave header */}
          <div className="text-center mb-8">
            <h2 className="text-lg font-black text-stone-400 tracking-[0.2em] uppercase mb-1">
              المغارة المظلمة
            </h2>
            <span className="text-[10px] text-stone-600 tracking-widest">RANK {rank} — EXPLORING...</span>
          </div>

          {/* Loot display */}
          {(phase === 'loot' || phase === 'portal') && (
            <div className="w-full max-w-sm space-y-3 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">غنائم المغارة</span>
              </div>
              
              {loot.map((item, i) => {
                const collected = collectedLoot.find(l => l.id === item.id);
                return (
                  <div key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all duration-500",
                      collected 
                        ? "bg-black/60 border-white/20 opacity-100 translate-x-0" 
                        : "bg-black/20 border-transparent opacity-30 translate-x-4"
                    )}
                    style={{ 
                      transitionDelay: `${i * 100}ms`,
                      borderColor: collected ? `${RARITY_COLORS[item.rarity]}40` : undefined,
                    }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: collected ? RARITY_COLORS[item.rarity] : '#555' }}>
                        {item.name}
                      </p>
                      <p className="text-[9px] uppercase tracking-widest" style={{ color: `${RARITY_COLORS[item.rarity]}99` }}>
                        {item.rarity}
                      </p>
                    </div>
                    {collected && <Sparkles className="w-4 h-4" style={{ color: RARITY_COLORS[item.rarity] }} />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Boss Portal */}
          {showPortal && (
            <div className="animate-fade-in space-y-4 w-full max-w-sm">
              <div className="text-center mb-2">
                <p className="text-[10px] text-red-400/80 font-bold tracking-widest uppercase animate-pulse">
                  ⚠ بوابة الزعيم تم اكتشافها ⚠
                </p>
              </div>
              
              <button
                onClick={handleEnterBossPortal}
                className="w-full relative overflow-hidden py-5 rounded-xl border-2 border-red-500/50 bg-gradient-to-b from-red-950/60 to-black font-black text-lg tracking-wider text-red-400 transition-all hover:border-red-400/80 hover:scale-[1.02] active:scale-95"
                style={{ boxShadow: '0 0 40px rgba(239,68,68,0.2), inset 0 0 30px rgba(239,68,68,0.1)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-energy-flow" />
                <span className="flex items-center justify-center gap-3 relative z-10">
                  <Key className="w-5 h-5" />
                  دخول بوابة الزعيم
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </span>
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full py-3 rounded-lg border border-stone-700/50 bg-stone-900/30 text-stone-500 text-sm font-bold hover:bg-stone-800/40 transition-colors"
              >
                الخروج من المغارة
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes loading { from { width: 0; } to { width: 100%; } }
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-15px); opacity: 0.7; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        @keyframes energy-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-energy-flow { animation: energy-flow 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default Dungeon;
