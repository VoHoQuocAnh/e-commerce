// client/src/layouts/MainLayout.jsx
import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  LogOut,
  ShieldCheck,
  Package,
  MapPin,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { ROUTES } from '../constants/routes';

const MainLayout = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 500, y: 300 });

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div
      onMouseMove={(e) => setSpotlight({ x: e.clientX, y: e.clientY })}
      className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 studio-grid-bg relative"
    >
      {/* 4D Interactive Ambient Cursor Aura */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at ${spotlight.x}px ${spotlight.y}px, rgba(163, 230, 53, 0.055), transparent 65%)`,
        }}
      />

      {/* Kinetic Marquee Ticker */}
      <div className="bg-lime-400 text-zinc-950 py-1.5 overflow-hidden border-b border-lime-500/40 relative z-30">
        <div className="flex whitespace-nowrap animate-marquee font-mono text-[11px] font-extrabold tracking-widest uppercase">
          <span className="mx-8">★ CALEM.CLUB // 3D INTERACTIVE STREETWEAR ARCHIVE</span>
          <span className="mx-8">★ MIỄN PHÍ VẬN CHUYỂN ĐƠN TỪ 500.000Đ</span>
          <span className="mx-8">★ NHẬP MÃ CALEM10 GIẢM NGAY 10%</span>
          <span className="mx-8">★ HEAVYWEIGHT 260GSM BOXY FIT & ACID WASH SERIES</span>
          <span className="mx-8">★ CALEM.CLUB // 3D INTERACTIVE STREETWEAR ARCHIVE</span>
          <span className="mx-8">★ MIỄN PHÍ VẬN CHUYỂN ĐƠN TỪ 500.000Đ</span>
        </div>
      </div>

      {/* Floating Glassmorphic Navbar */}
      <header className="sticky top-0 z-40 px-4 sm:px-8 pt-3">
        <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-2xl">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-lime-400 text-zinc-950 flex items-center justify-center font-black font-display text-lg group-hover:rotate-12 transition-transform">
              C
            </div>
            <div>
              <span className="font-display font-extrabold text-lg tracking-tight text-white">
                CALEM<span className="text-lime-400">.CLUB</span>
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-zinc-400 uppercase -mt-1">
                3D Concept Store
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
            <NavLink
              to={ROUTES.HOME}
              end
              className={({ isActive }) =>
                isActive ? 'text-lime-400' : 'text-zinc-300 hover:text-white transition'
              }
            >
              3D Runway
            </NavLink>
            <NavLink
              to={ROUTES.PRODUCTS}
              className={({ isActive }) =>
                isActive ? 'text-lime-400' : 'text-zinc-300 hover:text-white transition'
              }
            >
              Bộ Sưu Tập
            </NavLink>
            <Link
              to="/products?gender=men"
              className="text-zinc-300 hover:text-lime-400 transition"
            >
              Nam
            </Link>
            <Link
              to="/products?gender=women"
              className="text-zinc-300 hover:text-lime-400 transition"
            >
              Nữ
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400/15 border border-lime-400/40 text-lime-300 text-xs font-bold hover:bg-lime-400/25 transition"
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </Link>
            )}

            <Link
              to={ROUTES.WISHLIST}
              title="Yêu thích"
              className="p-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-300 hover:text-lime-400 hover:border-lime-400/40 transition"
            >
              <Heart className="w-4 h-4" />
            </Link>

            <Link
              to={ROUTES.CART}
              title="Giỏ hàng"
              className="relative p-2.5 rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-300 hover:text-lime-400 hover:border-lime-400/40 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-lime-400 text-zinc-950 text-[11px] font-extrabold flex items-center justify-center">
                  {cart.totalQuantity}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/90 border border-white/10 text-xs font-semibold text-zinc-200 hover:border-lime-400/40">
                  <User className="w-4 h-4 text-lime-400" />
                  <span className="hidden sm:inline max-w-[110px] truncate">{user?.fullName}</span>
                </button>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute right-0 mt-2 w-52 glass-panel rounded-2xl p-2 shadow-2xl border border-white/15">
                  <Link
                    to={ROUTES.PROFILE}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-200 hover:bg-white/10"
                  >
                    <User className="w-4 h-4 text-lime-400" /> Hồ sơ cá nhân
                  </Link>
                  <Link
                    to={ROUTES.ADDRESSES}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-200 hover:bg-white/10"
                  >
                    <MapPin className="w-4 h-4 text-lime-400" /> Sổ địa chỉ
                  </Link>
                  <Link
                    to={ROUTES.ORDERS}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-200 hover:bg-white/10"
                  >
                    <Package className="w-4 h-4 text-lime-400" /> Đơn hàng của tôi
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 mt-1 border-t border-white/10"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="px-4 py-2 rounded-xl bg-lime-400 text-zinc-950 text-xs font-extrabold hover:bg-lime-300 transition"
              >
                Đăng nhập
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 glass-panel rounded-2xl p-4 flex flex-col gap-3 text-sm font-semibold">
            <Link to={ROUTES.HOME} onClick={() => setMobileMenuOpen(false)}>
              3D Runway
            </Link>
            <Link to={ROUTES.PRODUCTS} onClick={() => setMobileMenuOpen(false)}>
              Tất cả sản phẩm
            </Link>
            <Link to="/products?gender=men" onClick={() => setMobileMenuOpen(false)}>
              Thời trang Nam
            </Link>
            <Link to="/products?gender=women" onClick={() => setMobileMenuOpen(false)}>
              Thời trang Nữ
            </Link>
            {isAdmin && (
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lime-400"
              >
                Quản trị hệ thống
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lime-400" />
              <span className="font-display font-extrabold text-lg text-white">
                CALEM<span className="text-lime-400">.CLUB</span>
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Thương hiệu Streetwear Việt Nam tiên phong trải nghiệm mua sắm không gian 3D/4D tương
              tác trực quan. Chất liệu Cotton 260GSM & Heavyweight Fleece.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Danh mục nổi bật
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link to="/products?category=ao-thun-boxy-tees" className="hover:text-lime-400">
                  Áo Thun Boxy 260GSM
                </Link>
              </li>
              <li>
                <Link to="/products?category=ao-khoac-hoodie" className="hover:text-lime-400">
                  Acid Wash Zip Hoodie
                </Link>
              </li>
              <li>
                <Link to="/products?category=quan-dai-cargo" className="hover:text-lime-400">
                  Parachute Baggy Cargo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Chính sách dịch vụ
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>Đổi trả miễn phí trong 14 ngày</li>
              <li>Thanh toán an toàn qua MoMo & COD</li>
              <li>Cam kết chính hãng 100%</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Flagship Studio
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              125 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
              <br />
              Hotline: 1900 6868 — support@calemstudio.vn
            </p>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} CALEM.CLUB STUDIO. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
