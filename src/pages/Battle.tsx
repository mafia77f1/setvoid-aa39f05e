import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Battle = () => {
  const navigate = useNavigate();
  const [bossHP, setBossHP] = useState(85000);
  const maxHP = 100000;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center font-sans relative">
      
      {/* خلفية الكهف - إضاءة خافتة وتدرجات توحي بالعمق */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(20,20,30,0.8)_0%,#000_100%)] opacity-100"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>

      {/* منطقة القتال المركزية */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center pt-20">
        
        {/* المنصة الأرضية (نفس التصميم السابق) */}
        <div className="absolute bottom-[20%] w-[110%] h-[250px] perspective-1000">
          <div className="w-full h-full bg-gradient-to-t from-blue-900/20 to-black border-t border-blue-500/40 transform rotateX-60 origin-top opacity-60">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          </div>
        </div>

        {/* الشخصيات والـ Stats */}
        <div className="relative w-full max-w-6xl flex justify-between items-end px-12 pb-[18%] z-10">
          
          {/* حاوية الوحش + الـ Stats فوقه مباشرة */}
          <div className="flex flex-col items-center relative bottom-5">
            
            {/* نظام الـ Stats فوق الوحش (Solo Leveling Style) */}
            <div className="absolute -top-32 w-[350px] animate-fade-in pointer-events-none">
                {/* الإطار الفضي الحاد */}
                <div className="relative bg-[#0a0a0a]/90 border-l-4 border-blue-500 clip-path-sharp p-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] border-t border-r border-white/20">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-[11px] font-black text-blue-400 italic tracking-widest uppercase shadow-blue-500">BOSS: SNOW SPIDER</span>
                        <span className="text-[10px] font-mono text-silver italic">RANK [S]</span>
                    </div>
                    
                    {/* بار الصحة المتقدم */}
                    <div className="relative w-full h-3 bg-black border border-silver/30 overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <div 
                            className="h-full bg-gradient-to-r from-blue-800 via-blue-400 to-white transition-all duration-700"
                            style={{ width: `${(bossHP / maxHP) * 100}%` }}
                        />
                        {/* خطوط مائلة كزينة فنية */}
                        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,black_5px,black_10px)]"></div>
                    </div>
                    
                    <div className="flex justify-between mt-1 px-1">
                        <div className="w-2 h-2 bg-blue-500 rotate-45"></div>
                        <span className="text-[9px] font-mono text-blue-200">VITALITY: {((bossHP/maxHP)*100).toFixed(0)}%</span>
                        <div className="w-2 h-2 bg-blue-500 rotate-45"></div>
                    </div>
                </div>
                {/* تفاصيل فضية حادة تحت الـ Stats */}
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-silver/40 to-transparent mt-1"></div>
            </div>

            {/* الزعيم (ثابت بدون أنيميشن) */}
            <img 
               src="/BoosSnowSpider.png" 
               alt="Boss" 
               className="w-[350px] md:w-[500px] drop-shadow-[0_0_50px_rgba(59,130,246,0.25)]"
            />
          </div>

          {/* اللاعب (يمين) */}
          <div className="flex flex-col items-center">
             <div className="mb-4 text-center">
                <div className="text-[10px] text-blue-400 font-bold tracking-widest uppercase py-1 px-3 border border-blue-500/30 bg-blue-500/10 inline-block skew-x-[-15deg]">
                  Player (E-Rank)
                </div>
             </div>
             <img 
               src="/UserPersonality.png" 
               alt="Player" 
               className="w-[200px] md:w-[300px] filter brightness-110 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]"
             />
          </div>

        </div>
      </div>

      {/* التذييل */}
      <div className="absolute bottom-6 w-full px-10 flex justify-between items-center z-20">
        <div className="text-[10px] font-mono tracking-[0.8em] text-white/30">SYSTEM PHASE: CAVE_EXPLORATION</div>
        <button 
          onClick={() => setBossHP(prev => Math.max(0, prev - 10000))}
          className="relative px-12 py-3 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/5 skew-x-[-20deg] group-hover:bg-blue-600 transition-all duration-300"></div>
          <div className="absolute inset-0 border border-white/20 skew-x-[-20deg]"></div>
          <span className="relative z-10 text-white font-black italic tracking-widest group-hover:scale-110 transition-transform inline-block uppercase">Attack</span>
        </button>
      </div>

      <style>{`
        .clip-path-sharp {
          clip-path: polygon(0 0, 95% 0, 100% 25%, 100% 100%, 5% 100%, 0 75%);
        }
        .perspective-1000 { perspective: 1000px; }
        .rotateX-60 { transform: rotateX(65deg); }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>

    </div>
  );
};

export default Battle;
