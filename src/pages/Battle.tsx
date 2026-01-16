import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  
  // نظام الإحداثيات للحركة
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const dungeonSize = { width: 1000, height: 1000 }; // حجم الكهف الافتراضي

  // معالجة الحركة
  useEffect(() => {
    const handleKeyDown = (e) => {
      const step = 5;
      setPlayerPos(prev => {
        let newPos = { ...prev };
        if (e.key === 'w' || e.key === 'ArrowUp') newPos.y = Math.max(0, prev.y - step);
        if (e.key === 's' || e.key === 'ArrowDown') newPos.y = Math.min(100, prev.y + step);
        if (e.key === 'a' || e.key === 'ArrowLeft') newPos.x = Math.max(0, prev.x - step);
        if (e.key === 'd' || e.key === 'ArrowRight') newPos.x = Math.min(100, prev.x + step);
        return newPos;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // مكون مجسم الجسم البشري
  const HumanoidFigure = ({ color }) => (
    <div className="relative flex flex-col items-center scale-50">
      <div className={`w-8 h-8 rounded-full mb-1 ${color} border-2 border-white/20`} />
      <div className="relative">
        <div className={`absolute -left-6 top-0 w-4 h-16 ${color} rounded-full rotate-12 origin-top`} />
        <div className={`absolute -right-6 top-0 w-4 h-16 ${color} rounded-full -rotate-12 origin-top`} />
        <div className={`w-12 h-20 ${color} rounded-t-lg`} />
      </div>
      <div className="flex gap-2 mt-1">
        <div className={`w-4 h-20 ${color} rounded-b-full`} />
        <div className={`w-4 h-20 ${color} rounded-b-full`} />
      </div>
    </div>
  );

  return (
    <div className="relative w-screen h-screen bg-[#050505] overflow-hidden font-sans">
      
      {/* 1. الخريطة المصغرة (Mini-map) - أعلى اليسار */}
      <div className="absolute top-5 left-5 w-40 h-40 bg-black/80 border-2 border-blue-900/50 z-50 rounded-sm overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 opacity-20 border-[1px] border-blue-500/20" 
             style={{ backgroundImage: 'linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        {/* نقطة اللاعب على الخريطة */}
        <div 
          className="absolute w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}
        />
        <div className="absolute bottom-1 left-1 text-[8px] text-blue-400 font-mono uppercase tracking-tighter">Coded Location: B1</div>
      </div>

      {/* 2. بيئة الكهف (Dungeon Environment) */}
      <div 
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ 
          background: `radial-gradient(circle at ${playerPos.x}% ${playerPos.y}%, rgba(29, 78, 216, 0.15) 0%, rgba(0,0,0,1) 40%), 
                       url('https://www.transparenttextures.com/patterns/dark-matter.png')`,
          backgroundSize: 'cover'
        }}
      >
        {/* عوائق صخرية وهمية لتعزيز شكل الكهف */}
        <div className="absolute top-[20%] left-[30%] w-32 h-32 bg-zinc-900/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[20%] w-64 h-64 bg-zinc-900/40 rounded-full blur-3xl" />
        
        {/* خطوط الأرضية لإعطاء إحساس بالحركة والعمق */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '100px 100px' }} />

        {/* 3. اللاعب (The Player) */}
        <div 
          className="absolute transition-all duration-100 ease-linear z-10"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative">
            {/* ضوء تحت اللاعب */}
            <div className="absolute -bottom-2 w-12 h-4 bg-blue-500/20 blur-xl rounded-full" />
            <HumanoidFigure color="bg-blue-600" />
          </div>
        </div>

        {/* وحش مرابط في الكهف (كمثال) */}
        <div className="absolute top-[30%] left-[70%] opacity-40">
           <HumanoidFigure color="bg-zinc-800" />
           <div className="text-red-900 text-[8px] mt-2 font-bold text-center tracking-[0.3em]">STAY AWAY</div>
        </div>
      </div>

      {/* واجهة تحكم بسيطة للموبايل أو للتوضيح */}
      <div className="absolute bottom-10 right-10 flex flex-col items-center gap-2 opacity-30 scale-75">
        <div className="px-4 py-2 border border-white">W</div>
        <div className="flex gap-2">
          <div className="px-4 py-2 border border-white">A</div>
          <div className="px-4 py-2 border border-white">S</div>
          <div className="px-4 py-2 border border-white">D</div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 tracking-[1em] font-mono">
        EXPLORATION MODE
      </div>

    </div>
  );
};

export default Battle;
