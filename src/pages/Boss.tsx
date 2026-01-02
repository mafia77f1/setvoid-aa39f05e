import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, Target, Clock, X, Skull, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const navigate = useNavigate();
  
  const [selectedGate, setSelectedGate] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  // قوة اللاعب الحالية
  const playerPower = gameState.totalLevel || 10;

  // البوابات مع كافة البيانات اللازمة
  const gates = [
    { id: 'g0', rank: 'S', name: 'بوابة S', color: 'red', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)', requiredPower: 100, timeLimit: '02:00:00', rewards: { xp: 10000, gold: 5000 }, danger: 'CATACLYSMIC' },
    { id: 'g1', rank: 'A', name: 'بوابة A', color: 'purple', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)', requiredPower: 60, timeLimit: '04:00:00', rewards: { xp: 2500, gold: 1500 }, danger: 'EXTREME PERIL' },
    { id: 'g3', rank: 'B', name: 'بوابة B', color: 'blue', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)', requiredPower: 35, timeLimit: '08:00:00', rewards: { xp: 1000, gold: 600 }, danger: 'MODERATE DANGER' },
  ];

  const handleGateClick = (gate) => {
    setSelectedGate(gate);
    if (gate.requiredPower > playerPower) {
      setShowWarning(true);
    }
  };

  const handleEnterGate = () => {
    setIsEntering(true);
    setTimeout(() => navigate('/battle'), 2000);
  };

  // مساعدات التصميم للمودال
  const getGateColor = (color) => {
    const colors = { purple: 'from-purple-500 to-purple-700', blue: 'from-blue-500 to-blue-700', red: 'from-red-500 to-red-700' };
    return colors[color] || 'from-gray-500 to-gray-700';
  };

  const getGateBorderColor = (color) => {
    const colors = { purple: 'border-purple-500/50', blue: 'border-blue-500/50', red: 'border-red-500/50' };
    return colors[color] || 'border-gray-500/50';
  };

  if (isEntering) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        <div className="w-64 h-64 rounded-full animate-spin border-t-4 border-blue-500" style={{ filter: 'blur(10px)' }} />
        <div className="absolute text-white font-black animate-pulse uppercase tracking-[0.2em]">Entering Gate...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-purple-500/30 pb-40">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

      <header className="relative z-20 pt-16 pb-12 text-center border-b border-white/5">
        <h1 className="text-3xl font-black italic tracking-[0.3em] uppercase">Dungeon</h1>
        <p className="text-[10px] text-blue-400 mt-2 tracking-[0.5em] font-bold uppercase opacity-70">Gate Recognition System</p>
      </header>

      <main className="relative z-10 px-6 space-y-40 mt-16">
        {gates.map((gate) => {
          const isLocked = playerPower < gate.requiredPower;
          return (
            <div key={gate.id} className="relative group flex flex-col items-center max-w-sm mx-auto">
              
              {/* Portal Circle */}
              <div 
                onClick={() => handleGateClick(gate)}
                className="relative w-72 h-72 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 z-20"
                style={{ filter: `drop-shadow(${gate.aura})` }}
              >
                <div className={cn("relative w-full h-full rounded-full overflow-hidden border-2", isLocked ? "border-slate-800" : (gate.color === 'red' ? "border-red-600/50" : "border-purple-600/50"))}>
                  <img src="/portal.gif" alt="Portal" className={cn("w-full h-full object-cover mix-blend-screen brightness-125", isLocked && "grayscale contrast-150")} />
                  {isLocked && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><span className="text-6xl font-black text-white/20">?</span></div>}
                </div>
              </div>

              {/* Main Card (Outer) */}
              <div className="relative w-full bg-black/60 border-2 border-slate-200/90 p-5 mt-10 shadow-2xl z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 border border-slate-400/50 px-6 py-1 bg-slate-900 shadow-xl">
                  <h2 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">
                    RANK: <span className={cn(isLocked ? "text-slate-500" : (gate.color === 'red' ? "text-red-500" : "text-blue-400"))}>
                      {isLocked ? "?" : gate.rank}
                    </span>
                  </h2>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <p className="text-[10px] text-slate-400 uppercase font-black">Energy Density</p>
                    </div>
                    <p className="text-base font-mono font-bold text-white italic">{isLocked ? "???" : gate.energy}</p>
                  </div>

                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn("w-3.5 h-3.5", isLocked ? "text-slate-500" : (gate.color === 'red' ? "text-red-500" : "text-blue-400"))} />
                      <p className="text-[10px] text-slate-400 uppercase font-black">Danger Level</p>
                    </div>
                    <p className={cn("text-xs font-black uppercase italic", isLocked ? "text-slate-500" : (gate.color === 'red' ? "text-red-500 animate-pulse" : "text-blue-400"))}>
                      {isLocked ? "ACCESS DENIED" : gate.warning}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Modal (The Epic Card) */}
      {selectedGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all">
          {(() => {
            const isLocked = playerPower < selectedGate.requiredPower;
            return (
              <div className={cn("relative w-full max-w-md rounded-2xl border-2 overflow-hidden bg-[#0c0c0e] shadow-[0_0_50px_rgba(0,0,0,1)]", getGateBorderColor(selectedGate.color))}>
                
                <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-b", getGateColor(selectedGate.color))} />
                
                <div className="relative z-10 p-6">
                  {/* Close button */}
                  <button onClick={() => setSelectedGate(null)} className="absolute top-2 right-2 p-2 text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                  
                  {/* Rank Header */}
                  <div className="text-center mb-6">
                    <div className={cn(
                      "w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-4xl font-black mb-3 text-white border-2",
                      isLocked ? "bg-slate-800 border-slate-700" : getGateColor(selectedGate.color)
                    )}>
                      {isLocked ? "?" : selectedGate.rank}
                    </div>
                    <h2 className="text-2xl font-bold uppercase italic">{isLocked ? "Dungeon Unknown" : selectedGate.name}</h2>
                    <p className="text-xs text-slate-500 font-bold mt-1 tracking-widest">{isLocked ? "SYSTEM ERROR: INSUFFICIENT MANA" : selectedGate.danger}</p>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-xs text-slate-400 flex items-center gap-2 font-bold"><Zap className="w-4 h-4 text-yellow-500" /> ENERGY LEVEL</span>
                      <span className="font-mono font-bold text-white">{isLocked ? "???" : selectedGate.energy}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-xs text-slate-400 flex items-center gap-2 font-bold"><Clock className="w-4 h-4 text-blue-400" /> TIME REMAINING</span>
                      <span className="font-mono font-bold text-white">{isLocked ? "??:??:??" : selectedGate.timeLimit}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-xs text-slate-400 flex items-center gap-2 font-bold"><Target className="w-4 h-4 text-green-500" /> REQUIRED POWER</span>
                      <span className={cn("font-bold", isLocked ? "text-red-500" : "text-green-500")}>{selectedGate.requiredPower}</span>
                    </div>
                  </div>
                  
                  {/* Rewards */}
                  <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 mb-6">
                    <h3 className="text-[10px] font-black mb-2 text-blue-400 uppercase italic">Expected Clear Rewards</h3>
                    <div className="flex justify-around text-xs font-bold text-slate-300">
                      <span>XP: {isLocked ? "???" : selectedGate.rewards.xp}</span>
                      <span>GOLD: {isLocked ? "???" : selectedGate.rewards.gold}</span>
                    </div>
                  </div>
                  
                  {/* Lock Warning */}
                  {isLocked && (
                    <div className="mb-4 p-4 rounded-lg bg-red-500/10 border-2 border-red-500/40 animate-pulse flex items-center gap-4 text-red-500">
                      <Skull className="w-8 h-8 shrink-0" />
                      <div className="text-[10px] font-black leading-tight uppercase">
                        Access Restricted: Your power level is too low to analyze this dimension.
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleEnterGate}
                    className={cn(
                      "w-full py-4 rounded-xl font-black italic text-lg transition-all active:scale-95 text-white shadow-2xl",
                      getGateColor(selectedGate.color)
                    )}
                  >
                    <span className="flex items-center justify-center gap-3 tracking-widest uppercase">
                      {isLocked ? <Skull className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                      {isLocked ? "Enter At Own Risk" : "Start Dungeon"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Boss;
