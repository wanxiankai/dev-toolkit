export type JsonIndent = 2 | 4 | "tab";

export function parseJson(input: string): unknown {
  return JSON.parse(input);
}

export function formatJson(
  input: string,
  indent: JsonIndent,
  sortKeys = false
): string {
  const parsed = parseJson(input);
  const space = indent === "tab" ? "\t" : indent;
  const normalized = sortKeys ? sortJsonValue(parsed) : parsed;
  return JSON.stringify(normalized, null, space);
}

export function minifyJson(input: string): string {
  return JSON.stringify(parseJson(input));
}

export function validateJson(input: string): { valid: true } | { valid: false; message: string; line?: number; column?: number } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    const match = message.match(/position\s(\d+)/i);
    if (!match) {
      return { valid: false, message };
    }

    const position = Number(match[1]);
    const { line, column } = getLineColumn(input, position);
    return { valid: false, message, line, column };
  }
}

export function runSimpleJsonPath(input: unknown, path: string): unknown {
  const query = path.trim();
  if (!query || query === "$") {
    return input;
  }
  if (!query.startsWith("$")) {
    throw new Error("JSONPath must start with $");
  }

  const tokens = query
    .slice(1)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  let current: unknown = input;
  for (const token of tokens) {
    if (current === null || typeof current !== "object") {
      throw new Error(`Path not found at '${token}'`);
    }

    if (Array.isArray(current)) {
      const index = Number(token);
      if (Number.isNaN(index) || index < 0 || index >= current.length) {
        throw new Error(`Array index out of range: ${token}`);
      }
      current = current[index];
      continue;
    }

    const record = current as Record<string, unknown>;
    if (!(token in record)) {
      throw new Error(`Path not found at '${token}'`);
    }
    current = record[token];
  }

  return current;
}

function sortJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonValue);
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.keys(record)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortJsonValue(record[key]);
        return acc;
      }, {});
  }
  return value;
}

function getLineColumn(text: string, position: number) {
  const lines = text.slice(0, position).split("\n");
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}
