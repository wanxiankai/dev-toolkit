export type UrlMode = "component" | "full";

export function encodeUrlLine(value: string, mode: UrlMode): string {
  return mode === "component" ? encodeURIComponent(value) : encodeURI(value);
}

export function decodeUrlLine(value: string): string {
  return decodeURIComponent(value);
}

export function transformUrlLines(
  input: string,
  action: "encode" | "decode",
  mode: UrlMode
): string {
  return input
    .split("\n")
    .map((line) => {
      if (!line.trim()) {
        return line;
      }
      if (action === "encode") {
        return encodeUrlLine(line, mode);
      }
      return decodeUrlLine(line);
    })
    .join("\n");
}
