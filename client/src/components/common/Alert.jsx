// client/src/components/common/Alert.jsx
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const Alert = ({ type = 'info', message, className = '' }) => {
  if (!message) return null;

  const styles = {
    info: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    success: 'bg-lime-500/10 border-lime-500/30 text-lime-300',
    error: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
  };

  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm ${styles[type]} ${className}`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default Alert;
