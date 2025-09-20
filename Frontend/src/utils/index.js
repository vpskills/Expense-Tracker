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
  today.setHours(0, 0, 0, 0); // reset time to 00:00
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0); // reset time to 00:00
  return compareDate.getTime() === today.getTime();
};

export function formatDisplayDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
