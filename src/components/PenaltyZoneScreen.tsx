import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, Skull, X, Swords, Shield, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Monster {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  damage: number;
  isAttacking: boolean;
}

interface PenaltyZoneScreenProps {
  endTime: string;
  playerHp: number;
  maxPlayerHp: number;
  shadowPoints: number;
  onTimeComplete: () => void;
  onPlayerDamage: (damage: number) => void;
  onRevive: () => void;
  onExit?: () => void;
}

export const PenaltyZoneScreen = ({ 
  endTime, 
  playerHp,
  maxPlayerHp,
  shadowPoints,
  onTimeComplete, 
  onPlayerDamage,
  onRevive,
  onExit 
}: PenaltyZoneScreenProps) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [wave, setWave] = useState(1);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [isPlayerDead, setIsPlayerDead] = useState(false);
  const [showDeathScreen, setShowDeathScreen] = useState(false);
  const [attackAnimation, setAttackAnimation] = useState(false);
  const [damageNumber, setDamageNumber] = useState<{ value: number; id: number } | null>(null);

  // Generate monsters for current wave
  const generateMonsters = useCallback((waveNum: number) => {
    const count = Math.min(waveNum + 1, 5);
    const baseDamage = 5 + waveNum * 2;
    const baseHp = 30 + waveNum * 10;
    
    return Array.from({ length: count }, (_, i) => ({
      id: `monster-${waveNum}-${i}`,
      name: waveNum >= 8 ? 'وحش الظلام' : waveNum >= 5 ? 'شبح العقاب' : 'ظل الفشل',
      hp: baseHp + Math.random() * 20,
      maxHp: baseHp + 20,
      damage: baseDamage + Math.floor(Math.random() * 5),
      isAttacking: false,
    }));
  }, []);

  // Initialize monsters
  useEffect(() => {
    setMonsters(generateMonsters(wave));
  }, [wave, generateMonsters]);

  // Timer countdown
  useEffect(() => {
    const calculateRemaining = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));
      return remaining;
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

  // Monster attacks player periodically
  useEffect(() => {
    if (isPlayerDead || playerHp <= 0) {
      setIsPlayerDead(true);
      setShowDeathScreen(true);
      return;
    }

    const attackInterval = setInterval(() => {
      if (monsters.length > 0 && !isPlayerDead) {
        const attackingMonster = monsters[Math.floor(Math.random() * monsters.length)];
        
        setMonsters(prev => prev.map(m => 
          m.id === attackingMonster.id ? { ...m, isAttacking: true } : m
        ));
        
        setAttackAnimation(true);
        
        setTimeout(() => {
          const damage = attackingMonster.damage;
          onPlayerDamage(damage);
          setDamageNumber({ value: damage, id: Date.now() });
          
          setMonsters(prev => prev.map(m => 
            m.id === attackingMonster.id ? { ...m, isAttacking: false } : m
          ));
          setAttackAnimation(false);
          
          setTimeout(() => setDamageNumber(null), 1000);
        }, 500);
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(attackInterval);
  }, [monsters, isPlayerDead, onPlayerDamage, playerHp]);

  // Progress waves over time
  useEffect(() => {
    const waveInterval = setInterval(() => {
      if (!isPlayerDead && wave < 10) {
        setWave(prev => prev + 1);
      }
    }, 30000); // New wave every 30 seconds

    return () => clearInterval(waveInterval);
  }, [isPlayerDead, wave]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const handleRevive = () => {
    if (shadowPoints >= 50) {
      onRevive();
      setIsPlayerDead(false);
      setShowDeathScreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden">
      {/* Animated dark background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, hsl(0 60% 8%) 0%, hsl(0 80% 3%) 100%),
            repeating-linear-gradient(0deg, transparent 0px, hsl(0 100% 50% / 0.03) 1px, transparent 2px),
            repeating-linear-gradient(90deg, transparent 0px, hsl(0 100% 50% / 0.03) 1px, transparent 2px)
          `
        }}
      />
      
      {/* Pulsing red overlay */}
      <div className={cn(
        "absolute inset-0 bg-red-900/20",
        attackAnimation && "animate-pulse"
      )} />
      
      {/* Warning stripes */}
      <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
        <div 
          className="h-full w-[200%]"
          style={{
            background: 'repeating-linear-gradient(90deg, hsl(0 70% 40% / 0.8) 0px, hsl(0 70% 40% / 0.8) 30px, hsl(0 70% 20% / 0.8) 30px, hsl(0 70% 20% / 0.8) 60px)',
            animation: 'slideStripes 2s linear infinite'
          }}
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
        <div 
          className="h-full w-[200%]"
          style={{
            background: 'repeating-linear-gradient(90deg, hsl(0 70% 40% / 0.8) 0px, hsl(0 70% 40% / 0.8) 30px, hsl(0 70% 20% / 0.8) 30px, hsl(0 70% 20% / 0.8) 60px)',
            animation: 'slideStripes 2s linear infinite reverse'
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between border-b border-red-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center animate-pulse">
            <Skull className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-red-400 tracking-wider">PENALTY ZONE</h1>
            <p className="text-xs text-red-300/60">منطقة العقاب - موجة {wave}</p>
          </div>
        </div>
        
        {onExit && (
          <button 
            onClick={onExit}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-red-300" />
          </button>
        )}
      </div>

      {/* Timer */}
      <div className="relative z-10 p-4">
        <div 
          className="rounded-xl border-2 border-red-500/40 p-4 text-center"
          style={{
            background: 'linear-gradient(180deg, hsl(0 50% 8%), hsl(0 60% 4%))',
            boxShadow: '0 0 40px hsl(0 70% 40% / 0.3), inset 0 0 30px hsl(0 0% 0% / 0.5)'
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-sm text-red-300">الوقت المتبقي</span>
          </div>
          <div 
            className="text-4xl font-bold font-mono text-red-400"
            style={{ textShadow: '0 0 40px hsl(0 70% 50% / 0.6)' }}
          >
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Player HP */}
      <div className="relative z-10 px-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-red-500/20">
          <Heart className="w-6 h-6 text-red-500" />
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-red-300">صحتك</span>
              <span className="text-red-400 font-bold">{Math.max(0, Math.floor(playerHp))}/{maxPlayerHp}</span>
            </div>
            <div className="h-3 rounded-full bg-black/50 overflow-hidden border border-red-500/30">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.max(0, (playerHp / maxPlayerHp) * 100)}%`,
                  background: playerHp < 30 
                    ? 'linear-gradient(90deg, hsl(0 80% 50%), hsl(0 80% 40%))'
                    : 'linear-gradient(90deg, hsl(0 70% 50%), hsl(0 70% 40%))'
                }}
              />
            </div>
          </div>
          {damageNumber && (
            <div 
              key={damageNumber.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 text-2xl font-bold text-red-500 animate-fade-out"
              style={{ textShadow: '0 0 10px hsl(0 100% 50%)' }}
            >
              -{damageNumber.value}
            </div>
          )}
        </div>
      </div>

      {/* Monsters Area */}
      <div className="relative z-10 flex-1 p-4 overflow-hidden">
        <div className="grid grid-cols-3 gap-3 max-h-full">
          {monsters.map((monster, index) => (
            <div
              key={monster.id}
              className={cn(
                "relative p-3 rounded-xl border transition-all",
                monster.isAttacking 
                  ? "bg-red-600/30 border-red-500 scale-110" 
                  : "bg-red-900/20 border-red-500/30",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl text-center mb-2">
                {wave >= 8 ? '👹' : wave >= 5 ? '👻' : '💀'}
              </div>
              <p className="text-[10px] text-red-300 text-center truncate">{monster.name}</p>
              {monster.isAttacking && (
                <div className="absolute -top-2 -right-2">
                  <Swords className="w-5 h-5 text-red-500 animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Warning text */}
      <div className="relative z-10 p-4">
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
          <p className="text-xs text-red-300">
            ⚠️ الوحوش تهاجم تلقائياً - لا يمكنك الهروب!
          </p>
          <p className="text-[10px] text-red-400/60 mt-1">
            البقاء على قيد الحياة حتى نهاية العقوبة هو هدفك الوحيد
          </p>
        </div>
      </div>

      {/* Death Screen */}
      {showDeathScreen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
          <div className="max-w-sm w-full mx-4 p-8 rounded-2xl bg-gradient-to-b from-red-950 to-black border-2 border-red-500/50 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
              <Skull className="w-14 h-14 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-red-500 mb-2">YOU DIED</h2>
            <p className="text-red-300/70 mb-6">لقد سقطت في منطقة العقاب...</p>
            
            <div className="p-4 rounded-xl bg-black/50 border border-red-500/30 mb-6">
              <p className="text-sm text-red-300 mb-2">العقوبة:</p>
              <ul className="text-xs text-red-400/80 space-y-1 text-right">
                <li>• خسارة 20% من إجمالي XP</li>
                <li>• خسارة 50% من الذهب</li>
                <li>• تراجع مستوى واحد</li>
              </ul>
            </div>

            {shadowPoints >= 50 ? (
              <button
                onClick={handleRevive}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 border border-purple-400/50 text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                إحياء بـ 50 نقطة ظل
              </button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">
                  تحتاج 50 نقطة ظل للإحياء (لديك {shadowPoints})
                </p>
                <button
                  onClick={onExit}
                  className="w-full py-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/30 transition-all"
                >
                  قبول العقوبة
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideStripes {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes fade-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-30px); }
        }
        .animate-fade-out {
          animation: fade-out 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
