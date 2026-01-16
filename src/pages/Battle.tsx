import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useGameState } from '@/hooks/useGameState'; // فعلها عند الربط الفعلي

const Battle = () => {
  const navigate = useNavigate();
  // نفترض وجود بيانات الوحش هنا
  const boss = { name: "SNOW SPIDER", level: "S-RANK", hp: 85000, maxHp: 100000 }; 

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-start font-sans p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
      
      {/* HUD العلوي - إحصائيات الوحش بنظام Solo Leveling */}
      <div className="w-full max-w-4xl mt-10 relative animate-slide-down">
        {/* إطار الاسم والحواف الحادة */}
        <div className="relative border-l-4 border-blue-500 bg-gradient-to-r from-blue-900/40 to-transparent p-4 clip-path-polygon">
          <div className="flex justify-between items-end mb-1">
            <span className="text-blue-400 font-black italic tracking-tighter text-2xl uppercase">
              {boss.name} <span className="text-white/50 text-sm ml-2">[{boss.level}]</span>
            </span>
            <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Boss Vitality</span>
          </div>
          
          {/* بار الصحة (Health Bar) */}
          <div className="w-full h-6 bg-zinc-900 border border-silver/30 relative overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-white transition-all duration-500 shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]"
              style={{ width: `${(boss.hp / boss.maxHp) * 100}%` }}
            />
            {/* تأثير الخطوط المائلة فوق البار */}
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,black_10px,black_20px)]"></div>
          </div>
          
          <div className="flex justify-between mt-1 text-[10px] font-mono text-blue-300/70 uppercase">
            <span>HP: {boss.hp.toLocaleString()}</span>
            <span>100%</span>
          </div>
        </div>

        {/* زخرفة الحواف الحادة (Silver Accents) */}
        <div className="absolute -top-2 -right-2 w-16 h-[2px] bg-blue-400 rotate-45 shadow-cyan-500 shadow-lg"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-[2px] bg-blue-400 rotate-45 shadow-cyan-500 shadow-lg"></div>
      </div>

      {/* منطقة القتال المركزية */}
      <div className="relative flex-1 w-full flex items-center justify-center py-10">
        
        {/* هالة خلف الوحش */}
        <div className="absolute w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse"></div>

        {/* صورة الوحش (التي طلبتها) */}
        <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
          <img 
            src="/BoosSnowSpider.png" 
            alt="Boss" 
            className="max-h-[50vh] drop-shadow-[0_0_50px_rgba(59,130,246,0.3)] filter brightness-110"
          />
          {/* تأثير الجليد أسفل الوحش */}
          <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-blue-500/20 to-transparent blur-xl"></div>
        </div>

      </div>

      {/* الجزء السفلي - معلومات المرحلة */}
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center border-t border-white/10 pt-4">
        <div className="flex flex-col">
          <span className="text-blue-500 font-black text-lg tracking-[0.3em]">ARENA</span>
          <span className="text-white/30 text-[10px] uppercase tracking-[0.5em]">Phase 01: The Frost Descent</span>
        </div>
        
        {/* زر "الهجوم" أو "التفاعل" */}
        <button className="group relative px-12 py-3 overflow-hidden">
          <div className="absolute inset-0 bg-blue-600 skew-x-[-20deg] group-hover:bg-blue-400 transition-colors"></div>
          <span className="relative z-10 font-black italic tracking-widest text-white uppercase group-hover:scale-110 transition-transform inline-block">Execute Task</span>
        </button>
      </div>

      {/* ستايل إضافي للـ Clip-path (يمكنك وضعه في CSS) */}
      <style>{`
        .clip-path-polygon {
          clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%);
        }
        @keyframes slide-down {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.8s cubic-bezier(0.2, 1, 0.3, 1);
        }
      `}</style>

    </div>
  );
};

export default Battle;
