// client/src/utils/formatCurrency.js
export const formatCurrency = (amount) => {
  const num = Number(amount || 0);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(num);
};
