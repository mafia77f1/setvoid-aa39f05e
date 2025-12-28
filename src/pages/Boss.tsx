import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { ChevronRight, Flame, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'VOID MONARCH', color: 'black', description: 'THE ATMOSPHERE IS SUFFOCATING. A CALAMITY LEVEL RIFT.' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', description: 'HIGH MANA CONCENTRATION DETECTED.' },
    { id: 'g3', rank: 'B', name: 'ICE CITADEL', color: 'blue', description: 'STABLE DIMENSIONAL ENTRANCE.' },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans pb-32 overflow-x-hidden">
      
      {/* أجواء الغبار السحري في الخلفية */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a0a15_0%,#000000_100%)]" />
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] mix-blend-overlay" />
      </div>

      <main className="relative z-10 flex flex-col items-center pt-20 space-y-60">
        {gates.map((gate) => (
          <div key={gate.id} className="relative w-full max-w-sm flex flex-col items-center group">
            
            {/* 1. شعاع الطاقة السماوي (The Reality Rupture Beam) */}
            <div className={cn(
              "absolute -top-[50vh] w-[2px] h-[60vh] blur-sm opacity-50 animate-pulse",
              gate.color === 'black' ? "bg-white shadow-[0_0_20px_white]" : 
              gate.color === 'purple' ? "bg-purple-500 shadow-[0_0_20px_#a855f7]" : 
              "bg-blue-500 shadow-[0_0_20px_#3b82f6]"
            )} />

            {/* 2. تأثير الدخان والضباب المتصاعد حول البوابة */}
            <div className="absolute inset-[-100px] pointer-events-none">
                <div className={cn(
                    "absolute inset-0 rounded-full blur-[100px] opacity-20 animate-[pulse_5s_infinite]",
                    gate.color === 'black' ? "bg-white" : gate.color === 'purple' ? "bg-purple-900" : "bg-blue-900"
                )} />
            </div>

            {/* 3. البوابة الواقعية (The Rift) */}
            <div className="relative w-80 h-80 flex items-center justify-center">
              
              {/* التشققات البرقية الخارجة من المركز */}
              <div className="absolute inset-0 z-0 animate-[ping_3s_infinite] opacity-30">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-white/40 blur-md rotate-45" />
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-white/40 blur-md -rotate-45" />
              </div>

              {/* جسم البوابة "الغليان الطاقي" */}
              <div className={cn(
                "relative w-full h-full rounded-full border-b-[12px] border-t-2 border-x-[10px] animate-[portal-drift_6s_easeInOut_infinite] shadow-[inset_0_0_80px_rgba(0,0,0,1)]",
                gate.color === 'black' ? "border-white/80 shadow-[0_0_100px_rgba(255,255,255,0.2)]" : 
                gate.color === 'purple' ? "border-purple-600 shadow-[0_0_100px_rgba(168,85,247,0.3)]" : 
                "border-blue-600 shadow-[0_0_100px_rgba(59,130,246,0.3)]"
              )}>
                {/* الدوامة الداخلية (واقعية بدون مركز أسود صلب) */}
                <div className={cn(
                  "absolute inset-0 rounded-full opacity-90 animate-[spin_8s_linear_infinite] blur-[2px]",
                  gate.color === 'black' ? "bg-[conic-gradient(from_0deg,#000,#fff,#444,#fff,#000)]" :
                  gate.color === 'purple' ? "bg-[conic-gradient(from_180deg,#2e1065,#a855f7,#4c1d95,#d8b4fe,#2e1065)]" :
                  "bg-[conic-gradient(from_180deg,#172554,#3b82f6,#1e3a8a,#93c5fd,#172554)]"
                )} />

                {/* طبقة الدخان المتحرك فوق الدوامة */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_70%)] mix-blend-screen opacity-60 animate-pulse" />
                
                {/* تأثير "عدم الاستقرار" (Distortion) */}
                <div className="absolute inset-0 backdrop-blur-[4px] mix-blend-overlay" />
              </div>

              {/* الرتبة - كبيرة ومهيمنة بشكل مائل */}
              <div className={cn(
                "absolute -right-8 top-10 z-30 text-7xl font-[1000] italic tracking-tighter drop-shadow-[0_0_20px_rgba(0,0,0,1)] select-none",
                gate.color === 'black' ? "text-white/90" : gate.color === 'purple' ? "text-purple-600" : "text-blue-600"
              )}>
                {gate.rank}
              </div>
            </div>

            {/* 4. تفاصيل البوابة (System Layout) */}
            <div className="mt-10 text-center space-y-4 px-6 w-full">
              <div className="relative inline-block">
                <h2 className="text-3xl font-black uppercase italic tracking-[0.1em] text-white drop-shadow-[0_0_10px_white]">
                  {gate.name}
                </h2>
                <div className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-white to-transparent" />
              </div>

              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                {gate.description}
              </p>

              {/* زر الدخول - بسيط لكن فخم */}
              <button className={cn(
                "w-full mt-6 py-4 font-black tracking-[0.8em] uppercase italic border-2 transition-all active:scale-95 group overflow-hidden relative",
                gate.color === 'black' ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]" : "bg-transparent text-white border-white/30"
              )}>
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="flex items-center justify-center gap-3">
                   <Zap className="w-4 h-4 fill-current" />
                   ENTER
                   <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes portal-drift {
          0%, 100% { transform: scale(1) rotate(0deg); filter: blur(0px); }
          50% { transform: scale(1.05) rotate(1deg); filter: blur(1px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Boss;
