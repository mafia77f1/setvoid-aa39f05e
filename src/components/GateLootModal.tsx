import { useState, useEffect } from 'react';
import { X, Gift, Sparkles, Crown, Zap, Package, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Gate, InventoryItem } from '@/types/game';

export interface LootItem {
  id: string;
  name: string;
  icon: string;
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  type: 'gold' | 'xp' | 'item' | 'key' | 'equipment';
}

interface GateLootModalProps {
  show: boolean;
  gate: Gate | null;
  loot: LootItem[];
  onClose: () => void;
  onCollect: () => void;
}

const RARITY_CONFIG = {
  common: {
    label: 'عادي',
    color: 'text-slate-400',
    bg: 'bg-slate-800/50',
    border: 'border-slate-600',
    glow: '',
  },
  uncommon: {
    label: 'غير شائع',
    color: 'text-green-400',
    bg: 'bg-green-900/30',
    border: 'border-green-500/50',
    glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',
  },
  rare: {
    label: 'نادر',
    color: 'text-blue-400',
    bg: 'bg-blue-900/30',
    border: 'border-blue-500/50',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
  },
  epic: {
    label: 'ملحمي',
    color: 'text-purple-400',
    bg: 'bg-purple-900/30',
    border: 'border-purple-500/50',
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]',
  },
  legendary: {
    label: 'أسطوري',
    color: 'text-yellow-400',
    bg: 'bg-yellow-900/30',
    border: 'border-yellow-500/50',
    glow: 'shadow-[0_0_30px_rgba(234,179,8,0.6)]',
  },
};

