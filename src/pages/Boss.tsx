import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Activity, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { 
      id: 'g0', rank: 'S', name: boss?.name || 'MONARCH OF VOID', color: 'black', 
      energy: 'UNMEASURABLE', glow: 'rgba(255,255,255,0.1)',
      info: 'الرتبة S: هي الأخطر على الإطلاق، وتحتاج إلى تعاون أقوى الصيادين لإغلاقها.'
    },
    { 
      id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', 
      energy: '98,400', glow: 'rgba(147,51,234,0.3)',
      info: 'الرتبة A و B: بوابات عالية المستوى تتطلب فرقاً منظمة من النقابات الكبرى.'
    },
    { 
      id: 'g3', rank: 'C', name: 'ICE CITADEL', color: 'blue', 
      energy: '22,000', glow: 'rgba(37,99,235,0.3)',
      info: 'الرتبة C و D و E: بوابات منخفضة إلى متوسطة المستوى.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden" dir="rtl">
      
      {/* خلفية سينمائية هادئة */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#0a0a1a_0%,#020205_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      </div>

      <header className="relative z-20 pt-16 pb-12 px-6 text-center text-right">
        <div className="inline-block relative">
          <h1 className="relative text-5xl font-[1000] italic tracking-tighter uppercase leading-none text-right">
            <span className="block text-white/90">DUNGEON</span>
            <span className="block text-purple-600 drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">RADAR</span>
          </h1>
          <div className="mt-4 flex items-center justify-start gap-3 opacity-50">
            <ScanLine className="w-4 h-4 text-purple-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase">SYSTEM_SCAN_ACTIVE</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 space-y-32">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group max-w-md mx-auto">
            
            {/* الهيكل البصري للبوابة */}
            <div className="relative h-[480px] w-full flex items-center justify-center cursor-pointer transition-transform duration-500 active:scale-95">
              
              {/* الرتبة الضخمة الخلفية */}
              <div className={cn(
                "absolute z-0 text-[16rem] font-[1000] italic leading-none select-none opacity-[0.03] transition-all duration-700 group-hover:opacity-10",
                gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-600" : "text-blue-600"
              )}>
                {gate.rank}
              </div>

              {/* بوابة المانا (The Vortex) */}
              <div className="relative w-72 h-full rounded-[48%_48%_35%_35%] border-[1px] border-white/10 shadow-2xl overflow-hidden bg-black">
                
                {/* طبقة الدوران العميق (الأساسية) */}
                <div className={cn(
                  "absolute inset-[-150%] animate-vortex-slow opacity-90",
                  gate.color === 'black' ? "bg-[conic-gradient(from_0deg,#000_0%,#333_25%,#000_50%,#555_75%,#000_100%)]" :
                  gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,#1e1b4b_0%,#a855f7_25%,#000_50%,#7c3aed_75%,#1e1b4b_100%)]" :
                  "bg-[conic-gradient(from_0deg,#082f49_0%,#3b82f6_25%,#000_50%,#0ea5e9_75%,#082f49_100%)]"
                )} style={{ filter: 'blur(30px)' }} />

                {/* طبقة الدوران السريع (الشرارات) */}
                <div className={cn(
                  "absolute inset-[-120%] animate-vortex-fast opacity-40 mix-blend-screen",
                  "bg-[conic-gradient(from_180deg,transparent_0%,white_5%,transparent_10%,white_50%,transparent_100%)]"
                )} style={{ filter: 'blur(2px)' }} />

                {/* غطاء الظل لإعطاء شكل الثقب الأسود في الوسط */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.8)_60%,#000_100%)] z-10" />

                {/* توهج الحواف الداخلي */}
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,1)] z-20" />
              </div>

              {/* هالة الضوء الخارجية خلف البوابة */}
              <div className="absolute inset-0 -z-10 blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" 
                   style={{ backgroundColor: gate.glow }} />
            </div>

            {/* تفاصيل المقياس (Mana Meter) */}
            <div className="mt-8 grid grid-cols-1 gap-4 px-4 font-black">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 text-slate-500 text-[9px] italic uppercase tracking-widest mb-1">
                    <Activity className="w-3 h-3 text-purple-500" /> تردد موجات المانا
                  </div>
                  <div className="text-4xl tracking-tighter font-sans">{gate.energy} <span className="text-xs text-slate-600">MP</span></div>
                </div>
                <div className="text-left font-sans text-3xl italic text-white/20 uppercase tracking-tighter">
                  RANK_{gate.rank}
                </div>
              </div>
              
              {/* النص الوصفي الذي طلبته */}
              <div className="p-3 bg-white/5 rounded-sm border-r-2 border-purple-600">
                <p className="text-[11px] leading-relaxed text-slate-300 font-bold italic">
                  {gate.info}
                </p>
              </div>
            </div>

          </div>
        ))}
      </main>

      <BottomNav />

      {/* الأنيميشن المخصص لضمان سلاسة الدوران وعدم التقطيع */}
      <style>{`
        @keyframes vortex-slow {
          from { transform: rotate(0deg) scale(1.2); }
          to { transform: rotate(360deg) scale(1.2); }
        }
        @keyframes vortex-fast {
          from { transform: rotate(360deg) scale(1); }
          to { transform: rotate(0deg) scale(1); }
        }
        .animate-vortex-slow {
          animation: vortex-slow 12s linear infinite;
          will-change: transform;
        }
        .animate-vortex-fast {
          animation: vortex-fast 6s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default Boss;
