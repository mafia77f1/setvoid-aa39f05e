import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skull, AlertTriangle, Clock, Swords, Heart, Shield } from 'lucide-react';

interface EpicPunishmentScreenProps {
  endTime: string;
  onTimeComplete: () => void;
  onExit?: () => void;
}

export const EpicPunishmentScreen = ({ endTime, onTimeComplete, onExit }: EpicPunishmentScreenProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentWave, setCurrentWave] = useState(1);
  const [playerHp, setPlayerHp] = useState(100);
  const [showAttack, setShowAttack] = useState(false);
  const [monstersDefeated, setMonstersDefeated] = useState(0);

  useEffect(() => {
    const calculateRemaining = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      return Math.max(0, Math.floor((end - now) / 1000));
    };

    setTimeRemaining(calculateRemaining());

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
        onTimeComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onTimeComplete]);

  // Simulate attacks every 30 seconds
  useEffect(() => {
    const attackInterval = setInterval(() => {
      setShowAttack(true);
      setPlayerHp(prev => Math.max(0, prev - 5));
      setTimeout(() => setShowAttack(false), 1000);
    }, 30000);

    return () => clearInterval(attackInterval);
  }, []);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const handleDefeat = () => {
    setMonstersDefeated(prev => prev + 1);
    if (monstersDefeated > 0 && monstersDefeated % 10 === 0) {
      setCurrentWave(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Intense dark red/black background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(0_50%_5%)] via-[hsl(0_60%_3%)] to-black" />
      
      {/* Animated dark energy waves */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${30 + i * 10}% ${20 + i * 15}%, hsl(0 70% 20% / 0.3), transparent 30%)`,
              animation: `pulse ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Shadow tendrils effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 bg-gradient-to-t from-transparent via-red-900/50 to-transparent"
            style={{
              height: '200%',
              left: `${i * 14}%`,
              animation: `tendril ${4 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Top warning bar */}
      <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden">
        <div 
          className="h-full w-[200%] animate-slide-stripes"
          style={{
            background: 'repeating-linear-gradient(90deg, hsl(0 80% 40%) 0px, hsl(0 80% 40%) 40px, hsl(0 80% 15%) 40px, hsl(0 80% 15%) 80px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center gap-4">
          <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
          <span className="text-lg font-black tracking-[0.4em] text-white drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
            PENALTY ZONE
          </span>
          <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
        </div>
      </div>

      {/* Bottom warning bar */}
      <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
        <div 
          className="h-full w-[200%] animate-slide-stripes-reverse"
          style={{
            background: 'repeating-linear-gradient(90deg, hsl(0 80% 40%) 0px, hsl(0 80% 40%) 40px, hsl(0 80% 15%) 40px, hsl(0 80% 15%) 80px)',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
        {/* Attack flash effect */}
        {showAttack && (
          <div className="absolute inset-0 bg-red-500/30 animate-flash pointer-events-none" />
        )}

        {/* Giant skull icon */}
        <div className="relative mb-8">
          <div 
            className="w-40 h-40 rounded-full flex items-center justify-center animate-float"
            style={{
              background: 'linear-gradient(180deg, hsl(0 60% 15%), hsl(0 70% 5%))',
              border: '4px solid hsl(0 70% 40%)',
              boxShadow: '0 0 100px hsl(0 80% 50% / 0.5), inset 0 0 60px hsl(0 80% 40% / 0.3)',
            }}
          >
            <Skull className="w-24 h-24 text-red-500 drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]" />
          </div>
          
          {/* Orbiting particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-red-500"
              style={{
                animation: `orbit ${3}s linear infinite`,
                animationDelay: `${i * 0.5}s`,
                transformOrigin: '80px 0',
                top: '50%',
                left: '50%',
                boxShadow: '0 0 10px hsl(0 80% 50%)',
              }}
            />
          ))}
        </div>

        {/* System message box */}
        <div 
          className="w-full max-w-sm rounded-xl p-6 mb-6"
          style={{
            background: 'linear-gradient(180deg, hsl(0 50% 8% / 0.95), hsl(0 60% 4% / 0.95))',
            border: '2px solid hsl(0 70% 40% / 0.6)',
            boxShadow: '0 0 50px hsl(0 80% 40% / 0.3)',
          }}
        >
          <div className="text-center mb-4">
            <span className="text-sm text-red-400/80 font-bold tracking-wider">[ SYSTEM MESSAGE ]</span>
          </div>
          
          <p 
            className="text-xl font-bold text-red-500 text-center mb-2"
            style={{ textShadow: '0 0 30px hsl(0 80% 50% / 0.6)' }}
          >
            لم تكمل المهمات اليومية!
          </p>
          
          <p className="text-sm text-red-300/70 text-center">
            أنت الآن محاصر في منطقة العقاب. سيتم خصم صحتك ومستواك حتى انتهاء العقوبة.
          </p>
        </div>

        {/* Player HP bar */}
        <div className="w-full max-w-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-400">HP</span>
            </div>
            <span className="text-sm font-bold text-red-400">{playerHp}/100</span>
          </div>
          <div className="h-4 rounded-full overflow-hidden bg-black/60 border border-red-500/30">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${playerHp}%`,
                background: 'linear-gradient(90deg, hsl(0 70% 40%), hsl(0 80% 55%))',
                boxShadow: '0 0 10px hsl(0 80% 50%)',
              }}
            />
          </div>
        </div>

        {/* Timer */}
        <div 
          className="w-full max-w-sm rounded-xl p-6 text-center"
          style={{
            background: 'linear-gradient(180deg, hsl(0 50% 6%), hsl(0 60% 2%))',
            border: '2px solid hsl(0 70% 35% / 0.6)',
            boxShadow: '0 0 40px hsl(0 70% 30% / 0.3), inset 0 0 30px hsl(0 0% 0% / 0.5)',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-red-500 animate-pulse" />
            <span className="text-sm text-red-400 font-bold tracking-wider">الوقت المتبقي للعقوبة</span>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <div className="text-center">
              <div 
                className="text-5xl font-black font-mono text-red-500"
                style={{ textShadow: '0 0 40px hsl(0 80% 50% / 0.6)' }}
              >
                {String(hours).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-gray-600 mt-1">HOURS</div>
            </div>
            
            <span className="text-4xl font-bold text-red-500/50 animate-pulse">:</span>
            
            <div className="text-center">
              <div 
                className="text-5xl font-black font-mono text-red-500"
                style={{ textShadow: '0 0 40px hsl(0 80% 50% / 0.6)' }}
              >
                {String(minutes).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-gray-600 mt-1">MINS</div>
            </div>
            
            <span className="text-4xl font-bold text-red-500/50 animate-pulse">:</span>
            
            <div className="text-center">
              <div 
                className="text-5xl font-black font-mono text-red-500"
                style={{ textShadow: '0 0 40px hsl(0 80% 50% / 0.6)' }}
              >
                {String(seconds).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-gray-600 mt-1">SECS</div>
            </div>
          </div>
        </div>

        {/* Wave info */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <Swords className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400">Wave {currentWave}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">{monstersDefeated} defeated</span>
          </div>
        </div>

        {/* Exit button for demo */}
        {onExit && (
          <button
            onClick={onExit}
            className="mt-8 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
          >
            خروج (للتجربة)
          </button>
        )}
      </div>

      <style>{`
        @keyframes slide-stripes {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-slide-stripes { animation: slide-stripes 2s linear infinite; }
        .animate-slide-stripes-reverse { animation: slide-stripes 2s linear infinite reverse; }
        
        @keyframes tendril {
          0%, 100% { transform: translateY(-50%) scaleY(0.8); opacity: 0.3; }
          50% { transform: translateY(-30%) scaleY(1); opacity: 0.7; }
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-flash { animation: flash 0.3s ease-out; }
      `}</style>
    </div>
  );
};