export const GateLootModal = ({ show, gate, loot, onClose, onCollect }: GateLootModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [revealedItems, setRevealedItems] = useState<number[]>([]);
  const [allRevealed, setAllRevealed] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setRevealedItems([]);
      setAllRevealed(false);
      
      // كشف العناصر واحداً تلو الآخر
      loot.forEach((_, index) => {
        setTimeout(() => {
          setRevealedItems(prev => [...prev, index]);
          if (index === loot.length - 1) {
            setTimeout(() => setAllRevealed(true), 500);
          }
        }, 500 + index * 400);
      });
    } else {
      setIsVisible(false);
    }
  }, [show, loot]);

  if (!show || !gate) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[150] flex items-center justify-center p-4 transition-all duration-500",
      isVisible ? "bg-black/90 backdrop-blur-md" : "bg-transparent pointer-events-none"
    )}>
      <div className={cn(
        "relative max-w-md w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-yellow-500/30 overflow-hidden transition-all duration-500",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      )}>
        {/* Sparkle effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative p-4 border-b border-yellow-500/30 bg-gradient-to-r from-yellow-900/20 via-transparent to-yellow-900/20">
          <div className="flex items-center justify-center gap-3">
            <Gift className="w-6 h-6 text-yellow-400 animate-bounce" />
            <h2 className="text-xl font-bold text-yellow-400 tracking-wider">غنائم البوابة</h2>
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-center text-xs text-slate-400 mt-1">
            {gate.name} - رتبة {gate.rank}
          </p>
        </div>

        {/* Loot Items */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {loot.map((item, index) => {
            const config = RARITY_CONFIG[item.rarity];
            const isRevealed = revealedItems.includes(index);

            return (
              <div
                key={`${item.id}-${index}`}
                className={cn(
                  "relative p-3 border rounded transition-all duration-500",
                  config.border,
                  config.bg,
                  config.glow,
                  isRevealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                )}
              >
                {/* Mystery overlay */}
                {!isRevealed && (
                  <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center rounded">
                    <Package className="w-8 h-8 text-slate-600 animate-pulse" />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded border flex items-center justify-center text-2xl",
                    config.border,
                    "bg-black/50"
                  )}>
                    {item.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.name}</span>
                      {item.rarity === 'legendary' && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                      {item.rarity === 'epic' && (
                        <Star className="w-4 h-4 text-purple-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={config.color}>{config.label}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">x{item.quantity}</span>
                    </div>
                  </div>

                  {/* Sparkle for rare+ */}
                  {(item.rarity === 'rare' || item.rarity === 'epic' || item.rarity === 'legendary') && isRevealed && (
                    <Sparkles className={cn("w-5 h-5 animate-pulse", config.color)} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-yellow-500/30 bg-gradient-to-r from-yellow-900/10 via-transparent to-yellow-900/10">
          <button
            onClick={() => {
              onCollect();
              onClose();
            }}
            disabled={!allRevealed}
            className={cn(
              "w-full py-3 font-bold text-sm uppercase tracking-wider transition-all",
              allRevealed
                ? "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-black active:scale-95"
                : "bg-slate-800 text-slate-500 cursor-wait"
            )}
          >
            {allRevealed ? (
              <span className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" />
                جمع الغنائم
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5 animate-pulse" />
                جاري الكشف...
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// دالة لتوليد الغنائم بناءً على رتبة البوابة
export const generateGateLoot = (gate: Gate): LootItem[] => {
  const loot: LootItem[] = [];
  
  // Gold reward (always)
  loot.push({
    id: 'gold',
    name: 'ذهب',
    icon: '💰',
    quantity: gate.rewards.gold,
    rarity: 'common',
    type: 'gold',
  });

  // XP reward (always)
  loot.push({
    id: 'xp',
    name: 'نقاط خبرة',
    icon: '⭐',
    quantity: gate.rewards.xp,
    rarity: 'uncommon',
    type: 'xp',
  });

  // Rank-based loot chances
  const rankLootTable: Record<string, { items: Omit<LootItem, 'quantity'>[]; dropChance: number }[]> = {
    'E': [
      { items: [{ id: 'health_potion', name: 'جرعة صحة صغيرة', icon: '🧪', rarity: 'common', type: 'item' }], dropChance: 0.5 },
    ],
    'D': [
      { items: [{ id: 'health_potion', name: 'جرعة صحة صغيرة', icon: '🧪', rarity: 'common', type: 'item' }], dropChance: 0.6 },
      { items: [{ id: 'xp_book', name: 'كتاب خبرة', icon: '📖', rarity: 'uncommon', type: 'item' }], dropChance: 0.3 },
    ],
    'C': [
      { items: [{ id: 'health_potion', name: 'جرعة صحة', icon: '🧪', rarity: 'common', type: 'item' }], dropChance: 0.7 },
      { items: [{ id: 'xp_book', name: 'كتاب خبرة', icon: '📖', rarity: 'uncommon', type: 'item' }], dropChance: 0.5 },
      { items: [{ id: 'energy_drink', name: 'مشروب طاقة', icon: '⚡', rarity: 'uncommon', type: 'item' }], dropChance: 0.4 },
      { items: [{ id: 'gate_key_d', name: 'مفتاح بوابة D', icon: '🔑', rarity: 'rare', type: 'key' }], dropChance: 0.2 },
    ],
    'B': [
      { items: [{ id: 'health_potion', name: 'جرعة صحة كبيرة', icon: '🧪', rarity: 'uncommon', type: 'item' }], dropChance: 0.8 },
      { items: [{ id: 'xp_book', name: 'كتاب خبرة متقدم', icon: '📚', rarity: 'rare', type: 'item' }], dropChance: 0.6 },
      { items: [{ id: 'energy_crystal', name: 'بلورة طاقة', icon: '💎', rarity: 'rare', type: 'item' }], dropChance: 0.4 },
      { items: [{ id: 'gate_key_c', name: 'مفتاح بوابة C', icon: '🗝️', rarity: 'rare', type: 'key' }], dropChance: 0.3 },
      { items: [{ id: 'title_gate_hunter', name: 'لقب: صائد البوابات', icon: '👑', rarity: 'epic', type: 'item' }], dropChance: 0.1 },
    ],
    'A': [
      { items: [{ id: 'health_elixir', name: 'إكسير الصحة', icon: '💉', rarity: 'rare', type: 'item' }], dropChance: 0.9 },
      { items: [{ id: 'xp_tome', name: 'مجلد الحكمة', icon: '📜', rarity: 'epic', type: 'item' }], dropChance: 0.7 },
      { items: [{ id: 'shadow_essence', name: 'جوهر الظل', icon: '🌑', rarity: 'epic', type: 'item' }], dropChance: 0.5 },
      { items: [{ id: 'gate_key_b', name: 'مفتاح بوابة B', icon: '🔐', rarity: 'epic', type: 'key' }], dropChance: 0.4 },
      { items: [{ id: 'title_elite', name: 'لقب: النخبة', icon: '🏆', rarity: 'epic', type: 'item' }], dropChance: 0.2 },
      { items: [{ id: 'legendary_stone', name: 'حجر أسطوري', icon: '💠', rarity: 'legendary', type: 'item' }], dropChance: 0.05 },
    ],
    'S': [
      { items: [{ id: 'health_elixir', name: 'إكسير الصحة الكامل', icon: '💉', rarity: 'epic', type: 'item' }], dropChance: 1.0 },
      { items: [{ id: 'xp_ancient', name: 'كتاب المعرفة القديمة', icon: '📕', rarity: 'legendary', type: 'item' }], dropChance: 0.8 },
      { items: [{ id: 'shadow_core', name: 'قلب الظل', icon: '⚫', rarity: 'legendary', type: 'item' }], dropChance: 0.6 },
      { items: [{ id: 'gate_key_a', name: 'مفتاح بوابة A', icon: '🗝️', rarity: 'legendary', type: 'key' }], dropChance: 0.5 },
      { items: [{ id: 'title_monarch', name: 'لقب: ملك الظلال', icon: '👑', rarity: 'legendary', type: 'item' }], dropChance: 0.3 },
      { items: [{ id: 'divine_blessing', name: 'بركة إلهية', icon: '✨', rarity: 'legendary', type: 'item' }], dropChance: 0.1 },
    ],
  };

  const rankLoot = rankLootTable[gate.rank] || rankLootTable['E'];
  
  rankLoot.forEach(({ items, dropChance }) => {
    if (Math.random() < dropChance) {
      const item = items[Math.floor(Math.random() * items.length)];
      const quantity = item.rarity === 'legendary' ? 1 : 
                       item.rarity === 'epic' ? Math.floor(Math.random() * 2) + 1 :
                       item.rarity === 'rare' ? Math.floor(Math.random() * 3) + 1 :
                       Math.floor(Math.random() * 5) + 1;
      
      loot.push({ ...item, quantity });
    }
  });

  // Shadow points based on rank
  const shadowPointsMap: Record<string, number> = { 'E': 1, 'D': 2, 'C': 5, 'B': 10, 'A': 25, 'S': 50 };
  if (shadowPointsMap[gate.rank]) {
    loot.push({
      id: 'shadow_points',
      name: 'نقاط الظل',
      icon: '🌑',
      quantity: shadowPointsMap[gate.rank],
      rarity: gate.rank === 'S' ? 'legendary' : gate.rank === 'A' ? 'epic' : 'rare',
      type: 'item',
    });
  }

  return loot;
};
