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
    strength: { label: 'القوة', icon: '💪', color: 'text-red-400' },
    mind: { label: 'العقل', icon: '🧠', color: 'text-blue-400' },
    spirit: { label: 'الروح', icon: '✨', color: 'text-purple-400' },
    agility: { label: 'اللياقة', icon: '⚡', color: 'text-green-400' }
  };

  const getItemTypeContent = () => {
    return (
      <div className="space-y-4 font-mono text-right" dir="rtl">
        {/* تصميم البيانات الأساسية بنفس نمط الـ Market */}
        <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative">
          <div className="absolute top-0 left-0 p-1"><ShieldAlert className="w-4 h-4 text-blue-500/50" /></div>
          <div className="mb-3 border-b border-blue-500/30 pb-2">
            <span className="text-[9px] text-blue-400 block mb-1">DATA_STREAM_NAME:</span>
            <span className="text-sm font-bold text-white tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
              {item.name}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] text-blue-400 block mb-1 uppercase text-left">Category:</span>
              <span className="text-xs font-bold text-blue-300 uppercase">{item.type}</span>
            </div>
            <div>
              <span className="text-[9px] text-blue-400 block mb-1 uppercase text-left">Quantity:</span>
              <span className="text-xs font-bold text-white uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">x{item.quantity}</span>
            </div>
          </div>
        </div>

        {/* محتوى النوع - تم دمج شروطك الأصلية بالكامل هنا */}
        <div className="w-full border border-blue-900/40 p-3 bg-blue-950/10 space-y-3">
          <div className="flex items-center gap-2 border-b border-blue-900/20 pb-1">
            <Zap className="w-3 h-3 text-blue-500" />
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Structural Analysis</span>
          </div>
          
          <div className="p-1">
            <p className="text-xs text-slate-400 mb-3">{item.description}</p>
            
            {/* عرض الـ XP في حال كان العنصر من نوع XP */}
            {item.type === 'xp' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-blue-900/20 p-2 border border-blue-500/20">
                  <span className="text-xs text-blue-300">الكمية المختارة:</span>
                  <div className="flex items-center gap-3" dir="ltr">
                    <button onClick={() => handleQuantityChange(-1)} className="p-1 bg-slate-800 border border-slate-600 rounded"><Minus className="w-3 h-3" /></button>
                    <span className="text-white font-bold">{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} className="p-1 bg-slate-800 border border-slate-600 rounded"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {(Object.keys(statLabels) as StatType[]).map(stat => (
                    <div key={stat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <span>{statLabels[stat].icon}</span>
                          <span className={statLabels[stat].color}>{statLabels[stat].label}</span>
                          <span className="text-[10px] text-slate-500">Lv.{gameState.levels[stat]}</span>
                        </div>
                        <div className="flex items-center gap-2" dir="ltr">
                          <button onClick={() => handleStatChange(stat, -1)} className="w-5 h-5 flex items-center justify-center bg-red-900/30 border border-red-500/30 rounded text-red-400"><Minus className="w-3 h-3" /></button>
                          <span className="w-10 text-center font-bold text-white">{statAllocation[stat]}</span>
                          <button onClick={() => handleStatChange(stat, 1)} className="w-5 h-5 flex items-center justify-center bg-green-900/30 border border-green-500/30 rounded text-green-400"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${Math.min((gameState.stats[stat] / 1000) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                {remainingXP > 0 && <p className="text-[10px] text-yellow-500 text-center italic">XP متبقي: {remainingXP}</p>}
              </div>
            )}

            {/* عرض الصحة */}
            {item.type === 'health' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
                  <span>Health Recovery Output:</span>
                  <span className="text-green-500 font-bold tracking-widest">+{Math.floor(gameState.maxHp * item.effect / 100) * quantity} HP</span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 shadow-[0_0_8px_green]" style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }} />
                </div>
              </div>
            )}

            {/* عرض الطاقة */}
            {item.type === 'energy' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
                  <span>Energy Recovery Output:</span>
                  <span className="text-cyan-500 font-bold tracking-widest">+{Math.floor(gameState.maxEnergy * item.effect / 100) * quantity} EP</span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-600 shadow-[0_0_8px_cyan]" style={{ width: `${(gameState.energy / gameState.maxEnergy) * 100}%` }} />
                </div>
              </div>
            )}
            
            {/* اللقب */}
            {item.type === 'title' && (
              <div className="p-2 border border-purple-500/30 bg-purple-900/10 text-center">
                <p className="text-xs text-purple-300">{item.equipped ? "اللقب مُجهز حالياً" : "جاهز للتجهيز"}</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-right bg-blue-950/20 border border-blue-900/50 p-3">
          <p className="text-[10px] text-blue-400 leading-relaxed font-bold uppercase tracking-tighter">
            System: User ID [{gameState.totalLevel}] Authorized. Ready for execution.
          </p>
        </div>
      </div>
    );
  };

  const canUse = item.type === 'health' || item.type === 'energy' || item.type === 'xp';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-md bg-black/90 transition-all duration-500">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-[#050b18] border-x border-white/40 shadow-[0_0_50px_rgba(59,130,246,0.4)] max-w-sm w-full font-mono overflow-hidden animate-scale-in">
        {/* الخطوط البيضاء المضيئة من المتجر */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white]" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white]" />
        
        {/* Header */}
        <div className="p-4 border-b border-blue-500/30 flex items-center justify-between">
          <h2 className="text-blue-400 text-lg font-bold tracking-[0.2em] uppercase italic drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
            Analyzing Item...
          </h2>
          <X className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white transition-colors" onClick={onClose} />
        </div>

        <div className="p-6">
          {getItemTypeContent()}
        </div>

        {/* Action Button - بنفس نمط زر الشراء/التأكيد في المتجر */}
        <div className="p-6 pt-0">
          {canUse ? (
            <button
              onClick={handleUse}
              className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all"
            >
              Confirm & Use ({quantity})
            </button>
          ) : item.type === 'title' && !item.equipped ? (
            <button
              onClick={() => { onEquipTitle?.(item.id); onClose(); }}
              className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Equip Title
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-4 bg-slate-900 text-white font-black text-[11px] tracking-[0.5em] uppercase border border-slate-700"
            >
              Close Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
