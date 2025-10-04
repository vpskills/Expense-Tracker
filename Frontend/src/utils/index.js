export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
};

export const isFutureDate = (dayObj) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // ignore time
  const date = new Date(dayObj.date); // convert ISO string to Date
  date.setHours(0, 0, 0, 0); // ignore time
  return date > today;
};

export const isToday = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate.getTime() === today.getTime();
};

export const isCurrentMonth = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  return (
    today.getFullYear() === compareDate.getFullYear() && today.getMonth() === compareDate.getMonth()
  );
};

export const isCurrentYear = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  return today.getFullYear() === compareDate.getFullYear();
};

export function formatDisplayDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export const formatCurrency = (value, sign = true) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    signDisplay: sign ? 'exceptZero' : 'never', // shows + / - correctly
  }).format(value);
};
