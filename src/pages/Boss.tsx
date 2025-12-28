
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Radio, ChevronRight, Activity, Zap, ShieldAlert, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'VOID MONARCH', color: 'black', difficulty: 'CALAMITY', energy: 'INFINITY', desc: 'THE ATMOSPHERE IS HEAVY. A PRESENCE THAT DEFIES THE LAWS OF THE SYSTEM.' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', difficulty: 'EXTREME', energy: '98,400 MP', desc: 'HIGH-LEVEL MAGICAL FLUCTUATIONS DETECTED. ELITE BOSS CONFIRMED.' },
    { id: 'g3', rank: 'B', name: 'FROZEN LABYRINTH', color: 'blue', difficulty: 'HARD', energy: '22,000 MP', desc: 'STABLE DUNGEON ENVIRONMENT. RECOMMENDED FOR HIGH-TIER HUNTERS.' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 font-sans selection:bg-white/30 pb-32 overflow-x-hidden">
      
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(30,58,138,0.2),transparent_80%)]" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      </div>

      <header className="relative z-10 flex flex-col items-center pt-10 mb-20">
        <h1 className="text-4xl font-[1000] tracking-[0.3em] uppercase italic text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
          GATE <span className="text-purple-600">RAID</span>
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <p className="text-[10px] font-black text-purple-400 tracking-[0.5em] uppercase">Dimensional Rift Detected</p>
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-32">
        {gates.map((gate) => (
          <div key={gate.id} className="relative pt-12">
            
            {/* البوابة العملاقة - تظهر فوق الكارد وتخرج منه */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 w-52 h-52 group cursor-pointer">
              {/* هالة الطاقة المتفجرة حول البوابة */}
              <div className={cn(
                "absolute inset-0 rounded-full blur-[40px] animate-pulse opacity-60 transition-all duration-700 group-hover:blur-[60px] group-hover:scale-125",
                gate.color === 'black' ? "bg-white/40" : gate.color === 'purple' ? "bg-purple-600/50" : "bg-blue-600/50"
              )} />
              
              {/* جسم البوابة الدائري الضخم */}
              <div className={cn(
                "relative w-full h-full rounded-full border-8 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform duration-500",
                gate.color === 'black' ? "border-white shadow-[0_0_40px_rgba(255,255,255,0.3)]" : 
                gate.color === 'purple' ? "border-purple-600 shadow-[0_0_40px_rgba(147,51,234,0.4)]" : 
                "border-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.4)]"
              )}>
                {/* الدوامة السحرية المتحركة */}
                <div className={cn(
                  "absolute inset-[-100%] animate-[spin_6s_linear_infinite] opacity-100",
                  gate.color === 'black' ? "bg-[conic-gradient(from_0deg,#000,#fff,#000,#888,#000)]" :
                  gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,#1e1b4b,#a855f7,#4c1d95,#7c3aed,#1e1b4b)]" :
                  "bg-[conic-gradient(from_0deg,#172554,#3b82f6,#1e3a8a,#2563eb,#172554)]"
                )} />
                
                {/* قلب الثقب الأسود */}
                <div className="absolute inset-[10%] rounded-full bg-black flex items-center justify-center">
                   <div className={cn(
                     "w-full h-full rounded-full opacity-40 animate-pulse",
                     gate.color === 'black' ? "bg-white/20" : gate.color === 'purple' ? "bg-purple-500/20" : "bg-blue-500/20"
                   )} />
                </div>
              </div>

              {/* رتبة البوابة - تطفو فوق البوابة نفسها */}
              <div className={cn(
                "absolute -top-2 -right-2 z-30 px-5 py-1 font-[1000] italic text-2xl border-2 shadow-2xl skew-x-[-15deg]",
                gate.color === 'black' ? "bg-white text-black border-slate-300" : 
                gate.color === 'purple' ? "bg-purple-600 text-white border-purple-300" : 
                "bg-blue-600 text-white border-blue-300"
              )}>
                {gate.rank}
              </div>
            </div>

            {/* كارد المعلومات - نظام الماركت */}
            <div className="relative bg-[#050b1a] border-2 border-slate-200/90 pt-36 p-6 shadow-[0_20px_60px_rgba(0,0,0,1)]">
              
              {/* عنوان البوابة (Market Header Style) */}
              <div className="flex justify-center mb-6">
                <div className="bg-slate-900 px-8 py-1.5 border border-slate-500/50 relative">
                   <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase italic">
                     {gate.name}
                   </h3>
                   <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
                   <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white" />
                </div>
              </div>

              {/* بيانات البوابة التقنية */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-l-2 border-slate-700 pl-3">
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Difficulty</p>
                  <p className="text-xs font-black text-white italic">{gate.difficulty}</p>
                </div>
                <div className="border-r-2 border-slate-700 text-right pr-3">
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Mana Output</p>
                  <p className="text-xs font-black text-white italic">{gate.energy}</p>
                </div>
              </div>

              {/* الوصف القتالي */}
              <div className="text-center mb-8 px-2">
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic uppercase tracking-tighter">
                  {gate.desc}
                </p>
              </div>

              {/* زر الدخول (The Deployment Button) */}
              <button className={cn(
                "w-full py-4 font-[1000] tracking-[0.5em] uppercase italic transition-all active:scale-95 group overflow-hidden relative",
                gate.color === 'black' ? "bg-white text-black" : 
                gate.color === 'purple' ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
              )}>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="flex items-center justify-center gap-3">
                  <Activity className="w-4 h-4" />
                  ENTER GATE
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* أرجل تقنية للكارد لزيادة الجبروت */}
            <div className="flex justify-between px-10 mt-[-2px]">
              <div className="w-1 h-4 bg-slate-700" />
              <div className="w-1 h-4 bg-slate-700" />
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
