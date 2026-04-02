export interface JwtDecoded {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export interface JwtExpiryStatus {
  status: "expired" | "valid" | "unknown";
  message: string;
  expDate?: Date;
}

function base64UrlToBase64(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  return normalized + "=".repeat(padLength);
}

function decodeBase64UrlJson<T>(segment: string): T {
  const decoded = atob(base64UrlToBase64(segment));
  const bytes = Uint8Array.from(decoded, (ch) => ch.charCodeAt(0));
  const text = new TextDecoder().decode(bytes);
  return JSON.parse(text) as T;
}

export function decodeJwt(token: string): JwtDecoded {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format. Token must have 3 parts.");
  }

  const [headerPart, payloadPart, signature] = parts;
  return {
    header: decodeBase64UrlJson<Record<string, unknown>>(headerPart),
    payload: decodeBase64UrlJson<Record<string, unknown>>(payloadPart),
    signature,
  };
}

export function getJwtExpiryStatus(payload: Record<string, unknown>): JwtExpiryStatus {
  const exp = payload.exp;
  if (typeof exp !== "number") {
    return { status: "unknown", message: "No exp field in payload" };
  }

  const expDate = new Date(exp * 1000);
  const now = Date.now();
  const diffMs = expDate.getTime() - now;

  if (diffMs <= 0) {
    const ago = Math.floor(Math.abs(diffMs) / 1000);
    return {
      status: "expired",
      message: `Expired ${formatDuration(ago)} ago`,
      expDate,
    };
  }

  const remain = Math.floor(diffMs / 1000);
  return {
    status: "valid",
    message: `Valid for ${formatDuration(remain)}`,
    expDate,
  };
}

function formatDuration(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (!days && !hours) parts.push(`${seconds}s`);
  return parts.join(" ");
}
