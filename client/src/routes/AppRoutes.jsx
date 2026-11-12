// client/src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import Home from '../pages/client/Home';
import ProductCatalog from '../pages/client/ProductCatalog';
import ProductDetail from '../pages/client/ProductDetail';
import Cart from '../pages/client/Cart';
import Checkout from '../pages/client/Checkout';
import PaymentResult from '../pages/client/PaymentResult';
import OrderHistory from '../pages/client/OrderHistory';
import Profile from '../pages/client/Profile';
import AddressBook from '../pages/client/AddressBook';
import Wishlist from '../pages/client/Wishlist';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import Dashboard from '../pages/admin/Dashboard';
import ProductManager from '../pages/admin/ProductManager';
import CategoryManager from '../pages/admin/CategoryManager';
import CouponManager from '../pages/admin/CouponManager';
import BannerManager from '../pages/admin/BannerManager';
import OrderManager from '../pages/admin/OrderManager';
import CustomerManager from '../pages/admin/CustomerManager';

import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Public & Protected Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/payment-result" element={<PaymentResult />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addresses" element={<AddressBook />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="coupons" element={<CouponManager />} />
          <Route path="banners" element={<BannerManager />} />
          <Route path="orders" element={<OrderManager />} />
          <Route path="customers" element={<CustomerManager />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
