import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Radio, Skull, Clock, ChevronRight, Zap, X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Gate } from '@/types/game';

const gateColors: Record<string, { color: string; glow: string; bg: string }> = {
  gray: { color: 'hsl(0 0% 60%)', glow: 'hsl(0 0% 60% / 0.4)', bg: 'from-gray-500/20' },
  green: { color: 'hsl(120 60% 45%)', glow: 'hsl(120 60% 45% / 0.4)', bg: 'from-green-500/20' },
  blue: { color: 'hsl(210 100% 60%)', glow: 'hsl(210 100% 60% / 0.5)', bg: 'from-blue-500/20' },
  purple: { color: 'hsl(270 100% 60%)', glow: 'hsl(270 100% 60% / 0.5)', bg: 'from-purple-500/20' },
  orange: { color: 'hsl(30 100% 55%)', glow: 'hsl(30 100% 55% / 0.5)', bg: 'from-orange-500/20' },
  red: { color: 'hsl(0 80% 55%)', glow: 'hsl(0 80% 55% / 0.6)', bg: 'from-red-500/20' },
};

interface GateWarningModalProps {
  gate: Gate;
  playerPower: number;
  onClose: () => void;
  onEnter: () => void;
}

const GateWarningModal = ({ gate, playerPower, onClose, onEnter }: GateWarningModalProps) => {
  const [isEntering, setIsEntering] = useState(false);
  const colors = gateColors[gate.color] || gateColors.gray;
  const isDangerous = gate.requiredPower > playerPower;

  const handleEnter = () => {
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
    }, 2000);
  };

  if (isEntering) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        {/* Portal animation */}
        <div className="relative w-72 h-72">
          <div 
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              background: `conic-gradient(from 0deg, ${colors.color}, transparent, ${colors.color})`,
              animationDuration: '1s',
            }}
          />
          <div 
            className="absolute inset-4 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.color}40, black)`,
              boxShadow: `0 0 100px ${colors.glow}, inset 0 0 60px ${colors.glow}`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span 
              className="text-4xl font-black tracking-widest animate-pulse"
              style={{ color: colors.color, textShadow: `0 0 30px ${colors.color}` }}
            >
              دخول...
            </span>
          </div>
        </div>
        
        {/* Warp lines */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 animate-warp"
            style={{
              width: '100%',
              top: `${(i + 1) * 5}%`,
              background: `linear-gradient(90deg, transparent, ${colors.color}, transparent)`,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}

        <style>{`
          @keyframes warp {
            0% { transform: scaleX(0); opacity: 0; }
            50% { transform: scaleX(1); opacity: 1; }
            100% { transform: scaleX(0); opacity: 0; }
          }
          .animate-warp { animation: warp 0.8s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      
      <div 
        className="relative w-full max-w-md rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: `linear-gradient(180deg, hsl(220 60% 8%), hsl(220 70% 3%))`,
          border: `2px solid ${colors.color}60`,
          boxShadow: `0 0 80px ${colors.glow}`,
        }}
      >
        {/* Animated border */}
        <div 
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg, transparent, ${colors.color}, transparent)` }}
        />
        
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 z-10">
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Warning header */}
        <div className="p-6 text-center border-b" style={{ borderColor: `${colors.color}30` }}>
          <div 
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 animate-pulse"
            style={{ 
              background: `linear-gradient(135deg, ${colors.color}30, ${colors.color}10)`,
              border: `3px solid ${colors.color}`,
              boxShadow: `0 0 40px ${colors.glow}`,
            }}
          >
            {isDangerous ? (
              <Skull className="w-10 h-10" style={{ color: colors.color }} />
            ) : (
              <Shield className="w-10 h-10" style={{ color: colors.color }} />
            )}
          </div>
          
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded mb-4"
            style={{ background: `${colors.color}20`, border: `1px solid ${colors.color}40` }}
          >
            <AlertTriangle className="w-4 h-4" style={{ color: colors.color }} />
            <span className="text-xs font-black tracking-widest" style={{ color: colors.color }}>
              {isDangerous ? 'تحذير خطير!' : 'تأكيد الدخول'}
            </span>
          </div>

          <h2 className="text-2xl font-black text-white mb-2">{gate.name}</h2>
          <div 
            className="text-4xl font-black tracking-widest"
            style={{ color: colors.color, textShadow: `0 0 30px ${colors.glow}` }}
          >
            RANK: {gate.rank}
          </div>
        </div>

        {/* Gate info */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
              <Zap className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
              <div className="text-xs text-gray-500 mb-1">Energy Density</div>
              <div className="text-lg font-bold text-white">{gate.energyDensity}</div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-orange-400" />
              <div className="text-xs text-gray-500 mb-1">Time Limit</div>
              <div className="text-lg font-bold text-white">24h</div>
            </div>
          </div>

          <div 
            className="p-4 rounded-xl text-center"
            style={{ background: `${colors.color}10`, border: `1px solid ${colors.color}30` }}
          >
            <div className="text-xs text-gray-400 mb-1">Required Power</div>
            <div className="flex items-center justify-center gap-4">
              <span className="text-2xl font-bold" style={{ color: colors.color }}>{gate.requiredPower}</span>
              <span className="text-gray-500">vs</span>
              <span className={cn("text-2xl font-bold", playerPower >= gate.requiredPower ? "text-green-400" : "text-red-400")}>
                {playerPower}
              </span>
            </div>
            <div className="text-xs mt-2" style={{ color: playerPower >= gate.requiredPower ? 'hsl(120 60% 50%)' : 'hsl(0 70% 55%)' }}>
              {playerPower >= gate.requiredPower ? '✓ مستوى كافٍ' : '✗ مستوى غير كافٍ'}
            </div>
          </div>

          {isDangerous && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
              <p className="text-sm text-red-400">
                <span className="font-bold">تحذير النظام:</span> هذه البوابة أقوى من مستواك الحالي. الدخول قد يكون قاتلاً!
              </p>
            </div>
          )}

          {/* Rewards */}
          <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <div className="text-xs text-yellow-400 mb-2 text-center font-bold">المكافآت</div>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">+{gate.rewards.xp}</div>
                <div className="text-[10px] text-gray-500">XP</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-500">+{gate.rewards.gold}</div>
                <div className="text-[10px] text-gray-500">Gold</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">+{gate.rewards.shadowPoints}</div>
                <div className="text-[10px] text-gray-500">Shadow</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/30 transition-all"
          >
            إلغاء
          </button>
          <button
            onClick={handleEnter}
            className="flex-1 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            style={{ 
              background: `linear-gradient(135deg, ${colors.color}, ${colors.color}80)`,
              border: `1px solid ${colors.color}60`,
            }}
          >
            <ChevronRight className="w-5 h-5" />
            دخول البوابة
          </button>
        </div>
      </div>
    </div>
  );
};

