import { useState, useEffect } from 'react';
import { X, Plus, Minus, Zap, ShieldAlert, Info, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InventoryItem, GameState, StatType } from '@/types/game';

interface ItemUseModalProps {
  item: InventoryItem | null;
  gameState: GameState;
  onClose: () => void;
  onUseItem: (itemId: string, quantity: number, statAllocation?: Partial<Record<StatType, number>>) => void;
  onEquipTitle?: (itemId: string) => void;
  onAnalyze?: () => void;
}

export const ItemUseModal = ({ 
  item, 
  gameState, 
  onClose, 
  onUseItem,
  onEquipTitle,
  onAnalyze
}: ItemUseModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [statAllocation, setStatAllocation] = useState<Record<StatType, number>>({
    strength: 0,
    mind: 0,
    spirit: 0,
    agility: 0
  });

  useEffect(() => {
    if (item) {
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

  const maxQuantity = item.quantity;
  const totalXP = item.type === 'xp' ? item.effect * quantity : 0;
  const allocatedXP = Object.values(statAllocation).reduce((sum, val) => sum + val, 0);
  const remainingXP = totalXP - allocatedXP;

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, Math.min(maxQuantity, quantity + delta));
    setQuantity(newQty);
    setStatAllocation({ strength: 0, mind: 0, spirit: 0, agility: 0 });
  };

  const handleStatChange = (stat: StatType, delta: number) => {
    const currentVal = statAllocation[stat];
    const step = 50; 
    const newVal = Math.max(0, currentVal + (delta * step));
    const otherStats = Object.entries(statAllocation)
      .filter(([key]) => key !== stat)
      .reduce((sum, [_, val]) => sum + val, 0);
    
    if (newVal + otherStats <= totalXP) {
      setStatAllocation(prev => ({ ...prev, [stat]: newVal }));
    }
  };

  const handleUse = () => {
    if (item.type === 'xp') {
      if (allocatedXP < totalXP) {
        const remaining = totalXP - allocatedXP;
        const perStat = Math.floor(remaining / 4);
        const finalAllocation = {
          strength: statAllocation.strength + perStat,
          mind: statAllocation.mind + perStat,
          spirit: statAllocation.spirit + perStat,
          agility: statAllocation.agility + perStat + (remaining % 4)
        };
        onUseItem(item.id, quantity, finalAllocation);
      } else {
        onUseItem(item.id, quantity, statAllocation);
      }
    } else {
      onUseItem(item.id, quantity);
    }
    handleClose();
  };

  const statLabels: Record<StatType, { label: string; color: string }> = {
    strength: { label: 'STRENGTH', color: 'text-blue-400' },
    mind: { label: 'MIND', color: 'text-blue-400' },
    spirit: { label: 'SPIRIT', color: 'text-blue-400' },
    agility: { label: 'AGILITY', color: 'text-blue-400' }
  };

  const canUse = item.type === 'health' || item.type === 'energy' || item.type === 'xp';

  return (
    <div className={cn(
      "fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-[1000ms]",
      isVisible && !isExiting ? "bg-black/95" : "bg-black/0 pointer-events-none"
    )}>
      <div className="absolute inset-0" onClick={handleClose} />
      
      <div className={cn(
        "relative bg-[#050b18] border-x border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-sm w-full font-mono overflow-y-auto max-h-[90vh] transition-all ease-[cubic-bezier(0.2,1,0.2,1)] origin-center",
        isVisible && !isExiting ? "opacity-100 scale-y-100 duration-[1000ms]" : "opacity-0 scale-y-0 duration-[800ms]"
      )}>
        {/* الخطوط المتوهجة العلوية والسفلية */}
        <div className={cn("absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1500ms] delay-500", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
        
        <div className={cn("p-6 space-y-6 transition-all duration-1000 delay-700", isVisible && !isExiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-blue-500/30 pb-2">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            <h2 className="text-blue-400 text-sm font-bold tracking-[0.2em] uppercase italic">Item Manipulation</h2>
            <X className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" onClick={handleClose} />
          </div>

          {/* 1. Information Card */}
          <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3 shadow-inner">
            <div className="flex items-center gap-2 mb-1 border-l-2 border-blue-500 pl-2">
              <Info className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-bold text-blue-100 tracking-widest uppercase italic">Properties Analysis</span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between"><span className="text-slate-500 uppercase">Identity:</span> <span className="text-white font-bold tracking-wider">{item.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 uppercase">Classification:</span> <span className="text-blue-400 font-bold uppercase">{item.category || item.type}</span></div>
              <div className="flex justify-between border-t border-white/5 pt-1"><span className="text-slate-500 uppercase">Integrity:</span> <span className="text-white italic">{item.description}</span></div>
            </div>
          </div>

          {/* 2. Visual Reference Card */}
          <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3 border-l-2 border-green-500 pl-2">
              <ImageIcon className="w-3 h-3 text-green-500" />
              <span className="text-[10px] font-bold text-green-100 tracking-widest uppercase italic">Visual Reference</span>
            </div>
            <div className="aspect-square bg-slate-900/80 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <span className="text-7xl filter grayscale brightness-150 opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">{item.icon || '📦'}</span>
            </div>
          </div>

          {/* 3. Action / Allocation Card */}
          <div className="bg-black/40 border border-slate-700/50 p-4 space-y-4">
            <div className="flex items-center gap-2 mb-1 border-l-2 border-yellow-500 pl-2">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] font-bold text-yellow-100 tracking-widest uppercase italic">Usage Configuration</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-white/5 p-2 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase">Adjust Quantity</span>
              <div className="flex items-center gap-4">
                <button onClick={() => handleQuantityChange(-1)} className="text-blue-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                <span className="text-white font-bold text-sm">x{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="text-blue-400 hover:text-white"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            {/* XP Allocation Logic Style */}
            {item.type === 'xp' && (
              <div className="space-y-3 pt-2">
                {(Object.keys(statLabels) as StatType[]).map(stat => (
                  <div key={stat} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={statLabels[stat].color}>{statLabels[stat].label}</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleStatChange(stat, -1)} className="text-red-500/50 hover:text-red-500"><Minus className="w-3 h-3" /></button>
                        <span className="text-white font-bold min-w-[20px] text-center">{statAllocation[stat]}</span>
                        <button onClick={() => handleStatChange(stat, 1)} className="text-green-500/50 hover:text-green-500"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${Math.min((gameState.stats[stat] / 1000) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
                <div className="text-center bg-blue-500/10 border border-blue-500/20 py-1">
                  <span className="text-[9px] text-blue-400 font-bold tracking-tighter">REMAINING XP: {remainingXP}</span>
                </div>
              </div>
            )}

            {/* Health/Energy Preview Style */}
            {(item.type === 'health' || item.type === 'energy') && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[9px] text-slate-400 uppercase italic">
                  <span>Output Potential:</span>
                  <span className="text-blue-400">+{item.effect * quantity}% {item.type === 'health' ? 'HP' : 'MP'}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                    className={cn("h-full transition-all duration-1000", item.type === 'health' ? "bg-red-500" : "bg-blue-500")} 
                    style={{ width: `${item.type === 'health' ? (gameState.hp/gameState.maxHp)*100 : (gameState.energy/gameState.maxEnergy)*100}%` }} 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {canUse ? (
              <button 
                onClick={handleUse}
                className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:brightness-90 active:scale-95 transition-all"
              >
                Execute Consumption
              </button>
            ) : item.type === 'title' ? (
              <button
                onClick={() => { onEquipTitle?.(item.id); handleClose(); }}
                disabled={item.equipped}
                className={cn(
                  "w-full py-4 font-black text-[11px] tracking-[0.5em] uppercase transition-all",
                  item.equipped 
                    ? "bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800"
                    : "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                )}
              >
                {item.equipped ? 'Synchronized' : 'Equip Title'}
              </button>
            ) : (
              <button 
                onClick={handleClose}
                className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Terminate Entry
              </button>
            )}
          </div>
        </div>

        <div className={cn("absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] transition-all duration-[1500ms] delay-500", isVisible && !isExiting ? "scale-x-100" : "scale-x-0")} />
      </div>
    </div>
  );
};
