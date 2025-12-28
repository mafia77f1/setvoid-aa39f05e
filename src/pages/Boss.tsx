import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Radio, ChevronRight, Activity, Flame, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'VOID MONARCH', color: 'black', difficulty: 'CALAMITY', energy: 'INFINITY', desc: 'A DIMENSIONAL RIFT THAT DEFIES SYSTEM LAWS. SURVIVAL CHANCE: 0.00%.' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', difficulty: 'EXTREME', energy: '98,400 MP', desc: 'HIGH-LEVEL MAGICAL FLUCTUATIONS DETECTED. ELITE BOSS CONFIRMED.' },
    { id: 'g3', rank: 'B', name: 'FROZEN LABYRINTH', color: 'blue', difficulty: 'HARD', energy: '22,000 MP', desc: 'STABLE DUNGEON ENVIRONMENT. RECOMMENDED FOR HIGH-TIER HUNTERS.' },
  ];

  return (
    <div className="min-h-screen bg-[#02050e] text-white p-4 font-sans selection:bg-white/30 pb-32 overflow-x-hidden">
      
      {/* Background - System Particles */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(30,58,138,0.3),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <header className="relative z-10 flex flex-col items-center pt-8 mb-24">
        <h1 className="text-4xl font-[1000] tracking-[0.3em] uppercase italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          GATE <span className="text-blue-600">SCANNER</span>
        </h1>
        <div className="flex items-center gap-3 mt-2 text-[10px] font-black text-slate-500 tracking-[0.4em] uppercase">
          <Target className="w-3 h-3 text-red-600 animate-ping" />
          Analyzing Dimensional Cracks
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-40">
        {gates.map((gate) => (
          <div key={gate.id} className="relative pt-16">
            
            {/* بوابة سولو ليفلينج - الجبروت المطلق */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-30 group cursor-pointer">
              
              {/* التشققات المكانية (Spatial Fractures) */}
              <div className="absolute inset-[-40px] pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 rotate-12 blur-sm" />
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 -rotate-12 blur-sm" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10 rotate-45 blur-md" />
              </div>

              {/* هالة الطاقة المتوهجة */}
              <div className={cn(
                "absolute inset-[-20px] rounded-full blur-[50px] animate-pulse opacity-60",
                gate.color === 'black' ? "bg-white/30" : gate.color === 'purple' ? "bg-purple-600/40" : "bg-blue-600/40"
              )} />
              
              {/* جسم البوابة الدائري الضخم */}
              <div className={cn(
                "relative w-56 h-56 rounded-full border-[6px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform duration-700 animate-[float_4s_easeInOut_infinite]",
                gate.color === 'black' ? "border-white shadow-[0_0_40px_rgba(255,255,255,0.4)]" : 
                gate.color === 'purple' ? "border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.5)]" : 
                "border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.5)]"
              )}>
                
                {/* الدوامة - قلب الطاقة المفتوح بالكامل */}
                <div className={cn(
                  "absolute inset-[-100%] animate-[spin_3s_linear_infinite] blur-[1px]",
                  gate.color === 'black' ? "bg-[conic-gradient(from_0deg,#000,#fff,#888,#fff,#000,#fff)]" :
                  gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,#4c1d95,#a855f7,#1e1b4b,#a855f7,#4c1d95)]" :
                  "bg-[conic-gradient(from_0deg,#1e3a8a,#3b82f6,#172554,#3b82f6,#1e3a8a)]"
                )} />
                
                {/* إضاءة "عين الإعصار" في المنتصف بدلاً من السواد */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_0%,transparent_70%)] opacity-80" />
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
              </div>

              {/* رتبة البوابة - ضخمة جداً */}
              <div className={cn(
                "absolute top-0 -right-4 z-40 px-6 py-2 font-[1000] italic text-4xl border-4 shadow-2xl skew-x-[-12deg]",
                gate.color === 'black' ? "bg-white text-black border-slate-300" : 
                gate.color === 'purple' ? "bg-purple-600 text-white border-purple-400" : 
                "bg-blue-600 text-white border-blue-400"
              )}>
                {gate.rank}
              </div>
            </div>

            {/* كارد الماركت - الهيكل الاحترافي */}
            <div className="relative bg-[#050a18]/95 border-2 border-white/80 pt-36 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
              
              {/* ترويسة العنوان (Market Style) */}
              <div className="absolute top-[-1.5rem] right-6">
                <div className={cn(
                  "px-8 py-1.5 border-2 bg-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.2)]",
                  gate.color === 'black' ? "border-white" : gate.color === 'purple' ? "border-purple-500" : "border-blue-500"
                )}>
                  <h2 className="text-[11px] font-black tracking-[0.3em] text-white uppercase italic">
                    OBJECTIVE DETECTED
                  </h2>
                </div>
              </div>

              {/* اسم الوحش/البوابة */}
              <div className="text-center mb-6 border-b border-white/10 pb-4">
                <h3 className="text-2xl font-[1000] text-white italic tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {gate.name}
                </h3>
              </div>

              {/* البيانات التقنية (Stats) */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 border-l-4 border-white/50 p-3">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Danger Rank</p>
                  <p className="text-xs font-black text-white italic">{gate.difficulty}</p>
                </div>
                <div className="bg-white/5 border-r-4 border-white/50 p-3 text-right">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Mana Wave</p>
                  <p className="text-xs font-black text-white italic">{gate.energy}</p>
                </div>
              </div>

              {/* الوصف */}
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed italic uppercase text-center mb-8 px-2 tracking-tight">
                {gate.desc}
              </p>

              {/* زر الدخول (The Raid Button) */}
              <button className={cn(
                "w-full py-4 font-[1000] text-xs tracking-[0.5em] uppercase italic transition-all active:scale-95 group overflow-hidden relative border-2",
                gate.color === 'black' ? "bg-white text-black border-white" : 
                "bg-transparent text-white border-white/40 hover:bg-white/10"
              )}>
                {/* تأثير اللمعان المتحرك */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="flex items-center justify-center gap-3">
                  <Flame className="w-4 h-4 fill-current" />
                  INITIALIZE RAID
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* أرجل القاعدة التقنية */}
            <div className="flex justify-between px-16 mt-[-2px]">
              <div className="w-2.5 h-6 bg-white shadow-[0_0_15px_white]" />
              <div className="w-2.5 h-6 bg-white shadow-[0_0_15px_white]" />
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
        @keyframes float {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -15px); }
        }
      `}</style>
    </div>
  );
};

export default Boss;
