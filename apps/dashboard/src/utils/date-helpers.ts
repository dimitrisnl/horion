const dateTimeFormat = new Intl.DateTimeFormat(undefined);
const dateFormat = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});
const relativeTimeFormat = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const formatter = options
    ? new Intl.DateTimeFormat(undefined, options)
    : dateFormat;
  return formatter.format(new Date(date));
}

export function formatDateTime(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const formatter = options
    ? new Intl.DateTimeFormat(undefined, options)
    : dateTimeFormat;
  return formatter.format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = targetDate.getTime() - now.getTime();

  const diffInMinutes = Math.round(diffInMs / (1000 * 60));
  const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 7));
  const diffInMonths = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
  const diffInYears = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 365.25));

  if (Math.abs(diffInYears) >= 1) {
    return relativeTimeFormat.format(diffInYears, "year");
  } else if (Math.abs(diffInMonths) >= 1) {
    return relativeTimeFormat.format(diffInMonths, "month");
  } else if (Math.abs(diffInWeeks) >= 1) {
    return relativeTimeFormat.format(diffInWeeks, "week");
  } else if (Math.abs(diffInDays) >= 1) {
    return relativeTimeFormat.format(diffInDays, "day");
  } else if (Math.abs(diffInHours) >= 1) {
    return relativeTimeFormat.format(diffInHours, "hour");
  } else {
    return relativeTimeFormat.format(diffInMinutes, "minute");
  }
}
