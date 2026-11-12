// client/src/pages/admin/CustomerManager.jsx
import { useEffect, useState } from 'react';
import { Shield, UserCheck, UserX } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { formatDate } from '../../utils/formatDate';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { notify } from '../../components/feedback/Toast';

const CustomerManager = () => {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, limit: 15 });
      setUsers(res.data || []);
      setMeta(res.meta || { page: 1, totalPages: 1 });
    } catch {
      notify.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleToggleRole = async (u) => {
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    try {
      await adminApi.updateUserRoleOrStatus(u.id, { role: nextRole });
      notify.success(`Đã đổi quyền của ${u.fullName} thành ${nextRole.toUpperCase()}`);
      fetchUsers(meta.page);
    } catch (err) {
      notify.error(err.response?.data?.message || 'Cập nhật quyền thất bại');
    }
  };

  const handleToggleActive = async (u) => {
    try {
      await adminApi.updateUserRoleOrStatus(u.id, { isActive: !u.isActive });
      notify.success(`Đã cập nhật trạng thái tài khoản ${u.email}`);
      fetchUsers(meta.page);
    } catch (err) {
      notify.error(err.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black font-display text-white">Quản Lý Người Dùng & Phân Quyền</h1>
        <p className="text-xs text-zinc-400">Quản lý tài khoản khách hàng và cấp quyền Admin</p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono uppercase text-zinc-400 bg-zinc-900/50">
                <th className="py-3.5 px-4">Thành viên</th>
                <th className="py-3.5 px-4">Số điện thoại</th>
                <th className="py-3.5 px-4">Vai trò</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Ngày tham gia</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{u.fullName}</p>
                      <p className="text-xs text-zinc-400 font-mono">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-zinc-300">
                      {u.phone || 'Chưa cập nhật'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-lime-400/20 text-lime-300 border border-lime-400/40'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          u.isActive
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-rose-500/15 text-rose-300'
                        }`}
                      >
                        {u.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-zinc-400">
                      {formatDate(u.createdAt, false)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => handleToggleRole(u)}>
                        <Shield className="w-3.5 h-3.5" /> Đổi Role
                      </Button>
                      <Button
                        size="sm"
                        variant={u.isActive ? 'danger' : 'primary'}
                        onClick={() => handleToggleActive(u)}
                      >
                        {u.isActive ? (
                          <UserX className="w-3.5 h-3.5" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(p) => fetchUsers(p)}
      />
    </div>
  );
};

export default CustomerManager;
