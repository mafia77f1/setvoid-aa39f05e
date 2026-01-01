import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { ChevronRight, Zap, AlertTriangle, Activity, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'MONARCH OF VOID', color: 'black', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', glow: 'shadow-[0_0_120px_rgba(255,255,255,0.4)]', aura: 'rgba(255,255,255,0.1)' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', glow: 'shadow-[0_0_100px_rgba(168,85,247,0.6)]', aura: 'rgba(168,85,247,0.2)' },
    { id: 'g3', rank: 'B', name: 'ICE CITADEL', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', glow: 'shadow-[0_0_80px_rgba(59,130,246,0.5)]', aura: 'rgba(59,130,246,0.15)' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden">
      
      {/* خلفية النظام */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,20,80,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
      </div>

      <header className="relative z-20 pt-16 pb-12 px-6 text-center">
        <div className="inline-block relative group">
          <div className="absolute -inset-8 bg-purple-900/20 blur-[100px] rounded-full animate-pulse" />
          <h1 className="relative text-6xl font-[1000] italic tracking-tighter uppercase leading-none">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">DUNGEON</span>
            <span className="block text-purple-600 drop-shadow-[0_0_15px_rgba(147,51,234,0.8)]">RECOGNITION</span>
          </h1>
        </div>
      </header>

      <main className="relative z-10 px-6 space-y-40">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group max-w-md mx-auto">
            
            {/* واجهة معلومات النظام */}
            <div className="absolute -top-12 -left-4 z-40 bg-black/80 border-l-4 border-purple-600 p-3 backdrop-blur-md transform -skew-x-12 transition-transform group-hover:scale-110">
              <div className="flex items-center gap-2">
                <AlertTriangle className={cn("w-4 h-4", gate.color === 'black' ? "text-red-500" : "text-purple-500")} />
                <span className="text-[9px] font-black tracking-tighter text-gray-400 uppercase">Warning: Dimensional Instability</span>
              </div>
              <div className="text-xl font-black italic tracking-tighter">{gate.type}</div>
            </div>

            {/* الهيكل الدائري الجديد للبوابة */}
            <div className="relative h-[450px] w-full flex items-center justify-center">
              
              {/* الرتبة الخلفية */}
              <div className={cn(
                "absolute z-0 text-[20rem] font-[1000] italic leading-none select-none opacity-5 transition-all duration-700 group-hover:opacity-10",
                gate.color === 'black' ? "text-white" : gate.color === 'purple' ? "text-purple-600" : "text-blue-600"
              )}>
                {gate.rank}
              </div>

              {/* تأثير الهالة الدائرية الخارجية (Outer Aura) */}
              <div className={cn(
                "absolute w-[320px] h-[320px] rounded-full animate-[pulse_3s_infinite] transition-all duration-700",
                gate.glow
              )} style={{ background: `radial-gradient(circle, ${gate.aura} 0%, transparent 70%)` }} />

              {/* حاوية الـ GIF الدائرية (The Portal) */}
              <div className="relative w-72 h-72 rounded-full p-1 overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-gradient-to-t from-white/20 to-transparent">
                <div className="absolute inset-0 rounded-full border-2 border-white/10 z-10" />
                
                {/* طبقة التوهج الداخلي */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.8)_100%)] z-[5]" />
                
                <img 
                  src="/portal.gif" 
                  alt="Dungeon Portal" 
                  className="w-full h-full object-cover scale-150 mix-blend-screen brightness-150"
                />
              </div>

              {/* زر الدخول */}
              <button className="absolute -bottom-12 z-50 flex flex-col items-center group/btn">
                <div className={cn(
                  "px-12 py-5 font-[1000] italic tracking-[0.6em] text-xl skew-x-[-15deg] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
                  gate.color === 'black' ? "bg-white text-black hover:bg-red-600 hover:text-white" :
                  gate.color === 'purple' ? "bg-purple-600 text-white hover:bg-purple-400" :
                  "bg-blue-600 text-white hover:bg-blue-400"
                )}>
                  ENTER
                </div>
              </button>
            </div>

            {/* تفاصيل المقياس */}
            <div className="mt-28 flex justify-between items-end px-4 font-black">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] italic">
                  <Activity className="w-3 h-3" /> WAVE FREQUENCY
                </div>
                <div className="text-2xl tracking-tighter">{gate.energy} <span className="text-xs text-slate-600">MP</span></div>
              </div>
              <div className="text-right">
                <div className="text-red-500 text-[10px] animate-pulse mb-1">{gate.warning}</div>
                <div className="text-sm border-r-2 border-red-600 pr-2 uppercase">Rank: {gate.rank} Entity</div>
              </div>
            </div>

          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default Boss;
