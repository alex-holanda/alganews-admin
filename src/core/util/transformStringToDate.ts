export function transformStringToDate(date: string) {
  return new Date(date).toLocaleDateString(navigator.language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
