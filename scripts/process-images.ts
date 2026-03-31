import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getImageProcessingList } from '../src/lib/products';

const OUTPUT_DIR = path.join(process.cwd(), 'public/images/products');
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 85;

async function processImages() {
  console.log('🔍 Scanning for images to process...');

  const imagesToProcess = getImageProcessingList();

  if (imagesToProcess.length === 0) {
    console.log('✅ No local images found to process.');
    return;
  }

  console.log(`🖼️  Found ${imagesToProcess.length} images to process`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const image of imagesToProcess) {
    const productOutputDir = path.join(OUTPUT_DIR, image.outputDir);

    // Create product subdirectory if it doesn't exist
    if (!fs.existsSync(productOutputDir)) {
      fs.mkdirSync(productOutputDir, { recursive: true });
    }

    const outputPath = path.join(productOutputDir, image.outputFileName);

    // Check if already processed and up to date
    if (fs.existsSync(outputPath)) {
      const inputStat = fs.statSync(image.inputPath);
      const outputStat = fs.statSync(outputPath);

      if (outputStat.mtime >= inputStat.mtime) {
        console.log(`  ⏭️  Skipping ${image.productId}/${path.basename(image.inputPath)} (up to date)`);
        skipped++;
        continue;
      }
    }

    try {
      console.log(`  🔄 Processing ${image.productId}/${path.basename(image.inputPath)}...`);

      const sharpInstance = sharp(image.inputPath);
      const metadata = await sharpInstance.metadata();

      // Determine if resizing is needed
      let resizeOptions: sharp.ResizeOptions | undefined;
      if ((metadata.width && metadata.width > MAX_WIDTH) ||
          (metadata.height && metadata.height > MAX_HEIGHT)) {
        resizeOptions = {
          width: MAX_WIDTH,
          height: MAX_HEIGHT,
          fit: 'inside',
          withoutEnlargement: true
        };
      }

      // Process image
      let pipeline = sharpInstance;

      if (resizeOptions) {
        pipeline = pipeline.resize(resizeOptions);
      }

      // Convert to WebP for optimal compression
      await pipeline
        .webp({
          quality: QUALITY,
          effort: 6, // Compression effort (0-6, higher = smaller file)
          smartSubsample: true
        })
        .toFile(outputPath);

      // Get file sizes for comparison
      const inputSize = fs.statSync(image.inputPath).size;
      const outputSize = fs.statSync(outputPath).size;
      const savings = ((inputSize - outputSize) / inputSize * 100).toFixed(1);

      console.log(`  ✅ Saved ${image.outputFileName} (${savings}% smaller)`);
      processed++;

    } catch (error) {
      console.error(`  ❌ Failed to process ${image.inputPath}:`, error);
      failed++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Processed: ${processed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);
  console.log('\n✨ Image processing complete!');
}

// Run if called directly
if (require.main === module) {
  processImages().catch(err => {
    console.error('💥 Image processing failed:', err);
    process.exit(1);
  });
}

export { processImages };
