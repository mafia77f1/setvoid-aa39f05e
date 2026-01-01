import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Activity, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'MONARCH OF VOID', color: 'black', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', glow: 'shadow-[0_0_100px_rgba(255,255,255,0.2)]', filter: 'brightness(1.2) contrast(1.2)' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', glow: 'shadow-[0_0_80px_rgba(168,85,247,0.4)]', filter: 'hue-rotate(240deg) brightness(1.1)' },
    { id: 'g3', rank: 'B', name: 'ICE CITADEL', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', glow: 'shadow-[0_0_60px_rgba(59,130,246,0.3)]', filter: 'hue-rotate(180deg) brightness(1.1)' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden">
      
      {/* خلفية النظام */}
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
            <span className="block text-purple-600 drop-shadow-[0_0_15px_rgba(147,51,234,0.8)]">RECOGNITION</span>
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3">
            <ScanLine className="w-4 h-4 text-purple-500 animate-bounce" />
            <span className="text-[10px] font-black tracking-[0.8em] text-purple-200/50 uppercase">System Scanning Terrain...</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 space-y-40">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group max-w-md mx-auto">
            
            {/* واجهة معلومات النظام */}
            <div className="absolute -top-12 -left-4 z-40 bg-black/90 border-l-4 border-purple-600 p-3 backdrop-blur-md transform -skew-x-12 transition-transform group-hover:scale-110 border-r border-t border-white/10">
              <div className="flex items-center gap-2">
                <AlertTriangle className={cn("w-4 h-4", gate.color === 'black' ? "text-red-500" : "text-purple-500")} />
                <span className="text-[9px] font-black tracking-tighter text-gray-400 uppercase">Warning: High-Level Entity Detected</span>
              </div>
              <div className="text-xl font-black italic tracking-tighter uppercase">{gate.type}</div>
            </div>

            {/* الهيكل البصري للبوابة */}
            <div className="relative h-[450px] w-full flex items-center justify-center">
              
              {/* الرتبة الضخمة الخلفية */}
              <div className={cn(
                "absolute z-0 text-[20rem] font-[1000] italic leading-none select-none opacity-10 transition-all duration-700 group-hover:opacity-25 group-hover:scale-110",
                gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-600" : "text-blue-600"
              )}>
                {gate.rank}
              </div>

              {/* حاوية البوابة المتحركة */}
              <div className={cn(
                "relative z-10 w-64 h-[400px] overflow-hidden transition-all duration-500",
                "rounded-[50%_50%_45%_45%] border-2 border-white/10",
                gate.glow
              )}>
                <img 
                  src="/portal.gif" 
                  alt="Dungeon Portal" 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  style={{ filter: gate.filter }}
                  onError={(e) => {
                    // في حال لم يجد المسار، سيظهر لون بديل بدلاً من مساحة فارغة
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.style.background = 'radial-gradient(circle, #2e1065 0%, #000 100%)';
                  }}
                />
                
                {/* تأثير مانا إضافي فوق الصورة */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 pointer-events-none">
                   {[...Array(6)].map((_, i) => (
                     <div key={i} className="absolute bottom-0 left-1/2 w-[2px] h-24 bg-white/30 blur-[2px] animate-rise opacity-0" style={{animationDelay: `${i*0.4}s`, left: `${15 + i*14}%`}} />
                   ))}
                </div>
              </div>

              {/* زر الدخول */}
              <button className="absolute -bottom-10 z-50 flex flex-col items-center group/btn transition-transform hover:scale-105 active:scale-95">
                <div className={cn(
                  "px-14 py-4 font-[1000] italic tracking-[0.6em] text-xl skew-x-[-15deg] transition-all border-r-4 border-b-4 shadow-xl",
                  gate.color === 'black' ? "bg-white text-black border-gray-400 hover:bg-red-600 hover:text-white hover:border-red-800" :
                  gate.color === 'purple' ? "bg-purple-600 text-white border-purple-900 hover:bg-purple-500" :
                  "bg-blue-600 text-white border-blue-900 hover:bg-blue-500"
                )}>
                  ENTER
                </div>
                <div className="mt-3 h-1 w-32 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-white animate-[loading_1.5s_infinite]" />
                </div>
              </button>
            </div>

            {/* إحصائيات المانا */}
            <div className="mt-24 flex justify-between items-end px-4 font-black">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] italic">
                  <Activity className="w-3 h-3" /> MANA FREQUENCY
                </div>
                <div className="text-3xl tracking-tighter tabular-nums">
                  {gate.energy} <span className="text-[10px] text-slate-600">MP / LEVEL</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-red-500 text-[10px] animate-pulse mb-1 font-bold uppercase tracking-widest">{gate.warning}</div>
                <div className="text-sm border-r-4 border-red-600 pr-3 py-1 bg-red-950/20 italic">
                  THREAT: RANK {gate.rank}
                </div>
              </div>
            </div>

          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes rise {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-250px) scaleX(2); opacity: 0; }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-rise {
          animation: rise 2.5s infinite ease-out;
        }
      `}</style>
    </div>
  );
};

export default Boss;
