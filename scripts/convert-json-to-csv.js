const fs = require('fs');
const path = require('path');

// Read the clean JSON data
const jsonData = JSON.parse(fs.readFileSync('data/clean-products-no-duplicates.json', 'utf8'));

console.log('🔄 Converting JSON to CSV format...');
console.log(`📊 Processing ${jsonData.length} products`);

// CSV header
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

// Convert products to CSV rows
const csvRows = [csvHeader];

jsonData.forEach((product, index) => {
  try {
    const row = [
      `"${(product.name || '').replace(/"/g, '""')}"`, // Escape quotes in name
      product.price || 0,
      `"${(product.description || '').replace(/"/g, '""')}"`, // Escape quotes in description
      `"${(product.description || '').substring(0, 150).replace(/"/g, '""')}"`, // Short description
      product.category || 'flowers',
      product.color || '',
      product.type || '',
      `"${(product.images || []).join('|')}"`, // Pipe-separated images
      `"${(product.videos || []).join('|')}"`, // Pipe-separated videos
      product.stockQuantity || 10,
      product.isActive !== false ? 'true' : 'false',
      product.isFeatured || false
    ];
    
    csvRows.push(row.join(','));
  } catch (error) {
    console.error(`❌ Error processing product ${index + 1}:`, error.message);
  }
});

// Write CSV file
const csvContent = csvRows.join('\n');
const csvPath = 'data/products-import.csv';

fs.writeFileSync(csvPath, csvContent, 'utf8');

console.log(`✅ CSV file created: ${csvPath}`);
console.log(`📊 Total rows: ${csvRows.length - 1} products + 1 header`);
console.log(`📁 File size: ${(fs.statSync(csvPath).size / 1024).toFixed(2)} KB`);

// Also create a smaller test file with first 10 products
const testCsvRows = [csvHeader, ...csvRows.slice(1, 11)];
const testCsvPath = 'data/products-test-import.csv';
fs.writeFileSync(testCsvPath, testCsvRows.join('\n'), 'utf8');

console.log(`🧪 Test CSV file created: ${testCsvPath} (10 products)`);

// Generate import instructions
const instructions = `
📋 CSV Import Instructions:

1. Use the CSV file: ${csvPath}
2. Or test with: ${testCsvPath} (first 10 products)

📝 CSV Format:
- Images: Pipe-separated (|) URLs
- Videos: Pipe-separated (|) URLs  
- All text fields are quoted and escaped
- Categories should match your database categories

🔧 To import via API:
- Use POST /api/admin/products/import-csv
- Send CSV content as text/plain in request body
- Or use the admin panel CSV import feature

⚠️  Before importing:
1. Verify categories exist in database
2. Check image/video file paths are accessible
3. Test with small batch first
`;

console.log(instructions);

// Save instructions to file
fs.writeFileSync('data/CSV_IMPORT_INSTRUCTIONS.txt', instructions);
console.log('💾 Instructions saved to: data/CSV_IMPORT_INSTRUCTIONS.txt');
