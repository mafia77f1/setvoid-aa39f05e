import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { ChevronRight, Zap, AlertTriangle, Activity, ScanLine, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { 
      id: 'g0', 
      rank: 'S', 
      name: boss?.name || 'MONARCH OF VOID', 
      color: 'black', 
      type: 'RED GATE', 
      energy: 'UNMEASURABLE', 
      warning: 'IMMEDIATE DEATH PERIL', 
      glow: 'shadow-[0_0_100px_rgba(255,255,255,0.2)]',
      info: 'الرتبة S: هي الأخطر على الإطلاق، وتحتاج إلى تعاون أقوى الصيادين لإغلاقها.'
    },
    { 
      id: 'g1', 
      rank: 'A', 
      name: 'SHADOW FORTRESS', 
      color: 'purple', 
      type: 'ELITE DUNGEON', 
      energy: '98,400', 
      warning: 'HIGH MANA READINGS', 
      glow: 'shadow-[0_0_80px_rgba(168,85,247,0.4)]',
      info: 'الرتبة A و B: بوابات عالية المستوى تتطلب فرقاً منظمة من النقابات الكبرى.'
    },
    { 
      id: 'g3', 
      rank: 'C', 
      name: 'ICE CITADEL', 
      color: 'blue', 
      type: 'NORMAL GATE', 
      energy: '22,000', 
      warning: 'STABLE ENTRANCE', 
      glow: 'shadow-[0_0_60px_rgba(37,99,235,0.3)]',
      info: 'الرتبة C و D و E: بوابات منخفضة إلى متوسطة المستوى.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden text-right" dir="rtl">
      
      {/* خلفية ديناميكية: مانا مضطربة */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,20,80,0.15),transparent_70%)]" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
      </div>

      <header className="relative z-20 pt-16 pb-12 px-6 text-center">
        <div className="inline-block relative group">
          <div className="absolute -inset-8 bg-purple-900/20 blur-[100px] rounded-full animate-pulse" />
          <h1 className="relative text-6xl font-[1000] italic tracking-tighter uppercase leading-none">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">DUNGEON</span>
            <span className="block text-purple-600 drop-shadow-[0_0_15px_rgba(147,51,234,0.8)] font-sans">RECOGNITION</span>
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3">
            <ScanLine className="w-4 h-4 text-purple-500 animate-bounce" />
            <span className="text-[10px] font-black tracking-[0.8em] text-purple-200/50 uppercase">جاري مسح طاقة المانا...</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 space-y-52">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group max-w-md mx-auto">
            
            {/* واجهة معلومات النظام (Floating UI) */}
            <div className="absolute -top-14 right-0 z-40 bg-black/80 border-r-4 border-purple-600 p-4 backdrop-blur-md transform skew-x-12 transition-transform group-hover:scale-105 shadow-2xl">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className={cn("w-4 h-4", gate.color === 'black' ? "text-red-500" : "text-purple-500")} />
                <span className="text-[9px] font-black tracking-tighter text-gray-400 uppercase">Warning: Mana Measurement</span>
              </div>
              <div className="text-xl font-black italic tracking-tighter text-left uppercase">{gate.type}</div>
              <p className="text-[10px] text-zinc-400 mt-2 font-bold max-w-[200px] leading-relaxed">
                {gate.info}
              </p>
            </div>

            {/* الهيكل البصري للبوابة (The Core) */}
            <div className="relative h-[500px] w-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform duration-300">
              
              {/* الرتبة الضخمة الخلفية */}
              <div className={cn(
                "absolute z-0 text-[18rem] font-[1000] italic leading-none select-none opacity-5 transition-all duration-700 group-hover:opacity-25 group-hover:scale-110",
                gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-600" : "text-blue-600"
              )}>
                {gate.rank}
              </div>

              {/* تأثير التمزق والدوران (The Rift) */}
              <div className={cn(
                "relative w-72 h-full rounded-[45%_45%_40%_40%] transition-all duration-700 ease-out",
                "before:absolute before:inset-[-20px] before:rounded-[inherit] before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent before:animate-pulse",
                gate.glow
              )}>
                
                {/* الدوامة الداخلية - تحسين الدوران هنا */}
                <div className={cn(
                  "absolute inset-0 rounded-[inherit] overflow-hidden border-[2px] border-white/10 shadow-inner",
                  "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,transparent_20%,black_95%)]"
                )}>
                  {/* طبقة الدوران الأساسية */}
                  <div className={cn(
                    "absolute inset-[-180%] animate-[spin_8s_linear_infinite] opacity-80",
                    gate.color === 'black' ? "bg-[conic-gradient(from_0deg,#000,#444,#000,#fff,#000)]" :
                    gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,#1e1b4b,#a855f7,#000,#7c3aed,#1e1b4b)]" :
                    "bg-[conic-gradient(from_0deg,#172554,#3b82f6,#000,#2563eb,#172554)]"
                  )} />
                  
                  {/* طبقة دوران عكسية لزيادة الجبروت */}
                  <div className={cn(
                    "absolute inset-[-150%] animate-[spin_15s_linear_infinite_reverse] opacity-30 mix-blend-overlay",
                    "bg-[conic-gradient(from_180deg,transparent,white,transparent)]"
                  )} />
                </div>

                {/* تأثير جزيئات المانا الصاعدة */}
                <div className="absolute inset-0 pointer-events-none">
                   {[...Array(6)].map((_,i) => (
                     <div key={i} className="absolute bottom-0 left-1/2 w-[2px] h-32 bg-white/30 blur-sm animate-rise opacity-0" 
                          style={{animationDelay: `${i*0.4}s`, left: `${15 + i*14}%`}} />
                   ))}
                </div>
              </div>
            </div>

            {/* تفاصيل المقياس (Mana Meter) */}
            <div className="mt-16 flex justify-between items-end px-4 font-black border-t border-white/5 pt-6">
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] italic">
                  <Activity className="w-3 h-3 text-purple-500" /> تردد موجات المانا
                </div>
                <div className="text-3xl tracking-tighter font-sans">{gate.energy} <span className="text-xs text-slate-600 font-sans">MP</span></div>
              </div>
              <div className="text-left">
                <div className="text-red-500 text-[10px] animate-pulse mb-1 font-sans">{gate.warning}</div>
                <div className="text-sm border-l-2 border-red-600 pl-2 uppercase italic tracking-widest font-sans">THREAT: {gate.rank}</div>
              </div>
            </div>

          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          30% { opacity: 0.7; }
          100% { transform: translateY(-250px) scale(0); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-rise {
          animation: rise 3s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Boss;
