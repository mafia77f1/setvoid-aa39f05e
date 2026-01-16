import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Battle = () => {
  const navigate = useNavigate();
  const [bossHP, setBossHP] = useState(85000);
  const [playerHP, setPlayerHP] = useState(2500); // إحصائيات اللاعب
  const maxBossHP = 100000;
  const maxPlayerHP = 3000;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-between font-sans relative">
      
      {/* خلفية الكهف (إضاءة خافتة وعميقة) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(15,25,50,1)_0%,#000_70%)] opacity-100"></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/rocky-wall.png')]"></div>

      {/* منطقة القتال والأرضية */}
      <div className="relative flex-1 w-full flex items-center justify-center pt-20">
        
        {/* تصميم الأرضية (منصة الكهف) */}
        <div className="absolute bottom-[10%] w-[120%] h-[300px] perspective-1000">
          <div className="w-full h-full bg-[#080808] border-t border-blue-900/50 shadow-[0_-20px_50px_rgba(30,58,138,0.3)] transform rotateX-60 origin-top opacity-90">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
        </div>

        {/* الشخصيات والـ Stats الخاصة بكل منهما */}
        <div className="relative w-full max-w-6xl flex justify-between items-end px-10 pb-[12%] z-10">
          
          {/* حاوية الوحش (يسار) */}
          <div className="flex flex-col items-center relative">
             {/* Stats فوق الوحش */}
             <div className="absolute -top-32 w-[280px] animate-fade-in pointer-events-none">
                <div className="bg-black/80 border-l-4 border-blue-500 clip-path-sharp p-2 border-r border-t border-white/20 shadow-[0_0_20px_rgba(0,0,0,1)]">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-blue-400 italic tracking-widest uppercase">BOSS: SNOW SPIDER</span>
                      <span className="text-[9px] font-mono text-silver uppercase italic">S-RANK</span>
                   </div>
                   <div className="relative w-full h-2 bg-black border border-silver/30 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-900 via-blue-400 to-white transition-all duration-700" style={{ width: `${(bossHP / maxBossHP) * 100}%` }} />
                   </div>
                   <div className="text-[8px] font-mono text-blue-200 mt-1 text-right italic">HP: {bossHP.toLocaleString()}</div>
                </div>
             </div>
             {/* الوحش ثابت */}
             <img src="/BoosSnowSpider.png" alt="Boss" className="w-[300px] md:w-[480px] drop-shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-none" />
          </div>

          {/* حاوية اللاعب (يمين) */}
          <div className="flex flex-col items-center relative">
             {/* Stats فوق اللاعب */}
             <div className="absolute -top-32 w-[220px] animate-fade-in pointer-events-none">
                <div className="bg-black/80 border-r-4 border-blue-500 clip-path-sharp-rev p-2 border-l border-t border-white/20 shadow-[0_0_20px_rgba(0,0,0,1)]">
                   <div className="flex justify-between items-center mb-1 px-1">
                      <span className="text-[10px] font-black text-white italic tracking-widest uppercase italic">SUNG JIN-WOO</span>
                      <span className="text-[9px] font-mono text-blue-400 font-bold uppercase">LVL. 24</span>
                   </div>
                   <div className="relative w-full h-2 bg-black border border-silver/30 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 via-white to-silver transition-all duration-700" style={{ width: `${(playerHP / maxPlayerHP) * 100}%` }} />
                   </div>
                   <div className="text-[8px] font-mono text-blue-300 mt-1 text-left italic tracking-tighter uppercase">Condition: Optimal</div>
                </div>
             </div>
             <img src="/UserPersonality.png" alt="Player" className="w-[180px] md:w-[280px] filter brightness-110 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
          </div>

        </div>
      </div>

      {/* التذييل (نظام الأوامر) */}
      <div className="w-full p-8 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center border-t border-white/5 pt-6">
          <div className="font-mono space-y-1">
             <p className="text-[10px] tracking-[0.5em] text-white/40 uppercase underline underline-offset-4">System Message</p>
             <p className="text-sm text-blue-400 font-bold italic tracking-widest uppercase">Defeat the Boss to end the penalty</p>
          </div>
          
          <button 
            onClick={() => setBossHP(prev => Math.max(0, prev - 5000))}
            className="relative px-12 py-3 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 skew-x-[-20deg] group-hover:bg-blue-600 transition-all duration-300"></div>
            <div className="absolute inset-0 border border-white/20 skew-x-[-20deg]"></div>
            <span className="relative z-10 text-white font-black italic tracking-widest uppercase group-hover:scale-110 transition-transform inline-block">Execute Strike</span>
          </button>
        </div>
      </div>

      <style>{`
        .clip-path-sharp {
          clip-path: polygon(0 0, 96% 0, 100% 30%, 100% 100%, 4% 100%, 0 70%);
        }
        .clip-path-sharp-rev {
          clip-path: polygon(4% 0, 100% 0, 100% 70%, 96% 100%, 0 100%, 0 30%);
        }
        .perspective-1000 { perspective: 1000px; }
        .rotateX-60 { transform: rotateX(65deg); }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>

    </div>
  );
};

export default Battle;
