#!/usr/bin/env node

/**
 * Flower Image Organizer Script
 * 
 * This script helps organize and analyze flower images
 * Run with: node scripts/organize-flowers.js
 */

const fs = require('fs');
const path = require('path');

const FLOWERS_DIR = path.join(__dirname, '../public/images/flowers');
const COLORS = ['red', 'pink', 'white', 'yellow', 'purple', 'orange', 'mixed'];

function analyzeFlowerImages() {
  console.log('🌸 Analyzing Flower Images...\n');
  
  const analysis = {};
  
  COLORS.forEach(color => {
    const colorDir = path.join(FLOWERS_DIR, color);
    if (fs.existsSync(colorDir)) {
      const files = fs.readdirSync(colorDir)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
      
      analysis[color] = {
        count: files.length,
        files: files,
        types: extractFlowerTypes(files, color)
      };
    }
  });
  
  return analysis;
}

function extractFlowerTypes(files, color) {
  const types = new Set();
  
  files.forEach((file, index) => {
    // For WhatsApp images, create meaningful names based on color and position
    const flowerTypes = {
      red: ['Rose', 'Tulip', 'Carnation', 'Poppy', 'Geranium', 'Chrysanthemum', 'Dahlia'],
      pink: ['Rose', 'Peony', 'Cherry Blossom', 'Carnation', 'Azalea', 'Camellia'],
      white: ['Lily', 'Rose', 'Daisy', 'Gardenia', 'Calla Lily', 'Orchid', 'Magnolia'],
      yellow: ['Sunflower', 'Rose', 'Daffodil', 'Marigold', 'Dandelion', 'Tulip'],
      purple: ['Lavender', 'Iris', 'Violet', 'Orchid', 'Lilac', 'Pansy'],
      orange: ['Marigold', 'Rose', 'Lily', 'Zinnia', 'Calendula', 'Tulip'],
      mixed: ['Bouquet', 'Arrangement', 'Mixed Flowers', 'Gift Set', 'Wedding Bouquet', 'Seasonal Mix']
    };
    
    const availableTypes = flowerTypes[color] || ['Flower'];
    const typeIndex = index % availableTypes.length;
    types.add(availableTypes[typeIndex]);
  });
  
  return Array.from(types);
}

function generateProductData(analysis) {
  console.log('📝 Generating Product Data...\n');
  
  const products = [];
  let productId = 1;
  
  const flowerTypes = {
    red: ['Rose', 'Tulip', 'Carnation', 'Poppy', 'Geranium', 'Chrysanthemum', 'Dahlia'],
    pink: ['Rose', 'Peony', 'Cherry Blossom', 'Carnation', 'Azalea', 'Camellia'],
    white: ['Lily', 'Rose', 'Daisy', 'Gardenia', 'Calla Lily', 'Orchid', 'Magnolia'],
    yellow: ['Sunflower', 'Rose', 'Daffodil', 'Marigold', 'Dandelion', 'Tulip'],
    purple: ['Lavender', 'Iris', 'Violet', 'Orchid', 'Lilac', 'Pansy'],
    orange: ['Marigold', 'Rose', 'Lily', 'Zinnia', 'Calendula', 'Tulip'],
    mixed: ['Bouquet', 'Arrangement', 'Mixed Flowers', 'Gift Set', 'Wedding Bouquet', 'Seasonal Mix']
  };
  
  Object.entries(analysis).forEach(([color, data]) => {
    data.files.forEach((file, index) => {
      const availableTypes = flowerTypes[color] || ['Flower'];
      const flowerType = availableTypes[index % availableTypes.length];
      const name = `${color.charAt(0).toUpperCase() + color.slice(1)} ${flowerType}`;
      
      // Generate realistic prices based on flower type and color
      const basePrices = {
        red: { Rose: 35, Tulip: 25, Carnation: 20, Poppy: 18, Geranium: 15, Chrysanthemum: 22, Dahlia: 28 },
        pink: { Rose: 32, Peony: 40, 'Cherry Blossom': 30, Carnation: 18, Azalea: 25, Camellia: 35 },
        white: { Lily: 30, Rose: 30, Daisy: 15, Gardenia: 35, 'Calla Lily': 45, Orchid: 50, Magnolia: 40 },
        yellow: { Sunflower: 20, Rose: 28, Daffodil: 18, Marigold: 12, Dandelion: 8, Tulip: 22 },
        purple: { Lavender: 25, Iris: 35, Violet: 20, Orchid: 45, Lilac: 30, Pansy: 15 },
        orange: { Marigold: 15, Rose: 30, Lily: 35, Zinnia: 18, Calendula: 20, Tulip: 25 },
        mixed: { Bouquet: 60, Arrangement: 75, 'Mixed Flowers': 50, 'Gift Set': 80, 'Wedding Bouquet': 120, 'Seasonal Mix': 45 }
      };
      
      const price = basePrices[color]?.[flowerType] || 25;
      
      products.push({
        id: productId++,
        name: name,
        price: price,
        image: `/images/flowers/${color}/${file}`,
        category: 'flowers',
        featured: index < 2, // First 2 images per color are featured
        description: `Beautiful ${color} ${flowerType.toLowerCase()} from Akazuba Florist. Perfect for any occasion.`,
        color: color,
        type: flowerType
      });
    });
  });
  
  return products;
}

function saveProductData(products) {
  const outputPath = path.join(__dirname, '../data/real-flowers.ts');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const content = `// Auto-generated from real flower images
// Generated on: ${new Date().toISOString()}

export interface RealFlowerProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: 'flowers';
  featured: boolean;
  description: string;
  color: string;
  type: string;
}

export const realFlowerProducts: RealFlowerProduct[] = ${JSON.stringify(products, null, 2)};

export default realFlowerProducts;
`;

  fs.writeFileSync(outputPath, content);
  console.log(`✅ Product data saved to: ${outputPath}`);
}

function main() {
  try {
    // Check if flowers directory exists
    if (!fs.existsSync(FLOWERS_DIR)) {
      console.log('❌ Flowers directory not found. Please add images first.');
      return;
    }
    
    // Analyze images
    const analysis = analyzeFlowerImages();
    
    // Display analysis
    console.log('📊 Image Analysis Results:\n');
    Object.entries(analysis).forEach(([color, data]) => {
      console.log(`${color.toUpperCase()}: ${data.count} images`);
      if (data.types.length > 0) {
        console.log(`  Types: ${data.types.join(', ')}`);
      }
      console.log('');
    });
    
    // Generate product data
    const products = generateProductData(analysis);
    
    // Save to file
    saveProductData(products);
    
    console.log(`🎉 Successfully processed ${products.length} flower images!`);
    console.log('\nNext steps:');
    console.log('1. Review the generated data in data/real-flowers.ts');
    console.log('2. Update your product data to use real images');
    console.log('3. Test the website with your actual flower photos');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeFlowerImages, generateProductData }; 