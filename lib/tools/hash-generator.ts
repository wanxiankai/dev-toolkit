export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";

export async function hashTextAll(text: string): Promise<Record<HashAlgorithm, string>> {
  const bytes = new TextEncoder().encode(text);
  return hashBytesAll(bytes);
}

export async function hashFileAll(file: File): Promise<Record<HashAlgorithm, string>> {
  const buffer = await file.arrayBuffer();
  return hashBytesAll(new Uint8Array(buffer));
}

async function hashBytesAll(bytes: Uint8Array): Promise<Record<HashAlgorithm, string>> {
  const sha1 = await hashWithSubtle(bytes, "SHA-1");
  const sha256 = await hashWithSubtle(bytes, "SHA-256");
  const sha512 = await hashWithSubtle(bytes, "SHA-512");
  const md5 = md5Hex(bytes);

  return {
    "MD5": md5,
    "SHA-1": sha1,
    "SHA-256": sha256,
    "SHA-512": sha512,
  };
}

async function hashWithSubtle(bytes: Uint8Array, algorithm: "SHA-1" | "SHA-256" | "SHA-512") {
  const digest = await crypto.subtle.digest(algorithm, bytes as BufferSource);
  return toHex(new Uint8Array(digest));
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function md5Hex(input: Uint8Array): string {
  const r = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  const k = new Array(64).fill(0).map((_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32));

  const bytes = Array.from(input);
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);
  for (let i = 0; i < 8; i += 1) bytes.push((bitLen >>> (8 * i)) & 0xff);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let i = 0; i < bytes.length; i += 64) {
    const m = new Array(16).fill(0).map((_, j) => {
      const idx = i + j * 4;
      return (bytes[idx]) | (bytes[idx + 1] << 8) | (bytes[idx + 2] << 16) | (bytes[idx + 3] << 24);
    });

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let j = 0; j < 64; j += 1) {
      let f = 0;
      let g = 0;

      if (j < 16) {
        f = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d;
        g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * j) % 16;
      }

      const temp = d;
      d = c;
      c = b;
      const rotate = r[(j >> 4) * 4 + (j % 4)];
      const add = (a + f + k[j] + m[g]) >>> 0;
      b = (b + ((add << rotate) | (add >>> (32 - rotate)))) >>> 0;
      a = temp;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const out = new Uint8Array(16);
  [a0, b0, c0, d0].forEach((word, i) => {
    out[i * 4] = word & 0xff;
    out[i * 4 + 1] = (word >>> 8) & 0xff;
    out[i * 4 + 2] = (word >>> 16) & 0xff;
    out[i * 4 + 3] = (word >>> 24) & 0xff;
  });
  return toHex(out);
}
