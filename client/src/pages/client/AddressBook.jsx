// client/src/pages/client/AddressBook.jsx
import { useEffect, useState } from 'react';
import { Plus, Trash2, CheckCircle2, Edit3 } from 'lucide-react';
import { addressApi } from '../../services/addressApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/feedback/EmptyState';
import { notify } from '../../components/feedback/Toast';

const initialForm = {
  recipientName: '',
  recipientPhone: '',
  province: '',
  district: '',
  ward: '',
  streetAddress: '',
  isDefault: false,
};

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await addressApi.getAll();
      setAddresses(res.data || []);
    } catch {
      notify.error('Không thể tải sổ địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (addr) => {
    setEditingId(addr.id);
    setForm({
      recipientName: addr.recipientName,
      recipientPhone: addr.recipientPhone,
      province: addr.province,
      district: addr.district,
      ward: addr.ward,
      streetAddress: addr.streetAddress,
      isDefault: addr.isDefault,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await addressApi.update(editingId, form);
        notify.success('Đã cập nhật địa chỉ!');
      } else {
        await addressApi.create(form);
        notify.success('Đã thêm địa chỉ mới!');
      }
      setModalOpen(false);
      fetchAddresses();
    } catch (error) {
      notify.error(error.response?.data?.message || 'Lỗi lưu địa chỉ');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressApi.setDefault(id);
      notify.success('Đã đặt làm địa chỉ mặc định!');
      fetchAddresses();
    } catch {
      notify.error('Không thể đặt mặc định');
    }
  };

  const handleDelete = async (id) => {
    try {
      await addressApi.remove(id);
      notify.info('Đã xóa địa chỉ');
      fetchAddresses();
    } catch {
      notify.error('Không thể xóa địa chỉ');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-lime-400 block mb-1">
            // SHIPPING BOOK
          </span>
          <h1 className="font-display text-3xl font-black text-white">SỔ ĐỊA CHỈ GIAO HÀNG</h1>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Thêm địa chỉ mới
        </Button>
      </div>

      {!loading && addresses.length === 0 ? (
        <EmptyState
          title="Chưa có địa chỉ giao hàng"
          description="Lưu sẵn địa chỉ nhận hàng để thanh toán nhanh chóng chỉ với 1 chạm."
          action={<Button onClick={openCreate}>Thêm địa chỉ đầu tiên</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`glass-panel rounded-2xl p-5 border transition-all ${
                addr.isDefault ? 'border-lime-400/60' : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-white text-base">{addr.recipientName}</h3>
                {addr.isDefault && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-lime-400/20 text-lime-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mặc định
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-zinc-400 mb-2">{addr.recipientPhone}</p>
              <p className="text-sm text-zinc-300 mb-5">
                {addr.streetAddress}, {addr.ward}, {addr.district}, {addr.province}
              </p>

              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <Button size="sm" variant="secondary" onClick={() => openEdit(addr)}>
                  <Edit3 className="w-3.5 h-3.5" /> Sửa
                </Button>
                {!addr.isDefault && (
                  <Button size="sm" variant="ghost" onClick={() => handleSetDefault(addr.id)}>
                    Đặt mặc định
                  </Button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="ml-auto p-2 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Họ tên người nhận"
              value={form.recipientName}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
              required
            />
            <Input
              label="Số điện thoại"
              value={form.recipientPhone}
              onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Tỉnh / Thành"
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              required
            />
            <Input
              label="Quận / Huyện"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              required
            />
            <Input
              label="Phường / Xã"
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              required
            />
          </div>
          <Input
            label="Số nhà, tên đường"
            value={form.streetAddress}
            onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
            required
          />
          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="rounded accent-lime-400"
            />
            Đặt làm địa chỉ mặc định
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" loading={saving}>
              Lưu địa chỉ
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddressBook;
