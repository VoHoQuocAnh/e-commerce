// client/src/tests/utils/formatCurrency.test.js
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../../utils/formatCurrency';

describe('formatCurrency Utility', () => {
  it('định dạng đúng tiền tệ VNĐ cho số nguyên và chuỗi số', () => {
    expect(formatCurrency(390000)).toContain('390.000');
    expect(formatCurrency('550000')).toContain('550.000');
  });

  it('trả về 0 ₫ khi giá trị không hợp lệ hoặc null', () => {
    expect(formatCurrency(null)).toContain('0');
    expect(formatCurrency(undefined)).toContain('0');
  });
});
