const fs = require('fs');
const path = require('path');

// Get the flower products data
const flowerDataPath = path.join(__dirname, '../data/real-flowers.ts');
const flowerDataContent = fs.readFileSync(flowerDataPath, 'utf8');

// Extract image paths from the data
const imagePathRegex = /"image":\s*"([^"]+)"/g;
const imagePaths = [];
let match;

while ((match = imagePathRegex.exec(flowerDataContent)) !== null) {
  imagePaths.push(match[1]);
}

console.log('🌸 Flower Image Verification Script');
console.log('=====================================\n');

const publicDir = path.join(__dirname, '../public');
let totalImages = 0;
let foundImages = 0;
let missingImages = [];

console.log('📁 Checking image accessibility...\n');

imagePaths.forEach((imagePath, index) => {
  totalImages++;
  const fullPath = path.join(publicDir, imagePath);
  
  if (fs.existsSync(fullPath)) {
    foundImages++;
    const stats = fs.statSync(fullPath);
    const sizeInKB = Math.round(stats.size / 1024);
    console.log(`✅ ${imagePath} (${sizeInKB}KB)`);
  } else {
    missingImages.push(imagePath);
    console.log(`❌ ${imagePath} - MISSING`);
  }
});

console.log('\n📊 Summary:');
console.log(`Total images referenced: ${totalImages}`);
console.log(`Found images: ${foundImages}`);
console.log(`Missing images: ${missingImages.length}`);

if (missingImages.length > 0) {
  console.log('\n❌ Missing images:');
  missingImages.forEach(img => console.log(`   - ${img}`));
} else {
  console.log('\n🎉 All images are accessible!');
}

console.log('\n🌐 Your website should now display all the real flower images!');
console.log('Visit http://localhost:3001 to see your beautiful flower collection.'); 