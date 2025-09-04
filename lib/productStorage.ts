// Simple product data for SSR compatibility
import { findProductCategories, getCategoryMappingById } from '@/data/category-product-mapping'

const basicProducts: Product[] = [
  // Original products with enhanced category assignments
  {
    id: '1',
    name: 'Red Roses Bouquet',
    type: 'rose',
    color: 'red',
    brand: 'Akazuba Florist',
    description: 'Beautiful red roses perfect for romantic occasions',
    price: 25000,
    salePrice: null,
    stockQuantity: 50,
    images: ['/images/flowers/roses/red-roses-1.jpg'],
    categoryName: 'Flowers',
    size: '30cm x 20cm',
    isActive: true,
    isFeatured: true,
    sku: 'FLW-RED-001',
    weight: 0.5,
    tags: ['rose', 'red', 'romantic', 'bouquet'],
    categoryIds: ['valentine', 'anniversary', 'date']
  },
  {
    id: '2',
    name: 'Pink Tulips',
    type: 'tulip',
    color: 'pink',
    brand: 'Akazuba Florist',
    description: 'Fresh pink tulips for spring celebrations',
    price: 18000,
    salePrice: null,
    stockQuantity: 30,
    images: ['/images/flowers/tulips/pink-tulips-1.jpg'],
    categoryName: 'Flowers',
    size: '25cm x 15cm',
    isActive: true,
    isFeatured: true,
    sku: 'FLW-PINK-002',
    weight: 0.3,
    tags: ['tulip', 'pink', 'spring', 'fresh'],
    categoryIds: ['birthday', 'mothers-day', 'date']
  },
  {
    id: '3',
    name: 'White Lily Arrangement',
    type: 'lily',
    color: 'white',
    brand: 'Akazuba Florist',
    description: 'Elegant white lilies for special occasions',
    price: 35000,
    salePrice: null,
    stockQuantity: 25,
    images: ['/images/flowers/lilies/white-lilies-1.jpg'],
    categoryName: 'Flowers',
    size: '35cm x 25cm',
    isActive: true,
    isFeatured: false,
    sku: 'FLW-WHITE-003',
    weight: 0.4,
    tags: ['lily', 'white', 'elegant', 'special'],
    categoryIds: ['wedding', 'funerals', 'special-occasions']
  },
  {
    id: '4',
    name: 'Luxury Perfume Set',
    type: 'perfume',
    color: 'clear',
    brand: 'Akazuba Perfumes',
    description: 'Premium fragrance collection for discerning customers',
    price: 150000,
    salePrice: 120000,
    stockQuantity: 15,
    images: ['/images/perfumes/luxury-set-1.jpg'],
    categoryName: 'Perfumes',
    size: '100ml',
    concentration: 'EDP',
    isActive: true,
    isFeatured: true,
    sku: 'PERF-LUX-004',
    weight: 0.2,
    tags: ['perfume', 'luxury', 'premium', 'fragrance'],
    categoryIds: ['special-occasions', 'female', 'strong-scent']
  },

  // New Wedding Flowers
  {
    id: '5',
    name: 'Bridal White Rose Bouquet',
    type: 'rose',
    color: 'white',
    brand: 'Akazuba Florist',
    description: 'Stunning white roses perfect for bridal bouquets and wedding ceremonies',
    price: 45000,
    salePrice: null,
    stockQuantity: 20,
    images: ['/images/flowers/white/white-1.jpg'],
    categoryName: 'Flowers',
    size: '40cm x 25cm',
    isActive: true,
    isFeatured: true,
    sku: 'FLW-WED-005',
    weight: 0.6,
    tags: ['rose', 'white', 'bridal', 'wedding', 'elegant'],
    categoryIds: ['wedding', 'engagement', 'special-occasions']
  },
  {
    id: '6',
    name: 'Pink Peony Wedding Arrangement',
    type: 'peony',
    color: 'pink',
    brand: 'Akazuba Florist',
    description: 'Romantic pink peonies for wedding receptions and bridal parties',
    price: 52000,
    salePrice: null,
    stockQuantity: 15,
    images: ['/images/flowers/pink/pink-1.jpg'],
    categoryName: 'Flowers',
    size: '35cm x 30cm',
    isActive: true,
    isFeatured: true,
    sku: 'FLW-WED-006',
    weight: 0.7,
    tags: ['peony', 'pink', 'wedding', 'romantic', 'reception'],
    categoryIds: ['wedding', 'engagement', 'date']
  },

  // Valentine's Day Flowers
  {
    id: '7',
    name: 'Red Rose Heart Arrangement',
    type: 'rose',
    color: 'red',
    brand: 'Akazuba Florist',
    description: 'Romantic red roses arranged in a heart shape for Valentine\'s Day',
    price: 38000,
    salePrice: 32000,
    stockQuantity: 35,
    images: ['/images/flowers/red/red-1.jpg'],
    categoryName: 'Flowers',
    size: '30cm x 25cm',
    isActive: true,
    isFeatured: true,
    sku: 'FLW-VAL-007',
    weight: 0.5,
    tags: ['rose', 'red', 'valentine', 'heart', 'romantic'],
    categoryIds: ['valentine', 'date', 'anniversary']
  },

  // Mother's Day Flowers
  {
    id: '8',
    name: 'Pink Carnation Bouquet',
    type: 'carnation',
    color: 'pink',
    brand: 'Akazuba Florist',
    description: 'Beautiful pink carnations symbolizing motherly love and appreciation',
    price: 22000,
    salePrice: null,
    stockQuantity: 40,
    images: ['/images/flowers/pink/pink-2.jpg'],
    categoryName: 'Flowers',
    size: '25cm x 20cm',
    isActive: true,
    isFeatured: false,
    sku: 'FLW-MOM-008',
    weight: 0.4,
    tags: ['carnation', 'pink', 'mother', 'appreciation', 'love'],
    categoryIds: ['mothers-day', 'birthday', 'date']
  },

  // Birthday Flowers
  {
    id: '9',
    name: 'Mixed Color Birthday Bouquet',
    type: 'mixed',
    color: 'mixed',
    brand: 'Akazuba Florist',
    description: 'Colorful mixed flowers perfect for birthday celebrations and parties',
    price: 28000,
    salePrice: null,
    stockQuantity: 30,
    images: ['/images/flowers/mixed/mixed-1.jpg'],
    categoryName: 'Flowers',
    size: '30cm x 25cm',
    isActive: true,
    isFeatured: false,
    sku: 'FLW-BDAY-009',
    weight: 0.5,
    tags: ['mixed', 'colorful', 'birthday', 'celebration', 'cheerful'],
    categoryIds: ['birthday', 'airport-pickup', 'special-occasions']
  },

  // Graduation Flowers
  {
    id: '10',
    name: 'Yellow Sunflower Bundle',
    type: 'sunflower',
    color: 'yellow',
    brand: 'Akazuba Florist',
    description: 'Bright yellow sunflowers symbolizing achievement and success',
    price: 24000,
    salePrice: null,
    stockQuantity: 25,
    images: ['/images/flowers/yellow/yellow-1.jpg'],
    categoryName: 'Flowers',
    size: '35cm x 20cm',
    isActive: true,
    isFeatured: false,
    sku: 'FLW-GRAD-010',
    weight: 0.6,
    tags: ['sunflower', 'yellow', 'graduation', 'achievement', 'bright'],
    categoryIds: ['graduation', 'birthday', 'special-occasions']
  },

  // Anniversary Flowers
  {
    id: '11',
    name: 'Red and Pink Rose Duo',
    type: 'rose',
    color: 'mixed',
    brand: 'Akazuba Florist',
    description: 'Romantic combination of red and pink roses for anniversary celebrations',
    price: 42000,
    salePrice: null,
    stockQuantity: 20,
    images: ['/images/flowers/mixed/mixed-2.jpg'],
    categoryName: 'Flowers',
    size: '35cm x 25cm',
    isActive: true,
    isFeatured: true,
    sku: 'FLW-ANN-011',
    weight: 0.6,
    tags: ['rose', 'mixed', 'anniversary', 'romantic', 'couple'],
    categoryIds: ['anniversary', 'valentine', 'date']
  },

  // Airport Pickup Flowers
  {
    id: '12',
    name: 'Welcome Home Mixed Bouquet',
    type: 'mixed',
    color: 'mixed',
    brand: 'Akazuba Florist',
    description: 'Welcoming mixed flowers perfect for airport pickups and homecomings',
    price: 26000,
    salePrice: null,
    stockQuantity: 35,
    images: ['/images/flowers/mixed/mixed-3.jpg'],
    categoryName: 'Flowers',
    size: '30cm x 20cm',
    isActive: true,
    isFeatured: false,
    sku: 'FLW-AIR-012',
    weight: 0.5,
    tags: ['mixed', 'welcome', 'airport', 'homecoming', 'travel'],
    categoryIds: ['airport-pickup', 'birthday', 'special-occasions']
  },

  // New Perfume Products
  {
    id: '13',
    name: 'Masculine Confidence Cologne',
    type: 'cologne',
    color: 'clear',
    brand: 'Akazuba Perfumes',
    description: 'Bold and confident masculine fragrance for the modern gentleman',
    price: 85000,
    salePrice: null,
    stockQuantity: 25,
    images: ['/images/perfumes/perfume-2.jpg'],
    categoryName: 'Perfumes',
    size: '75ml',
    concentration: 'EDT',
    isActive: true,
    isFeatured: true,
    sku: 'PERF-MALE-013',
    weight: 0.15,
    tags: ['cologne', 'masculine', 'confidence', 'professional'],
    categoryIds: ['male', 'strong-scent', 'special-occasions']
  },
  {
    id: '14',
    name: 'Feminine Elegance Perfume',
    type: 'perfume',
    color: 'clear',
    brand: 'Akazuba Perfumes',
    description: 'Elegant and feminine fragrance for the sophisticated woman',
    price: 95000,
    salePrice: null,
    stockQuantity: 20,
    images: ['/images/perfumes/perfume-3.png'],
    categoryName: 'Perfumes',
    size: '50ml',
    concentration: 'EDP',
    isActive: true,
    isFeatured: true,
    sku: 'PERF-FEM-014',
    weight: 0.12,
    tags: ['perfume', 'feminine', 'elegant', 'sophisticated'],
    categoryIds: ['female', 'strong-scent', 'date']
  },
  {
    id: '15',
    name: 'Light Daily Freshness',
    type: 'perfume',
    color: 'clear',
    brand: 'Akazuba Perfumes',
    description: 'Light and refreshing scent perfect for everyday wear',
    price: 65000,
    salePrice: null,
    stockQuantity: 30,
    images: ['/images/perfumes/perfume-5.png'],
    categoryName: 'Perfumes',
    size: '100ml',
    concentration: 'EDT',
    isActive: true,
    isFeatured: false,
    sku: 'PERF-DAILY-015',
    weight: 0.18,
    tags: ['perfume', 'light', 'fresh', 'everyday', 'office'],
    categoryIds: ['soft-scent', 'casual-everyday', 'female']
  },
  {
    id: '16',
    name: 'Evening Romance Perfume',
    type: 'perfume',
    color: 'clear',
    brand: 'Akazuba Perfumes',
    description: 'Seductive and romantic fragrance for special evenings and dates',
    price: 110000,
    salePrice: null,
    stockQuantity: 18,
    images: ['/images/perfumes/perfume-1.jpg'],
    categoryName: 'Perfumes',
    size: '50ml',
    concentration: 'EDP',
    isActive: true,
    isFeatured: true,
    sku: 'PERF-DATE-016',
    weight: 0.12,
    tags: ['perfume', 'romantic', 'evening', 'seductive', 'date'],
    categoryIds: ['date', 'strong-scent', 'special-occasions']
  }
]

