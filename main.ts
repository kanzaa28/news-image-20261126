// news-image-20261126 entry program (Node 22, standard library only).
//
// The entry is a front page (entry.png, 1024x1024) summing up Thursday
// 26 November 2026: 36 dated stories from 7 regions, led by the US
// proposing sweeping new tariffs on 14 trading partners. The image was
// drawn ahead of time (see draw.py beside the package); this program
// does not draw anything. It checks the shipped PNG is a whole,
// well-formed image inside the competition limits, then publishes it
// byte-for-byte to $MAKEFUN_OUTPUT_DIR/entry.png, so every grader run
// writes identical bytes.
//
// Checks, in order:
//   * the 8-byte PNG signature;
//   * the first chunk is IHDR and declares exactly 1024x1024;
//   * every chunk is walked to IEND with its CRC32 recomputed and matched,
//     so a truncated or corrupt file fails instead of being published;
//   * at least one IDAT chunk is present (the file carries real image data);
//   * no trailing bytes after IEND, and the total size is at most 1 MiB.

import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const SIZE_LIMIT = 1048576; // 1 MiB, the competition cap
const SIDE = 1024; // the page is drawn at exactly 1024x1024

// CRC-32 (IEEE) lookup table, generated lazily on first use.
let table: Uint32Array | null = null;
function crcTable(): Uint32Array {
  if (table) return table;
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  table = t;
  return t;
}

function crc32(chunk: Buffer): number {
  const t = crcTable();
  let crc = 0xffffffff;
  for (const byte of chunk) crc = t[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function abort(reason: string): never {
  throw new Error(`entry.png failed verification: ${reason}`);
}

function inspect(bytes: Buffer): void {
  if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_MAGIC)) {
    abort("bad PNG signature");
  }
  if (bytes.length > SIZE_LIMIT) {
    abort(`file is ${bytes.length} bytes, over the 1 MiB limit`);
  }

  let pos = 8;
  let first = true;
  let idat = false;
  for (;;) {
    if (pos + 8 > bytes.length) abort("chunk header runs past the end of the file");
    const len = bytes.readUInt32BE(pos);
    const kind = bytes.toString("latin1", pos + 4, pos + 8);
    const bodyStart = pos + 8;
    const bodyEnd = bodyStart + len;
    if (bodyEnd + 4 > bytes.length) abort(`chunk ${kind} runs past the end of the file`);
    const want = bytes.readUInt32BE(bodyEnd);
    const got = crc32(Buffer.concat([bytes.subarray(pos + 4, pos + 8), bytes.subarray(bodyStart, bodyEnd)]));
    if (want !== got) abort(`chunk ${kind} has a bad CRC (stored ${want}, computed ${got})`);

    if (first) {
      if (kind !== "IHDR") abort("first chunk is not IHDR");
      const w = bytes.readUInt32BE(bodyStart);
      const h = bytes.readUInt32BE(bodyStart + 4);
      if (w !== SIDE || h !== SIDE) abort(`dimensions ${w}x${h}, expected ${SIDE}x${SIDE}`);
      // The shipped page is an 8-bit RGB image (bit depth 8, colour type 2);
      // anything else is not the file this program was written to publish.
      const depth = bytes[bodyStart + 8];
      const colour = bytes[bodyStart + 9];
      if (depth !== 8 || colour !== 2) {
        abort(`IHDR bit depth ${depth}, colour type ${colour}, expected 8-bit RGB`);
      }
      first = false;
    }
    if (kind === "IDAT") {
      if (len === 0) abort("empty IDAT chunk");
      idat = true;
    }
    pos = bodyEnd + 4;
    if (kind === "IEND") {
      if (pos !== bytes.length) abort("trailing bytes after IEND");
      break;
    }
  }
  if (first) abort("no IHDR chunk found");
  if (!idat) abort("no IDAT chunk found; file carries no image data");
}

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const source = join(here, "entry.png");
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const dest = join(outDir, "entry.png");

  const bytes = readFileSync(source);
  inspect(bytes);

  mkdirSync(outDir, { recursive: true });
  copyFileSync(source, dest);

  const written = statSync(dest).size;
  if (written !== bytes.length) {
    abort(`wrote ${written} bytes but verified ${bytes.length}`);
  }
  // Read back what landed on disk and compare hashes: the published file
  // must be the verified bytes, not just the same length.
  const published = readFileSync(dest);
  const wantHash = createHash("sha256").update(bytes).digest("hex");
  const gotHash = createHash("sha256").update(published).digest("hex");
  if (gotHash !== wantHash) {
    abort(`published sha256 ${gotHash} differs from verified ${wantHash}`);
  }
  const sha256 = wantHash;
  console.log(`entry.png verified: 1024x1024, ${bytes.length} bytes, sha256 ${sha256}`);
  console.log(`published to ${dest}`);
}

main();
