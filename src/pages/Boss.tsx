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

  const totalLevel = gameState.totalLevel || 10;
  const playerPower = totalLevel;

  const gates = [
    { id: 'g0', rank: 'S', name: 'بوابة S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)', requiredPower: 100, timeLimit: '02:00:00', rewards: { xp: 10000, gold: 5000 }, danger: 'CATACLYSMIC' },
    { id: 'g1', rank: 'A', name: 'بوابة A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)', requiredPower: 80, timeLimit: '04:00:00', rewards: { xp: 2500, gold: 1500 }, danger: 'EXTREME PERIL' },
    { id: 'g2', rank: 'B', name: 'بوابة B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)', requiredPower: 50, timeLimit: '08:00:00', rewards: { xp: 1000, gold: 600 }, danger: 'MODERATE DANGER' },
    { id: 'g3', rank: 'C', name: 'بوابة C', color: 'blue', type: 'NORMAL GATE', energy: '12,500', warning: 'STABLE READINGS', aura: '0 0 60px rgba(59,130,246,0.4)', requiredPower: 30, timeLimit: '12:00:00', rewards: { xp: 600, gold: 400 }, danger: 'LOW DANGER' },
    { id: 'g4', rank: 'D', name: 'بوابة D', color: 'blue', type: 'NORMAL GATE', energy: '4,200', warning: 'WEAK READINGS', aura: '0 0 50px rgba(59,130,246,0.3)', requiredPower: 15, timeLimit: '24:00:00', rewards: { xp: 300, gold: 200 }, danger: 'MINIMAL DANGER' },
    { id: 'g5', rank: 'E', name: 'بوابة E', color: 'blue', type: 'NORMAL GATE', energy: '1,100', warning: 'VERY WEAK', aura: '0 0 40px rgba(59,130,246,0.2)', requiredPower: 5, timeLimit: '48:00:00', rewards: { xp: 100, gold: 50 }, danger: 'SAFE' },
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

  const getGateColor = (color) => {
    const colors = { purple: 'from-purple-500 to-purple-700', blue: 'from-blue-500 to-blue-700', red: 'from-red-500 to-red-700' };
    return colors[color] || 'from-gray-500 to-gray-700';
  };

  const getGateBorderColor = (color) => {
    const colors = { purple: 'border-purple-500/50', blue: 'border-blue-500/50', red: 'border-red-500/50' };
    return colors[color] || 'border-gray-500/50';
  };

  const getGateGlow = (color) => {
    const glows = { purple: '0 0 60px rgba(168, 85, 247, 0.6)', blue: '0 0 50px rgba(59, 130, 246, 0.5)', red: '0 0 80px rgba(239, 68, 68, 0.7)' };
    return glows[color] || '0 0 40px rgba(156, 163, 175, 0.4)';
  };

  if (isEntering) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        <div className="relative">
          <div className="w-64 h-64 rounded-full animate-spin" style={{
            background: `conic-gradient(from 0deg, transparent, ${selectedGate?.color === 'red' ? '#ef4444' : '#3b82f6'}, transparent)`,
            filter: 'blur(20px)'
          }} />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold uppercase tracking-widest animate-pulse">Entering...</div>
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
          <span className="block text-xs text-blue-400 mt-2 tracking-[0.5em] font-bold opacity-70">Gate Recognition System</span>
        </h1>
      </header>

      <main className="relative z-10 px-6 space-y-40 mt-16">
        {gates.map((gate) => {
          const isHidden = playerPower < gate.requiredPower;
          return (
            <div key={gate.id} className="relative group flex flex-col items-center max-w-sm mx-auto">
              {/* البوابة بدون رمز في المنتصف */}
              <div 
                onClick={() => handleGateClick(gate)}
                className="relative w-72 h-72 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 active:scale-90 z-20"
                style={{ filter: `drop-shadow(${gate.aura})` }}
              >
                <div className={cn(
                  "relative w-full h-full rounded-full overflow-hidden border-2",
                  gate.color === 'red' ? "border-red-600/50 group-hover:border-red-500" : "border-blue-600/50 group-hover:border-blue-500"
                )}>
                  <img src="/portal.gif" alt="Portal" className="w-full h-full object-cover scale-110 mix-blend-screen brightness-125" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent" />
                </div>
              </div>

              {/* الكارد مع نظام ???,??? */}
              <div className="relative w-full bg-black/60 border-2 border-slate-200/90 p-5 mt-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="border border-slate-400/50 px-6 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    <h2 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">
                      RANK: <span className={gate.color === 'red' ? "text-red-500" : "text-blue-400"}>
                        {isHidden ? "???,???" : gate.rank}
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <p className="text-[10px] text-slate-400 uppercase font-black">Energy Density</p>
                    </div>
                    <p className="text-base font-mono font-bold text-white italic">
                      {isHidden ? "???,???" : gate.energy} <span className="text-[9px] opacity-40">MP</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn("w-3.5 h-3.5", gate.color === 'red' ? "text-red-500" : "text-blue-400")} />
                      <p className="text-[10px] text-slate-400 uppercase font-black">Danger Level</p>
                    </div>
                    <p className={cn("text-xs font-black uppercase italic tracking-widest", gate.color === 'red' ? "text-red-500 animate-pulse" : "text-blue-400")}>
                      {isHidden ? "???,???" : gate.warning}
                    </p>
                  </div>

                  <div className="mt-2 py-2 px-3 bg-white/5 border-l-2 border-white/20 text-center">
                    <p className="text-[9px] text-slate-500 font-bold italic uppercase tracking-tighter">
                      {isHidden ? "???,??? ???,??? ???,??? ???,??? ???,???" : "Dimensional crack confirmed. Tap portal to initiate."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* المودال مع نظام ???,??? */}
      {selectedGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={cn("relative w-full max-w-md rounded-2xl border-2 overflow-hidden bg-[#0c0c0e]", getGateBorderColor(selectedGate.color))} style={{ boxShadow: getGateGlow(selectedGate.color) }}>
            <div className="relative z-10 p-6">
              <button onClick={() => { setSelectedGate(null); setShowWarning(false); }} className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white"><X className="w-4 h-4" /></button>
              
              <div className="text-center mb-6">
                <div className={cn("w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-2xl font-black mb-3 text-white bg-gradient-to-br", getGateColor(selectedGate.color))}>
                  {playerPower < selectedGate.requiredPower ? "???,???" : selectedGate.rank}
                </div>
                <h2 className="text-2xl font-bold text-white">{playerPower < selectedGate.requiredPower ? "???,???" : selectedGate.name}</h2>
                <p className="text-sm text-slate-400 uppercase tracking-widest mt-1">{playerPower < selectedGate.requiredPower ? "???,???" : selectedGate.danger}</p>
              </div>
              
              <div className="space-y-3 mb-6">
                {['كثافة الطاقة', 'الوقت المتاح'].map((label, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                    <span className="text-sm text-slate-300">{label}</span>
                    <span className="font-bold">{playerPower < selectedGate.requiredPower ? "???,???" : (idx === 0 ? selectedGate.energy : selectedGate.timeLimit)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  <span className="text-sm text-slate-300">القوة المطلوبة</span>
                  <span className={cn("font-bold", playerPower >= selectedGate.requiredPower ? "text-green-500" : "text-red-500")}>
                    {selectedGate.requiredPower} (أنت: {playerPower})
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-6 text-center">
                <h3 className="text-sm font-bold mb-2 text-purple-400 italic">المكافآت</h3>
                <div className="flex justify-around text-sm text-slate-200 font-mono">
                   <span>{playerPower < selectedGate.requiredPower ? "???,???" : `+${selectedGate.rewards.xp} XP`}</span>
                   <span>{playerPower < selectedGate.requiredPower ? "???,???" : `+${selectedGate.rewards.gold} G`}</span>
                </div>
              </div>

              <button onClick={handleEnterGate} className={cn("w-full py-4 rounded-xl font-bold text-lg transition-all text-white bg-gradient-to-r", getGateColor(selectedGate.color))}>
                <span className="flex items-center justify-center gap-2">
                  {playerPower < selectedGate.requiredPower ? <><Skull className="w-5 h-5" /> ???,??? ???,???</> : <><Activity className="w-5 h-5" /> دخول البوابة</>}
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
