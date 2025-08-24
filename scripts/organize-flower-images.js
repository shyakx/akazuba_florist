const fs = require('fs');
const path = require('path');

// Define the flower types and their expected images
const flowerTypes = {
  red: [
    'red-rose-1.jpg',
    'red-tulip-1.jpg', 
    'red-carnation-1.jpg',
    'red-poppy-1.jpg',
    'red-geranium-1.jpg',
    'red-chrysanthemum-1.jpg',
    'red-dahlia-1.jpg'
  ],
  pink: [
    'pink-rose-1.jpg',
    'pink-peony-1.jpg',
    'pink-cherry-blossom-1.jpg'
  ],
  white: [
    'white-lily-1.jpg',
    'white-rose-1.jpg',
    'white-daisy-1.jpg'
  ],
  yellow: [
    'yellow-sunflower-1.jpg',
    'yellow-rose-1.jpg'
  ],
  orange: [
    'orange-marigold-1.jpg'
  ],
  mixed: [
    'mixed-bouquet-1.jpg',
    'mixed-arrangement-1.jpg',
    'mixed-flowers-1.jpg',
    'mixed-gift-set-1.jpg',
    'mixed-wedding-bouquet-1.jpg',
    'mixed-seasonal-1.jpg',
    'mixed-bouquet-2.jpg',
    'mixed-arrangement-2.jpg',
    'mixed-flowers-2.jpg',
    'mixed-gift-set-2.jpg'
  ]
};

const flowersDir = path.join(__dirname, '../public/images/flowers');

console.log('🌸 Flower Image Organization Script');
console.log('=====================================\n');

// Check if flowers directory exists
if (!fs.existsSync(flowersDir)) {
  console.error('❌ Flowers directory not found!');
  process.exit(1);
}

// Process each color directory
Object.keys(flowerTypes).forEach(color => {
  const colorDir = path.join(flowersDir, color);
  
  if (!fs.existsSync(colorDir)) {
    console.log(`⚠️  ${color} directory not found, skipping...`);
    return;
  }

  console.log(`📁 Processing ${color} flowers...`);
  
  // Get existing images in the directory
  const existingImages = fs.readdirSync(colorDir)
    .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
    .sort();

  console.log(`   Found ${existingImages.length} images`);
  
  // Create a mapping file for manual review
  const mappingFile = path.join(colorDir, 'image-mapping.txt');
  let mappingContent = `# Image Mapping for ${color} flowers\n`;
  mappingContent += `# Rename your images according to this mapping:\n\n`;
  
  flowerTypes[color].forEach((expectedName, index) => {
    const currentName = existingImages[index] || 'MISSING_IMAGE';
    mappingContent += `${currentName} → ${expectedName}\n`;
  });
  
  fs.writeFileSync(mappingFile, mappingContent);
  console.log(`   ✅ Created mapping file: ${color}/image-mapping.txt`);
  
  // Show what needs to be done
  console.log(`   📋 You need to rename ${Math.min(existingImages.length, flowerTypes[color].length)} images`);
  console.log(`   📋 Expected images: ${flowerTypes[color].length}`);
  console.log('');
});

console.log('🎯 Next Steps:');
console.log('1. Check each color folder for image-mapping.txt');
console.log('2. Rename your actual flower images according to the mapping');
console.log('3. Make sure each image shows the correct flower type');
console.log('4. Remove any unrelated images');
console.log('5. Add missing flower images if needed');
console.log('\n💡 Tip: Use high-quality flower photos for better presentation!'); 