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

  // حساب قوة اللاعب (تأكد من وجود القيمة في الـ state)
  const totalLevel = gameState.totalLevel || 10;
  const playerPower = totalLevel;

  // جميع رتب سولو ليفلينج
  const gates = [
    { id: 'g0', rank: 'S', name: 'بوابة S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)', requiredPower: 100, timeLimit: '02:00:00', rewards: { xp: 10000, gold: 5000 }, danger: 'CATACLYSMIC' },
    { id: 'g1', rank: 'A', name: 'بوابة A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)', requiredPower: 80, timeLimit: '04:00:00', rewards: { xp: 2500, gold: 1500 }, danger: 'EXTREME PERIL' },
    { id: 'g2', rank: 'B', name: 'بوابة B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.5)', requiredPower: 50, timeLimit: '08:00:00', rewards: { xp: 1000, gold: 600 }, danger: 'MODERATE DANGER' },
    { id: 'g3', rank: 'C', name: 'بوابة C', color: 'green', type: 'NORMAL GATE', energy: '8,500', warning: 'STABLE', aura: '0 0 60px rgba(34,197,94,0.4)', requiredPower: 30, timeLimit: '12:00:00', rewards: { xp: 500, gold: 300 }, danger: 'LOW DANGER' },
    { id: 'g4', rank: 'D', name: 'بوابة D', color: 'gray', type: 'NORMAL GATE', energy: '3,200', warning: 'WEAK READINGS', aura: '0 0 50px rgba(156,163,175,0.3)', requiredPower: 15, timeLimit: '24:00:00', rewards: { xp: 200, gold: 100 }, danger: 'MINIMAL DANGER' },
    { id: 'g5', rank: 'E', name: 'بوابة E', color: 'slate', type: 'NORMAL GATE', energy: '1,100', warning: 'VERY WEAK', aura: '0 0 40px rgba(203,213,225,0.2)', requiredPower: 5, timeLimit: '48:00:00', rewards: { xp: 100, gold: 50 }, danger: 'SAFE' },
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
    const colors = {
      red: 'from-red-600 to-red-900',
      purple: 'from-purple-600 to-purple-900',
      blue: 'from-blue-600 to-blue-900',
      green: 'from-green-600 to-green-900',
      gray: 'from-gray-600 to-gray-900',
      slate: 'from-slate-600 to-slate-900',
    };
    return colors[color] || 'from-gray-500 to-gray-700';
  };

  const getGateBorderColor = (color) => {
    const colors = {
      red: 'border-red-500/50',
      purple: 'border-purple-500/50',
      blue: 'border-blue-500/50',
      green: 'border-green-500/50',
      gray: 'border-gray-500/50',
      slate: 'border-slate-500/50',
    };
    return colors[color] || 'border-gray-500/50';
  };

  if (isEntering) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        <div className="relative">
          <div className="w-64 h-64 rounded-full animate-spin" style={{
            background: `conic-gradient(from 0deg, transparent, ${selectedGate?.color === 'red' ? '#ef4444' : '#8b5cf6'}, transparent)`,
            filter: 'blur(20px)'
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-pulse">
              <div className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Entering Gate</div>
              <div className="text-sm text-primary/80 italic">DIMENSIONAL TRANSITION IN PROGRESS</div>
            </div>
          </div>
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
          <span className="text-white">Dungeon</span>
          <span className="block text-xs text-blue-400 mt-2 tracking-[0.5em] font-bold opacity-70">Gate Recognition System</span>
        </h1>
      </header>

      <main className="relative z-10 px-6 space-y-40 mt-16">
        {gates.map((gate) => {
          const isLocked = playerPower < gate.requiredPower;
          return (
            <div key={gate.id} className="relative group flex flex-col items-center max-w-sm mx-auto">
              
              <div 
                onClick={() => handleGateClick(gate)}
                className="relative w-72 h-72 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-105 active:scale-95 z-20"
                style={{ filter: `drop-shadow(${gate.aura})` }}
              >
                <div className={cn(
                  "relative w-full h-full rounded-full overflow-hidden border-2 transition-all",
                  isLocked ? "border-white/10 grayscale" : getGateBorderColor(gate.color)
                )}>
                  <img src="/portal.gif" alt="Portal" className="w-full h-full object-cover scale-110 mix-blend-screen brightness-125 transition-all group-hover:brightness-150" />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-black text-white drop-shadow-2xl">{isLocked ? "?" : gate.rank}</span>
                </div>
              </div>

              {/* الكارد السفلي مع تطبيق منطق التشفير */}
              <div className="relative w-full bg-black/60 border-2 border-slate-200/90 p-5 mt-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="border border-slate-400/50 px-6 py-1 bg-slate-900">
                    <h2 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">
                      RANK: <span className={isLocked ? "text-white/30" : (gate.color === 'red' ? "text-red-500" : "text-blue-400")}>
                        {isLocked ? "?" : gate.rank}
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
                      {isLocked ? "???,???" : gate.energy} <span className="text-[9px] opacity-40">MP</span>
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn("w-3.5 h-3.5", isLocked ? "text-white/20" : (gate.color === 'red' ? "text-red-500" : "text-blue-400"))} />
                      <p className="text-[10px] text-slate-400 uppercase font-black">Danger Level</p>
                    </div>
                    <p className={cn("text-xs font-black uppercase italic tracking-widest", isLocked ? "text-white/20" : "text-blue-400")}>
                      {isLocked ? "UNDEFINED ERROR" : gate.warning}
                    </p>
                  </div>

                  <div className="mt-2 py-2 px-3 bg-white/5 border-l-2 border-white/20">
                    <p className="text-[9px] text-slate-500 font-bold italic uppercase tracking-tighter">
                      {isLocked ? "SYSTEM STATUS: UNKNOWN. POWER LEVEL INSUFFICIENT FOR ANALYSIS." : "Dimensional crack confirmed. Tap the portal above to initiate transition."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* المودال */}
      {selectedGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className={cn("relative w-full max-w-md rounded-2xl border-2 overflow-hidden bg-[#0c0c0e]", getGateBorderColor(selectedGate.color))}>
            <div className="relative z-10 p-6">
              <button onClick={() => { setSelectedGate(null); setShowWarning(false); }} className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white"><X className="w-4 h-4" /></button>
              
              <div className="text-center mb-6">
                <div className={cn("w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-4xl font-black mb-3 text-white bg-gradient-to-br", getGateColor(selectedGate.color))}>
                  {playerPower < selectedGate.requiredPower ? "?" : selectedGate.rank}
                </div>
                <h2 className="text-2xl font-bold text-white">{playerPower < selectedGate.requiredPower ? "???" : selectedGate.name}</h2>
                <p className="text-sm text-slate-400 uppercase tracking-widest mt-1">{playerPower < selectedGate.requiredPower ? "???" : selectedGate.danger}</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="flex items-center gap-2 text-sm text-slate-300"><Zap className="w-4 h-4 text-primary" />كثافة الطاقة</span>
                  <span className="font-bold text-white">{playerPower < selectedGate.requiredPower ? "??? MP" : `${selectedGate.energy} MP`}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="flex items-center gap-2 text-sm text-slate-300"><Clock className="w-4 h-4 text-purple-400" />الوقت المتاح</span>
                  <span className="font-bold text-white">{playerPower < selectedGate.requiredPower ? "??:??:??" : selectedGate.timeLimit}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="flex items-center gap-2 text-sm text-slate-300"><Target className="w-4 h-4 text-green-500" />القوة المطلوبة</span>
                  <span className={cn("font-bold", playerPower >= selectedGate.requiredPower ? "text-green-500" : "text-red-500")}>
                    {selectedGate.requiredPower} (أنت: {playerPower})
                  </span>
                </div>
              </div>

              {playerPower < selectedGate.requiredPower && (
                <div className="mb-4 p-4 rounded-lg bg-red-500/10 border-2 border-red-500/50 animate-pulse">
                  <div className="flex items-start gap-3 text-red-500">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold mb-1 uppercase text-xs">تحذير النظام!</h4>
                      <p className="text-[10px] leading-tight opacity-80 uppercase tracking-tighter">
                        WARNING: PLAYER POWER LEVEL IS INSUFFICIENT. DATA IS OBSCURED FOR SAFETY. PROCEEDING WILL RESULT IN CERTAIN DEATH.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleEnterGate}
                className={cn("w-full py-4 rounded-xl font-bold text-lg transition-all text-white bg-gradient-to-r", getGateColor(selectedGate.color))}
              >
                <span className="flex items-center justify-center gap-2">
                  {playerPower < selectedGate.requiredPower ? <><Skull className="w-5 h-5" /> دخول مجهول</> : <><Activity className="w-5 h-5" /> دخول البوابة</>}
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
