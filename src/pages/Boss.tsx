import { useGameState } from '@/hooks/useGameState';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'VOID MONARCH', color: 'black', glow: 'rgba(255,255,255,0.6)' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', glow: 'rgba(168,85,247,0.6)' },
    { id: 'g3', rank: 'B', name: 'FROZEN LABYRINTH', color: 'blue', glow: 'rgba(59,130,246,0.6)' },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-y-auto pb-20 scrollbar-hide">
      
      {/* تأثير جزيئات المانا والظلام في الخلفية */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_50%,#0a0a0f_0%,#000000_100%)]" />

      <main className="relative z-10 flex flex-col items-center py-20 gap-40">
        {gates.map((gate) => (
          <div key={gate.id} className="relative flex flex-col items-center group">
            
            {/* الشعاع العلوي (The Vertical Beam) */}
            <div className={cn(
              "absolute bottom-full mb-[-100px] w-1 bg-gradient-to-t from-current to-transparent blur-md h-[100vh] opacity-30 animate-pulse",
              gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-500" : "text-blue-500"
            )} />

            {/* الهالة المتفجرة حول البوابة (The Outer Aura) */}
            <div className={cn(
              "absolute inset-[-60px] rounded-full blur-[80px] opacity-40 animate-pulse",
              gate.color === 'black' ? "bg-white" : gate.color === 'purple' ? "bg-purple-600" : "bg-blue-600"
            )} />

            {/* البوابة الدائرية الجبارة */}
            <div className={cn(
              "relative w-72 h-72 rounded-full border-8 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] transition-transform duration-700 group-hover:scale-110",
              gate.color === 'black' ? "border-white shadow-[0_0_60px_rgba(255,255,255,0.4)]" : 
              gate.color === 'purple' ? "border-purple-500 shadow-[0_0_60px_rgba(168,85,247,0.5)]" : 
              "border-blue-500 shadow-[0_0_60px_rgba(59,130,246,0.5)]"
            )}>
              {/* الدوامة السحرية (Vortex) */}
              <div className={cn(
                "absolute inset-[-100%] animate-[spin_4s_linear_infinite]",
                gate.color === 'black' ? "bg-[conic-gradient(from_0deg,#000,#fff,#222,#fff,#000)]" :
                gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,#4c1d95,#a855f7,#1e1b4b,#a855f7,#4c1d95)]" :
                "bg-[conic-gradient(from_0deg,#1e3a8a,#3b82f6,#172554,#3b82f6,#1e3a8a)]"
              )} />
              
              {/* قلب الطاقة المضيء (Infinite Core) */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.9)_0%,transparent_70%)] opacity-90" />
            </div>

            {/* معلومات البوابة مدمجة بجمالية الجبروت */}
            <div className="mt-12 text-center">
              <div className={cn(
                "inline-block px-10 py-1 font-[1000] italic text-4xl skew-x-[-15deg] mb-4 border-2 shadow-[0_0_30px_rgba(0,0,0,0.5)]",
                gate.color === 'black' ? "bg-white text-black border-slate-300" : 
                gate.color === 'purple' ? "bg-purple-600 text-white border-purple-400" : 
                "bg-blue-600 text-white border-blue-400"
              )}>
                {gate.rank}
              </div>
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] italic drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                {gate.name}
              </h2>
            </div>

            {/* التشققات المكانية (Spatial Rifts) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white rotate-[30deg] blur-[2px]" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white -rotate-[30deg] blur-[2px]" />
            </div>

          </div>
        ))}
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) scale(1.3); }
          to { transform: rotate(360deg) scale(1.3); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Boss;
