import { flowerCategories, perfumeCategories } from './categories'

export interface CategoryProductMapping {
  categoryId: string
  categoryName: string
  categoryType: 'flowers' | 'perfumes'
  productIds: string[]
  keywords: string[]
  description: string
}

// Map flower products to specific categories based on occasion and type
export const flowerCategoryMappings: CategoryProductMapping[] = [
  {
    categoryId: 'wedding',
    categoryName: 'Wedding',
    categoryType: 'flowers',
    productIds: [],
    keywords: ['wedding', 'bridal', 'ceremony', 'reception', 'bouquet', 'white', 'pink', 'elegant'],
    description: 'Elegant floral arrangements for your special day'
  },
  {
    categoryId: 'funerals',
    categoryName: 'Funerals',
    categoryType: 'flowers',
    productIds: [],
    keywords: ['funeral', 'sympathy', 'memorial', 'peaceful', 'white', 'lily', 'respectful'],
    description: 'Respectful and beautiful arrangements for remembrance'
  },
  {
    categoryId: 'graduation',
    categoryName: 'Graduation',
    categoryType: 'flowers',
    productIds: [],
    keywords: ['graduation', 'achievement', 'congratulations', 'yellow', 'sunflower', 'bright', 'celebration'],
    description: 'Celebrate academic achievements with beautiful flowers'
  },
  {
    categoryId: 'mothers-day',
    categoryName: 'Mother\'s Day',
    categoryType: 'flowers',
    productIds: [],
    keywords: ['mother', 'mom', 'pink', 'rose', 'love', 'appreciation', 'gift'],
    description: 'Show your love with special Mother\'s Day arrangements'
  },
  {
    categoryId: 'anniversary',
    categoryName: 'Anniversary',
    categoryType: 'flowers',
    productIds: [],
    keywords: ['anniversary', 'romantic', 'love', 'red', 'rose', 'celebration', 'couple'],
    description: 'Romantic flowers to celebrate your love story'
  },
  {
    categoryId: 'birthday',
    categoryName: 'Birthday',
    categoryType: 'flowers',
    productIds: [],
    keywords: ['birthday', 'celebration', 'mixed', 'colorful', 'cheerful', 'gift', 'party'],
    description: 'Bright and cheerful flowers for birthday celebrations'
  },
  {
    categoryId: 'valentine',
    categoryName: 'Valentine',
    categoryType: 'flowers',
    productIds: [],
    keywords: ['valentine', 'love', 'romantic', 'red', 'rose', 'heart', 'romance'],
    description: 'Express your love with romantic Valentine\'s flowers'
  },
  {
    categoryId: 'date',
    categoryName: 'Date Night',
    categoryType: 'flowers',
    productIds: [],
    keywords: ['date', 'romantic', 'evening', 'elegant', 'pink', 'rose', 'intimate'],
    description: 'Perfect flowers for romantic evenings and dates'
  },
  {
    categoryId: 'engagement',
    categoryName: 'Engagement',
    categoryType: 'flowers',
    productIds: [],
    keywords: ['engagement', 'proposal', 'celebration', 'pink', 'rose', 'special', 'moment'],
    description: 'Celebrate your engagement with stunning floral arrangements'
  },
  {
    categoryId: 'airport-pickup',
    categoryName: 'Airport Pick Up',
    categoryType: 'flowers',
    productIds: [],
    keywords: ['airport', 'welcome', 'travel', 'mixed', 'bouquet', 'arrival', 'greeting'],
    description: 'Welcome your loved ones with beautiful flowers at the airport'
  }
]

// Map perfume products to specific categories based on scent and usage
export const perfumeCategoryMappings: CategoryProductMapping[] = [
  {
    categoryId: 'date',
    categoryName: 'Date',
    categoryType: 'perfumes',
    productIds: [],
    keywords: ['date', 'romantic', 'evening', 'seductive', 'romantic', 'special', 'moment'],
    description: 'Seductive and romantic fragrances for special moments'
  },
  {
    categoryId: 'male',
    categoryName: 'Male',
    categoryType: 'perfumes',
    productIds: [],
    keywords: ['male', 'men', 'masculine', 'gentleman', 'professional', 'confidence'],
    description: 'Masculine fragrances for the modern gentleman'
  },
  {
    categoryId: 'female',
    categoryName: 'Female',
    categoryType: 'perfumes',
    productIds: [],
    keywords: ['female', 'women', 'feminine', 'elegant', 'beautiful', 'graceful'],
    description: 'Elegant and feminine fragrances for women'
  },
  {
    categoryId: 'strong-scent',
    categoryName: 'Strong Scent',
    categoryType: 'perfumes',
    productIds: [],
    keywords: ['strong', 'bold', 'powerful', 'intense', 'statement', 'evening', 'dramatic'],
    description: 'Bold and powerful fragrances that make a statement'
  },
  {
    categoryId: 'soft-scent',
    categoryName: 'Soft Scent',
    categoryType: 'perfumes',
    productIds: [],
    keywords: ['soft', 'gentle', 'subtle', 'light', 'delicate', 'everyday', 'office'],
    description: 'Gentle and subtle fragrances for everyday wear'
  },
  {
    categoryId: 'casual-everyday',
    categoryName: 'Casual/Everyday Wear',
    categoryType: 'perfumes',
    productIds: [],
    keywords: ['casual', 'everyday', 'daily', 'fresh', 'clean', 'comfortable', 'light'],
    description: 'Light and refreshing scents for daily wear'
  },
  {
    categoryId: 'special-occasions',
    categoryName: 'Special Occasions',
    categoryType: 'perfumes',
    keywords: ['special', 'occasion', 'premium', 'luxury', 'celebration', 'party', 'event'],
    productIds: [],
    description: 'Premium fragrances for weddings, parties, and celebrations'
  }
]

// Helper function to find which category a product belongs to
export const findProductCategories = (product: any): string[] => {
  const categories: string[] = []
  
  // Check flower categories
  flowerCategoryMappings.forEach(mapping => {
    const matches = mapping.keywords.some(keyword => 
      product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      product.description?.toLowerCase().includes(keyword.toLowerCase()) ||
      product.type?.toLowerCase().includes(keyword.toLowerCase()) ||
      product.color?.toLowerCase().includes(keyword.toLowerCase())
    )
    
    if (matches) {
      categories.push(mapping.categoryId)
    }
  })
  
  // Check perfume categories
  perfumeCategoryMappings.forEach(mapping => {
    const matches = mapping.keywords.some(keyword => 
      product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      product.description?.toLowerCase().includes(keyword.toLowerCase()) ||
      product.type?.toLowerCase().includes(keyword.toLowerCase()) ||
      product.brand?.toLowerCase().includes(keyword.toLowerCase())
    )
    
    if (matches) {
      categories.push(mapping.categoryId)
    }
  })
  
  return categories
}

// Helper function to get category details by ID
export const getCategoryMappingById = (categoryId: string): CategoryProductMapping | undefined => {
  return [...flowerCategoryMappings, ...perfumeCategoryMappings]
    .find(mapping => mapping.categoryId === categoryId)
}

// Helper function to get all category mappings
export const getAllCategoryMappings = (): CategoryProductMapping[] => {
  return [...flowerCategoryMappings, ...perfumeCategoryMappings]
}

export default {
  flowerCategoryMappings,
  perfumeCategoryMappings,
  findProductCategories,
  getCategoryMappingById,
  getAllCategoryMappings
}
