import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Activity, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', color: 'red', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL', aura: 'shadow-[0_0_150px_rgba(220,38,38,0.5)]', border: 'border-red-600/50' },
    { id: 'g1', rank: 'A', color: 'purple', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS', aura: 'shadow-[0_0_130px_rgba(168,85,247,0.5)]', border: 'border-purple-600/50' },
    { id: 'g3', rank: 'B', color: 'blue', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE', aura: 'shadow-[0_0_100px_rgba(59,130,246,0.5)]', border: 'border-blue-600/50' },
  ];

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden">
      
      {/* تأثيرات خلفية النظام */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <header className="relative z-20 pt-16 pb-12 px-6 text-center">
        <h1 className="text-5xl font-[1000] italic tracking-tighter uppercase leading-none">
          <span className="block text-gray-500 text-2xl mb-2">SYSTEM IDENTIFIED</span>
          <span className="block text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">BOSS DOMAIN</span>
        </h1>
      </header>

      <main className="relative z-10 px-6 space-y-52">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group flex flex-col items-center max-w-md mx-auto">
            
            {/* عنوان البوابة فوق الدائرة */}
            <div className="absolute -top-16 z-30 transform -skew-x-12 bg-black/90 border-r-4 border-white px-6 py-2 shadow-2xl transition-transform group-hover:scale-110">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                <ScanLine className="w-3 h-3 text-red-500 animate-pulse" /> Scanning Rank {gate.rank}
              </div>
              <div className="text-2xl font-black italic">{gate.type}</div>
            </div>

            {/* الجسم الدائري للكارد (Circular Card Body) */}
            <div className={cn(
              "relative w-[340px] h-[340px] rounded-full flex items-center justify-center transition-all duration-700 ease-in-out",
              "border-[1px] bg-black/40 backdrop-blur-sm",
              gate.border,
              gate.aura, // الهالة القوية
              "group-hover:scale-105"
            )}>
              
              {/* الرتبة الخلفية (Rank) داخل الدائرة */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 font-[1000] italic text-[14rem] pointer-events-none select-none">
                {gate.rank}
              </div>

              {/* البوابة الـ GIF (Circular Portal) */}
              <div className="relative w-[280px] h-[280px] rounded-full overflow-hidden border-4 border-white/5 z-10 shadow-inner">
                 <img 
                  src="/portal.gif" 
                  alt="Dungeon Entrance" 
                  className="w-full h-full object-cover scale-125 brightness-110 contrast-125 mix-blend-screen"
                />
                {/* طبقة سواد متدرج لإعطاء عمق ثقبي */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,black_100%)]" />
              </div>

              {/* هالة النبض (Pulsing Aura Effect) */}
              <div className={cn(
                "absolute inset-[-20px] rounded-full border border-white/10 animate-[ping_3s_infinite] opacity-20",
                gate.color === 'red' ? "border-red-500" : "border-purple-500"
              )} />

              {/* زر الدخول (بشكل دائري منحني أسفل الكارد) */}
              <button className="absolute -bottom-6 z-40 group/btn">
                <div className={cn(
                  "px-10 py-4 font-black italic tracking-[0.5em] text-lg skew-x-[-15deg] transition-all",
                  "shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/20",
                  gate.color === 'red' ? "bg-red-600 text-white hover:bg-white hover:text-red-600" :
                  gate.color === 'purple' ? "bg-purple-600 text-white hover:bg-white hover:text-purple-600" :
                  "bg-blue-600 text-white hover:bg-white hover:text-blue-600"
                )}>
                  ENTER
                </div>
              </button>
            </div>

            {/* تفاصيل المقياس السفلي */}
            <div className="mt-20 w-full max-w-[280px] space-y-4">
              <div className="flex justify-between items-end border-b border-white/10 pb-2">
                <div className="text-[10px] font-bold text-gray-500 uppercase italic flex items-center gap-1">
                   <Activity className="w-3 h-3 text-red-500" /> Mana Readings
                </div>
                <div className="text-xl font-black tracking-tighter text-white">{gate.energy} <span className="text-[10px] text-gray-600">MP</span></div>
              </div>
              <div className="text-center">
                <div className="text-red-500 text-[10px] font-black animate-pulse uppercase tracking-[0.2em]">
                  {gate.warning}
                </div>
              </div>
            </div>

          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Boss;
