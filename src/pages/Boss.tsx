import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Activity, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: '0 0 80px rgba(220,38,38,0.6)', glow: '0 0 40px rgba(220,38,38,0.4)' },
    { id: 'g1', rank: 'A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: '0 0 80px rgba(168,85,247,0.6)', glow: '0 0 40px rgba(168,85,247,0.4)' },
    { id: 'g3', rank: 'B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: '0 0 80px rgba(59,130,246,0.6)', glow: '0 0 40px rgba(59,130,246,0.4)' },
  ];

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden">
      
      {/* خلفية النظام الثابتة */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(76,29,149,0.15),transparent_80%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20" />
      </div>

      <header className="relative z-20 pt-16 pb-12 px-6 text-center">
        <div className="inline-block relative">
          <div className="absolute -inset-4 bg-purple-600/20 blur-3xl rounded-full" />
          <h1 className="relative text-4xl font-[1000] italic tracking-[0.2em] uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-white">GATE</span>
            <span className="ml-4 text-purple-600">ANALYSIS</span>
          </h1>
        </div>
      </header>

      <main className="relative z-10 px-6 space-y-44">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group flex flex-col items-center max-w-sm mx-auto">
            
            {/* معلومات الرتبة العائمة بجانب البوابة */}
            <div className="absolute top-0 -right-4 z-30 bg-white text-black px-4 py-1 font-[1000] italic -skew-x-12 shadow-[4px_4px_0_rgba(0,0,0,1)]">
              RANK {gate.rank}
            </div>

            {/* البوابة الدائرية (الكارد والصورة بمقاس واحد) */}
            <div 
              className="relative w-72 h-72 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
              style={{ filter: `drop-shadow(${gate.aura})` }}
            >
              
              {/* الحاوية الدائرية المقصوصة (The Portal Core) */}
              <div className={cn(
                "relative w-full h-full rounded-full overflow-hidden border-2 z-10",
                gate.color === 'red' ? "border-red-500/50" : "border-purple-500/50"
              )}>
                {/* صورة الـ GIF */}
                <img 
                  src="/portal.gif" 
                  alt="Dungeon Portal" 
                  className="w-full h-full object-cover scale-110 mix-blend-screen brightness-125"
                />
                
                {/* ظل داخلي للعمق */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,black_100%)] opacity-80" />
              </div>

              {/* حلقات الطاقة الخارجية (Aura Rings) */}
              <div className={cn(
                "absolute inset-[-10px] rounded-full border border-white/5 animate-[spin_10s_linear_infinite]",
                "after:absolute after:inset-0 after:rounded-full after:border-t-2 after:border-white/20"
              )} />
              
              <div className={cn(
                "absolute inset-[-20px] rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]",
                "after:absolute after:inset-0 after:rounded-full after:border-b-2 after:border-white/10"
              )} />

              {/* زر الدخول المدمج أسفل الدائرة مباشرة */}
              <button className="absolute -bottom-4 z-40 transform transition-transform active:scale-90">
                <div className={cn(
                  "px-8 py-3 font-black italic tracking-widest text-sm skew-x-[-20deg] border-l-4 border-white shadow-2xl",
                  gate.color === 'red' ? "bg-red-600 text-white" :
                  gate.color === 'purple' ? "bg-purple-600 text-white" :
                  "bg-blue-600 text-white"
                )}>
                  ENTER GATE
                </div>
              </button>
            </div>

            {/* تفاصيل الطاقة (أسفل البوابة مباشرة) */}
            <div className="mt-14 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                <Activity className="w-3 h-3 text-white" /> Energy: {gate.energy} MP
              </div>
              <div className={cn(
                "text-sm font-black italic tracking-tight uppercase",
                gate.color === 'red' ? "text-red-500" : "text-purple-500"
              )}>
                {gate.warning}
              </div>
            </div>

          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Boss;
