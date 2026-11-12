// client/src/components/common/Input.jsx
const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-2xl bg-zinc-900/90 border ${
          error ? 'border-rose-500' : 'border-white/10 focus:border-lime-400'
        } text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none transition-colors ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  );
};

export default Input;
