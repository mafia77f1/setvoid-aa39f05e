import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Radio, ChevronRight, Activity, Zap, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'Void Monarch', color: 'black', difficulty: 'Calamity', energy: 'LIMIT BRAKER', desc: 'A dimensional rift that defies system laws. Survival chance: 0.01%.' },
    { id: 'g1', rank: 'A', name: 'Shadow Fortress', color: 'purple', difficulty: 'Extreme', energy: '98,400 MP', desc: 'High-level magical fluctuations detected. Elite boss presence confirmed.' },
    { id: 'g3', rank: 'B', name: 'Frozen Labyrinth', color: 'blue', difficulty: 'Hard', energy: '22,000 MP', desc: 'Stable dungeon environment. Recommended for high-tier hunters.' },
  ];

  return (
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-white/30 pb-24 overflow-x-hidden">
      {/* Background Tech Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent_80%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-14 border-b border-slate-700/50 pb-4 px-2">
        <div>
          <h1 className="text-2xl font-[1000] tracking-tighter uppercase italic text-white drop-shadow-[0_0_10px_white]">
            GATE SCANNER
          </h1>
          <p className="text-[8px] font-bold text-blue-500 tracking-[0.5em] uppercase">Dimensional Frequency: Stable</p>
        </div>
        <Radio className="w-5 h-5 text-red-600 animate-pulse" />
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-20">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group">
            {/* التوهج الخلفي الكبير */}
            <div className={cn(
              "absolute -inset-1 blur-xl opacity-10 group-hover:opacity-30 transition duration-1000",
              gate.color === 'black' ? "bg-white" : gate.color === 'purple' ? "bg-purple-600" : "bg-blue-600"
            )} />
            
            <div className="relative bg-[#050b1a]/90 border-2 border-slate-200/90 p-5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] overflow-visible">
              
              {/* ترويسة الماركت المعلقة */}
              <div className="flex justify-center mb-8 mt-[-2.2rem]">
                <div className={cn(
                  "border border-slate-400/50 px-6 py-1 bg-[#020817] shadow-[0_0_20px_rgba(255,255,255,0.1)]",
                  gate.color === 'black' ? "border-white border-2" : ""
                )}>
                  <h2 className="text-xs font-[1000] tracking-[0.3em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,1)] uppercase italic">
                    GATE: <span className={cn(
                      gate.color === 'black' ? "text-white underline" : 
                      gate.color === 'purple' ? "text-purple-400" : "text-blue-400"
                    )}>{gate.name}</span>
                  </h2>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  {/* البوابة الدائرية الضخمة */}
                  <div className={cn(
                    "w-36 h-36 rounded-full border-4 border-slate-500/30 flex items-center justify-center bg-black relative flex-shrink-0 overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,1)]",
                    gate.color === 'black' ? "border-white shadow-[0_0_25px_rgba(255,255,255,0.2)]" : 
                    gate.color === 'purple' ? "border-purple-600/50 shadow-[0_0_20px_rgba(147,51,234,0.3)]" : 
                    "border-blue-600/50 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  )}>
                    {/* الدوامة السحرية الحقيقية */}
                    <div className={cn(
                      "absolute inset-[-50%] animate-[spin_10s_linear_infinite] blur-[3px] opacity-90",
                      gate.color === 'black' ? "bg-[conic-gradient(from_0deg,#000,#fff,#000,#888,#000)]" :
                      gate.color === 'purple' ? "bg-[conic-gradient(from_180deg,#1e1b4b,#a855f7,#1e1b4b,#7c3aed,#1e1b4b)]" :
                      "bg-[conic-gradient(from_180deg,#172554,#3b82f6,#172554,#2563eb,#172554)]"
                    )} />
                    
                    {/* عمق البوابة (Black Hole Effect) */}
                    <div className="absolute inset-[15%] rounded-full bg-black shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden">
                        <div className={cn(
                            "w-full h-full opacity-30 animate-pulse bg-gradient-to-t",
                            gate.color === 'black' ? "from-white to-transparent" :
                            gate.color === 'purple' ? "from-purple-500 to-transparent" :
                            "from-blue-500 to-transparent"
                        )} />
                    </div>

                    {/* زوايا تقنية خارجية للجمالية */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20 rounded-tl-full" />
                  </div>

                  {/* معلومات البوابة (Stats) */}
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-end border-b-2 border-white/5 pb-1">
                      <p className="text-[9px] text-slate-500 uppercase font-black italic">Rank</p>
                      <p className={cn(
                        "text-3xl font-[1000] italic leading-none tracking-tighter",
                        gate.color === 'black' ? "text-white drop-shadow-[0_0_10px_white]" : 
                        gate.color === 'purple' ? "text-purple-400 shadow-purple-500/50" : "text-blue-400"
                      )}>{gate.rank}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-500 font-bold uppercase italic">Difficulty:</span>
                        <span className="text-white font-black uppercase">{gate.difficulty}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-500 font-bold uppercase italic">Energy:</span>
                        <span className="text-white font-black uppercase">{gate.energy}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-[9px] font-black uppercase text-green-500 italic">
                        <Zap className="w-3 h-3 animate-bounce" />
                        Gate Manifested
                    </div>
                  </div>
                </div>

                {/* الوصف في الأسفل (Market Description Style) */}
                <div className="bg-slate-900/50 p-3 border-l-2 border-slate-500/50">
                  <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed uppercase tracking-tight text-center">
                    {gate.desc}
                  </p>
                </div>

                {/* زر الشراء/الدخول (Purchase Style) */}
                <button className={cn(
                  "w-full py-3.5 flex items-center justify-center gap-4 transition-all active:scale-[0.96] border shadow-2xl relative group overflow-hidden",
                  gate.color === 'black' ? "bg-white text-black font-black border-white" :
                  gate.color === 'purple' ? "bg-purple-900/10 text-purple-400 border-purple-500/50 hover:bg-purple-900/30" :
                  "bg-blue-900/10 text-blue-400 border-blue-500/50 hover:bg-blue-900/30"
                )}>
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                   <ShieldAlert className="w-4 h-4" />
                   <span className="text-xs font-black tracking-[0.4em] uppercase italic">ENTER INSTANCE</span>
                   <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) scale(1.6); }
          to { transform: rotate(360deg) scale(1.6); }
        }
      `}</style>
    </div>
  );
};

export default Boss;
