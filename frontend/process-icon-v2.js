import sharp from "sharp";

const inputPath = "src/assets/donate-icon.png";
const outputPath = "src/assets/donate-icon-final.png";

async function processImage() {
  try {
    // First setup the pipeline
    let pipeline = sharp(inputPath).ensureAlpha();

    // Get metadata to know dimensions for cropping
    const metadata = await pipeline.metadata();

    // Crop 5 pixels from top to remove the line, keep width same
    const croppedBuffer = await pipeline
      .extract({
        left: 0,
        top: 5,
        width: metadata.width,
        height: metadata.height - 5,
      })
      .toBuffer();

    // Now process pixels for transparency and color
    const { data, info } = await sharp(croppedBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixelArray = data;

    for (let i = 0; i < pixelArray.length; i += 4) {
      const r = pixelArray[i];
      const g = pixelArray[i + 1];
      const b = pixelArray[i + 2];

      // If it's whitish, make it transparent
      // Lowered threshold slightly to catch more "off-white" pixels
      if (r > 150 && g > 150 && b > 150) {
        pixelArray[i + 3] = 0; // Transparent
      } else {
        // Make the icon content pure white
        pixelArray[i] = 255;
        pixelArray[i + 1] = 255;
        pixelArray[i + 2] = 255;
        pixelArray[i + 3] = 255;
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

    console.log("Image processed: Cropped top and colorized successfully!");
  } catch (err) {
    console.error("Error:", err);
  }
}

processImage();
