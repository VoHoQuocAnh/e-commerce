// client/src/pages/auth/ResetPassword.jsx
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { notify } from '../../components/feedback/Toast';
import { ROUTES } from '../../constants/routes';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword });
      notify.success('Đặt lại mật khẩu thành công, vui lòng đăng nhập!');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setError(err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-white">Thiết lập mật khẩu mới</h1>
        <p className="text-xs text-zinc-400 mt-1">Nhập mật khẩu mới cho tài khoản của bạn</p>
      </div>

      <Alert type="error" message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {!tokenFromUrl && (
          <Input
            label="Mã Token khôi phục"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        )}
        <Input
          label="Mật khẩu mới"
          type="password"
          required
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button type="submit" loading={loading} className="w-full">
          Xác nhận mật khẩu mới
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
