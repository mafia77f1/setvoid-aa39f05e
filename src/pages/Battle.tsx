import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
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
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center font-sans relative">
      
      {/* 1. الساحة والمنصة */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center">
        
        {/* المنصة: خط أحمر حاد وممتد */}
        <div className="absolute bottom-[30%] w-full">
            <div className="w-full h-[4px] bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]"></div>
            {/* تظليل أسفل الخط ليعطي عمق */}
            <div className="w-full h-40 bg-gradient-to-b from-red-900/20 to-transparent opacity-50"></div>
        </div>

        {/* 2. الشخصيات فوق الخط */}
        <div className="relative w-full max-w-4xl flex justify-between items-end px-20 pb-[30%] z-10">
          
          {/* مجسم الإنسان (اللاعب) */}
          <div 
            className={cn(
              "relative transition-all duration-300 ease-in-out cursor-pointer",
              isAttacking ? "translate-x-20" : ""
            )}
            onClick={() => {
              setIsAttacking(true);
              setTimeout(() => setIsAttacking(false), 300);
            }}
          >
            {/* جسم الإنسان المبسط */}
            <div className="w-16 h-48 bg-blue-500/80 rounded-full border-2 border-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.5)] relative overflow-hidden">
                {/* الرأس */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-200 rounded-full"></div>
                {/* توهج داخلي */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            {/* تسمية اللاعب */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest text-blue-400 uppercase italic">
                Player
            </div>
          </div>

          {/* مجسم الظل (الوحش/البوس) */}
          <div className="relative animate-pulse">
            {/* جسم الظل الغامض */}
            <div className="w-24 h-64 bg-gradient-to-t from-zinc-900 to-transparent rounded-t-full relative">
                {/* تأثير الدخان/الظل */}
                <div className="absolute inset-0 bg-black/40 blur-sm"></div>
                {/* أعين متوهجة للظل */}
                <div className="absolute top-12 w-full flex justify-around px-6">
                    <div className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_red]"></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_red]"></div>
                </div>
            </div>
            {/* تسمية الوحش */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest text-red-600 uppercase italic">
                Shadow
            </div>
          </div>

        </div>
      </div>

      {/* نص ارشادي بسيط في الأسفل */}
      <div className="absolute bottom-10 text-zinc-700 text-[10px] font-mono tracking-[0.2em] uppercase">
        System: Combat Arena Initialized
      </div>

    </div>
  );
};

export default Battle;
