import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { toast } from '@/hooks/use-toast';
import { Timer, MapPin, Skull, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const Battle = () => {
  const navigate = useNavigate();
  const { gameState } = useGameState();
  const [dungeon, setDungeon] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // 1. منطق تحديد نوع المغارة عشوائياً عند الدخول
  useEffect(() => {
    const dungeonTypes = [
      { id: 5, name: "مغارة عادية", time: 7200, color: "bg-zinc-500", bossType: "human", rarity: 0.5 },
      { id: 4, name: "عرين الغيلان", time: 5400, color: "bg-green-700", bossType: "orc", rarity: 0.2 },
      { id: 3, name: "جحر الثعابين", time: 3600, color: "bg-emerald-900", bossType: "snake", rarity: 0.15 },
      { id: 2, name: "الغول الغامض", time: 2700, color: "bg-purple-900", bossType: "ogre", rarity: 0.1 },
      { id: 1, name: "قلعة الظلال", time: 1800, color: "bg-blue-950", bossType: "shadow_knight", rarity: 0.04 },
      { id: 0, name: "المغارة الحمراء (S)", time: 900, color: "bg-red-600", bossType: "monarch", rarity: 0.01 }
    ];

    // فرصة نادرة جداً لتحول مغارة ليفل 5 إلى ليفل 0
    let selected;
    const isGlitch = Math.random() < 0.05; // 5% chance
    if (isGlitch) {
      selected = dungeonTypes[5];
      toast({ title: "⚠️ تحذير نظامي!", description: "لقد تحولت البوابة إلى مغارة حمراء!", variant: "destructive" });
    } else {
      selected = dungeonTypes[Math.floor(Math.random() * dungeonTypes.length)];
    }

    setDungeon(selected);
    setTimeLeft(selected.time);

    toast({
      title: "تم اكتشاف بوابة!",
      description: `المكان: منطقة ${Math.floor(Math.random() * 100)} - رتبة: ${selected.id}`,
    });
  }, []);

  // 2. عداد الوقت التنازلي
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!dungeon) return <div className="bg-black h-screen" />;

  // مكون المجسم البشري
  const HumanoidFigure = ({ scale, color, type }) => {
    const isShadow = type === 'shadow' || type === 'monarch';
    return (
      <div className="relative flex flex-col items-center transition-all duration-700" style={{ transform: `scale(${scale})` }}>
        {/* الرأس */}
        <div className={cn("w-8 h-8 rounded-full mb-1 border-2", color, isShadow ? "animate-pulse shadow-[0_0_15px_blue]" : "border-white/20")} />
        {/* الجذع */}
        <div className="relative">
          <div className={cn("absolute -left-6 top-0 w-4 h-16 rounded-full rotate-12", color)} />
          <div className={cn("absolute -right-6 top-0 w-4 h-16 rounded-full -rotate-12", color)} />
          <div className={cn("w-12 h-24 rounded-t-lg", color)} />
        </div>
        {/* الأرجل */}
        <div className="flex gap-2 mt-1">
          <div className={cn("w-4 h-20 rounded-b-full", color)} />
          <div className={cn("w-4 h-20 rounded-b-full", color)} />
        </div>
      </div>
    );
  };

  return (
    <div className={cn("min-h-screen text-white overflow-hidden flex flex-col items-center bg-black transition-colors duration-1000", dungeon.id === 0 && "bg-red-950/20")}>
      
      {/* هيدر المغارة */}
      <div className="w-full p-6 flex justify-between items-start z-20">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
            <MapPin className="w-3 h-3" /> جاري استكشاف المغارة رقم {dungeon.id}
          </div>
          <h2 className={cn("text-2xl font-black italic uppercase tracking-tighter", dungeon.id === 0 ? "text-red-500 animate-pulse" : "text-white")}>
            {dungeon.name}
          </h2>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-red-500 font-mono font-bold text-xl">
            <Timer className="w-5 h-5" /> {formatTime(timeLeft)}
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">وقت الإغلاق</span>
        </div>
      </div>

      <div className="relative w-full h-[50vh] flex flex-col items-center justify-center mt-10">
        {/* المنصة */}
        <div className="absolute bottom-[10%] w-full flex flex-col items-center">
          <div className={cn("w-[85%] h-[2px] shadow-lg", dungeon.id === 0 ? "bg-red-500 shadow-red-500/50" : "bg-zinc-800 shadow-white/5")} />
        </div>

        {/* الشخصيات */}
        <div className="relative w-full max-w-4xl flex justify-between items-end px-10 pb-[10%] z-10">
          
          {/* الزعيم (يسار) - كبير */}
          <div className="flex flex-col items-center relative">
            <div className="absolute -top-16 flex flex-col items-center">
              <Skull className={cn("w-6 h-6 mb-1", dungeon.id === 0 ? "text-red-500" : "text-zinc-600")} />
              <span className="text-[10px] font-mono opacity-40 uppercase">Boss Unit</span>
            </div>
            <HumanoidFigure 
               scale={dungeon.id === 0 ? 2.5 : 1.8 - (dungeon.id * 0.1)} 
               color={dungeon.id === 0 ? "bg-red-600" : "bg-zinc-900"} 
               type={dungeon.id <= 1 ? "shadow" : "normal"}
            />
          </div>

          {/* اللاعب (يمين) - صغير */}
          <div className="flex flex-col items-center relative">
             <div className="absolute -top-10 px-2 py-0.5 bg-blue-600 text-[8px] font-bold skew-x-[-12deg]">RANK E</div>
             <HumanoidFigure scale={1.1} color="bg-blue-600" type="player" />
          </div>

        </div>
      </div>

      {/* زر الخروج */}
      <button onClick={() => navigate('/boss')} className="mt-auto mb-10 p-4 border border-white/5 rounded-full hover:bg-white/5 transition-all">
        <ShieldAlert className="w-6 h-6 text-zinc-600 hover:text-red-500" />
      </button>

      {/* نظام التنبيهات السفلي */}
      <div className="fixed bottom-4 left-4 right-4 bg-black/80 border border-white/5 p-3 rounded-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">
            النظام: جاري مراقبة مستوى الطاقة في المغارة... 
            {dungeon.id === 0 ? " خطر! انسحب فوراً!" : " الحالة مستقرة."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Battle;
