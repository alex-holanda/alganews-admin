export function transformStringToDate(date: string) {
  return new Date(date).toLocaleDateString(navigator.language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function transformStringToDateTime(date: string) {
  const datePart = new Date(date).toLocaleDateString(navigator.language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const timePart = new Date(date).toLocaleTimeString(navigator.language);

  return `${datePart} às ${timePart}`;
}

// return new Intl.DateTimeFormat(navigator.language, {
//   dateStyle: 'short',
//   timeStyle: 'medium',
// }).format(new Date(date));
