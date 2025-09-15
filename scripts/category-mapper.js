const fs = require('fs');

// Read the clean JSON data
const data = JSON.parse(fs.readFileSync('data/clean-products-no-duplicates.json', 'utf8'));

console.log('🗺️ Category Mapping Script');
console.log(`📊 Processing ${data.length} products`);

// Define category mapping rules based on product characteristics
const categoryMappingRules = {
  // Red flowers -> Valentine's Day (romantic occasions)
  red: {
    keywords: ['red', 'rose', 'heart', 'valentine', 'love', 'romantic'],
    categories: ['valentine', 'anniversary', 'date']
  },
  
  // Pink flowers -> Valentine's Day, Mother's Day, Engagement
  pink: {
    keywords: ['pink', 'rose', 'heart', 'valentine', 'mother', 'engagement', 'feminine'],
    categories: ['valentine', 'mothers-day', 'engagement', 'birthday']
  },
  
  // White flowers -> Wedding, Funerals
  white: {
    keywords: ['white', 'wedding', 'funeral', 'pure', 'elegant', 'ceremony'],
    categories: ['wedding', 'funerals', 'engagement']
  },
  
  // Yellow flowers -> Graduation, Birthday (celebratory)
  yellow: {
    keywords: ['yellow', 'bright', 'cheerful', 'graduation', 'celebration', 'sunshine'],
    categories: ['graduation', 'birthday', 'airport-pickup']
  },
  
  // Mixed colors -> Birthday, Special occasions
  mixed: {
    keywords: ['mixed', 'colorful', 'bouquet', 'variety', 'celebration'],
    categories: ['birthday', 'special-occasions', 'airport-pickup']
  },
  
  // Purple flowers -> Special occasions, Anniversary
  purple: {
    keywords: ['purple', 'luxury', 'premium', 'special', 'elegant'],
    categories: ['special-occasions', 'anniversary', 'engagement']
  },
  
  // Orange flowers -> Birthday, Graduation (energetic colors)
  orange: {
    keywords: ['orange', 'bright', 'energetic', 'warm'],
    categories: ['birthday', 'graduation']
  },
  
  // Green flowers -> General, Mother's Day (natural)
  green: {
    keywords: ['green', 'natural', 'fresh', 'foliage'],
    categories: ['mothers-day', 'special-occasions']
  }
};

// Function to determine the best category for a product
function getBestCategory(product) {
  const color = (product.color || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const description = (product.description || '').toLowerCase();
  const type = (product.type || '').toLowerCase();
  
  // Combine all text for keyword matching
  const allText = `${name} ${description} ${type}`.toLowerCase();
  
  // Get mapping rules for this color
  const rules = categoryMappingRules[color];
  if (!rules) {
    // Default fallback categories
    if (allText.includes('wedding') || allText.includes('bridal')) return 'wedding';
    if (allText.includes('funeral') || allText.includes('memorial')) return 'funerals';
    if (allText.includes('valentine') || allText.includes('heart')) return 'valentine';
    if (allText.includes('birthday') || allText.includes('celebration')) return 'birthday';
    return 'birthday'; // Default fallback
  }
  
  // Check for specific keywords in the text
  for (const keyword of rules.keywords) {
    if (allText.includes(keyword)) {
      // Return the first matching category from the rules
      return rules.categories[0];
    }
  }
  
  // If no specific keyword matches, use the first category from rules
  return rules.categories[0];
}

// Function to get additional categories based on product characteristics
function getAdditionalCategories(product) {
  const categories = [];
  const color = (product.color || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const description = (product.description || '').toLowerCase();
  
  const allText = `${name} ${description}`.toLowerCase();
  
  // Add secondary categories based on content
  if (allText.includes('gift') || allText.includes('package')) {
    categories.push('special-occasions');
  }
  
  if (allText.includes('bucket') || allText.includes('arrangement')) {
    categories.push('special-occasions');
  }
  
  // Color-specific additional categories
  if (color === 'red' && allText.includes('rose')) {
    categories.push('anniversary');
  }
  
  if (color === 'white' && allText.includes('elegant')) {
    categories.push('engagement');
  }
  
  if (color === 'mixed' && allText.includes('bouquet')) {
    categories.push('birthday');
  }
  
  return [...new Set(categories)]; // Remove duplicates
}

// Process products and map categories
const mappedProducts = data.map((product, index) => {
  const originalCategory = product.category;
  
  // Skip if already a specific category (not 'flowers')
  if (originalCategory !== 'flowers') {
    return product;
  }
  
  // Get the best primary category
  const primaryCategory = getBestCategory(product);
  
  // Get additional categories
  const additionalCategories = getAdditionalCategories(product);
  
  // Create categoryIds array
  const categoryIds = [primaryCategory, ...additionalCategories];
  
  console.log(`📝 Product ${index + 1}: "${product.name}"`);
  console.log(`   Original: ${originalCategory}`);
  console.log(`   Mapped to: ${primaryCategory}`);
  if (additionalCategories.length > 0) {
    console.log(`   Additional: ${additionalCategories.join(', ')}`);
  }
  
  return {
    ...product,
    category: primaryCategory,
    categoryName: primaryCategory,
    categoryIds: categoryIds
  };
});

// Generate statistics
const categoryStats = {};
mappedProducts.forEach(product => {
  const cat = product.category;
  categoryStats[cat] = (categoryStats[cat] || 0) + 1;
});

console.log('\n📊 Category Distribution:');
Object.entries(categoryStats)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    console.log(`   ${category}: ${count} products`);
  });

// Save mapped data
const outputPath = 'data/products-with-mapped-categories.json';
fs.writeFileSync(outputPath, JSON.stringify(mappedProducts, null, 2));

console.log(`\n✅ Mapped data saved to: ${outputPath}`);
console.log(`📊 Total products processed: ${mappedProducts.length}`);

// Also create a summary report
const report = {
  totalProducts: mappedProducts.length,
  categoryDistribution: categoryStats,
  mappingRules: categoryMappingRules,
  processedAt: new Date().toISOString()
};

fs.writeFileSync('data/category-mapping-report.json', JSON.stringify(report, null, 2));
console.log('📋 Mapping report saved to: data/category-mapping-report.json');

// Create a CSV version with mapped categories
const csvHeader = [
  'name',
  'price',
  'description',
  'shortDescription',
  'category',
  'color',
  'type',
  'images',
  'videos',
  'stockQuantity',
  'isActive',
  'isFeatured'
].join(',');

const csvRows = [csvHeader];

mappedProducts.forEach((product) => {
  const row = [
    `"${(product.name || '').replace(/"/g, '""')}"`,
    product.price || 0,
    `"${(product.description || '').replace(/"/g, '""')}"`,
    `"${(product.description || '').substring(0, 150).replace(/"/g, '""')}"`,
    product.category || 'birthday',
    product.color || '',
    product.type || '',
    `"${(product.images || []).join('|')}"`,
    `"${(product.videos || []).join('|')}"`,
    product.stockQuantity || 10,
    product.isActive !== false ? 'true' : 'false',
    product.isFeatured || false
  ];
  
  csvRows.push(row.join(','));
});

const csvContent = csvRows.join('\n');
const csvPath = 'data/products-with-mapped-categories.csv';
fs.writeFileSync(csvPath, csvContent, 'utf8');

console.log(`📊 CSV with mapped categories saved to: ${csvPath}`);

console.log('\n🎯 Next Steps:');
console.log('1. Review the category mapping in the generated files');
console.log('2. Test import with the mapped JSON file');
console.log('3. Verify products appear in correct categories on UI');
console.log('4. Adjust mapping rules if needed');
