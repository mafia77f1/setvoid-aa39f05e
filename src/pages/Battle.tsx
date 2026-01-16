import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Battle = () => {
  const navigate = useNavigate();
  // بيانات افتراضية
  const [bossHP, setBossHP] = useState(85000);
  const maxHP = 100000;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-between font-sans p-6">
      
      {/* 1. نظام الـ Stats العلوي (Solo Leveling Style) */}
      <div className="w-full max-w-4xl animate-slide-down">
        <div className="relative border-l-4 border-blue-500 bg-gradient-to-r from-blue-900/30 to-transparent p-4 clip-path-sharp">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-2xl font-black italic tracking-tighter text-blue-400 uppercase">
              BOSS: SNOW SPIDER <span className="text-white/40 text-sm">[S-RANK]</span>
            </h2>
            <span className="text-xs font-mono text-blue-300">HP: {bossHP.toLocaleString()} / {maxHP.toLocaleString()}</span>
          </div>
          
          {/* بار الصحة المتقدم */}
          <div className="relative w-full h-5 bg-zinc-900 border border-silver/20 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <div 
              className="h-full bg-gradient-to-r from-blue-700 via-blue-400 to-silver transition-all duration-1000 ease-out"
              style={{ width: `${(bossHP / maxHP) * 100}%` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:50px_50px] animate-shimmer"></div>
          </div>
        </div>
      </div>

      {/* 2. منطقة القتال والمنصة */}
      <div className="relative w-full h-[60vh] flex flex-col items-center justify-center">
        
        {/* المنصة المضيئة (التي طلبت الحفاظ عليها) */}
        <div className="absolute bottom-[15%] w-full flex flex-col items-center">
            <div className="w-[85%] h-[2px] bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,1)]"></div>
            <div className="w-[90%] h-[60px] bg-gradient-to-t from-blue-900/20 to-transparent opacity-50 skew-x-[-20deg]"></div>
        </div>

        {/* الشخصيات */}
        <div className="relative w-full max-w-5xl flex justify-between items-end px-10 pb-[10%] z-10">
          
          {/* اللاعب (يمين) */}
          <div className="flex flex-col items-center transform scale-x-[-1] md:scale-x-[1]">
             <div className="mb-2 px-3 py-1 bg-blue-600/20 border border-blue-500 text-[10px] font-bold text-blue-400 tracking-widest uppercase">
               Player
             </div>
             {/* هنا يمكنك وضع صورة لاعبك أو الـ Humanoid Figure السابق */}
             <div className="relative group">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <HumanoidFigure color="bg-blue-500" /> 
             </div>
          </div>

          {/* الزعيم العنكبوت (يسار أو في المنتصف) */}
          <div className="flex flex-col items-center">
             <div className="mb-4 px-4 py-1 bg-red-900/20 border border-red-900 text-[12px] font-black text-red-600 tracking-[0.3em] uppercase italic">
               Warning: High Rank
             </div>
             <img 
               src="/BoosSnowSpider.png" 
               alt="Snow Spider Boss" 
               className="w-64 md:w-[450px] drop-shadow-[0_0_60px_rgba(59,130,246,0.4)] animate-float"
             />
          </div>

        </div>
      </div>

      {/* 3. التذييل - Phase Info */}
      <div className="w-full flex justify-between items-center opacity-40 border-t border-white/5 pt-4 font-mono">
        <div className="text-[10px] tracking-[0.8em]">SYSTEM PHASE: ACTIVE</div>
        <div className="text-[10px] tracking-[0.5em]">ARENA PHASE 01</div>
      </div>

      <style>{`
        .clip-path-sharp {
          clip-path: polygon(0 0, 98% 0, 100% 25%, 100% 100%, 2% 100%, 0 75%);
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// مكون الشخصية (مبسط لتوضيح الموقع)
const HumanoidFigure = ({ color }) => (
  <div className="flex flex-col items-center">
    <div className={`w-8 h-8 rounded-full ${color} shadow-[0_0_15px_rgba(59,130,246,0.5)]`} />
    <div className={`w-10 h-24 ${color} mt-1 clip-path-sharp opacity-80`} />
    <div className="flex gap-2 mt-1">
      <div className={`w-3 h-16 ${color} opacity-70`} />
      <div className={`w-3 h-16 ${color} opacity-70`} />
    </div>
  </div>
);

export default Battle;
