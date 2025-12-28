Import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { ChevronRight, Zap, LocateFixed, crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'MONARCH OF VOID', color: 'black', type: 'RED GATE', energy: 'LIMIT BRAKER', warning: 'IMMEDIATE DEATH PERIL' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS' },
    { id: 'g3', rank: 'B', name: 'ICE CITADEL', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE' },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-white/30 pb-32 overflow-x-hidden">
      
      {/* تأثير جزيئات المانا في الخلفية */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,1))]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse" />
      </div>

      <header className="relative z-20 pt-12 pb-6 px-6 text-center">
        <div className="inline-block relative">
          <div className="absolute -inset-4 bg-purple-600/20 blur-3xl rounded-full" />
          <h1 className="relative text-5xl font-[1000] italic tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            Dungeon <span className="text-purple-600">Gate</span>
          </h1>
          <div className="mt-2 flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/50" />
            <span className="text-[10px] font-black tracking-[0.6em] text-slate-400 uppercase">Detection Radar</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/50" />
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 space-y-20">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group max-w-sm mx-auto">
            
            {/* عنوان البوابة فوقها مباشرة */}
            <div className="mb-6 flex flex-col items-center">
               <span className={cn(
                 "px-4 py-0.5 text-[10px] font-black tracking-[0.4em] skew-x-[-20deg] border-x-2 mb-2",
                 gate.color === 'black' ? "border-white text-white" : gate.color === 'purple' ? "border-purple-500 text-purple-400" : "border-blue-500 text-blue-400"
               )}>
                 {gate.type}
               </span>
               <h2 className="text-2xl font-black tracking-tight uppercase group-hover:tracking-[0.1em] transition-all duration-500">
                 {gate.name}
               </h2>
            </div>

            {/* الجبروت البصري - شكل البوابة الضخم */}
            <div className="relative h-[450px] w-full flex items-center justify-center perspective-1000">
              
              {/* الرتبة المعلقة بجانب البوابة */}
              <div className={cn(
                "absolute -left-4 top-1/2 -translate-y-1/2 z-30 text-7xl font-[1000] italic opacity-20 select-none group-hover:opacity-100 transition-opacity",
                gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-900" : "text-blue-900"
              )}>
                {gate.rank}
              </div>

              {/* هيكل البوابة الفعلي */}
              <div className={cn(
                "relative w-64 h-full rounded-[100%_100%_40%_40%] overflow-hidden border-4 transition-all duration-700 shadow-[0_0_100px_rgba(0,0,0,1)] group-hover:scale-105",
                gate.color === 'black' ? "border-white shadow-[0_0_60px_rgba(255,255,255,0.2)]" : 
                gate.color === 'purple' ? "border-purple-600 shadow-[0_0_60px_rgba(147,51,234,0.3)]" : 
                "border-blue-600 shadow-[0_0_60px_rgba(37,99,235,0.3)]"
              )}>
                
                {/* الدوامة السحرية المتحركة - Portal Heart */}
                <div className={cn(
                  "absolute inset-[-100%] animate-[spin_15s_linear_infinite]",
                  gate.color === 'black' ? "bg-[conic-gradient(from_0deg,#000,#fff,#000,#888,#000)]" :
                  gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,#1e1b4b,#a855f7,#4c1d95,#7c3aed,#1e1b4b)]" :
                  "bg-[conic-gradient(from_0deg,#172554,#3b82f6,#1e3a8a,#2563eb,#172554)]"
                )} />

                {/* طبقة الضباب السحري */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.8)_90%)]" />
                
                {/* نبض المركز */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className={cn(
                     "w-1 h-full opacity-40 blur-md animate-[pulse_2s_infinite]",
                     gate.color === 'black' ? "bg-white" : "bg-white/50"
                   )} />
                </div>
              </div>

              {/* زر الدخول المدمج أسفل البوابة كقاعدة */}
              <button className={cn(
                "absolute bottom-[-20px] z-30 px-10 py-4 font-black tracking-[0.5em] uppercase italic transition-all active:scale-90",
                gate.color === 'black' ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.3)]" :
                gate.color === 'purple' ? "bg-purple-600 text-white shadow-[0_10px_30px_rgba(147,51,234,0.4)]" :
                "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)]"
              )}>
                ENTER
              </button>
            </div>

            {/* بيانات الطاقة أسفل البوابة */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-3 flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-500 uppercase italic">Mana Power</span>
                <span className="text-sm font-bold tracking-widest">{gate.energy}</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-500 uppercase italic">System Scan</span>
                <span className={cn(
                  "text-[10px] font-black animate-pulse",
                  gate.color === 'black' ? "text-red-500" : "text-green-500"
                )}>{gate.warning}</span>
              </div>
            </div>
          </div>
        ))}
      </main>

      <BottomNav />

      {/* الأنيميشن المخصص للجبروت */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default Boss;

هذا كود من تطبيقي الي اريدو يكون مثل نظام سولو ليفلينج يعني مثل نظام البوابات التي ذكرتها وا كل شي ذكرتة اريدو هنا وا اريد منك تحسن الشكل ليصبح جبروت
