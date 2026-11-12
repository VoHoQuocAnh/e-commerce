// client/src/pages/auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { notify } from '../../components/feedback/Toast';
import { ROUTES } from '../../constants/routes';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      notify.success('Tạo tài khoản thành công!');
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký không thành công');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-white">Tạo tài khoản mới</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Gia nhập cộng đồng Streetwear 3D tại CALEM.CLUB
        </p>
      </div>

      <Alert type="error" message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Họ và tên"
          required
          placeholder="Nguyễn Văn A"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Số điện thoại"
          placeholder="0901234567"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          label="Mật khẩu (tối thiểu 6 ký tự)"
          type="password"
          required
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button type="submit" loading={submitting} className="w-full" size="lg">
          Đăng ký thành viên
        </Button>
      </form>

      <p className="text-center text-xs text-zinc-400">
        Đã có tài khoản?{' '}
        <Link to={ROUTES.LOGIN} className="text-lime-400 font-bold hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
};

export default Register;
