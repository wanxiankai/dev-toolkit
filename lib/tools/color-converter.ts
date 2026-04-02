export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export type ColorInput =
  | { type: "hex"; value: string }
  | { type: "rgb"; value: RGB }
  | { type: "hsl"; value: HSL };

export function detectColorInput(input: string): ColorInput {
  const value = input.trim();

  const hexMatch = value.match(/^#?([\da-fA-F]{3}|[\da-fA-F]{6})$/);
  if (hexMatch) {
    return { type: "hex", value: normalizeHex(value) };
  }

  const rgbMatch = value.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (rgbMatch) {
    return {
      type: "rgb",
      value: {
        r: clamp(Number(rgbMatch[1]), 0, 255),
        g: clamp(Number(rgbMatch[2]), 0, 255),
        b: clamp(Number(rgbMatch[3]), 0, 255),
      },
    };
  }

  const hslMatch = value.match(/^hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i);
  if (hslMatch) {
    return {
      type: "hsl",
      value: {
        h: clamp(Number(hslMatch[1]), 0, 360),
        s: clamp(Number(hslMatch[2]), 0, 100),
        l: clamp(Number(hslMatch[3]), 0, 100),
      },
    };
  }

  throw new Error("Unsupported color format");
}

export function normalizeHex(hex: string): string {
  let value = hex.replace(/^#/, "");
  if (value.length === 3) {
    value = value.split("").map((c) => c + c).join("");
  }
  return `#${value.toUpperCase()}`;
}

export function hexToRgb(hex: string): RGB {
  const normalized = normalizeHex(hex).slice(1);
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return `#${[r, g, b].map((n) => clamp(n, 0, 255).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    if (max === nr) h = ((ng - nb) / diff) % 6;
    else if (max === ng) h = (nb - nr) / diff + 2;
    else h = (nr - ng) / diff + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const ns = s / 100;
  const nl = l / 100;
  const c = (1 - Math.abs(2 * nl - 1)) * ns;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = nl - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function complementHex(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({ r: 255 - r, g: 255 - g, b: 255 - b });
}

export function contrastTextHex(hex: string): "#000000" | "#FFFFFF" {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
