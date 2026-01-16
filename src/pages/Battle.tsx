import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  
  // إحداثيات اللاعب
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState(0);

  // وظيفة الحركة (تستخدم للكيبورد واللمس)
  const movePlayer = (dx, dy, rot) => {
    const step = 3;
    setPlayerPos(prev => ({
      x: Math.max(5, Math.min(95, prev.x + dx * step * 0.5)),
      y: Math.max(5, Math.min(95, prev.y + dy * step * 0.5))
    }));
    setRotation(rot);
  };

  // التحكم بالكيبورد
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'w' || e.key === 'ArrowUp') movePlayer(0, -1, 0);
      if (e.key === 's' || e.key === 'ArrowDown') movePlayer(0, 1, 180);
      if (e.key === 'a' || e.key === 'ArrowLeft') movePlayer(-1, 0, -90);
      if (e.key === 'd' || e.key === 'ArrowRight') movePlayer(1, 0, 90);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const HumanoidFigure = ({ color }) => (
    <div className="relative flex flex-col items-center scale-[0.4] transition-transform duration-200" style={{ transform: `rotate(${rotation}deg) scale(0.4)` }}>
      <div className={`w-10 h-10 rounded-full mb-1 ${color} border-2 border-white/40 shadow-[0_0_15px_rgba(59,130,246,0.8)]`} />
      <div className="relative">
        <div className={`absolute -left-6 top-0 w-4 h-16 ${color} rounded-full opacity-80`} />
        <div className={`absolute -right-6 top-0 w-4 h-16 ${color} rounded-full opacity-80`} />
        <div className={`w-14 h-20 ${color} rounded-t-xl`} />
      </div>
      <div className="flex gap-2 mt-1">
        <div className={`w-5 h-20 ${color} rounded-b-full`} />
        <div className={`w-5 h-20 ${color} rounded-b-full`} />
      </div>
    </div>
  );

  return (
    <div className="relative w-screen h-screen bg-[#020202] overflow-hidden touch-none">
      
      {/* 1. الخريطة المصغرة (Mini-map) - دائرية وصغيرة */}
      <div className="absolute top-4 left-4 w-24 h-24 bg-black/60 border border-blue-500/30 z-[60] rounded-full overflow-hidden backdrop-blur-md shadow-lg shadow-blue-900/20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #3b82f6 0px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, #3b82f6 0px, transparent 1px, transparent 10px)' }} />
        <div 
          className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        />
      </div>

      {/* 2. بيئة الكهف المتطورة */}
      <div className="absolute inset-0 z-10">
        {/* نظام الإضاءة الاستكشافي (كلما تحركت يظهر المكان) */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
          style={{ 
            background: `radial-gradient(circle at ${playerPos.x}% ${playerPos.y}%, transparent 5%, rgba(0,0,0,0.98) 25%)`
          }} 
        />
        
        {/* تفاصيل الكهف (صخور ونقوش سحرية) */}
        <div className="absolute inset-0 opacity-30" style={{ 
          backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-matter.png')`,
          backgroundSize: '300px'
        }} />

        {/* 3. اللاعب */}
        <div 
          className="absolute transition-all duration-150 ease-linear z-20"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          {/* وهج تحت اللاعب لإضاءة الأرضية */}
          <div className="absolute -inset-20 bg-blue-600/10 blur-[60px] rounded-full" />
          <HumanoidFigure color="bg-blue-500" />
          <div className="mt-[-20px] text-[8px] text-blue-300 font-bold text-center tracking-widest uppercase">E-Rank Hunter</div>
        </div>

        {/* عوائق أو كنوز تظهر عند الاقتراب */}
        <div className="absolute top-[40%] left-[20%] w-10 h-10 bg-orange-950/20 border border-orange-900/30 blur-sm rounded-lg" />
        <div className="absolute top-[70%] left-[80%] w-16 h-16 bg-zinc-900/40 border border-white/5 blur-md rotate-45" />
      </div>

      {/* 4. أجهزة التحكم للهاتف (Mobile Joystick/D-Pad) */}
      <div className="absolute bottom-12 right-12 z-[100] grid grid-cols-3 gap-2 opacity-60">
        <div />
        <button 
          onPointerDown={() => movePlayer(0, -2, 0)}
          className="w-14 h-14 bg-zinc-800/80 rounded-xl border border-white/20 flex items-center justify-center active:bg-blue-900"
        >▲</button>
        <div />
        <button 
          onPointerDown={() => movePlayer(-2, 0, -90)}
          className="w-14 h-14 bg-zinc-800/80 rounded-xl border border-white/20 flex items-center justify-center active:bg-blue-900"
        >◀</button>
        <button 
          onPointerDown={() => movePlayer(0, 2, 180)}
          className="w-14 h-14 bg-zinc-800/80 rounded-xl border border-white/20 flex items-center justify-center active:bg-blue-900"
        >▼</button>
        <button 
          onPointerDown={() => movePlayer(2, 0, 90)}
          className="w-14 h-14 bg-zinc-800/80 rounded-xl border border-white/20 flex items-center justify-center active:bg-blue-900"
        >▶</button>
      </div>

      {/* شريط معلومات علوي خفيف */}
      <div className="absolute top-4 right-4 z-[60] text-right">
        <div className="text-[10px] text-blue-500 font-mono tracking-widest uppercase">Dungeon: C-Rank</div>
        <div className="text-[8px] text-zinc-500 font-mono">X: {playerPos.x.toFixed(0)} Y: {playerPos.y.toFixed(0)}</div>
      </div>

    </div>
  );
};

export default Battle;
