import { realFlowerProducts } from './real-flowers';

// Use the real flower products generated from actual images
export const products = realFlowerProducts;

// Export individual products for easy access
export const featuredProducts = realFlowerProducts.filter(product => product.featured);

// Export products by category
export const getProductsByCategory = (category: string) => {
  return realFlowerProducts.filter(product => product.category === category);
};

// Export products by color
export const getProductsByColor = (color: string) => {
  return realFlowerProducts.filter(product => product.color === color);
};

// Export products by type
export const getProductsByType = (type: string) => {
  return realFlowerProducts.filter(product => product.type === type);
};

export default products; 