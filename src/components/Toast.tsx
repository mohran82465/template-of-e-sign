import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-indigo-500 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-200 bg-white shadow-emerald-500/10';
      case 'warning':
        return 'border-amber-200 bg-white shadow-amber-500/10';
      case 'error':
        return 'border-rose-200 bg-white shadow-rose-500/10';
      default:
        return 'border-indigo-200 bg-white shadow-indigo-500/10';
    }
  };

  return (
    <div
      className={`pointer-events-auto rounded-xl border p-4 shadow-lg flex items-start gap-3 transition-all transform translate-y-0 opacity-100 ${getBorderColor()}`}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-slate-900">{toast.title}</h4>
        {toast.description && (
          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
