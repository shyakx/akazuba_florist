const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing Image Duplicates and Creating Unique Mapping');

async function analyzeImageDuplicates() {
  try {
    // Read current product data
    const dataPath = path.join(__dirname, '../data/clean-products-final.json');
    const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`📦 Analyzing ${products.length} products...`);
    
    // Track image usage
    const imageUsage = {};
    const productImageMap = {};
    
    // Analyze each product's images
    products.forEach((product, index) => {
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach(imagePath => {
          if (typeof imagePath === 'string') {
            const fileName = path.basename(imagePath);
            
            if (!imageUsage[fileName]) {
              imageUsage[fileName] = [];
            }
            imageUsage[fileName].push({
              productIndex: index,
              productName: product.name,
              fullPath: imagePath
            });
          }
        });
      }
    });
    
    // Find duplicates
    const duplicates = Object.entries(imageUsage).filter(([fileName, usage]) => usage.length > 1);
    const uniqueImages = Object.entries(imageUsage).filter(([fileName, usage]) => usage.length === 1);
    
    console.log(`\n📊 Image Analysis Results:`);
    console.log(`   Total unique image files: ${Object.keys(imageUsage).length}`);
    console.log(`   Duplicate images: ${duplicates.length}`);
    console.log(`   Unique images: ${uniqueImages.length}`);
    
    // Show duplicates
    if (duplicates.length > 0) {
      console.log(`\n🔄 Duplicate Images Found:`);
      duplicates.forEach(([fileName, usage]) => {
        console.log(`   ${fileName} (used ${usage.length} times):`);
        usage.forEach(use => {
          console.log(`     - ${use.productName}`);
        });
      });
    }
    
    // Create mapping for unique products
    const uniqueProducts = [];
    const usedImages = new Set();
    
    // Process products and assign unique images
    products.forEach((product, index) => {
      if (product.images && Array.isArray(product.images)) {
        const availableImages = product.images.filter(imagePath => {
          const fileName = path.basename(imagePath);
          return !usedImages.has(fileName);
        });
        
        if (availableImages.length > 0) {
          // Take only the first available image for this product
          const selectedImage = availableImages[0];
          const fileName = path.basename(selectedImage);
          usedImages.add(fileName);
          
          // Determine category based on image name and product name
          let category = 'Special Occasions'; // default
          const lowerName = product.name.toLowerCase();
          const lowerImage = selectedImage.toLowerCase();
          
          if (lowerName.includes('valentine') || lowerName.includes('heart') || lowerImage.includes('heart')) {
            category = 'Valentine';
          } else if (lowerName.includes('birthday') || lowerName.includes('cake')) {
            category = 'Birthday';
          } else if (lowerName.includes('wedding') || lowerName.includes('white') || lowerImage.includes('wedding')) {
            category = 'Wedding';
          } else if (lowerName.includes('graduation') || lowerName.includes('graduation')) {
            category = 'Graduation';
          } else if (lowerName.includes('funeral') || lowerName.includes('sympathy')) {
            category = 'Funerals';
          } else if (lowerName.includes('mother') || lowerName.includes('mom')) {
            category = 'Mother\'s Day';
          } else if (lowerName.includes('red') || lowerImage.includes('red')) {
            category = 'Valentine';
          } else if (lowerName.includes('pink') || lowerImage.includes('pink')) {
            category = 'Valentine';
          } else if (lowerName.includes('purple') || lowerImage.includes('purple')) {
            category = 'Special Occasions';
          } else if (lowerName.includes('yellow') || lowerImage.includes('yellow')) {
            category = 'Birthday';
          } else if (lowerName.includes('white') || lowerImage.includes('white')) {
            category = 'Wedding';
          }
          
          uniqueProducts.push({
            name: product.name,
            description: product.description,
            price: product.price,
            category: category,
            categoryName: category,
            categoryIds: [category.toLowerCase().replace(/\s+/g, '-').replace("'", '')],
            images: [selectedImage],
            videos: product.videos || []
          });
        }
      }
    });
    
    console.log(`\n✅ Unique Products Created: ${uniqueProducts.length}`);
    
    // Show category distribution
    const categoryCounts = {};
    uniqueProducts.forEach(product => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });
    
    console.log(`\n📂 Category Distribution:`);
    Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   ${category}: ${count} products`);
      });
    
    // Save unique products
    const outputPath = path.join(__dirname, '../data/unique-products-final.json');
    fs.writeFileSync(outputPath, JSON.stringify(uniqueProducts, null, 2));
    
    console.log(`\n💾 Saved unique products to: ${outputPath}`);
    console.log(`📊 Final count: ${uniqueProducts.length} unique products`);
    
    // Create CSV version
    const csvContent = [
      'name,description,price,category,categoryName,categoryIds,images,videos',
      ...uniqueProducts.map(product => [
        `"${product.name}"`,
        `"${product.description}"`,
        product.price,
        `"${product.category}"`,
        `"${product.categoryName}"`,
        `"${product.categoryIds.join('|')}"`,
        `"${product.images.join('|')}"`,
        `"${(product.videos || []).join('|')}"`
      ].join(','))
    ].join('\n');
    
    const csvPath = path.join(__dirname, '../data/unique-products-final.csv');
    fs.writeFileSync(csvPath, csvContent);
    
    console.log(`💾 Saved CSV to: ${csvPath}`);
    
    return {
      originalCount: products.length,
      uniqueCount: uniqueProducts.length,
      duplicatesFound: duplicates.length,
      categoryDistribution: categoryCounts
    };
    
  } catch (error) {
    console.error('❌ Error analyzing images:', error);
    return null;
  }
}

analyzeImageDuplicates();
