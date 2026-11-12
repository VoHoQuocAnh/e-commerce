// client/src/pages/client/OrderHistory.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, XCircle, CreditCard } from 'lucide-react';
import { orderApi } from '../../services/orderApi';
import { paymentApi } from '../../services/paymentApi';
import { ORDER_STATUS_LABELS, ORDER_STATUS_BADGE } from '../../constants/orderStatus';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/feedback/EmptyState';
import { notify } from '../../components/feedback/Toast';
import { ROUTES } from '../../constants/routes';

const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'pending_payment', label: 'Chờ thanh toán MoMo' },
  { key: 'pending_confirmation', label: 'Chờ xác nhận' },
  { key: 'shipping', label: 'Đang giao hàng' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingCode, setCancellingCode] = useState(null);

  const fetchOrders = async (page = 1, status = statusFilter) => {
    setLoading(true);
    try {
      const res = await orderApi.getMyOrders({
        page,
        limit: 8,
        status: status || undefined,
      });
      setOrders(res.data || []);
      setMeta(res.meta || { page: 1, totalPages: 1 });
    } catch {
      notify.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, statusFilter);
  }, [statusFilter]);

  const handleCancelOrder = async (orderCode) => {
    setCancellingCode(orderCode);
    try {
      await orderApi.cancelOrder(orderCode, 'Khách hàng chủ động hủy đơn');
      notify.success('Đã hủy đơn hàng và hoàn lại tồn kho thành công!');
      setSelectedOrder(null);
      fetchOrders(meta.page, statusFilter);
    } catch (error) {
      notify.error(error.response?.data?.message || 'Không thể hủy đơn hàng này');
    } finally {
      setCancellingCode(null);
    }
  };

  const handleRetryMomo = async (orderId) => {
    try {
      const res = await paymentApi.createMomoPayment(orderId);
      if (res.data?.payUrl) {
        window.location.href = res.data.payUrl;
      }
    } catch (error) {
      notify.error(error.response?.data?.message || 'Không thể tạo lại link thanh toán MoMo');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-lime-400 block mb-1">
          // ORDER TRACKING
        </span>
        <h1 className="font-display text-3xl font-black text-white">LỊCH SỬ ĐƠN HÀNG</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === tab.key
                ? 'bg-lime-400 text-zinc-950'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-36 rounded-2xl bg-zinc-900/70 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="Chưa có đơn hàng nào"
          description="Bạn chưa có đơn hàng nào ở trạng thái này. Hãy khám phá bộ sưu tập mới nhất của CALEM.CLUB!"
          action={
            <Link to={ROUTES.PRODUCTS}>
              <Button>MUA SẮM NGAY</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const canCancel = ['pending_payment', 'pending_confirmation'].includes(
              order.orderStatus
            );
            return (
              <div
                key={order.id}
                className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white text-sm">
                        #{order.orderCode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          ORDER_STATUS_BADGE[order.orderStatus] || 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      Đặt lúc: {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block">Tổng thanh toán</span>
                    <span className="font-display text-lg font-black text-lime-400">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Snapshot items */}
                <div className="py-4 space-y-3">
                  {order.items?.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        {item.thumbnailUrl && (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.productName}
                            className="w-12 h-14 rounded-lg object-cover border border-white/10"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-white text-xs sm:text-sm">
                            {item.productName}
                          </p>
                          <p className="text-xs text-zinc-400">
                            Size: {item.size} | Màu: {item.color} | x{item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-zinc-200">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-xs text-zinc-500">
                      + {order.items.length - 2} sản phẩm khác...
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-zinc-400">
                    Người nhận: <strong className="text-zinc-200">{order.recipientName}</strong> (
                    {order.recipientPhone})
                  </div>
                  <div className="flex items-center gap-2.5">
                    {order.orderStatus === 'pending_payment' && order.paymentMethod === 'MOMO' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleRetryMomo(order.id)}
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Thanh toán MoMo
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-3.5 h-3.5" /> Chi tiết
                    </Button>
                    {canCancel && (
                      <Button
                        size="sm"
                        variant="danger"
                        loading={cancellingCode === order.orderCode}
                        onClick={() => handleCancelOrder(order.orderCode)}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Hủy đơn
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            onPageChange={(p) => fetchOrders(p, statusFilter)}
          />
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Chi tiết đơn hàng #${selectedOrder?.orderCode}`}
      >
        {selectedOrder && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/60 p-4 rounded-2xl border border-white/10">
              <div>
                <p className="text-xs text-zinc-500 uppercase">Thông tin người nhận</p>
                <p className="font-bold text-white mt-1">{selectedOrder.recipientName}</p>
                <p className="text-zinc-300 text-xs">{selectedOrder.recipientPhone}</p>
                <p className="text-zinc-400 text-xs mt-1">{selectedOrder.shippingAddress}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase">Trạng thái & Thanh toán</p>
                <p className="font-bold text-lime-400 mt-1">
                  {ORDER_STATUS_LABELS[selectedOrder.orderStatus]}
                </p>
                <p className="text-xs text-zinc-300 mt-1">
                  Phương thức: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                </p>
                {selectedOrder.cancelReason && (
                  <p className="text-xs text-red-400 mt-1">
                    Lý do hủy: {selectedOrder.cancelReason}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Danh sách sản phẩm (Snapshot tại thời điểm mua)
              </h4>
              {selectedOrder.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800"
                >
                  <div>
                    <p className="font-bold text-white">{item.productName}</p>
                    <p className="text-xs text-zinc-400">
                      SKU: {item.sku} | Size: {item.size} | Màu: {item.color}
                    </p>
                    <p className="text-xs text-zinc-400">
                      Đơn giá: {formatCurrency(item.unitPrice)} x {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-lime-400">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Tạm tính:</span>
                <span>{formatCurrency(selectedOrder.subtotalAmount)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Phí vận chuyển:</span>
                <span>{formatCurrency(selectedOrder.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Giảm giá:</span>
                <span>-{formatCurrency(selectedOrder.discountAmount)}</span>
              </div>
              <div className="flex justify-between font-display text-lg font-black text-white pt-2 border-t border-white/10">
                <span>Tổng cộng:</span>
                <span className="text-lime-400">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
