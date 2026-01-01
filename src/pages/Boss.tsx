import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Activity, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  // استخدام رابط JSDelivr لضمان تشغيل الـ GIF من GitHub بدون حظر
  const portalImage = "https://cdn.jsdelivr.net/gh/r-shadows/sedark-1@main/portal.gif";

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'MONARCH OF VOID', color: 'black', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', glow: 'shadow-[0_0_100px_rgba(255,255,255,0.4)]', filter: 'brightness(1.1) contrast(1.2)' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', glow: 'shadow-[0_0_80px_rgba(168,85,247,0.5)]', filter: 'hue-rotate(250deg) brightness(1.2)' },
    { id: 'g3', rank: 'B', name: 'ICE CITADEL', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', glow: 'shadow-[0_0_60px_rgba(59,130,246,0.4)]', filter: 'hue-rotate(190deg) brightness(1.2)' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden">
      
      {/* نظام الخلفية */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,20,80,0.2),transparent_75%)]" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      </div>

      <header className="relative z-20 pt-16 pb-12 px-6 text-center">
        <div className="inline-block relative group">
          <div className="absolute -inset-8 bg-purple-900/20 blur-[100px] rounded-full animate-pulse" />
          <h1 className="relative text-6xl font-[1000] italic tracking-tighter uppercase leading-none">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 font-black">DUNGEON</span>
            <span className="block text-purple-600 drop-shadow-[0_0_15px_rgba(147,51,234,0.8)]">RECOGNITION</span>
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3 border-y border-purple-500/20 py-2">
            <ScanLine className="w-4 h-4 text-purple-500 animate-bounce" />
            <span className="text-[10px] font-black tracking-[0.8em] text-purple-200/50 uppercase">System Scanning...</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 space-y-48">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group max-w-md mx-auto">
            
            {/* واجهة التحذير */}
            <div className="absolute -top-14 -left-2 z-40 bg-black/95 border-l-4 border-purple-600 p-4 backdrop-blur-xl transform -skew-x-12 border-t border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className={cn("w-4 h-4 animate-pulse", gate.color === 'black' ? "text-red-500" : "text-purple-500")} />
                <span className="text-[8px] font-black tracking-widest text-gray-500 uppercase">Warning: Entity Detected</span>
              </div>
              <div className="text-2xl font-[1000] italic tracking-tighter uppercase text-white leading-none">{gate.type}</div>
            </div>

            {/* البوابة */}
            <div className="relative h-[480px] w-full flex items-center justify-center">
              
              <div className={cn(
                "absolute z-0 text-[22rem] font-[1000] italic leading-none select-none opacity-5 transition-all duration-1000 group-hover:opacity-15",
                gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-600" : "text-blue-600"
              )}>
                {gate.rank}
              </div>

              {/* حاوية البوابة المصلحة */}
              <div className={cn(
                "relative z-20 w-72 h-[440px] transition-all duration-700 overflow-hidden",
                "rounded-[50%_50%_45%_45%] border-[1px] border-white/20 bg-black",
                gate.glow
              )}>
                <img 
                  src={portalImage} 
                  alt="Portal" 
                  className="w-full h-full object-cover"
                  style={{ 
                    filter: gate.filter,
                    mixBlendMode: 'screen' // يحسن مظهر الـ GIF مع الخلفية السوداء
                  }}
                  unoptimized="true" // لضمان عدم قيام Framework بتقليل جودة الـ GIF
                />
                
                <div className="absolute inset-0 pointer-events-none z-30 opacity-30">
                   {[...Array(6)].map((_, i) => (
                     <div key={i} className="absolute bottom-0 left-1/2 w-[1px] h-40 bg-white blur-[2px] animate-rise" style={{animationDelay: `${i*0.5}s`, left: `${10 + i*16}%`}} />
                   ))}
                </div>
              </div>

              <button className="absolute -bottom-12 z-50 flex flex-col items-center group/btn active:scale-95 transition-all duration-300">
                <div className={cn(
                  "px-16 py-5 font-[1000] italic tracking-[0.7em] text-2xl skew-x-[-15deg] transition-all border-r-[6px] border-b-[6px]",
                  gate.color === 'black' ? "bg-white text-black border-gray-400 hover:bg-red-600 hover:text-white" :
                  gate.color === 'purple' ? "bg-purple-600 text-white border-purple-900 hover:bg-purple-500" :
                  "bg-blue-600 text-white border-blue-900 hover:bg-blue-500"
                )}>
                  ENTER
                </div>
              </button>
            </div>

            {/* البيانات السفلى */}
            <div className="mt-28 flex justify-between items-end px-4 font-black">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-600 text-[10px] italic tracking-widest uppercase">
                  <Activity className="w-3 h-3" /> Mana Resonance
                </div>
                <div className="text-4xl tracking-tighter text-white">
                  {gate.energy} <span className="text-xs text-slate-500 font-bold">MP</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-red-600 text-[11px] animate-pulse mb-2 font-black uppercase tracking-widest bg-red-950/30 px-2 py-0.5 rounded border border-red-900/50">
                  {gate.warning}
                </div>
                <div className="text-sm border-r-4 border-red-600 pr-4 py-2 italic font-black uppercase tracking-tighter">
                  Ranked: {gate.rank}
                </div>
              </div>
            </div>

          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes rise {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-300px); opacity: 0; }
        }
        .animate-rise {
          animation: rise 3s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Boss;
