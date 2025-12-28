import React from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Skull, Zap, AlertOctagon, Flame, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion'; // تأكد من تثبيت framer-motion
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  // منطق الرتب بناءً على طلبك
  const gateData = [
    { id: 'void', rank: '0', name: boss?.name || 'MONARCH OF DARKNESS', color: 'black', description: 'CALAMITY CLASS GATE', mana: 'UNKNOWN' },
    { id: 'p1', rank: '1', name: 'Shadow Fortress', color: 'purple', description: 'HIGH RANK DUNGEON', mana: '99,000' },
    { id: 'p2', rank: '2', name: 'Demon King Lair', color: 'purple', description: 'ELITE RAID', mana: '75,000' },
    { id: 'b1', rank: '3', name: 'Frozen Labyrinth', color: 'blue', description: 'NORMAL GATE', mana: '20,000' },
    { id: 'b2', rank: '5', name: 'Orc Territory', color: 'blue', description: 'SCOUTING MISSION', mana: '5,000' },
  ];

  const getRankStyles = (color: string) => {
    switch (color) {
      case 'black':
        return "from-gray-900 via-black to-purple-950 border-gray-500 shadow-[0_0_50px_rgba(0,0,0,1)] text-white";
      case 'purple':
        return "from-indigo-950 via-purple-900 to-black border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] text-purple-100";
      case 'blue':
        return "from-blue-950 via-blue-900 to-black border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] text-blue-100";
      default:
        return "from-slate-900 to-black border-slate-500";
    }
  };

  const getPortalAnimation = (color: string) => {
    switch (color) {
      case 'black': return "after:bg-[conic-gradient(from_0deg,transparent,white,transparent,white)]";
      case 'purple': return "after:bg-[conic-gradient(from_0deg,transparent,#a855f7,transparent,#a855f7)]";
      case 'blue': return "after:bg-[conic-gradient(from_0deg,transparent,#3b82f6,transparent,#3b82f6)]";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white p-4 pb-32 font-sans overflow-x-hidden">
      {/* Background Dark System Overlay */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      
      <header className="relative z-10 pt-8 mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            WORLD GATES
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-purple-500" />
            <span className="text-[10px] font-black tracking-[0.5em] text-purple-500 uppercase">Detection Active</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-purple-500" />
          </div>
        </motion.div>
      </header>

      <main className="relative z-10 max-w-xl mx-auto space-y-10">
        {gateData.map((gate, index) => (
          <motion.div
            key={gate.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
            className="relative"
          >
            {/* Gate Rank Banner */}
            <div className={cn(
              "absolute -top-4 left-6 z-30 px-6 py-1 font-black text-sm italic tracking-widest border border-white/20 skew-x-[-20deg] shadow-2xl",
              gate.color === 'black' ? "bg-white text-black" : 
              gate.color === 'purple' ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
            )}>
              RANK {gate.rank}
            </div>

            {/* MAIN GIGANTIC CARD */}
            <div className={cn(
              "relative group flex items-center h-48 rounded-sm border-l-8 overflow-hidden transition-all duration-300 hover:scale-[1.02]",
              getRankStyles(gate.color)
            )}>
              
              {/* THE PORTAL (Visual Part) */}
              <div className="relative w-40 h-full flex-shrink-0 bg-black flex items-center justify-center overflow-hidden">
                {/* Spiral Portal Effect */}
                <div className={cn(
                  "absolute inset-0 opacity-80 animate-[spin_4s_linear_infinite] scale-150 blur-sm",
                  getPortalAnimation(gate.color)
                )} />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,black_70%)]" />
                
                {/* Floating Icon */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="z-10"
                >
                  {gate.color === 'black' ? (
                    <AlertOctagon className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                  ) : (
                    <Skull className={cn("w-14 h-14", gate.color === 'purple' ? "text-purple-400" : "text-blue-400")} />
                  )}
                </motion.div>
              </div>

              {/* INFO PANEL */}
              <div className="flex-grow p-6 relative">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Flame className="w-16 h-16" />
                </div>
                
                <h2 className="text-[10px] font-black tracking-[0.3em] opacity-60 mb-1 uppercase">
                  {gate.description}
                </h2>
                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none mb-4 group-hover:tracking-normal transition-all">
                  {gate.name}
                </h3>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[8px] font-bold opacity-50 uppercase">Mana Intensity</p>
                    <p className={cn("text-xs font-black", gate.color === 'black' ? "text-red-500" : "text-white")}>
                      {gate.mana} m.p
                    </p>
                  </div>
                  <div className="h-8 w-[1px] bg-white/10" />
                  <div>
                    <p className="text-[8px] font-bold opacity-50 uppercase">Status</p>
                    <p className="text-xs font-black text-green-500 animate-pulse uppercase">Open</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="h-full w-12 flex items-center justify-center bg-black/40 group-hover:bg-white/10 transition-colors cursor-pointer">
                <ChevronRight className="w-6 h-6 text-white" />
              </div>

              {/* Electric Glitch Effect for Black Gate */}
              {gate.color === 'black' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-white animate-[bounce_2s_infinite]" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </main>

      <BottomNav />

      {/* Custom Styles for Portal Spinning */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .portal-glow {
            filter: blur(20px);
            mix-blend-mode: screen;
        }
      `}</style>
    </div>
  );
};

export default Boss;
