// client/src/pages/client/Checkout.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Truck,
  Tag,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Plus,
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { addressApi } from '../../services/addressApi';
import { couponApi } from '../../services/couponApi';
import { orderApi } from '../../services/orderApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { notify } from '../../components/feedback/Toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [note, setNote] = useState('');

  const [shippingForm, setShippingForm] = useState({
    recipientName: '',
    recipientPhone: '',
    shippingAddress: '',
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Modal tạo địa chỉ mới
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    recipientPhone: '',
    province: '',
    district: '',
    ward: '',
    streetAddress: '',
    isDefault: true,
  });

  const [submitting, setSubmitting] = useState(false);

  const items = cart?.items || [];
  const subtotal = cart?.subtotalAmount || 0;
  const shippingFee = subtotal >= 500000 || subtotal === 0 ? 0 : 30000;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const loadAddresses = async () => {
    try {
      const res = await addressApi.getAll();
      const list = res.data || [];
      setAddresses(list);
      const defaultAddr = list.find((a) => a.isDefault) || list[0];
      if (defaultAddr) {
        selectAddress(defaultAddr);
      }
    } catch {
      // Ignore silent address load error
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const selectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setShippingForm({
      recipientName: addr.recipientName,
      recipientPhone: addr.recipientPhone,
      shippingAddress: `${addr.streetAddress}, ${addr.ward}, ${addr.district}, ${addr.province}`,
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await couponApi.apply({
        code: couponCode.trim().toUpperCase(),
        subtotalAmount: subtotal,
      });
      setAppliedCoupon(res.data);
      notify.success(`Áp mã thành công! Giảm ${formatCurrency(res.data.discountAmount)}`);
    } catch (error) {
      setAppliedCoupon(null);
      notify.error(error.response?.data?.message || 'Không thể áp dụng mã giảm giá này');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleCreateQuickAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressApi.create(newAddress);
      const created = res.data;
      notify.success('Đã thêm địa chỉ giao hàng mới!');
      setIsAddressModalOpen(false);
      await loadAddresses();
      selectAddress(created);
    } catch (error) {
      notify.error(error.response?.data?.message || 'Vui lòng điền đầy đủ thông tin địa chỉ');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      notify.info('Giỏ hàng của bạn đang trống!');
      return;
    }

    if (
      !shippingForm.recipientName.trim() ||
      !shippingForm.recipientPhone.trim() ||
      !shippingForm.shippingAddress.trim()
    ) {
      notify.error('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        recipientName: shippingForm.recipientName.trim(),
        recipientPhone: shippingForm.recipientPhone.trim(),
        shippingAddress: shippingForm.shippingAddress.trim(),
        paymentMethod,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        note: note.trim() || undefined,
      };

      const res = await orderApi.create(payload);
      const { order, payUrl } = res.data;

      await fetchCart();

      if (paymentMethod === 'MOMO' && payUrl) {
        notify.info('Đang chuyển hướng sang cổng thanh toán MoMo Sandbox...');
        window.location.href = payUrl;
        return;
      }

      notify.success(`Đặt hàng thành công! Mã đơn: ${order.orderCode}`);
      navigate(ROUTES.ORDERS);
    } catch (error) {
      notify.error(error.response?.data?.message || 'Đã xảy ra lỗi khi tạo đơn hàng');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-white mb-4">
          CHƯA CÓ SẢN PHẨM ĐỂ THANH TOÁN
        </h2>
        <p className="text-zinc-400 mb-6">
          Hãy thêm các thiết kế yêu thích vào giỏ hàng trước khi tiến hành thanh toán.
        </p>
        <Link to={ROUTES.PRODUCTS}>
          <Button>QUAY LẠI SHOWROOM</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to={ROUTES.CART}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-lime-400 mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> QUAY LẠI GIỎ HÀNG
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
          THANH TOÁN ĐƠN HÀNG
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Saved addresses */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-lime-400" />
                <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                  1. ĐỊA CHỈ GIAO HÀNG
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-400 hover:underline"
              >
                <Plus className="w-4 h-4" /> Thêm sổ địa chỉ
              </button>
            </div>

            {addresses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => selectAddress(addr)}
                      className={`text-left p-3.5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-lime-400/10 border-lime-400'
                          : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white">{addr.recipientName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-lime-400/20 text-lime-400">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 font-mono mb-1">{addr.recipientPhone}</p>
                      <p className="text-xs text-zinc-300 line-clamp-2">
                        {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Họ tên người nhận"
                  value={shippingForm.recipientName}
                  onChange={(e) =>
                    setShippingForm({ ...shippingForm, recipientName: e.target.value })
                  }
                  placeholder="Nguyễn Văn A"
                  required
                />
                <Input
                  label="Số điện thoại"
                  value={shippingForm.recipientPhone}
                  onChange={(e) =>
                    setShippingForm({ ...shippingForm, recipientPhone: e.target.value })
                  }
                  placeholder="0901234567"
                  required
                />
              </div>
              <Input
                label="Địa chỉ nhận hàng chi tiết"
                value={shippingForm.shippingAddress}
                onChange={(e) =>
                  setShippingForm({ ...shippingForm, shippingAddress: e.target.value })
                }
                placeholder="Số nhà, đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                required
              />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Ghi chú giao hàng (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Giao giờ hành chính, gọi trước khi giao..."
                  className="w-full rounded-xl bg-zinc-900/90 border border-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400"
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-2.5 mb-5">
              <CreditCard className="w-5 h-5 text-lime-400" />
              <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                2. PHƯƠNG THỨC THANH TOÁN
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  paymentMethod === 'COD'
                    ? 'bg-lime-400/10 border-lime-400'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-lime-400" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Thanh toán khi nhận hàng (COD)</div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Kiểm tra sản phẩm và thanh toán tiền mặt trực tiếp cho shipper.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('MOMO')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  paymentMethod === 'MOMO'
                    ? 'bg-pink-500/15 border-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.3)]'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center shrink-0 font-display font-black text-white text-xs">
                  MoMo
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Ví điện tử MoMo Sandbox</div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Quét mã QR hoặc thẻ ATM nội địa. Xác thực chữ ký HMAC SHA256 tức thì.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Summary & Coupon */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 sticky top-28 space-y-6">
            <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
              ĐƠN HÀNG ({items.length} SẢN PHẨM)
            </h3>

            <div className="max-h-72 overflow-y-auto pr-2 space-y-3 divide-y divide-white/5">
              {items.map((item) => {
                const product = item.variant?.product;
                const thumb = product?.images?.[0]?.imageUrl;
                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                    <img
                      src={
                        thumb ||
                        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80'
                      }
                      alt={product?.name}
                      className="w-14 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{product?.name}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Size: {item.variant?.size} | Màu: {item.variant?.color} | SL: x
                        {item.quantity}
                      </p>
                      <p className="text-xs font-bold text-lime-400 mt-1">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon Input */}
            <div className="pt-4 border-t border-white/10">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Mã giảm giá (Thử: CALEM10 hoặc CHAOBAN50K)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã voucher..."
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-2.5 text-xs font-mono uppercase text-white focus:outline-none focus:border-lime-400"
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  loading={applyingCoupon}
                  onClick={handleApplyCoupon}
                >
                  Áp dụng
                </Button>
              </div>
              {appliedCoupon && (
                <div className="mt-2.5 flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-emerald-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Đã áp mã <strong>{appliedCoupon.code}</strong> (-
                    {formatCurrency(appliedCoupon.discountAmount)})
                  </span>
                  <button
                    type="button"
                    onClick={() => setAppliedCoupon(null)}
                    className="text-zinc-400 hover:text-white underline text-[11px]"
                  >
                    Gỡ
                  </button>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Tạm tính</span>
                <span className="text-white font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Phí vận chuyển</span>
                <span className="text-white font-semibold">
                  {shippingFee === 0 ? 'MIỄN PHÍ' : formatCurrency(shippingFee)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Giảm giá voucher</span>
                  <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
                <span className="font-display font-bold text-white">TỔNG THANH TOÁN</span>
                <span className="font-display text-2xl font-black text-lime-400">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              <Sparkles className="w-4 h-4" />
              {paymentMethod === 'MOMO' ? 'THANH TOÁN QUA MOMO' : 'XÁC NHẬN ĐẶT HÀNG COD'}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Đảm bảo tồn kho thời gian thực bằng MySQL Row-Level Transaction Lock
            </div>
          </div>
        </div>
      </form>

      {/* Modal thêm nhanh địa chỉ vào sổ địa chỉ */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Thêm địa chỉ giao hàng mới"
      >
        <form onSubmit={handleCreateQuickAddress} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Họ tên người nhận"
              value={newAddress.recipientName}
              onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
              required
            />
            <Input
              label="Số điện thoại"
              value={newAddress.recipientPhone}
              onChange={(e) => setNewAddress({ ...newAddress, recipientPhone: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Tỉnh / Thành phố"
              value={newAddress.province}
              onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
              placeholder="TP. Hồ Chí Minh"
              required
            />
            <Input
              label="Quận / Huyện"
              value={newAddress.district}
              onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
              placeholder="Quận 1"
              required
            />
            <Input
              label="Phường / Xã"
              value={newAddress.ward}
              onChange={(e) => setNewAddress({ ...newAddress, ward: e.target.value })}
              placeholder="Phường Bến Nghé"
              required
            />
          </div>
          <Input
            label="Số nhà, tên đường"
            value={newAddress.streetAddress}
            onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
            placeholder="123 Nguyễn Huệ"
            required
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="ghost" onClick={() => setIsAddressModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu địa chỉ</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Checkout;
