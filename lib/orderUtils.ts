// Utility functions for order management and display

export interface OrderItem {
  id: string
  quantity: number
  total: number
  productImage?: string  // Image stored directly in order item
  product: {
    id: string
    name: string
    price: number
    image?: string
    images?: string[]
  }
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  totalAmount: number
  status: string
  paymentStatus?: string
  deliveryStatus?: string
  itemsCount: number
  items: OrderItem[]
  createdAt: string
  deliveryAddress: string
  phoneNumber?: string
  paymentMethod?: string
  notes?: string
}

// Validate and clean image URL
const validateImageUrl = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== 'string') return null
  
  // Remove any whitespace and ensure it's a valid URL
  const cleanUrl = url.trim()
  if (!cleanUrl) return null
  
  // Check if it's a valid URL format
  try {
    new URL(cleanUrl)
    return cleanUrl
  } catch {
    // If it's a relative path, make it absolute
    if (cleanUrl.startsWith('/')) {
      return cleanUrl
    }
    return null
  }
}

// Get the primary product image for an order
export const getOrderPrimaryImage = (order: Order): string | null => {
  if (!order.items || order.items.length === 0) {
    return null
  }
  
  const firstItem = order.items[0]
  
  // Check for productImage stored directly in order item (from database)
  const productImage = validateImageUrl(firstItem.productImage)
  if (productImage) {
    return productImage
  }
  
  if (!firstItem.product) {
    return null
  }
  
  // Try to get the first image from images array
  if (firstItem.product.images && Array.isArray(firstItem.product.images)) {
    for (const image of firstItem.product.images) {
      const validImage = validateImageUrl(image)
      if (validImage) {
        return validImage
      }
    }
  }
  
  // Fall back to single image property
  return validateImageUrl(firstItem.product.image)
}

// Get product names for display
export const getOrderProductNames = (order: Order): string => {
  if (!order.items || order.items.length === 0) return 'No items'
  
  if (order.items.length === 1) {
    return order.items[0].product?.name || 'Unknown Product'
  }
  
  if (order.items.length === 2) {
    const names = order.items.map(item => item.product?.name || 'Unknown').join(' & ')
    return names
  }
  
  const firstName = order.items[0].product?.name || 'Unknown'
  return `${firstName} +${order.items.length - 1} more`
}

// Get all product images for an order (for email templates)
export const getOrderAllImages = (order: Order): string[] => {
  if (!order.items || order.items.length === 0) return []
  
  const images: string[] = []
  
  order.items.forEach(item => {
    // Check for productImage stored directly in order item first
    const productImage = validateImageUrl(item.productImage)
    if (productImage) {
      images.push(productImage)
    } else if (item.product) {
      if (item.product.images && Array.isArray(item.product.images)) {
        item.product.images.forEach(image => {
          const validImage = validateImageUrl(image)
          if (validImage) {
            images.push(validImage)
          }
        })
      } else {
        const singleImage = validateImageUrl(item.product.image)
        if (singleImage) {
          images.push(singleImage)
        }
      }
    }
  })
  
  return images
}

// Get the best available image for a specific order item
export const getOrderItemImage = (item: OrderItem): string | null => {
  // Check for productImage stored directly in order item first
  const productImage = validateImageUrl(item.productImage)
  if (productImage) {
    return productImage
  }
  
  if (!item.product) {
    return null
  }
  
  // Try to get the first image from images array
  if (item.product.images && Array.isArray(item.product.images)) {
    for (const image of item.product.images) {
      const validImage = validateImageUrl(image)
      if (validImage) {
        return validImage
      }
    }
  }
  
  // Fall back to single image property
  return validateImageUrl(item.product.image)
}

// Generate email-friendly product summary
export const getOrderProductSummary = (order: Order): {
  primaryImage: string | null
  productNames: string
  allImages: string[]
  itemCount: number
  totalValue: number
} => {
  return {
    primaryImage: getOrderPrimaryImage(order),
    productNames: getOrderProductNames(order),
    allImages: getOrderAllImages(order),
    itemCount: order.itemsCount || order.items?.length || 0,
    totalValue: order.totalAmount || 0
  }
}

// Format order for email display
export const formatOrderForEmail = (order: Order) => {
  const summary = getOrderProductSummary(order)
  
  return {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
    deliveryAddress: order.deliveryAddress,
    ...summary,
    items: order.items.map(item => ({
      name: item.product?.name || 'Unknown Product',
      quantity: item.quantity,
      price: item.product?.price || 0,
      total: item.total,
      image: item.product?.image || item.product?.images?.[0] || null
    }))
  }
}
