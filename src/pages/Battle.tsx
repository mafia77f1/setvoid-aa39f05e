import { useState } from 'react';

const BattleApp = () => {
  const [bossHP, setBossHP] = useState(85000);
  const maxBossHP = 100000;

  // قائمة المهارات (مثل الأزرار الدائرية في صورتك)
  const skills = [
    { id: 1, icon: "⚡", color: "bg-blue-600" },
    { id: 2, icon: "🔥", color: "bg-orange-600" },
    { id: 3, icon: "❄️", color: "bg-cyan-500" },
    { id: 4, icon: "⚔️", color: "bg-red-700" },
  ];

  return (
    <div className="h-screen w-full bg-black flex flex-col text-white overflow-hidden font-sans">
      
      {/* 1. منطقة القتال العلوية (مثل الصورة) */}
      <div className="relative h-[45%] w-full bg-[#050505] border-b-2 border-blue-900/30">
        {/* خلفية الكهف */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(30,58,138,0.2)_0%,transparent_80%)]"></div>
        
        {/* شريط صحة الزعيم (فوق) */}
        <div className="absolute top-6 w-full flex flex-col items-center z-20">
          <div className="w-[80%] max-w-md">
            <div className="flex justify-between text-[10px] font-black tracking-tighter text-silver mb-1 uppercase">
              <span>Snow Spider [S-Rank]</span>
              <span>{Math.round((bossHP/maxBossHP)*100)}%</span>
            </div>
            <div className="h-3 bg-zinc-900 border border-white/10 p-[1px]">
              <div 
                className="h-full bg-gradient-to-r from-blue-700 to-white transition-all duration-500"
                style={{ width: `${(bossHP / maxBossHP) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* الشخصيات */}
        <div className="relative h-full w-full flex items-end justify-between px-8 pb-10">
           <img src="/BoosSnowSpider.png" className="w-40 md:w-64 object-contain" alt="Boss" />
           <img src="/UserPersonality.png" className="w-24 md:w-40 object-contain scale-x-[-1]" alt="Player" />
        </div>
      </div>

      {/* 2. شريط المهارات (Skills Bar) */}
      <div className="h-[12%] bg-zinc-900/50 flex items-center justify-center gap-4 border-b border-white/5">
        {skills.map(skill => (
          <button 
            key={skill.id}
            onClick={() => setBossHP(prev => Math.max(0, prev - 5000))}
            className={`${skill.color} w-12 h-12 rounded-full border-2 border-white/20 shadow-lg flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-transform`}
          >
            {skill.icon}
          </button>
        ))}
      </div>

      {/* 3. منطقة المعدات والتطوير (Bottom UI) */}
      <div className="flex-1 bg-[#0a0a0c] p-4">
        <div className="grid grid-cols-5 gap-2 h-full">
          {/* محاكاة لمربعات المعدات في صورتك */}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-zinc-800/50 border border-white/5 rounded-sm flex items-center justify-center relative group overflow-hidden">
               <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <span className="text-zinc-600 text-xs italic">Item {i+1}</span>
               {/* علبة التطوير الصغير */}
               <div className="absolute bottom-0 right-0 bg-blue-600 text-[8px] px-1 font-bold">LV.50</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. شريط التنقل السفلي الرئيسي */}
      <div className="h-[8%] bg-blue-900/20 border-t border-blue-500/30 flex items-center justify-around px-2">
         <button className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Inventory</button>
         <button className="bg-blue-600 px-6 py-1 rounded-sm text-sm font-black italic skew-x-[-10deg]">UPGRADE</button>
         <button className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Settings</button>
      </div>

    </div>
  );
};

export default BattleApp;
