/**
 * Centralized dayjs utility — all date formatting goes through here.
 * Do NOT import dayjs directly in other files.
 */
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/** Date format: MMMM DD, YYYY (e.g., "January 15, 2026") */
const DATE_FORMAT = "MMMM DD, YYYY";

/** Timestamp format: MMMM DD, YYYY hh:mm A (e.g., "January 15, 2026 02:30 PM") */
const TIMESTAMP_FORMAT = "MMMM DD, YYYY hh:mm A";

/**
 * Formats a date string or Date object to "MMMM DD, YYYY"
 */
export function formatDate(date: string | Date | null): string {
  if (date === null) {
    return "—";
  }
  return dayjs(date).format(DATE_FORMAT);
}

/**
 * Formats a date string or Date object to "MMMM DD, YYYY hh:mm A"
 */
export function formatTimestamp(date: string | Date | null): string {
  if (date === null) {
    return "—";
  }
  return dayjs(date).format(TIMESTAMP_FORMAT);
}

/**
 * Returns a human-readable relative time string (e.g., "2 days ago")
 */
export function timeFromNow(date: string | Date | null): string {
  if (date === null) {
    return "—";
  }
  return dayjs(date).fromNow();
}

/**
 * Calculates the number of days between two dates
 */
export function daysBetween(start: string | Date, end: string | Date): number {
  return dayjs(end).diff(dayjs(start), "day");
}

/**
 * Calculates the number of days remaining until a date
 */
export function daysRemaining(endDate: string | Date): number {
  const remaining = dayjs(endDate).diff(dayjs(), "day");
  return remaining < 0 ? 0 : remaining;
}

/**
 * Checks if a date is in the past
 */
export function isPast(date: string | Date): boolean {
  return dayjs(date).isBefore(dayjs(), "day");
}

/**
 * Checks if a date is on or before today.
 */
export function isOnOrBeforeToday(date: string | Date): boolean {
  return (
    dayjs(date).isSame(dayjs(), "day") || dayjs(date).isBefore(dayjs(), "day")
  );
}

/**
 * Checks if a date is within the next N days
 */
export function isWithinDays(date: string | Date, days: number): boolean {
  const target = dayjs(date);
  const now = dayjs();
  return target.isAfter(now) && target.diff(now, "day") <= days;
}

/**
 * Formats a date for input[type="date"] fields (YYYY-MM-DD)
 */
export function toInputDateFormat(date: string | Date | null): string {
  if (date === null) {
    return "";
  }
  return dayjs(date).format("YYYY-MM-DD");
}

/**
 * Gets today's date formatted for input[type="date"]
 */
export function todayInputFormat(): string {
  return dayjs().format("YYYY-MM-DD");
}
