import { useState, useEffect } from 'react';
import { X, Zap, Loader2, ShieldAlert, Info, MapPin, ImageIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InventoryItem } from '@/types/game';

interface ItemAnalysisModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export const ItemAnalysisModal = ({ item, onClose }: ItemAnalysisModalProps) => {
  const [phase, setPhase] = useState<'scanning' | 'complete'>('scanning');
  const [scanProgress, setScanProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!item) return;
    
    // لإضافة تأثير الظهور التدريجي
    setTimeout(() => setIsVisible(true), 50);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('complete');
          return 100;
        }
        return prev + 5;
      });
    }, 50); // تسريع التحليل قليلاً لراحة المستخدم

    return () => clearInterval(interval);
  }, [item]);

  if (!item) return null;

  const getItemPower = () => {
    if (item.type === 'xp') return { power: item.effect, unit: 'XP' };
    if (item.type === 'health') return { power: item.effect, unit: '% HP' };
    if (item.type === 'energy') return { power: item.effect, unit: '% طاقة' };
    return { power: 0, unit: '' };
  };

  const { power, unit } = getItemPower();

  return (
    <div className={cn(
      "fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-[800ms]",
      isVisible ? "bg-black/90" : "bg-black/0 pointer-events-none"
    )}>
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className={cn(
        "relative bg-[#050b18] border-x border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-sm w-full font-mono overflow-y-auto max-h-[90vh] transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
        isVisible ? "opacity-100 scale-y-100 duration-[800ms]" : "opacity-0 scale-y-0 duration-[600ms]"
      )}>
        {/* الخطوط البيضاء المتوهجة في الأعلى والأسفل */}
        <div className={cn("absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1200ms] delay-300", isVisible ? "scale-x-100" : "scale-x-0")} />
        <div className={cn("absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1200ms] delay-300", isVisible ? "scale-x-100" : "scale-x-0")} />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-blue-500/30 pb-2">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            <h2 className="text-blue-400 text-sm font-bold tracking-[0.2em] uppercase italic">
              {phase === 'scanning' ? 'System Scanning...' : 'Analysis Complete'}
            </h2>
            <X className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white transition-colors" onClick={onClose} />
          </div>

          {phase === 'scanning' ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse" />
              </div>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-[10px] text-blue-400 font-bold tracking-widest uppercase">
                  <span>Analyzing Structure</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="h-1 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 shadow-[0_0_10px_#60a5fa] transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 1. Information Card */}
              <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3 shadow-inner animate-in fade-in slide-in-from-bottom-2">
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
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">Integrity:</span> 
                    <span className="text-yellow-400 font-bold tracking-tighter">{power} {unit}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-1">
                    <span className="text-slate-500 uppercase">Quantity:</span> 
                    <span className="text-purple-400 font-bold">x{item.quantity}</span>
                  </div>
                </div>
              </div>

              {/* 2. Visual Reference Card */}
              <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 delay-150">
                <div className="flex items-center gap-2 mb-3 border-l-2 border-green-500 pl-2">
                  <ImageIcon className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] font-bold text-green-100 tracking-widest uppercase italic">Visual Reference</span>
                </div>
                <div className="aspect-square bg-slate-900/80 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <span className="text-7xl filter grayscale brightness-150 opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {item.icon}
                  </span>
                </div>
              </div>

              {/* 3. Description (System Log) */}
              <div className="bg-blue-950/20 border border-blue-500/20 p-3 rounded italic animate-in fade-in slide-in-from-bottom-6 delay-300">
                <div className="flex items-center gap-2 mb-1">
                   <Sparkles className="w-3 h-3 text-blue-400" />
                   <span className="text-[9px] font-bold text-blue-300 uppercase">Item Description</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  "{item.description}"
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 animate-in fade-in slide-in-from-bottom-8 delay-500">
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:brightness-90 active:scale-95 transition-all"
                >
                  Confirm Analysis
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
