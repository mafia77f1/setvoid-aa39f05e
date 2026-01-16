import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Battle = () => {
  const navigate = useNavigate();
  
  // إحداثيات اللاعب في العالم الكبير (0-2000)
  const [worldPos, setWorldPos] = useState({ x: 500, y: 500 });
  const [rotation, setRotation] = useState(0);
  
  // مواقع الأهداف (نسبة مئوية من حجم العالم)
  const targets = {
    boss: { x: 80, y: 20 },     // أحمر
    portal: { x: 15, y: 85 },   // أزرق
    loot: { x: 50, y: 40 }      // أخضر
  };

  const movePlayer = (dx, dy, rot) => {
    setWorldPos(prev => ({
      x: Math.max(0, Math.min(100, prev.x + dx * 2)),
      y: Math.max(0, Math.min(100, prev.y + dy * 2))
    }));
    setRotation(rot);
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

  const ShadowHunter = () => (
    <div className="relative scale-110" style={{ transform: `rotate(${rotation}deg)` }}>
      <div className="absolute -top-6 flex gap-3 z-50">
        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee]" />
        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee]" />
      </div>
      <div className="w-8 h-10 bg-zinc-950 rounded-t-full border-t border-cyan-900/50" />
      <div className="w-10 h-14 bg-zinc-950 rounded-b-md shadow-2xl border-x border-white/5" />
      <div className="absolute -bottom-4 w-14 h-8 bg-cyan-500/10 blur-2xl rounded-full" />
    </div>
  );

  return (
    <div className="relative w-screen h-screen bg-[#020202] overflow-hidden touch-none font-sans select-none">
      
      {/* 1. الكهف (العالم الذي يتحرك) */}
      <div 
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ 
          transform: `translate(${-worldPos.x + 50}%, ${-worldPos.y + 50}%)`,
          width: '500%', height: '500%', // جعل العالم ضخماً
          backgroundImage: `
            radial-gradient(circle at ${worldPos.x}% ${worldPos.y}%, transparent 0%, #020202 15%),
            linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 80px 80px, 80px 80px'
        }}
      >
        {/* رسم الزعيم والبوابة واللوت في العالم الحقيقي لكي نمر بجانبهم */}
        <div className="absolute w-4 h-4 bg-red-600 blur-xl" style={{ left: '80%', top: '20%' }} />
        <div className="absolute w-10 h-10 border-2 border-blue-500 rounded-full animate-ping" style={{ left: '15%', top: '85%' }} />
        <div className="absolute w-4 h-4 bg-green-500 shadow-[0_0_20px_green]" style={{ left: '50%', top: '40%' }} />
      </div>

      {/* 2. اللاعب (ثابت في مركز الشاشة) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
        <ShadowHunter />
      </div>

      {/* 3. الخريطة المصغرة المتطورة (Mini-map) */}
      <div className="absolute top-6 left-6 w-32 h-32 bg-black/90 border-2 border-zinc-800 z-[60] rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
        
        {/* الزعيم (أحمر) */}
        <div className="absolute w-2 h-2 bg-red-600 rounded-full shadow-[0_0_8px_red]" 
             style={{ left: `${targets.boss.x}%`, top: `${targets.boss.y}%` }} />
        
        {/* البوابة (أزرق) */}
        <div className="absolute w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" 
             style={{ left: `${targets.portal.x}%`, top: `${targets.portal.y}%` }} />
        
        {/* لوت (أخضر) */}
        <div className="absolute w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" 
             style={{ left: `${targets.loot.x}%`, top: `${targets.loot.y}%` }} />

        {/* اللاعب (نقطة بيضاء تظهر مكانه الحالي) */}
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"
             style={{ left: `${worldPos.x}%`, top: `${worldPos.y}%` }} />
             
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] text-zinc-500 font-bold uppercase tracking-tighter italic">Radar active</div>
      </div>

      {/* 4. أزرار التحكم (الموبايل) */}
      <div className="absolute bottom-10 right-10 z-[100] flex flex-col items-center gap-2 scale-125 opacity-40">
        <button onPointerDown={() => movePlayer(0, -1, 0)} className="w-12 h-12 bg-white/10 rounded-full border border-white/20">▲</button>
        <div className="flex gap-2">
          <button onPointerDown={() => movePlayer(-1, 0, -90)} className="w-12 h-12 bg-white/10 rounded-full border border-white/20">◀</button>
          <button onPointerDown={() => movePlayer(0, 1, 180)} className="w-12 h-12 bg-white/10 rounded-full border border-white/20">▼</button>
          <button onPointerDown={() => movePlayer(1, 0, 90)} className="w-12 h-12 bg-white/10 rounded-full border border-white/20">▶</button>
        </div>
      </div>

      {/* واجهة النظام */}
      <div className="absolute top-6 right-6 z-50">
        <div className="bg-black/50 border-r-2 border-cyan-500 px-4 py-1">
          <div className="text-cyan-400 text-xs font-black tracking-[.2em] italic">MONARCH SYSTEM</div>
          <div className="text-[9px] text-zinc-400">STATUS: SCANNING DUNGEON...</div>
        </div>
      </div>

    </div>
  );
};

export default Battle;
