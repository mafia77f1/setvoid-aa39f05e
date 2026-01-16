import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Battle = () => {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 80 });
  const [currentRoom, setCurrentRoom] = useState("Gate Entrance");
  const [stats, setStats] = useState({ level: 20, mp: 1200 });

  // دالة تحريك بسيطة وسلسة
  const handleMove = (dir) => {
    setPlayerPos(prev => {
      if (dir === 'up') return { ...prev, y: Math.max(20, prev.y - 5) };
      if (dir === 'down') return { ...prev, y: Math.min(90, prev.y + 5) };
      if (dir === 'left') return { ...prev, x: Math.max(10, prev.x - 5) };
      if (dir === 'right') return { ...prev, x: Math.min(90, prev.x + 5) };
      return prev;
    });
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans text-white">
      
      {/* 1. الطبقة الخلفية: تصميم الكهف (استخدام التدرجات لخلق عمق) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
        {/* جدران الكهف الوهمية */}
        <div className="absolute top-0 w-full h-1/2 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40 shadow-[inset_0_-100px_100px_rgba(0,0,0,1)]" />
      </div>

      {/* 2. واجهة النظام (System UI) - هي اللي تعطي جمال سولو ليفلينج */}
      <div className="absolute top-0 w-full p-6 z-50 flex justify-between items-start pointer-events-none">
        <div className="border-l-4 border-cyan-500 pl-4 bg-black/40 backdrop-blur-md p-2">
            <h1 className="text-cyan-400 font-black italic tracking-tighter text-2xl">CURRENT RAID</h1>
            <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">{currentRoom}</p>
        </div>
        
        <div className="text-right">
            <div className="text-[10px] text-zinc-500 mb-1">MANA POINTS</div>
            <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]" style={{ width: '80%' }} />
            </div>
        </div>
      </div>

      {/* 3. منطقة التحرك (Play Area) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div 
           className="relative transition-all duration-300 ease-out"
           style={{ left: `${playerPos.x - 50}%`, top: `${playerPos.y - 50}%` }}
        >
          {/* شخصية اللاعب (تصميم مينيمايست احترافي) */}
          <div className="relative flex flex-col items-center">
            {/* توهج تحت اللاعب */}
            <div className="absolute -bottom-2 w-16 h-4 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
            
            {/* رأس الشخصية مع العيون */}
            <div className="w-6 h-7 bg-zinc-900 rounded-t-full relative border-t border-cyan-500/50">
                <div className="absolute top-3 left-1 w-1 h-0.5 bg-cyan-400 shadow-[0_0_5px_cyan]" />
                <div className="absolute top-3 right-1 w-1 h-0.5 bg-cyan-400 shadow-[0_0_5px_cyan]" />
            </div>
            {/* الجسد مع الوشاح */}
            <div className="w-8 h-12 bg-zinc-900 relative rounded-b-sm">
                <div className="absolute -left-2 top-0 w-12 h-16 bg-gradient-to-b from-zinc-900 to-transparent clip-path-cape opacity-70" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. أزرار التحكم (التصميم الشفاف) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-[100]">
        <div className="grid grid-cols-3 gap-2">
            <div />
            <button onClick={() => handleMove('up')} className="w-14 h-14 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl active:bg-cyan-500/20 transition-all">▲</button>
            <div />
            <button onClick={() => handleMove('left')} className="w-14 h-14 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl active:bg-cyan-500/20 transition-all">◀</button>
            <button onClick={() => handleMove('down')} className="w-14 h-14 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl active:bg-cyan-500/20 transition-all">▼</button>
            <button onClick={() => handleMove('right')} className="w-14 h-14 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl active:bg-cyan-500/20 transition-all">▶</button>
        </div>
      </div>

      {/* 5. الخريطة (Mini Map) - كأنها شاشة نظام هولوجرام */}
      <div className="absolute bottom-10 left-10 w-24 h-24 border border-cyan-500/20 bg-cyan-500/5 rounded-full backdrop-blur-sm overflow-hidden z-[100]">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-full h-[1px] bg-cyan-500" />
            <div className="h-full w-[1px] bg-cyan-500 absolute" />
        </div>
        <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }} />
      </div>

      <style>{`
        .clip-path-cape {
          clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 50% 80%, 0% 100%);
        }
      `}</style>

    </div>
  );
};

export default Battle;
