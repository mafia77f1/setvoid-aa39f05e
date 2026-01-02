import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, Target, Clock, X, Skull, Activity, ShieldAlert, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const navigate = useNavigate();
  
  const [selectedGate, setSelectedGate] = useState(null);
  const [isEntering, setIsEntering] = useState(false);

  // حساب قوة اللاعب من النظام
  const playerPower = gameState.totalLevel || 10;

  const gates = [
    { id: 'g0', rank: 'S', name: 'GATE: RAGNAROK', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)', requiredPower: 100, timeLimit: '02:00:00', rewards: { xp: '10,000', gold: '5,000' } },
    { id: 'g1', rank: 'A', name: 'GATE: ELITE VOID', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)', requiredPower: 60, timeLimit: '04:00:00', rewards: { xp: '2,500', gold: '1,500' } },
    { id: 'g3', rank: 'B', name: 'GATE: STABLE CRACK', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)', requiredPower: 35, timeLimit: '08:00:00', rewards: { xp: '1,000', gold: '600' } },
  ];

  const handleGateEntry = (gate) => {
    setSelectedGate(gate);
  };

  const startSequence = () => {
    setIsEntering(true);
    setTimeout(() => navigate('/battle'), 2000);
  };

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
            
            {/* البوابة الدائرية */}
            <div 
              onClick={() => handleGateEntry(gate)}
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
                <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white drop-shadow-2xl">Analyze Gate</span>
              </div>
            </div>

            {/* كارد المعلومات الثابت */}
            <div className="relative w-full bg-black/60 border-2 border-slate-200/90 p-5 mt-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="border border-slate-400/50 px-6 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <h2 className="text-[10px] font-black tracking-[0.3em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] uppercase">
                    RANK: <span className={gate.color === 'red' ? "text-red-500" : "text-blue-400"}>{gate.rank}</span>
                  </h2>
                </div>
              </div>

              <div className="space-y-4 pt-4 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest italic animate-pulse">
                  - Tap Portal to initiate transition -
                </p>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* --- نافذة المعلومات الجبارة (The Epic Modal) --- */}
      {selectedGate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSelectedGate(null)} />
          
          {/* Modal Container */}
          <div className={cn(
            "relative w-full max-w-[400px] bg-[#050506] border-y-4 border-x-[1px] shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300",
            selectedGate.color === 'red' ? "border-red-600 shadow-red-900/20" : "border-purple-600 shadow-purple-900/20"
          )}>
            
            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-inherit -translate-x-2 -translate-y-2" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-inherit translate-x-2 translate-y-2" />

            <div className="p-6 relative overflow-hidden">
              {/* Close Button */}
              <button onClick={() => setSelectedGate(null)} className="absolute top-2 right-2 p-2 hover:rotate-90 transition-transform">
                <X className="w-5 h-5 text-slate-500" />
              </button>

              {/* Rank Hexagon Header */}
              <div className="text-center mb-8 pt-4">
                <div className={cn(
                  "inline-block w-20 h-20 leading-[80px] text-4xl font-black italic bg-gradient-to-br mb-4 skew-x-[-12deg] border-2",
                  selectedGate.color === 'red' ? "from-red-600 to-black border-red-400" : "from-purple-600 to-black border-purple-400"
                )}>
                  {selectedGate.rank}
                </div>
                <h2 className="text-xl font-black tracking-[0.3em] uppercase italic">{selectedGate.name}</h2>
                <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-current to-transparent mx-auto mt-2 opacity-30" />
              </div>

              {/* System Data Grid */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center bg-white/5 p-3 border-l-2 border-blue-500">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Energy Density</span>
                  </div>
                  <span className="font-mono font-bold text-white">{selectedGate.energy} MP</span>
                </div>

                <div className="flex justify-between items-center bg-white/5 p-3 border-l-2 border-yellow-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Time Limit</span>
                  </div>
                  <span className="font-mono font-bold text-white">{selectedGate.timeLimit}</span>
                </div>

                <div className="flex justify-between items-center bg-white/5 p-3 border-l-2 border-green-500">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-green-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Gold Rewards</span>
                  </div>
                  <span className="font-mono font-bold text-green-400">+{selectedGate.rewards.gold}</span>
                </div>
              </div>

              {/* Danger Warning Box */}
              {playerPower < selectedGate.requiredPower && (
                <div className="bg-red-950/40 border border-red-500/50 p-4 mb-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-red-600/10 animate-pulse" />
                  <div className="relative flex gap-3">
                    <Skull className="w-10 h-10 text-red-500 shrink-0" />
                    <div>
                      <h3 className="text-red-500 font-black text-xs uppercase italic tracking-tighter">Insufficient Power Level</h3>
                      <p className="text-[10px] text-red-200/60 uppercase leading-tight mt-1 font-bold">
                        Current Strength: {playerPower} <br/> Required: {selectedGate.requiredPower}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={startSequence}
                className={cn(
                  "group relative w-full py-5 overflow-hidden transition-all active:scale-95",
                  selectedGate.color === 'red' ? "bg-red-600 hover:bg-red-500" : "bg-purple-600 hover:bg-purple-500"
                )}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite]" />
                <span className="relative z-10 flex items-center justify-center gap-3 font-black italic tracking-[0.2em] uppercase">
                  {playerPower < selectedGate.requiredPower ? <ShieldAlert className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                  {playerPower < selectedGate.requiredPower ? "Enter At Your Own Risk" : "Initiate Dungeon Entry"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Entry Transition Overlay */}
      {isEntering && (
        <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center">
            <div className="w-80 h-[2px] bg-white/10 relative overflow-hidden mb-4">
                <div className="absolute inset-0 bg-blue-500 animate-[loading_2s_ease-in-out]" />
            </div>
            <div className="text-blue-400 font-black italic tracking-[0.5em] animate-pulse text-sm">
                DIMENSIONAL TRANSFER IN PROGRESS
            </div>
        </div>
      )}

      <BottomNav />
      
      {/* CSS Animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Boss;
