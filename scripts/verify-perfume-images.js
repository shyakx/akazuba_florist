const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Perfume Images');

// List of perfume images to verify
const perfumeImages = [
  'A BEAUTFUL PUPPET.jpg',
  'perfume-1.jpg',
  'perfume-10.png',
  'perfume-2.jpg',
  'perfume-3.png',
  'perfume-4.jpeg',
  'perfume-5.png',
  'perfume-6.jpg',
  'perfume-7.png',
  'perfume-8.jpeg',
  'perfume-9.png',
  'placeholder-perfume.jpg'
];

console.log('📂 Perfume Images Found:');
perfumeImages.forEach((image, index) => {
  const imagePath = path.join(__dirname, '../public/images/perfumes', image);
  const exists = fs.existsSync(imagePath);
  const stats = exists ? fs.statSync(imagePath) : null;
  
  console.log(`${index + 1}. ${image}`);
  console.log(`   Path: ${imagePath}`);
  console.log(`   Exists: ${exists ? '✅' : '❌'}`);
  if (exists && stats) {
    console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
    console.log(`   Modified: ${stats.mtime.toLocaleDateString()}`);
  }
  console.log('');
});

// Check for potential issues
console.log('⚠️ Potential Issues to Check:');
console.log('1. "A BEAUTFUL PUPPET.jpg" - This might be a puppet, not a perfume');
console.log('2. "placeholder-perfume.jpg" - This is a placeholder, not a real perfume');
console.log('3. Need to verify if perfume-1.jpg through perfume-10.png are actually perfumes');

console.log('\n💡 Recommendations:');
console.log('1. Manually check each image to confirm it shows a perfume bottle');
console.log('2. Remove "placeholder-perfume.jpg" from the list');
console.log('3. Verify "A BEAUTFUL PUPPET.jpg" is actually a perfume with puppet design');
console.log('4. Ensure perfume-1.jpg through perfume-10.png are unique perfume images');

console.log('\n🔍 To verify images:');
console.log('1. Open public/images/perfumes/ folder');
console.log('2. Check each image file');
console.log('3. Confirm they show actual perfume bottles/products');
console.log('4. Remove any that are not perfumes or are duplicates');

// Create a filtered list of likely real perfumes
const likelyPerfumes = perfumeImages.filter(image => 
  !image.includes('placeholder') && 
  !image.includes('PUPPET')
);

console.log(`\n📊 Filtered Perfume List (${likelyPerfumes.length} items):`);
likelyPerfumes.forEach((image, index) => {
  console.log(`${index + 1}. ${image}`);
});

console.log('\n🎯 Next Steps:');
console.log('1. Manually verify each image is a real perfume');
console.log('2. Update the perfume import script with verified images only');
console.log('3. Remove any non-perfume images from the import');
