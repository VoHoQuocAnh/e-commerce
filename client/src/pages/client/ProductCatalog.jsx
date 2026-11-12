// client/src/pages/client/ProductCatalog.jsx
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, RotateCcw, LayoutGrid, Rotate3d } from 'lucide-react';
import { productApi } from '../../services/productApi';
import { categoryApi } from '../../services/categoryApi';
import { useDebounce } from '../../hooks/useDebounce';
import CircularCarousel from '../../components/common/CircularCarousel';
import ProductGrid from '../../components/product/ProductGrid';
import Pagination from '../../components/common/Pagination';

const SIZES = ['S', 'M', 'L', 'XL', 'FreeSize'];

const ProductCatalog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const carouselItems = useMemo(() => {
    if (products.length === 0) return [];
    const expanded = [...products];
    while (expanded.length < 8) {
      expanded.push(...products);
    }
    return expanded.slice(0, Math.max(8, products.length)).map((item, idx) => ({
      id: `${item.id}-${idx}`,
      src:
        item.images?.[0]?.imageUrl ||
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80',
      alt: item.name,
      title: item.name,
      subtitle: item.category?.name || 'CALEM ARCHIVE',
      product: item,
    }));
  }, [products]);

  const category = searchParams.get('category') || '';
  const gender = searchParams.get('gender') || '';
  const size = searchParams.get('size') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data || []));
  }, []);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      nextParams.set('q', debouncedSearch);
    } else {
      nextParams.delete('q');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams, { replace: true });
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          sort,
          ...(debouncedSearch ? { q: debouncedSearch } : {}),
          ...(category ? { category } : {}),
          ...(gender ? { gender } : {}),
          ...(size ? { size } : {}),
          ...(minPrice ? { minPrice } : {}),
          ...(maxPrice ? { maxPrice } : {}),
          ...(minRating ? { minRating } : {}),
        };
        const res = await productApi.getAll(params);
        setProducts(res.data || []);
        setMeta(res.meta || { page: 1, totalPages: 1, totalItems: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, sort, debouncedSearch, category, gender, size, minPrice, maxPrice, minRating]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Bộ Sưu Tập Thời Trang ({meta.totalItems} sản phẩm)
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm áo thun boxy, hoodie, cargo..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-white/10 text-sm text-white focus:border-lime-400 focus:outline-none"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-white/10 text-xs font-bold text-zinc-200 focus:border-lime-400 focus:outline-none"
          >
            <option value="newest">Mới nhất</option>
            <option value="best_selling">Bán chạy nhất</option>
            <option value="price_asc">Giá: Thấp → Cao</option>
            <option value="price_desc">Giá: Cao → Thấp</option>
            <option value="rating">Đánh giá cao</option>
          </select>

          <div className="inline-flex items-center p-1 rounded-2xl bg-zinc-900 border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'grid'
                  ? 'bg-lime-400 text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Lưới 3D
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cylinder')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'cylinder'
                  ? 'bg-lime-400 text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" /> Trụ 360°
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
            Danh mục
          </label>
          <select
            value={category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
            Giới tính
          </label>
          <select
            value={gender}
            onChange={(e) => updateFilter('gender', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
          >
            <option value="">Tất cả (Unisex / Nam / Nữ)</option>
            <option value="unisex">Unisex</option>
            <option value="men">Nam (Men)</option>
            <option value="women">Nữ (Women)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
            Kích cỡ (Size)
          </label>
          <div className="flex gap-1.5">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => updateFilter('size', size === s ? '' : s)}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition ${
                  size === s
                    ? 'bg-lime-400 text-zinc-950 border-lime-400'
                    : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
            Khoảng giá
          </label>
          <select
            value={`${minPrice}-${maxPrice}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-');
              const next = new URLSearchParams(searchParams);
              if (min) next.set('minPrice', min);
              else next.delete('minPrice');
              if (max) next.set('maxPrice', max);
              else next.delete('maxPrice');
              next.set('page', '1');
              setSearchParams(next);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
          >
            <option value="-">Tất cả mức giá</option>
            <option value="0-400000">Dưới 400.000đ</option>
            <option value="400000-800000">400.000đ - 800.000đ</option>
            <option value="800000-5000000">Trên 800.000đ</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-bold text-zinc-300 hover:border-lime-400 hover:text-lime-400 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Xóa bộ lọc
        </button>
      </div>

      {/* 3D Cylinder Stage View (when selected) */}
      {viewMode === 'cylinder' && carouselItems.length > 0 && (
        <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-lime-400/30">
          <div
            className="rounded-2xl bg-zinc-950/90 border border-white/10 overflow-hidden"
            style={{ width: '100%', height: '560px', position: 'relative' }}
          >
            <CircularCarousel
              items={carouselItems}
              preset="cylinder"
              intro="rise"
              cardWidth={220}
              aspectRatio={1}
              speed={14}
              captions
              gap={25}
              tilt={-5}
              curve={1}
              perspective={2500}
              autoplay="drift"
              interval={3}
              direction="left"
              momentum={0.6}
              snap
              pauseOnHover
              focusOnClick
              draggable
              parallax={0.3}
              stretch={0.5}
              fadeColor="#09090b"
              depthFade={0.55}
              innerShade={0.6}
              cornerRadius={12}
              onItemClick={(item) => {
                if (item?.product?.slug) {
                  navigate(`/products/${item.product.slug}`);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Product Grid & Pagination */}
      <ProductGrid products={products} loading={loading} />
      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(p) => updateFilter('page', String(p))}
      />
    </div>
  );
};

export default ProductCatalog;
