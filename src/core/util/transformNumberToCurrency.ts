export function transformNumberToCurrency(value?: number) {
  return value?.toLocaleString(navigator.language, {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  });
}
