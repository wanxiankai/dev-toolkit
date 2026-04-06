export interface PasswordOptions {
  length: number;
  count: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeChars?: string;
}

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

export function generatePasswords(options: PasswordOptions): string[] {
  const length = clamp(options.length, 4, 128);
  const count = clamp(options.count, 1, 20);
  const excluded = new Set((options.excludeChars ?? "").split(""));

  const pools: string[] = [];
  if (options.includeUppercase) pools.push(filterChars(UPPER, excluded));
  if (options.includeLowercase) pools.push(filterChars(LOWER, excluded));
  if (options.includeNumbers) pools.push(filterChars(NUMBERS, excluded));
  if (options.includeSymbols) pools.push(filterChars(SYMBOLS, excluded));

  const validPools = pools.filter((pool) => pool.length > 0);
  if (validPools.length === 0) {
    throw new Error("At least one character set must be enabled.");
  }

  const masterPool = validPools.join("");
  return Array.from({ length: count }, () =>
    generateSinglePassword(length, validPools, masterPool)
  );
}

export function evaluatePasswordStrength(password: string): "weak" | "medium" | "strong" | "very-strong" {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 3) return "weak";
  if (score <= 5) return "medium";
  if (score <= 6) return "strong";
  return "very-strong";
}

function generateSinglePassword(length: number, pools: string[], masterPool: string): string {
  const chars: string[] = [];

  // Ensure each enabled charset appears at least once.
  pools.forEach((pool) => {
    chars.push(pick(pool));
  });

  while (chars.length < length) {
    chars.push(pick(masterPool));
  }

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.slice(0, length).join("");
}

function filterChars(input: string, excluded: Set<string>) {
  return Array.from(input)
    .filter((char) => !excluded.has(char))
    .join("");
}

function pick(pool: string) {
  return pool[randomInt(pool.length)];
}

function randomInt(maxExclusive: number) {
  if (maxExclusive <= 0) return 0;
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % maxExclusive;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

