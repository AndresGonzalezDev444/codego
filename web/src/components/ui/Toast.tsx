import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import type { Toast } from '@/types';

// ============================================
// TOAST SYSTEM — Notificaciones en-app
// ============================================

const iconMap = {
  success: <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />,
  info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
};

const borderMap = {
  success: 'border-green-500/30',
  error: 'border-red-500/30',
  warning: 'border-orange-500/30',
  info: 'border-cyan-500/30',
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useUIStore((s) => s.removeToast);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`
        flex items-start gap-3 p-4 rounded-2xl min-w-72 max-w-sm
        bg-[--bg-elevated] border shadow-[--shadow-elevated]
        ${borderMap[toast.type]}
      `}
      role="alert"
      aria-live="polite"
    >
      {iconMap[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-[--text-secondary] mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 text-[--text-muted] hover:text-white transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2"
      aria-label="Notificaciones"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook para usar toasts fácilmente
export function useToast() {
  const addToast = useUIStore((s) => s.addToast);

  return {
    success: (title: string, message?: string) =>
      addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) =>
      addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      addToast({ type: 'info', title, message }),
  };
}
