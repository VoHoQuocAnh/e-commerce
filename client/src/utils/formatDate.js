// client/src/utils/formatDate.js
export const formatDate = (dateInput, includeTime = true) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date);
};
