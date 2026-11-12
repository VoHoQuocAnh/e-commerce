// client/src/pages/auth/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { notify } from '../../components/feedback/Toast';
import { ROUTES } from '../../constants/routes';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.HOME;

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form);
      notify.success(`Chào mừng trở lại, ${user.fullName}!`);
      navigate(user.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (email, password) => {
    setForm({ email, password });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-white">Đăng nhập Studio</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Truy cập tài khoản CALEM.CLUB của bạn để tiếp tục mua sắm
        </p>
      </div>

      <Alert type="error" message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Mật khẩu"
          type="password"
          required
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div className="flex items-center justify-end">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs text-lime-400 hover:underline font-medium"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" loading={submitting} className="w-full" size="lg">
          Đăng nhập
        </Button>
      </form>

      {/* Quick Demo Accounts */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
          Tài khoản dùng thử nhanh (1-Click):
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => fillDemo('khachhang@calemstudio.vn', 'User@123')}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:border-lime-400 hover:text-lime-400 transition"
          >
            Khách hàng mẫu
          </button>
          <button
            type="button"
            onClick={() => fillDemo('admin@calemstudio.vn', 'Admin@123')}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:border-lime-400 hover:text-lime-400 transition"
          >
            Admin mẫu
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-zinc-400">
        Chưa có tài khoản?{' '}
        <Link to={ROUTES.REGISTER} className="text-lime-400 font-bold hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default Login;
