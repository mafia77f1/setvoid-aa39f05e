import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Activity, ScanLine } from 'lucide-react';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', type: 'RED GATE', energy: 'UNMEASURABLE', warning: 'IMMEDIATE DEATH PERIL' },
    { id: 'g1', rank: 'A', type: 'ELITE DUNGEON', energy: '98,400', warning: 'HIGH MANA READINGS' },
    { id: 'g2', rank: 'B', type: 'NORMAL GATE', energy: '22,000', warning: 'STABLE ENTRANCE' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-40 font-sans">

      {/* الهيدر */}
      <header className="pt-16 pb-12 text-center relative z-10">
        <h1 className="text-5xl font-black italic">DUNGEON RECOGNITION</h1>
        <div className="mt-4 flex justify-center items-center gap-2 text-purple-500">
          <ScanLine className="w-4 h-4 animate-pulse" />
          <span className="text-xs tracking-widest">SYSTEM SCANNING</span>
        </div>
      </header>

      {/* البوابات */}
      <main className="space-y-40 px-6 relative z-0">
        {gates.map((gate) => (
          <div key={gate.id} className="max-w-md mx-auto relative">

            {/* تحذير */}
            <div className="absolute -top-10 left-0 bg-black border-l-4 border-red-600 p-2 z-20">
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                {gate.type}
              </div>
            </div>

            {/* ===== البوابة الجديدة ===== */}
            <div className="relative h-[520px] flex items-center justify-center">

              {/* هالة خلفية */}
              <div className="absolute inset-0 blur-3xl bg-purple-800/20 rounded-full" />

              {/* GIF البوابة */}
              <img
                src="/portal.gif"
                alt="Dungeon Portal"
                className="relative z-10 h-full object-contain"
              />

              {/* رتبة البوابة */}
              <div className="absolute z-20 text-[14rem] font-black italic opacity-10">
                {gate.rank}
              </div>

              {/* زر الدخول */}
              <button className="absolute -bottom-10 z-30">
                <div className="px-12 py-4 bg-purple-600 font-black tracking-[0.5em] italic hover:bg-purple-400 transition">
                  ENTER
                </div>
              </button>
            </div>

            {/* معلومات الطاقة والتحذيرات */}
            <div className="mt-20 flex justify-between px-4 font-bold">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Activity className="w-3 h-3" />
                  MANA OUTPUT
                </div>
                <div className="text-2xl">{gate.energy}</div>
              </div>
              <div className="text-right text-red-500 text-xs animate-pulse">
                {gate.warning}
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
