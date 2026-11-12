// client/src/components/common/Modal.jsx
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`glass-panel w-full ${maxWidth} rounded-3xl border border-white/15 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white font-display">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
