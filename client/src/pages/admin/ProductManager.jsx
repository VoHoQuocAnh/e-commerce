// client/src/pages/admin/ProductManager.jsx
import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Layers, ImagePlus } from 'lucide-react';
import { productApi } from '../../services/productApi';
import { categoryApi } from '../../services/categoryApi';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import { notify } from '../../components/feedback/Toast';

const emptyVariant = {
  sku: '',
  size: 'L',
  color: 'Đen',
  colorHex: '#18181b',
  price: 390000,
  stockQuantity: 30,
};

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    categoryId: '',
    name: '',
    description: '',
    basePrice: 390000,
    salePrice: '',
    gender: 'unisex',
    isFeatured: true,
    isActive: true,
  });
  const [variants, setVariants] = useState([{ ...emptyVariant }]);
  const [imageFiles, setImageFiles] = useState([]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await productApi.getAll({ page, limit: 10, includeInactive: true });
      setProducts(res.data || []);
      setMeta(res.meta || { page: 1, totalPages: 1 });
    } catch {
      notify.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    categoryApi.getAll().then((res) => setCategories(res.data || []));
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      categoryId: categories[0]?.id || '',
      name: '',
      description: '',
      basePrice: 390000,
      salePrice: '',
      gender: 'unisex',
      isFeatured: true,
      isActive: true,
    });
    setVariants([
      {
        ...emptyVariant,
        sku: `CLM-${Date.now().toString().slice(-4)}-BLK-L`,
      },
    ]);
    setImageFiles([]);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      categoryId: product.categoryId,
      name: product.name,
      description: product.description || '',
      basePrice: Number(product.basePrice),
      salePrice: product.salePrice ? Number(product.salePrice) : '',
      gender: product.gender || 'unisex',
      isFeatured: Boolean(product.isFeatured),
      isActive: Boolean(product.isActive),
    });
    setVariants(
      product.variants?.length
        ? product.variants.map((v) => ({
            id: v.id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            colorHex: v.colorHex || '#18181b',
            price: Number(v.price),
            stockQuantity: Number(v.stockQuantity),
          }))
        : [{ ...emptyVariant }]
    );
    setImageFiles([]);
    setModalOpen(true);
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const addVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      {
        ...emptyVariant,
        sku: `CLM-${Date.now().toString().slice(-4)}-${prev.length + 1}`,
        price: Number(form.salePrice || form.basePrice || 390000),
      },
    ]);
  };

  const removeVariantRow = (index) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('categoryId', String(form.categoryId));
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('basePrice', String(form.basePrice));
      if (form.salePrice !== '') {
        formData.append('salePrice', String(form.salePrice));
      }
      formData.append('gender', form.gender);
      formData.append('isFeatured', String(form.isFeatured));
      formData.append('isActive', String(form.isActive));

      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      if (editingProduct) {
        await productApi.update(editingProduct.id, formData);
        // Sync existing or new variants
        for (const v of variants) {
          const payload = {
            sku: v.sku,
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            price: Number(v.price),
            stockQuantity: Number(v.stockQuantity),
          };
          if (v.id) {
            await productApi.updateVariant(editingProduct.id, v.id, payload);
          } else {
            await productApi.addVariant(editingProduct.id, payload);
          }
        }
        notify.success('Đã cập nhật sản phẩm và biến thể!');
      } else {
        formData.append('variants', JSON.stringify(variants));
        await productApi.create(formData);
        notify.success('Đã tạo sản phẩm mới thành công!');
      }

      setModalOpen(false);
      fetchProducts(meta.page);
    } catch (err) {
      notify.error(err.response?.data?.message || 'Lỗi lưu sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productApi.remove(id);
      notify.info('Đã ẩn/xóa mềm sản phẩm');
      fetchProducts(meta.page);
    } catch (err) {
      notify.error(err.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Quản Lý Sản Phẩm & Biến Thể</h1>
          <p className="text-xs text-zinc-400">
            Quản lý danh mục áo quần, biến thể Size/Màu, tồn kho SKU và hình ảnh Cloudinary
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4" /> Thêm sản phẩm mới
        </Button>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-mono uppercase text-zinc-400 bg-zinc-900/50">
                <th className="py-3.5 px-4">Sản phẩm</th>
                <th className="py-3.5 px-4">Danh mục</th>
                <th className="py-3.5 px-4">Giá bán</th>
                <th className="py-3.5 px-4">Biến thể / Tồn kho</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const thumb = prod.images?.[0]?.imageUrl;
                  const totalStock = (prod.variants || []).reduce(
                    (sum, v) => sum + Number(v.stockQuantity || 0),
                    0
                  );
                  return (
                    <tr key={prod.id} className="hover:bg-white/5">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {thumb && (
                            <img
                              src={thumb}
                              alt={prod.name}
                              className="w-11 h-14 rounded-xl object-cover border border-white/10"
                            />
                          )}
                          <div>
                            <p className="font-bold text-white">{prod.name}</p>
                            <p className="text-xs text-zinc-500 font-mono">{prod.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-zinc-300">
                        {prod.category?.name || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-lime-400">
                          {formatCurrency(prod.salePrice || prod.basePrice)}
                        </div>
                        {prod.salePrice && (
                          <div className="text-xs text-zinc-500 line-through">
                            {formatCurrency(prod.basePrice)}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-zinc-200">
                          <Layers className="w-3.5 h-3.5 text-lime-400" />
                          {prod.variants?.length || 0} SKU ({totalStock} chiếc)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            prod.isActive
                              ? 'bg-lime-400/15 text-lime-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {prod.isActive ? 'Đang bán' : 'Đang ẩn'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => openEditModal(prod)}>
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(prod.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(p) => fetchProducts(p)}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? `Cập nhật: ${editingProduct.name}` : 'Thêm sản phẩm mới'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tên sản phẩm"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Danh mục
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Giá gốc (VNĐ)"
              type="number"
              required
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
            />
            <Input
              label="Giá khuyến mãi (Tùy chọn)"
              type="number"
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Giới tính
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-white"
              >
                <option value="unisex">Unisex</option>
                <option value="men">Nam</option>
                <option value="women">Nữ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Mô tả sản phẩm
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl bg-zinc-900 border border-white/10 p-3 text-sm text-white"
            />
          </div>

          {/* Upload Images */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Tải lên hình ảnh sản phẩm (Tối đa 8 ảnh)
            </label>
            <label className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/20 bg-zinc-900/50 text-xs text-zinc-300 cursor-pointer hover:border-lime-400">
              <ImagePlus className="w-4 h-4 text-lime-400" />
              <span>
                {imageFiles.length > 0
                  ? `Đã chọn ${imageFiles.length} file ảnh`
                  : 'Nhấn để chọn nhiều ảnh từ máy tính'}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
              />
            </label>
          </div>

          {/* Variants Matrix */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
                Danh sách biến thể (SKU / Size / Màu / Giá / Tồn kho)
              </span>
              <Button type="button" size="sm" variant="secondary" onClick={addVariantRow}>
                <Plus className="w-3.5 h-3.5" /> Thêm SKU
              </Button>
            </div>

            {variants.map((v, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center bg-zinc-950/70 p-3 rounded-2xl border border-white/10"
              >
                <input
                  placeholder="SKU"
                  value={v.sku}
                  onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                  required
                  className="px-2.5 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                />
                <input
                  placeholder="Size (S/M/L/XL)"
                  value={v.size}
                  onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                  required
                  className="px-2.5 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                />
                <input
                  placeholder="Màu sắc"
                  value={v.color}
                  onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                  required
                  className="px-2.5 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                />
                <input
                  type="number"
                  placeholder="Giá"
                  value={v.price}
                  onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                  required
                  className="px-2.5 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                />
                <input
                  type="number"
                  placeholder="Tồn kho"
                  value={v.stockQuantity}
                  onChange={(e) => handleVariantChange(idx, 'stockQuantity', e.target.value)}
                  required
                  className="px-2.5 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => removeVariantRow(idx)}
                  className="text-xs text-rose-400 hover:underline justify-self-end px-2"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="accent-lime-400"
              />
              Sản phẩm nổi bật (3D Featured)
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="accent-lime-400"
              />
              Hiển thị bán ngay
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" loading={saving}>
              {editingProduct ? 'Lưu cập nhật' : 'Tạo sản phẩm'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManager;
