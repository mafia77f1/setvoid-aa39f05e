import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  if (!boss) {
    navigate('/boss');
    return null;
  }

  // مكون مجسم الجسم البشري (Humanoid Figure)
  const HumanoidFigure = ({ color, isEnemy = false }) => (
    <div className={`relative flex flex-col items-center ${isEnemy ? 'animate-pulse' : ''}`}>
      {/* الرأس */}
      <div className={`w-8 h-8 rounded-full mb-1 ${color} border-2 border-white/20`} />
      {/* الرقبة */}
      <div className={`w-2 h-2 ${color} opacity-80`} />
      {/* الجذع والأذرع */}
      <div className="relative">
        {/* الأذرع */}
        <div className={`absolute -left-6 top-0 w-4 h-16 ${color} rounded-full rotate-12 origin-top border border-white/10`} />
        <div className={`absolute -right-6 top-0 w-4 h-16 ${color} rounded-full -rotate-12 origin-top border border-white/10`} />
        {/* الجذع */}
        <div className={`w-12 h-20 ${color} rounded-t-lg border-x-2 border-white/10`} />
      </div>
      {/* الحوض */}
      <div className={`w-12 h-4 ${color} rounded-b-md opacity-90`} />
      {/* الأرجل */}
      <div className="flex gap-2 mt-1">
        <div className={`w-4 h-20 ${color} rounded-b-full border-b-2 border-white/20`} />
        <div className={`w-4 h-20 ${color} rounded-b-full border-b-2 border-white/20`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center font-sans">
      
      <div className="relative w-full h-[60vh] flex flex-col items-center justify-center">
        
        {/* المنصة: خط أحمر حاد ومضيء */}
        <div className="absolute bottom-[20%] w-full flex flex-col items-center">
          <div className="w-[90%] h-[3px] bg-red-600 shadow-[0_0_15px_rgba(220,38,38,1)]"></div>
        </div>

        {/* الشخصيات */}
        <div className="relative w-full max-w-2xl flex justify-between items-end px-12 pb-[20%] z-10">
          
          {/* الوحش (على اليسار) - لون غامق/ظل */}
          <div className="flex flex-col items-center">
            <span className="mb-4 text-red-600 font-black italic text-xs tracking-widest uppercase opacity-50">Enemy</span>
            <div className="drop-shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                <HumanoidFigure color="bg-zinc-900" isEnemy={true} />
            </div>
          </div>

          {/* اللاعب (على اليمين) - لون إنسان طبيعي/أزرق */}
          <div className="flex flex-col items-center">
            <span className="mb-4 text-blue-400 font-black italic text-xs tracking-widest uppercase opacity-50">Player</span>
            <div className="drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                <HumanoidFigure color="bg-blue-600" />
            </div>
          </div>

        </div>
      </div>

      <div className="mt-10 opacity-20 font-mono text-[10px] tracking-[0.5em]">
        ARENA PHASE 01
      </div>

    </div>
  );
};

export default Battle;
