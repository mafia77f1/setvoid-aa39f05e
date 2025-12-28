import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Radio, ChevronRight, Activity, Zap, ShieldAlert, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'MONARCH OF VOID', color: 'black', difficulty: 'Calamity', energy: 'LIMIT BRAKER', desc: 'A dimensional rift that defies system laws. Survival chance: 0.01%.' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', difficulty: 'Extreme', energy: '98,400 MP', desc: 'High-level magical fluctuations detected. Elite boss presence confirmed.' },
    { id: 'g3', rank: 'B', name: 'FROZEN LABYRINTH', color: 'blue', difficulty: 'Hard', energy: '22,000 MP', desc: 'Stable dungeon environment. Recommended for high-tier hunters.' },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-white/30 pb-24">
      {/* Background FX - Tech & Magic Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.05),rgba(0,255,0,0.01),rgba(0,0,255,0.05))] bg-[size:100%_2px,2px_100%]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-10 border-b border-slate-700/50 pb-4 px-2">
        <h1 className="text-xl font-[1000] tracking-[0.2em] uppercase italic text-white drop-shadow-[0_0_10px_white]">
          GATE RADAR
        </h1>
        <div className="bg-white/5 border border-white/20 px-3 py-1 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span className="font-mono font-bold text-white text-xs uppercase tracking-tighter">
            System Online
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-14">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group">
            {/* التوهج الخلفي المستوحى من الـ Market */}
            <div className={cn(
              "absolute -inset-0.5 blur-sm opacity-20 group-hover:opacity-100 transition duration-500",
              gate.color === 'black' ? "bg-white" : gate.color === 'purple' ? "bg-purple-500" : "bg-blue-500"
            )} />
            
            <div className="relative bg-black/80 border-2 border-slate-200/90 p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              
              {/* ترويسة البوابة - توهج ابيض قوي (مثل الماركت) */}
              <div className="flex justify-center mb-6 mt-[-1.6rem]">
                <div className={cn(
                  "border border-slate-400/50 px-5 py-0.5 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.1)]",
                  gate.color === 'black' ? "border-white border-2" : ""
                )}>
                  <h2 className="text-[10px] font-[1000] tracking-[0.2em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] uppercase italic">
                    GATE: <span className={cn(
                      gate.color === 'black' ? "text-white underline" : 
                      gate.color === 'purple' ? "text-purple-400" : "text-blue-400"
                    )}>{gate.name}</span>
                  </h2>
                </div>
              </div>

              {/* المحتوى الرئيسي بالعرض (Horizontal Layout) */}
              <div className="flex gap-4">
                
                {/* قسم صورة البوابة الجبارة */}
                <div className={cn(
                  "w-28 h-28 border-2 border-slate-500/50 flex items-center justify-center bg-black relative flex-shrink-0 overflow-hidden",
                  gate.color === 'black' ? "shadow-[0_0_20px_rgba(255,255,255,0.3)]" : ""
                )}>
                  {/* الدوامة السحرية (Vortex) */}
                  <div className={cn(
                    "absolute inset-[-40%] animate-[spin_8s_linear_infinite] blur-[2px] opacity-70",
                    gate.color === 'black' ? "bg-[conic-gradient(from_0deg,transparent,#fff,transparent,#666,#fff)]" :
                    gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,transparent,#a855f7,transparent,#4c1d95,#a855f7)]" :
                    "bg-[conic-gradient(from_0deg,transparent,#3b82f6,transparent,#1e3a8a,#3b82f6)]"
                  )} />
                  
                  {/* قلب البوابة */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,black_80%)]" />
                  <Radio className={cn(
                    "w-8 h-8 z-10 animate-pulse",
                    gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-400" : "text-blue-400"
                  )} />

                  {/* زوايا تقنية (Corners) */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white" />
                </div>

                {/* تفاصيل البيانات (Stats Section) */}
                <div className="flex-1 space-y-2 py-1">
                  <div className="flex justify-between items-center border-b border-white/10 pb-1">
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest italic">Rank</p>
                    <p className={cn(
                      "text-xl font-[1000] italic drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] uppercase leading-none",
                      gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-400" : "text-blue-400"
                    )}>{gate.rank}</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-1">
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest italic">Difficulty</p>
                    <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{gate.difficulty}</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-1">
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest italic">Energy</p>
                    <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{gate.energy}</p>
                  </div>
                </div>
              </div>

              {/* وصف البوابة (Description) */}
              <div className="mt-4 px-1 text-center">
                <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed uppercase tracking-tight">
                   {gate.desc}
                </p>
              </div>

              {/* زر الدخول (Action Button) - مستوحى من الماركت */}
              <button className={cn(
                "w-full mt-4 py-2.5 border transition-all active:scale-[0.97] flex items-center justify-center gap-3 group overflow-hidden relative",
                gate.color === 'black' ? "bg-white text-black font-black border-white hover:bg-slate-200" :
                gate.color === 'purple' ? "bg-purple-900/20 text-purple-400 border-purple-500/40 hover:bg-purple-900/40" :
                "bg-blue-900/20 text-blue-400 border-blue-500/40 hover:bg-blue-900/40"
              )}>
                <Activity className="w-3.5 h-3.5 group-hover:animate-bounce" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">Deploy Hunter</span>
                <ChevronRight className="w-4 h-4" />
                
                {/* تأثير اللمعان */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) scale(1.5); }
          to { transform: rotate(360deg) scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default Boss;
