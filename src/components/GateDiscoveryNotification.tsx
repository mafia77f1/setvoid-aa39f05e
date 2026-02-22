import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gate } from '@/types/game';
import { cn } from '@/lib/utils';
import { X, Target, Zap, AlertTriangle, Skull, Activity, Scan, Shield, Fingerprint, Info } from 'lucide-react';

interface GateDiscoveryNotificationProps {
  show: boolean;
  gate: Gate | null;
  hasManaGauge: boolean;
  playerPower: number;
  onClose: () => void;
  onEnter: () => void;
}

export const GateDiscoveryNotification = ({
  show,
  gate,
  hasManaGauge,
  playerPower,
  onClose,
  onEnter,
}: GateDiscoveryNotificationProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showManaDetails, setShowManaDetails] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [alreadySeen, setAlreadySeen] = useState(false);

  // حل مشكلة التكرار: تظهر فقط للبوابات الجديدة
  useEffect(() => {
    if (show && gate) {
      const seenGates = JSON.parse(localStorage.getItem('seen_gates_ids') || '[]');
      if (seenGates.includes(gate.id)) {
        setAlreadySeen(true);
      } else {
        setAlreadySeen(false);
        setIsExiting(false);
        setTimeout(() => setIsVisible(true), 50);
        // حفظ البوابة كـ "تمت رؤيتها"
        localStorage.setItem('seen_gates_ids', JSON.stringify([...seenGates, gate.id]));
      }
    }
  }, [show, gate]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      onClose();
    }, 800);
  };

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      onEnter();
      navigate('/gates');
    }, 500);
  };

  const handleScanMana = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowManaDetails(true);
    }, 2000);
  };

  if (!show || !gate || alreadySeen) return null;

  const getGateColor = (rank: string) => {
    switch (rank) {
      case 'S': return 'from-red-600 to-red-900';
      case 'A': return 'from-purple-600 to-purple-900';
      case 'B': return 'from-blue-600 to-blue-900';
      case 'C': return 'from-cyan-600 to-cyan-900';
      case 'D': return 'from-green-600 to-green-900';
      case 'E': return 'from-gray-600 to-gray-900';
      default: return 'from-blue-600 to-blue-900';
    }
  };

  const getRankGlow = (rank: string) => {
    switch (rank) {
      case 'S': return 'shadow-[0_0_60px_rgba(239,68,68,0.4)] border-red-500/50';
      case 'A': return 'shadow-[0_0_60px_rgba(168,85,247,0.4)] border-purple-500/50';
      case 'B': return 'shadow-[0_0_50px_rgba(59,130,246,0.3)] border-blue-500/50';
      default: return 'shadow-[0_0_40px_rgba(255,255,255,0.1)] border-white/20';
    }
  };

  const canEnter = playerPower >= gate.requiredPower * 0.5;
  const isLocked = gate.rank === 'S' || gate.rank === 'A';

  return (
    <div className={cn(
      "fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-[800ms]",
      isVisible && !isExiting ? "bg-black/90 backdrop-blur-xl" : "bg-black/0 pointer-events-none"
    )}>
      <div className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-1000",
        isVisible && !isExiting ? "opacity-40" : "opacity-0"
      )}>
        <img 
          src="/portal.gif" 
          alt="Gate Portal" 
          className="w-[800px] h-[800px] object-cover mix-blend-screen animate-pulse"
          style={{ filter: `hue-rotate(${gate.rank === 'S' ? '0deg' : gate.rank === 'A' ? '270deg' : '200deg'}) brightness(1.5)` }}
        />
      </div>

      <div className={cn(
        "relative max-w-sm w-full bg-gradient-to-b from-[#0a0f1a] to-[#050a14] border-t border-b transition-all ease-[cubic-bezier(0.23,1,0.32,1)]",
        isVisible && !isExiting ? "opacity-100 scale-100 translate-y-0 duration-[1000ms]" : "opacity-0 scale-95 translate-y-10 duration-[600ms]",
        getRankGlow(gate.rank)
      )}>
        {/* الزينة العلوية */}
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_#fff]" />
        
        <div className="p-1 px-6 pt-8 pb-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.4em] text-white/70 uppercase">Emergency Alert</span>
            </div>
            
            <div className={cn(
              "w-28 h-28 mx-auto rounded-full bg-gradient-to-br flex items-center justify-center relative group",
              getGateColor(gate.rank)
            )}>
              <div className="absolute inset-0 rounded-full animate-ping bg-inherit opacity-20" />
              <span className="text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] z-10">
                {gate.rank}
              </span>
            </div>
          </div>

          {/* معلومات البوابة المدمجة */}
          <div className="space-y-[2px] rounded-lg overflow-hidden border border-white/5 bg-white/[0.02]">
            
            {/* اسم البوابة */}
            <div className="flex justify-between items-center p-4 bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] text-slate-400 uppercase font-black">اسم البوابه</span>
              </div>
              <span className="text-sm font-bold text-white italic">{gate.name}</span>
            </div>

            {/* رتبة البوابة */}
            <div className="flex justify-between items-center p-4 bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] text-slate-400 uppercase font-black">رتبة البوابه</span>
              </div>
              <span className={cn("text-sm font-black", gate.rank === 'S' ? "text-red-500" : "text-white")}>
                Rank {gate.rank}
              </span>
            </div>

            {/* الطاقة المنبعثة */}
            <div className="flex justify-between items-center p-4 bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-[10px] text-slate-400 uppercase font-black">الطاقة المنبعثة</span>
              </div>
              <span className="text-sm font-bold text-cyan-400">
                {showManaDetails ? `${gate.energyDensity} MP` : '---'}
              </span>
            </div>

            {/* نوع البوابة */}
            <div className="flex justify-between items-center p-4 bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] text-slate-400 uppercase font-black">نوع البوابه</span>
              </div>
              <span className="text-sm font-bold text-white uppercase tracking-tighter">
                 {showManaDetails ? (gate.type || 'Standard') : 'Locked'}
              </span>
            </div>
          </div>

          {/* المكافآت - بتصميم أرقى */}
          <div className="flex gap-2">
            <div className="flex-1 p-2 rounded bg-blue-500/5 border border-blue-500/20 text-center">
               <div className="text-[8px] text-blue-400 font-bold uppercase">Exp Gain</div>
               <div className="text-sm font-black text-white">+{gate.rewards.xp}</div>
            </div>
            <div className="flex-1 p-2 rounded bg-yellow-500/5 border border-yellow-500/20 text-center">
               <div className="text-[8px] text-yellow-400 font-bold uppercase">Gold Reward</div>
               <div className="text-sm font-black text-white">+{gate.rewards.gold}</div>
            </div>
          </div>

          {/* الأزرار */}
          <div className="space-y-3 pt-2">
            {hasManaGauge && !showManaDetails && (
              <button
                onClick={handleScanMana}
                disabled={isScanning}
                className={cn(
                  "w-full py-4 rounded-sm border-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group",
                  isScanning 
                    ? "bg-slate-900 border-slate-800 text-slate-500 cursor-wait"
                    : "bg-transparent border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black"
                )}
              >
                {isScanning ? (
                  <span className="flex items-center justify-center gap-2">
                    <Scan className="w-4 h-4 animate-spin" />
                    Analyzing Flux...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Scan className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    كشف بيانات البوابة
                  </span>
                )}
              </button>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleClose}
                className="py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
              >
                تجاهل
              </button>
              <button
                onClick={handleEnter}
                disabled={isLocked}
                className={cn(
                  "py-3 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all",
                  isLocked 
                    ? "bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed"
                    : "bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95"
                )}
              >
                {isLocked ? 'Locked' : 'دخول'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
