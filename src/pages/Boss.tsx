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

  // حساب قوة اللاعب
  const playerPower = gameState.totalLevel || 10;

  const gates = [
    { id: 'g0', rank: 'S', name: 'بوابة S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)', requiredPower: 100, timeLimit: '02:00:00', rewards: { xp: 10000, gold: 5000 }, danger: 'CATACLYSMIC' },
    { id: 'g1', rank: 'A', name: 'بوابة A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)', requiredPower: 60, timeLimit: '04:00:00', rewards: { xp: 2500, gold: 1500 }, danger: 'EXTREME PERIL' },
    { id: 'g3', rank: 'B', name: 'بوابة B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)', requiredPower: 35, timeLimit: '08:00:00', rewards: { xp: 1000, gold: 600 }, danger: 'MODERATE DANGER' },
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
          <div className="w-64 h-64 rounded-full animate-spin" style={{ background: `conic-gradient(from 0deg, transparent, ${selectedGate?.color === 'red' ? '#ef4444' : '#8b5cf6'}, transparent)`, filter: 'blur(20px)' }} />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="animate-pulse font-bold text-white">جاري الدخول...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-purple-500/30 pb-40">
      <header className="relative z-20 pt-16 pb-12 text-center border-b border-white/5">
        <h1 className="text-3xl font-black italic tracking-[0.3em] uppercase">Dungeon</h1>
      </header>

      <main className="relative z-10 px-6 space-y-40 mt-16">
        {gates.map((gate) => {
          const isLocked = playerPower < gate.requiredPower;
          return (
            <div key={gate.id} className="relative group flex flex-col items-center max-w-sm mx-auto">
              <div onClick={() => handleGateClick(gate)} className="relative w-72 h-72 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 z-20" style={{ filter: `drop-shadow(${gate.aura})` }}>
                <div className={cn("relative w-full h-full rounded-full overflow-hidden border-2", gate.color === 'red' ? "border-red-600/50" : "border-purple-600/50")}>
                  <img src="/portal.gif" alt="Portal" className={cn("w-full h-full object-cover mix-blend-screen brightness-125", isLocked && "grayscale contrast-200")} />
                </div>
              </div>

              {/* كارد المعلومات الخارجي */}
              <div className="relative w-full bg-black/60 border-2 border-slate-200/90 p-5 mt-10 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 border border-slate-400/50 px-6 py-1 bg-slate-900 uppercase text-[10px] font-black">
                  RANK: <span className={gate.color === 'red' ? "text-red-500" : "text-blue-400"}>{gate.rank}</span>
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-yellow-400" /><p className="text-[10px] text-slate-400 uppercase font-black">Energy Density</p></div>
                    <p className="font-mono font-bold text-white italic">{isLocked ? "???" : gate.energy}</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2"><AlertTriangle className={cn("w-3.5 h-3.5", gate.color === 'red' ? "text-red-500" : "text-blue-400")} /><p className="text-[10px] text-slate-400 uppercase font-black">Danger Level</p></div>
                    <p className={cn("text-xs font-black uppercase italic", gate.color === 'red' ? "text-red-500" : "text-blue-400")}>{isLocked ? "ANALYSIS FAILED" : gate.warning}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* مودال المعلومات */}
      {selectedGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          {(() => {
            const isLocked = playerPower < selectedGate.requiredPower;
            return (
              <div className={cn("relative w-full max-w-md rounded-2xl border-2 overflow-hidden bg-[#0c0c0e] p-6", getGateBorderColor(selectedGate.color))} style={{ boxShadow: getGateGlow(selectedGate.color) }}>
                <button onClick={() => setSelectedGate(null)} className="absolute top-4 left-4 p-2 rounded-full bg-white/10"><X className="w-4 h-4" /></button>
                <div className="text-center mb-6 pt-4">
                  <div className={cn("w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-4xl font-black mb-3 text-white", getGateColor(selectedGate.color))}>{selectedGate.rank}</div>
                  <h2 className="text-2xl font-bold">{isLocked ? "مجهول" : selectedGate.name}</h2>
                  <p className="text-sm text-slate-400 uppercase mt-1">{isLocked ? "???" : selectedGate.danger}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-sm text-slate-300 flex gap-2"><Zap className="w-4 h-4 text-primary" /> كثافة الطاقة</span>
                    <span className="font-bold text-white">{isLocked ? "???" : selectedGate.energy}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-sm text-slate-300 flex gap-2"><Clock className="w-4 h-4 text-purple-400" /> الوقت المتاح</span>
                    <span className="font-bold text-white">{isLocked ? "??:??:??" : selectedGate.timeLimit}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-sm text-slate-300 flex gap-2"><Target className="w-4 h-4 text-green-500" /> القوة المطلوبة</span>
                    <span className={cn("font-bold", isLocked ? "text-red-500" : "text-green-500")}>{selectedGate.requiredPower}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-6">
                  <h3 className="text-sm font-bold mb-2 text-purple-400">المكافآت المتوقعة</h3>
                  <div className="flex justify-around text-sm">
                    <span>{isLocked ? "???" : `+${selectedGate.rewards.xp}`} XP</span>
                    <span>{isLocked ? "???" : `+${selectedGate.rewards.gold}`} ذهب</span>
                  </div>
                </div>

                {isLocked && (
                  <div className="mb-4 p-4 rounded-lg bg-red-500/10 border-2 border-red-500/50 animate-pulse flex gap-3 text-red-500">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                    <p className="text-[10px] font-bold">تحذير: البيانات مشفرة لعدم كفاية القوة! الدخول انتحار.</p>
                  </div>
                )}

                <button onClick={handleEnterGate} className={cn("w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r text-white shadow-lg", getGateColor(selectedGate.color))}>
                   {isLocked ? "دخول على مسؤوليتك" : "دخول البوابة"}
                </button>
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
