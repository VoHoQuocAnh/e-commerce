// client/src/pages/admin/BannerManager.jsx
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { bannerApi } from '../../services/bannerApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { notify } from '../../components/feedback/Toast';

const initialForm = {
  title: '',
  subtitle: '',
  imageUrl: '',
  linkUrl: '/products',
  sortOrder: 0,
  isActive: true,
};

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadBanners = async () => {
    try {
      const res = await bannerApi.getAllAdmin();
      setBanners(res.data || []);
    } catch {
      notify.error('Không thể tải danh sách banner');
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditingId(b.id);
    setForm({
      title: b.title,
      subtitle: b.subtitle || '',
      imageUrl: b.imageUrl || '',
      linkUrl: b.linkUrl || '/products',
      sortOrder: b.sortOrder ?? 0,
      isActive: Boolean(b.isActive),
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('subtitle', form.subtitle);
      fd.append('imageUrl', form.imageUrl);
      fd.append('linkUrl', form.linkUrl);
      fd.append('sortOrder', String(form.sortOrder));
      fd.append('isActive', String(form.isActive));
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await bannerApi.update(editingId, fd);
        notify.success('Đã cập nhật banner!');
      } else {
        await bannerApi.create(fd);
        notify.success('Đã tạo banner mới!');
      }
      setModalOpen(false);
      loadBanners();
    } catch (err) {
      notify.error(err.response?.data?.message || 'Lỗi lưu banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await bannerApi.remove(id);
      notify.info('Đã xóa banner');
      loadBanners();
    } catch {
      notify.error('Không thể xóa banner');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Quản Lý Hero Banner 3D</h1>
          <p className="text-xs text-zinc-400">Điều chỉnh hình ảnh chiến dịch trên sân khấu 3D</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Thêm Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="glass-panel rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between"
          >
            <div className="aspect-[16/9] bg-zinc-900 relative">
              <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent p-5 flex flex-col justify-end">
                <h3 className="text-lg font-black font-display text-white">{b.title}</h3>
                <p className="text-xs text-zinc-300">{b.subtitle}</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  b.isActive ? 'bg-lime-400/15 text-lime-300' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {b.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => openEdit(b)}>
                  <Edit3 className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(b.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Cập nhật Banner' : 'Thêm Banner mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tiêu đề chính"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="Mô tả phụ"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
          <Input
            label="URL Ảnh Banner (hoặc chọn file bên dưới)"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Hoặc tải file ảnh lên Cloudinary
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="text-xs text-zinc-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Đường dẫn đích"
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
            />
            <Input
              label="Thứ tự ưu tiên"
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" loading={saving}>
              Lưu Banner
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BannerManager;
