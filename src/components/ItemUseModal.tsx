import { useState } from 'react';
import { X, Plus, Minus, Check, Zap, Heart, Book, Crown, Target, BarChart3, ShieldAlert, RotateCcw, Equal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InventoryItem, GameState, StatType } from '@/types/game';

interface ItemUseModalProps {
  item: InventoryItem | null;
  gameState: GameState;
  onClose: () => void;
  onUseItem: (itemId: string, quantity: number, statAllocation?: Partial<Record<StatType, number>>) => void;
  onEquipTitle?: (itemId: string) => void;
  onAnalyze?: () => void;
  onResetXP?: () => void;
}

export const ItemUseModal = ({ 
  item, 
  gameState, 
  onClose, 
  onUseItem,
  onEquipTitle,
  onAnalyze,
  onResetXP
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

  const handleManualQuantity = (val: string) => {
    const num = parseInt(val) || 0;
    const clamped = Math.max(0, Math.min(maxQuantity, num));
    setQuantity(clamped);
    setStatAllocation({ strength: 0, mind: 0, spirit: 0, agility: 0 });
  };

  const handleEqualDistribute = () => {
    const share = Math.floor(totalXP / 4);
    setStatAllocation({
      strength: share,
      mind: share,
      spirit: share,
      agility: share
    });
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

  const handleMaxStat = (stat: StatType) => {
    const otherStats = Object.entries(statAllocation)
      .filter(([key]) => key !== stat)
      .reduce((sum, [_, val]) => sum + val, 0);
    const possibleXP = totalXP - otherStats;
    if (possibleXP > 0) {
      setStatAllocation(prev => ({ ...prev, [stat]: possibleXP }));
    }
  };

  const handleUse = () => {
    if (item.type === 'xp') {
      onUseItem(item.id, quantity, statAllocation);
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
      <div className="space-y-4 py-2">
        {/* Item Header Info */}
        <div className="w-full border border-blue-500/30 p-4 bg-blue-950/20 relative font-mono">
          <div className="absolute top-0 right-0 p-1"><ShieldAlert className="w-4 h-4 text-blue-500/50" /></div>
          <div className="mb-3 border-b border-blue-500/30 pb-2">
            <span className="text-[9px] text-blue-400 block mb-1">DATA_STREAM_NAME:</span>
            <span className="text-sm font-bold text-white tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] uppercase">
              {item.name}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] text-blue-400 block mb-1 uppercase">Category:</span>
              <span className="text-xs font-bold text-blue-300 uppercase italic">{item.type}</span>
            </div>
            <div>
              <span className="text-[9px] text-blue-400 block mb-1 uppercase">Available:</span>
              <span className="text-xs font-bold text-white uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">x{item.quantity}</span>
            </div>
          </div>
        </div>

        {/* Interaction Area */}
        <div className="w-full border border-blue-900/40 p-4 bg-[#050b18] space-y-4 font-mono">
          <div className="flex items-center gap-2 border-b border-blue-900/20 pb-2">
            <Zap className="w-3 h-3 text-blue-500" />
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Structural Analysis</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 border border-blue-500/20 flex items-center justify-center bg-black/40 flex-shrink-0">
              <span className="text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{item.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-300 italic leading-relaxed text-right">
                {item.description}
              </p>
            </div>
          </div>

          {/* XP Item Logic */}
          {item.type === 'xp' && (
            <div className="space-y-4 pt-2 border-t border-blue-900/20">
              <div className="flex items-center justify-between bg-blue-950/30 p-2 border border-blue-500/20">
                <span className="text-[9px] text-blue-300 font-bold">SET QUANTITY</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleQuantityChange(-1)} className="text-blue-400 hover:text-white transition-colors"><Minus className="w-4 h-4" /></button>
                    <input 
                      type="number"
                      value={quantity}
                      onChange={(e) => handleManualQuantity(e.target.value)}
                      className="w-12 bg-transparent text-white font-bold text-center border-b border-blue-500/50 outline-none focus:border-white transition-colors"
                    />
                    <button onClick={() => handleQuantityChange(1)} className="text-blue-400 hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button 
                    onClick={handleEqualDistribute}
                    title="توزيع بالتساوي"
                    className="ml-1 p-1 border border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-400 hover:text-white transition-all"
                  >
                    <Equal className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => { setQuantity(maxQuantity); setStatAllocation({ strength: 0, mind: 0, spirit: 0, agility: 0 }); }} 
                    className="px-2 py-0.5 border border-blue-500/50 bg-blue-500/10 text-blue-400 text-[8px] font-bold hover:bg-blue-500/20 transition-all"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {(Object.keys(statLabels) as StatType[]).map(stat => (
                  <div key={stat} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleMaxStat(stat)}
                          className="px-1.5 py-0.5 border border-blue-500/30 bg-blue-500/5 text-[7px] text-blue-400 font-bold hover:bg-blue-500/20 transition-all mr-1"
                        >
                          MAX
                        </button>
                        <span className={statLabels[stat].color}>{statLabels[stat].label}</span>
                        <span className="text-slate-500 text-[8px]">LV.{gameState.levels[stat]}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleStatChange(stat, -1)} className="text-red-500/50 hover:text-red-500"><Minus className="w-3 h-3" /></button>
                        <span className="text-white font-bold min-w-[20px] text-center">{statAllocation[stat]}</span>
                        <button onClick={() => handleStatChange(stat, 1)} className="text-green-500/50 hover:text-green-500"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" style={{ width: `${Math.min((gameState.stats[stat] / 1000) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center bg-yellow-950/20 p-1 border border-yellow-500/20">
                <span className="text-[9px] text-yellow-500">REMAINING XP: {remainingXP}</span>
              </div>
            </div>
          )}

          {/* Health/Energy Item Logic */}
          {(item.type === 'health' || item.type === 'energy') && (
            <div className="space-y-4 pt-2 border-t border-blue-900/20">
               <div className="flex items-center justify-between bg-blue-950/30 p-2 border border-blue-500/20">
                <span className="text-[9px] text-blue-300 font-bold uppercase">Adjust Dosage</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleQuantityChange(-1)} className="text-blue-400"><Minus className="w-4 h-4" /></button>
                    <input 
                      type="number"
                      value={quantity}
                      onChange={(e) => handleManualQuantity(e.target.value)}
                      className="w-12 bg-transparent text-white font-bold text-center border-b border-blue-500/50 outline-none focus:border-white transition-colors"
                    />
                    <button onClick={() => handleQuantityChange(1)} className="text-blue-400"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button 
                    onClick={() => setQuantity(maxQuantity)} 
                    className="ml-2 px-2 py-0.5 border border-blue-500/50 bg-blue-500/10 text-blue-400 text-[8px] font-bold hover:bg-blue-500/20 transition-all"
                  >
                    MAX
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[8px] text-slate-400 uppercase">
                  <span>Output potential:</span>
                  <span className={item.type === 'health' ? "text-green-500" : "text-cyan-400"}>
                    +{item.effect * quantity}% {item.type === 'health' ? 'HP' : 'MP'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-1000 shadow-[0_0_8px]", item.type === 'health' ? "bg-red-600 shadow-red-500" : "bg-blue-600 shadow-blue-500")} 
                    style={{ width: `${item.type === 'health' ? (gameState.hp/gameState.maxHp)*100 : (gameState.energy/gameState.maxEnergy)*100}%` }} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-left bg-blue-950/10 border border-blue-900/30 p-3 font-mono">
          <p className="text-[9px] text-blue-500 leading-relaxed uppercase tracking-tighter">
            System Message: Ready to execute command for player. Integrity check passed. Access level: Authorized.
          </p>
        </div>
      </div>
    );
  };

  const getResetContent = () => {
    if (item?.type !== 'reset') return null;
    const totalXP = gameState.stats.strength + gameState.stats.mind + gameState.stats.spirit + gameState.stats.agility;
    return (
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-br from-cyan-950/50 to-slate-900/50 border border-cyan-500/30 rounded">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 bg-cyan-900/50 border border-cyan-500/50 rounded flex items-center justify-center">
              <RotateCcw className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h4 className="font-bold text-cyan-300 text-lg">{item.name}</h4>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-slate-900/50 rounded flex justify-between">
              <span className="text-slate-400">مجموع XP:</span>
              <span className="text-cyan-400 font-bold">{totalXP.toLocaleString()}</span>
            </div>
            <div className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
              <p className="text-xs text-yellow-400 text-center">
                ⚠️ سيتم إعادة تعيين جميع إحصائياتك ويمكنك توزيعها من جديد
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const canUse = item.type === 'health' || item.type === 'energy' || item.type === 'xp';
  const isResetItem = item.type === 'reset';
  const isSpecialStone = ['rename_stone', 'gate_exit_stone', 'grand_quest_stone', 'central_activation_stone'].includes(item.id);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-md bg-black/90">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-[#050b18] border-x border-white/40 shadow-[0_0_50px_rgba(59,130,246,0.4)] max-w-sm w-full font-mono overflow-hidden animate-scale-y origin-center">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)]" />
        <div className="p-4 flex items-center justify-between border-b border-blue-500/30 bg-blue-950/20">
          <h2 className="text-blue-400 text-sm font-bold tracking-[0.2em] uppercase italic drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
            Analyzing Item Data
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-blue-400" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Stone image for special stones */}
          {isSpecialStone && (
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 border border-cyan-500/30 bg-black/40 flex items-center justify-center rounded-lg overflow-hidden">
                <img src="/ManaStoneElement.png" alt="Mana Stone" className="w-16 h-16 object-contain" />
              </div>
            </div>
          )}
          {isResetItem ? getResetContent() : getItemTypeContent()}
        </div>
        <div className="p-6 pt-0 space-y-3">
          {canUse ? (
            <button
              onClick={handleUse}
              className="w-full py-4 bg-white text-black font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              Confirm & Use
            </button>
          ) : isResetItem ? (
            <button
              onClick={() => { onResetXP?.(); onClose(); }}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              إعادة التوزيع
            </button>
          ) : item.type === 'title' ? (
            <button
              onClick={() => { onEquipTitle?.(item.id); onClose(); }}
              disabled={item.equipped}
              className={cn(
                "w-full py-4 font-black text-[11px] tracking-[0.5em] uppercase transition-all",
                item.equipped 
                  ? "bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800"
                  : "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
              )}
            >
              {item.equipped ? 'Title Equipped' : 'Equip Title'}
            </button>
          ) : isSpecialStone ? (
            <button
              onClick={() => { onUseItem(item.id, 1); onClose(); }}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-[11px] tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              USE
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-4 bg-blue-900/20 border border-blue-500/40 text-blue-300 font-black text-[11px] tracking-[0.5em] uppercase"
            >
              Close Entry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
