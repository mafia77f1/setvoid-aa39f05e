import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Battle = () => {
  const navigate = useNavigate();
  const [worldPos, setWorldPos] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState(0);

  const targets = {
    boss: { x: 80, y: 20 },
    portal: { x: 15, y: 85 },
    loot: { x: 50, y: 40 }
  };

  const movePlayer = (dx, dy, rot) => {
    setWorldPos(prev => ({
      x: Math.max(0, Math.min(100, prev.x + dx * 1.5)),
      y: Math.max(0, Math.min(100, prev.y + dy * 1.5))
    }));
    setRotation(rot);
  };

  // تصميم شخصية الملك (The Monarch Design)
  const MonarchCharacter = () => (
    <div className="relative" style={{ transform: `rotate(${rotation}deg)` }}>
      {/* تأثير دخان الظل المحيط */}
      <div className="absolute -inset-4 bg-purple-600/20 blur-xl animate-pulse" />
      
      {/* العباءة (Cape) */}
      <div className="absolute -bottom-6 -left-3 w-10 h-14 bg-gradient-to-t from-transparent via-zinc-900 to-zinc-950 clip-cape z-10" />
      
      {/* الجسم الحاد */}
      <div className="relative z-20 flex flex-col items-center">
        {/* العيون المشعة */}
        <div className="absolute top-1 flex gap-2">
          <div className="w-1 h-0.5 bg-cyan-300 shadow-[0_0_5px_#22d3ee]" />
          <div className="w-1 h-0.5 bg-cyan-300 shadow-[0_0_5px_#22d3ee]" />
        </div>
        <div className="w-6 h-7 bg-zinc-900 rounded-full border-t border-white/20" />
        <div className="w-8 h-10 bg-zinc-950 rounded-b-sm border-x border-zinc-800" />
      </div>
    </div>
  );

  return (
    <div className="relative w-screen h-screen bg-[#0a0510] overflow-hidden touch-none font-sans select-none">
      
      {/* 1. الكهف الملون (The Mystic Environment) */}
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{ 
          transform: `translate(${-worldPos.x + 50}%, ${-worldPos.y + 50}%)`,
          width: '400%', height: '400%',
          background: `
            radial-gradient(circle at ${worldPos.x}% ${worldPos.y}%, transparent 2%, #0a0510 12%),
            linear-gradient(45deg, #120a1f 25%, #1a0f2e 50%, #120a1f 75%)
          `,
          backgroundSize: '100% 100%, 400px 400px'
        }}
      >
        {/* بلورات متناثرة في الكهف (Crystals) */}
        {[...Array(20)].map((_, i) => (
          <div key={i} 
               className="absolute w-8 h-12 bg-purple-900/30 blur-sm rounded-full rotate-45 border border-purple-500/20"
               style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }} />
        ))}

        {/* الأهداف الحقيقية في العالم */}
        <div className="absolute w-16 h-16 bg-red-900/40 blur-2xl rounded-full animate-pulse" style={{ left: '80%', top: '20%' }} />
        <div className="absolute w-20 h-20 border-4 border-cyan-500/30 rounded-full shadow-[0_0_50px_rgba(6,182,212,0.5)]" style={{ left: '15%', top: '85%' }} />
        <div className="absolute w-6 h-6 bg-green-500/40 blur-md" style={{ left: '50%', top: '40%' }} />
      </div>

      {/* 2. اللاعب (ثابت في المركز) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <MonarchCharacter />
      </div>

      {/* 3. الخريطة المصغرة (شفافة واحترافية) */}
      <div className="absolute top-6 left-6 w-28 h-28 bg-black/40 border border-white/10 z-[60] rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="absolute w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
        <div className="absolute w-1.5 h-1.5 bg-red-500 rounded-full" style={{ left: '80%', top: '20%' }} />
        <div className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_5px_cyan]" style={{ left: '15%', top: '85%' }} />
        <div className="absolute w-1.5 h-1.5 bg-green-400 rounded-full" style={{ left: '50%', top: '40%' }} />
        <div className="absolute w-2 h-2 bg-white rounded-full border border-black" style={{ left: `${worldPos.x}%`, top: `${worldPos.y}%` }} />
      </div>

      {/* 4. أزرار التحكم (تصميم سحري) */}
      <div className="absolute bottom-10 right-10 z-[100] flex flex-col items-center gap-2">
        <button onPointerDown={() => movePlayer(0, -1, 0)} className="w-14 h-14 bg-purple-900/20 backdrop-blur-lg border border-purple-500/30 rounded-xl text-purple-400 flex items-center justify-center active:bg-purple-500/40 transition-all">▲</button>
        <div className="flex gap-2">
          <button onPointerDown={() => movePlayer(-1, 0, -90)} className="w-14 h-14 bg-purple-900/20 backdrop-blur-lg border border-purple-500/30 rounded-xl text-purple-400 flex items-center justify-center active:bg-purple-500/40 transition-all">◀</button>
          <button onPointerDown={() => movePlayer(0, 1, 180)} className="w-14 h-14 bg-purple-900/20 backdrop-blur-lg border border-purple-500/30 rounded-xl text-purple-400 flex items-center justify-center active:bg-purple-500/40 transition-all">▼</button>
          <button onPointerDown={() => movePlayer(1, 0, 90)} className="w-14 h-14 bg-purple-900/20 backdrop-blur-lg border border-purple-500/30 rounded-xl text-purple-400 flex items-center justify-center active:bg-purple-500/40 transition-all">▶</button>
        </div>
      </div>

      <style>{`
        .clip-cape {
          clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 50% 85%, 0% 100%);
        }
      `}</style>
    </div>
  );
};

export default Battle;
