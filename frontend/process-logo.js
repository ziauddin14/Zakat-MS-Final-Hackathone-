import sharp from "sharp";

const inputPath = "src/assets/zakat-logo.png";
const outputPath = "src/assets/zakat-logo-processed.png";

async function processLogo() {
  try {
    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixelArray = data;

    for (let i = 0; i < pixelArray.length; i += 4) {
      const r = pixelArray[i];
      const g = pixelArray[i + 1];
      const b = pixelArray[i + 2];

      // The image is a black circle with white lines.
      // We want to remove the black background (make it transparent)
      // and keep the white lines (or make them theme color, but for now just white to fit in the teal box).

      // If pixel is dark (black background), make transparent
      if (r < 50 && g < 50 && b < 50) {
        pixelArray[i + 3] = 0; // Transparent
      }
      // Else keep it white (or ensure it is white)
      else {
        pixelArray[i] = 255;
        pixelArray[i + 1] = 255;
        pixelArray[i + 2] = 255;
        pixelArray[i + 3] = 255; // Full opacity
      }
    }

    await sharp(pixelArray, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toFile(outputPath);

    console.log("Logo processed successfully!");
  } catch (err) {
    console.error("Error processing logo:", err);
  }
}

processLogo();
