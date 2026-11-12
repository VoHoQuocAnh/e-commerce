// client/src/constants/orderStatus.js
export const ORDER_STATUS = Object.freeze({
  PENDING_PAYMENT: 'pending_payment',
  PENDING_CONFIRMATION: 'pending_confirmation',
  SHIPPING: 'shipping',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

export const ORDER_STATUS_LABELS = Object.freeze({
  pending_payment: 'Chờ thanh toán MoMo',
  pending_confirmation: 'Chờ xác nhận',
  shipping: 'Đang giao hàng',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
});

export const ORDER_STATUS_BADGE = Object.freeze({
  pending_payment: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  pending_confirmation: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  shipping: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  completed: 'bg-lime-500/15 text-lime-300 border-lime-500/30',
  cancelled: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
});
