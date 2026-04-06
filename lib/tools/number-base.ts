export type BaseRadix = 2 | 8 | 10 | 16;

export interface NumberBaseResult {
  binary: string;
  octal: string;
  decimal: string;
  hexadecimal: string;
}

export function convertNumberBase(input: string, base: BaseRadix): NumberBaseResult {
  const parsed = parseBigInt(input, base);
  const binary = parsed.toString(2);
  const octal = parsed.toString(8);
  const decimal = parsed.toString(10);
  const hexadecimal = parsed.toString(16).toUpperCase();

  return {
    binary: groupDigits(binary, 4),
    octal,
    decimal: groupDigits(decimal, 3),
    hexadecimal: groupDigits(hexadecimal, 4),
  };
}

export function parseBigInt(input: string, base: BaseRadix): bigint {
  const cleaned = normalizeInput(input, base);
  if (!cleaned) {
    throw new Error("Input is required");
  }

  const sign = cleaned.startsWith("-") ? BigInt(-1) : BigInt(1);
  const raw = cleaned.replace(/^[+-]/, "");

  if (!isValidForBase(raw, base)) {
    throw new Error(`Invalid value for base ${base}`);
  }

  if (raw === "0") return BigInt(0);
  let result = BigInt(0);
  const radix = BigInt(base);

  for (const char of raw.toUpperCase()) {
    const digit = parseDigit(char);
    result = result * radix + BigInt(digit);
  }

  return result * sign;
}

function normalizeInput(input: string, base: BaseRadix): string {
  let value = input.trim().replace(/[\s_]/g, "");
  if (base === 2) value = value.replace(/^([+-])?0b/i, "$1");
  if (base === 8) value = value.replace(/^([+-])?0o/i, "$1");
  if (base === 16) value = value.replace(/^([+-])?0x/i, "$1");
  return value;
}

function isValidForBase(value: string, base: BaseRadix) {
  const patterns: Record<BaseRadix, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^\d+$/,
    16: /^[\dA-Fa-f]+$/,
  };
  return patterns[base].test(value);
}

function parseDigit(char: string): number {
  if (/\d/.test(char)) return Number(char);
  return char.charCodeAt(0) - 55; // A -> 10
}

function groupDigits(value: string, groupSize: number): string {
  const sign = value.startsWith("-") ? "-" : "";
  const raw = sign ? value.slice(1) : value;
  const parts: string[] = [];

  for (let i = raw.length; i > 0; i -= groupSize) {
    const start = Math.max(0, i - groupSize);
    parts.unshift(raw.slice(start, i));
  }

  return `${sign}${parts.join(" ")}`;
}
