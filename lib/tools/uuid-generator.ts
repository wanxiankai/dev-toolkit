export interface UuidGenerateOptions {
  count: number;
  uppercase?: boolean;
  withHyphen?: boolean;
}

export function generateUuids(options: UuidGenerateOptions): string[] {
  const count = Math.min(Math.max(options.count, 1), 100);
  return Array.from({ length: count }, () => {
    let id = crypto.randomUUID();
    if (options.withHyphen === false) {
      id = id.replace(/-/g, "");
    }
    if (options.uppercase) {
      id = id.toUpperCase();
    }
    return id;
  });
}
