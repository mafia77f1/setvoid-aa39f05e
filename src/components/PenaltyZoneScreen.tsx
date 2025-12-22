import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Clock, Skull, X, Swords, Heart, Zap, AlertCircle } from 'lucide-react';

interface Monster {
  id: string;
  name: string;
  type: 'worm' | 'spider' | 'centipede';
  x: number; // موقع الوحش الأفقي
  y: number; // موقع الوحش الرأسي
  hp: number;
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
  const [isTakingDamage, setIsTakingDamage] = useState(false);

  // توليد الوحوش حول اللاعب (توزيع دائري كأنهم محاوطينك في الصحراء)
  const generateMonsters = useCallback((waveNum: number) => {
    const count = Math.min(waveNum + 3, 8);
    const types: ('worm' | 'spider' | 'centipede')[] = ['worm', 'spider', 'centipede'];
    
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 35; // البعد عن المركز
      return {
        id: `m-${waveNum}-${i}`,
        name: 'وحش الصحراء',
        type: types[Math.floor(Math.random() * types.length)],
        x: 50 + Math.cos(angle) * radius,
        y: 55 + Math.sin(angle) * radius,
        hp: 50 + waveNum * 10,
        damage: 5 + waveNum * 2,
        isAttacking: false,
      };
    });
  }, []);

  useEffect(() => {
    setMonsters(generateMonsters(wave));
  }, [wave, generateMonsters]);

  // عداد الوقت
  useEffect(() => {
    const calculateRemaining = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      return Math.max(0, Math.floor((end - now) / 1000));
    };

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

  // هجوم الوحوش التلقائي
  useEffect(() => {
    if (playerHp <= 0) {
      setIsPlayerDead(true);
      setShowDeathScreen(true);
      return;
    }

    const attackInterval = setInterval(() => {
      if (monsters.length > 0 && !isPlayerDead) {
        const targetIdx = Math.floor(Math.random() * monsters.length);
        
        setMonsters(prev => prev.map((m, i) => i === targetIdx ? { ...m, isAttacking: true } : m));
        setIsTakingDamage(true);
        
        setTimeout(() => {
          onPlayerDamage(monsters[targetIdx].damage);
          setMonsters(prev => prev.map(m => ({ ...m, isAttacking: false })));
          setIsTakingDamage(false);
        }, 600);
      }
    }, 2500);

    return () => clearInterval(attackInterval);
  }, [monsters, isPlayerDead, playerHp, onPlayerDamage]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#1a0f05] overflow-hidden font-sans">
      {/* خلفية الصحراء (تأثير الرمل والحرارة) */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pollen.png')] opacity-30 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 via-transparent to-orange-950/40" />
      </div>

      {/* الرادار التحذيري في الخلفية */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] border-[1px] border-orange-500/10 rounded-full animate-ping pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 p-4 flex items-center justify-between border-b border-orange-500/20 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-orange-500 animate-bounce" />
          <div>
            <h1 className="text-xl font-black text-orange-500 italic tracking-tighter">PENALTY QUEST</h1>
            <p className="text-[10px] text-orange-200/50 uppercase font-bold">بقاء على قيد الحياة: الموجة {wave}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-orange-400 font-mono font-bold">
            <Clock className="w-4 h-4" />
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      {/* ساحة المعركة */}
      <div className="relative flex-1 flex items-center justify-center">
        
        {/* اللاعب في المنتصف (أنت) */}
        <div className={cn(
          "relative z-30 transition-transform duration-300",
          isTakingDamage && "animate-shake scale-110"
        )}>
           <div className="w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center relative">
             <div className="absolute -inset-4 border border-blue-400/20 rounded-full animate-spin-slow" />
             <span className="text-3xl">👤</span>
             
             {/* شريط حياة اللاعب فوق رأسه */}
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24">
                <div className="h-1.5 w-full bg-black/60 rounded-full border border-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                    style={{ width: `${(playerHp/maxPlayerHp)*100}%` }}
                  />
                </div>
                <p className="text-[9px] text-center text-white mt-1 font-bold">HP {Math.floor(playerHp)}</p>
             </div>
           </div>
        </div>

        {/* الوحوش المحيطة باللاعب */}
        {monsters.map((monster) => (
          <div
            key={monster.id}
            className={cn(
              "absolute z-20 transition-all duration-700 flex flex-col items-center",
              monster.isAttacking ? "scale-125 z-40" : "opacity-80"
            )}
            style={{ 
              left: `${monster.x}%`, 
              top: `${monster.y}%`,
              transform: monster.isAttacking ? 'translate(-50%, -50%) scale(1.5)' : 'translate(-50%, -50%)'
            }}
          >
            <div className={cn(
              "text-5xl filter drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]",
              monster.isAttacking && "animate-attack-leap"
            )}>
              {monster.type === 'worm' ? '🐛' : monster.type === 'spider' ? '🕷️' : '🦂'}
            </div>
            {monster.isAttacking && (
               <Swords className="w-6 h-6 text-red-500 absolute -top-6 animate-pulse" />
            )}
          </div>
        ))}

        {/* تأثير الرمال المتحركة في الأرضية */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2a1b0c] to-transparent pointer-events-none" />
      </div>

      {/* تحذير النظام السفلي */}
      <div className="relative z-20 p-6 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-md mx-auto p-4 rounded-xl border border-orange-500/30 bg-orange-950/20 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Skull className="w-5 h-5 text-red-500" />
            <p className="text-sm font-bold text-orange-100">تحذير من النظام</p>
          </div>
          <p className="text-xs text-orange-200/60 leading-relaxed">
            لقد فشلت في إكمال المهمة اليومية. ستبقى في منطقة العقاب لمدة 4 ساعات. 
            إذا انخفضت صحتك إلى الصفر، ستواجه عواقب وخيمة.
          </p>
        </div>
      </div>

      {/* شاشة الموت */}
      {showDeathScreen && (
        <div className="absolute inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="w-full max-w-sm text-center">
            <h2 className="text-6xl font-black text-red-600 mb-2 italic tracking-tighter">DEFEAT</h2>
            <div className="h-1 w-full bg-red-600/30 mb-8" />
            
            <p className="text-gray-400 mb-8 leading-relaxed">
              لقد استنفدت كل قوتك في الصحراء... <br/> النظام سيطبق العقوبة القصوى الآن.
            </p>

            <div className="space-y-4">
              {shadowPoints >= 50 ? (
                <button
                  onClick={onRevive}
                  className="w-full py-4 bg-blue-600 text-white font-black rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" /> إحياء (50 نقطة ظل)
                </button>
              ) : (
                <button
                  onClick={onExit}
                  className="w-full py-4 bg-red-900/40 border border-red-500 text-red-500 font-black rounded-lg hover:bg-red-500 hover:text-white transition-all"
                >
                  قبول الفشل
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-5px, 5px); }
          50% { transform: translate(5px, -5px); }
          75% { transform: translate(-5px, -5px); }
        }
        @keyframes attack-leap {
          0% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.5) translateY(-20px); filter: brightness(2); }
          100% { transform: scale(1) translateY(0); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        .animate-attack-leap { animation: attack-leap 0.6s ease-in-out forwards; }
      `}</style>
    </div>
  );
};
