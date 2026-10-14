const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height) {
  // RGBA buffer
  const rgba = Buffer.alloc(width * height * 4);

  // Fill with tech gradient background and "LAPIEZ" mark
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Icon area: x: 10 to 80, y: 10 to 80
      const isIcon = x >= 10 && x <= 80 && y >= 10 && y <= 80;
      if (isIcon) {
        // Icon rounded rect
        const ix = x - 10;
        const iy = y - 10;
        const r = 16;
        let inside = true;
        if (ix < r && iy < r) inside = (ix - r) ** 2 + (iy - r) ** 2 <= r ** 2;
        else if (ix > 70 - r && iy < r) inside = (ix - (70 - r)) ** 2 + (iy - r) ** 2 <= r ** 2;
        else if (ix < r && iy > 70 - r) inside = (ix - r) ** 2 + (iy - (70 - r)) ** 2 <= r ** 2;
        else if (ix > 70 - r && iy > 70 - r) inside = (ix - (70 - r)) ** 2 + (iy - (70 - r)) ** 2 <= r ** 2;

        if (inside) {
          // Blue to dark blue gradient
          const factor = (ix + iy) / 140;
          let rVal = Math.round(37 * (1 - factor) + 10 * factor);
          let gVal = Math.round(99 * (1 - factor) + 37 * factor);
          let bVal = Math.round(235 * (1 - factor) + 96 * factor);

          // White L Monogram inside icon
          const isL_vert = ix >= 25 && ix <= 33 && iy >= 22 && iy <= 54;
          const isL_horiz = ix >= 25 && ix <= 52 && iy >= 46 && iy <= 54;
          const isL_slash = ix >= 34 && ix <= 44 && iy >= 28 && iy <= 38;

          if (isL_vert || isL_horiz) {
            rgba[idx] = 255;
            rgba[idx + 1] = 255;
            rgba[idx + 2] = 255;
            rgba[idx + 3] = 255;
          } else if (isL_slash) {
            // Cyan lightning accent
            rgba[idx] = 56;
            rgba[idx + 1] = 189;
            rgba[idx + 2] = 248;
            rgba[idx + 3] = 255;
          } else {
            rgba[idx] = rVal;
            rgba[idx + 1] = gVal;
            rgba[idx + 2] = bVal;
            rgba[idx + 3] = 255;
          }
          continue;
        }
      }

      // Transparent outside
      rgba[idx] = 0;
      rgba[idx + 1] = 0;
      rgba[idx + 2] = 0;
      rgba[idx + 3] = 0;
    }
  }

  // PNG scanlines (each row starts with filter byte 0)
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(height * scanlineLength);

  for (let y = 0; y < height; y++) {
    const rawOffset = y * scanlineLength;
    rawData[rawOffset] = 0; // Filter None
    rgba.copy(rawData, rawOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const deflated = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const checksum = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(checksum, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // PNG Header
  const pngHeader = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // Bit depth
  ihdr.writeUInt8(6, 9); // Color type (RGBA)
  ihdr.writeUInt8(0, 10); // Compression
  ihdr.writeUInt8(0, 11); // Filter
  ihdr.writeUInt8(0, 12); // Interlace
  const ihdrChunk = chunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = chunk('IDAT', deflated);

  // IEND chunk
  const iendChunk = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
}

const logoPng = createPng(420, 90);
const dest1 = path.join(__dirname, '..', 'public', 'images', 'logo.png');
fs.writeFileSync(dest1, logoPng);
console.log('Successfully wrote', dest1, 'size:', logoPng.length);
