import { useState } from 'react';
import { X, Plus, Minus, Check, Zap, Heart, Book, Crown, Target, BarChart3, ShieldAlert } from 'lucide-react';
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
  const [quantity, setQuantity] = useState(1);
  const [statAllocation, setStatAllocation] = useState<Record<StatType, number>>({
    strength: 0,
    mind: 0,
    spirit: 0,
    agility: 0
  });

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
    onClose();
  };

  const statLabels: Record<StatType, { label: string; icon: string; color: string }> = {
    strength: { label: 'STRENGTH', icon: '💪', color: 'text-red-400' },
    mind: { label: 'MIND', icon: '🧠', color: 'text-blue-400' },
    spirit: { label: 'SPIRIT', icon: '✨', color: 'text-purple-400' },
    agility: { label: 'AGILITY', icon: '⚡', color: 'text-green-400' }
  };

  const getItemTypeContent = () => {
    // التصميم الموحد لكل الأنواع بناءً على نمط تحليل المتجر
    return (
      <div className="w-full space-y-4">
        {/* القسم العلوي: معلومات البيانات الأساسية */}
        <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative">
          <div className="absolute top-0 right-0 p-1"><ShieldAlert className="w-4 h-4 text-blue-500/50" /></div>
          <div className="mb-3 border-b border-blue-500/30 pb-2">
            <span className="text-[9px] text-blue-400 block mb-1">DATA_STREAM_NAME:</span>
            <span className="text-sm font-bold text-white tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
              {item.name}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] text-blue-400 block mb-1">CLASSIFICATION:</span>
              <span className="text-xs font-bold text-blue-300 uppercase">{item.category || item.type}</span>
            </div>
            <div>
              <span className="text-[9px] text-blue-400 block mb-1">QUANTITY:</span>
              <span className="text-xs font-bold text-white uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">x{item.quantity}</span>
            </div>
          </div>
        </div>

        {/* قسم التحكم بالكمية (فقط للأنواع القابلة للاستهلاك) */}
        {(item.type === 'xp' || item.type === 'health' || item.type === 'energy') && (
           <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded flex items-center justify-between">
              <span className="text-[9px] text-blue-400 font-bold tracking-widest uppercase italic">Adjustment:</span>
              <div className="flex items-center gap-3">
                <button onClick={() => handleQuantityChange(-1)} className="w-7 h-7 flex items-center justify-center bg-slate-900 border border-blue-500/30 rounded text-blue-400 active:scale-90 transition-all"><Minus className="w-3 h-3" /></button>
                <span className="text-lg font-mono font-bold text-white w-8 text-center">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="w-7 h-7 flex items-center justify-center bg-slate-900 border border-blue-500/30 rounded text-blue-400 active:scale-90 transition-all"><Plus className="w-3 h-3" /></button>
              </div>
           </div>
        )}

        {/* قسم تحليل القوة الهيكلية (التأثيرات) */}
        <div className="w-full border border-blue-900/40 p-3 bg-blue-950/10 space-y-3">
          <div className="flex items-center gap-2 border-b border-blue-900/20 pb-1">
            <Zap className="w-3 h-3 text-blue-500" />
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Structural Power Analysis</span>
          </div>
          
          {item.type === 'xp' ? (
            <div className="space-y-4">
               {(Object.keys(statLabels) as StatType[]).map(stat => (
                 <div key={stat} className="space-y-1">
                   <div className="flex justify-between text-[10px] items-center">
                     <span className={cn("font-bold", statLabels[stat].color)}>{statLabels[stat].label} (Lv.{gameState.levels[stat]})</span>
                     <div className="flex items-center gap-2">
                        <button onClick={() => handleStatChange(stat, -1)} className="text-red-500/50 hover:text-red-500"><Minus className="w-3 h-3" /></button>
                        <span className="text-white font-mono min-w-[30px] text-center">+{statAllocation[stat]}</span>
                        <button onClick={() => handleStatChange(stat, 1)} className="text-green-500/50 hover:text-green-500"><Plus className="w-3 h-3" /></button>
                     </div>
                   </div>
                   <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-600 shadow-[0_0_8px_blue]" style={{ width: `${Math.min((gameState.stats[stat] / 1000) * 100, 100)}%` }} />
                   </div>
                 </div>
               ))}
               <div className="text-center pt-1 border-t border-blue-500/10">
                  <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-tighter">Remaining XP: {remainingXP}</span>
               </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border border-blue-500/20 flex items-center justify-center bg-black/40">
                <span className="text-2xl drop-shadow-[0_0_8px_white]">{item.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-300 italic leading-tight">
                  {item.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* تنبيه الحالة */}
        <div className="text-left bg-blue-950/20 border border-blue-900/50 p-3">
          <p className="text-[10px] text-blue-400 leading-relaxed font-bold uppercase tracking-tighter">
            System Message: Ready to initiate process. Integrity verified at 100%. 
            Target: Player ID [{gameState.totalLevel}]
          </p>
        </div>
      </div>
    );
  };

  const canUse = item.type === 'health' || item.type === 'energy' || item.type === 'xp';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-xl bg-black/90">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-[#050b18] border-x border-white/40 shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-sm w-full font-mono overflow-hidden animate-scale-in origin-center">
        {/* الخطوط العلوية والسفلية من الـ Market */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] scale-x-100" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white] scale-x-100" />

        {/* Header */}
        <div className="p-4 border-b border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h2 className="text-blue-400 text-sm font-bold tracking-[0.2em] uppercase italic drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
              Process Analysis
            </h2>
          </div>
          <X className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" onClick={onClose} />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {getItemTypeContent()}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          {canUse ? (
            <button 
              onClick={handleUse}
              className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:brightness-90 active:scale-95 transition-all"
            >
              Initiate Consumption
            </button>
          ) : item.type === 'title' && !item.equipped ? (
            <button 
              onClick={() => { onEquipTitle?.(item.id); onClose(); }}
              className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:brightness-90 active:scale-95 transition-all"
            >
              Equip Title
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="w-full py-4 bg-blue-900/40 text-blue-400 font-black text-[11px] tracking-[0.5em] uppercase border border-blue-500/30 hover:bg-blue-900/60 transition-all"
            >
              Terminate Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
