export function timeToDate(timestamp: number) {
  timestamp = Number(timestamp);
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-11, so add 1) and pad
  const year = date.getFullYear(); // Get full year
  return `${day}.${month}.${year}`;
}