export interface Product {
  id: string
  name: string
  type: string
  color: string
  brand: string
  description: string
  price: number
  salePrice: number | null
  stockQuantity: number
  images: string[]
  categoryName: string
  size?: string
  concentration?: string
  isActive: boolean
  isFeatured: boolean
  sku?: string
  weight?: number
  tags?: string[]
  categoryIds?: string[] // New field for specific category IDs
}

const STORAGE_KEYS = {
  PRODUCTS: 'akazuba_products',
  FLOWERS: 'akazuba_flowers',
  PERFUMES: 'akazuba_perfumes'
}

// Helper function to check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

class ProductStorage {
  private products: Product[] = []
  private flowers: Product[] = []
  private perfumes: Product[] = []

  constructor() {
    this.initializeProducts()
  }

  private initializeProducts() {
    try {
      // Try to load from storage first
      this.loadFromStorage(STORAGE_KEYS.PRODUCTS)
      this.loadFromStorage(STORAGE_KEYS.FLOWERS)
      this.loadFromStorage(STORAGE_KEYS.PERFUMES)

      // If no stored data, initialize from source
      if (this.products.length === 0) {
        this.initializeFromSource()
      }
    } catch (error) {
      console.warn('⚠️ Storage initialization failed, using source data:', error)
      this.initializeFromSource()
    }
  }

