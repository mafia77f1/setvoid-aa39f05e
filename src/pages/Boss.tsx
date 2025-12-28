import React from 'react';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Skull, Sword, Box, Timer, Users, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();

  const gates = [
    { 
      type: 'BLUE', rank: 'A', name: 'SHADOW FORTRESS', color: 'from-blue-600 via-blue-900 to-black', 
      desc: 'بوابة عادية - خطر الكسر بعد 7 أيام', timer: '167:54:12', mana: '98,000', canRecruit: true 
    },
    { 
      type: 'RED', rank: 'S', name: 'ICE CITADEL', color: 'from-red-600 via-red-950 to-black', 
      desc: 'بوابة حمراء - انحباس مكاني (المخرج مغلق)', timer: 'UNKNOWN', mana: 'ERR: OVER', isRed: true 
    },
    { 
      type: 'INSTANT', rank: 'B', name: 'TRIAL OF THE WEAK', color: 'from-yellow-500 via-amber-950 to-black', 
      desc: 'ديماس فوري - مخصص لرفع المستوى (XP)', key: 'C-RANK KEY', mana: 'SYSTEM ONLY', isInstant: true 
    },
    { 
      type: 'DOUBLE', rank: '???', name: 'CARTENON TEMPLE', color: 'from-gray-400 via-zinc-900 to-black', 
      desc: 'بوابة مزدوجة - كيان مخفي داخل بوابة عادية', timer: 'NONE', mana: 'INFINITE', isDouble: true 
    }
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white font-serif selection:bg-purple-900 pb-40">
      
      {/* تأثير المانا المظلمة في الخلفية */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1a1a2e_0%,#000_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,1)]" />
      </div>

      <header className="relative z-20 pt-12 px-8 flex justify-between items-end border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xs font-black tracking-[0.8em] text-purple-500 uppercase opacity-70">Detection System</h1>
          <div className="text-4xl font-[1000] italic tracking-tighter">GATE <span className="text-white/20">RADAR</span></div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-500 font-bold tracking-widest">CURRENT MANA</div>
          <div className="text-xl font-black text-white italic">LEVEL <span className="text-purple-600">99</span></div>
        </div>
      </header>

      <main className="relative z-10 p-6 space-y-32">
        {gates.map((gate, idx) => (
          <div key={idx} className="relative group">
            
            {/* عنوان البوابة (System Notification Style) */}
            <div className="absolute -top-10 left-0 w-full flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rotate-45", gate.isRed ? "bg-red-600" : "bg-purple-600")} />
                <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">{gate.type} GATE DETECTED</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600">ID: 000-{idx}</span>
            </div>

            {/* الجسم الرئيسي للبوابة (The Monolith) */}
            <div className="relative flex items-center justify-center h-[450px]">
              
              {/* الرتبة الخلفية (هيبة البوابة) */}
              <div className="absolute z-0 text-[18rem] font-[1000] italic leading-none opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-1000">
                {gate.rank}
              </div>

              {/* تصميم البوابة (The Abyss) */}
              <div className={cn(
                "relative w-64 h-full rounded-t-[100px] rounded-b-[20px] overflow-hidden border-t-2 border-x-2 transition-all duration-700",
                "before:absolute before:inset-0 before:bg-gradient-to-b before:opacity-40",
                gate.isRed ? "border-red-600 shadow-[0_-20px_50px_rgba(220,38,38,0.3)] shadow-red-900/20" : 
                gate.isDouble ? "border-zinc-400 shadow-[0_-20px_50px_rgba(255,255,255,0.1)] shadow-white/10" :
                "border-purple-600 shadow-[0_-20px_50px_rgba(147,51,234,0.2)] shadow-purple-900/20"
              )}>
                {/* الدوامة الداخلية */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-b",
                  gate.color
                )}>
                  <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJwaWJpZjZxdXNpeXp6c3V6OXJ6OXJ6OXJ6OXJ6OXJ6OXJ6OXJ6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxcaoxA2re/giphy.gif')] bg-cover bg-center" />
                  
                  {/* تأثير التمزق للبوابة المزدوجة */}
                  {gate.isDouble && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-full bg-white/20 blur-xl animate-pulse" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,black_90%)]" />
                    </div>
                  )}
                </div>

                {/* الضباب السحري المتحرك */}
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
              </div>

              {/* بطاقة معلومات البوابة (The UI Overlay) */}
              <div className="absolute -right-4 bottom-10 w-48 bg-black/80 border border-white/10 backdrop-blur-xl p-4 skew-x-[-12deg] shadow-2xl">
                 <div className="skew-x-[12deg]">
                    <h3 className="text-lg font-black italic tracking-tighter leading-none">{gate.name}</h3>
                    <p className="text-[8px] text-zinc-500 mt-2 leading-relaxed font-bold">{gate.desc}</p>
                    
                    <div className="mt-4 space-y-2">
                       <div className="flex justify-between items-center border-b border-white/5 pb-1">
                          <span className="text-[8px] text-zinc-500 italic uppercase">Rank</span>
                          <span className={cn("text-xs font-black", gate.isRed ? "text-red-500" : "text-purple-500")}>{gate.rank}</span>
                       </div>
                       <div className="flex justify-between items-center border-b border-white/5 pb-1">
                          <span className="text-[8px] text-zinc-500 italic uppercase">Mana</span>
                          <span className="text-xs font-black text-white">{gate.mana}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* أزرار الفعل (Action Prompts) */}
              <div className="absolute -bottom-10 flex flex-col items-center gap-4">
                 <button className={cn(
                   "group relative px-14 py-4 overflow-hidden transition-all duration-300",
                   gate.isRed ? "bg-red-700" : gate.isInstant ? "bg-amber-600" : "bg-white"
                 )}>
                   <div className="relative z-10 flex items-center gap-2 text-sm font-black italic tracking-[0.3em]">
                      {gate.isInstant ? <Key size={16} className="text-black" /> : <Sword size={16} className={gate.isRed ? "text-white" : "text-black"} />}
                      <span className={gate.isRed || gate.isInstant ? "text-white" : "text-black"}>
                        {gate.isInstant ? 'USE SYSTEM KEY' : 'RAID COMMENCE'}
                      </span>
                   </div>
                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                 </button>

                 {gate.canRecruit && (
                   <button className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-blue-400 hover:text-white transition-all uppercase">
                      <Users size={12} /> Recruit Extraction Team
                   </button>
                 )}
              </div>
            </div>

            {/* عداد الخطر (System Warnings) */}
            <div className="mt-20 flex justify-center gap-12 text-center font-black">
               <div className="space-y-1">
                  <div className="text-[8px] text-zinc-600 tracking-widest flex items-center gap-1"><Timer size={10}/> REMAINING TIME</div>
                  <div className={cn("text-lg italic", gate.timer === 'UNKNOWN' ? "text-red-600 animate-pulse" : "text-white")}>
                    {gate.timer}
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="text-[8px] text-zinc-600 tracking-widest flex items-center gap-1"><AlertTriangle size={10}/> STATUS</div>
                  <div className={cn("text-lg italic uppercase", gate.isRed ? "text-red-600" : "text-green-500")}>
                    {gate.isRed ? 'LOCKED' : 'STABLE'}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(-20px); }
        }
        .animate-drift { animation: drift 3s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
};

export default Boss;
