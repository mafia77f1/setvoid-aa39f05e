import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InventoryItem } from '@/types/game';
import { ManaStoneAnimation } from './dungeon/ManaStoneAnimation';

export interface StoneUsePayload {
  newName?: string;
  [key: string]: unknown;
}

interface StoneUseModalProps {
  item: InventoryItem;
  onClose: () => void;
  onUse: (data?: StoneUsePayload) => void;
}

export const StoneUseModal = ({ item, onClose, onUse }: StoneUseModalProps) => {
  const [step, setStep] = useState<'confirm' | 'input' | 'animation'>('confirm');
  const [inputValue, setInputValue] = useState('');
  const [showManaAnimation, setShowManaAnimation] = useState(false);

  const isRenameStone = item.id === 'rename_stone';
  const isCentralStone = item.id === 'central_activation_stone';
  const isGrandQuestStone = item.id === 'grand_quest_stone';
  const isGateExitStone = item.id === 'gate_exit_stone';

  const handleUseClick = () => {
    if (isRenameStone) {
      setStep('input');
    } else {
      // For other stones, just show animation and use
      setShowManaAnimation(true);
    }
  };

  const handleConfirmRename = () => {
    if (!inputValue.trim()) return;
    setShowManaAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowManaAnimation(false);
    if (isRenameStone) {
      onUse({ newName: inputValue.trim() });
    } else {
      onUse();
    }
  };

  const getStoneTitle = () => {
    switch (item.id) {
      case 'rename_stone': return 'حجر إعادة التسمية';
      case 'central_activation_stone': return 'حجر التفعيل المركزي';
      case 'grand_quest_stone': return 'حجر المهمة الكبرى';
      case 'gate_exit_stone': return 'حجر الخروج من البوابة';
      default: return item.name;
    }
  };

  return (
    <>
      <ManaStoneAnimation show={showManaAnimation} onComplete={handleAnimationComplete} />
      
      <AnimatePresence>
        {!showManaAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <div className="absolute inset-0" onClick={onClose} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-sm w-full bg-[#050b18] border border-cyan-500/30 overflow-hidden"
              style={{ boxShadow: '0 0 40px rgba(56,189,248,0.2)' }}
            >
              {/* Top glow */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

              {/* Header */}
              <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
                <h2 className="text-cyan-400 text-sm font-bold tracking-widest uppercase">استخدام الحجر</h2>
                <button onClick={onClose} className="p-1 hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-cyan-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Stone Image */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 border border-cyan-500/30 bg-black/40 flex items-center justify-center rounded-lg overflow-hidden">
                    <img src="/ManaStoneElement.png" alt="Mana Stone" className="w-20 h-20 object-contain" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-white font-bold text-lg">{getStoneTitle()}</h3>
                  <p className="text-slate-400 text-xs mt-1">{item.description}</p>
                  <p className="text-cyan-500 text-[10px] mt-2 font-mono">الكمية المتبقية: x{item.quantity}</p>
                </div>

                {/* Rename Input */}
                {step === 'input' && isRenameStone && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="أدخل الاسم الجديد..."
                      className="w-full bg-black/60 border border-cyan-500/30 text-white px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 transition-colors text-right"
                      autoFocus
                      dir="rtl"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleConfirmRename}
                        disabled={!inputValue.trim()}
                        className="py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs tracking-widest uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        اكمال
                      </button>
                      <button
                        onClick={onClose}
                        className="py-3 border border-slate-700/50 text-slate-400 font-bold text-xs tracking-widest uppercase active:scale-95 transition-all"
                      >
                        إغلاق
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Use Button (for non-rename stones or initial state) */}
                {step === 'confirm' && (
                  <button
                    onClick={handleUseClick}
                    className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-xs tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] active:scale-95 transition-all"
                  >
                    USE
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
