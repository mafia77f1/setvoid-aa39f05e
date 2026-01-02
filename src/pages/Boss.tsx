import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, Target, Clock, X, Shield, Radio, Skull, ChevronRight, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const navigate = useNavigate();
  const [radarAngle, setRadarAngle] = useState(0);
  const [discoveredGates, setDiscoveredGates] = useState<string[]>(['gate_e']);
  const [selectedGate, setSelectedGate] = useState<typeof gates[0] | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  const totalLevel = gameState.totalLevel || ((gameState.levels?.strength || 1) + (gameState.levels?.mind || 1) + (gameState.levels?.spirit || 1) + (gameState.levels?.agility || 1));
  const playerPower = totalLevel;

  const gates = [
    { id: 'gate_e', rank: 'E', name: 'بوابة E', color: 'gray', energy: '1,200', danger: 'MINIMAL THREAT', requiredPower: 5, timeLimit: '24:00:00', rewards: { xp: 100, gold: 50 }, aura: '0 0 30px rgba(156,163,175,0.4)' },
    { id: 'gate_d', rank: 'D', name: 'بوابة D', color: 'green', energy: '5,400', danger: 'LOW THREAT', requiredPower: 10, timeLimit: '18:00:00', rewards: { xp: 250, gold: 150 }, aura: '0 0 40px rgba(34,197,94,0.5)' },
    { id: 'gate_c', rank: 'C', name: 'بوابة C', color: 'blue', energy: '12,000', danger: 'MODERATE DANGER', requiredPower: 20, timeLimit: '12:00:00', rewards: { xp: 500, gold: 300 }, aura: '0 0 50px rgba(59,130,246,0.5)' },
    { id: 'gate_b', rank: 'B', name: 'بوابة B', color: 'purple', energy: '28,000', danger: 'HIGH DANGER', requiredPower: 35, timeLimit: '08:00:00', rewards: { xp: 1000, gold: 600 }, aura: '0 0 60px rgba(168,85,247,0.6)' },
    { id: 'gate_a', rank: 'A', name: 'بوابة A', color: 'orange', energy: '65,000', danger: 'EXTREME PERIL', requiredPower: 60, timeLimit: '04:00:00', rewards: { xp: 2500, gold: 1500 }, aura: '0 0 70px rgba(251,146,60,0.6)' },
    { id: 'gate_s', rank: 'S', name: 'بوابة S', color: 'red', energy: 'UNMEASURABLE', danger: 'CATACLYSMIC', requiredPower: 100, timeLimit: '02:00:00', rewards: { xp: 10000, gold: 5000 }, aura: '0 0 80px rgba(220,38,38,0.7)' },
  ];

  // Radar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Discover gates based on power level
  useEffect(() => {
    const discoverable = gates.filter(g => {
      const discoveryChance = Math.min(100, (playerPower / g.requiredPower) * 50);
      return Math.random() * 100 < discoveryChance || g.requiredPower <= playerPower;
    });
    setDiscoveredGates(prev => [...new Set([...prev, ...discoverable.map(g => g.id)])]);
  }, [playerPower]);

  const handleGateClick = (gate: typeof gates[0]) => {
    setSelectedGate(gate);
    if (gate.requiredPower > playerPower) {
      setShowWarning(true);
    }
  };

  const handleEnterGate = () => {
    setIsEntering(true);
    setTimeout(() => {
      navigate('/battle');
    }, 2000);
  };

  const getGateColor = (color: string) => {
    const colors: Record<string, string> = {
      gray: 'from-gray-500 to-gray-700',
      green: 'from-green-500 to-green-700',
      blue: 'from-blue-500 to-blue-700',
      purple: 'from-purple-500 to-purple-700',
      orange: 'from-orange-500 to-orange-700',
      red: 'from-red-500 to-red-700',
    };
    return colors[color] || colors.gray;
  };

  const getGateBorderColor = (color: string) => {
    const colors: Record<string, string> = {
      gray: 'border-gray-500/50',
      green: 'border-green-500/50',
      blue: 'border-blue-500/50',
      purple: 'border-purple-500/50',
      orange: 'border-orange-500/50',
      red: 'border-red-500/50',
    };
    return colors[color] || colors.gray;
  };

  const getGateGlow = (color: string) => {
    const glows: Record<string, string> = {
      gray: '0 0 40px rgba(156, 163, 175, 0.4)',
      green: '0 0 40px rgba(34, 197, 94, 0.5)',
      blue: '0 0 50px rgba(59, 130, 246, 0.5)',
      purple: '0 0 60px rgba(168, 85, 247, 0.6)',
      orange: '0 0 70px rgba(249, 115, 22, 0.6)',
      red: '0 0 80px rgba(239, 68, 68, 0.7)',
    };
    return glows[color] || glows.gray;
  };

  // Entry animation overlay
  if (isEntering) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="relative">
          {/* Portal effect */}
          <div className="w-64 h-64 rounded-full animate-spin" style={{
            background: `conic-gradient(from 0deg, transparent, ${selectedGate?.color === 'red' ? '#ef4444' : '#8b5cf6'}, transparent)`,
            filter: 'blur(20px)'
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-pulse">
              <div className="text-2xl font-bold text-white mb-2">جاري الدخول...</div>
              <div className="text-sm text-primary/80">ENTERING DIMENSIONAL GATE</div>
            </div>
          </div>
          {/* Particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')" }} />
      </div>

      {/* Header */}
      <header className="relative z-20 pt-12 pb-8 px-6 text-center border-b border-border/30">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Radio className="w-5 h-5 text-primary animate-pulse" />
          <h1 className="text-2xl font-black tracking-[0.2em] uppercase text-primary glow-text">
            البوابات
          </h1>
          <Radio className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">
          Gate Recognition System
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/30">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold">قوتك: {playerPower}</span>
        </div>
      </header>

      {/* Radar Section */}
      <div className="relative z-10 px-6 py-8">
        <div className="relative w-64 h-64 mx-auto">
          {/* Radar background */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 bg-black/50" />
          
          {/* Radar circles */}
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute rounded-full border border-primary/20"
              style={{
                inset: `${ring * 20}%`,
              }}
            />
          ))}
          
          {/* Radar cross */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-primary/20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-px bg-primary/20" />
          </div>
          
          {/* Radar sweep */}
          <div
            className="absolute inset-0 origin-center"
            style={{ transform: `rotate(${radarAngle}deg)` }}
          >
            <div
              className="absolute top-1/2 left-1/2 w-1/2 h-1"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, transparent 100%)',
                transformOrigin: 'left center',
                boxShadow: '0 0 20px hsl(var(--primary))',
              }}
            />
          </div>
          
          {/* Gate dots on radar */}
          {gates.map((gate, index) => {
            const isDiscovered = discoveredGates.includes(gate.id);
            const angle = (index / gates.length) * 360;
            const distance = 30 + (index * 8);
            const x = 50 + Math.cos((angle * Math.PI) / 180) * distance;
            const y = 50 + Math.sin((angle * Math.PI) / 180) * distance;
            
            if (!isDiscovered) return null;
            
            return (
              <button
                key={gate.id}
                onClick={() => handleGateClick(gate)}
                className={cn(
                  "absolute w-4 h-4 rounded-full transition-all duration-300 hover:scale-150 cursor-pointer z-10",
                  selectedGate?.id === gate.id && "ring-2 ring-white scale-150"
                )}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: `linear-gradient(135deg, ${gate.color === 'gray' ? '#9ca3af' : gate.color}, transparent)`,
                  boxShadow: getGateGlow(gate.color),
                }}
              >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap">
                  {gate.rank}
                </span>
              </button>
            );
          })}
          
          {/* Center player dot */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary animate-pulse" 
               style={{ boxShadow: '0 0 20px hsl(var(--secondary))' }} />
        </div>
        
        {/* Discovery info */}
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            البوابات المكتشفة: <span className="text-primary font-bold">{discoveredGates.length}</span> / {gates.length}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            زد قوتك لاكتشاف المزيد من البوابات
          </p>
        </div>
      </div>

      {/* Gates List */}
      <div className="relative z-10 px-4 space-y-4">
        <h2 className="text-lg font-bold text-center mb-4 tracking-wider">البوابات المكتشفة</h2>
        
        {gates.filter(g => discoveredGates.includes(g.id)).map((gate) => {
          const canEnter = playerPower >= gate.requiredPower;
          const powerDiff = gate.requiredPower - playerPower;
          
          return (
            <button
              key={gate.id}
              onClick={() => handleGateClick(gate)}
              className={cn(
                "w-full relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300",
                getGateBorderColor(gate.color),
                selectedGate?.id === gate.id ? "scale-[1.02]" : "hover:scale-[1.01]",
                !canEnter && "opacity-70"
              )}
              style={{ boxShadow: getGateGlow(gate.color) }}
            >
              {/* Background gradient */}
              <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-r", getGateColor(gate.color))} />
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-4">
                {/* Rank Badge */}
                <div className={cn(
                  "w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-black bg-gradient-to-br",
                  getGateColor(gate.color)
                )}>
                  {gate.rank}
                </div>
                
                {/* Info */}
                <div className="flex-1 text-right">
                  <h3 className="font-bold text-lg">{gate.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {gate.energy} MP
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {gate.timeLimit}
                    </span>
                  </div>
                  {!canEnter && (
                    <div className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <Skull className="w-3 h-3" />
                      تحتاج +{powerDiff} قوة للدخول الآمن
                    </div>
                  )}
                </div>
                
                {/* Arrow */}
                <ChevronRight className="w-6 h-6 text-muted-foreground" />
              </div>
              
              {/* Danger indicator */}
              <div className={cn(
                "absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                gate.color === 'red' ? "bg-red-500/30 text-red-400" : "bg-primary/20 text-primary"
              )}>
                {gate.danger}
              </div>
            </button>
          );
        })}
      </div>

      {/* Gate Detail Modal */}
      {selectedGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={cn(
            "relative w-full max-w-md rounded-2xl border-2 overflow-hidden",
            getGateBorderColor(selectedGate.color)
          )} style={{ boxShadow: getGateGlow(selectedGate.color) }}>
            {/* Background */}
            <div className={cn("absolute inset-0 opacity-30 bg-gradient-to-b", getGateColor(selectedGate.color))} />
            <div className="absolute inset-0 bg-background/90" />
            
            {/* Content */}
            <div className="relative z-10 p-6">
              {/* Close button */}
              <button
                onClick={() => { setSelectedGate(null); setShowWarning(false); }}
                className="absolute top-4 left-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Header */}
              <div className="text-center mb-6">
                <div className={cn(
                  "w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-4xl font-black mb-3 bg-gradient-to-br",
                  getGateColor(selectedGate.color)
                )} style={{ boxShadow: getGateGlow(selectedGate.color) }}>
                  {selectedGate.rank}
                </div>
                <h2 className="text-2xl font-bold">{selectedGate.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedGate.danger}</p>
              </div>
              
              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-primary" />
                    كثافة الطاقة
                  </span>
                  <span className="font-bold">{selectedGate.energy} MP</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-secondary" />
                    الوقت المتاح
                  </span>
                  <span className="font-bold">{selectedGate.timeLimit}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-green-500" />
                    القوة المطلوبة
                  </span>
                  <span className={cn(
                    "font-bold",
                    playerPower >= selectedGate.requiredPower ? "text-green-500" : "text-destructive"
                  )}>
                    {selectedGate.requiredPower} (أنت: {playerPower})
                  </span>
                </div>
              </div>
              
              {/* Rewards */}
              <div className="p-3 rounded-lg bg-secondary/20 border border-secondary/30 mb-6">
                <h3 className="text-sm font-bold mb-2 text-secondary">المكافآت</h3>
                <div className="flex justify-around text-sm">
                  <span>+{selectedGate.rewards.xp} XP</span>
                  <span>+{selectedGate.rewards.gold} ذهب</span>
                </div>
              </div>
              
              {/* Warning for dangerous gates */}
              {showWarning && playerPower < selectedGate.requiredPower && (
                <div className="mb-4 p-4 rounded-lg bg-destructive/20 border-2 border-destructive/50 animate-pulse">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-destructive mb-1">تحذير النظام!</h4>
                      <p className="text-sm text-destructive/80">
                        قوتك الحالية ({playerPower}) أقل من المطلوب ({selectedGate.requiredPower}). الدخول قد يؤدي إلى خسارة كبيرة في HP!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Enter Button */}
              <button
                onClick={handleEnterGate}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-lg transition-all duration-300",
                  "bg-gradient-to-r hover:scale-[1.02] active:scale-[0.98]",
                  getGateColor(selectedGate.color),
                  playerPower < selectedGate.requiredPower && "opacity-80"
                )}
                style={{ boxShadow: getGateGlow(selectedGate.color) }}
              >
                <span className="flex items-center justify-center gap-2">
                  {playerPower < selectedGate.requiredPower ? (
                    <>
                      <Skull className="w-5 h-5" />
                      دخول على مسؤوليتك
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5" />
                      دخول البوابة
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Boss;