  private initializeFromSource() {
    try {
      // Use basic products data
      this.products = [...basicProducts]
      this.flowers = basicProducts.filter(p => p.categoryName === 'Flowers')
      this.perfumes = basicProducts.filter(p => p.categoryName === 'Perfumes')

      // Try to save to storage (only if localStorage is available)
      if (isLocalStorageAvailable()) {
        this.saveToStorage()
      }
      
      console.log('📦 Initialized products from source data')
    } catch (error) {
      console.error('❌ Failed to initialize from source:', error)
      // Set empty arrays as fallback
      this.products = []
      this.flowers = []
      this.perfumes = []
    }
  }

  private loadFromStorage(key: string): any {
    if (!isLocalStorageAvailable()) {
      console.warn(`⚠️ localStorage not available, skipping load for ${key}`)
      return null
    }

    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const data = JSON.parse(stored)
        switch (key) {
          case STORAGE_KEYS.PRODUCTS:
            this.products = data
            break
          case STORAGE_KEYS.FLOWERS:
            this.flowers = data
            break
          case STORAGE_KEYS.PERFUMES:
            this.perfumes = data
            break
        }
        return data
      }
    } catch (error) {
      console.error(`❌ Error loading from storage (${key}):`, error)
    }
    return null
  }

  private saveToStorage() {
    if (!isLocalStorageAvailable()) {
      console.warn('⚠️ localStorage not available, skipping save')
      return
    }

    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products))
      localStorage.setItem(STORAGE_KEYS.FLOWERS, JSON.stringify(this.flowers))
      localStorage.setItem(STORAGE_KEYS.PERFUMES, JSON.stringify(this.perfumes))
    } catch (error) {
      console.error('❌ Error saving to storage:', error)
    }
  }

  // Public methods
  getAllProducts(): Product[] {
    return [...this.products]
  }

  getFlowerProducts(): Product[] {
    return [...this.flowers]
  }

  getPerfumeProducts(): Product[] {
    return [...this.perfumes]
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(product => 
      product.categoryName.toLowerCase() === category.toLowerCase()
    )
  }

  getFeaturedProducts(): Product[] {
    return this.products.filter(product => product.isFeatured)
  }

  getActiveProducts(): Product[] {
    return this.products.filter(product => product.isActive)
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...product,
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    this.products.push(newProduct)
    
    // Update category-specific arrays
    if (newProduct.categoryName === 'Flowers') {
      this.flowers.push(newProduct)
    } else if (newProduct.categoryName === 'Perfumes') {
      this.perfumes.push(newProduct)
    }

    // Save to storage
    this.saveToStorage()
    
    // Trigger storage change event
    this.triggerStorageChange()
    
    return newProduct
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const productIndex = this.products.findIndex(p => p.id === id)
    if (productIndex === -1) return null

    const updatedProduct = { ...this.products[productIndex], ...updates }
    this.products[productIndex] = updatedProduct

    // Update category-specific arrays
    const flowerIndex = this.flowers.findIndex(p => p.id === id)
    if (flowerIndex !== -1) {
      this.flowers[flowerIndex] = updatedProduct
    }

    const perfumeIndex = this.perfumes.findIndex(p => p.id === id)
    if (perfumeIndex !== -1) {
      this.perfumes[perfumeIndex] = updatedProduct
    }

    // Save to storage
    this.saveToStorage()
    
    // Trigger storage change event
    this.triggerStorageChange()
    
    return updatedProduct
  }

  deleteProduct(id: string): boolean {
    const productIndex = this.products.findIndex(p => p.id === id)
    if (productIndex === -1) return false

    this.products.splice(productIndex, 1)

    // Remove from category-specific arrays
    const flowerIndex = this.flowers.findIndex(p => p.id === id)
    if (flowerIndex !== -1) {
      this.flowers.splice(flowerIndex, 1)
    }

    const perfumeIndex = this.perfumes.findIndex(p => p.id === id)
    if (perfumeIndex !== -1) {
      this.perfumes.splice(perfumeIndex, 1)
    }

    // Save to storage
    this.saveToStorage()
    
    // Trigger storage change event
    this.triggerStorageChange()
    
    return true
  }

  bulkOperation(operation: 'delete' | 'update', productIds: string[], updates?: Partial<Product>): boolean {
    try {
      switch (operation) {
        case 'delete':
          productIds.forEach(id => this.deleteProduct(id))
          break
        case 'update':
          if (updates) {
            productIds.forEach(id => this.updateProduct(id, updates))
          }
          break
      }
      return true
    } catch (error) {
      console.error('❌ Bulk operation failed:', error)
      return false
    }
  }

  searchProducts(query: string): Product[] {
    if (!query.trim()) return this.products

    const searchTerms = query.toLowerCase().split(' ')
    return this.products.filter(product => {
      const searchableText = [
        product.name,
        product.type,
        product.color,
        product.description,
        product.brand,
        product.categoryName
      ].join(' ').toLowerCase()

      return searchTerms.some(term => searchableText.includes(term))
    })
  }

  getProductById(id: string): Product | null {
    return this.products.find(product => product.id === id) || null
  }

  clearStorage(): void {
    this.products = []
    this.flowers = []
    this.perfumes = []
    
    if (isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS)
        localStorage.removeItem(STORAGE_KEYS.FLOWERS)
        localStorage.removeItem(STORAGE_KEYS.PERFUMES)
      } catch (error) {
        console.error('❌ Error clearing storage:', error)
      }
    }
  }

  getStorageStats() {
    return {
      totalProducts: this.products.length,
      flowers: this.flowers.length,
      perfumes: this.perfumes.length,
      activeProducts: this.getActiveProducts().length,
      featuredProducts: this.getFeaturedProducts().length
    }
  }

  onStorageChange(callback: (products: Product[]) => void) {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEYS.PRODUCTS) {
          try {
            const newProducts = JSON.parse(e.newValue || '[]')
            callback(newProducts)
          } catch (error) {
            console.error('❌ Error parsing storage change:', error)
          }
        }
      })
    }
  }

  private triggerStorageChange() {
    if (typeof window !== 'undefined') {
      // Dispatch custom event for cross-tab synchronization
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEYS.PRODUCTS,
        newValue: JSON.stringify(this.products),
        oldValue: null,
        storageArea: localStorage
      }))
    }
  }
}

