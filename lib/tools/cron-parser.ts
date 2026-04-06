import cronstrue from "cronstrue";

type ParsedField = {
  any: boolean;
  values: Set<number>;
};

interface ParsedCron {
  withSeconds: boolean;
  second: ParsedField;
  minute: ParsedField;
  hour: ParsedField;
  dayOfMonth: ParsedField;
  month: ParsedField;
  dayOfWeek: ParsedField;
}

export function explainCron(expression: string): string {
  return cronstrue.toString(expression, { throwExceptionOnParseError: true });
}

export function getNextRuns(expression: string, count = 10, from = new Date()): Date[] {
  const parsed = parseCron(expression);
  const results: Date[] = [];
  const stepMs = parsed.withSeconds ? 1000 : 60 * 1000;
  const cursor = new Date(from.getTime() + stepMs);

  if (!parsed.withSeconds) {
    cursor.setSeconds(0, 0);
  } else {
    cursor.setMilliseconds(0);
  }

  let iterations = 0;
  const maxIterations = 600000;

  while (results.length < count && iterations < maxIterations) {
    if (matchesCron(parsed, cursor)) {
      results.push(new Date(cursor));
    }
    cursor.setTime(cursor.getTime() + stepMs);
    iterations += 1;
  }

  return results;
}

function parseCron(expression: string): ParsedCron {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5 && parts.length !== 6) {
    throw new Error("Cron must have 5 or 6 fields.");
  }

  const withSeconds = parts.length === 6;
  const [sec, min, hour, dom, mon, dow] = withSeconds
    ? parts
    : ["0", parts[0], parts[1], parts[2], parts[3], parts[4]];

  return {
    withSeconds,
    second: parseField(sec, 0, 59),
    minute: parseField(min, 0, 59),
    hour: parseField(hour, 0, 23),
    dayOfMonth: parseField(dom, 1, 31),
    month: parseField(mon, 1, 12, MONTH_MAP),
    dayOfWeek: normalizeDayOfWeek(parseField(dow, 0, 7, DOW_MAP)),
  };
}

function parseField(
  field: string,
  min: number,
  max: number,
  aliases?: Record<string, number>
): ParsedField {
  if (field === "*") {
    return { any: true, values: new Set() };
  }

  const values = new Set<number>();
  for (const part of field.split(",")) {
    expandPart(part, min, max, aliases).forEach((value) => values.add(value));
  }

  return { any: false, values };
}

function expandPart(
  part: string,
  min: number,
  max: number,
  aliases?: Record<string, number>
): number[] {
  const [rangePart, stepPart] = part.split("/");
  const step = stepPart ? Number(stepPart) : 1;
  if (!Number.isFinite(step) || step <= 0) {
    throw new Error(`Invalid step: ${part}`);
  }

  if (rangePart === "*") {
    return range(min, max, step);
  }

  if (rangePart.includes("-")) {
    const [fromRaw, toRaw] = rangePart.split("-");
    const from = parseToken(fromRaw, aliases);
    const to = parseToken(toRaw, aliases);
    if (from > to) {
      throw new Error(`Invalid range: ${part}`);
    }
    return range(from, to, step);
  }

  const value = parseToken(rangePart, aliases);
  assertInRange(value, min, max, part);
  return [value];
}

function parseToken(token: string, aliases?: Record<string, number>) {
  const normalized = token.toUpperCase();
  if (aliases && normalized in aliases) {
    return aliases[normalized];
  }

  const value = Number(token);
  if (!Number.isInteger(value)) {
    throw new Error(`Invalid value: ${token}`);
  }
  return value;
}

function assertInRange(value: number, min: number, max: number, source: string) {
  if (value < min || value > max) {
    throw new Error(`Value out of range in '${source}': ${value}`);
  }
}

function range(start: number, end: number, step: number) {
  const values: number[] = [];
  for (let i = start; i <= end; i += step) {
    values.push(i);
  }
  return values;
}

function normalizeDayOfWeek(field: ParsedField): ParsedField {
  if (field.any) return field;
  const values = new Set(Array.from(field.values).map((v) => (v === 7 ? 0 : v)));
  return { any: false, values };
}

function matchesCron(parsed: ParsedCron, date: Date) {
  if (!matchField(parsed.second, date.getSeconds())) return false;
  if (!matchField(parsed.minute, date.getMinutes())) return false;
  if (!matchField(parsed.hour, date.getHours())) return false;
  if (!matchField(parsed.month, date.getMonth() + 1)) return false;

  const domMatch = matchField(parsed.dayOfMonth, date.getDate());
  const dowMatch = matchField(parsed.dayOfWeek, date.getDay());

  if (parsed.dayOfMonth.any && parsed.dayOfWeek.any) return true;
  if (parsed.dayOfMonth.any) return dowMatch;
  if (parsed.dayOfWeek.any) return domMatch;
  return domMatch || dowMatch;
}

function matchField(field: ParsedField, value: number) {
  return field.any || field.values.has(value);
}

const MONTH_MAP: Record<string, number> = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
};

const DOW_MAP: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

