Import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, Target, Clock, X, Skull, Activity, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const navigate = useNavigate();
  
  // States للتحكم في النافذة
  const [selectedGate, setSelectedGate] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  // حساب قوة اللاعب
  const totalLevel = gameState.totalLevel || 10;
  const playerPower = totalLevel;

  // البوابات مع إضافة البيانات المطلوبة للمودال الثاني
  const gates = [
    { id: 'g0', rank: 'S', name: 'بوابة S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)', requiredPower: 100, timeLimit: '02:00:00', rewards: { xp: 10000, gold: 5000 }, danger: 'CATACLYSMIC' },
    { id: 'g1', rank: 'A', name: 'بوابة A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)', requiredPower: 60, timeLimit: '04:00:00', rewards: { xp: 2500, gold: 1500 }, danger: 'EXTREME PERIL' },
    { id: 'g3', rank: 'B', name: 'بوابة B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)', requiredPower: 35, timeLimit: '08:00:00', rewards: { xp: 1000, gold: 600 }, danger: 'MODERATE DANGER' },
  ];

  // وظائف الكود الثاني
  const handleGateClick = (gate) => {
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

  const getGateColor = (color) => {
    const colors = {
      purple: 'from-purple-500 to-purple-700',
      blue: 'from-blue-500 to-blue-700',
      red: 'from-red-500 to-red-700',
    };
    return colors[color] || 'from-gray-500 to-gray-700';
  };

  const getGateBorderColor = (color) => {
    const colors = {
      purple: 'border-purple-500/50',
      blue: 'border-blue-500/50',
      red: 'border-red-500/50',
    };
    return colors[color] || 'border-gray-500/50';
  };

  const getGateGlow = (color) => {
    const glows = {
      purple: '0 0 60px rgba(168, 85, 247, 0.6)',
      blue: '0 0 50px rgba(59, 130, 246, 0.5)',
      red: '0 0 80px rgba(239, 68, 68, 0.7)',
    };
    return glows[color] || '0 0 40px rgba(156, 163, 175, 0.4)';
  };

  // شاشة دخول الكود الثاني (Animation)
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
              <div className="text-2xl font-bold text-white mb-2">جاري الدخول...</div>
              <div className="text-sm text-primary/80">ENTERING DIMENSIONAL GATE</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden">
      
      {/* خلفية النظام الثابتة */}
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
            
            {/* البوابة الدائرية (عند الضغط تفتح المودال) */}
            <div 
              onClick={() => handleGateClick(gate)}
              className="relative w-72 h-72 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 active:scale-90 z-20"
              style={{ filter: `drop-shadow(${gate.aura})` }}
            >
              <div className={cn(
                "relative w-full h-full rounded-full overflow-hidden border-2 transition-colors",
                gate.color === 'red' ? "border-red-600/50 group-hover:border-red-500" : "border-purple-600/50 group-hover:border-purple-500"
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

            {/* كارد المعلومات الأصلي (بدون تغيير) */}
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

                <div className="mt-2 py-2 px-3 bg-white/5 border-l-2 border-white/20">
                  <p className="text-[9px] text-slate-500 font-bold italic leading-relaxed uppercase tracking-tighter">
                    Dimensional crack confirmed. Tap the portal above to initiate transition sequence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* مودال الكود الثاني (نفس الشكل والبيانات بالضبط) */}
      {selectedGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={cn(
            "relative w-full max-w-md rounded-2xl border-2 overflow-hidden",
            getGateBorderColor(selectedGate.color)
          )} style={{ boxShadow: getGateGlow(selectedGate.color) }}>
            
            <div className={cn("absolute inset-0 opacity-30 bg-gradient-to-b", getGateColor(selectedGate.color))} />
            <div className="absolute inset-0 bg-background/90" />
            
            <div className="relative z-10 p-6 bg-[#0c0c0e]">
              <button
                onClick={() => { setSelectedGate(null); setShowWarning(false); }}
                className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              
              <div className="text-center mb-6">
                <div className={cn(
                  "w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-4xl font-black mb-3 bg-gradient-to-br text-white",
                  getGateColor(selectedGate.color)
                )} style={{ boxShadow: getGateGlow(selectedGate.color) }}>
                  {selectedGate.rank}
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedGate.name}</h2>
                <p className="text-sm text-slate-400 uppercase tracking-widest mt-1">{selectedGate.danger}</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <Zap className="w-4 h-4 text-primary" />
                    كثافة الطاقة
                  </span>
                  <span className="font-bold text-white">{selectedGate.energy} MP</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <Clock className="w-4 h-4 text-purple-400" />
                    الوقت المتاح
                  </span>
                  <span className="font-bold text-white">{selectedGate.timeLimit}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <Target className="w-4 h-4 text-green-500" />
                    القوة المطلوبة
                  </span>
                  <span className={cn(
                    "font-bold",
                    playerPower >= selectedGate.requiredPower ? "text-green-500" : "text-red-500"
                  )}>
                    {selectedGate.requiredPower} (أنت: {playerPower})
                  </span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-6">
                <h3 className="text-sm font-bold mb-2 text-purple-400">المكافآت</h3>
                <div className="flex justify-around text-sm text-slate-200">
                  <span>+{selectedGate.rewards.xp} XP</span>
                  <span>+{selectedGate.rewards.gold} ذهب</span>
                </div>
              </div>
              
              {showWarning && playerPower < selectedGate.requiredPower && (
                <div className="mb-4 p-4 rounded-lg bg-red-500/10 border-2 border-red-500/50 animate-pulse">
                  <div className="flex items-start gap-3 text-red-500">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold mb-1 uppercase text-xs">تحذير النظام!</h4>
                      <p className="text-[10px] leading-tight opacity-80">
                        قوتك الحالية ({playerPower}) أقل من المطلوب ({selectedGate.requiredPower}). الدخول قد يؤدي إلى خسارة كبيرة في HP!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleEnterGate}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 text-white",
                  "bg-gradient-to-r hover:scale-[1.02] active:scale-[0.98] shadow-lg",
                  getGateColor(selectedGate.color)
                )}
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
