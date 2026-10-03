import fs from 'fs';
import zlib from 'zlib';

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCrcTable();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function generatePng(width, height, colorFn) {
  // 8-bit RGB
  const rawData = Buffer.alloc((width * 3 + 1) * height);
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b] = colorFn(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 2; // Color type: Truecolor (RGB)
  ihdrData[10] = 0; // Compression: Deflate
  ihdrData[11] = 0; // Filter: Standard
  ihdrData[12] = 0; // Interlace: None
  const ihdr = makeChunk('IHDR', ihdrData);

  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// 1. Generate 1200x630 OG Banner (Deep emerald & dark slate with gold gradient accent)
const ogBanner = generatePng(1200, 630, (x, y, w, h) => {
  const normX = x / w;
  const normY = y / h;

  // Base background gradient: Deep dark teal-emerald to dark forest
  let r = Math.floor(4 + normY * 4 + normX * 2);
  let g = Math.floor(40 + (1 - normY) * 60 + normX * 10);
  let b = Math.floor(34 + (1 - normY) * 45);

  // Elegant golden accent bar along the top/accent line
  if (y >= 20 && y <= 24 && x >= 40 && x <= 400) {
    return [234, 179, 8]; // Amber-500
  }

  // Border frame
  if (
    (x >= 30 && x <= 32 && y >= 30 && y <= h - 30) ||
    (x >= w - 32 && x <= w - 30 && y >= 30 && y <= h - 30) ||
    (y >= 30 && y <= 32 && x >= 30 && x <= w - 30) ||
    (y >= h - 32 && y <= h - 30 && x >= 30 && x <= w - 30)
  ) {
    return [52, 211, 153]; // Emerald-400
  }

  return [Math.min(255, r), Math.min(255, g), Math.min(255, b)];
});

fs.writeFileSync('public/og-banner.png', ogBanner);

// 2. Generate 64x64 Favicon PNG
const faviconPng = generatePng(64, 64, (x, y, w, h) => {
  const dist = Math.hypot(x - 32, y - 32);
  if (dist > 30) return [15, 23, 42]; // dark background
  if (dist > 28) return [234, 179, 8]; // Gold ring
  // Emerald center
  return [0, 107, 87];
});

fs.writeFileSync('public/favicon.png', faviconPng);
console.log('Successfully generated public/og-banner.png (1200x630) and public/favicon.png (64x64)!');
