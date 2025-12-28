import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Users, Key, AlertOctagon, Timer, ShieldAlert, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  
  // تعريف أنواع البوابات بناءً على طلبك
  const [gates] = useState([
    { 
      id: 'g-normal', 
      rank: 'A', 
      name: 'SHADOW FORTRESS', 
      type: 'BLUE GATE', 
      color: 'blue',
      description: 'النوع الشائع - خطر كسر البوابة بعد 7 أيام',
      timer: '168:00:00', // 7 أيام
      features: ['RECRUIT_TEAM'],
      mana: '94,000'
    },
    { 
      id: 'g-red', 
      rank: 'S', 
      name: 'FROZEN HELL', 
      type: 'RED GATE', 
      color: 'red',
      description: 'المخرج مغلق - يجب قتل الزعيم للهروب',
      warning: 'TIME DILATION ACTIVE',
      mana: 'UNMEASURABLE'
    },
    { 
      id: 'g-instant', 
      rank: 'B', 
      name: 'LEVEL UP TRIALS', 
      type: 'INSTANT DUNGEON', 
      color: 'gold',
      description: 'نظام خاص - مخصص لرفع المستوى فقط',
      requires: 'C-RANK KEY',
      mana: 'LOCKED BY SYSTEM'
    },
    { 
      id: 'g-double', 
      rank: '??', 
      name: 'THE CARTENON TEMPLE', 
      type: 'DOUBLE DUNGEON', 
      color: 'double',
      description: 'خطر! بوابة مخفية داخل بوابة عادية',
      warning: 'UNKNOWN ENTITY DETECTED',
      mana: 'ERROR: OVERFLOW'
    }
  ]);

  return (
    <div className="min-h-screen bg-[#020205] text-white pb-40 overflow-x-hidden font-sans">
      
      {/* Background FX */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a0a1a_0%,#000_100%)] opacity-80" />
      
      <header className="relative z-20 pt-10 px-6">
        <div className="flex justify-between items-start font-black italic">
          <div>
            <h1 className="text-4xl tracking-tighter text-white">GATE <span className="text-purple-600">RADAR</span></h1>
            <p className="text-[10px] tracking-[0.4em] text-slate-500 uppercase font-bold">Shadow Monarch System V.2</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-2 backdrop-blur-md">
            <span className="text-[10px] block text-slate-400">CURRENT KEYS</span>
            <div className="flex items-center gap-1 text-yellow-500">
              <Key size={14} /> <span className="text-lg font-black">03</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 mt-12 space-y-32">
        {gates.map((gate) => (
          <div key={gate.id} className="relative group max-w-sm mx-auto transition-all duration-700">
            
            {/* بوابة الرتبة وتصنيف النوع */}
            <div className="flex flex-col items-center mb-8">
              <div className={cn(
                "px-6 py-1 text-[11px] font-[1000] skew-x-[-20deg] border-2 mb-2",
                gate.color === 'blue' && "border-blue-500 text-blue-400 bg-blue-500/10",
                gate.color === 'red' && "border-red-600 text-red-500 bg-red-600/10 animate-pulse",
                gate.color === 'gold' && "border-yellow-600 text-yellow-500 bg-yellow-600/10",
                gate.color === 'double' && "border-white text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              )}>
                {gate.type}
              </div>
              <h2 className="text-2xl font-black tracking-widest uppercase">{gate.name}</h2>
              <p className="text-[9px] text-slate-400 mt-1 font-bold">{gate.description}</p>
            </div>

            {/* الجبروت البصري - شكل البوابة */}
            <div className="relative h-96 w-full flex items-center justify-center">
              
              {/* الرتبة الضخمة */}
              <div className="absolute text-[15rem] font-[1000] italic leading-none opacity-5 group-hover:opacity-15 transition-opacity">
                {gate.rank}
              </div>

              {/* هيكل البوابة المطور */}
              <div className={cn(
                "relative w-60 h-full rounded-[48%_48%_30%_30%] border-4 transition-all duration-700 shadow-2xl",
                gate.color === 'blue' && "border-blue-600 shadow-blue-900/40",
                gate.color === 'red' && "border-red-700 shadow-red-900/60",
                gate.color === 'gold' && "border-yellow-600 shadow-yellow-900/40",
                gate.color === 'double' && "border-slate-400 shadow-[0_0_50px_rgba(255,255,255,0.3)]"
              )}>
                
                {/* الدوامة - Portal Heart */}
                <div className={cn(
                  "absolute inset-0 rounded-[inherit] overflow-hidden",
                  "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000_100%)]"
                )}>
                  <div className={cn(
                    "absolute inset-[-100%] animate-[spin_10s_linear_infinite]",
                    gate.color === 'blue' && "bg-[conic-gradient(from_0deg,#000,#2563eb,#000,#3b82f6,#000)]",
                    gate.color === 'red' && "bg-[conic-gradient(from_0deg,#000,#dc2626,#000,#ef4444,#000)]",
                    gate.color === 'gold' && "bg-[conic-gradient(from_0deg,#000,#ca8a04,#000,#facc15,#000)]",
                    gate.color === 'double' && "bg-[conic-gradient(from_0deg,#000,#fff,#333,#fff,#000)]"
                  )} />
                </div>

                {/* تأثير البوابة المزدوجة (طبقة ثانية مخفية) */}
                {gate.color === 'double' && (
                  <div className="absolute inset-4 rounded-[inherit] border-2 border-dashed border-red-600/50 animate-[spin_5s_linear_infinite_reverse]" />
                )}
              </div>

              {/* أزرار التفاعل */}
              <div className="absolute -bottom-10 flex flex-col items-center gap-3 w-full">
                <button className={cn(
                  "px-10 py-4 font-black italic tracking-[0.5em] skew-x-[-15deg] transition-all hover:scale-105 active:scale-90",
                  gate.color === 'blue' && "bg-blue-600 text-white",
                  gate.color === 'red' && "bg-red-700 text-white shadow-[0_0_25px_rgba(220,38,38,0.5)]",
                  gate.color === 'gold' && "bg-yellow-600 text-black",
                  gate.color === 'double' && "bg-white text-black"
                )}>
                  {gate.color === 'gold' ? 'USE KEY' : 'ENTER'}
                </button>

                {/* خيار تجنيد الفريق للبوابات الزرقاء */}
                {gate.features?.includes('RECRUIT_TEAM') && (
                  <button className="flex items-center gap-2 text-blue-400 font-black text-[10px] tracking-widest hover:text-white transition-colors">
                    <Users size={14} /> RECRUIT RAID TEAM
                  </button>
                )}
              </div>
            </div>

            {/* قسم معلومات النظام أسفل البوابة */}
            <div className="mt-20 grid grid-cols-2 gap-2">
              <div className="bg-white/5 border border-white/10 p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 mb-1 italic">
                   <ShieldAlert size={10} /> MANA MEASUREMENT
                </div>
                <div className="text-sm font-black font-mono tracking-tighter">{gate.mana}</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 mb-1 italic">
                   <Timer size={10} /> {gate.timer ? 'DUNGEON BREAK' : 'STATUS'}
                </div>
                <div className={cn(
                  "text-sm font-black font-mono",
                  gate.color === 'red' ? "text-red-500" : "text-green-500"
                )}>
                  {gate.timer || gate.warning || 'ACTIVE'}
                </div>
              </div>
            </div>

          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

export default Boss;
