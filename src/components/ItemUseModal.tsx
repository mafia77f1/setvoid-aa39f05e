import { useState } from 'react';
import { X, Plus, Minus, Check, Zap, Heart, Book, Crown, Target, BarChart3 } from 'lucide-react';
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
    // إعادة تعيين التوزيع عند تغيير الكمية
    setStatAllocation({ strength: 0, mind: 0, spirit: 0, agility: 0 });
  };

  const handleStatChange = (stat: StatType, delta: number) => {
    const currentVal = statAllocation[stat];
    const step = 50; // كل ضغطة تضيف/تنقص 50 XP
    const newVal = Math.max(0, currentVal + (delta * step));
    
    // التأكد من عدم تجاوز الحد الأقصى
    const otherStats = Object.entries(statAllocation)
      .filter(([key]) => key !== stat)
      .reduce((sum, [_, val]) => sum + val, 0);
    
    if (newVal + otherStats <= totalXP) {
      setStatAllocation(prev => ({ ...prev, [stat]: newVal }));
    }
  };

  const handleUse = () => {
    if (item.type === 'xp') {
      // التأكد من توزيع كل XP
      if (allocatedXP < totalXP) {
        // توزيع المتبقي بالتساوي
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
    // نوع XP - كتاب الخبرة
    if (item.type === 'xp') {
      return (
        <div className="space-y-4">
          {/* معلومات العنصر */}
          <div className="p-3 bg-slate-900/50 border border-slate-700 rounded">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h4 className="font-bold text-white">{item.name}</h4>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            </div>
          </div>

          {/* اختيار الكمية */}
          <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-300">الكمية:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-600 rounded hover:bg-slate-700 disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold text-white w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-600 rounded hover:bg-slate-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-blue-400 mt-2 text-center">
              مجموع XP: <span className="font-bold text-white">{totalXP}</span>
            </p>
          </div>

          {/* الإحصائيات الحالية */}
          <div className="p-3 bg-slate-900/50 border border-slate-700 rounded">
            <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Book className="w-4 h-4" />
              توزيع الخبرة على الإحصائيات
            </h4>
            
            <div className="space-y-3">
              {(Object.keys(statLabels) as StatType[]).map(stat => {
                const currentXP = gameState.stats[stat];
                const addedXP = statAllocation[stat];
                const level = gameState.levels[stat];
                
                return (
                  <div key={stat} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{statLabels[stat].icon}</span>
                        <span className={cn("text-sm font-medium", statLabels[stat].color)}>
                          {statLabels[stat].label}
                        </span>
                        <span className="text-xs text-slate-500">Lv.{level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatChange(stat, -1)}
                          disabled={addedXP <= 0}
                          className="w-6 h-6 flex items-center justify-center bg-red-900/50 border border-red-500/50 rounded text-red-400 hover:bg-red-900 disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-16 text-center text-sm">
                          {addedXP > 0 && (
                            <span className="text-green-400 font-bold">+{addedXP}</span>
                          )}
                          {addedXP === 0 && (
                            <span className="text-slate-500">0</span>
                          )}
                        </span>
                        <button
                          onClick={() => handleStatChange(stat, 1)}
                          disabled={remainingXP < 50}
                          className="w-6 h-6 flex items-center justify-center bg-green-900/50 border border-green-500/50 rounded text-green-400 hover:bg-green-900 disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    {/* شريط التقدم */}
                    <div className="relative h-2 bg-slate-800 rounded overflow-hidden">
                      <div 
                        className="absolute h-full bg-slate-600 transition-all"
                        style={{ width: `${Math.min((currentXP / 1000) * 100, 100)}%` }}
                      />
                      {addedXP > 0 && (
                        <div 
                          className="absolute h-full bg-green-500 transition-all animate-pulse"
                          style={{ 
                            left: `${Math.min((currentXP / 1000) * 100, 100)}%`,
                            width: `${Math.min((addedXP / 1000) * 100, 100 - (currentXP / 1000) * 100)}%` 
                          }}
                        />
                      )}
                    </div>
                    
                    {addedXP > 0 && (
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-green-400 text-xs">⬆️ +{addedXP} XP</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* XP المتبقي */}
            {remainingXP > 0 && (
              <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-500/30 rounded text-center">
                <span className="text-xs text-yellow-400">
                  XP متبقي: <span className="font-bold">{remainingXP}</span>
                  <br />
                  <span className="text-[10px] text-yellow-500">(سيتم توزيعه بالتساوي إذا لم تحدد)</span>
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // نوع الصحة
    if (item.type === 'health') {
      const healAmount = Math.floor(gameState.maxHp * item.effect / 100) * quantity;
      const newHp = Math.min(gameState.maxHp, gameState.hp + healAmount);
      
      return (
        <div className="space-y-4">
          <div className="p-3 bg-slate-900/50 border border-slate-700 rounded">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h4 className="font-bold text-white">{item.name}</h4>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            </div>
          </div>

          {/* اختيار الكمية */}
          <div className="p-3 bg-red-950/30 border border-red-500/30 rounded">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-red-300">الكمية:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-600 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold text-white">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-600 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* شريط الصحة */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">الصحة الحالية:</span>
                <span className="text-white">{gameState.hp} / {gameState.maxHp}</span>
              </div>
              <div className="relative h-4 bg-slate-800 rounded overflow-hidden">
                <div 
                  className="absolute h-full bg-red-600 transition-all"
                  style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }}
                />
                <div 
                  className="absolute h-full bg-green-500 animate-pulse transition-all"
                  style={{ 
                    left: `${(gameState.hp / gameState.maxHp) * 100}%`,
                    width: `${((newHp - gameState.hp) / gameState.maxHp) * 100}%` 
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-400">⬆️ +{healAmount} HP</span>
                <span className="text-white">→ {newHp} HP</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // نوع الطاقة
    if (item.type === 'energy') {
      const energyAmount = Math.floor(gameState.maxEnergy * item.effect / 100) * quantity;
      const newEnergy = Math.min(gameState.maxEnergy, gameState.energy + energyAmount);
      
      return (
        <div className="space-y-4">
          <div className="p-3 bg-slate-900/50 border border-slate-700 rounded">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h4 className="font-bold text-white">{item.name}</h4>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-blue-300">الكمية:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-600 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-bold text-white">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQuantity}
                  className="w-8 h-8 flex items-center justify-center bg-slate-800 border border-slate-600 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">الطاقة الحالية:</span>
                <span className="text-white">{gameState.energy} / {gameState.maxEnergy}</span>
              </div>
              <div className="relative h-4 bg-slate-800 rounded overflow-hidden">
                <div 
                  className="absolute h-full bg-blue-600 transition-all"
                  style={{ width: `${(gameState.energy / gameState.maxEnergy) * 100}%` }}
                />
                <div 
                  className="absolute h-full bg-cyan-400 animate-pulse transition-all"
                  style={{ 
                    left: `${(gameState.energy / gameState.maxEnergy) * 100}%`,
                    width: `${((newEnergy - gameState.energy) / gameState.maxEnergy) * 100}%` 
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400">⬆️ +{energyAmount} طاقة</span>
                <span className="text-white">→ {newEnergy}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // نوع اللقب
    if (item.type === 'title') {
      const isEquipped = item.equipped;
      
      return (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-purple-950/50 to-slate-900/50 border border-purple-500/30 rounded">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 bg-purple-900/50 border border-purple-500/50 rounded flex items-center justify-center">
                <Crown className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h4 className="font-bold text-purple-300 text-lg">{item.name}</h4>
                <p className="text-xs text-slate-400">{item.description}</p>
                {item.effect > 0 && (
                  <span className="text-xs text-green-400">تأثير: +{item.effect}%</span>
                )}
              </div>
            </div>

            {isEquipped ? (
              <div className="p-2 bg-green-900/30 border border-green-500/30 rounded text-center">
                <span className="text-green-400 text-sm font-bold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  اللقب مُجهز حالياً
                </span>
              </div>
            ) : (
              <button
                onClick={() => {
                  onEquipTitle?.(item.id);
                  onClose();
                }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded transition-all"
              >
                تجهيز اللقب
              </button>
            )}
          </div>
        </div>
      );
    }

    // نوع الأداة (مقياس المانا)
    if (item.type === 'tool') {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-cyan-950/50 to-slate-900/50 border border-cyan-500/30 rounded">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 bg-cyan-900/50 border border-cyan-500/50 rounded flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-cyan-300 text-lg">{item.name}</h4>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-bold text-slate-300">أماكن الاستخدام:</h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="p-2 bg-slate-800/50 border border-slate-700 rounded flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-slate-300">البوابات - قياس طاقة البوابة ورتبتها</span>
                </div>
                <div className="p-2 bg-slate-800/50 border border-slate-700 rounded flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-slate-300">العناصر - تحليل قوة العنصر</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // نوع المفتاح
    if (item.type === 'key') {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-yellow-950/50 to-slate-900/50 border border-yellow-500/30 rounded">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{item.icon}</span>
              <div>
                <h4 className="font-bold text-yellow-300 text-lg">{item.name}</h4>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            </div>

            <div className="p-2 bg-yellow-900/20 border border-yellow-500/20 rounded">
              <p className="text-xs text-yellow-400 text-center">
                يُستخدم تلقائياً عند الحاجة داخل البوابات
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const canUse = item.type === 'health' || item.type === 'energy' || item.type === 'xp';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative max-w-md w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-700 rounded-lg overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-700 p-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-bold text-white">استخدام العنصر</h3>
          <div className="flex items-center gap-2">
            {onAnalyze && (item.type === 'xp' || item.type === 'health' || item.type === 'energy') && (
              <button
                onClick={onAnalyze}
                className="p-2 bg-cyan-600/20 border border-cyan-500/50 rounded hover:bg-cyan-600/30 transition-colors"
                title="تحليل العنصر"
              >
                <BarChart3 className="w-4 h-4 text-cyan-400" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {getItemTypeContent()}
        </div>

        {/* Footer - Use Button */}
        {canUse && (
          <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur border-t border-slate-700 p-4">
            <button
              onClick={handleUse}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all active:scale-95"
            >
              استخدام ({quantity})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
