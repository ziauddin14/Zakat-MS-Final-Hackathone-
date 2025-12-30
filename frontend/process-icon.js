import fs from "fs";
import sharp from "sharp";
import path from "path";

const inputPath = "src/assets/donate-icon.png";
const outputPath = "src/assets/donate-icon-transparent.png";

async function processImage() {
  try {
    const data = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixelArray = data.data;
    const { width, height, channels } = data.info;

    // Iterate over every pixel
    for (let i = 0; i < pixelArray.length; i += channels) {
      const r = pixelArray[i];
      const g = pixelArray[i + 1];
      const b = pixelArray[i + 2];
      // const alpha = pixelArray[i + 3];

      // Check if pixel is close to white (background)
      if (r > 200 && g > 200 && b > 200) {
        pixelArray[i + 3] = 0; // Set alpha to 0 (transparent)
      } else {
        // It's the icon (dark part). Make it white for the button.
        pixelArray[i] = 255; // R
        pixelArray[i + 1] = 255; // G
        pixelArray[i + 2] = 255; // B
        pixelArray[i + 3] = 255; // Alpha full
      }
    }

    await sharp(pixelArray, {
      raw: {
        width,
        height,
        channels,
      },
    })
      .png()
      .toFile(outputPath);

    console.log("Image processed successfully!");
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

processImage();
