const fs = require('fs');
const path = require('path');

function createLapiezIcoBuffer() {
  const width = 32;
  const height = 32;
  const headerSize = 6;
  const dirEntrySize = 16;
  const bmiHeaderSize = 40;
  const pixelDataSize = width * height * 4;
  const andMaskSize = (width * height) / 8;
  const imageSize = bmiHeaderSize + pixelDataSize + andMaskSize;
  const totalFileSize = headerSize + dirEntrySize + imageSize;

  const buf = Buffer.alloc(totalFileSize);

  // 1. ICO Header
  buf.writeUInt16LE(0, 0); // Reserved
  buf.writeUInt16LE(1, 2); // Icon type (1)
  buf.writeUInt16LE(1, 4); // 1 Image

  // 2. Directory Entry
  buf.writeUInt8(width, 6);
  buf.writeUInt8(height, 7);
  buf.writeUInt8(0, 8); // Colors
  buf.writeUInt8(0, 9); // Reserved
  buf.writeUInt16LE(1, 10); // Color planes
  buf.writeUInt16LE(32, 12); // Bits per pixel
  buf.writeUInt32LE(imageSize, 14); // Image data size
  buf.writeUInt32LE(headerSize + dirEntrySize, 18); // Offset (22)

  // 3. BITMAPINFOHEADER (at offset 22)
  let offset = 22;
  buf.writeUInt32LE(bmiHeaderSize, offset); offset += 4;
  buf.writeInt32LE(width, offset); offset += 4;
  buf.writeInt32LE(height * 2, offset); offset += 4; // Height * 2 for ICO
  buf.writeUInt16LE(1, offset); offset += 2; // Planes
  buf.writeUInt16LE(32, offset); offset += 2; // 32 bpp
  buf.writeUInt32LE(0, offset); offset += 4; // BI_RGB (uncompressed)
  buf.writeUInt32LE(pixelDataSize, offset); offset += 4;
  buf.writeInt32LE(0, offset); offset += 4;
  buf.writeInt32LE(0, offset); offset += 4;
  buf.writeUInt32LE(0, offset); offset += 4;
  buf.writeUInt32LE(0, offset); offset += 4;

  // 4. Pixel Data (Bottom-to-Top, Left-to-Right, BGRA)
  // Let's draw a rounded square with royal blue gradient and bold White/Cyan "L"
  const pixels = Buffer.alloc(pixelDataSize);

  for (let y = 0; y < height; y++) {
    // In BMP, row 0 is bottom row
    const actualY = height - 1 - y;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Rounded rectangle radius 6
      const cornerRadius = 6;
      let inBounds = true;
      if (x < cornerRadius && actualY < cornerRadius) {
        if ((x - cornerRadius) ** 2 + (actualY - cornerRadius) ** 2 > cornerRadius ** 2) inBounds = false;
      } else if (x >= width - cornerRadius && actualY < cornerRadius) {
        if ((x - (width - 1 - cornerRadius)) ** 2 + (actualY - cornerRadius) ** 2 > cornerRadius ** 2) inBounds = false;
      } else if (x < cornerRadius && actualY >= height - cornerRadius) {
        if ((x - cornerRadius) ** 2 + (actualY - (height - 1 - cornerRadius)) ** 2 > cornerRadius ** 2) inBounds = false;
      } else if (x >= width - cornerRadius && actualY >= height - cornerRadius) {
        if ((x - (width - 1 - cornerRadius)) ** 2 + (actualY - (height - 1 - cornerRadius)) ** 2 > cornerRadius ** 2) inBounds = false;
      }

      if (!inBounds) {
        // Transparent
        pixels[idx] = 0;
        pixels[idx + 1] = 0;
        pixels[idx + 2] = 0;
        pixels[idx + 3] = 0;
        continue;
      }

      // Royal Blue Gradient: #1E40AF -> #0A2560
      const gradFactor = actualY / height;
      let r = Math.round(30 + (10 - 30) * gradFactor);
      let g = Math.round(90 + (37 - 90) * gradFactor);
      let b = Math.round(219 + (96 - 219) * gradFactor);
      let a = 255;

      // Border outline (1px)
      if (x === 0 || x === width - 1 || actualY === 0 || actualY === height - 1) {
        r = 56; g = 189; b = 248; // Cyan accent border
      }

      // Draw stylized "L" character:
      // Vertical stem: x from 9 to 14, actualY from 7 to 25
      // Horizontal base: x from 9 to 23, actualY from 20 to 25
      const isLStem = (x >= 9 && x <= 14 && actualY >= 7 && actualY <= 25);
      const isLBase = (x >= 9 && x <= 23 && actualY >= 20 && actualY <= 25);

      if (isLStem || isLBase) {
        r = 255; g = 255; b = 255; // Crisp White
      }

      // Draw Cyan lightning flash inside / over L
      // Diagonals around x: 14 to 22, actualY: 8 to 19
      const isCyanAccent = (x >= 15 && x <= 20 && actualY >= 9 && actualY <= 15) ||
                           (x >= 17 && x <= 23 && actualY >= 14 && actualY <= 18);
      if (isCyanAccent) {
        r = 56; g = 189; b = 248; // Vibrant Sky Cyan
      }

      // Small Orange dot on top right corner (x: 23-25, actualY: 7-9)
      if (x >= 23 && x <= 25 && actualY >= 7 && actualY <= 9) {
        r = 251; g = 100; b = 27; // Vibrant Lapiez Orange
      }

      // BMP stores in BGRA order:
      pixels[idx] = b;
      pixels[idx + 1] = g;
      pixels[idx + 2] = r;
      pixels[idx + 3] = a;
    }
  }

  pixels.copy(buf, offset);
  offset += pixelDataSize;

  // 5. AND mask (all 0s = fully opaque where alpha is 255, 1s where alpha is 0)
  const andMask = Buffer.alloc(andMaskSize, 0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = (y * width + x) * 4;
      if (pixels[pIdx + 3] === 0) {
        const maskByteIdx = Math.floor((y * width + x) / 8);
        const maskBitIdx = 7 - ((y * width + x) % 8);
        andMask[maskByteIdx] |= (1 << maskBitIdx);
      }
    }
  }
  andMask.copy(buf, offset);

  return buf;
}

const icoBuf = createLapiezIcoBuffer();

// Overwrite app/favicon.ico
const appFaviconPath = path.join(__dirname, '..', 'app', 'favicon.ico');
fs.writeFileSync(appFaviconPath, icoBuf);
console.log('✅ Replaced app/favicon.ico with official Lapiez icon (' + icoBuf.length + ' bytes)');

// Write public/favicon.ico
const pubFaviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');
fs.writeFileSync(pubFaviconPath, icoBuf);
console.log('✅ Created public/favicon.ico (' + icoBuf.length + ' bytes)');
