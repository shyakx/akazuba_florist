const fs = require('fs');
const path = require('path');

/**
 * Create Clean Products Script
 * 
 * This script creates a clean products file excluding non-product images
 * like logos, cloud sync files, and system files
 */

function createCleanProducts() {
  console.log('🧹 Creating clean products file...\n');
  
  // Read the fixed products file
  const dataPath = path.join(__dirname, '..', 'data', 'fixed-products.json');
  
  if (!fs.existsSync(dataPath)) {
    console.log('❌ Fixed products file not found. Please run the fix-image-paths script first.');
    return;
  }
  
  const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`📦 Processing ${products.length} products...`);
  
  // Files to exclude (non-product files)
  const excludeFiles = [
    'cloud sync.png',
    'cloud-sync-logo.png',
    'company-logo.png',
    'logo.png',
    'image-mapping.txt',
    'README.md'
  ];
  
  let cleanedCount = 0;
  
  // Clean each product
  const cleanProducts = products.map(product => {
    const cleanProduct = { ...product };
    
    // Filter out non-product images
    if (cleanProduct.images && Array.isArray(cleanProduct.images)) {
      const originalCount = cleanProduct.images.length;
      cleanProduct.images = cleanProduct.images.filter(imagePath => {
        const fileName = path.basename(imagePath);
        const shouldExclude = excludeFiles.some(excludeFile => 
          fileName.toLowerCase().includes(excludeFile.toLowerCase())
        );
        
        if (shouldExclude) {
          console.log(`🗑️ Removing non-product file: ${fileName}`);
          return false;
        }
        return true;
      });
      
      if (cleanProduct.images.length !== originalCount) {
        cleanedCount++;
        console.log(`✅ Cleaned ${product.name}: ${originalCount} → ${cleanProduct.images.length} images`);
      }
    }
    
    // If no images left, use placeholder
    if (!cleanProduct.images || cleanProduct.images.length === 0) {
      cleanProduct.images = ['/images/placeholder-flower.jpg'];
      console.log(`⚠️ ${product.name}: No product images, using placeholder`);
    }
    
    return cleanProduct;
  });
  
  // Save clean products
  const cleanJsonPath = path.join(__dirname, '..', 'data', 'clean-products-final.json');
  fs.writeFileSync(cleanJsonPath, JSON.stringify(cleanProducts, null, 2));
  
  // Generate CSV version
  const headers = ['name', 'price', 'description', 'category', 'color', 'type', 'images', 'videos'];
  const csvRows = [headers.join(',')];
  
  for (const product of cleanProducts) {
    const row = [
      `"${product.name}"`,
      product.price,
      `"${product.description}"`,
      product.category,
      product.color,
      product.type,
      `"${product.images.join('|')}"`,
      `"${product.videos.join('|')}"`
    ];
    csvRows.push(row.join(','));
  }
  
  const csvContent = csvRows.join('\n');
  const cleanCsvPath = path.join(__dirname, '..', 'data', 'clean-products-final.csv');
  fs.writeFileSync(cleanCsvPath, csvContent);
  
  console.log(`\n📊 Summary:`);
  console.log(`- Total products: ${products.length}`);
  console.log(`- Products cleaned: ${cleanedCount}`);
  console.log(`- Non-product files removed: ${excludeFiles.join(', ')}`);
  
  // Show sample of cleaned products
  console.log('\n📋 Sample cleaned products:');
  cleanProducts.slice(0, 3).forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}:`);
    console.log(`   Images: ${product.images.slice(0, 2).join(', ')}${product.images.length > 2 ? '...' : ''}`);
  });
  
  console.log(`\n📄 Clean files created:`);
  console.log(`- JSON: ${cleanJsonPath}`);
  console.log(`- CSV: ${cleanCsvPath}`);
  
  console.log('\n✅ Clean products file created!');
  console.log('📝 Next steps:');
  console.log('1. Go to: http://localhost:3000/admin/import');
  console.log('2. Upload: data/clean-products-final.json');
  console.log('3. Import all products (no more cloud sync files!)');
}

// Run the script
if (require.main === module) {
  createCleanProducts();
}

module.exports = { createCleanProducts };
