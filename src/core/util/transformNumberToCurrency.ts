export function transformNumberToCurrency(value?: number) {
  return value?.toLocaleString(navigator.language, {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  });
}

// new Intl.NumberFormat('pt-BR', {
//   style: 'currency',
//   currency: 'BRL'
// }).format(transaction.amount)
