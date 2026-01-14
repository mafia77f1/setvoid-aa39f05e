import { useState } from 'react';
import { X, Plus, Minus, Check, Zap, Heart, Book, Crown, Target, BarChart3, ShieldAlert, Info, MapPin, Image as ImageIcon } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-xl bg-black/90 transition-all duration-500">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative bg-[#050b18] border-x border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-sm w-full font-mono overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-300">
        {/* الخط المضيء العلوي */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white]" />
        
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-blue-500/30 pb-2">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            <h2 className="text-blue-400 text-sm font-bold tracking-[0.2em] uppercase italic">System Analysis</h2>
            <X className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" onClick={onClose} />
          </div>

          {/* 1. Information Card - نفس كود الـ Stats القديم */}
          <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3 shadow-inner">
            <div className="flex items-center gap-2 mb-1 border-l-2 border-blue-500 pl-2 text-right" dir="rtl">
              <Info className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-bold text-blue-100 tracking-widest uppercase italic">خصائص العنصر</span>
            </div>
            <div className="space-y-2 text-[11px]" dir="rtl">
              <div className="flex justify-between"><span className="text-slate-500 uppercase">الهوية:</span> <span className="text-white font-bold tracking-wider">{item.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500 uppercase">التصنيف:</span> <span className="text-blue-400 font-bold uppercase">{item.type}</span></div>
              <div className="flex justify-between border-t border-white/5 pt-1"><span className="text-slate-500 uppercase">الوصف:</span> <span className="text-white italic">{item.description}</span></div>
            </div>
          </div>

          {/* 2. Acquisition Card - نفس كود الـ Stats القديم */}
          <div className="bg-black/40 border border-slate-700/50 p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1 border-l-2 border-yellow-500 pl-2 text-right" dir="rtl">
              <MapPin className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] font-bold text-yellow-100 tracking-widest uppercase italic">طريقة الاستحواذ</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-[10px]" dir="rtl">
              <div className="bg-white/5 p-2 border border-white/10 rounded flex justify-between items-center italic">
                <span>شراء من المتجر</span>
                <span className="text-green-400 font-bold tracking-tighter">متاح</span>
              </div>
              <div className="bg-white/5 p-2 border border-white/10 rounded flex justify-between items-center italic opacity-60">
                <span>سقوط من البوابات</span>
                <span className="text-blue-400 font-bold tracking-tighter">فرصة</span>
              </div>
            </div>
          </div>

          {/* 3. Visual Reference Card + قسم التفاعل (XP/Quantity) */}
          <div className="bg-black/40 border border-slate-700/50 p-4 space-y-4">
            <div className="flex items-center gap-2 border-l-2 border-green-500 pl-2 text-right" dir="rtl">
              <ImageIcon className="w-3 h-3 text-green-500" />
              <span className="text-[10px] font-bold text-green-100 tracking-widest uppercase italic">المرجع البصري والتحكم</span>
            </div>
            
            <div className="aspect-square bg-slate-900/80 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] relative">
               <span className="text-7xl filter grayscale brightness-150 opacity-90">{item.icon || '📦'}</span>
               <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 border border-white/20 text-[10px] text-white">
                 QTY: x{item.quantity}
               </div>
            </div>

            {/* التحكم في الكمية والإحصائيات (المنطق الأصلي) */}
            {(item.type === 'xp' || item.type === 'health' || item.type === 'energy') && (
              <div className="space-y-4 pt-2 border-t border-white/5" dir="rtl">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">تعديل الكمية:</span>
                  <div className="flex items-center gap-3" dir="ltr">
                    <button onClick={() => handleQuantityChange(-1)} className="p-1 border border-slate-700 text-slate-400"><Minus className="w-3 h-3" /></button>
                    <span className="text-white font-bold">{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} className="p-1 border border-slate-700 text-slate-400"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>

                {item.type === 'xp' && (
                  <div className="space-y-3 pt-2">
                    <div className="text-[10px] text-blue-400 text-center uppercase tracking-tighter">XP التراكمي: {totalXP}</div>
                    {(Object.keys(statLabels) as StatType[]).map(stat => (
                      <div key={stat} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className={statLabels[stat].color}>{statLabels[stat].label}</span>
                          <div className="flex items-center gap-2" dir="ltr">
                            <button onClick={() => handleStatChange(stat, -1)} className="text-red-500/50"><Minus className="w-2 h-2" /></button>
                            <span className="text-white min-w-[20px] text-center">{statAllocation[stat]}</span>
                            <button onClick={() => handleStatChange(stat, 1)} className="text-green-500/50"><Plus className="w-2 h-2" /></button>
                          </div>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min((gameState.stats[stat] / 1000) * 100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-2">
            {item.type === 'title' && !item.equipped ? (
              <button 
                onClick={() => { onEquipTitle?.(item.id); onClose(); }}
                className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:brightness-90 active:scale-95 transition-all"
              >
                EQUIP TITLE
              </button>
            ) : (
              <button 
                onClick={handleUse}
                className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:brightness-90 active:scale-95 transition-all"
              >
                Initiate Consumption
              </button>
            )}
          </div>
        </div>
        
        {/* الخط المضيء السفلي */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_white]" />
      </div>
    </div>
  );
};
