export const ShiftAndTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const shiftAStart = 8 * 60; // 08:00 AM
  const shiftAEnd = 16 * 60 + 30; // 16:30 PM

  const shiftBStart = 16 * 60 + 31; // 16:31 PM
  const shiftBEnd = 24 * 60 + 1; // 01:00 AM (next day)

  const shiftCStart = 1 * 60 + 1; // 01:01 AM
  const shiftCEnd = 7 * 60 + 59; // 07:59 AM

  if (totalMinutes >= shiftAStart && totalMinutes <= shiftAEnd) {
    return 'A';
  } else if (totalMinutes >= shiftBStart || totalMinutes <= shiftBEnd) {
    return 'B';
  } else if (totalMinutes >= shiftCStart && totalMinutes <= shiftCEnd) {
    return 'C';
  } else {
    return 'Out of defined';
  }
};