const Gates = () => {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const { playLevelUp } = useSoundEffects();
  const [radarAngle, setRadarAngle] = useState(0);
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);

  const playerPower = gameState.totalLevel || 4;

  // Radar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleGateClick = (gate: Gate) => {
    if (gate.discovered && !gate.completed) {
      setSelectedGate(gate);
    }
  };

  const handleEnterGate = () => {
    if (selectedGate) {
      navigate(`/battle?gate=${selectedGate.id}`);
    }
  };

  const discoveredGates = gameState.gates?.filter(g => g.discovered) || [];
  const undiscoveredCount = (gameState.gates?.length || 0) - discoveredGates.length;

  return (
    <div className="min-h-screen bg-[#020203] text-white pb-40 overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWExYTJlIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-20" />
      </div>

      {/* Header */}
      <header className="relative z-20 pt-12 pb-8 px-6 text-center border-b border-blue-500/20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-2">
          <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
          <span className="text-xs font-black tracking-[0.3em] text-blue-400">GATE DETECTION SYSTEM</span>
        </div>
        <h1 className="text-3xl font-black text-white mt-2">البوابات</h1>
        <p className="text-sm text-gray-500 mt-1">اكتشف البوابات وادخلها للحصول على المكافآت</p>
      </header>

      {/* Radar Section */}
      <div className="relative px-6 py-8">
        <div className="relative w-72 h-72 mx-auto">
          {/* Radar background circles */}
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="absolute rounded-full border border-blue-500/20"
              style={{
                width: `${i * 25}%`,
                height: `${i * 25}%`,
                top: `${50 - i * 12.5}%`,
                left: `${50 - i * 12.5}%`,
              }}
            />
          ))}
          
          {/* Radar sweep */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from ${radarAngle}deg, transparent 0deg, hsl(210 100% 50% / 0.3) 30deg, transparent 60deg)`,
            }}
          />
          
          {/* Center point */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_hsl(210_100%_50%)]" />
          
          {/* Gate dots */}
          {discoveredGates.map((gate, i) => {
            const angle = (i * (360 / Math.max(discoveredGates.length, 1))) * (Math.PI / 180);
            const radius = 35 + (i % 3) * 15;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            const colors = gateColors[gate.color] || gateColors.gray;
            
            return (
              <button
                key={gate.id}
                onClick={() => handleGateClick(gate)}
                className={cn(
                  "absolute w-6 h-6 rounded-full transition-all duration-300 hover:scale-150",
                  gate.completed && "opacity-40",
                  discoveredPulse === gate.id && "animate-ping"
                )}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: colors.color,
                  boxShadow: `0 0 20px ${colors.glow}`,
                }}
              />
            );
          })}

          {/* Radar info */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/60 border border-blue-500/30 whitespace-nowrap">
            <span className="text-xs text-blue-400 font-bold">
              {discoveredGates.length} بوابة مكتشفة | {undiscoveredCount} مخفية
            </span>
          </div>
        </div>

        {/* Discovery chance */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-400">
              نسبة الاكتشاف: <span className="font-bold">{discoveryChance}%</span> (القوة: {playerPower})
            </span>
          </div>
        </div>
      </div>

      {/* Gates list */}
      <div className="px-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-300 flex items-center gap-2">
          <Radio className="w-5 h-5 text-blue-400" />
          البوابات المكتشفة
        </h2>
        
        {discoveredGates.length === 0 ? (
          <div className="p-8 rounded-xl bg-black/40 border border-white/5 text-center">
            <Radio className="w-12 h-12 mx-auto text-gray-600 mb-3 animate-pulse" />
            <p className="text-gray-500">لم يتم اكتشاف أي بوابات بعد...</p>
            <p className="text-xs text-gray-600 mt-1">ارفع مستواك لزيادة فرص الاكتشاف</p>
          </div>
        ) : (
          <div className="space-y-3">
            {discoveredGates.map(gate => {
              const colors = gateColors[gate.color] || gateColors.gray;
              const isDangerous = gate.requiredPower > playerPower;
              
              return (
                <button
                  key={gate.id}
                  onClick={() => handleGateClick(gate)}
                  disabled={gate.completed}
                  className={cn(
                    "w-full p-4 rounded-xl transition-all duration-300 text-right",
                    "bg-gradient-to-r to-transparent border-2",
                    gate.completed ? "opacity-40 cursor-not-allowed" : "hover:scale-[1.02]",
                    colors.bg
                  )}
                  style={{ 
                    borderColor: `${colors.color}40`,
                    boxShadow: gate.completed ? 'none' : `0 0 30px ${colors.glow}`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                      style={{ 
                        background: `linear-gradient(135deg, ${colors.color}30, ${colors.color}10)`,
                        border: `2px solid ${colors.color}60`,
                      }}
                    >
                      <span 
                        className="text-2xl font-black"
                        style={{ color: colors.color, textShadow: `0 0 20px ${colors.glow}` }}
                      >
                        {gate.rank}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{gate.name}</span>
                        {isDangerous && !gate.completed && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40">
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            <span className="text-[10px] text-red-400 font-bold">خطر</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Energy: {gate.energyDensity}</span>
                        <span>Power: {gate.requiredPower}</span>
                      </div>
                      <div className="mt-2 text-xs" style={{ color: colors.color }}>
                        {gate.completed ? '✓ مكتملة' : gate.danger}
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Gate Warning Modal */}
      {selectedGate && (
        <GateWarningModal
          gate={selectedGate}
          playerPower={playerPower}
          onClose={() => setSelectedGate(null)}
          onEnter={handleEnterGate}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default Gates;