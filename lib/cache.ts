// Caching system for API responses and data

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL: number = 5 * 60 * 1000 // 5 minutes

  constructor() {
    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanup()
    }, 60 * 1000)
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    }
    this.cache.set(key, entry)
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return false
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Cache key generators
  static generateKey(prefix: string, ...params: (string | number)[]): string {
    return `${prefix}:${params.join(':')}`
  }

  // Predefined cache keys
  static keys = {
    PRODUCTS: (filters?: any) => CacheManager.generateKey('products', JSON.stringify(filters || {})),
    PRODUCT: (id: string) => CacheManager.generateKey('product', id),
    CATEGORIES: () => CacheManager.generateKey('categories'),
    CATEGORY: (id: string) => CacheManager.generateKey('category', id),
    ORDERS: (userId?: string, filters?: any) => CacheManager.generateKey('orders', userId || 'all', JSON.stringify(filters || {})),
    ORDER: (id: string) => CacheManager.generateKey('order', id),
    USER: (id: string) => CacheManager.generateKey('user', id),
    ANALYTICS: (type: string) => CacheManager.generateKey('analytics', type)
  }

  // Cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Create singleton instance
export const cache = new CacheManager()

// Cache decorator for functions
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args)
    
    // Try to get from cache first
    const cached = cache.get(key)
    if (cached !== null) {
      return cached
    }

    // Execute function and cache result
    const result = await fn(...args)
    cache.set(key, result, ttl)
    
    return result
  }) as T
}

// Cache middleware for Express routes
export const cacheMiddleware = (ttl?: number, keyGenerator?: (req: any) => string) => {
  return (req: any, res: any, next: any) => {
    const key = keyGenerator ? keyGenerator(req) : `route:${req.method}:${req.originalUrl}`
    
    // Try to get from cache
    const cached = cache.get(key)
    if (cached !== null) {
      return res.json(cached)
    }

    // Store original res.json
    const originalJson = res.json.bind(res)
    
    // Override res.json to cache the response
    res.json = (data: any) => {
      cache.set(key, data, ttl)
      return originalJson(data)
    }

    next()
  }
}

// Cache invalidation helpers
export const invalidateCache = {
  products: () => {
    const stats = cache.getStats()
    stats.keys.forEach(key => {
      if (key.startsWith('products:') || key.startsWith('product:')) {
        cache.delete(key)
      }
    })
  },
  
  categories: () => {
    const stats = cache.getStats()
    stats.keys.forEach(key => {
      if (key.startsWith('categories:') || key.startsWith('category:')) {
        cache.delete(key)
      }
    })
  },
  
  orders: () => {
    const stats = cache.getStats()
    stats.keys.forEach(key => {
      if (key.startsWith('orders:') || key.startsWith('order:')) {
        cache.delete(key)
      }
    })
  },
  
  user: (userId: string) => {
    cache.delete(CacheManager.keys.USER(userId))
  },
  
  all: () => {
    cache.clear()
  }
}
