import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gate } from '@/types/game';
import { cn } from '@/lib/utils';
import { X, Target, Zap, AlertTriangle, Skull, Activity, Scan, Shield } from 'lucide-react';

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

  useEffect(() => {
    if (show) {
      setIsExiting(false);
      setTimeout(() => setIsVisible(true), 50);
    }
  }, [show]);

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

  if (!show || !gate) return null;

  const getGateColor = (rank: string) => {
    switch (rank) {
      case 'S': return 'from-red-600 to-red-800';
      case 'A': return 'from-purple-600 to-purple-800';
      case 'B': return 'from-blue-600 to-blue-800';
      case 'C': return 'from-cyan-600 to-cyan-800';
      case 'D': return 'from-green-600 to-green-800';
      case 'E': return 'from-gray-600 to-gray-800';
      default: return 'from-blue-600 to-blue-800';
    }
  };

  const getRankGlow = (rank: string) => {
    switch (rank) {
      case 'S': return 'shadow-[0_0_50px_rgba(239,68,68,0.5)]';
      case 'A': return 'shadow-[0_0_50px_rgba(168,85,247,0.5)]';
      case 'B': return 'shadow-[0_0_50px_rgba(59,130,246,0.5)]';
      case 'C': return 'shadow-[0_0_40px_rgba(6,182,212,0.4)]';
      case 'D': return 'shadow-[0_0_40px_rgba(34,197,94,0.4)]';
      default: return 'shadow-[0_0_30px_rgba(156,163,175,0.3)]';
    }
  };

  const canEnter = playerPower >= gate.requiredPower * 0.5;
  const isLocked = gate.rank === 'S' || gate.rank === 'A';

  return (
    <div className={cn(
      "fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-[800ms]",
      isVisible && !isExiting ? "bg-black/95 backdrop-blur-md" : "bg-black/0 pointer-events-none"
    )}>
      {/* البوابة المتحركة في الخلفية */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-1000",
        isVisible && !isExiting ? "opacity-30" : "opacity-0"
      )}>
        <img 
          src="/portal.gif" 
          alt="Gate Portal" 
          className="w-[600px] h-[600px] object-cover mix-blend-screen"
          style={{ filter: `hue-rotate(${gate.rank === 'S' ? '0deg' : gate.rank === 'A' ? '270deg' : '200deg'})` }}
        />
      </div>

      {/* البطاقة الرئيسية */}
      <div className={cn(
        "relative max-w-sm w-full bg-[#050a14] border-x border-white/30 transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
        isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1200ms]" : "opacity-0 scale-y-0 duration-[600ms]",
        getRankGlow(gate.rank)
      )}>
        {/* خطوط التوهج */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,1)] transition-all duration-[1200ms] delay-300",
          isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        )} />
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,1)] transition-all duration-[1200ms] delay-300",
          isVisible && !isExiting ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        )} />

        {/* زخرفة الزوايا */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/50" />

        <div className={cn(
          "p-6 space-y-5 transition-all duration-1000 delay-500",
          isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-500/20 border border-red-500/50 rounded-sm mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] text-red-400 uppercase">Gate Detected</span>
            </div>
            
            <div className={cn(
              "w-24 h-24 mx-auto rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 border-2 border-white/30",
              getGateColor(gate.rank),
              getRankGlow(gate.rank)
            )}>
              <span className="text-4xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                {gate.rank}
              </span>
            </div>
            
            <h2 className="text-xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {gate.name}
            </h2>
          </div>

          {/* معلومات البوابة */}
          <div className="space-y-3">
            {/* كمية الطاقة المنبعثة */}
            <div className="flex justify-between items-center p-3 bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] text-slate-400 uppercase font-bold">Energy Density</span>
              </div>
              <span className="text-sm font-bold text-white">
                {showManaDetails ? gate.energyDensity + ' MP' : 
                 !hasManaGauge ? '??? MP' : 
                 'قم بالمسح للكشف'}
              </span>
            </div>

            {/* مستوى الخطر */}
            <div className="flex justify-between items-center p-3 bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-red-400" />
                <span className="text-[10px] text-slate-400 uppercase font-bold">Danger Level</span>
              </div>
              <span className={cn(
                "text-xs font-bold uppercase",
                gate.rank === 'S' || gate.rank === 'A' ? "text-red-400" : "text-blue-400"
              )}>
                {showManaDetails ? gate.danger : 
                 !hasManaGauge ? '???' : 
                 'مجهول'}
              </span>
            </div>

            {/* رتبة البوابة - تظهر فقط إذا كان المسح قد تم */}
            {showManaDetails && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] text-purple-300 uppercase font-bold">Gate Analysis</span>
                </div>
                <div className="space-y-2">
                  {/* إظهار الرتبة فقط إذا كانت منخفضة أو متوسطة */}
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Rank:</span>
                    <span className={cn(
                      "text-sm font-bold",
                      gate.rank === 'S' || gate.rank === 'A' ? "text-red-500" : "text-white"
                    )}>
                      {gate.rank === 'S' || gate.rank === 'A' ? 
                        '⚠️ لا يمكن قياسها - طاقة هائلة!' : 
                        gate.rank}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Required Power:</span>
                    <span className={cn(
                      "text-sm font-bold",
                      canEnter ? "text-green-400" : "text-red-400"
                    )}>
                      {gate.rank === 'S' || gate.rank === 'A' ? '???' : gate.requiredPower}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-400">Status:</span>
                    <span className={cn(
                      "text-xs font-bold",
                      canEnter ? "text-green-400" : "text-red-400"
                    )}>
                      {canEnter ? '✓ مستوى كافٍ' : '✗ مستوى غير كافٍ'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* المكافآت */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30">
            <span className="text-[10px] text-yellow-400 uppercase font-bold">Rewards</span>
            <div className="flex justify-around mt-2 text-sm">
              <span className="text-white font-bold">+{gate.rewards.xp} XP</span>
              <span className="text-yellow-400 font-bold">+{gate.rewards.gold} Gold</span>
            </div>
          </div>

          {/* الأزرار */}
          <div className="space-y-3">
            {hasManaGauge && !showManaDetails && (
              <button
                onClick={handleScanMana}
                disabled={isScanning}
                className={cn(
                  "w-full py-3 border text-[10px] font-bold uppercase tracking-widest transition-all",
                  isScanning 
                    ? "bg-blue-500/20 border-blue-500/30 text-blue-300 cursor-wait"
                    : "bg-blue-500/10 border-blue-500/40 text-blue-400 hover:bg-blue-500/20"
                )}
              >
                {isScanning ? (
                  <span className="flex items-center justify-center gap-2">
                    <Scan className="w-4 h-4 animate-pulse" />
                    جاري المسح...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Scan className="w-4 h-4" />
                    قياس طاقة البوابة
                  </span>
                )}
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleClose}
                className="py-3 border border-slate-700 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-white hover:border-white/30 transition-all"
              >
                إغلاق
              </button>
              <button
                onClick={handleEnter}
                disabled={isLocked}
                className={cn(
                  "py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                  isLocked 
                    ? "bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-white to-slate-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                )}
              >
                <Activity className="w-4 h-4" />
                {isLocked ? 'مقفول' : 'دخول'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
