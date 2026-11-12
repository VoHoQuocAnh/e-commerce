// client/src/components/common/ProductVariantSelector.jsx
const ProductVariantSelector = ({
  variants = [],
  selectedColor,
  selectedSize,
  onSelectColor,
  onSelectSize,
}) => {
  const uniqueColors = [];
  const seenColors = new Set();

  variants.forEach((v) => {
    if (!seenColors.has(v.color)) {
      seenColors.add(v.color);
      uniqueColors.push({ color: v.color, colorHex: v.colorHex || '#27272a' });
    }
  });

  const sizesForColor = variants.filter((v) => !selectedColor || v.color === selectedColor);

  return (
    <div className="space-y-5">
      {/* Color Picker */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Màu sắc: <strong className="text-white">{selectedColor || 'Chọn màu'}</strong>
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {uniqueColors.map((c) => {
            const active = selectedColor === c.color;
            return (
              <button
                key={c.color}
                type="button"
                onClick={() => onSelectColor(c.color)}
                className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all ${
                  active
                    ? 'border-lime-400 bg-lime-400/10 text-white shadow-[0_0_18px_-4px_rgba(163,230,53,0.4)]'
                    : 'border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/30'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-white/30 shadow-inner"
                  style={{ backgroundColor: c.colorHex }}
                />
                <span>{c.color}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Picker */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Kích cỡ (Size): <strong className="text-white">{selectedSize || 'Chọn size'}</strong>
          </span>
          <span className="text-xs text-lime-400 font-mono">Form Boxy Oversize</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {sizesForColor.map((v) => {
            const outOfStock = v.stockQuantity <= 0;
            const active = selectedSize === v.size;
            return (
              <button
                key={v.id}
                type="button"
                disabled={outOfStock}
                onClick={() => onSelectSize(v.size)}
                className={`min-w-[56px] px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                  outOfStock
                    ? 'border-white/5 bg-zinc-900/40 text-zinc-600 line-through cursor-not-allowed'
                    : active
                      ? 'border-lime-400 bg-lime-400 text-zinc-950 shadow-[0_0_20px_-4px_rgba(163,230,53,0.6)] scale-105'
                      : 'border-white/15 bg-zinc-900 text-zinc-200 hover:border-lime-400/50'
                }`}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductVariantSelector;
