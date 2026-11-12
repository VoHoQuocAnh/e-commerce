// client/src/components/product/ProductCard.jsx
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Eye, ShoppingBag } from 'lucide-react';
import PriceTag from './PriceTag';
import RatingStar from './RatingStar';

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = product.images?.length
    ? product.images
    : [{ imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80' }];

  const discountPercent =
    product.salePrice && Number(product.salePrice) < Number(product.basePrice)
      ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
      : 0;

  const uniqueColors = [];
  const seen = new Set();
  (product.variants || []).forEach((v) => {
    if (!seen.has(v.color)) {
      seen.add(v.color);
      uniqueColors.push(v);
    }
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false });
  };

  return (
    <div className="perspective-1000 group">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: tilt.active
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: tilt.active ? 'transform 80ms ease-out' : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="preserve-3d relative rounded-3xl bg-zinc-900/80 border border-white/10 hover:border-lime-400/50 p-3.5 shadow-2xl overflow-hidden"
      >
        {/* 4D Holographic Cursor Spotlight */}
        {tilt.active && (
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-40 transition-opacity"
            style={{
              background: `radial-gradient(360px circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(163, 230, 53, 0.22), transparent 60%)`,
            }}
          />
        )}

        {/* Product Image Container with Z-Depth */}
        <Link
          to={`/products/${product.slug}`}
          className="block relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-950 translate-z-10"
        >
          <img
            src={images[activeImageIndex]?.imageUrl || images[0].imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />

          {/* Floating 3D Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 translate-z-20">
            {discountPercent > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-lime-400 text-zinc-950 shadow-lg">
                -{discountPercent}%
              </span>
            )}
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-950/85 text-lime-300 border border-lime-400/30 backdrop-blur-md">
                <Sparkles className="w-3 h-3" /> 3D Drop
              </span>
            )}
          </div>

          {/* Floating Quick Action Overlay */}
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
            <span className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-white/15 text-xs font-bold text-white hover:border-lime-400 hover:text-lime-400">
              <Eye className="w-3.5 h-3.5" /> Khám phá 3D
            </span>
          </div>
        </Link>

        {/* Details Layer */}
        <div className="pt-4 px-1 space-y-2.5 translate-z-20">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              {product.category?.name || 'CALEM ARCHIVE'}
            </span>
            <RatingStar rating={product.ratingAvg} count={product.ratingCount} size="w-3.5 h-3.5" />
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="block text-sm font-bold text-zinc-100 group-hover:text-lime-400 transition line-clamp-1"
          >
            {product.name}
          </Link>

          <div className="flex items-center justify-between pt-1">
            <PriceTag basePrice={product.basePrice} salePrice={product.salePrice} size="sm" />

            {/* Interactive Color Swatches */}
            {uniqueColors.length > 0 && (
              <div className="flex items-center gap-1.5">
                {uniqueColors.slice(0, 4).map((v, idx) => (
                  <button
                    key={v.id}
                    type="button"
                    title={v.color}
                    onMouseEnter={() => {
                      const matchedIndex = images.findIndex((img) => img.colorRef === v.color);
                      if (matchedIndex !== -1) setActiveImageIndex(matchedIndex);
                    }}
                    className="w-4 h-4 rounded-full border border-white/30 transition-transform hover:scale-125"
                    style={{ backgroundColor: v.colorHex || '#3f3f46' }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
