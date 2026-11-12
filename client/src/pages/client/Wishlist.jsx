// client/src/pages/client/Wishlist.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlistApi } from '../../services/wishlistApi';
import ProductGrid from '../../components/product/ProductGrid';
import EmptyState from '../../components/feedback/EmptyState';
import Button from '../../components/common/Button';
import { notify } from '../../components/feedback/Toast';
import { ROUTES } from '../../constants/routes';

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await wishlistApi.getAll();
      const list = (res.data || []).map((entry) => entry.product).filter(Boolean);
      setProducts(list);
    } catch {
      notify.error('Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleToggleWishlist = async (productId) => {
    try {
      await wishlistApi.toggle(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      notify.info('Đã xóa khỏi danh sách yêu thích');
    } catch {
      notify.error('Thao tác thất bại');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-lime-400 block mb-1">
          // SAVED DROPS
        </span>
        <h1 className="font-display text-3xl font-black text-white">
          DANH SÁCH YÊU THÍCH ({products.length})
        </h1>
      </div>

      {!loading && products.length === 0 ? (
        <EmptyState
          title="Chưa có sản phẩm yêu thích"
          description="Nhấn biểu tượng trái tim trên bất kỳ thiết kế 3D nào để lưu lại vào bộ sưu tập cá nhân của bạn."
          action={
            <Link to={ROUTES.PRODUCTS}>
              <Button>KHÁM PHÁ SHOWROOM</Button>
            </Link>
          }
        />
      ) : (
        <ProductGrid
          products={products}
          loading={loading}
          onWishlistToggle={handleToggleWishlist}
        />
      )}
    </div>
  );
};

export default Wishlist;
