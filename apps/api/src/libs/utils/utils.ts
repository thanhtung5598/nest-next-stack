type GroupByFunc<T> = (item: T) => string | number | symbol;

export function groupBy<T>(array: T[], key: keyof T | GroupByFunc<T>): Record<string, T[]> {
  return array.reduce((result: Record<string, T[]>, item: T) => {
    // Determine the key based on whether the provided key is a function or property
    const groupKey = typeof key === 'function' ? key(item) : item[key];

    // Convert the key to a string for the record key
    const group = String(groupKey);

    // Initialize the group if it doesn't exist
    if (!result[group]) {
      result[group] = [];
    }

    // Push the item to the group
    result[group].push(item);

    return result;
  }, {});
}

export function getLast12Months() {
  const currentDate = new Date();
  const months: { index: number; name: string }[] = [];
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Loop backward from 11 to 0 to get the last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    // Get the month name from the `monthNames` array
    const monthName = monthNames[date.getMonth()];
    months.push({ index: date.getMonth() + 1, name: monthName });
  }

  return months;
}

export function getLast30Days() {
  const currentDate = new Date();
  const days: number[] = [];

  for (let i = 30; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i,
    );
    days.push(date.getDate());
  }

  return days;
}
