// client/src/layouts/AdminLayout.jsx
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Layers,
  TicketPercent,
  Image,
  ShoppingCart,
  Users,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const navItems = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: ROUTES.ADMIN_PRODUCTS, label: 'Sản phẩm & Biến thể', icon: Box },
  { to: ROUTES.ADMIN_CATEGORIES, label: 'Danh mục', icon: Layers },
  { to: ROUTES.ADMIN_ORDERS, label: 'Đơn hàng', icon: ShoppingCart },
  { to: ROUTES.ADMIN_COUPONS, label: 'Mã giảm giá', icon: TicketPercent },
  { to: ROUTES.ADMIN_BANNERS, label: 'Banner 3D', icon: Image },
  { to: ROUTES.ADMIN_CUSTOMERS, label: 'Khách hàng', icon: Users },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-zinc-900/90 border-r border-white/10 flex flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-2.5 px-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-lime-400 text-zinc-950 flex items-center justify-center font-black font-display">
              C
            </div>
            <div>
              <span className="font-display font-bold text-white block leading-none">
                CALEM ADMIN
              </span>
              <span className="text-[10px] font-mono text-lime-400">CONTROL CENTER</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-lime-400 text-zinc-950 shadow-[0_0_20px_-4px_rgba(163,230,53,0.5)]'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-zinc-300 hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 text-lime-400" /> Về trang Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
          >
            <LogOut className="w-4 h-4" /> Đăng xuất ({user?.fullName})
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md px-8 flex items-center justify-between">
          <h1 className="text-sm font-mono uppercase tracking-wider text-zinc-400">
            Hệ thống quản trị thương mại điện tử CALEM.CLUB
          </h1>
          <div className="text-xs text-zinc-300">
            Xin chào, <strong className="text-lime-400">{user?.fullName}</strong>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
