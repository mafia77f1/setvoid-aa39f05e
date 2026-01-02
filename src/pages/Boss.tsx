import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, Target, Clock, X, Skull, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const navigate = useNavigate();
  
  // States للتحكم في النافذة المنبثقة
  const [selectedGate, setSelectedGate] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  // حساب قوة اللاعب (افتراضي 10 إذا لم تتوفر البيانات)
  const playerPower = gameState.totalLevel || 10;

  const gates = [
    { id: 'g0', rank: 'S', name: 'بوابة S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)', requiredPower: 100, timeLimit: '02:00:00', rewards: { xp: 10000, gold: 5000 } },
    { id: 'g1', rank: 'A', name: 'بوابة A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)', requiredPower: 60, timeLimit: '04:00:00', rewards: { xp: 2500, gold: 1500 } },
    { id: 'g3', rank: 'B', name: 'بوابة B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)', requiredPower: 35, timeLimit: '08:00:00', rewards: { xp: 1000, gold: 600 } },
  ];

  const handleGateEntryClick = (gate) => {
    setSelectedGate(gate);
    if (gate.requiredPower > playerPower) {
      setShowWarning(true);
    }
  };

  const handleFinalEntry = () => {
    setIsEntering(true);
    setTimeout(() => {
      navigate('/battle');
    }, 2000);
  };

  // مساعدات الألوان للـ Modal
  const getGateGradient = (color) => {
    const gradients = {
      red: 'from-red-600 to-red-900',
      purple: 'from-purple-600 to-purple-900',
      blue: 'from-blue-600 to-blue-900',
    };
    return gradients[color] || 'from-slate-600 to-slate-900';
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
              <div className="text-2xl font-bold text-white mb-2 italic tracking-tighter">جاري الانتقال...</div>
              <div className="text-xs text-blue-400 tracking-[0.3em]">INITIALIZING DIMENSIONAL JUMP</div>
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
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
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
            
            {/* البوابة الدائرية */}
            <div 
              onClick={() => handleGateEntryClick(gate)}
              className="relative w-72 h-72 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 active:scale-90 z-20"
              style={{ filter: `drop-shadow(${gate.aura})` }}
            >
              <div className={cn(
                "relative w-full h-full rounded-full overflow-hidden border-2 transition-colors",
                gate.color === 'red' ? "border-red-600/50 group-hover:border-red-500" : 
                gate.color === 'purple' ? "border-purple-600/50 group-hover:border-purple-500" : "border-blue-600/50 group-hover:border-blue-500"
              )}>
                <img 
                  src="/portal.gif" 
                  alt="Portal" 
                  className="w-full h-full object-cover scale-110 mix-blend-screen brightness-125 transition-all group-hover:brightness-150"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,black_100%)] opacity-80" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white drop-shadow-2xl">Enter Gate</span>
              </div>
            </div>

            {/* كارد المعلومات */}
            <div className="relative w-full bg-black/60 border-2 border-slate-200/90 p-5 mt-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="border border-slate-400/50 px-6 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <h2 className="text-[10px] font-black tracking-[0.3em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase">
                    RANK: <span className={gate.color === 'red' ? "text-red-500" : "text-blue-400"}>{gate.rank}</span>
                  </h2>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Energy Density</p>
                  </div>
                  <p className="text-base font-mono font-bold text-white italic">
                    {gate.energy} <span className="text-[9px] opacity-40">MP</span>
                  </p>
                </div>

                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={cn("w-3.5 h-3.5", gate.color === 'red' ? "text-red-500" : "text-blue-400")} />
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Danger Level</p>
                  </div>
                  <p className={cn(
                    "text-xs font-black uppercase italic tracking-widest",
                    gate.color === 'red' ? "text-red-500 animate-pulse" : "text-blue-400"
                  )}>
                    {gate.warning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* نافذة تفاصيل البوابة (Modal) */}
      {selectedGate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className={cn(
            "relative w-full max-w-md rounded-none border-t-4 border-b-4 border-l-2 border-r-2 overflow-hidden bg-black shadow-2xl",
            selectedGate.color === 'red' ? "border-red-600" : "border-blue-600"
          )}>
            {/* إغلاق */}
            <button 
              onClick={() => { setSelectedGate(null); setShowWarning(false); }}
              className="absolute top-4 right-4 z-50 text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className={cn(
                  "w-20 h-20 mx-auto flex items-center justify-center text-4xl font-black italic mb-4 border-2 skew-x-[-10deg]",
                  selectedGate.color === 'red' ? "bg-red-600 border-red-400" : "bg-blue-600 border-blue-400"
                )}>
                  {selectedGate.rank}
                </div>
                <h2 className="text-2xl font-black italic tracking-widest uppercase">{selectedGate.name}</h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-xs text-slate-500 uppercase font-bold italic">Required Power</span>
                  <span className={cn("font-bold", playerPower >= selectedGate.requiredPower ? "text-green-400" : "text-red-500")}>
                    {selectedGate.requiredPower} LVL
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-xs text-slate-500 uppercase font-bold italic">Time Limit</span>
                  <span className="font-bold italic">{selectedGate.timeLimit}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-xs text-slate-500 uppercase font-bold italic">Clear Rewards</span>
                  <span className="text-yellow-500 font-bold">{selectedGate.rewards.gold} G</span>
                </div>
              </div>

              {/* التحذير */}
              {showWarning && (
                <div className="mb-6 p-4 bg-red-950/50 border-l-4 border-red-600 flex gap-3 animate-pulse">
                  <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
                  <div>
                    <h4 className="text-red-500 font-black text-xs uppercase tracking-tighter">System Warning!</h4>
                    <p className="text-[10px] text-red-200/70 leading-tight">Your power level is insufficient. Entering this gate may result in instant death.</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleFinalEntry}
                className={cn(
                  "w-full py-4 font-black italic uppercase tracking-[0.2em] transition-all relative overflow-hidden",
                  selectedGate.color === 'red' ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"
                )}
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {playerPower < selectedGate.requiredPower ? <Skull className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                  {playerPower < selectedGate.requiredPower ? "Proceed Anyway" : "Initiate Entry"}
                </div>
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
