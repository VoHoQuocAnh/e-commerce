// client/src/tests/components/ProductCard.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../../components/product/ProductCard';

describe('ProductCard 3D Component', () => {
  const sampleProduct = {
    id: 1,
    name: 'Áo Thun Boxy CALEM Emblem 3D Puff',
    slug: 'ao-thun-boxy-calem-emblem-3d-puff',
    basePrice: 450000,
    salePrice: 360000,
    isFeatured: true,
    ratingAvg: 4.9,
    ratingCount: 28,
    category: { name: 'Áo Thun Boxy (T-Shirts)' },
    images: [
      { imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80' },
    ],
    variants: [
      { id: 11, color: 'Đen', colorHex: '#18181b', size: 'L', stockQuantity: 20 },
      { id: 12, color: 'Kem', colorHex: '#f5f5dc', size: 'M', stockQuantity: 15 },
    ],
  };

  it('hiển thị tên sản phẩm, badge giảm giá % và nhãn 3D Drop', () => {
    render(
      <MemoryRouter>
        <ProductCard product={sampleProduct} />
      </MemoryRouter>
    );

    expect(screen.getByText('Áo Thun Boxy CALEM Emblem 3D Puff')).toBeInTheDocument();
    expect(screen.getByText('-20%')).toBeInTheDocument();
    expect(screen.getByText(/3D Drop/i)).toBeInTheDocument();
  });
});
