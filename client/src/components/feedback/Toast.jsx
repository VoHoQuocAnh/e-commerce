// client/src/components/feedback/Toast.jsx
import { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const listeners = new Set();

export const notify = {
  emit(type, message) {
    const id = `${Date.now()}-${Math.random()}`;
    listeners.forEach((fn) => fn({ id, type, message }));
  },
  success(msg) {
    this.emit('success', msg);
  },
  error(msg) {
    this.emit('error', msg);
  },
  info(msg) {
    this.emit('info', msg);
  },
};

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3600);
    };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const styles = {
          success: 'border-lime-400/50 bg-zinc-900/95 text-lime-300',
          error: 'border-rose-500/50 bg-zinc-900/95 text-rose-300',
          info: 'border-sky-400/50 bg-zinc-900/95 text-sky-300',
        };
        const Icon =
          t.type === 'success' ? CheckCircle2 : t.type === 'error' ? AlertTriangle : Info;

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ${styles[t.type]}`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium text-zinc-100 flex-1">{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
