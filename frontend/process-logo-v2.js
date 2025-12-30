import sharp from "sharp";

const inputPath = "src/assets/zakat-logo-original.png";
const outputPath = "src/assets/zakat-logo-processed.png";

async function processLogo() {
  try {
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    const pixelArray = data;

    // Helper to get pixel index
    const getIdx = (x, y) => (y * width + x) * 4;

    // Helper to check if pixel is "White" (Background corner)
    const isWhite = (idx) => {
      const r = pixelArray[idx];
      const g = pixelArray[idx + 1];
      const b = pixelArray[idx + 2];
      return r > 200 && g > 200 && b > 200;
    };

    // Flood fill to remove white outer corners
    const queue = [];
    const visited = new Set();

    // Add corners to queue if they are white
    const corners = [
      [0, 0],
      [width - 1, 0],
      [0, height - 1],
      [width - 1, height - 1],
    ];

    corners.forEach(([x, y]) => {
      const idx = getIdx(x, y);
      if (isWhite(idx)) {
        queue.push([x, y]);
        visited.add(idx);
      }
    });

    while (queue.length > 0) {
      const [x, y] = queue.pop();
      const idx = getIdx(x, y);

      // Make transparent
      pixelArray[idx + 3] = 0;

      // Check neighbors
      const neighbors = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = getIdx(nx, ny);
          if (!visited.has(nIdx) && isWhite(nIdx)) {
            visited.add(nIdx);
            queue.push([nx, ny]);
          }
        }
      }
    }

    // Now iterate all pixels to remove the black circle background
    // and ensure remaining pixels (the icon lines) are white
    for (let i = 0; i < pixelArray.length; i += 4) {
      // Skip if we already made it transparent in flood fill
      if (pixelArray[i + 3] === 0) continue;

      const r = pixelArray[i];
      const g = pixelArray[i + 1];
      const b = pixelArray[i + 2];

      // If it's dark (Black background of the circle), make transparent
      // Increased threshold slightly to catch anti-aliasing edges
      if (r < 80 && g < 80 && b < 80) {
        pixelArray[i + 3] = 0;
      } else {
        // It's not dark, and not the white exterior corner (handled by flood fill).
        // It must be the white icon lines.
        // Force to pure white
        pixelArray[i] = 255;
        pixelArray[i + 1] = 255;
        pixelArray[i + 2] = 255;
        pixelArray[i + 3] = 255;
      }
    }

    await sharp(pixelArray, {
      raw: { width, height, channels: 4 },
    })
      .png()
      .toFile(outputPath);

    console.log("Logo processed: Removed white corners and black background.");
  } catch (err) {
    console.error("Error processing logo:", err);
  }
}

processLogo();
