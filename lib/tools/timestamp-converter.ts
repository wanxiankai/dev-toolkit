import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function parseTimestamp(input: string): Date {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Timestamp is required");
  }

  const numeric = Number(trimmed);
  if (Number.isNaN(numeric)) {
    throw new Error("Invalid timestamp");
  }

  const ms = trimmed.length <= 10 ? numeric * 1000 : numeric;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid timestamp value");
  }
  return date;
}

export function dateToTimestamps(value: string): { seconds: number; milliseconds: number } {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date value");
  }
  return {
    seconds: Math.floor(date.getTime() / 1000),
    milliseconds: date.getTime(),
  };
}

export function formatDateWithTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date);
}

export function formatDateVariants(date: Date) {
  return {
    iso8601: date.toISOString(),
    rfc2822: date.toUTCString(),
    relative: dayjs(date).fromNow(),
  };
}
