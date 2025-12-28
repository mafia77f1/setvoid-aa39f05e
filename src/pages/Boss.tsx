import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Radio, ChevronRight, Activity, Flame, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  const gates = [
    { id: 'g0', rank: 'S', name: boss?.name || 'VOID MONARCH', color: 'black', difficulty: 'CALAMITY', energy: 'INFINITY', desc: 'THE ATMOSPHERE IS HEAVY. A PRESENCE THAT DEFIES THE LAWS OF THE SYSTEM.' },
    { id: 'g1', rank: 'A', name: 'SHADOW FORTRESS', color: 'purple', difficulty: 'EXTREME', energy: '98,400 MP', desc: 'HIGH-LEVEL MAGICAL FLUCTUATIONS DETECTED. ELITE BOSS CONFIRMED.' },
    { id: 'g3', rank: 'B', name: 'FROZEN LABYRINTH', color: 'blue', difficulty: 'HARD', energy: '22,000 MP', desc: 'STABLE DUNGEON ENVIRONMENT. RECOMMENDED FOR HIGH-TIER HUNTERS.' },
  ];

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-4 font-sans selection:bg-white/30 pb-32 overflow-x-hidden">
      
      {/* Background FX - نظام مانا تقني */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(30,58,138,0.3),transparent_70%)]" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,255,255,0.02),transparent,rgba(255,255,255,0.02))] bg-[size:100%_4px,100%_100%]" />
      </div>

      <header className="relative z-10 flex flex-col items-center pt-10 mb-28">
        <h1 className="text-5xl font-[1000] tracking-[0.4em] uppercase italic text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]">
          GATE <span className="text-red-600 animate-pulse">RAID</span>
        </h1>
        <div className="flex items-center gap-3 mt-4 text-blue-400">
          <div className="h-[2px] w-16 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
          <p className="text-[10px] font-black tracking-[0.6em] uppercase">SYSTEM SCANNING...</p>
          <div className="h-[2px] w-16 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-48">
        {gates.map((gate) => (
          <div key={gate.id} className="relative pt-20">
            
            {/* البوابة العملاقة المفتوحة - بدون المركز الأسود */}
            <div className="absolute -top-28 left-1/2 -translate-x-1/2 z-30 w-64 h-64 group cursor-pointer">
              
              {/* هالة الانفجار الطاقي */}
              <div className={cn(
                "absolute inset-[-30px] rounded-full blur-[60px] animate-pulse opacity-80",
                gate.color === 'black' ? "bg-white/40" : gate.color === 'purple' ? "bg-purple-600/50" : "bg-blue-600/50"
              )} />
              
              {/* جسم البوابة - دوامة كاملة */}
              <div className={cn(
                "relative w-full h-full rounded-full border-[10px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform duration-700",
                gate.color === 'black' ? "border-white" : 
                gate.color === 'purple' ? "border-purple-500 shadow-[0_0_40px_rgba(147,51,234,0.6)]" : 
                "border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.6)]"
              )}>
                
                {/* الدوامة - تم ملء المركز بالكامل باللون المتحرك */}
                <div className={cn(
                  "absolute inset-[-100%] animate-[spin_3s_linear_infinite] blur-[2px]",
                  gate.color === 'black' ? "bg-[conic-gradient(from_0deg,#000,#fff,#888,#fff,#000,#fff)]" :
                  gate.color === 'purple' ? "bg-[conic-gradient(from_0deg,#4c1d95,#a855f7,#7c3aed,#a855f7,#4c1d95)]" :
                  "bg-[conic-gradient(from_0deg,#1e3a8a,#3b82f6,#2563eb,#3b82f6,#1e3a8a)]"
                )} />
                
                {/* تأثير "عين الإعصار" - ضوء ساطع بدلاً من الأسود */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_0%,transparent_70%)] animate-pulse" />
                
                {/* لمعان إضافي في المنتصف */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={cn(
                        "w-full h-full rounded-full mix-blend-overlay animate-ping",
                        gate.color === 'black' ? "bg-white/30" : gate.color === 'purple' ? "bg-purple-300/30" : "bg-blue-300/30"
                    )} />
                </div>
              </div>

              {/* الرتبة - ضخمة جداً */}
              <div className={cn(
                "absolute -top-4 -right-4 z-40 px-7 py-2 font-[1000] italic text-4xl border-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] skew-x-[-15deg]",
                gate.color === 'black' ? "bg-white text-black border-slate-300" : 
                gate.color === 'purple' ? "bg-purple-600 text-white border-purple-400" : 
                "bg-blue-600 text-white border-blue-400"
              )}>
                {gate.rank}
              </div>
            </div>

            {/* كارد المعلومات - نظام الماركت الفاخر */}
            <div className="relative bg-[#040813] border-2 border-white/90 pt-40 p-8 shadow-[0_30px_100px_rgba(0,0,0,1)]">
              
              {/* عنوان البوابة (Market Style) */}
              <div className="flex justify-center mb-8">
                <div className="bg-black/95 px-10 py-2 border-2 border-white relative shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                   <h3 className="text-lg font-black tracking-[0.3em] text-white uppercase italic drop-shadow-[0_0_8px_white]">
                     {gate.name}
                   </h3>
                   <div className="absolute -top-2 -left-2 w-4 h-4 bg-white rotate-45 border border-black" />
                   <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rotate-45 border border-black" />
                </div>
              </div>

              {/* بيانات الطاقة والتحليل */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="border-l-4 border-red-600 pl-4 bg-red-950/20 py-2">
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-none mb-1">DANGER LEVEL</p>
                  <p className="text-sm font-[1000] text-white italic tracking-tighter uppercase">{gate.difficulty}</p>
                </div>
                <div className="border-r-4 border-blue-600 text-right pr-4 bg-blue-950/20 py-2">
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">MANA WAVE</p>
                  <p className="text-sm font-[1000] text-white italic tracking-tighter uppercase">{gate.energy}</p>
                </div>
              </div>

              {/* الوصف القتالي */}
              <div className="text-center mb-10 border-y border-white/20 py-5 relative">
                <Sparkles className="absolute top-2 left-2 w-3 h-3 text-white/40" />
                <p className="text-[11px] text-slate-200 font-bold leading-relaxed italic uppercase tracking-tight">
                  {gate.desc}
                </p>
                <Sparkles className="absolute bottom-2 right-2 w-3 h-3 text-white/40" />
              </div>

              {/* زر الدخول (Market Purchase Button Style) */}
              <button className={cn(
                "w-full py-5 font-[1000] text-sm tracking-[0.6em] uppercase italic transition-all active:scale-95 group overflow-hidden relative border-t-2 border-white/30",
                gate.color === 'black' ? "bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.3)]" : 
                gate.color === 'purple' ? "bg-purple-700 text-white shadow-[0_0_30px_rgba(147,51,234,0.4)]" : 
                "bg-blue-700 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]"
              )}>
                <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                <div className="flex items-center justify-center gap-4">
                  <Flame className="w-5 h-5 fill-current" />
                  INITIATE RAID
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
            </div>

            {/* أرجل القاعدة التقنية */}
            <div className="flex justify-between px-16 mt-[-2px]">
              <div className="w-2.5 h-7 bg-white shadow-[0_0_15px_white]" />
              <div className="w-2.5 h-7 bg-white shadow-[0_0_15px_white]" />
            </div>
          </div>
        ))}
      </main>

      <BottomNav />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Boss;
