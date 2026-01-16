import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Battle = () => {
  const navigate = useNavigate();
  const [bossHP, setBossHP] = useState(85000);
  const maxHP = 100000;

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden flex flex-col items-center justify-between font-sans relative">
      
      {/* خلفية ضبابية خفيفة لإعطاء عمق */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(30,58,138,0.15)_0%,transparent_60%)] pointer-events-none"></div>

      {/* 1. نظام الـ Stats العلوي (نظام سولو ليفلينج الفضي والحاد) */}
      <div className="w-full max-w-4xl pt-10 px-6 z-20 animate-slide-down">
        <div className="relative group">
          {/* الإطار الفضي الحاد */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 via-silver to-blue-500 opacity-50 clip-path-sharp"></div>
          
          <div className="relative bg-[#0a0a0a]/90 p-4 clip-path-sharp border-l-4 border-blue-500">
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-400 font-bold tracking-[0.4em] uppercase mb-1">Boss Encounter</span>
                <h2 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-silver uppercase">
                  Snow Spider <span className="text-blue-500 text-lg ml-2">[S]</span>
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-silver/50 block">VITALITY STATUS</span>
                <span className="text-xl font-mono text-white font-bold tracking-widest">
                  {((bossHP / maxHP) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            {/* بار الصحة المتقدم */}
            <div className="relative w-full h-4 bg-black/80 border border-white/10 overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <div 
                className="h-full bg-gradient-to-r from-blue-900 via-blue-400 to-white transition-all duration-1000 ease-out"
                style={{ width: `${(bossHP / maxHP) * 100}%` }}
              />
              {/* لمعة زجاجية متحركة */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-glass-shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. منطقة القتال والأرضية (The Arena Ground) */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        
        {/* تصميم الأرضية (منصة منظور ثلاثي الأبعاد) */}
        <div className="absolute bottom-[10%] w-[120%] h-[300px] perspective-1000">
          <div className="w-full h-full bg-[#0a0a0a] border-t-2 border-blue-500/50 shadow-[0_-20px_50px_rgba(59,130,246,0.2)] transform rotateX-60 origin-top opacity-80">
            {/* شبكة طاقة على الأرض */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
        </div>

        {/* الشخصيات */}
        <div className="relative w-full max-w-6xl flex justify-between items-end px-10 pb-[12%] z-10">
          
          {/* الزعيم (يسار) */}
          <div className="flex flex-col items-center">
             <img 
               src="/BoosSnowSpider.png" 
               alt="Boss" 
               className="w-[300px] md:w-[500px] drop-shadow-[0_0_40px_rgba(59,130,246,0.3)] animate-float"
             />
          </div>

          {/* اللاعب (يمين - الصورة الجديدة) */}
          <div className="flex flex-col items-center">
             <div className="mb-4 text-center">
                <div className="text-[10px] text-blue-400 font-bold tracking-widest uppercase py-1 px-3 border border-blue-500/30 bg-blue-500/10 inline-block skew-x-[-15deg]">
                  Player (E-Rank)
                </div>
             </div>
             <img 
               src="/UserPersonality.png" 
               alt="Player" 
               className="w-[180px] md:w-[280px] filter brightness-110 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]"
             />
          </div>

        </div>
      </div>

      {/* 3. التذييل (نظام الأوامر) */}
      <div className="w-full p-8 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center border-t border-white/10 pt-6">
          <div className="font-mono space-y-1">
             <p className="text-[10px] tracking-[0.5em] text-white/40 uppercase underline">System Notification</p>
             <p className="text-sm text-blue-400 font-bold italic">TARGET IS READY FOR ENGAGEMENT</p>
          </div>
          
          <button 
            onClick={() => setBossHP(prev => Math.max(0, prev - 5000))}
            className="relative px-10 py-3 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 skew-x-[-20deg] group-hover:bg-blue-600 transition-all duration-300"></div>
            <div className="absolute inset-0 border border-white/20 skew-x-[-20deg]"></div>
            <span className="relative z-10 text-white font-black italic tracking-widest group-hover:text-white transition-colors">ATTACK</span>
          </button>
        </div>
      </div>

      <style>{`
        .clip-path-sharp {
          clip-path: polygon(0 0, 96% 0, 100% 30%, 100% 100%, 4% 100%, 0 70%);
        }
        .perspective-1000 { perspective: 1000px; }
        .rotateX-60 { transform: rotateX(65deg); }
        
        @keyframes glass-shimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          50% { transform: translateX(100%) skewX(-20deg); }
          100% { transform: translateX(100%) skewX(-20deg); }
        }
        .animate-glass-shimmer {
          animation: glass-shimmer 3s infinite ease-in-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes slide-down {
          from { transform: translateY(-100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

    </div>
  );
};

export default Battle;