// Create singleton instance only on client side
let productStorageInstance: ProductStorage | null = null

const getProductStorage = (): ProductStorage => {
  if (typeof window === 'undefined') {
    // Server-side: return a mock instance with basic data
    return {
      getAllProducts: () => [...basicProducts],
      getFlowerProducts: () => basicProducts.filter(p => p.categoryName === 'Flowers'),
      getPerfumeProducts: () => basicProducts.filter(p => p.categoryName === 'Perfumes'),
      getProductsByCategory: (category: string) => {
        return basicProducts.filter(product => 
          product.categoryName.toLowerCase() === category.toLowerCase()
        )
      },
      getFeaturedProducts: () => {
        return basicProducts.filter(product => product.isFeatured)
      },
      getActiveProducts: () => {
        return basicProducts.filter(product => product.isActive)
      },
      addProduct: () => { throw new Error('Cannot add products on server side') },
      updateProduct: () => { throw new Error('Cannot update products on server side') },
      deleteProduct: () => { throw new Error('Cannot delete products on server side') },
      bulkOperation: () => { throw new Error('Cannot perform bulk operations on server side') },
      searchProducts: (query: string) => {
        if (!query.trim()) return [...basicProducts]
        
        const searchTerms = query.toLowerCase().split(' ')
        return basicProducts.filter(product => {
          const searchableText = [
            product.name,
            product.type,
            product.color,
            product.description,
            product.brand,
            product.categoryName
          ].join(' ').toLowerCase()
          
          return searchTerms.some(term => searchableText.includes(term))
        })
      },
      getProductById: (id: string) => {
        return basicProducts.find(product => product.id === id) || null
      },
      clearStorage: () => {},
      getStorageStats: () => ({
        totalProducts: basicProducts.length,
        flowers: basicProducts.filter(p => p.categoryName === 'Flowers').length,
        perfumes: basicProducts.filter(p => p.categoryName === 'Perfumes').length,
        activeProducts: basicProducts.filter(p => p.isActive).length,
        featuredProducts: basicProducts.filter(p => p.isFeatured).length
      }),
      onStorageChange: () => {}
    } as unknown as ProductStorage
  }

  // Client-side: create or return existing instance
  if (!productStorageInstance) {
    productStorageInstance = new ProductStorage()
  }
  return productStorageInstance
}

export const productStorage = getProductStorage()
export { STORAGE_KEYS }
