// client/src/pages/client/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Rotate3d,
  ShieldCheck,
  Truck,
  Check,
  Send,
} from 'lucide-react';
import { productApi } from '../../services/productApi';
import { reviewApi } from '../../services/reviewApi';
import { wishlistApi } from '../../services/wishlistApi';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import ProductVariantSelector from '../../components/common/ProductVariantSelector';
import PriceTag from '../../components/product/PriceTag';
import RatingStar from '../../components/product/RatingStar';
import { notify } from '../../components/feedback/Toast';
import { formatDate } from '../../utils/formatDate';
import { ROUTES } from '../../constants/routes';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // 3D Interactive Studio Mode State
  const [studio3dMode, setStudio3dMode] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0, zoom: 1 });

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const res = await productApi.getBySlug(slug);
        const prod = res.data;
        setProduct(prod);

        const defaultImg =
          prod.images?.find((i) => i.isThumbnail)?.imageUrl || prod.images?.[0]?.imageUrl || '';
        setActiveImage(defaultImg);

        if (prod.variants?.length > 0) {
          const firstAvail = prod.variants.find((v) => v.stockQuantity > 0) || prod.variants[0];
          setSelectedColor(firstAvail.color);
          setSelectedSize(firstAvail.size);
        }

        const revRes = await reviewApi.getByProduct(prod.id);
        setReviews(revRes.data || []);
      } catch {
        notify.error('Không tìm thấy sản phẩm');
        navigate(ROUTES.PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [slug, navigate]);

  if (loading || !product) return <Loader />;

  const matchedVariant = product.variants?.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const matchingImage = product.images?.find((img) => img.colorRef === color);
    if (matchingImage) setActiveImage(matchingImage.imageUrl);

    const sizesForNewColor = product.variants?.filter((v) => v.color === color) || [];
    if (!sizesForNewColor.some((v) => v.size === selectedSize)) {
      setSelectedSize(sizesForNewColor[0]?.size || '');
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      notify.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate(ROUTES.LOGIN);
      return;
    }
    if (!matchedVariant) {
      notify.error('Vui lòng chọn màu sắc và kích cỡ');
      return;
    }
    try {
      setAdding(true);
      await addToCart(matchedVariant.id, quantity);
    } catch (err) {
      notify.error(err.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      notify.info('Vui lòng đăng nhập để lưu sản phẩm yêu thích');
      navigate(ROUTES.LOGIN);
      return;
    }
    try {
      const res = await wishlistApi.toggle(product.id);
      notify.success(res.message);
    } catch (err) {
      notify.error(err.response?.data?.message || 'Lỗi cập nhật yêu thích');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await reviewApi.create({
        productId: product.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviews([res.data, ...reviews]);
      setReviewForm({ rating: 5, comment: '' });
      notify.success('Cảm ơn bạn đã gửi đánh giá!');
    } catch (err) {
      notify.error(err.response?.data?.message || 'Không thể gửi đánh giá');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: 3D Interactive Studio Viewer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-lime-400 flex items-center gap-1.5">
              <Rotate3d className="w-4 h-4" />
              {studio3dMode ? 'Chế độ buồng xoay 3D đang bật (Di chuột lên ảnh)' : 'Chế độ ảnh 2D'}
            </span>
            <button
              type="button"
              onClick={() => {
                setStudio3dMode(!studio3dMode);
                setRotation({ x: 0, y: 0, zoom: 1 });
              }}
              className="px-3 py-1 rounded-xl bg-zinc-900 border border-white/15 text-xs font-bold text-lime-400 hover:bg-lime-400 hover:text-zinc-950 transition"
            >
              {studio3dMode ? 'Tắt 3D Tilt' : 'Bật 3D Studio'}
            </button>
          </div>

          <div
            onMouseMove={(e) => {
              if (!studio3dMode) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -18;
              const y = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 18;
              setRotation({ x, y, zoom: 1.04 });
            }}
            onMouseLeave={() => setRotation({ x: 0, y: 0, zoom: 1 })}
            className="perspective-1400"
          >
            <div
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${rotation.zoom})`,
                transition: 'transform 120ms ease-out',
              }}
              className="preserve-3d relative aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 border border-white/15 shadow-2xl neon-border-glow"
            >
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover translate-z-20"
              />
              <div className="absolute bottom-4 left-4 glass-panel px-3.5 py-1.5 rounded-xl text-[11px] font-mono text-zinc-200 translate-z-30">
                SKU: {matchedVariant?.sku || 'N/A'} • {selectedColor} / {selectedSize}
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImage(img.imageUrl)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                    activeImage === img.imageUrl
                      ? 'border-lime-400 scale-105'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Variant Selector */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-lime-400">
              {product.category?.name || 'CALEM STUDIO'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 pt-1">
              <RatingStar rating={product.ratingAvg} count={product.ratingCount} />
              <span className="text-xs text-zinc-400">Đã bán {product.soldCount}</span>
            </div>
          </div>

          <PriceTag
            basePrice={product.basePrice}
            salePrice={matchedVariant?.price || product.salePrice}
            size="lg"
          />

          <p className="text-sm text-zinc-300 leading-relaxed border-y border-white/10 py-4">
            {product.description}
          </p>

          <ProductVariantSelector
            variants={product.variants || []}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onSelectColor={handleColorSelect}
            onSelectSize={setSelectedSize}
          />

          {/* Stock & Quantity */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase text-zinc-400">Số lượng:</span>
              <div className="flex items-center rounded-2xl bg-zinc-900 border border-white/15">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-sm font-bold text-zinc-300 hover:text-white"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(matchedVariant?.stockQuantity || 1, q + 1))
                  }
                  className="px-3.5 py-2 text-sm font-bold text-zinc-300 hover:text-white"
                >
                  +
                </button>
              </div>
            </div>

            <span className="text-xs font-mono text-zinc-400">
              Tồn kho:{' '}
              <strong className="text-lime-400">{matchedVariant?.stockQuantity ?? 0}</strong> sản
              phẩm
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              size="lg"
              loading={adding}
              disabled={!matchedVariant || matchedVariant.stockQuantity <= 0}
              onClick={handleAddToCart}
              className="flex-1"
            >
              <ShoppingBag className="w-5 h-5" />
              {matchedVariant?.stockQuantity > 0 ? 'THÊM VÀO GIỎ HÀNG' : 'HẾT HÀNG'}
            </Button>

            <Button variant="secondary" size="lg" onClick={handleToggleWishlist}>
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-zinc-300">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-900/70 border border-white/10">
              <Truck className="w-4 h-4 text-lime-400 shrink-0" /> Freeship đơn từ 500.000đ
            </div>
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-zinc-900/70 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" /> Đổi trả tận nơi 14 ngày
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8">
        <h2 className="text-xl font-bold font-display text-white">
          Đánh giá từ khách hàng ({reviews.length})
        </h2>

        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="space-y-4 bg-zinc-900/60 p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-300">Chọn số sao:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                    reviewForm.rating === star
                      ? 'bg-lime-400 text-zinc-950 border-lime-400'
                      : 'bg-zinc-900 text-zinc-400 border-white/10'
                  }`}
                >
                  {star} ★
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              required
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Chia sẻ cảm nhận về chất vải, form áo của bạn..."
              className="w-full p-4 rounded-2xl bg-zinc-950 border border-white/10 text-sm text-white focus:border-lime-400 focus:outline-none"
            />
            <Button type="submit" size="sm" loading={submittingReview}>
              <Send className="w-4 h-4" /> Gửi đánh giá
            </Button>
          </form>
        )}

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-zinc-900/50 border border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-white">
                    {rev.user?.fullName || 'Khách hàng'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-lime-400">
                    <Check className="w-3 h-3" /> Đã xác thực
                  </span>
                </div>
                <span className="text-xs text-zinc-500">{formatDate(rev.createdAt, false)}</span>
              </div>
              <RatingStar rating={rev.rating} />
              <p className="text-sm text-zinc-300">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
