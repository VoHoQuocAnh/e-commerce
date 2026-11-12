// client/src/tests/components/ProductVariantSelector.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductVariantSelector from '../../components/common/ProductVariantSelector';

describe('ProductVariantSelector Component', () => {
  const variants = [
    { id: 1, color: 'Đen', colorHex: '#18181b', size: 'M', stockQuantity: 10 },
    { id: 2, color: 'Đen', colorHex: '#18181b', size: 'L', stockQuantity: 0 },
  ];

  it('vô hiệu hóa (disabled) nút chọn Size khi biến thể hết hàng (stockQuantity = 0)', () => {
    const onSelectColor = vi.fn();
    const onSelectSize = vi.fn();

    render(
      <ProductVariantSelector
        variants={variants}
        selectedColor="Đen"
        selectedSize="M"
        onSelectColor={onSelectColor}
        onSelectSize={onSelectSize}
      />
    );

    const sizeMButton = screen.getByRole('button', { name: 'M' });
    const sizeLButton = screen.getByRole('button', { name: 'L' });

    expect(sizeMButton).not.toBeDisabled();
    expect(sizeLButton).toBeDisabled();

    fireEvent.click(sizeMButton);
    expect(onSelectSize).toHaveBeenCalledWith('M');
  });
});
