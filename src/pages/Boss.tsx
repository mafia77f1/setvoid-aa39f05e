import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { ChevronRight, Flame, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'VOID MONARCH', color: 'black', type: 'RED GATE', energy: 'LIMIT BRAKER' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400 MP' },
    { id: 'g3', rank: 'B', name: 'ICE CITADEL', color: 'blue', type: 'NORMAL GATE', energy: '22,000 MP' },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white/30 pb-32 overflow-x-hidden">
      
      {/* تأثير جزيئات المانا والدخان الخلفي */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a0a0f_0%,#000000_100%)]" />
        {/* تأثير الدخان المتحرك */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] animate-[pulse_4s_infinite]" />
      </div>

      <header className="relative z-20 pt-16 pb-10 text-center">
        <h1 className="text-4xl font-[1000] italic tracking-[0.3em] uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          GATE <span className="text-red-600 animate-pulse">RAID</span>
        </h1>
        <div className="mt-2 flex items-center justify-center gap-3">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <span className="text-[9px] font-black tracking-[0.5em] text-slate-500 uppercase">Dimensional Rupture</span>
          <div className="h-[1px] w-20 bg-gradient-to-l from-transparent via-white/40 to-transparent" />
        </div>
      </header>

      <main className="relative z-10 space-y-48 pb-20">
        {gates.map((gate) => (
          <div key={gate.id} className="relative flex flex-col items-center group">
            
            {/* 1. التشققات المكانية (Spatial Fractures) */}
            <div className="absolute inset-[-60px] pointer-events-none z-0 opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white rotate-[15deg] blur-[3px] animate-pulse" />
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white -rotate-[25deg] blur-[2px] opacity-50" />
              <div className="absolute top-0 left-1/2 w-[2px] h-full bg-white rotate-[70deg] blur-[4px] opacity-30" />
            </div>

            {/* 2. هالة الدخان والطاقة (Smoke & Aura) */}
            <div className={cn(
              "absolute inset-[-40px] rounded-full blur-[70px] opacity-50 animate-pulse transition-all duration-1000 group-hover:blur-[100px] group-hover:scale-125",
              gate.color === 'black' ? "bg-white/40" : gate.color === 'purple' ? "bg-purple-600/50" : "bg-blue-600/50"
            )} />

            {/* 3. جسم البوابة الدائري الجبار */}
            <div className={cn(
              "relative w-72 h-72 rounded-full border-[10px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] transition-transform duration-700 group-hover:scale-110 z-10",
              gate.color === 'black' ? "border-white" : gate.color === 'purple' ? "border-purple-500" : "border-blue-500"
            )}>
              {/* دوامة المانا (Vortex) */}
              <div className={cn(
                "absolute inset-[-120%] animate-[spin_3s_linear_infinite] blur-[1px]",
                gate.color === 'black' ? "bg-[conic-gradient(from_0deg,#000,#fff,#222,#fff,#000,#fff)]" :
                gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,#4c1d95,#a855f7,#000,#7c3aed,#4c1d95)]" :
                "bg-[conic-gradient(from_0deg,#1e3a8a,#3b82f6,#000,#2563eb,#1e3a8a)]"
              )} />
              
              {/* قلب البوابة المضيء (مركز الدخان) */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.9)_0%,transparent_75%)] mix-blend-overlay animate-pulse" />
              
              {/* طبقة الدخان الداخلي */}
              <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-150 animate-[spin_20s_linear_infinite]" />
            </div>

            {/* 4. رتبة البوابة - طافية فوقها */}
            <div className={cn(
              "absolute -top-10 -right-6 z-30 px-8 py-2 font-[1000] italic text-5xl border-4 shadow-2xl skew-x-[-15deg] group-hover:scale-110 transition-transform",
              gate.color === 'black' ? "bg-white text-black border-slate-300" : 
              gate.color === 'purple' ? "bg-purple-600 text-white border-purple-400" : 
              "bg-blue-600 text-white border-blue-400"
            )}>
              {gate.rank}
            </div>

            {/* 5. معلومات البوابة بنمط الماركت */}
            <div className="mt-16 text-center z-20 space-y-4">
               <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black tracking-[0.5em] text-slate-500 uppercase mb-1">Target Name</span>
                 <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                   {gate.name}
                 </h2>
               </div>

               <div className="flex gap-8 justify-center border-y border-white/10 py-4 px-10">
                  <div className="text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase">Mana Output</p>
                    <p className="text-sm font-black text-white">{gate.energy}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase">Gate Type</p>
                    <p className={cn("text-sm font-black italic", gate.color === 'black' ? "text-red-500" : "text-white")}>{gate.type}</p>
                  </div>
               </div>

               {/* زر الدخول (The Deployment) */}
               <button className={cn(
                 "mt-4 px-12 py-4 font-[1000] tracking-[0.6em] uppercase italic transition-all active:scale-90 relative group overflow-hidden border-2",
                 gate.color === 'black' ? "bg-white text-black border-white" : "bg-transparent text-white border-white/40"
               )}>
                 <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                 ENTER
               </button>
            </div>

          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) scale(1.4); }
          to { transform: rotate(360deg) scale(1.4); }
        }
      `}</style>
    </div>
  );
};

export default Boss;
