import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, Target, X, Skull, Activity, Scan, Shield, Map as MapIcon, LocateFixed } from 'lucide-react';
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

  // منطق إنشاء خريطة ثابتة لكل بوابة بناءً على الـ ID الخاص بها
  const staticMapData = useMemo(() => {
    if (!selectedGate) return null;
    const seed = selectedGate.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pseudoRandom = (s: number) => Math.abs(Math.sin(s) * 10000) % 1;

    return {
      path: `M 10 110 Q ${40 + pseudoRandom(seed) * 50} ${20 + pseudoRandom(seed + 1) * 80}, ${120 + pseudoRandom(seed + 2) * 40} ${60} T 240 30`,
      mobs: [
        { x: 50 + pseudoRandom(seed + 3) * 40, y: 40 + pseudoRandom(seed + 4) * 40 },
        { x: 150 + pseudoRandom(seed + 5) * 40, y: 30 + pseudoRandom(seed + 6) * 50 }
      ],
      boss: { x: 240, y: 30 }
    };
  }, [selectedGate]);

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
    setTimeout(() => {
      navigate('/battle');
    }, 3000); 
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
    <div className="min-h-screen bg-[#020203] text-white font-sans pb-40 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(76,29,149,0.15),transparent_80%)]" />
      </div>

      <header className="relative z-20 pt-16 pb-12 px-6 text-center border-b border-white/5">
        <h1 className="relative text-3xl font-black italic tracking-[0.3em] uppercase">
          <span className="text-white">Dungeon</span>
          <span className="block text-xs text-blue-400 mt-2 tracking-[0.5em] font-bold uppercase opacity-70">Gate Recognition System</span>
        </h1>
      </header>

      <main className="relative z-10 px-6 space-y-40 mt-16">
        {gates.map((gate) => (
          <div key={gate.id} className="relative flex flex-col items-center max-w-sm mx-auto">
            <div 
              onClick={() => handleGateClick(gate)}
              className="relative w-72 h-72 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-90 z-20"
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
        <div className={cn("fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]", isVisible && !isExiting ? "bg-black/60" : "bg-black/0 pointer-events-none")}>
          
          {/* الأنيمايشن المعزول تماماً مع خلفية شفافة */}
          {isScanning ? (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-transparent z-[110]">
              <img src="/AnimationManaAnalysis.gif" alt="Mana Scan" className="w-80 h-80 object-contain" />
              <p className="text-blue-400 font-black tracking-[0.5em] text-xs animate-pulse">ANALYZING FREQUENCY...</p>
            </div>
          ) : (
            <div className={cn("relative max-w-md w-full bg-[#0c0c0e] border-x border-white/40 shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all ease-[cubic-bezier(0.2,1,0.2,1)]", isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1500ms]" : "opacity-0 scale-y-0")}>
              <div className="p-6 transition-all duration-1000">
                <button onClick={handleCloseModal} className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white"><X className="w-4 h-4" /></button>
                
                <div className="text-center mb-6">
                  <div className={cn("w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-4xl font-black mb-3 text-white bg-gradient-to-br", getGateColor(selectedGate.rank))}>
                    {!canSeeGateDetails(selectedGate) ? "?" : selectedGate.rank}
                  </div>
                  <h2 className="text-2xl font-bold text-white uppercase">{!canSeeGateDetails(selectedGate) ? "??" : selectedGate.name}</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {showManaDetails && staticMapData ? (
                    <div className="p-4 rounded-lg bg-black/40 border border-white/20 animate-in fade-in zoom-in duration-700">
                         <div className="grid grid-cols-2 gap-4 mb-4 border-b border-white/10 pb-4">
                            <div className="space-y-1">
                               <p className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Mana Signature</p>
                               <p className="text-[11px] text-white font-mono font-bold">{selectedGate.energyDensity.toLocaleString()}</p>
                            </div>
                         </div>
                         
                         {/* الخارطة الثابتة لكل بوابة */}
                         <div className="mt-2">
                            <div className="flex items-center gap-2 mb-2 text-blue-400">
                               <LocateFixed className="w-3 h-3 animate-pulse" />
                               <span className="text-[8px] font-black uppercase tracking-[0.2em]">Static Labyrinth Map</span>
                            </div>
                            <div className="h-32 w-full bg-[#050505] rounded-sm border border-blue-500/30 relative overflow-hidden">
                               <svg className="absolute inset-0 w-full h-full opacity-60">
                                  <path d={staticMapData.path} stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1.5" fill="none" />
                                  {/* الوحوش باللون الأحمر */}
                                  {staticMapData.mobs.map((mob, i) => (
                                    <circle key={i} cx={mob.x} cy={mob.y} r="3" fill="#ef4444" className="animate-pulse" />
                                  ))}
                                  {/* البوس باللون البنفسجي */}
                                  <circle cx={staticMapData.boss.x} cy={staticMapData.boss.y} r="4" fill="#a855f7" />
                                  <circle cx="10" cy="110" r="2.5" fill="#ffffff" />
                               </svg>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-sm text-slate-300">كثافة الطاقة</span>
                        <span className="font-bold">{selectedGate.energyDensity} MP</span>
                      </div>
                    )}
                </div>
                
                {hasManaGauge && !showManaDetails && (
                  <button onClick={handleScanMana} className="w-full py-3 mb-4 bg-blue-500/10 border border-blue-500/40 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-lg">
                    <Scan className="w-4 h-4 inline mr-2" /> إطلاق موجات السونار
                  </button>
                )}
                
                <button onClick={handleEnterGate} disabled={isGateLocked(selectedGate)} className={cn("w-full py-4 rounded-xl font-black text-lg transition-all text-white", isGateLocked(selectedGate) ? "bg-slate-800 opacity-50" : "bg-gradient-to-r " + getGateColor(selectedGate.rank))}>
                  ENTER DUNGEON
                </button>
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
