// client/src/components/product/ProductGrid.jsx
import ProductCard from './ProductCard';
import Skeleton from '../feedback/Skeleton';
import EmptyState from '../feedback/EmptyState';

const ProductGrid = ({ products = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="aspect-[4/5] w-full" count={8} />
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        title="Không tìm thấy sản phẩm phù hợp"
        description="Hãy thử thay đổi bộ lọc danh mục, khoảng giá hoặc từ khóa tìm kiếm của bạn."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
