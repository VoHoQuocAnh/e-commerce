// client/src/pages/admin/CategoryManager.jsx
import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { categoryApi } from '../../services/categoryApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { notify } from '../../components/feedback/Toast';

const initialForm = {
  name: '',
  description: '',
  imageUrl: '',
  isActive: true,
};

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAll({ includeInactive: true });
      setCategories(res.data || []);
    } catch {
      notify.error('Không thể tải danh mục');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
      isActive: Boolean(cat.isActive),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await categoryApi.update(editingId, form);
        notify.success('Đã cập nhật danh mục!');
      } else {
        await categoryApi.create(form);
        notify.success('Đã tạo danh mục mới!');
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      notify.error(err.response?.data?.message || 'Lỗi lưu danh mục');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryApi.remove(id);
      notify.info('Đã xóa danh mục');
      loadCategories();
    } catch (err) {
      notify.error(err.response?.data?.message || 'Không thể xóa danh mục đang có sản phẩm');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Quản Lý Danh Mục</h1>
          <p className="text-xs text-zinc-400">Phân loại các dòng sản phẩm Streetwear</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Thêm danh mục
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              {cat.imageUrl && (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0"
                />
              )}
              <div>
                <h3 className="font-bold text-white text-base">{cat.name}</h3>
                <p className="text-xs font-mono text-lime-400">/{cat.slug}</p>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{cat.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  cat.isActive ? 'bg-lime-400/15 text-lime-300' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {cat.isActive ? 'Hiển thị' : 'Tạm ẩn'}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => openEdit(cat)}>
                  <Edit3 className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(cat.id)}>
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
        title={editingId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên danh mục"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="URL Ảnh đại diện"
            placeholder="https://images.unsplash.com/..."
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Mô tả
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl bg-zinc-900 border border-white/10 p-3 text-sm text-white"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="accent-lime-400"
            />
            Kích hoạt danh mục
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" loading={saving}>
              Lưu danh mục
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManager;
