export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
};
