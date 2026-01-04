import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, X, Skull, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion'; // تأكد من تثبيت framer-motion

const Boss = () => {
  const { gameState } = useGameState();
  const navigate = useNavigate();
  
  const [selectedGate, setSelectedGate] = useState(null);
  const [isEntering, setIsEntering] = useState(false);
  const [activeGates, setActiveGates] = useState([]);

  const totalLevel = gameState.totalLevel || 1;

  const allPossibleGates = [
    { id: 'g0', rank: 'S', name: 'بوابة S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)', timeLimit: '02:00:00', rewards: { xp: 10000, gold: 5000 }, danger: 'CATACLYSMIC' },
    { id: 'g1', rank: 'A', name: 'بوابة A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)', timeLimit: '04:00:00', rewards: { xp: 2500, gold: 1500 }, danger: 'EXTREME PERIL' },
    { id: 'g2', rank: 'B', name: 'بوابة B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)', timeLimit: '08:00:00', rewards: { xp: 1000, gold: 600 }, danger: 'MODERATE DANGER' },
    { id: 'g3', rank: 'C', name: 'بوابة C', color: 'blue', type: 'NORMAL GATE', energy: '12,500', warning: 'STABLE READINGS', aura: '0 0 60px rgba(59,130,246,0.4)', timeLimit: '12:00:00', rewards: { xp: 600, gold: 400 }, danger: 'LOW DANGER' },
    { id: 'g4', rank: 'D', name: 'بوابة D', color: 'blue', type: 'NORMAL GATE', energy: '4,200', warning: 'WEAK READINGS', aura: '0 0 50px rgba(59,130,246,0.3)', timeLimit: '24:00:00', rewards: { xp: 300, gold: 200 }, danger: 'MINIMAL DANGER' },
    { id: 'g5', rank: 'E', name: 'بوابة E', color: 'blue', type: 'NORMAL GATE', energy: '1,100', warning: 'VERY WEAK', aura: '0 0 40px rgba(59,130,246,0.2)', timeLimit: '48:00:00', rewards: { xp: 100, gold: 50 }, danger: 'SAFE' },
  ];

  useEffect(() => {
    // نظام الاكتشاف: كل 10 مستويات تزيد احتمالية ظهور بوابات أكثر (بحد أدنى 1 وبحد أقصى 6)
    const discoveryRate = Math.min(Math.floor(totalLevel / 10) + 1, 6);
    const count = Math.floor(Math.random() * discoveryRate) + 1;
    
    const selected = [];
    for (let i = 0; i < count; i++) {
      const roll = Math.random() * 100;
      let chosen;
      if (roll <= 2) chosen = allPossibleGates[0]; // S Rank 2%
      else if (roll <= 4) chosen = allPossibleGates[1]; // A Rank 2%
      else chosen = allPossibleGates[Math.floor(Math.random() * (allPossibleGates.length - 2)) + 2];
      
      selected.push({ ...chosen, instanceId: Math.random().toString(36).substr(2, 9) });
    }
    setActiveGates(selected);
  }, [totalLevel]);

  const handleEnterGate = () => {
    setIsEntering(true);
    setTimeout(() => navigate('/battle'), 30000); 
  };

  const getGateColor = (color) => {
    const colors = { purple: 'from-purple-500 to-purple-700', blue: 'from-blue-500 to-blue-700', red: 'from-red-500 to-red-700' };
    return colors[color] || 'from-gray-500 to-gray-700';
  };

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
      <header className="relative z-20 pt-16 pb-12 px-6 text-center border-b border-white/5">
        <h1 className="text-3xl font-black italic tracking-[0.3em] uppercase">
          <span className="text-white drop-shadow-[0_0_100px_rgba(255,255,255,0.5)]">Dungeon</span>
          <span className="block text-xs text-blue-400 mt-2 tracking-[0.5em] font-bold uppercase opacity-70">Gate Discovery Level: {totalLevel}</span>
        </h1>
      </header>

      <main className="relative z-10 px-6 space-y-40 mt-16">
        {activeGates.map((gate, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            key={gate.instanceId} 
            className="relative group flex flex-col items-center max-w-sm mx-auto"
          >
            <div 
              onClick={() => setSelectedGate(gate)}
              className="relative w-72 h-72 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 active:scale-90 z-20"
              style={{ filter: `drop-shadow(${gate.aura})` }}
            >
              <div className={cn("relative w-full h-full rounded-full overflow-hidden border-2", gate.color === 'red' ? "border-red-600/50" : "border-blue-600/50")}>
                <img src="/portal.gif" alt="Portal" className="w-full h-full object-cover scale-110 mix-blend-screen brightness-125" />
              </div>
            </div>

            <div className="relative w-full bg-black/60 border-2 border-slate-200/90 p-5 mt-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-400/50 px-6 py-1">
                <h2 className="text-[10px] font-black tracking-[0.3em] uppercase">
                  RANK: <span className={gate.color === 'red' ? "text-red-500" : "text-blue-400"}>{gate.rank}</span>
                </h2>
              </div>
              <div className="space-y-4 pt-4 text-center">
                 <p className={cn("text-xs font-black uppercase italic tracking-widest", gate.color === 'red' ? "text-red-500" : "text-blue-400")}>{gate.warning}</p>
                 <p className="text-[9px] text-slate-500 italic uppercase">انقر على البوابة لتحليل البيانات</p>
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      <AnimatePresence>
        {selectedGate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className={cn("relative w-full max-w-md rounded-2xl border-2 overflow-hidden bg-[#0c0c0e] origin-center", 
                selectedGate.color === 'red' ? "border-red-500/50" : "border-blue-500/50")}
              style={{ boxShadow: selectedGate.color === 'red' ? '0 0 60px rgba(239,68,68,0.4)' : '0 0 60px rgba(59,130,246,0.4)' }}
            >
              <div className="p-6">
                <button onClick={() => setSelectedGate(null)} className="absolute top-4 left-4 p-2 text-white/50 hover:text-white"><X /></button>
                <div className="text-center mb-6">
                  <div className={cn("w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-4xl font-black mb-3 text-white bg-gradient-to-br", getGateColor(selectedGate.color))}>
                    {selectedGate.rank}
                  </div>
                  <h2 className="text-2xl font-bold uppercase">{selectedGate.name}</h2>
                  <p className="text-sm text-slate-400 tracking-widest mt-1">{selectedGate.danger}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-sm text-slate-300">كثافة الطاقة</span>
                    <span className="font-bold">{selectedGate.energy} MP</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-sm text-slate-300">الوقت المتاح</span>
                    <span className="font-bold">{selectedGate.timeLimit}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-6 flex justify-around">
                    <span className="text-purple-400 font-bold">+{selectedGate.rewards.xp} XP</span>
                    <span className="text-yellow-500 font-bold">+{selectedGate.rewards.gold} Gold</span>
                </div>

                <button onClick={handleEnterGate} className={cn("w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r shadow-lg", getGateColor(selectedGate.color))}>
                  <span className="flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5" /> دخول البوابة
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default Boss;
