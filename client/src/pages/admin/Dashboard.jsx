// client/src/pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Boxes,
  Award,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { ORDER_STATUS_LABELS, ORDER_STATUS_BADGE } from '../../constants/orderStatus';
import Loader from '../../components/common/Loader';
import { notify } from '../../components/feedback/Toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartMode, setChartMode] = useState('daily'); // 'daily' | 'monthly'

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getDashboardStats();
        setStats(res.data);
      } catch {
        notify.error('Không thể tải dữ liệu thống kê Dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Loader text="ĐANG TẢI DỮ LIỆU THỐNG KÊ STUDIO..." />;

  const summary = stats?.summary || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  };

  const chartData =
    chartMode === 'daily'
      ? (stats?.dailyRevenue || []).map((d) => ({
          label: d.date,
          revenue: d.revenue,
          orders: d.orders,
        }))
      : (stats?.monthlyRevenue || []).map((m) => ({
          label: m.month,
          revenue: m.revenue,
          orders: m.orders,
        }));

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          {
            label: 'Tổng doanh thu hoàn thành',
            value: formatCurrency(summary.totalRevenue),
            icon: TrendingUp,
            accent: 'text-lime-400 bg-lime-400/15 border-lime-400/30',
          },
          {
            label: 'Tổng số đơn hàng',
            value: summary.totalOrders,
            icon: ShoppingBag,
            accent: 'text-sky-400 bg-sky-400/15 border-sky-400/30',
          },
          {
            label: 'Tổng khách hàng',
            value: summary.totalCustomers,
            icon: Users,
            accent: 'text-purple-400 bg-purple-400/15 border-purple-400/30',
          },
          {
            label: 'Tổng sản phẩm',
            value: summary.totalProducts,
            icon: Boxes,
            accent: 'text-amber-400 bg-amber-400/15 border-amber-400/30',
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="glass-panel rounded-3xl p-6 border border-white/10 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-mono uppercase text-zinc-400">{card.label}</p>
                <p className="text-2xl font-black font-display text-white mt-2">{card.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${card.accent}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart & Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Revenue Bar Chart */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-lime-400" />
              <h2 className="text-lg font-bold font-display text-white">
                Biểu Đồ Doanh Thu ({chartMode === 'daily' ? '30 Ngày Gần Nhất' : '12 Tháng'})
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setChartMode('daily')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  chartMode === 'daily'
                    ? 'bg-lime-400 text-zinc-950'
                    : 'bg-zinc-900 text-zinc-400 border border-white/10'
                }`}
              >
                Theo Ngày
              </button>
              <button
                onClick={() => setChartMode('monthly')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  chartMode === 'monthly'
                    ? 'bg-lime-400 text-zinc-950'
                    : 'bg-zinc-900 text-zinc-400 border border-white/10'
                }`}
              >
                Theo Tháng
              </button>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-zinc-500 text-sm">
              <Calendar className="w-8 h-8 mb-2 opacity-50" />
              Chưa có dữ liệu đơn hàng hoàn thành trong kỳ này
            </div>
          ) : (
            <div className="h-64 flex items-end gap-3 pt-8 pb-2 px-2 overflow-x-auto">
              {chartData.map((bar, idx) => {
                const heightPercent = Math.max(8, Math.round((bar.revenue / maxRevenue) * 100));
                return (
                  <div
                    key={idx}
                    className="flex-1 min-w-[48px] flex flex-col items-center gap-2 group h-full justify-end"
                  >
                    <span className="text-[10px] font-mono text-lime-400 opacity-0 group-hover:opacity-100 transition">
                      {formatCurrency(bar.revenue)}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-lime-500/40 to-lime-400 group-hover:from-lime-400 group-hover:to-lime-300 transition-all shadow-[0_0_20px_rgba(163,230,53,0.25)]"
                    />
                    <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[64px]">
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
          <h2 className="text-lg font-bold font-display text-white">Trạng Thái Đơn Hàng</h2>
          <div className="space-y-3">
            {(stats?.ordersByStatus || []).length === 0 ? (
              <p className="text-xs text-zinc-500">Chưa có đơn hàng nào</p>
            ) : (
              stats.ordersByStatus.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/70 border border-white/10"
                >
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      ORDER_STATUS_BADGE[row.orderStatus] || 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {ORDER_STATUS_LABELS[row.orderStatus] || row.orderStatus}
                  </span>
                  <span className="text-lg font-black font-display text-white">{row.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-lime-400" />
          <h2 className="text-lg font-bold font-display text-white">Top Sản Phẩm Bán Chạy</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono uppercase text-zinc-400">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Sản phẩm</th>
                <th className="py-3 px-4">Số lượng đã bán</th>
                <th className="py-3 px-4 text-right">Doanh thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(stats?.topProducts || []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-zinc-500 text-xs">
                    Chưa có dữ liệu sản phẩm bán chạy
                  </td>
                </tr>
              ) : (
                stats.topProducts.map((item, index) => (
                  <tr key={item.productId} className="hover:bg-white/5">
                    <td className="py-3.5 px-4 font-mono text-lime-400">#{index + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{item.productName}</td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300">{item.totalSold} chiếc</td>
                    <td className="py-3.5 px-4 text-right font-bold text-lime-400">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
