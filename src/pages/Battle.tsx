import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 70 });
  const [rotation, setRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // وظيفة الحركة المحسنة
  const movePlayer = (dx, dy, rot) => {
    setIsMoving(true);
    setPlayerPos(prev => ({
      x: Math.max(10, Math.min(90, prev.x + dx * 2.5)),
      y: Math.max(10, Math.min(90, prev.y + dy * 2.5))
    }));
    setRotation(rot);
    setTimeout(() => setIsMoving(false), 200);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const keys = {
        'w': [0, -1, 0], 'ArrowUp': [0, -1, 0],
        's': [0, 1, 180], 'ArrowDown': [0, 1, 180],
        'a': [-1, 0, -90], 'ArrowLeft': [-1, 0, -90],
        'd': [1, 0, 90], 'ArrowRight': [1, 0, 90]
      };
      if (keys[e.key]) movePlayer(...keys[e.key]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // تصميم الشخصية الجديد (Shadow Hunter)
  const ShadowHunter = () => (
    <div className={`relative transition-transform duration-300 ${isMoving ? 'scale-110' : 'scale-100'}`} 
         style={{ transform: `rotate(${rotation}deg)` }}>
      {/* توهج العيون */}
      <div className="absolute -top-6 flex gap-3 z-50">
        <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
        <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
      </div>
      {/* الرأس والوشاح */}
      <div className="w-6 h-8 bg-zinc-900 rounded-t-full relative">
        <div className="absolute -bottom-4 -left-2 w-10 h-12 bg-gradient-to-b from-zinc-900 to-transparent clip-path-cloak opacity-80" />
      </div>
      {/* الجسم الرياضي */}
      <div className="w-8 h-12 bg-zinc-900 rounded-sm border-x border-white/10 shadow-[0_0_20px_rgba(0,0,0,1)]" />
      {/* دخان الظل تحت الشخصية */}
      <div className="absolute -bottom-2 w-12 h-6 bg-cyan-900/20 blur-xl animate-pulse" />
    </div>
  );

  return (
    <div className="relative w-screen h-screen bg-[#020205] overflow-hidden touch-none font-sans">
      
      {/* 1. نظام الضباب والإضاءة السينمائية */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at ${playerPos.x}% ${playerPos.y}%, transparent 0%, rgba(0,0,0,0.95) 30%)`
        }} 
      />

      {/* 2. أرضية الكهف (3D Grid Perspective) */}
      <div className="absolute inset-0 z-0" style={{ perspective: '1000px' }}>
        <div 
          className="absolute inset-0 transition-all duration-500 ease-out"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(34, 211, 238, 0.05) 1px, transparent 1px), 
                              linear-gradient(to bottom, rgba(34, 211, 238, 0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            transform: `rotateX(60deg) translateY(${-playerPos.y * 0.5}px)`,
            transformOrigin: 'top'
          }} 
        />
      </div>

      {/* 3. الخريطة المصغرة (Cyber Style) */}
      <div className="absolute top-6 left-6 w-20 h-20 bg-black/80 border border-cyan-500/30 z-[60] rounded-lg overflow-hidden backdrop-blur-xl">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-50" />
          <div className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] transition-all duration-300"
               style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }} />
      </div>

      {/* 4. كائن اللاعب */}
      <div 
        className="absolute transition-all duration-300 ease-out z-30"
        style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        <ShadowHunter />
      </div>

      {/* 5. التحكم للهاتف (Invisible D-Pad Interface) */}
      <div className="absolute bottom-10 right-10 z-[100] grid grid-cols-3 gap-3">
        <div />
        <button onPointerDown={() => movePlayer(0, -1, 0)} className="w-16 h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <div className="w-2 h-2 bg-cyan-400 rotate-45 shadow-[0_0_10px_#22d3ee]" />
        </button>
        <div />
        <button onPointerDown={() => movePlayer(-1, 0, -90)} className="w-16 h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <div className="w-2 h-2 bg-cyan-400 rotate-45 shadow-[0_0_10px_#22d3ee]" />
        </button>
        <button onPointerDown={() => movePlayer(0, 1, 180)} className="w-16 h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <div className="w-2 h-2 bg-cyan-400 rotate-45 shadow-[0_0_10px_#22d3ee]" />
        </button>
        <button onPointerDown={() => movePlayer(1, 0, 90)} className="w-16 h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <div className="w-2 h-2 bg-cyan-400 rotate-45 shadow-[0_0_10px_#22d3ee]" />
        </button>
      </div>

      {/* نصوص النظام */}
      <div className="absolute top-6 right-6 z-[60] font-mono">
        <div className="text-cyan-500 text-sm tracking-[0.3em] font-black italic">SYSTEM: EXPLORATION</div>
        <div className="text-[10px] text-zinc-500">PLAYER_COORD: {playerPos.x.toFixed(0)},{playerPos.y.toFixed(0)}</div>
      </div>

      <style>{`
        .clip-path-cloak {
          clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
        }
      `}</style>
    </div>
  );
};

export default Battle;
