import { motion, AnimatePresence } from 'framer-motion';

interface ManaStoneAnimationProps {
  show: boolean;
  onComplete: () => void;
}

export const ManaStoneAnimation = ({ show, onComplete }: ManaStoneAnimationProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative"
          >
            <img
              src="/ManaStone.gif"
              alt="Mana Stone Animation"
              className="w-64 h-64 object-contain"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-cyan-400 font-bold text-sm mt-4 tracking-widest"
            >
              تم استخدام الحجر بنجاح
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
