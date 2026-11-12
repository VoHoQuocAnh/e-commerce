// client/src/pages/client/Profile.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Camera, MapPin, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../services/userApi';
import { ROUTES } from '../../constants/routes';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { notify } from '../../components/feedback/Toast';

const Profile = () => {
  const { user, updateUserState } = useAuth();

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [savingPwd, setSavingPwd] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append('fullName', profileForm.fullName);
      if (profileForm.phone) formData.append('phone', profileForm.phone);
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await userApi.updateMe(formData);
      updateUserState(res.data);
      notify.success('Đã cập nhật hồ sơ cá nhân!');
    } catch (error) {
      notify.error(error.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSavingPwd(true);
    try {
      await userApi.changePassword(pwdForm);
      setPwdForm({ currentPassword: '', newPassword: '' });
      notify.success('Đổi mật khẩu thành công!');
    } catch (error) {
      notify.error(error.response?.data?.message || 'Mật khẩu hiện tại không đúng');
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lime-400 block mb-1">
            // MEMBER STUDIO
          </span>
          <h1 className="font-display text-3xl font-black text-white">HỒ SƠ CÁ NHÂN</h1>
        </div>
        <div className="flex gap-3">
          <Link to={ROUTES.ADDRESSES}>
            <Button variant="secondary" size="sm">
              <MapPin className="w-4 h-4" /> Sổ địa chỉ
            </Button>
          </Link>
          <Link to={ROUTES.ORDERS}>
            <Button variant="secondary" size="sm">
              <Package className="w-4 h-4" /> Đơn hàng của tôi
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Info */}
        <form
          onSubmit={handleUpdateProfile}
          className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-white/10 space-y-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-lime-400" />
            <h2 className="font-display text-lg font-bold text-white uppercase">
              THÔNG TIN TÀI KHOẢN
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl bg-zinc-800 border border-white/15 overflow-hidden flex items-center justify-center font-display text-2xl font-black text-lime-400">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.fullName?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-semibold text-white cursor-pointer hover:border-lime-400">
                <Camera className="w-4 h-4 text-lime-400" />
                Chọn ảnh đại diện mới
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
              </label>
              {avatarFile && <p className="text-xs text-lime-400 mt-1">{avatarFile.name}</p>}
            </div>
          </div>

          <Input label="Địa chỉ Email" value={user?.email || ''} disabled />
          <Input
            label="Họ và tên"
            value={profileForm.fullName}
            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
            required
          />
          <Input
            label="Số điện thoại"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            placeholder="0901234567"
          />

          <Button type="submit" loading={savingProfile}>
            Lưu thay đổi
          </Button>
        </form>

        {/* Change Password */}
        <form
          onSubmit={handleChangePassword}
          className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-white/10 space-y-5 h-fit"
        >
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-5 h-5 text-lime-400" />
            <h2 className="font-display text-lg font-bold text-white uppercase">ĐỔI MẬT KHẨU</h2>
          </div>

          <Input
            label="Mật khẩu hiện tại"
            type="password"
            value={pwdForm.currentPassword}
            onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
            required
          />
          <Input
            label="Mật khẩu mới (Tối thiểu 6 ký tự)"
            type="password"
            value={pwdForm.newPassword}
            onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
            required
          />

          <Button type="submit" variant="secondary" className="w-full" loading={savingPwd}>
            Cập nhật mật khẩu
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
