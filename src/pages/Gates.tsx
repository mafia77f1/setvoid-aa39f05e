import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, Target, X, Skull, Activity, Scan, Shield, LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Gate } from '@/types/game';

const Gates = () => {
  const { gameState } = useGameState();
  const navigate = useNavigate();
  
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [showManaDetails, setShowManaDetails] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const totalLevel = gameState.totalLevel || 1;
  const playerPower = totalLevel;
  const gates = gameState.gates || [];
  const hasManaGauge = gameState.inventory?.some(item => item.id === 'mana_meter' && item.quantity > 0);

  // منطق توليد خارطة ثابتة بناءً على ID البوابة
  const generateStaticMap = (gateId: string) => {
    const seed = gateId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const path = `M 10 120 L 10 ${100 - random(seed)*20} L ${40 + random(seed+1)*30} ${80 - random(seed+2)*20} L ${80 + random(seed+3)*40} ${90} L ${130} ${50} L ${180} ${70} L ${220} ${30} L 250 20`;
    
    const mobs = [
      { x: 50 + random(seed+4)*30, y: 80 - random(seed+5)*20 },
      { x: 120 + random(seed+6)*40, y: 60 - random(seed+7)*30 },
      { x: 170 + random(seed+8)*30, y: 75 }
    ];

    return { path, mobs, boss: { x: 250, y: 20 } };
  };

  const gateMap = useMemo(() => selectedGate ? generateStaticMap(selectedGate.id) : null, [selectedGate]);

  const handleGateClick = (gate: Gate) => {
    setSelectedGate(gate);
    setShowManaDetails(false);
    setIsScanning(false);
    setIsExiting(false);
    setTimeout(() => setIsVisible(true), 50);
  };

  const handleCloseModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setSelectedGate(null);
      setIsExiting(false);
      setShowManaDetails(false);
    }, 800);
  };

  const handleScanMana = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowManaDetails(true);
    }, 8000); 
  };

  const handleEnterGate = () => {
    setIsEntering(true);
    setTimeout(() => navigate('/battle'), 3000); 
  };

  const getGateColor = (rank: string) => {
    switch (rank) {
      case 'S': return 'from-red-500 to-red-700';
      case 'A': return 'from-purple-500 to-purple-700';
      case 'B': return 'from-blue-500 to-blue-700';
      case 'C': return 'from-cyan-500 to-cyan-700';
      case 'D': return 'from-green-500 to-green-700';
      case 'E': return 'from-gray-500 to-gray-700';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  const getGateBorderColor = (rank: string) => {
    switch (rank) {
      case 'S': return 'border-red-500/50';
      case 'A': return 'border-purple-500/50';
      case 'B': return 'border-blue-500/50';
      case 'C': return 'border-cyan-500/50';
      case 'D': return 'border-green-500/50';
      case 'E': return 'border-gray-500/50';
      default: return 'border-blue-500/50';
    }
  };

  const getGateGlow = (rank: string) => {
    switch (rank) {
      case 'S': return '0 0 80px rgba(239, 68, 68, 0.7)';
      case 'A': return '0 0 80px rgba(168, 85, 247, 0.6)';
      case 'B': return '0 0 60px rgba(59, 130, 246, 0.5)';
      case 'C': return '0 0 50px rgba(6, 182, 212, 0.4)';
      case 'D': return '0 0 50px rgba(34, 197, 94, 0.4)';
      case 'E': return '0 0 40px rgba(156, 163, 175, 0.3)';
      default: return '0 0 50px rgba(59, 130, 246, 0.5)';
    }
  };

  const isGateLocked = (gate: Gate) => gate.rank === 'S' || gate.rank === 'A';
  const canSeeGateDetails = (gate: Gate) => playerPower >= gate.requiredPower * 0.5;

  if (isEntering) {
    return (
      <div className="fixed inset-0 z-[150] bg-black flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <img src="/portal.gif" alt="Portal" className="w-full h-full object-cover mix-blend-screen scale-150 animate-[spin_20s_linear_infinite]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(76,29,149,0.15),transparent_80%)]" />
      </div>

      <header className="relative z-20 pt-16 pb-12 px-6 text-center border-b border-white/5">
        <h1 className="relative text-3xl font-black italic tracking-[0.3em] uppercase">
          <span className="text-white drop-shadow-[0_0_100px_rgba(255,255,255,0.5)]">Dungeon</span>
          <span className="block text-xs text-blue-400 mt-2 tracking-[0.5em] font-bold uppercase opacity-70">Gate Recognition System</span>
        </h1>
      </header>

      <main className="relative z-10 px-6 space-y-40 mt-16">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group flex flex-col items-center max-w-sm mx-auto">
            <div 
              onClick={() => handleGateClick(gate)}
              className="relative w-72 h-72 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 active:scale-90 z-20"
              style={{ filter: `drop-shadow(${getGateGlow(gate.rank)})` }}
            >
              <div className={cn("relative w-full h-full rounded-full overflow-hidden border-2", getGateBorderColor(gate.rank))}>
                <img src="/portal.gif" alt="Portal" className="w-full h-full object-cover scale-110 mix-blend-screen brightness-125" />
              </div>
            </div>
          </div>
        ))}
      </main>

      {selectedGate && (
        <div className={cn("fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-[1000ms]", isVisible && !isExiting ? "bg-black/80 backdrop-blur-md" : "bg-transparent pointer-events-none")}>
          
          {/* طبقة الأنيمايشن المعزولة تماماً */}
          {isScanning ? (
            <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-transparent">
              <img src="/AnimationManaAnalysis.gif" alt="Scanning" className="w-80 h-80 object-contain" />
              <p className="text-blue-400 font-black tracking-[0.5em] text-sm animate-pulse mt-4">ANALYZING MANA SOURCE...</p>
            </div>
          ) : (
            <div className={cn("relative max-w-md w-full bg-[#0c0c0e] border-x border-white/40 transition-all ease-[cubic-bezier(0.2,1,0.2,1)]", isVisible && !isExiting ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0")}>
              <div className="p-6">
                <button onClick={handleCloseModal} className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white"><X className="w-4 h-4" /></button>
                
                <div className="text-center mb-6">
                  <div className={cn("w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-4xl font-black mb-3 text-white bg-gradient-to-br", getGateColor(selectedGate.rank))}>
                    {selectedGate.rank}
                  </div>
                  <h2 className="text-2xl font-bold uppercase">{selectedGate.name}</h2>
                </div>

                {showManaDetails && gateMap && (
                  <div className="p-4 rounded-lg bg-black/40 border border-white/20 animate-in fade-in zoom-in duration-500">
                    <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center gap-2">
                          <LocateFixed className="w-3 h-3 text-blue-400 animate-pulse" />
                          <span className="text-[8px] text-white font-black uppercase tracking-[0.2em]">Static Dungeon Map</span>
                       </div>
                    </div>
                    <div className="h-40 w-full bg-[#050505] rounded-sm border border-blue-500/30 relative overflow-hidden">
                       <svg className="absolute inset-0 w-full h-full opacity-60">
                          <path d={gateMap.path} stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset="0" />
                          
                          {/* الوحوش باللون الأحمر */}
                          {gateMap.mobs.map((mob, i) => (
                            <circle key={i} cx={mob.x} cy={mob.y} r="3" fill="#ef4444" className="animate-pulse" />
                          ))}

                          {/* البوس باللون البنفسجي */}
                          <circle cx={gateMap.boss.x} cy={gateMap.boss.y} r="5" fill="#a855f7" className="animate-bounce" />
                          
                          <circle cx="10" cy="120" r="3" fill="#ffffff" />
                       </svg>
                       <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <span className="text-[6px] text-red-500 flex items-center gap-1">● MONSTERS</span>
                          <span className="text-[6px] text-purple-500 flex items-center gap-1">● BOSS</span>
                       </div>
                    </div>
                  </div>
                )}

                {hasManaGauge && !showManaDetails && (
                  <button onClick={handleScanMana} className="w-full py-3 mt-6 bg-blue-500/10 border border-blue-500/40 text-blue-400 font-black text-[10px] tracking-[0.3em] uppercase rounded-lg">
                    <Scan className="w-4 h-4 inline mr-2" /> إطلاق موجات السونار
                  </button>
                )}

                {!isScanning && (
                  <button onClick={handleEnterGate} disabled={isGateLocked(selectedGate)} className={cn("w-full py-4 mt-4 rounded-xl font-black text-lg transition-all text-white", isGateLocked(selectedGate) ? "bg-slate-800 opacity-50" : "bg-gradient-to-r " + getGateColor(selectedGate.rank))}>
                    ENTER DUNGEON
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default Gates;
