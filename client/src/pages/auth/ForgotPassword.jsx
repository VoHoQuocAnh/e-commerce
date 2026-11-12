// client/src/pages/auth/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { ROUTES } from '../../constants/routes';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '', devToken: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '', devToken: '' });
    try {
      const res = await authApi.forgotPassword(email);
      setStatus({
        type: 'success',
        message: res.message,
        devToken: res.data?.devResetToken || '',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Không thể gửi yêu cầu',
        devToken: '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-white">Khôi phục mật khẩu</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Nhập email đăng ký để nhận liên kết thiết lập mật khẩu mới
        </p>
      </div>

      <Alert type={status.type || 'info'} message={status.message} />

      {status.devToken && (
        <div className="p-3.5 rounded-2xl bg-lime-400/10 border border-lime-400/30 text-xs space-y-2">
          <p className="font-mono text-lime-300">Chế độ Dev — Nhấn trực tiếp để đặt lại mật khẩu:</p>
          <Link
            to={`${ROUTES.RESET_PASSWORD}?token=${status.devToken}`}
            className="inline-block font-bold text-white underline"
          >
            Mở trang đặt lại mật khẩu
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email tài khoản"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" loading={loading} className="w-full">
          Gửi liên kết khôi phục
        </Button>
      </form>

      <p className="text-center text-xs text-zinc-400">
        Nhớ mật khẩu?{' '}
        <Link to={ROUTES.LOGIN} className="text-lime-400 font-bold hover:underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
