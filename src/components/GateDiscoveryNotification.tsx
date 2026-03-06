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

  useEffect(() => {
    if (show && gate) {
      const hasSeenInSession = sessionStorage.getItem('gate_notif_session_seen');
      if (!hasSeenInSession) {
        setIsExiting(false);
        setTimeout(() => setIsVisible(true), 50);
        sessionStorage.setItem('gate_notif_session_seen', 'true');
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

  const alreadySeenInSession = sessionStorage.getItem('gate_notif_session_seen') === 'true' && !isVisible;
  if (!show || !gate || alreadySeenInSession) return null;

  const isLocked = gate.rank === 'S' || gate.rank === 'A';

  return (
    <div className={cn(
      "fixed inset-0 z-[300] flex items-center justify-center p-4 transition-all duration-[800ms]",
      isVisible && !isExiting ? "bg-black/95 backdrop-blur-md" : "bg-black/0 pointer-events-none"
    )}>
      <div className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-1000",
        isVisible && !isExiting ? "opacity-30" : "opacity-0"
      )}>
        <img 
          src="/portal.gif" 
          alt="Gate Portal" 
          className="w-[600px] h-[600px] object-cover mix-blend-screen"
          style={{ filter: `hue-rotate(${gate.rank === 'S' ? '0deg' : '200deg'})` }}
        />
      </div>

      <div className={cn(
        "relative max-w-sm w-full bg-[#050a14]/80 border-x border-white/40 transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
        isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1200ms]" : "opacity-0 scale-y-0 duration-[600ms]"
      )}>
        
        {/* --- خطوط التوهج المقطوعة من المنتصف --- */}
        {/* الخط العلوي مقسم لجزئين */}
        <div className="absolute top-0 left-0 right-0 flex justify-between">
          <div className={cn("h-[2px] bg-white shadow-[0_0_15px_white] w-[35%] transition-transform duration-1000 delay-300 origin-left", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
          <div className={cn("h-[2px] bg-white shadow-[0_0_15px_white] w-[35%] transition-transform duration-1000 delay-300 origin-right", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
        </div>
        
        {/* الخط السفلي مقسم لجزئين */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between">
          <div className={cn("h-[2px] bg-white shadow-[0_0_15px_white] w-[35%] transition-transform duration-1000 delay-300 origin-left", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
          <div className={cn("h-[2px] bg-white shadow-[0_0_15px_white] w-[35%] transition-transform duration-1000 delay-300 origin-right", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
        </div>

        {/* العنوان - تم إنزاله قليلاً ليلتصق بالحافة العلوية بشكل أفضل */}
        <div className="flex justify-center mt-[-1.1rem] relative z-50">
          <div className="border-2 border-slate-200 px-6 py-1 bg-[#050a14] shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-white uppercase italic flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
              Gate <span className="text-blue-400">Detected</span>
            </h2>
          </div>
        </div>

        <div className={cn(
          "p-6 space-y-6 transition-all duration-1000 delay-500",
          isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          
          <div className="flex justify-center">
             <div className="relative w-32 h-32 flex items-center justify-center transition-all duration-500">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.3)] bg-black">
                  <img 
                    src="/portal.gif" 
                    alt="Portal Icon" 
                    className="w-full h-full object-cover scale-125 mix-blend-screen brightness-125"
                    style={{ filter: `hue-rotate(${gate.rank === 'S' ? '0deg' : '200deg'})` }} 
                  />
                </div>
                <div className="absolute -bottom-2 bg-white text-black px-2 py-0.5 text-[9px] font-black italic shadow-lg">
                   RANK {gate.rank}
                </div>
             </div>
          </div>

          <div className="space-y-[2px] border border-white/10 bg-black/60 rounded overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[9px] text-slate-500 uppercase font-black">اسم البوابه</span>
              </div>
              <span className="text-xs font-bold text-white italic">{gate.name}</span>
            </div>

            <div className="flex justify-between items-center p-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[9px] text-slate-500 uppercase font-black">رتبة البوابه</span>
              </div>
              <span className={cn("text-xs font-black", gate.rank === 'S' ? "text-red-500" : "text-white")}>
                Rank {gate.rank}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-[9px] text-slate-500 uppercase font-black">الطاقة المنبعثة</span>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {showManaDetails ? `${gate.energyDensity} MP` : '?????'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[9px] text-slate-500 uppercase font-black">نوع البوابه</span>
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-tighter">
                 {showManaDetails ? ((gate as any).type || 'Standard') : 'Locked'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {hasManaGauge && !showManaDetails && (
              <button
                onClick={handleScanMana}
                disabled={isScanning}
                className={cn(
                  "w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] border-2 transition-all",
                  isScanning 
                    ? "bg-slate-900 border-slate-800 text-slate-700 cursor-wait"
                    : "bg-blue-500/10 border-blue-500/40 text-blue-400 hover:bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                )}
              >
                {isScanning ? "Analyzing..." : "كشف بيانات البوابة"}
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleClose} className="py-3 bg-transparent border border-white/10 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all">
                تجاهل
              </button>
              <button
                onClick={handleEnter}
                disabled={isLocked}
                className={cn(
                  "py-3 text-[10px] font-black uppercase tracking-widest transition-all",
                  isLocked 
                    ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                    : "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
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
