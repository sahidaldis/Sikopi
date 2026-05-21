import { Jimp } from "jimp";
import path from "path";

async function main() {
  try {
    const inputPath = path.resolve("./public/logo.png");
    const outputPath = path.resolve("./public/logo-512.png");
    
    console.log("Reading image...");
    const image = await Jimp.read(inputPath);
    
    // Resize so it fits within 512x512
    console.log("Resizing and padding to 512x512...");
    image.contain({ w: 512, h: 512 });
    
    console.log("Writing image...");
    await image.write(outputPath);
    console.log("Successfully created logo-512.png");
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
