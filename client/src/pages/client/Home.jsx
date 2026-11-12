// client/src/pages/client/Home.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowUpRight,
  Rotate3d,
  ShieldCheck,
  Truck,
  Zap,
  Hand,
  Layers,
  Eye,
} from 'lucide-react';
import { productApi } from '../../services/productApi';
import { categoryApi } from '../../services/categoryApi';
import { bannerApi } from '../../services/bannerApi';
import CircularCarousel from '../../components/common/CircularCarousel';
import DitherVeil from '../../components/common/DitherVeil';
import ProductGrid from '../../components/product/ProductGrid';
import PriceTag from '../../components/product/PriceTag';
import RatingStar from '../../components/product/RatingStar';
import { ROUTES } from '../../constants/routes';

const CAROUSEL_PRESETS = [
  { id: 'cylinder', label: 'Trụ 3D (Cylinder)' },
  { id: 'orbit', label: 'Quỹ Đạo (Orbit)' },
  { id: 'panorama', label: 'Vòm 360° (Panorama)' },
  { id: 'wheel', label: 'Bánh Xe (Wheel)' },
];

const DITHER_PATTERNS = [
  { id: 'floyd', label: 'Floyd-Steinberg' },
  { id: 'atkinson', label: 'Atkinson' },
  { id: 'bayer', label: 'Bayer Matrix' },
  { id: 'lines', label: 'Engraving Lines' },
  { id: 'noise', label: 'Blue Noise' },
];

