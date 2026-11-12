// client/src/pages/admin/OrderManager.jsx
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { ORDER_STATUS_LABELS, ORDER_STATUS_BADGE } from '../../constants/orderStatus';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Pagination from '../../components/common/Pagination';
import { notify } from '../../components/feedback/Toast';

const NEXT_TRANSITIONS = {
  pending_payment: ['pending_confirmation', 'cancelled'],
  pending_confirmation: ['shipping', 'cancelled'],
  shipping: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders({
        page,
        limit: 12,
        status: statusFilter || undefined,
        q: search || undefined,
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
    fetchOrders(1);
  }, [statusFilter]);

  const handleStatusChange = async (orderId, nextStatus) => {
    if (!nextStatus) return;
    try {
      await adminApi.updateOrderStatus(orderId, { orderStatus: nextStatus });
      notify.success(`Đã chuyển trạng thái sang: ${ORDER_STATUS_LABELS[nextStatus]}`);
      fetchOrders(meta.page);
    } catch (err) {
      notify.error(err.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Quản Lý Đơn Hàng</h1>
          <p className="text-xs text-zinc-400">
            Cập nhật luồng trạng thái: Chờ xác nhận → Đang giao → Hoàn thành / Đã hủy
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrders(1)}
              placeholder="Mã đơn, tên, SĐT..."
              className="pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono uppercase text-zinc-400 bg-zinc-900/50">
                <th className="py-3.5 px-4">Mã đơn</th>
                <th className="py-3.5 px-4">Khách hàng</th>
                <th className="py-3.5 px-4">Thanh toán</th>
                <th className="py-3.5 px-4">Tổng tiền</th>
                <th className="py-3.5 px-4">Trạng thái hiện tại</th>
                <th className="py-3.5 px-4 text-right">Cập nhật trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : (
                orders.map((ord) => {
                  const allowedNext = NEXT_TRANSITIONS[ord.orderStatus] || [];
                  return (
                    <tr key={ord.id} className="hover:bg-white/5">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-white">#{ord.orderCode}</span>
                        <p className="text-[11px] text-zinc-500">{formatDate(ord.createdAt)}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white text-xs">{ord.recipientName}</p>
                        <p className="text-xs text-zinc-400 font-mono">{ord.recipientPhone}</p>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="font-mono text-zinc-200">{ord.paymentMethod}</span>
                        <span className="block text-[11px] text-zinc-400">{ord.paymentStatus}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-lime-400">
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            ORDER_STATUS_BADGE[ord.orderStatus] || 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {ORDER_STATUS_LABELS[ord.orderStatus]}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {allowedNext.length === 0 ? (
                          <span className="text-xs text-zinc-500">Đã đóng</span>
                        ) : (
                          <select
                            defaultValue=""
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-lime-400/40 text-xs font-bold text-lime-300"
                          >
                            <option value="" disabled>
                              Chuyển sang...
                            </option>
                            {allowedNext.map((st) => (
                              <option key={st} value={st}>
                                {ORDER_STATUS_LABELS[st]}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(p) => fetchOrders(p)}
      />
    </div>
  );
};

export default OrderManager;
