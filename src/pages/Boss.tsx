import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { ChevronRight, Zap, AlertTriangle, Activity, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'MONARCH OF VOID', color: 'black', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', glow: 'shadow-[0_0_100px_rgba(255,255,255,0.2)]' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', glow: 'shadow-[0_0_80px_rgba(168,85,247,0.4)]' },
    { id: 'g3', rank: 'B', name: 'ICE CITADEL', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', glow: 'shadow-[0_0_60px_rgba(59,130,246,0.3)]' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden">
      
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
            
            {/* واجهة معلومات النظام (Floating UI) */}
            <div className="absolute -top-12 -left-4 z-40 bg-black/80 border-l-4 border-purple-600 p-3 backdrop-blur-md transform -skew-x-12 transition-transform group-hover:scale-110">
              <div className="flex items-center gap-2">
                <AlertTriangle className={cn("w-4 h-4", gate.color === 'black' ? "text-red-500" : "text-purple-500")} />
                <span className="text-[9px] font-black tracking-tighter text-gray-400">WARNING: HIGH-LEVEL ENTITY DETECTED</span>
              </div>
              <div className="text-xl font-black italic tracking-tighter">{gate.type}</div>
            </div>

            {/* الهيكل البصري للبوابة (The Core - Updated to GIF) */}
            <div className="relative h-[500px] w-full flex items-center justify-center">
              
              {/* الرتبة الضخمة الخلفية */}
              <div className={cn(
                "absolute z-0 text-[18rem] font-[1000] italic leading-none select-none opacity-5 transition-all duration-700 group-hover:opacity-20 group-hover:scale-110",
                gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-600" : "text-blue-600"
              )}>
                {gate.rank}
              </div>

              {/* بوابة الـ GIF */}
              <div className={cn(
                "relative w-80 h-full flex items-center justify-center transition-all duration-500",
                gate.glow // الحفاظ على التوهج الملون خلف الـ GIF
              )}>
                <img 
                  src="/portal.gif" 
                  alt="Dungeon Portal" 
                  className="w-full h-full object-contain mix-blend-screen brightness-125 transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* تأثير جزيئات المانا الصاعدة (بقي كما هو لزيادة الحيوية) */}
                <div className="absolute inset-0 pointer-events-none">
                   {[...Array(5)].map((_,i) => (
                     <div key={i} className="absolute bottom-10 left-1/2 w-1 h-20 bg-white/20 blur-sm animate-rise opacity-0" style={{animationDelay: `${i*0.5}s`, left: `${30 + i*10}%`}} />
                   ))}
                </div>
              </div>

              {/* زر الدخول (System Prompt Style) */}
              <button className={cn(
                "absolute -bottom-8 z-50 flex flex-col items-center group/btn",
                "transition-transform hover:scale-105 active:scale-95"
              )}>
                <div className={cn(
                  "px-12 py-5 font-[1000] italic tracking-[0.6em] text-xl skew-x-[-15deg] transition-all",
                  gate.color === 'black' ? "bg-white text-black hover:bg-red-600 hover:text-white" :
                  gate.color === 'purple' ? "bg-purple-600 text-white hover:bg-purple-400" :
                  "bg-blue-600 text-white hover:bg-blue-400"
                )}>
                  ENTER
                </div>
                <div className="mt-2 h-1 w-full bg-white/20 overflow-hidden">
                   <div className="h-full bg-white animate-[loading_2s_infinite]" />
                </div>
              </button>
            </div>

            {/* تفاصيل المقياس (Mana Meter) */}
            <div className="mt-20 flex justify-between items-end px-4 font-black">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] italic">
                  <Activity className="w-3 h-3" /> WAVE FREQUENCY
                </div>
                <div className="text-2xl tracking-tighter">{gate.energy} <span className="text-xs text-slate-600">MP</span></div>
              </div>
              <div className="text-right">
                <div className="text-red-500 text-[10px] animate-pulse mb-1">{gate.warning}</div>
                <div className="text-sm border-r-2 border-red-600 pr-2">THREAT LEVEL: {gate.rank}</div>
              </div>
            </div>

          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-200px) scale(0); opacity: 0; }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-rise {
          animation: rise 3s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Boss;
