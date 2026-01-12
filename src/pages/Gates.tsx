import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { BottomNav } from '@/components/BottomNav';
import { AlertTriangle, Zap, Target, Clock, X, Skull, Activity, Scan, Shield, Map as MapIcon, LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Gate } from '@/types/game';

const Gates = () => {
  const { gameState } = useGameState();
  const navigate = useNavigate();
  
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [showManaDetails, setShowManaDetails] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // حالات الأنيمايشن
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const totalLevel = gameState.totalLevel || 1;
  const playerPower = totalLevel;

  const gates = gameState.gates || [];

  const hasManaGauge = gameState.inventory?.some(item => item.id === 'mana_meter' && item.quantity > 0);

  const handleGateClick = (gate: Gate) => {
    setSelectedGate(gate);
    setShowManaDetails(false);
    setIsScanning(false);
    setIsExiting(false);
    setTimeout(() => setIsVisible(true), 50);
  };

  const handleCloseModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setSelectedGate(null);
      setIsExiting(false);
      setShowManaDetails(false);
    }, 800);
  };

  const handleScanMana = () => {
    setIsScanning(true);
    // تمديد الوقت إلى 8 ثوانٍ كما طلبت
    setTimeout(() => {
      setIsScanning(false);
      setShowManaDetails(true);
    }, 8000); 
  };

  const handleEnterGate = () => {
    setIsEntering(true);
    setTimeout(() => {
      navigate('/battle');
    }, 3000); 
  };

  const getGateColor = (rank: string) => {
    switch (rank) {
      case 'S': return 'from-red-500 to-red-700';
      case 'A': return 'from-purple-500 to-purple-700';
      case 'B': return 'from-blue-500 to-blue-700';
      case 'C': return 'from-cyan-500 to-cyan-700';
      case 'D': return 'from-green-500 to-green-700';
      case 'E': return 'from-gray-500 to-gray-700';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  const getGateBorderColor = (rank: string) => {
    switch (rank) {
      case 'S': return 'border-red-500/50';
      case 'A': return 'border-purple-500/50';
      case 'B': return 'border-blue-500/50';
      case 'C': return 'border-cyan-500/50';
      case 'D': return 'border-green-500/50';
      case 'E': return 'border-gray-500/50';
      default: return 'border-blue-500/50';
    }
  };

  const getGateGlow = (rank: string) => {
    switch (rank) {
      case 'S': return '0 0 80px rgba(239, 68, 68, 0.7)';
      case 'A': return '0 0 80px rgba(168, 85, 247, 0.6)';
      case 'B': return '0 0 60px rgba(59, 130, 246, 0.5)';
      case 'C': return '0 0 50px rgba(6, 182, 212, 0.4)';
      case 'D': return '0 0 50px rgba(34, 197, 94, 0.4)';
      case 'E': return '0 0 40px rgba(156, 163, 175, 0.3)';
      default: return '0 0 50px rgba(59, 130, 246, 0.5)';
    }
  };

  const isGateLocked = (gate: Gate) => gate.rank === 'S' || gate.rank === 'A';
  const canSeeGateDetails = (gate: Gate) => playerPower >= gate.requiredPower * 0.5;

  if (isEntering) {
    return (
      <div className="fixed inset-0 z-[150] bg-black flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src="/portal.gif" 
            alt="Portal Transition" 
            className="w-full h-full object-cover mix-blend-screen scale-150 animate-[spin_20s_linear_infinite]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-purple-500/30 pb-40 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(76,29,149,0.15),transparent_80%)]" />
      </div>

      <header className="relative z-20 pt-16 pb-12 px-6 text-center border-b border-white/5">
        <h1 className="relative text-3xl font-black italic tracking-[0.3em] uppercase">
          <span className="text-white drop-shadow-[0_0_100px_rgba(255,255,255,0.5)]">Dungeon</span>
          <span className="block text-xs text-blue-400 mt-2 tracking-[0.5em] font-bold uppercase opacity-70">Gate Recognition System</span>
        </h1>
        <div className="mt-4 text-sm text-slate-400">
          البوابات المتاحة اليوم: <span className="text-white font-bold">{gates.length}</span>
        </div>
      </header>

      {gates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <Target className="w-16 h-16 text-slate-600 mb-4" />
          <h2 className="text-xl font-bold text-slate-400 mb-2">لا توجد بوابات</h2>
          <p className="text-sm text-slate-500">لم يتم اكتشاف أي بوابات اليوم. عد غداً!</p>
        </div>
      ) : (
        <main className="relative z-10 px-6 space-y-40 mt-16">
          {gates.map((gate) => {
            const isHidden = !canSeeGateDetails(gate);
            const locked = isGateLocked(gate);
            
            return (
              <div key={gate.id} className="relative group flex flex-col items-center max-w-sm mx-auto">
                <div 
                  onClick={() => handleGateClick(gate)}
                  className="relative w-72 h-72 flex items-center justify-center transition-all duration-500 cursor-pointer hover:scale-110 active:scale-90 z-20"
                  style={{ filter: `drop-shadow(${getGateGlow(gate.rank)})` }}
                >
                  <div className={cn(
                    "relative w-full h-full rounded-full overflow-hidden border-2 transition-colors",
                    getGateBorderColor(gate.rank)
                  )}>
                    <img src="/portal.gif" alt="Portal" className="w-full h-full object-cover scale-110 mix-blend-screen brightness-125" />
                  </div>
                </div>

                <div className="relative w-full bg-black/60 border-2 border-slate-200/90 p-5 mt-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="border border-slate-400/50 px-6 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      <h2 className="text-[10px] font-black tracking-[0.3em] text-white uppercase">
                        RANK: <span className={gate.rank === 'S' ? "text-red-500" : gate.rank === 'A' ? "text-purple-400" : "text-blue-400"}>
                          {isHidden ? "?" : gate.rank}
                        </span>
                        {locked && <span className="text-slate-500 ml-2">[Alpha]</span>}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Energy Density</p>
                      </div>
                      <p className="text-base font-mono font-bold text-white italic">
                        {isHidden ? "???,???" : gate.energyDensity} <span className="text-[9px] opacity-40">MP</span>
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={cn("w-3.5 h-3.5", gate.rank === 'S' ? "text-red-500" : gate.rank === 'A' ? "text-purple-400" : "text-blue-400")} />
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Danger Level</p>
                      </div>
                      <p className={cn("text-xs font-black uppercase italic tracking-widest", gate.rank === 'S' ? "text-red-500" : gate.rank === 'A' ? "text-purple-400" : "text-blue-400")}>
                        {isHidden ? "???" : gate.danger}
                      </p>
                    </div>

                    <div className="mt-2 py-2 px-3 bg-white/5 border-l-2 border-white/20">
                      <p className="text-[9px] text-slate-500 font-bold italic leading-relaxed uppercase tracking-tighter">
                        {isHidden ? "? ? ?" : "Dimensional crack confirmed. Tap the portal to initiate sequence."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </main>
      )}

      {/* Gate Detail Modal */}
      {selectedGate && (
        <div className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-[1000ms]",
          isVisible && !isExiting ? "bg-black/60" : "bg-black/0 pointer-events-none"
        )}>
          <div className={cn(
            "relative max-w-md w-full bg-[#0c0c0e] border-x border-white/40 shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
            isVisible && !isExiting 
              ? "opacity-100 scale-y-100 duration-[1500ms]" 
              : "opacity-0 scale-y-0 duration-[800ms]"
          )} style={{ boxShadow: getGateGlow(selectedGate.rank) }}>
            
            <div className={cn(
              "absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-[1500ms] delay-500",
              isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            )} />
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-[1500ms] delay-500",
              isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            )} />

            <div className={cn(
              "p-6 transition-all duration-1000 delay-700",
              isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <button onClick={handleCloseModal} className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"><X className="w-4 h-4" /></button>
              
              {isScanning ? (
                /* تم تحديث قسم الأنيمايشن والخلفية الضبابية */
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl animate-in fade-in duration-500">
                  <div className="relative">
                    <img src="/AnimationManaAnalysis.gif" alt="Scanning..." className="w-64 h-64 object-contain mb-4 relative z-10" />
                    <div className="absolute inset-0 bg-blue-500/20 blur-[60px] animate-pulse rounded-full" />
                  </div>
                  <p className="text-blue-400 font-black tracking-[0.4em] text-sm animate-pulse">DECODING MANA FREQUENCY...</p>
                  <div className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-[loading_8s_linear]" />
                  </div>
                </div>
              ) : (
                <div className={cn("transition-all duration-700", showManaDetails ? "animate-in fade-in zoom-in-95" : "")}>
                  <div className="text-center mb-6">
                    <div className={cn("w-20 h-20 mx-auto rounded-xl flex items-center justify-center text-4xl font-black mb-3 text-white bg-gradient-to-br", getGateColor(selectedGate.rank))}>
                      {!canSeeGateDetails(selectedGate) ? "?" : selectedGate.rank}
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase drop-shadow-[0_0_100px_rgba(255,255,255,0.8)]">{!canSeeGateDetails(selectedGate) ? "??" : selectedGate.name}</h2>
                    <p className="text-sm text-slate-400 uppercase tracking-widest mt-1">{!canSeeGateDetails(selectedGate) ? "???,???" : selectedGate.danger}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {showManaDetails ? (
                      <div className="p-4 rounded-lg bg-black/40 border border-white/20">
                         <div className="grid grid-cols-2 gap-4 mb-4 border-b border-white/10 pb-4">
                            <div className="space-y-1">
                               <p className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Identifier</p>
                               <p className="text-[11px] text-white font-bold truncate">{selectedGate.name}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Class Rank</p>
                               <p className={cn("text-[11px] font-black italic", (selectedGate.rank === 'S' || selectedGate.rank === 'A') ? "text-red-500" : "text-blue-400")}>{selectedGate.rank}-Grade</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Mana Signature</p>
                               <p className="text-[11px] text-white font-mono font-bold tracking-widest">{selectedGate.energyDensity.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Threat Status</p>
                               <p className="text-[11px] flex items-center gap-1 font-bold">
                                  {selectedGate.danger} 
                                  {(selectedGate.rank === 'S' || selectedGate.rank === 'A') ? <span className="text-red-500">⛔🚫</span> : <span className="text-slate-400">⚠️</span>}
                                </p>
                            </div>
                         </div>
                         
                         {/* تم تحديث الخريطة لتشبه المتاهة Labyrinth Mapping */}
                         <div className="mt-2">
                            <div className="flex justify-between items-center mb-2">
                               <div className="flex items-center gap-2">
                                  <LocateFixed className="w-3 h-3 text-blue-400 animate-pulse" />
                                  <span className="text-[8px] text-white font-black uppercase tracking-[0.2em]">Labyrinth Structural Mapping</span>
                               </div>
                               <span className="text-[7px] text-blue-400/60 font-mono">NODE-042</span>
                            </div>
                            <div className="h-32 w-full bg-[#050505] rounded-sm border border-blue-500/30 relative overflow-hidden group">
                               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#4f4f4f 1px, transparent 1px), linear-gradient(90deg, #4f4f4f 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                               
                               {/* مسارات معقدة تشبه المتاهة */}
                               <svg className="absolute inset-0 w-full h-full opacity-60">
                                  <path d="M 10 120 V 100 H 40 V 80 H 20 V 50 H 60 V 70 H 90 V 40 H 120 V 90 H 150 V 60 H 180 V 100 H 210 V 20 H 250" 
                                        stroke="rgba(59, 130, 246, 0.7)" strokeWidth="1.5" fill="none" strokeDasharray="1000">
                                     <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="8s" repeatCount="indefinite" />
                                  </path>
                                  {/* مسارات فرعية */}
                                  <path d="M 60 50 V 20 H 100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" fill="none" />
                                  <path d="M 150 90 V 110 H 190" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" fill="none" />
                                  
                                  <circle cx="250" cy="20" r="4" fill="#ef4444" className="animate-pulse" />
                                  <circle cx="10" cy="120" r="3" fill="#ffffff" />
                               </svg>

                               <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />
                               <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-400/20 shadow-[0_0_10px_blue] animate-[scan_2s_linear_infinite]" />
                               
                               <div className="absolute bottom-2 right-2 text-[6px] text-white/30 font-mono uppercase text-right leading-none">
                                  Complex Pathing Detected<br/>
                                  Integrity: Stable
                               </div>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                        <span className="flex items-center gap-2 text-sm text-slate-300">كثافة الطاقة</span>
                        <span className="font-bold">{!hasManaGauge ? selectedGate.energyDensity : '???'} MP</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-6">
                    <h3 className="text-sm font-bold mb-2 text-purple-400 text-center uppercase tracking-widest">المكافآت المتوقعة</h3>
                    <div className="flex justify-around text-sm font-bold text-slate-200">
                      <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" /> +{selectedGate.rewards.xp} XP</span>
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-blue-400" /> +{selectedGate.rewards.gold} Gold</span>
                    </div>
                  </div>
                </div>
              )}

              {hasManaGauge && !showManaDetails && !isScanning && (
                <button
                  onClick={handleScanMana}
                  className="w-full py-3 mb-4 bg-blue-500/10 border border-blue-500/40 text-blue-400 hover:bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Scan className="w-4 h-4" />
                    إطلاق موجات السونار السحرية
                  </span>
                </button>
              )}
              
              {!isScanning && (
                <button
                  onClick={handleEnterGate}
                  disabled={isGateLocked(selectedGate)}
                  className={cn(
                    "w-full py-4 rounded-xl font-black text-lg transition-all text-white uppercase tracking-wider",
                    isGateLocked(selectedGate) 
                      ? "bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r shadow-[0_10px_30px_rgba(0,0,0,0.5)] " + getGateColor(selectedGate.rank)
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isGateLocked(selectedGate) ? (
                      <><Skull className="w-5 h-5" /> LOCKED (RANK TOO HIGH)</>
                    ) : (
                      <><Activity className="w-5 h-5" /> ENTER DUNGEON</>
                    )}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes loading {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}} />
    </div>
  );
};

export default Gates;
