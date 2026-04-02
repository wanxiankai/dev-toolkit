export interface RegexMatchGroup {
  index: number;
  text: string;
  groups: (string | undefined)[];
  start: number;
  end: number;
}

export interface RegexPreset {
  name: string;
  pattern: string;
  flags: string;
}

export const REGEX_PRESETS: RegexPreset[] = [
  { name: "Email", pattern: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}", flags: "g" },
  { name: "URL", pattern: "https?:\\/\\/[^\\s/$.?#].[^\\s]*", flags: "g" },
  { name: "Phone", pattern: "(?:\\+?\\d{1,3})?[ -]?(?:\\(?\\d{2,4}\\)?[ -]?)?\\d{3,4}[ -]?\\d{4}", flags: "g" },
  { name: "IPv4", pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\b", flags: "g" },
];

export function createRegex(pattern: string, flags: string): RegExp {
  return new RegExp(pattern, flags);
}

export function runRegex(pattern: string, flags: string, text: string): RegexMatchGroup[] {
  const regex = createRegex(pattern, flags.includes("g") ? flags : `${flags}g`);
  const matches: RegexMatchGroup[] = [];

  for (const match of text.matchAll(regex)) {
    matches.push({
      index: matches.length + 1,
      text: match[0],
      groups: match.slice(1),
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
    });
  }

  return matches;
}

export function highlightMatches(text: string, matches: RegexMatchGroup[]): Array<{ text: string; matched: boolean }> {
  const result: Array<{ text: string; matched: boolean }> = [];
  let cursor = 0;

  matches.forEach((match) => {
    if (match.start > cursor) {
      result.push({ text: text.slice(cursor, match.start), matched: false });
    }
    result.push({ text: text.slice(match.start, match.end), matched: true });
    cursor = match.end;
  });

  if (cursor < text.length) {
    result.push({ text: text.slice(cursor), matched: false });
  }

  return result;
}
