import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Radio, ChevronRight, Activity, Zap, Target, Flame } from 'lucide-react';
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
    <div className="min-h-screen bg-[#020817] text-white p-3 font-sans selection:bg-white/30 pb-24 overflow-x-hidden">
      
      {/* Background FX - نظام مانا تقني */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.05),rgba(0,255,0,0.01),rgba(0,0,255,0.05))] bg-[size:100%_2px,2px_100%]" />
      </div>

      <header className="relative z-10 flex justify-between items-center mb-16 border-b border-slate-700/50 pb-4 px-2">
        <h1 className="text-xl font-[1000] tracking-[0.2em] uppercase italic text-white drop-shadow-[0_0_10px_white]">
          GATE RADAR
        </h1>
        <div className="bg-white/5 border border-white/20 px-3 py-1 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span className="font-mono font-bold text-white text-[10px] uppercase tracking-tighter">
            System Online
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-24">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group pt-10">
            
            {/* البوابة الجبارة - تبرز فوق الكارد مثل سولو ليفلينج */}
            <div className="absolute -top-16 left-6 z-20 w-32 h-32 pointer-events-none">
              {/* هالة التوهج الخلفي */}
              <div className={cn(
                "absolute inset-0 rounded-full blur-[30px] opacity-60 animate-pulse",
                gate.color === 'black' ? "bg-white" : gate.color === 'purple' ? "bg-purple-600" : "bg-blue-600"
              )} />
              
              {/* جسم البوابة الدائري مع التشققات */}
              <div className={cn(
                "relative w-full h-full rounded-full border-4 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,1)]",
                gate.color === 'black' ? "border-white" : gate.color === 'purple' ? "border-purple-500" : "border-blue-500"
              )}>
                {/* الدوامة - طاقة مفتوحة بالكامل */}
                <div className={cn(
                  "absolute inset-[-50%] animate-[spin_4s_linear_infinite]",
                  gate.color === 'black' ? "bg-[conic-gradient(from_0deg,#000,#fff,#888,#fff,#000)]" :
                  gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,#4c1d95,#a855f7,#000,#7c3aed,#4c1d95)]" :
                  "bg-[conic-gradient(from_0deg,#1e3a8a,#3b82f6,#000,#2563eb,#1e3a8a)]"
                )} />
                
                {/* تأثير التشققات (Dimensional Cracks) */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/criss-cross.png')] mix-blend-overlay" />
                
                {/* قلب البوابة المضيء (Open Core) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.6)_0%,transparent_70%)] animate-pulse" />
              </div>
              
              {/* رتبة البوابة - طافية فوق البوابة */}
              <div className={cn(
                "absolute -top-2 -right-2 z-30 px-3 py-0.5 text-xl font-[1000] italic border-2 skew-x-[-10deg] shadow-xl",
                gate.color === 'black' ? "bg-white text-black border-slate-300" : 
                gate.color === 'purple' ? "bg-purple-600 text-white border-purple-400" : 
                "bg-blue-600 text-white border-blue-400"
              )}>
                {gate.rank}
              </div>
            </div>

            {/* هيكل الكارد (نفس الكود الذي أرسلته) */}
            <div className="relative bg-black/80 border-2 border-slate-200/90 p-4 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
              
              {/* ترويسة البوابة المعلقة */}
              <div className="flex justify-end mb-6 mt-[-1.6rem]">
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

              {/* المحتوى الرئيسي بالعرض لترك مساحة للبوابة البارزة */}
              <div className="flex gap-4">
                {/* مساحة فارغة في اليسار محجوزة للبوابة الطافية */}
                <div className="w-28 h-24 flex-shrink-0" />

                {/* تفاصيل البيانات (Stats Section) */}
                <div className="flex-1 space-y-2 py-1 border-l border-white/10 pl-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1">
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest italic">Difficulty</p>
                    <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{gate.difficulty}</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-1">
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest italic">Mana Wave</p>
                    <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{gate.energy}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Zap className={cn("w-3 h-3 animate-pulse", gate.color === 'black' ? "text-white" : "text-yellow-500")} />
                    <span className="text-[8px] font-black uppercase text-slate-400">Scan Complete</span>
                  </div>
                </div>
              </div>

              {/* وصف البوابة */}
              <div className="mt-4 px-1 border-t border-white/5 pt-3">
                <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed uppercase tracking-tight text-center">
                   {gate.desc}
                </p>
              </div>

              {/* زر الدخول الاحترافي */}
              <button className={cn(
                "w-full mt-4 py-3 border transition-all active:scale-[0.97] flex items-center justify-center gap-3 group overflow-hidden relative shadow-lg",
                gate.color === 'black' ? "bg-white text-black font-black border-white" :
                gate.color === 'purple' ? "bg-purple-900/40 text-purple-400 border-purple-500/50 hover:bg-purple-900/60" :
                "bg-blue-900/40 text-blue-400 border-blue-500/50 hover:bg-blue-900/60"
              )}>
                <Flame className="w-4 h-4 fill-current group-hover:animate-bounce" />
                <span className="text-[10px] font-[1000] tracking-[0.4em] uppercase italic">ENTER INSTANCE</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
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
