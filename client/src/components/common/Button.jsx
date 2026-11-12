// client/src/components/common/Button.jsx
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const variants = {
    primary:
      'bg-lime-400 text-zinc-950 hover:bg-lime-300 font-bold shadow-[0_0_24px_-4px_rgba(163,230,53,0.45)]',
    secondary:
      'bg-zinc-900 text-zinc-100 border border-white/15 hover:border-lime-400/60 hover:text-lime-300',
    danger: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30',
    ghost: 'text-zinc-300 hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl',
    md: 'px-5 py-2.5 text-sm rounded-2xl',
    lg: 'px-7 py-3.5 text-base rounded-2xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
