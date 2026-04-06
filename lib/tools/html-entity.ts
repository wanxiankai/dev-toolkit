export type HtmlEntityMode = "named" | "numeric";

const NAMED_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
  "`": "&#96;",
};

export const COMMON_ENTITY_TABLE = [
  { char: "&", named: "&amp;", numeric: "&#38;" },
  { char: "<", named: "&lt;", numeric: "&#60;" },
  { char: ">", named: "&gt;", numeric: "&#62;" },
  { char: '"', named: "&quot;", numeric: "&#34;" },
  { char: "'", named: "&apos;", numeric: "&#39;" },
  { char: "©", named: "&copy;", numeric: "&#169;" },
  { char: "®", named: "&reg;", numeric: "&#174;" },
  { char: "€", named: "&euro;", numeric: "&#8364;" },
];

export function encodeHtmlEntities(input: string, mode: HtmlEntityMode = "named"): string {
  return Array.from(input)
    .map((char) => {
      if (mode === "named" && NAMED_ENTITIES[char]) {
        return NAMED_ENTITIES[char];
      }
      const codePoint = char.codePointAt(0);
      if (!codePoint) return char;
      if (mode === "numeric") {
        return `&#${codePoint};`;
      }
      return codePoint > 127 ? `&#${codePoint};` : char;
    })
    .join("");
}

export function decodeHtmlEntities(input: string): string {
  if (!input) return "";
  if (typeof document === "undefined") {
    return input;
  }
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}

