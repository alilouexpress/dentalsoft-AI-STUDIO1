import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-emerald-950/90 text-white border-emerald-800/80',
    error: 'bg-rose-950/90 text-white border-rose-800/80',
    warning: 'bg-amber-950/90 text-white border-amber-800/80',
    info: 'bg-slate-900/95 text-white border-slate-700/80',
  };

  const type = toast.type || 'info';

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md ${bgStyles[type]}`}
      >
        {icons[type]}
        <p className="text-xs font-bold leading-snug flex-1">{toast.message}</p>
        <button
          onClick={hideToast}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