const DITHER_THEMES = [
  {
    id: 'editorial',
    label: 'Editorial Paper',
    ink: '#120f17',
    paper: '#f4f1ea',
    rim: '#a78bfa',
    palette: 'duotone',
  },
  {
    id: 'acid',
    label: 'Acid Studio',
    ink: '#09090b',
    paper: '#a3e635',
    rim: '#ecfccb',
    palette: 'duotone',
  },
  {
    id: 'rgb',
    label: 'Cyber RGB',
    ink: '#09090b',
    paper: '#f4f4f5',
    rim: '#a3e635',
    palette: 'rgb',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3D Hero Parallax State
  const [heroRotation, setHeroRotation] = useState({ x: 0, y: 0 });
  // 3D Circular Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselPreset, setCarouselPreset] = useState('cylinder');
  // WebGL DitherVeil Studio State
  const [ditherPattern, setDitherPattern] = useState('floyd');
  const [ditherThemeId, setDitherThemeId] = useState('editorial');
  const [ditherReverse, setDitherReverse] = useState(false);
  const ditherTheme =
    DITHER_THEMES.find((t) => t.id === ditherThemeId) || DITHER_THEMES[0];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [allRes, featRes, bestRes, catRes, banRes] = await Promise.all([
          productApi.getAll({ limit: 12 }),
          productApi.getAll({ featured: true, limit: 8 }),
          productApi.getAll({ sort: 'best_selling', limit: 4 }),
          categoryApi.getAll(),
          bannerApi.getActive(),
        ]);
        setAllProducts(allRes.data || []);
        setFeaturedProducts(featRes.data || []);
        setBestSellers(bestRes.data || []);
        setCategories(catRes.data || []);
        setBanners(banRes.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -14;
    const y = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 14;
    setHeroRotation({ x, y });
  };

  const heroBanner = banners[0] || {
    title: 'DROP 04 // FUTURE ARCHIVE',
    subtitle: 'Trải nghiệm Streetwear 3D — Boxy Fit 260GSM & Acid Wash Heavyweight',
    imageUrl: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1600&q=85',
  };

  const showcaseProducts = useMemo(() => {
    const source = allProducts.length > 0 ? allProducts : featuredProducts;
    if (source.length === 0) return [];
    // Ensure at least 8 cards in the 3D cylinder ring for a rich 360° archive feel
    const expanded = [...source];
    while (expanded.length < 8) {
      expanded.push(...source);
    }
    return expanded.slice(0, Math.max(8, source.length));
  }, [allProducts, featuredProducts]);

  const carouselItems = useMemo(
    () =>
      showcaseProducts.map((item, idx) => ({
        id: `${item.id}-${idx}`,
        src:
          item.images?.[0]?.imageUrl ||
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80',
        alt: item.name,
        title: item.name,
        subtitle: item.category?.name || 'CALEM ARCHIVE',
        product: item,
      })),
    [showcaseProducts]
  );

  const activeProduct =
    carouselItems[activeSlide]?.product || showcaseProducts[0] || featuredProducts[0];

  return (
    <div className="space-y-20">
      {/* 1. 3D/4D INTERACTIVE RUNWAY HERO STAGE */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={() => setHeroRotation({ x: 0, y: 0 })}
        className="perspective-1400 relative rounded-[2rem] overflow-hidden border border-white/15 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 sm:p-12 lg:p-16 shadow-2xl"
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-lime-400/15 blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Hero Typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/15 border border-lime-400/40 text-lime-300 text-xs font-mono uppercase tracking-wider">
              <Rotate3d className="w-4 h-4 animate-spin" /> 3D Interactive Concept Store
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white leading-[1.05]">
              {heroBanner.title}
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
              {heroBanner.subtitle}. Di chuột lên không gian 3D để cảm nhận độ nổi chất liệu và
              phom dáng Boxy đặc trưng của <strong className="text-white">CALEM.CLUB</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-lime-400 text-zinc-950 font-extrabold text-sm hover:bg-lime-300 transition shadow-[0_0_30px_-5px_rgba(163,230,53,0.6)]"
              >
                KHÁM PHÁ BỘ SƯU TẬP <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                to="/products?sort=best_selling"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-zinc-900/90 border border-white/15 text-zinc-200 font-bold text-sm hover:border-lime-400/50 transition"
              >
                TOP BEST SELLERS
              </Link>
            </div>

            {/* Coupon Highlight Pill */}
            <div className="pt-4 flex flex-wrap gap-3 text-xs font-mono">
              <div className="px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-zinc-300">
                CODE: <strong className="text-lime-400">CALEM10</strong> (-10% đơn từ 300K)
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-zinc-300">
                CODE: <strong className="text-lime-400">CHAOBAN50K</strong> (-50K đơn từ 400K)
              </div>
            </div>
          </div>

          {/* Right 3D Multi-Depth Floating Stage with WebGL DitherVeil */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              style={{
                transform: `rotateX(${heroRotation.x}deg) rotateY(${heroRotation.y}deg)`,
                transition: 'transform 120ms ease-out',
              }}
              className="preserve-3d relative w-full max-w-md aspect-[4/5] rounded-3xl border border-lime-400/40 bg-zinc-900 p-3 shadow-2xl neon-border-glow"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden translate-z-10">
                <DitherVeil
                  src={heroBanner.imageUrl}
                  pattern="floyd"
                  pixelSize={2}
                  inkColor="#09090b"
                  paperColor="#f4f1ea"
                  revealRadius={190}
                  softness={0.6}
                  linger={1.1}
                  fit="cover"
                  rimColor="#a3e635"
                  palette="duotone"
                  levels={2}
                  contrast={1.15}
                  brightness={0}
                  rim={0.14}
                  reverse={false}
                  wander
                  clickBurst
                />
              </div>

              {/* Floating 3D Layer 1: Top-Right Spec Tag */}
              <div className="pointer-events-none absolute -top-4 -right-4 glass-panel px-4 py-2.5 rounded-2xl border border-lime-400/40 shadow-xl translate-z-30">
                <span className="text-[10px] font-mono text-zinc-400 block">CHẤT LIỆU</span>
                <span className="text-xs font-extrabold text-lime-400">100% COTTON 260GSM</span>
              </div>

              {/* Floating 3D Layer 2: Bottom-Left Interactive Card */}
              <div className="pointer-events-none absolute -bottom-5 -left-5 glass-panel p-4 rounded-2xl border border-white/20 shadow-2xl translate-z-30 max-w-[230px]">
                <div className="flex items-center gap-2 text-lime-400 text-xs font-bold mb-1">
                  <Sparkles className="w-4 h-4" /> 4D DITHER REVEAL
                </div>
                <p className="text-[11px] text-zinc-300 leading-snug">
                  Lướt chuột hoặc nhấn lên khung ảnh để kích hoạt sóng xung kích WebGL lộ diện thiết kế.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 INTERACTIVE WEBGL DITHER VEIL LOOKBOOK STAGE */}
      <section className="glass-panel rounded-[2rem] p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Buồng Thị Giác WebGL Dither Veil
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Pattern Switcher */}
            <div className="flex flex-wrap items-center gap-1 bg-zinc-950/90 p-1.5 rounded-2xl border border-white/10">
              {DITHER_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDitherPattern(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    ditherPattern === p.id
                      ? 'bg-lime-400 text-zinc-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Theme Switcher */}
            <div className="flex items-center gap-1 bg-zinc-950/90 p-1.5 rounded-2xl border border-white/10">
              {DITHER_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDitherThemeId(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    ditherThemeId === t.id
                      ? 'bg-white text-zinc-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDitherReverse((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  ditherReverse
                    ? 'bg-lime-400/20 text-lime-300 border border-lime-400/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Đảo lớp
              </button>
            </div>
          </div>
        </div>

        <div
          className="rounded-3xl overflow-hidden border border-white/15 bg-zinc-950 shadow-2xl"
          style={{ width: '100%', height: '600px', position: 'relative' }}
        >
          <DitherVeil
            src={
              activeProduct?.images?.[0]?.imageUrl ||
              'https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop'
            }
            pattern={ditherPattern}
            pixelSize={2}
            inkColor={ditherTheme.ink}
            paperColor={ditherTheme.paper}
            revealRadius={200}
            softness={0.6}
            linger={1}
            fit="contain"
            rimColor={ditherTheme.rim}
            palette={ditherTheme.palette}
            levels={2}
            contrast={1.15}
            brightness={0}
            rim={0.12}
            reverse={ditherReverse}
            wander={false}
            clickBurst
          />
        </div>
      </section>

      {/* 2. 3D CIRCULAR CYLINDER LOOKBOOK SHOWCASE */}
      <section className="glass-panel rounded-[2rem] p-6 sm:p-10 border border-white/10 relative overflow-hidden">
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 relative z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Sàn Diễn Xoay Không Gian 3D
            </h2>
          </div>

          {/* 3D Geometry Preset Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950/80 p-1.5 rounded-2xl border border-white/10">
            {CAROUSEL_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setCarouselPreset(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  carouselPreset === p.id
                    ? 'bg-lime-400 text-zinc-950 shadow-[0_0_20px_-4px_rgba(163,230,53,0.7)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D CircularCarousel Stage */}
        <div
          className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 relative overflow-hidden shadow-inner"
          style={{ width: '100%', height: '560px', position: 'relative' }}
        >
          {/* Ambient center spotlight */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(163,230,53,0.12),transparent_62%)]" />

          <CircularCarousel
            items={carouselItems.length > 0 ? carouselItems : undefined}
            preset={carouselPreset}
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
            cornerRadius={14}
            onChange={(idx) => setActiveSlide(idx)}
            onItemClick={(item) => {
              if (item?.product?.slug) {
                navigate(`/products/${item.product.slug}`);
              }
            }}
          />
        </div>

        {/* Synchronized Active Product Spotlight Bar */}
        {activeProduct && (
          <div className="mt-6 bg-zinc-900/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-lime-400/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              {activeProduct.images?.[0]?.imageUrl && (
                <img
                  src={activeProduct.images[0].imageUrl}
                  alt={activeProduct.name}
                  className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl object-cover border border-lime-400/40 shrink-0"
                />
              )}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-lime-400/15 border border-lime-400/40 text-lime-300 text-[11px] font-mono uppercase">
                    ĐANG TIÊU ĐIỂM #{String(activeSlide + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 uppercase">
                    {activeProduct.category?.name || 'STREETWEAR ARCHIVE'}
                  </span>
                  <RatingStar
                    rating={activeProduct.ratingAvg}
                    count={activeProduct.ratingCount}
                    size="w-3.5 h-3.5"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white">
                  {activeProduct.name}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 max-w-2xl">
                  {activeProduct.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10 shrink-0">
              <div>
                <span className="block text-[10px] font-mono uppercase text-zinc-400 mb-0.5">
                  Giá niêm yết Studio
                </span>
                <PriceTag
                  basePrice={activeProduct.basePrice}
                  salePrice={activeProduct.salePrice}
                  size="lg"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  to={`/products/${activeProduct.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-lime-400 text-zinc-950 font-extrabold text-xs uppercase tracking-wider hover:bg-lime-300 transition shadow-[0_0_25px_-5px_rgba(163,230,53,0.65)]"
                >
                  <Eye className="w-4 h-4" /> Mở phòng thử 3D <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. CATEGORY PORTALS */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Danh Mục Thiết Kế
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 hover:border-lime-400/60 transition-all duration-300"
            >
              {cat.imageUrl && (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-65 group-hover:scale-110 group-hover:opacity-85 transition-all duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-sm font-bold text-white group-hover:text-lime-400 transition">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED 3D DROP */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Sản Phẩm Nổi Bật
            </h2>
          </div>
          <Link
            to={ROUTES.PRODUCTS}
            className="text-xs font-bold text-lime-400 hover:underline flex items-center gap-1"
          >
            Xem tất cả <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* 5. BEST SELLERS */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Top Bán Chạy Nhất
            </h2>
          </div>
        </div>
        <ProductGrid products={bestSellers} loading={loading} />
      </section>

      {/* 6. STUDIO VALUE GUARANTEES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Truck,
            title: 'Giao hàng hỏa tốc toàn quốc',
            desc: 'Miễn phí vận chuyển cho mọi đơn hàng từ 500.000đ trở lên.',
          },
          {
            icon: ShieldCheck,
            title: 'Bảo hành hình in & đường may',
            desc: 'Đổi mới trong 14 ngày nếu có bất kỳ lỗi nào từ nhà sản xuất.',
          },
          {
            icon: Zap,
            title: 'Thanh toán MoMo & COD tức thì',
            desc: 'Tích hợp cổng thanh toán điện tử MoMo Sandbox bảo mật chữ ký SHA256.',
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="glass-panel rounded-3xl p-6 border border-white/10 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center text-lime-400 shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Home;
