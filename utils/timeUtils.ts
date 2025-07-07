export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

export const getCurrentTime = (): string => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

export const calculateWorkingHours = (checkIn: Date, checkOut: Date): number => {
  const diffInMs = checkOut.getTime() - checkIn.getTime();
  return diffInMs / (1000 * 60 * 60); // Convert to hours
};
