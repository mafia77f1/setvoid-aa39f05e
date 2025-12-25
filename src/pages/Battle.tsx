import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { Skull, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;
  const [isAttacking, setIsAttacking] = useState(false);

  if (!boss) {
    navigate('/boss');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden flex flex-col items-center justify-center font-sans relative">
      
      {/* 1. نظام الشبكة في الخلفية (System Background) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a2e_0%,#020202_100%)]"></div>
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]"></div>

      {/* 2. زر الخروج السريع */}
      <button 
        onClick={() => navigate('/boss')} 
        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 transition-all"
      >
        <ShieldAlert className="w-6 h-6 text-white/50" />
      </button>

      {/* 3. ساحة القتال الرئيسية (The Arena) */}
      <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center pt-20">
        
        {/* المنصة (The Platform) - تصميم 3D مائل */}
        <div className="absolute bottom-10 w-[140%] h-64 bg-zinc-900/50 transform rotate-x-60 skew-x-[-10deg] border-t-8 border-red-600 shadow-[0_-50px_100px_rgba(220,38,38,0.15)] flex items-center justify-center overflow-hidden">
           {/* خطوط التحذير على المنصة */}
           <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_40px,#ff0000_40px,#ff0000_80px)]"></div>
           {/* توهج مركزي للمنصة */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.2),transparent_70%)]"></div>
        </div>

        {/* الكائنات المتواجهة */}
        <div className="relative w-full flex justify-around items-end pb-32 z-10 px-10">
          
          {/* مجسم اللاعب (Shadow Monarch Sprite) */}
          <div 
            className={cn(
              "relative transition-all duration-500 ease-out cursor-pointer",
              isAttacking ? "translate-x-40 scale-125" : "hover:scale-105"
            )}
            onClick={() => {
              setIsAttacking(true);
              setTimeout(() => setIsAttacking(false), 500);
            }}
          >
            {/* توهج الظل حول اللاعب */}
            <div className="absolute -inset-4 bg-blue-500/30 blur-2xl rounded-full animate-pulse"></div>
            
            {/* جسم اللاعب الشخصي */}
            <div className="w-24 h-60 bg-gradient-to-t from-purple-900 via-blue-900 to-purple-400 rounded-[2rem] border-2 border-white/20 shadow-[0_0_40px_rgba(139,92,246,0.5)] flex flex-col items-center justify-start pt-6 overflow-hidden">
                {/* الرأس (العيون المضيئة) */}
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center relative">
                   <div className="absolute left-2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]"></div>
                   <div className="absolute right-2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]"></div>
                </div>
                {/* تأثير "الأورا" الصاعد */}
                <div className="mt-4 w-full h-full bg-[linear-gradient(0deg,transparent,rgba(255,255,255,0.1))]"></div>
            </div>
            
            {/* الظل على الأرض */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/60 rounded-full blur-md"></div>
            {/* الرتبة */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-[10px] font-black uppercase italic skew-x-[-12deg]">
              Rank E
            </div>
          </div>

          {/* علامة VS بالخلفية */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <h2 className="text-[180px] font-black italic opacity-5 tracking-tighter select-none">VS</h2>
          </div>

          {/* مجسم الوحش / البوس (Dark Demon Sprite) */}
          <div className="relative group">
            {/* توهج أحمر خلف الوحش */}
            <div className="absolute -inset-10 bg-red-600/20 blur-[100px] rounded-full"></div>
            
            {/* جسم الوحش - ضخم ومخيف */}
            <div className="w-48 h-[400px] bg-gradient-to-t from-black via-zinc-900 to-red-950 rounded-xl border-x-4 border-red-900/50 relative shadow-2xl overflow-hidden animate-float">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
               
               {/* رمز الجمجمة في قلب الوحش */}
               <Skull className="absolute top-20 left-1/2 -translate-x-1/2 w-24 h-24 text-red-600 opacity-20" />
               
               {/* أعين الوحش */}
               <div className="absolute top-10 w-full flex justify-around px-10">
                  <div className="w-4 h-1 bg-red-600 shadow-[0_0_15px_#dc2626]"></div>
                  <div className="w-4 h-1 bg-red-600 shadow-[0_0_15px_#dc2626]"></div>
               </div>
            </div>

            {/* اسم البوس */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
               <div className="text-red-500 font-black italic tracking-widest uppercase text-xl drop-shadow-[0_2px_10px_rgba(220,38,38,0.5)]">
                 {boss.customName || boss.name}
               </div>
               <div className="text-[10px] text-zinc-500 font-mono tracking-tighter">LEVEL: {boss.level || '??'}</div>
            </div>

            {/* الظل على الأرض */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-8 bg-black/80 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>

      {/* 4. تلميح الاستخدام */}
      <div className="relative z-20 pb-10">
        <p className="text-zinc-500 font-mono text-[10px] animate-pulse">
          TAP PLAYER TO ATTACK • PREVIEWING ARENA
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .rotate-x-60 {
          transform: perspective(1000px) rotateX(65deg);
        }
      `}</style>
    </div>
  );
};

export default Battle;
