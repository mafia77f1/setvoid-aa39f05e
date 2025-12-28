import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Info, ShieldAlert, Zap, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const [showWarning, setShowWarning] = useState(false);
  const [selectedGate, setSelectedGate] = useState<any>(null);

  const gates = [
    { 
      id: 'g-s', 
      rank: 'S', 
      name: 'THE VOID MONARCH', 
      color: 'red', 
      type: 'RED GATE', 
      mana: 'UNMEASURABLE', 
      desc: 'الأخطر على الإطلاق، تحتاج إلى تعاون أقوى صيادي الرتبة S لإغلاقها.' 
    },
    { 
      id: 'g-a', 
      rank: 'A', 
      name: 'SHADOW FORTRESS', 
      color: 'purple', 
      type: 'ELITE DUNGEON', 
      mana: '98,400', 
      desc: 'بوابة عالية المستوى تتطلب فرقاً منظمة من النقابات الكبرى.' 
    },
    { 
      id: 'g-b', 
      rank: 'B', 
      name: 'ICE CITADEL', 
      color: 'blue', 
      type: 'NORMAL GATE', 
      mana: '22,000', 
      desc: 'بوابة عالية المستوى تتطلب فرقاً منظمة من النقابات الكبرى.' 
    },
    { 
      id: 'g-e', 
      rank: 'E', 
      name: 'STRAY GOBLIN DEN', 
      color: 'green', 
      type: 'LOW GATE', 
      mana: '1,200', 
      desc: 'بوابات منخفضة المستوى، كان يرتادها سونغ جين-وو في بداياته.' 
    },
  ];

  const handleGateClick = (gate: any) => {
    setSelectedGate(gate);
    setShowWarning(true);
    // إخفاء التحذير تلقائياً بعد 4 ثوانٍ
    setTimeout(() => setShowWarning(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-red-500/30 pb-40 overflow-x-hidden">
      
      {/* تأثير المانا في الخلفية */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,1))]" />
      </div>

      {/* نافذة تحذير النظام (System Alert Card) */}
      {showWarning && (
        <div className="fixed inset-x-6 top-1/4 z-[100] animate-in fade-in zoom-in duration-300">
          <div className="bg-black/90 border-2 border-red-600 p-6 shadow-[0_0_50px_rgba(220,38,38,0.5)] backdrop-blur-xl transform -skew-x-6">
            <div className="flex items-center gap-4 mb-4 border-b border-red-600/50 pb-2">
              <div className="bg-red-600 p-1 animate-pulse">
                <Skull size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-red-600 font-[1000] italic tracking-tighter text-xl uppercase">System Warning</h3>
                <p className="text-[10px] text-white/60 font-black tracking-widest uppercase">Danger Level: Extreme</p>
              </div>
            </div>
            <p className="text-white font-black text-sm mb-4 leading-relaxed tracking-tight italic">
              [تحذير: طاقة المانا المنبعثة من هذه البوابة تتجاوز قدراتك الحالية بمراحل. الدخول قد يؤدي إلى الموت المحتم.]
            </p>
            <div className="flex justify-end">
              <span className="text-[10px] text-red-500 font-black animate-bounce tracking-[0.3em]">RECALIBRATING...</span>
            </div>
          </div>
        </div>
      )}

      <header className="relative z-20 pt-16 pb-12 px-6 text-center">
        <h1 className="text-5xl font-[1000] italic tracking-tighter uppercase">
          Dungeon <span className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">Gates</span>
        </h1>
        <p className="text-[10px] font-black tracking-[0.5em] text-slate-500 mt-2">MANA MEASUREMENT SYSTEM</p>
      </header>

      <main className="relative z-10 px-6 space-y-48">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group max-w-sm mx-auto">
            
            {/* معلومات البوابة العلوية */}
            <div className="mb-6 text-center">
               <span className={cn(
                 "px-4 py-0.5 text-[10px] font-black tracking-[0.4em] border-x-2 mb-2 inline-block",
                 gate.color === 'red' ? "border-red-600 text-red-500" : 
                 gate.color === 'purple' ? "border-purple-600 text-purple-500" : "border-blue-600 text-blue-500"
               )}>
                 {gate.type}
               </span>
               <h2 className="text-2xl font-[1000] italic tracking-tight uppercase group-hover:scale-110 transition-transform duration-500">
                 {gate.name}
               </h2>
            </div>

            {/* البوابة التفاعلية */}
            <div 
              onClick={() => handleGateClick(gate)}
              className="relative h-[450px] w-full cursor-pointer group-hover:scale-105 transition-transform duration-700 active:scale-95"
            >
              {/* الرتبة الخلفية */}
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <span className="text-[18rem] font-[1000] italic opacity-5 group-hover:opacity-20 transition-opacity">
                  {gate.rank}
                </span>
              </div>

              {/* هيكل الدوران (Vortex) */}
              <div className={cn(
                "relative w-64 h-full mx-auto rounded-[50%_50%_40%_40%] overflow-hidden border-4 shadow-2xl transition-all duration-500",
                gate.color === 'red' ? "border-red-600 shadow-red-900/40" : 
                gate.color === 'purple' ? "border-purple-600 shadow-purple-900/40" : "border-blue-600 shadow-blue-900/40"
              )}>
                
                {/* طبقة الدوران السحري */}
                <div className={cn(
                  "absolute inset-[-100%] animate-[spin_12s_linear_infinite]",
                  gate.color === 'red' ? "bg-[conic-gradient(from_0deg,#000,#7f1d1d,#000,#ef4444,#000)]" :
                  gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,#000,#581c87,#000,#a855f7,#000)]" :
                  "bg-[conic-gradient(from_0deg,#000,#1e3a8a,#000,#3b82f6,#000)]"
                )} />
                
                {/* تأثير الضباب والعمق */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.9)_90%)]" />
                
                {/* نبض المركز */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-full bg-white/10 blur-xl animate-pulse" />
                </div>
              </div>
            </div>

            {/* تفاصيل الرتبة والمانا (أسفل البوابة) */}
            <div className="mt-12 bg-white/5 border border-white/10 p-4 backdrop-blur-sm relative z-20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-1 text-[8px] font-black text-slate-500 italic uppercase">
                    <ShieldAlert size={10} /> Mana Readout
                  </div>
                  <div className="text-xl font-black italic">{gate.mana} <span className="text-[10px] text-slate-500">MP</span></div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] font-black text-slate-500 italic uppercase">Danger Rank</div>
                  <div className={cn("text-xl font-[1000] italic", gate.color === 'red' ? "text-red-500" : "text-white")}>
                    {gate.rank}
                  </div>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400 font-bold border-t border-white/5 pt-3 italic">
                {gate.desc}
              </p>
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
