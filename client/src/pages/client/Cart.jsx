// client/src/pages/client/Cart.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import Button from '../../components/common/Button';
import EmptyState from '../../components/feedback/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import { notify } from '../../components/feedback/Toast';
import { ROUTES } from '../../constants/routes';

const FREE_SHIP_THRESHOLD = 500000;

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <EmptyState
        title="Túi đồ 3D của bạn đang trống"
        description="Hãy khám phá các thiết kế Áo Thun Boxy, Hoodie và Cargo mới nhất tại Studio."
        action={
          <Link to={ROUTES.PRODUCTS}>
            <Button>Khám phá bộ sưu tập</Button>
          </Link>
        }
      />
    );
  }

  const shippingFee = cart.subtotalAmount >= FREE_SHIP_THRESHOLD ? 0 : 30000;
  const progress = Math.min(100, Math.round((cart.subtotalAmount / FREE_SHIP_THRESHOLD) * 100));

  const handleQtyChange = async (itemId, nextQty) => {
    if (nextQty < 1) return;
    try {
      await updateQuantity(itemId, nextQty);
    } catch (err) {
      notify.error(err.response?.data?.message || 'Không thể cập nhật số lượng');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-lime-400 uppercase">// YOUR BAG</span>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Giỏ Hàng Của Bạn ({cart.totalQuantity} sản phẩm)
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Làm trống giỏ
        </Button>
      </div>

      {/* Free Shipping Progress */}
      <div className="glass-panel rounded-2xl p-4 border border-lime-400/30">
        <div className="flex justify-between text-xs mb-2">
          {shippingFee === 0 ? (
            <span className="text-lime-400 font-bold">
              ★ Đơn hàng của bạn đã đủ điều kiện MIỄN PHÍ VẬN CHUYỂN!
            </span>
          ) : (
            <span className="text-zinc-300">
              Mua thêm{' '}
              <strong className="text-lime-400">
                {formatCurrency(FREE_SHIP_THRESHOLD - cart.subtotalAmount)}
              </strong>{' '}
              để được Miễn phí vận chuyển
            </span>
          )}
          <span className="font-mono text-lime-400">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-lime-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => {
            const product = item.variant?.product;
            const thumb = product?.images?.[0]?.imageUrl;
            return (
              <div
                key={item.id}
                className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={thumb}
                    alt={product?.name}
                    className="w-20 h-24 rounded-2xl object-cover bg-zinc-900 border border-white/10"
                  />
                  <div className="space-y-1">
                    <Link
                      to={`/products/${product?.slug}`}
                      className="font-bold text-white hover:text-lime-400 transition"
                    >
                      {product?.name}
                    </Link>
                    <p className="text-xs text-zinc-400 font-mono">
                      Màu: {item.variant?.color} | Size: {item.variant?.size}
                    </p>
                    <p className="text-sm font-bold text-lime-400">
                      {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="flex items-center rounded-xl bg-zinc-900 border border-white/15">
                    <button
                      onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-sm font-bold text-zinc-300 hover:text-white"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-sm font-bold text-zinc-300 hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <span className="font-extrabold text-white text-sm">
                      {formatCurrency(item.lineTotal)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4">
          <div className="glass-panel rounded-3xl p-6 space-y-5 sticky top-24">
            <h3 className="text-lg font-bold font-display text-white">Tóm tắt đơn hàng</h3>
            <div className="space-y-3 text-sm border-b border-white/10 pb-4">
              <div className="flex justify-between text-zinc-400">
                <span>Tạm tính</span>
                <span className="text-white font-semibold">
                  {formatCurrency(cart.subtotalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Phí vận chuyển dự kiến</span>
                <span className="text-white font-semibold">
                  {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Tổng cộng</span>
              <span className="text-2xl font-black font-display text-lime-400">
                {formatCurrency(cart.subtotalAmount + shippingFee)}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate(ROUTES.CHECKOUT)}
            >
              TIẾN HÀNH THANH TOÁN <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
