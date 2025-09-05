'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X, Loader2 } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'loading';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (type !== 'loading') {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, type]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    loading: <Loader2 className="w-5 h-5 animate-spin" />
  };

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    loading: 'bg-blue-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`${colors[type]} text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px] max-w-[500px]`}
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      {type !== 'loading' && (
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

export function ToastContainer({ toasts, onClose }: { toasts: any[], onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => onClose(toast.id)}
            duration={toast.duration}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}