import { useState } from 'react';

const SoloLevelingBattle = () => {
  const [bossHP, setBossHP] = useState(85000);
  const maxBossHP = 100000;
  const [playerHP, setPlayerHP] = useState(2800);
  const maxPlayerHP = 3000;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden relative">
      
      {/* 1. منطقة القتال (Upper Section - 50%) */}
      <div className="relative h-[55vh] w-full flex flex-col items-center justify-center border-b-2 border-blue-900/20">
        
        {/* خلفية الكهف الغامق */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(20,35,65,1)_0%,#000_100%)] opacity-100"></div>
        
        {/* المنصة (الأرضية) */}
        <div className="absolute bottom-[10%] w-[120%] h-[200px] perspective-1000">
          <div className="w-full h-full bg-[#080808] border-t border-blue-500/30 transform rotateX-60 origin-top opacity-80 shadow-[0_-20px_50px_rgba(59,130,246,0.2)]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
        </div>

        {/* الشخصيات والـ Stats العائمة */}
        <div className="relative w-full max-w-6xl flex justify-between items-end px-12 pb-[5%] z-10">
          
          {/* جانب الوحش (يسار) */}
          <div className="flex flex-col items-center relative">
            {/* Boss Stats Box */}
            <div className="mb-4 w-[240px] bg-black/80 border-l-4 border-blue-500 p-2 clip-path-sharp shadow-lg border-t border-r border-white/10 animate-fade-in">
              <div className="flex justify-between items-center mb-1 text-[10px] font-black italic text-blue-400">
                <span>SNOW SPIDER [S]</span>
                <span>{((bossHP/maxBossHP)*100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-zinc-900 border border-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-900 to-white transition-all duration-700" style={{ width: `${(bossHP/maxBossHP)*100}%` }} />
              </div>
            </div>
            <img src="/BoosSnowSpider.png" alt="Boss" className="w-64 md:w-96 drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]" />
          </div>

          {/* جانب اللاعب (يمين) */}
          <div className="flex flex-col items-center relative">
            {/* Player Stats Box */}
            <div className="mb-4 w-[200px] bg-black/80 border-r-4 border-blue-500 p-2 clip-path-sharp-rev shadow-lg border-t border-l border-white/10 animate-fade-in">
              <div className="flex justify-between items-center mb-1 text-[10px] font-black italic text-white tracking-widest">
                <span>HUNTER</span>
                <span className="text-blue-400">LV. 24</span>
              </div>
              <div className="h-1.5 bg-zinc-900 border border-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-white transition-all duration-700" style={{ width: `${(playerHP/maxPlayerHP)*100}%` }} />
              </div>
            </div>
            <img src="/UserPersonality.png" alt="Player" className="w-40 md:w-64 filter brightness-110 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
          </div>

        </div>
      </div>

      {/* 2. لوحة التحكم السفلية (Lower Section - 45%) */}
      <div className="flex-1 bg-[#0a0a0c] p-4 flex flex-col justify-between relative z-20">
        
        {/* شريط المهارات (مثل الدوائر في صورتك) */}
        <div className="flex justify-center gap-4 -mt-10 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <button 
              key={i} 
              onClick={() => setBossHP(prev => Math.max(0, prev - 5000))}
              className="w-14 h-14 rounded-full bg-gradient-to-b from-blue-600 to-blue-900 border-2 border-white/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
            >
              <span className="text-xs font-black italic">SKILL</span>
            </button>
          ))}
        </div>

        {/* شبكة التطويرات (مثل المربعات في صورتك) */}
        <div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-[25vh] p-2 bg-black/40 border border-white/5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-zinc-900/80 border border-blue-900/20 clip-path-sharp flex flex-col items-center justify-center group cursor-pointer hover:border-blue-500 transition-colors">
              <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">STR</div>
              <div className="text-blue-400 font-black italic text-lg">+12</div>
              <div className="absolute bottom-1 right-2 text-[8px] text-white/20 uppercase">Stat</div>
            </div>
          ))}
        </div>

        {/* الزر الرئيسي السفلي (Upgrade/Strike) */}
        <div className="mt-4 flex justify-center">
          <button 
             onClick={() => setBossHP(prev => Math.max(0, prev - 10000))}
             className="relative px-20 py-4 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-600 skew-x-[-20deg] group-hover:bg-blue-400 transition-all"></div>
            <span className="relative z-10 font-black italic tracking-[0.3em] uppercase text-white shadow-sm">Execute Action</span>
          </button>
        </div>
      </div>

      <style>{`
        .clip-path-sharp { clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%); }
        .clip-path-sharp-rev { clip-path: polygon(5% 0, 100% 0, 100% 70%, 95% 100%, 0 100%, 0 30%); }
        .perspective-1000 { perspective: 1000px; }
        .rotateX-60 { transform: rotateX(65deg); }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SoloLevelingBattle;
