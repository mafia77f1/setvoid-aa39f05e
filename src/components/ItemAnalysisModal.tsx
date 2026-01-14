import { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  Info, 
  MapPin, 
  Image as ImageIcon,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InventoryItem } from '@/types/game';

interface ItemAnalysisModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  // أضفت خاصية useItem إذا كنت تريد تفعيل زر الاستخدام من داخل المودال
  onUse?: (itemId: string) => void; 
}

export const ItemAnalysisModal = ({ item, onClose, onUse }: ItemAnalysisModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (item) {
      // أنيميشن الدخول
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [item]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      onClose();
    }, 800);
  };

  if (!item) return null;

  // الحفاظ على المنطق الخاص بك (Logic)
  const getItemPower = () => {
    if (item.type === 'xp') return { power: item.effect, unit: 'XP' };
    if (item.type === 'health') return { power: item.effect, unit: '% HP' };
    if (item.type === 'energy') return { power: item.effect, unit: '% طاقة' };
    return { power: 0, unit: '' };
  };

  const { power, unit } = getItemPower();

  return (
    <div className={cn(
      "fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-[1000ms]",
      isVisible && !isExiting ? "bg-black/95" : "bg-black/0 pointer-events-none"
    )}>
      {/* Overlay لإغلاق المودال عند الضغط خارجاً */}
      <div className="absolute inset-0" onClick={handleClose} />

      <div className={cn(
        "relative bg-[#050b18] border-x border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-sm w-full font-mono overflow-y-auto max-h-[90vh] transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
        isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1000ms]" : "opacity-0 scale-y-0 duration-[800ms]"
      )}>
        
        {/* خطوط الأنيميشن العلوية والسفلية المتوهجة */}
        <div className={cn("absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1500ms] delay-500", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
        
        <div className={cn("p-6 space-y-6 transition-all duration-1000 delay-700", isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
          
          {/* Header - System Analysis Style */}
          <div className="flex justify-between items-center border-b border-blue-500/30 pb-2">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            <h2 className="text-blue-400 text-sm font-bold tracking-[0.2em] uppercase italic">System Analysis</h2>
            <X className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white transition-colors" onClick={handleClose} />
          </div>

          {/* 1. Information Card (Properties) */}
          <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3 shadow-inner">
            <div className="flex items-center gap-2 mb-1 border-l-2 border-blue-500 pl-2">
              <Info className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-bold text-blue-100 tracking-widest uppercase italic">Item Properties</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase">Identity:</span> 
                <span className="text-white font-bold tracking-wider">{item.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase">Classification:</span> 
                <span className="text-blue-400 font-bold uppercase">{item.category || item.type}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-1">
                <span className="text-slate-500 uppercase">Power:</span> 
                <span className="text-yellow-400 font-bold">{power} {unit}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-1">
                <span className="text-slate-500 uppercase">Integrity:</span> 
                <span className="text-white italic text-right ml-4">{item.description}</span>
              </div>
            </div>
          </div>

          {/* 2. Stats/Quantity Card (Acquisition Style) */}
          <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1 border-l-2 border-yellow-500 pl-2">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] font-bold text-yellow-100 tracking-widest uppercase italic">Inventory Status</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-[10px]">
              <div className="bg-white/5 p-2 border border-white/10 rounded flex justify-between items-center italic">
                <span>Current Quantity</span>
                <span className="text-green-400 font-bold tracking-tighter">x{item.quantity}</span>
              </div>
              <div className="bg-white/5 p-2 border border-white/10 rounded flex justify-between items-center italic">
                <span>Effect Type</span>
                <span className="text-blue-400 font-bold tracking-tighter uppercase">{item.type}</span>
              </div>
            </div>
          </div>

          {/* 3. Visual Reference Card */}
          <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3 border-l-2 border-green-500 pl-2">
              <ImageIcon className="w-3 h-3 text-green-500" />
              <span className="text-[10px] font-bold text-green-100 tracking-widest uppercase italic">Visual Reference</span>
            </div>
            <div className="aspect-square bg-slate-900/80 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              {item.id === 'mana_meter' || item.name === 'Mana Gauge' ? (
                <img 
                  src="/ManaDeviceIcon.png" 
                  className="w-[150%] h-[150%] scale-110 object-contain drop-shadow-[0_0_10px_#3b82f6]" 
                />
              ) : (
                <span className="text-7xl filter grayscale brightness-150 opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {item.icon || '📦'}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button 
              onClick={() => {
                if (onUse) onUse(item.id);
                handleClose();
              }}
              className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:brightness-90 active:scale-95 transition-all"
            >
              Initiate Consumption
            </button>
          </div>
        </div>

        <div className={cn("absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1500ms] delay-500", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
      </div>
    </div>
  );
};
