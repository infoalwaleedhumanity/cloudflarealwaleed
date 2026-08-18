import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export function Toast({ message, show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-lg border border-[var(--primary)]/15 shadow-[0_10px_30px_-5px_rgba(var(--primary-rgb),0.2)] rounded-2xl p-3 pr-4"
          dir="rtl"
        >
          <div className="w-10 h-10 rounded-full bg-[var(--success)]/10 flex items-center justify-center text-[var(--success)] shrink-0">
            <CheckCircle size={22} strokeWidth={2.5} />
          </div>
          <div className="pl-6">
            <h4 className="font-bold text-[var(--primary)] text-lg">{message}</h4>
          </div>
          <button 
            onClick={onClose} 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[var(--primary)]/50 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
