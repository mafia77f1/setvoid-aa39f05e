import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gate } from '@/types/game';
import { cn } from '@/lib/utils';
import { X, Target, Zap, AlertTriangle, Skull, Activity, Scan, Info, Fingerprint } from 'lucide-react';

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

  // --- حل مشكلة الظهور المتكرر ---
  useEffect(() => {
    if (show && gate) {
      const seenGates = JSON.parse(localStorage.getItem('discovered_gates_log') || '[]');
      if (seenGates.includes(gate.id)) {
        setAlreadySeen(true);
      } else {
        setAlreadySeen(false);
        setIsExiting(false);
        setTimeout(() => setIsVisible(true), 50);
        // حفظ البوابة فور ظهورها لضمان عدم تكرارها
        localStorage.setItem('discovered_gates_log', JSON.stringify([...seenGates, gate.id]));
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

  const isLocked = gate.rank === 'S' || gate.rank === 'A';

  return (
    <div className={cn(
      "fixed inset-0 z-[300] flex items-center justify-center p-4 transition-all duration-1000",
      isVisible && !isExiting ? "bg-black/90 backdrop-blur-md" : "bg-black/0 pointer-events-none"
    )}>
      {/* Background Portal Effect */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-1000",
        isVisible && !isExiting ? "opacity-30" : "opacity-0"
      )}>
        <img 
          src="/portal.gif" 
          alt="Gate Portal" 
          className="w-[800px] h-[800px] object-cover mix-blend-screen"
          style={{ filter: `hue-rotate(${gate.rank === 'S' ? '0deg' : '200deg'})` }}
        />
      </div>

      {/* Main Card - Matching Market Style */}
      <div className={cn(
        "relative max-w-sm w-full bg-black/80 border-2 border-slate-200/90 shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all ease-[cubic-bezier(0.23,1,0.32,1)]",
        isVisible && !isExiting ? "opacity-100 scale-100 translate-y-0 duration-[1000ms]" : "opacity-0 scale-95 translate-y-20 duration-[700ms]"
      )}>
        
        {/* Floating Header Label - Exactly like Market Item */}
        <div className="flex justify-center mt-[-1rem]">
          <div className="border border-slate-400/50 px-6 py-1 bg-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-white uppercase italic flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
              Emergency: <span className="text-blue-400">Gate Detected</span>
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Rank Hexagon - Visual Focus */}
          <div className="flex justify-center py-2">
             <div className={cn(
               "w-20 h-20 rounded-xl rotate-45 border-2 border-white/20 flex items-center justify-center bg-gradient-to-br",
               gate.rank === 'S' ? "from-red-600 to-red-900" : "from-blue-600 to-blue-900"
             )}>
                <span className="text-4xl font-black text-white -rotate-45 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {gate.rank}
                </span>
             </div>
          </div>

          {/* Gate Information - List Style from Market */}
          <div className="space-y-[2px] border border-white/5 rounded overflow-hidden">
            
            <div className="flex justify-between items-center p-3 bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">اسم البوابه</span>
              </div>
              <span className="text-xs font-bold text-white italic">{gate.name}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">رتبة البوابه</span>
              </div>
              <span className={cn("text-xs font-black", gate.rank === 'S' ? "text-red-500" : "text-blue-400")}>
                Rank {gate.rank}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">الطاقة المنبعثة</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 leading-none">
                {showManaDetails ? `${gate.energyDensity} MP` : 'Locked'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white/[0.03]">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">نوع البوابه</span>
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-tighter">
                 {showManaDetails ? (gate.type || 'Standard') : 'Analysis Required'}
              </span>
            </div>
          </div>

          {/* Description Block */}
          <div className="text-center px-2">
            <p className="text-[10px] text-slate-400 italic leading-relaxed">
              System analysis: High mana concentration detected in the area. 
              Unauthorized entry is punishable by the Hunter Law.
            </p>
          </div>

          {/* Action Buttons - Market Style */}
          <div className="space-y-3">
            {hasManaGauge && !showManaDetails && (
              <button
                onClick={handleScanMana}
                disabled={isScanning}
                className={cn(
                  "w-full py-3 text-[10px] font-black uppercase tracking-[0.3em] border-2 transition-all",
                  isScanning 
                    ? "bg-blue-900/20 border-blue-800 text-blue-500 cursor-wait"
                    : "bg-blue-600/10 border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-white"
                )}
              >
                {isScanning ? "جاري المسح..." : "كشف بيانات البوابة"}
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 py-3 bg-slate-900 border border-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest"
              >
                تجاهل
              </button>
              <button
                onClick={handleEnter}
                disabled={isLocked}
                className={cn(
                  "flex-[2] py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                  isLocked 
                    ? "bg-red-900/10 border border-red-900/30 text-red-900/50 cursor-not-allowed"
                    : "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
                )}
              >
                {isLocked ? 'Locked' : 'دخول البوابة'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
