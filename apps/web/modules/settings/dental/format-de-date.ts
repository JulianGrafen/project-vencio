/** German locale date formatting for dental settings UI. */
export function formatDeDate(value: Date | string): string {
  let date: Date;
  if (value instanceof Date) {
    date = value;
  } else {
    date = new Date(value);
  }

  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
