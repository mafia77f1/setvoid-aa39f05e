import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { Skull, Zap, MapPin, Shield, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Boss = () => {
  const { gameState } = useGameState();
  const boss = gameState.currentBoss;

  // محاكاة لبوابات إضافية لجعل القائمة تبدو غنية
  const gates = [
    { id: 'current', rank: 'S', name: boss?.name || 'Unknown Boss', type: 'Red Gate', status: 'Active' },
    { id: '2', rank: 'A', name: 'Shadow Labyrinth', type: 'Instant Dungeon', status: 'Locked' },
    { id: '3', rank: 'B', name: 'Frozen Tundra', type: 'Normal Gate', status: 'Locked' },
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 pb-24 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* Magic Background Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(76,29,149,0.15),transparent_80%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      </div>

      {/* Header: System Notification Style */}
      <header className="relative z-10 pt-6 mb-10">
        <div className="flex items-center justify-between border-b border-purple-500/30 pb-4">
          <div>
            <h1 className="text-xs font-black tracking-[0.3em] text-purple-500 uppercase italic">Current Location</h1>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <p className="text-xl font-bold tracking-tight text-white uppercase">Detected Gates</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status</p>
            <p className="text-[10px] font-black text-green-500 uppercase animate-pulse">Monitoring...</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto space-y-6">
        
        {/* The Gates List */}
        <div className="space-y-6">
          {gates.map((gate) => (
            <div 
              key={gate.id}
              className={cn(
                "relative group transition-all duration-500",
                gate.status === 'Locked' ? "opacity-50 grayscale" : "opacity-100"
              )}
            >
              {/* Gate Rank Badge (Side) */}
              <div className={cn(
                "absolute -left-2 top-4 z-20 px-3 py-1 font-black text-lg skew-x-[-15deg] border-2 shadow-[4px_4px_0px_rgba(0,0,0,1)]",
                gate.rank === 'S' ? "bg-purple-600 border-purple-300 text-white" : "bg-blue-700 border-blue-400 text-white"
              )}>
                RANK {gate.rank}
              </div>

              {/* Main Gate Card */}
              <div className="bg-[#0f121d] border-r-4 border-purple-600 rounded-sm overflow-hidden relative">
                <div className="flex">
                  
                  {/* Gate Visual (The Portal Hole) */}
                  <div className="w-32 h-32 relative flex-shrink-0 bg-black overflow-hidden border-r border-white/10">
                    {/* Spiral Animation to mimic Gate entrance */}
                    <div className={cn(
                        "absolute inset-0 opacity-60 animate-[spin_10s_linear_infinite]",
                        gate.rank === 'S' ? "bg-[conic-gradient(from_0deg,transparent,purple,transparent)]" : "bg-[conic-gradient(from_0deg,transparent,blue,transparent)]"
                    )} />
                    <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center border border-white/5">
                        <Skull className={cn(
                          "w-10 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]",
                          gate.rank === 'S' ? "text-purple-400" : "text-blue-400"
                        )} />
                    </div>
                  </div>

                  {/* Gate Info */}
                  <div className="p-4 flex flex-col justify-center flex-grow bg-[linear-gradient(90deg,rgba(15,18,29,1)_0%,rgba(26,31,46,0.8)_100%)]">
                    <p className="text-[10px] font-bold text-purple-400 tracking-widest uppercase mb-1">{gate.type}</p>
                    <h3 className="text-lg font-black text-white leading-none mb-2 tracking-tight uppercase group-hover:text-purple-400 transition-colors">
                      {gate.name}
                    </h3>
                    
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            <span className="text-[10px] font-bold text-slate-400 tracking-tighter">HIGH MANA</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] font-bold text-slate-400 tracking-tighter">BOSS PRESENT</span>
                        </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center px-2">
                    <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-purple-500 transition-colors" />
                  </div>
                </div>

                {/* Decorative scanning line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
              </div>

              {/* Locked Overlay */}
              {gate.status === 'Locked' && (
                <div className="absolute inset-0 flex items-center justify-center z-30">
                  <div className="bg-black/80 px-4 py-1 border border-white/20">
                    <p className="text-[10px] font-black tracking-[0.2em] text-white">REMAINING TIME: 24:00:00</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* System Message Section */}
        <div className="mt-10 bg-purple-950/20 border-l-2 border-purple-500 p-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 animate-ping" />
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">System Warning</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-bold uppercase italic">
              Caution: Once you enter a <span className="text-white underline">Gate</span>, you cannot leave until the Boss is defeated or the dungeon is cleared.
            </p>
        </div>

      </main>

      <BottomNav />
    </div>
  );
};

export default Boss;
