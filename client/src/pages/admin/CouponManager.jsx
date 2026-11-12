// client/src/pages/admin/CouponManager.jsx
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Ticket } from 'lucide-react';
import { couponApi } from '../../services/couponApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { notify } from '../../components/feedback/Toast';

const initialForm = {
  code: '',
  description: '',
  discountType: 'percent',
  discountValue: 10,
  minOrderAmount: 300000,
  maxDiscountAmount: 100000,
  usageLimit: 100,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  isActive: true,
};

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const loadCoupons = async () => {
    try {
      const res = await couponApi.getAllAdmin();
      setCoupons(res.data || []);
    } catch {
      notify.error('Không thể tải danh sách mã giảm giá');
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      description: c.description || '',
      discountType: c.discountType,
      discountValue: Number(c.discountValue),
      minOrderAmount: Number(c.minOrderAmount || 0),
      maxDiscountAmount: c.maxDiscountAmount ? Number(c.maxDiscountAmount) : '',
      usageLimit: Number(c.usageLimit),
      startDate: c.startDate ? new Date(c.startDate).toISOString().slice(0, 10) : '',
      endDate: c.endDate ? new Date(c.endDate).toISOString().slice(0, 10) : '',
      isActive: Boolean(c.isActive),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        code: form.code.toUpperCase(),
        maxDiscountAmount: form.maxDiscountAmount === '' ? null : Number(form.maxDiscountAmount),
      };
      if (editingId) {
        await couponApi.update(editingId, payload);
        notify.success('Đã cập nhật mã giảm giá!');
      } else {
        await couponApi.create(payload);
        notify.success('Đã tạo mã giảm giá mới!');
      }
      setModalOpen(false);
      loadCoupons();
    } catch (err) {
      notify.error(err.response?.data?.message || 'Lỗi lưu mã giảm giá');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await couponApi.remove(id);
      notify.info('Đã xóa mã giảm giá');
      loadCoupons();
    } catch {
      notify.error('Không thể xóa mã giảm giá');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Quản Lý Mã Giảm Giá</h1>
          <p className="text-xs text-zinc-400">Thiết lập chiến dịch Voucher theo % hoặc số tiền</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Tạo mã voucher
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center text-lime-400">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-lg font-black text-lime-400">{c.code}</span>
                  <p className="text-xs text-zinc-300">{c.description}</p>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  c.isActive ? 'bg-lime-400/15 text-lime-300' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {c.isActive ? 'Đang chạy' : 'Đã tắt'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 bg-zinc-900/60 p-3.5 rounded-2xl border border-white/5">
              <div>
                Mức giảm:{' '}
                <strong className="text-white">
                  {c.discountType === 'percent'
                    ? `${c.discountValue}%`
                    : formatCurrency(c.discountValue)}
                </strong>
              </div>
              <div>
                Đơn tối thiểu: <strong className="text-white">{formatCurrency(c.minOrderAmount)}</strong>
              </div>
              <div>
                Đã dùng:{' '}
                <strong className="text-lime-400">
                  {c.usedCount} / {c.usageLimit}
                </strong>
              </div>
              <div>
                Hết hạn: <strong className="text-white">{formatDate(c.endDate, false)}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => openEdit(c)}>
                <Edit3 className="w-3.5 h-3.5" /> Sửa
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}>
                <Trash2 className="w-3.5 h-3.5" /> Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Cập nhật Voucher' : 'Tạo mã giảm giá mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mã Code (In hoa)"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="CALEMVIP"
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Loại giảm giá
              </label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white"
              >
                <option value="percent">Theo phần trăm (%)</option>
                <option value="fixed">Số tiền cố định (VNĐ)</option>
              </select>
            </div>
          </div>

          <Input
            label="Mô tả ngắn"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Giá trị giảm"
              type="number"
              required
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
            />
            <Input
              label="Đơn tối thiểu"
              type="number"
              required
              value={form.minOrderAmount}
              onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
            />
            <Input
              label="Giảm tối đa"
              type="number"
              value={form.maxDiscountAmount}
              onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Giới hạn lượt dùng"
              type="number"
              required
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
            />
            <Input
              label="Ngày bắt đầu"
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <Input
              label="Ngày kết thúc"
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" loading={saving}>
              Lưu Voucher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CouponManager;
