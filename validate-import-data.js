const fs = require('fs');

// Read and validate the import data
const data = JSON.parse(fs.readFileSync('data/clean-products-final.json', 'utf8'));

console.log('📊 Enhanced Import Data Validation');
console.log('Total products:', data.length);

const issues = [];
const categories = new Set();
const nameCounts = {};
const problematicProducts = [];

data.forEach((product, i) => {
  const row = i + 1;
  const productIssues = [];
  
  // Check required fields
  if (!product.name) {
    productIssues.push('Missing name');
  }
  
  if (!product.price || product.price <= 0) {
    productIssues.push(`Invalid price (${product.price})`);
  }
  
  if (!product.description) {
    productIssues.push('Missing description');
  }
  
  if (!product.category) {
    productIssues.push('Missing category');
  } else {
    categories.add(product.category);
  }
  
  // Count name occurrences
  if (product.name) {
    nameCounts[product.name] = (nameCounts[product.name] || 0) + 1;
  }
  
  // Check image array size
  if (product.images && product.images.length > 10) {
    productIssues.push(`Too many images (${product.images.length})`);
  }
  
  // Check for very long descriptions
  if (product.description && product.description.length > 2000) {
    productIssues.push(`Description too long (${product.description.length} chars)`);
  }
  
  // Check for invalid video references
  if (product.videos && product.videos.length > 0) {
    const invalidVideos = product.videos.filter(video => 
      !video.includes('.mp4') && !video.includes('.mov') && !video.includes('.avi')
    );
    if (invalidVideos.length > 0) {
      productIssues.push(`Invalid video format: ${invalidVideos.join(', ')}`);
    }
  }
  
  if (productIssues.length > 0) {
    issues.push(`Row ${row} (${product.name || 'Unknown'}): ${productIssues.join(', ')}`);
    problematicProducts.push({ row, name: product.name, issues: productIssues });
  }
});

// Find duplicate names
const duplicates = Object.entries(nameCounts)
  .filter(([name, count]) => count > 1)
  .map(([name, count]) => `${name} (${count} times)`);

console.log('\n📂 Categories found:', Array.from(categories).sort());

console.log('\n🔍 Duplicate Names:', duplicates.length);
if (duplicates.length > 0) {
  console.log('Duplicates:');
  duplicates.forEach(dup => console.log('- ' + dup));
}

console.log('\n❌ Issues found:', issues.length);
if (issues.length > 0) {
  console.log('\nDetailed Issues:');
  issues.forEach(issue => console.log('- ' + issue));
  
  console.log('\n📊 Summary by Issue Type:');
  const issueTypes = {};
  problematicProducts.forEach(p => {
    p.issues.forEach(issue => {
      issueTypes[issue] = (issueTypes[issue] || 0) + 1;
    });
  });
  Object.entries(issueTypes)
    .sort(([,a], [,b]) => b - a)
    .forEach(([issue, count]) => console.log(`- ${issue}: ${count} products`));
} else {
  console.log('✅ No issues found!');
}

// Check for products with videos
const withVideos = data.filter(p => p.videos && p.videos.length > 0);
console.log(`\n🎥 Products with videos: ${withVideos.length}`);

// Check for products with many images
const withManyImages = data.filter(p => p.images && p.images.length > 10);
console.log(`📸 Products with >10 images: ${withManyImages.length}`);

// Generate clean data without duplicates
console.log('\n🧹 Generating clean data...');
const cleanData = [];
const usedNames = new Set();

data.forEach((product, i) => {
  if (!usedNames.has(product.name) && product.name) {
    usedNames.add(product.name);
    
    // Limit images to 5 max
    const cleanProduct = {
      ...product,
      images: product.images ? product.images.slice(0, 5) : [],
      videos: product.videos ? product.videos.filter(v => v.includes('.mp4')) : []
    };
    
    cleanData.push(cleanProduct);
  }
});

console.log(`✅ Clean data generated: ${cleanData.length} products (removed ${data.length - cleanData.length} duplicates)`);

// Save clean data
fs.writeFileSync('data/clean-products-no-duplicates.json', JSON.stringify(cleanData, null, 2));
console.log('💾 Clean data saved to: data/clean-products-no-duplicates.json');
